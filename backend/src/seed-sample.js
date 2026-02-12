/**
 * Seed Sample Data for Production
 * Creates sample transactions for demo purposes
 */

const pool = require("./db/pool");

const SAMPLE_SIZE = 500;

function generateSampleTransaction(index) {
  // Generate realistic-looking PCA features
  const features = {};
  for (let i = 1; i <= 28; i++) {
    features[`v${i}`] = (Math.random() - 0.5) * 4; // PCA features typically range -2 to 2
  }

  // Determine if fraud (5% fraud rate for demo)
  const isFraud = Math.random() < 0.05;
  
  // Amount: fraud tends to be higher amounts
  const amount = isFraud 
    ? Math.random() * 2000 + 100  // Fraud: $100-$2100
    : Math.random() * 200 + 5;    // Normal: $5-$205

  // Time elapsed (seconds from start)
  const timeElapsed = Math.floor(Math.random() * 172800); // 0-48 hours

  // Adjust V14 and V17 for fraud (these are typically significant features)
  if (isFraud) {
    features.v14 = -3 - Math.random() * 2;
    features.v17 = -3 - Math.random() * 2;
    features.v12 = -2 - Math.random() * 2;
  }

  // Calculate fraud probability based on features
  const fraudScore = Math.abs(features.v14) * 0.3 + Math.abs(features.v17) * 0.25 + 
                     Math.abs(features.v12) * 0.15 + Math.random() * 0.1;
  const fraudProbability = Math.min(0.99, isFraud ? 0.7 + Math.random() * 0.29 : Math.random() * 0.3);
  
  // Risk level
  let riskLevel = 'LOW';
  if (fraudProbability > 0.7) riskLevel = 'HIGH';
  else if (fraudProbability > 0.4) riskLevel = 'MEDIUM';

  return {
    ...features,
    amount: parseFloat(amount.toFixed(2)),
    timeElapsed,
    actualClass: isFraud ? 1 : 0,
    predictedClass: fraudProbability > 0.5 ? 1 : 0,
    fraudProbability: parseFloat(fraudProbability.toFixed(4)),
    riskLevel
  };
}

async function seedSampleData() {
  console.log(`[Seed] Generating ${SAMPLE_SIZE} sample transactions...`);

  const transactions = [];
  for (let i = 0; i < SAMPLE_SIZE; i++) {
    transactions.push(generateSampleTransaction(i));
  }

  console.log("[Seed] Inserting transactions...");

  let inserted = 0;
  for (const tx of transactions) {
    try {
      await pool.query(
        `INSERT INTO transactions 
         (v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, 
          v11, v12, v13, v14, v15, v16, v17, v18, v19, v20,
          v21, v22, v23, v24, v25, v26, v27, v28,
          amount, time_elapsed, actual_class, predicted_class, fraud_probability, risk_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                 $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                 $21, $22, $23, $24, $25, $26, $27, $28,
                 $29, $30, $31, $32, $33, $34)`,
        [
          tx.v1, tx.v2, tx.v3, tx.v4, tx.v5, tx.v6, tx.v7, tx.v8, tx.v9, tx.v10,
          tx.v11, tx.v12, tx.v13, tx.v14, tx.v15, tx.v16, tx.v17, tx.v18, tx.v19, tx.v20,
          tx.v21, tx.v22, tx.v23, tx.v24, tx.v25, tx.v26, tx.v27, tx.v28,
          tx.amount, tx.timeElapsed, tx.actualClass, tx.predictedClass, tx.fraudProbability, tx.riskLevel
        ]
      );
      inserted++;
    } catch (err) {
      console.error(`[Seed] Error inserting transaction:`, err.message);
    }
  }

  console.log(`[Seed] ✅ Inserted ${inserted} sample transactions`);
  
  // Show summary
  const stats = await pool.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE actual_class = 1) as fraud,
      COUNT(*) FILTER (WHERE actual_class = 0) as legitimate
    FROM transactions
  `);
  
  console.log(`[Seed] Summary:`, stats.rows[0]);
  
  process.exit(0);
}

seedSampleData().catch(err => {
  console.error("[Seed] Fatal error:", err);
  process.exit(1);
});
