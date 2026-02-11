from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, when, mean, stddev, min, max, corr, round as spark_round
from pyspark.ml.feature import VectorAssembler, StandardScaler
from pyspark.ml.stat import Correlation
import json
import os

spark = SparkSession.builder \
    .appName("FraudLens-EDA") \
    .master("local[*]") \
    .config("spark.driver.memory", "4g") \
    .getOrCreate()

spark.sparkContext.setLogLevel("ERROR")

DATA_PATH = os.environ.get("DATA_PATH", "data/creditcard.csv")
OUTPUT_DIR = "output/eda"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("=" * 60)
print("FraudLens — Spark EDA Pipeline")
print("=" * 60)

df = spark.read.csv(DATA_PATH, header=True, inferSchema=True)

print(f"\n[1] Dataset Shape: {df.count()} rows x {len(df.columns)} columns")
print(f"[2] Columns: {df.columns}")

print("\n[3] Schema:")
df.printSchema()

print("\n[4] Basic Statistics:")
df.describe().show()

print("\n[5] Null Check:")
null_counts = df.select([count(when(col(c).isNull(), c)).alias(c) for c in df.columns])
null_counts.show()

print("\n[6] Class Distribution:")
class_dist = df.groupBy("Class").agg(
    count("*").alias("count")
).withColumn(
    "percentage", spark_round(col("count") / df.count() * 100, 4)
)
class_dist.show()

class_dist_data = [row.asDict() for row in class_dist.collect()]
with open(f"{OUTPUT_DIR}/class_distribution.json", "w") as f:
    json.dump(class_dist_data, f, indent=2)

print("\n[7] Amount Statistics by Class:")
amount_stats = df.groupBy("Class").agg(
    spark_round(mean("Amount"), 2).alias("mean_amount"),
    spark_round(stddev("Amount"), 2).alias("std_amount"),
    spark_round(min("Amount"), 2).alias("min_amount"),
    spark_round(max("Amount"), 2).alias("max_amount")
)
amount_stats.show()

amount_stats_data = [row.asDict() for row in amount_stats.collect()]
with open(f"{OUTPUT_DIR}/amount_stats.json", "w") as f:
    json.dump(amount_stats_data, f, indent=2)

print("\n[8] Time Statistics by Class:")
time_stats = df.groupBy("Class").agg(
    spark_round(mean("Time"), 2).alias("mean_time"),
    spark_round(stddev("Time"), 2).alias("std_time"),
    spark_round(min("Time"), 2).alias("min_time"),
    spark_round(max("Time"), 2).alias("max_time")
)
time_stats.show()

print("\n[9] Feature Correlations with Class:")
feature_cols = [c for c in df.columns if c not in ["Class"]]
correlations = {}
for feature in feature_cols:
    corr_val = df.stat.corr(feature, "Class")
    correlations[feature] = round(corr_val, 6)

sorted_corrs = sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True)
print("Top 10 correlated features with fraud:")
for feat, corr_val in sorted_corrs[:10]:
    print(f"  {feat:>10}: {corr_val:>10.6f}")

with open(f"{OUTPUT_DIR}/correlations.json", "w") as f:
    json.dump(dict(sorted_corrs), f, indent=2)

print("\n[10] Fraud Transaction Amount Percentiles:")
fraud_df = df.filter(col("Class") == 1)
non_fraud_df = df.filter(col("Class") == 0)

for label, subset in [("Fraud", fraud_df), ("Non-Fraud", non_fraud_df)]:
    percentiles = subset.approxQuantile("Amount", [0.25, 0.5, 0.75, 0.9, 0.95, 0.99], 0.01)
    print(f"  {label}:")
    print(f"    25th: ${percentiles[0]:.2f}")
    print(f"    50th: ${percentiles[1]:.2f}")
    print(f"    75th: ${percentiles[2]:.2f}")
    print(f"    90th: ${percentiles[3]:.2f}")
    print(f"    95th: ${percentiles[4]:.2f}")
    print(f"    99th: ${percentiles[5]:.2f}")

print("\n[11] Hourly Transaction Pattern:")
df_with_hour = df.withColumn("Hour", (col("Time") / 3600).cast("int") % 24)
hourly_stats = df_with_hour.groupBy("Hour").agg(
    count("*").alias("total"),
    count(when(col("Class") == 1, 1)).alias("fraud_count")
).withColumn(
    "fraud_rate", spark_round(col("fraud_count") / col("total") * 100, 4)
).orderBy("Hour")
hourly_stats.show(24)

hourly_data = [row.asDict() for row in hourly_stats.collect()]
with open(f"{OUTPUT_DIR}/hourly_pattern.json", "w") as f:
    json.dump(hourly_data, f, indent=2)

summary = {
    "total_transactions": df.count(),
    "total_fraud": fraud_df.count(),
    "total_non_fraud": non_fraud_df.count(),
    "fraud_rate_percent": round(fraud_df.count() / df.count() * 100, 4),
    "features": len(df.columns) - 1,
    "top_correlated_features": [feat for feat, _ in sorted_corrs[:5]],
    "mean_fraud_amount": round(fraud_df.agg(mean("Amount")).collect()[0][0], 2),
    "mean_non_fraud_amount": round(non_fraud_df.agg(mean("Amount")).collect()[0][0], 2)
}

with open(f"{OUTPUT_DIR}/summary.json", "w") as f:
    json.dump(summary, f, indent=2)

print("\n" + "=" * 60)
print("EDA Complete! Output saved to:", OUTPUT_DIR)
print("=" * 60)
print(json.dumps(summary, indent=2))

spark.stop()
