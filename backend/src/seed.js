require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("./db/pool");
const { predictBatch } = require("./services/mlService");

const sparkDir = process.env.SPARK_DIR || path.join(__dirname, "../../spark");
const CSV_PATH = process.env.CSV_PATH || path.join(sparkDir, "data/creditcard.csv");
const BATCH_SIZE = 500;

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row = {};
    headers.forEach((h, idx) => {
      // Strip quotes from values before parsing
      const cleanValue = values[idx] ? values[idx].replace(/"/g, "").trim() : "";
      row[h] = parseFloat(cleanValue);
    });
    rows.push(row);
  }
  return rows;
}

async function seed() {
  console.log("[Seed] Loading CSV...");
  const rows = parseCSV(CSV_PATH);
  console.log(`[Seed] Loaded ${rows.length} rows`);

  const schema = fs.readFileSync(path.join(__dirname, "db/schema.sql"), "utf-8");
  await pool.query("DROP TABLE IF EXISTS transactions CASCADE");
  await pool.query(schema);
  console.log("[Seed] Schema reset");

  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const featuresList = batch.map((row) => {
      const features = [];
      for (let v = 1; v <= 28; v++) features.push(row[`V${v}`]);
      features.push(row.Amount);
      return features;
    });

    let predictions;
    try {
      predictions = await predictBatch(featuresList);
    } catch {
      predictions = batch.map(() => ({
        prediction: null,
        fraud_probability: null,
        risk_level: null,
      }));
    }

    const values = [];
    const placeholders = [];
    let paramIdx = 1;

    batch.forEach((row, idx) => {
      const pred = predictions[idx] || {};
      const ph = [];
      for (let v = 1; v <= 28; v++) {
        const val = row[`V${v}`];
        values.push(isNaN(val) ? null : val);
        ph.push(`$${paramIdx++}`);
      }
      const amount = isNaN(row.Amount) ? 0 : row.Amount;
      const time = isNaN(row.Time) ? 0 : row.Time;
      const actualClass = isNaN(row.Class) ? null : row.Class;
      const predictedClass = pred.prediction != null && !isNaN(pred.prediction) ? pred.prediction : null;
      const fraudProb = pred.fraud_probability != null && !isNaN(pred.fraud_probability) ? pred.fraud_probability : null;
      const riskLevel = pred.risk_level || null;
      
      values.push(amount, time, actualClass, predictedClass, fraudProb, riskLevel);
      ph.push(`$${paramIdx++}`, `$${paramIdx++}`, `$${paramIdx++}`, `$${paramIdx++}`, `$${paramIdx++}`, `$${paramIdx++}`);
      placeholders.push(`(${ph.join(",")})`);
    });

    await pool.query(
      `INSERT INTO transactions (
        v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,
        v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,
        v21,v22,v23,v24,v25,v26,v27,v28,
        amount, time_elapsed, actual_class, predicted_class, fraud_probability, risk_level
      ) VALUES ${placeholders.join(",")}`,
      values
    );

    inserted += batch.length;
    if (inserted % 5000 === 0) {
      console.log(`[Seed] Inserted ${inserted}/${rows.length}`);
    }
  }

  console.log(`[Seed] Done! Total inserted: ${inserted}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("[Seed] Error:", err);
  process.exit(1);
});
