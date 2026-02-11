require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db/pool");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/predict", require("./routes/predict"));
app.use("/api/stats", require("./routes/stats"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "fraudlens-api" });
});

async function initDB() {
  try {
    const schema = fs.readFileSync(
      path.join(__dirname, "db/schema.sql"),
      "utf-8"
    );
    await pool.query(schema);
    console.log("[DB] Schema initialized");
  } catch (err) {
    console.error("[DB] Schema init failed:", err.message);
  }
}

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[FraudLens API] Running on http://localhost:${PORT}`);
  });
});
