const { Router } = require("express");
const pool = require("../db/pool");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      risk_level,
      min_amount,
      max_amount,
      actual_class,
      sort_by = "created_at",
      sort_order = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (risk_level) {
      conditions.push(`risk_level = $${paramIdx++}`);
      params.push(risk_level);
    }
    if (min_amount) {
      conditions.push(`amount >= $${paramIdx++}`);
      params.push(parseFloat(min_amount));
    }
    if (max_amount) {
      conditions.push(`amount <= $${paramIdx++}`);
      params.push(parseFloat(max_amount));
    }
    if (actual_class !== undefined) {
      conditions.push(`actual_class = $${paramIdx++}`);
      params.push(parseInt(actual_class));
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const allowedSorts = ["created_at", "amount", "fraud_probability", "id"];
    const safeSort = allowedSorts.includes(sort_by) ? sort_by : "created_at";
    const safeOrder = sort_order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM transactions ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const dataResult = await pool.query(
      `SELECT * FROM transactions ${where} ORDER BY ${safeSort} ${safeOrder} LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      data: dataResult.rows,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
