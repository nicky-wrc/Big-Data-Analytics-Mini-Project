import joblib
import numpy as np
import json
import sys
import os

MODEL_DIR = os.environ.get("MODEL_DIR", os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(MODEL_DIR, "fraud_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))

with open(os.path.join(MODEL_DIR, "model_meta.json"), "r") as f:
    meta = json.load(f)

def predict(features: list) -> dict:
    X = np.array(features).reshape(1, -1)
    X_scaled = scaler.transform(X)

    prediction = int(model.predict(X_scaled)[0])
    probability = float(model.predict_proba(X_scaled)[0][1])

    if probability < 0.3:
        risk_level = "LOW"
    elif probability < 0.7:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return {
        "prediction": prediction,
        "is_fraud": bool(prediction),
        "fraud_probability": round(probability, 6),
        "risk_level": risk_level,
        "model": meta["best_model"]
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_data = json.loads(sys.argv[1])
    else:
        input_data = json.loads(sys.stdin.read())

    features = input_data.get("features", input_data)

    if isinstance(features[0], list):
        results = [predict(f) for f in features]
    else:
        results = predict(features)

    print(json.dumps(results))
