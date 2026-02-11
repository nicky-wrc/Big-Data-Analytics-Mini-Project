const { Router } = require("express");
const pool = require("../db/pool");
const { predict } = require("../services/mlService");

const router = Router();

const FEATURE_NAMES = [
  "V1","V2","V3","V4","V5","V6","V7","V8","V9","V10",
  "V11","V12","V13","V14","V15","V16","V17","V18","V19","V20",
  "V21","V22","V23","V24","V25","V26","V27","V28","Amount"
];

router.post("/", async (req, res) => {
  try {
    const { features } = req.body;

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({
        error: "features must be an array of 29 numbers (V1-V28 + Amount)",
      });
    }

    if (features.length !== 29) {
      return res.status(400).json({
        error: `Expected 29 features, got ${features.length}`,
        expected: FEATURE_NAMES,
      });
    }

    const result = await predict(features);

    const featureValues = {};
    FEATURE_NAMES.forEach((name, i) => {
      featureValues[name.toLowerCase()] = features[i];
    });

    await pool.query(
      `INSERT INTO transactions (
        v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,
        v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,
        v21,v22,v23,v24,v25,v26,v27,v28,
        amount, time_elapsed, predicted_class, fraud_probability, risk_level
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,
        $29, 0, $30, $31, $32
      )`,
      [
        ...features,
        result.prediction,
        result.fraud_probability,
        result.risk_level,
      ]
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
