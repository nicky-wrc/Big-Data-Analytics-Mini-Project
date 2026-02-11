from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.ml.feature import VectorAssembler, StandardScaler
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler as SkScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    precision_recall_curve, roc_curve, average_precision_score, f1_score
)
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline
import joblib
import json
import os
import warnings
warnings.filterwarnings("ignore")

DATA_PATH = os.environ.get("DATA_PATH", "data/creditcard.csv")
MODEL_DIR = "../model"
OUTPUT_DIR = "output/model"
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 60)
print("FraudLens — ML Training Pipeline")
print("=" * 60)

# ============================================================
# PHASE 1: Load & Prepare Data with Spark
# ============================================================
print("\n[Phase 1] Loading data with Spark...")

spark = SparkSession.builder \
    .appName("FraudLens-ML") \
    .master("local[*]") \
    .config("spark.driver.memory", "4g") \
    .getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

sdf = spark.read.csv(DATA_PATH, header=True, inferSchema=True)
print(f"  Loaded: {sdf.count()} rows")

feature_cols = [c for c in sdf.columns if c not in ["Class", "Time"]]
assembler = VectorAssembler(inputCols=feature_cols, outputCol="features_raw")
sdf_assembled = assembler.transform(sdf)

scaler = StandardScaler(inputCol="features_raw", outputCol="features_scaled", withStd=True, withMean=True)
scaler_model = scaler.fit(sdf_assembled)
sdf_scaled = scaler_model.transform(sdf_assembled)

print("  Spark feature assembly & scaling done")

pdf = sdf.toPandas()
spark.stop()
print("  Converted to Pandas for sklearn training")

# ============================================================
# PHASE 2: Feature Engineering
# ============================================================
print("\n[Phase 2] Feature Engineering...")

X = pdf.drop(columns=["Class", "Time"])
y = pdf["Class"]

sk_scaler = SkScaler()
X_scaled = pd.DataFrame(sk_scaler.fit_transform(X), columns=X.columns)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

print(f"  Train: {X_train.shape[0]} | Test: {X_test.shape[0]}")
print(f"  Train fraud rate: {y_train.mean()*100:.3f}%")
print(f"  Test fraud rate:  {y_test.mean()*100:.3f}%")

# ============================================================
# PHASE 3: Handle Imbalanced Data with SMOTE
# ============================================================
print("\n[Phase 3] Applying SMOTE...")

smote = SMOTE(random_state=42, sampling_strategy=0.5)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)

print(f"  Before SMOTE: {y_train.value_counts().to_dict()}")
print(f"  After SMOTE:  {pd.Series(y_train_sm).value_counts().to_dict()}")

# ============================================================
# PHASE 4: Train Multiple Models
# ============================================================
print("\n[Phase 4] Training Models...")

models = {
    "LogisticRegression": LogisticRegression(
        max_iter=1000, random_state=42, class_weight="balanced"
    ),
    "RandomForest": RandomForestClassifier(
        n_estimators=100, max_depth=10, random_state=42, n_jobs=-1
    ),
    "GradientBoosting": GradientBoostingClassifier(
        n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
    )
}

results = {}

for name, model in models.items():
    print(f"\n  Training {name}...")
    model.fit(X_train_sm, y_train_sm)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    roc_auc = roc_auc_score(y_test, y_prob)
    ap_score = average_precision_score(y_test, y_prob)
    f1 = f1_score(y_test, y_pred)

    fpr, tpr, _ = roc_curve(y_test, y_prob)
    precision_curve, recall_curve, _ = precision_recall_curve(y_test, y_prob)

    results[name] = {
        "model": model,
        "confusion_matrix": cm.tolist(),
        "classification_report": report,
        "roc_auc": round(roc_auc, 4),
        "average_precision": round(ap_score, 4),
        "f1_score": round(f1, 4),
        "accuracy": round(report["accuracy"], 4),
        "precision": round(report["1"]["precision"], 4),
        "recall": round(report["1"]["recall"], 4),
        "roc_curve": {"fpr": fpr.tolist(), "tpr": tpr.tolist()},
        "pr_curve": {"precision": precision_curve.tolist(), "recall": recall_curve.tolist()}
    }

    print(f"    Accuracy:  {report['accuracy']:.4f}")
    print(f"    Precision: {report['1']['precision']:.4f}")
    print(f"    Recall:    {report['1']['recall']:.4f}")
    print(f"    F1 Score:  {f1:.4f}")
    print(f"    ROC AUC:   {roc_auc:.4f}")
    print(f"    AP Score:  {ap_score:.4f}")
    print(f"    Confusion Matrix:")
    print(f"      TN={cm[0][0]:>6}  FP={cm[0][1]:>4}")
    print(f"      FN={cm[1][0]:>6}  TP={cm[1][1]:>4}")

