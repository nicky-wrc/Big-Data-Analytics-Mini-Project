const { Router } = require("express");
const pool = require("../db/pool");
const path = require("path");
const fs = require("fs");

const router = Router();

const SPARK_DIR = process.env.SPARK_DIR || path.join(__dirname, "../../../spark");
const MODEL_DIR = process.env.MODEL_DIR || path.join(__dirname, "../../../model");

// Main stats endpoint (for frontend)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_transactions,
        COUNT(*) FILTER (WHERE actual_class = 1) as total_fraud,
        ROUND((COUNT(*) FILTER (WHERE actual_class = 1)::numeric / NULLIF(COUNT(*), 0))::numeric, 6) as fraud_rate,
        ROUND(AVG(amount)::numeric, 2) as avg_amount,
        ROUND(SUM(amount)::numeric, 2) as total_amount,
        COUNT(*) FILTER (WHERE risk_level = 'HIGH') as high_risk_count,
        COUNT(*) FILTER (WHERE risk_level = 'MEDIUM') as medium_risk_count,
        COUNT(*) FILTER (WHERE risk_level = 'LOW') as low_risk_count
      FROM transactions
    `);
    const row = result.rows[0];
    res.json({
      total_transactions: parseInt(row.total_transactions) || 0,
      total_fraud: parseInt(row.total_fraud) || 0,
      fraud_rate: parseFloat(row.fraud_rate) || 0,
      avg_amount: parseFloat(row.avg_amount) || 0,
      total_amount: parseFloat(row.total_amount) || 0,
      high_risk_count: parseInt(row.high_risk_count) || 0,
      medium_risk_count: parseInt(row.medium_risk_count) || 0,
      low_risk_count: parseInt(row.low_risk_count) || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/overview", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_transactions,
        COUNT(*) FILTER (WHERE actual_class = 1) as total_fraud,
        COUNT(*) FILTER (WHERE actual_class = 0) as total_non_fraud,
        ROUND(AVG(amount)::numeric, 2) as avg_amount,
        ROUND(AVG(amount) FILTER (WHERE actual_class = 1)::numeric, 2) as avg_fraud_amount,
        ROUND(AVG(amount) FILTER (WHERE actual_class = 0)::numeric, 2) as avg_non_fraud_amount,
        ROUND((COUNT(*) FILTER (WHERE actual_class = 1)::numeric / NULLIF(COUNT(*), 0) * 100)::numeric, 4) as fraud_rate,
        COUNT(*) FILTER (WHERE risk_level = 'HIGH') as high_risk_count,
        COUNT(*) FILTER (WHERE risk_level = 'MEDIUM') as medium_risk_count,
        COUNT(*) FILTER (WHERE risk_level = 'LOW') as low_risk_count
      FROM transactions
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/amount-distribution", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        CASE
          WHEN amount < 10 THEN '0-10'
          WHEN amount < 50 THEN '10-50'
          WHEN amount < 100 THEN '50-100'
          WHEN amount < 500 THEN '100-500'
          WHEN amount < 1000 THEN '500-1000'
          ELSE '1000+'
        END as range,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE actual_class = 1) as fraud_count
      FROM transactions
      GROUP BY 1
      ORDER BY MIN(amount)
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/risk-distribution", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT risk_level, COUNT(*) as count
      FROM transactions
      WHERE risk_level IS NOT NULL
      GROUP BY risk_level
      ORDER BY
        CASE risk_level
          WHEN 'HIGH' THEN 1
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 3
        END
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/model-info", async (req, res) => {
  try {
    const metaPath = path.join(MODEL_DIR, "model_meta.json");
    if (!fs.existsSync(metaPath)) {
      return res.status(404).json({ error: "Model metadata not found" });
    }
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    const compPath = path.join(SPARK_DIR, "output/model/model_comparison.json");
    let comparison = null;
    if (fs.existsSync(compPath)) {
      comparison = JSON.parse(fs.readFileSync(compPath, "utf-8"));
    }

    const importancePath = path.join(SPARK_DIR, "output/model/feature_importance.json");
    let featureImportance = null;
    if (fs.existsSync(importancePath)) {
      featureImportance = JSON.parse(fs.readFileSync(importancePath, "utf-8"));
    }

    res.json({ meta, comparison, featureImportance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hourly fraud stats
router.get("/hourly", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        FLOOR(time_elapsed / 3600) as hour,
        COUNT(*) FILTER (WHERE actual_class = 1) as fraud_count,
        COUNT(*) as total_count
      FROM transactions
      GROUP BY FLOOR(time_elapsed / 3600)
      ORDER BY hour
      LIMIT 24
    `);
    res.json(result.rows.map(r => ({
      hour: `${r.hour}h`,
      fraud_count: parseInt(r.fraud_count),
      total_count: parseInt(r.total_count)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Class distribution
router.get("/class-distribution", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        actual_class,
        COUNT(*) as count
      FROM transactions
      WHERE actual_class IS NOT NULL
      GROUP BY actual_class
    `);
    res.json(result.rows.map(r => ({
      name: r.actual_class === 1 ? 'Fraudulent' : 'Legitimate',
      value: parseInt(r.count)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Model comparison from file
router.get("/model-comparison", async (req, res) => {
  try {
    const compPath = path.join(SPARK_DIR, "output/model/model_comparison.json");
    if (!fs.existsSync(compPath)) {
      return res.json([]);
    }
    const comparison = JSON.parse(fs.readFileSync(compPath, "utf-8"));
    // Return just the models array
    if (comparison.models && Array.isArray(comparison.models)) {
      res.json(comparison.models);
    } else if (Array.isArray(comparison)) {
      res.json(comparison);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feature importance from file
router.get("/feature-importance", async (req, res) => {
  try {
    const importancePath = path.join(SPARK_DIR, "output/model/feature_importance.json");
    if (!fs.existsSync(importancePath)) {
      return res.json([]);
    }
    const importance = JSON.parse(fs.readFileSync(importancePath, "utf-8"));
    // Convert [feature, value] tuples to {feature, importance} objects
    if (Array.isArray(importance)) {
      const formatted = importance.map(item => {
        if (Array.isArray(item)) {
          return { feature: item[0], importance: item[1] };
        }
        return item;
      });
      res.json(formatted);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/confusion-matrix", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE actual_class = 0 AND predicted_class = 0) as tn,
        COUNT(*) FILTER (WHERE actual_class = 0 AND predicted_class = 1) as fp,
        COUNT(*) FILTER (WHERE actual_class = 1 AND predicted_class = 0) as fn,
        COUNT(*) FILTER (WHERE actual_class = 1 AND predicted_class = 1) as tp
      FROM transactions
      WHERE actual_class IS NOT NULL AND predicted_class IS NOT NULL
    `);
    const row = result.rows[0];
    res.json({
      tn: parseInt(row.tn),
      fp: parseInt(row.fp),
      fn: parseInt(row.fn),
      tp: parseInt(row.tp)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Time series data (transaction volume over time)
router.get("/time-series", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        FLOOR(time_elapsed / 3600) as hour,
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE actual_class = 1) as fraud_count,
        ROUND(AVG(amount)::numeric, 2) as avg_amount,
        ROUND(SUM(amount)::numeric, 2) as total_amount
      FROM transactions
      GROUP BY FLOOR(time_elapsed / 3600)
      ORDER BY hour
      LIMIT 48
    `);
    res.json(result.rows.map(r => ({
      hour: parseInt(r.hour),
      label: `Hour ${r.hour}`,
      total_count: parseInt(r.total_count),
      fraud_count: parseInt(r.fraud_count),
      avg_amount: parseFloat(r.avg_amount) || 0,
      total_amount: parseFloat(r.total_amount) || 0,
      fraud_rate: parseInt(r.total_count) > 0 ? 
        (parseInt(r.fraud_count) / parseInt(r.total_count) * 100).toFixed(2) : 0
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top high-risk transactions
router.get("/top-fraud", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, amount, fraud_probability, risk_level, actual_class, predicted_class, time_elapsed
      FROM transactions
      WHERE fraud_probability IS NOT NULL
      ORDER BY fraud_probability DESC
      LIMIT 10
    `);
    res.json(result.rows.map(r => ({
      id: r.id,
      amount: parseFloat(r.amount),
      fraud_probability: parseFloat(r.fraud_probability),
      risk_level: r.risk_level,
      actual_class: r.actual_class,
      predicted_class: r.predicted_class,
      time_elapsed: parseFloat(r.time_elapsed)
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prediction accuracy stats
router.get("/prediction-accuracy", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_predicted,
        COUNT(*) FILTER (WHERE actual_class = predicted_class) as correct_predictions,
        COUNT(*) FILTER (WHERE actual_class != predicted_class) as wrong_predictions,
        ROUND(
          (COUNT(*) FILTER (WHERE actual_class = predicted_class)::numeric / 
           NULLIF(COUNT(*), 0) * 100)::numeric, 2
        ) as accuracy
      FROM transactions
      WHERE actual_class IS NOT NULL AND predicted_class IS NOT NULL
    `);
    const row = result.rows[0];
    res.json({
      total_predicted: parseInt(row.total_predicted) || 0,
      correct_predictions: parseInt(row.correct_predictions) || 0,
      wrong_predictions: parseInt(row.wrong_predictions) || 0,
      accuracy: parseFloat(row.accuracy) || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Amount statistics by risk level
router.get("/amount-by-risk", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        risk_level,
        COUNT(*) as count,
        ROUND(AVG(amount)::numeric, 2) as avg_amount,
        ROUND(MIN(amount)::numeric, 2) as min_amount,
        ROUND(MAX(amount)::numeric, 2) as max_amount,
        ROUND(SUM(amount)::numeric, 2) as total_amount
      FROM transactions
      WHERE risk_level IS NOT NULL
      GROUP BY risk_level
      ORDER BY
        CASE risk_level
          WHEN 'HIGH' THEN 1
          WHEN 'MEDIUM' THEN 2
          WHEN 'LOW' THEN 3
        END
    `);
    res.json(result.rows.map(r => ({
      risk_level: r.risk_level,
      count: parseInt(r.count),
      avg_amount: parseFloat(r.avg_amount) || 0,
      min_amount: parseFloat(r.min_amount) || 0,
      max_amount: parseFloat(r.max_amount) || 0,
      total_amount: parseFloat(r.total_amount) || 0
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export transactions as CSV
router.get("/export/csv", async (req, res) => {
  try {
    const { limit = 1000, risk_level, actual_class } = req.query;
    
    let whereConditions = [];
    let params = [];
    let paramIdx = 1;
    
    if (risk_level) {
      whereConditions.push(`risk_level = $${paramIdx++}`);
      params.push(risk_level);
    }
    if (actual_class !== undefined && actual_class !== '') {
      whereConditions.push(`actual_class = $${paramIdx++}`);
      params.push(parseInt(actual_class));
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const result = await pool.query(`
      SELECT id, amount, time_elapsed, actual_class, predicted_class, fraud_probability, risk_level
      FROM transactions
      ${whereClause}
      ORDER BY id
      LIMIT $${paramIdx}
    `, [...params, parseInt(limit)]);
    
    // Generate CSV
    const headers = ['ID', 'Amount', 'Time', 'Actual Class', 'Predicted Class', 'Fraud Probability', 'Risk Level'];
    const rows = result.rows.map(r => [
      r.id,
      r.amount,
      r.time_elapsed,
      r.actual_class,
      r.predicted_class,
      r.fraud_probability,
      r.risk_level
    ].join(','));
    
    const csv = [headers.join(','), ...rows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fraudlens_export.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Real-time stats summary for dashboard
router.get("/realtime-summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_transactions,
        COUNT(*) FILTER (WHERE actual_class = 1) as total_fraud,
        COUNT(*) FILTER (WHERE risk_level = 'HIGH') as high_risk_count,
        ROUND(AVG(fraud_probability)::numeric, 4) as avg_fraud_probability,
        (SELECT COUNT(*) FROM transactions WHERE created_at > NOW() - INTERVAL '1 hour') as recent_count
      FROM transactions
    `);
    const row = result.rows[0];
    res.json({
      total_transactions: parseInt(row.total_transactions) || 0,
      total_fraud: parseInt(row.total_fraud) || 0,
      high_risk_count: parseInt(row.high_risk_count) || 0,
      avg_fraud_probability: parseFloat(row.avg_fraud_probability) || 0,
      recent_count: parseInt(row.recent_count) || 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
