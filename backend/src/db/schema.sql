CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    time_elapsed FLOAT NOT NULL,
    v1 FLOAT, v2 FLOAT, v3 FLOAT, v4 FLOAT, v5 FLOAT,
    v6 FLOAT, v7 FLOAT, v8 FLOAT, v9 FLOAT, v10 FLOAT,
    v11 FLOAT, v12 FLOAT, v13 FLOAT, v14 FLOAT, v15 FLOAT,
    v16 FLOAT, v17 FLOAT, v18 FLOAT, v19 FLOAT, v20 FLOAT,
    v21 FLOAT, v22 FLOAT, v23 FLOAT, v24 FLOAT, v25 FLOAT,
    v26 FLOAT, v27 FLOAT, v28 FLOAT,
    amount FLOAT NOT NULL,
    actual_class INT,
    predicted_class INT,
    fraud_probability FLOAT,
    risk_level VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_class ON transactions(actual_class);
CREATE INDEX idx_transactions_predicted ON transactions(predicted_class);
CREATE INDEX idx_transactions_risk ON transactions(risk_level);
CREATE INDEX idx_transactions_created ON transactions(created_at);