# ============================================================
# PHASE 5: Select Best Model & Export
# ============================================================
print("\n[Phase 5] Model Comparison & Selection...")

comparison = []
for name, res in results.items():
    row = {
        "model": name,
        "accuracy": res["accuracy"],
        "precision": res["precision"],
        "recall": res["recall"],
        "f1_score": res["f1_score"],
        "roc_auc": res["roc_auc"],
        "average_precision": res["average_precision"]
    }
    comparison.append(row)
    print(f"  {name:>25}: F1={row['f1_score']:.4f} | ROC-AUC={row['roc_auc']:.4f} | Recall={row['recall']:.4f}")

best_name = max(results, key=lambda k: results[k]["f1_score"])
best_model = results[best_name]["model"]
print(f"\n  Best Model: {best_name} (F1={results[best_name]['f1_score']:.4f})")

print(f"\n[Phase 6] Exporting model to {MODEL_DIR}...")

joblib.dump(best_model, f"{MODEL_DIR}/fraud_model.pkl")
joblib.dump(sk_scaler, f"{MODEL_DIR}/scaler.pkl")

model_meta = {
    "best_model": best_name,
    "features": list(X.columns),
    "n_features": len(X.columns),
    "metrics": {
        "accuracy": results[best_name]["accuracy"],
        "precision": results[best_name]["precision"],
        "recall": results[best_name]["recall"],
        "f1_score": results[best_name]["f1_score"],
        "roc_auc": results[best_name]["roc_auc"]
    },
    "training_info": {
        "train_size": len(X_train),
        "test_size": len(X_test),
        "smote_applied": True,
        "smote_strategy": 0.5
    }
}

with open(f"{MODEL_DIR}/model_meta.json", "w") as f:
    json.dump(model_meta, f, indent=2)

comparison_output = {
    "models": comparison,
    "best_model": best_name
}
with open(f"{OUTPUT_DIR}/model_comparison.json", "w") as f:
    json.dump(comparison_output, f, indent=2)

for name, res in results.items():
    model_result = {
        "confusion_matrix": res["confusion_matrix"],
        "roc_auc": res["roc_auc"],
        "precision": res["precision"],
        "recall": res["recall"],
        "f1_score": res["f1_score"],
        "roc_curve": res["roc_curve"],
        "pr_curve": res["pr_curve"]
    }
    with open(f"{OUTPUT_DIR}/{name}_results.json", "w") as f:
        json.dump(model_result, f, indent=2)

if hasattr(best_model, "feature_importances_"):
    importances = best_model.feature_importances_
    feature_importance = sorted(
        zip(X.columns, importances.tolist()),
        key=lambda x: x[1], reverse=True
    )
    with open(f"{OUTPUT_DIR}/feature_importance.json", "w") as f:
        json.dump(feature_importance, f, indent=2)

    print("\n  Top 10 Important Features:")
    for feat, imp in feature_importance[:10]:
        print(f"    {feat:>10}: {imp:.6f}")

print("\n" + "=" * 60)
print("Training Complete!")
print(f"  Model saved: {MODEL_DIR}/fraud_model.pkl")
print(f"  Scaler saved: {MODEL_DIR}/scaler.pkl")
print(f"  Metadata: {MODEL_DIR}/model_meta.json")
print(f"  Results: {OUTPUT_DIR}/")
print("=" * 60)
