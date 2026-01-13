# 🕵️💳 Credit Card Fraud Detection with PySpark

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)
![Spark](https://img.shields.io/badge/Apache_Spark-PySpark-orange?style=for-the-badge&logo=apachespark)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

## 📌 Project Overview
This project is a **Big Data Analytics Mini-Project** focused on detecting fraudulent credit card transactions. 

We utilize **Apache Spark (PySpark)** to handle a large dataset of over 284,000 transactions. The core challenge of this project is dealing with highly **imbalanced data** (where fraud cases represent only 0.17% of the total). We implemented an end-to-end **Machine Learning Pipeline** using Random Forest Classification to accurately identify fraud while minimizing false negatives.

## 📂 Dataset
**Source:** [Credit Card Fraud Detection Dataset (Kaggle)](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)
* **Size:** 284,807 Transactions
* **Features:** 30 Features (Time, Amount, and V1-V28 from PCA transformation)
* **Target:** `Class` (0 = Normal, 1 = Fraud)

## 🛠️ Technologies & Tools
* **Core Engine:** Apache Spark (PySpark)
* **Language:** Python
* **IDE:** VS Code / Jupyter Notebook
* **Libraries:**
    * `pyspark.ml` (Machine Learning Pipeline)
    * `scikit-learn` (Advanced Evaluation Metrics)
    * `pandas` & `seaborn` (Data Visualization)

## ⚙️ Methodology (The Pipeline)
We implemented an **Enterprise-Grade ML Pipeline** consisting of the following stages:

1.  **Data Ingestion:** Loading data with optimized Spark Session configurations.
2.  **Exploratory Data Analysis (EDA):** Visualizing class imbalance and transaction distributions.
3.  **Feature Engineering:**
    * `VectorAssembler`: Combining features into vectors.
    * `StandardScaler`: Normalizing features for better model performance.
4.  **Modeling:** Using **Random Forest Classifier** (Robust to overfitting and handles imbalance well).
5.  **Evaluation:** Using a hybrid approach (Spark Evaluator + Sklearn) to measure Precision, Recall, and F1-Score.

## 🚀 How to Run
1.  **Prerequisites:** Ensure Java (JDK 8/11) and Python are installed.
2.  **Install Dependencies:**
    ```bash
    pip install pyspark scikit-learn pandas seaborn matplotlib findspark
    ```
3.  **Download Dataset:** Place `creditcard.csv` in the project root directory.
4.  **Run the Notebook:** Open `fraud_detection_demo.ipynb` in VS Code or Jupyter and run all cells.

## 📊 Results & Performance
*(Based on Random Forest Model)*

Due to the imbalance of the dataset, we prioritize **F1-Score** and **Recall** over Accuracy.

| Metric | Score |
| :--- | :--- |
| **Accuracy** | *99.9x%* (Sample) |
| **Precision (Fraud)** | *0.9x* (Sample) |
| **Recall (Fraud)** | *0.8x* (Sample) |
| **F1-Score** | *0.8x* (Sample) |

> *Note: See the full Confusion Matrix in the notebook output.*

## 👥 Team Members
* **Nicky:** Demo Implementation (Code + Video), Data Modeling
* **[Member 2 Name]:** Report (Introduction, Theory, Methodology)
* **[Member 3 Name]:** Report (Results, Analysis, Conclusion)

---
*University Project | Big Data Analytics Class*