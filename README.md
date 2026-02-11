# 🔍 FraudLens

<div align="center">

![FraudLens](https://img.shields.io/badge/FraudLens-Real--Time%20Fraud%20Detection-red?style=for-the-badge)

**Real-Time Credit Card Fraud Detection Platform**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikit-learn)](https://scikit-learn.org)

</div>

---

## 📖 Overview

FraudLens is a comprehensive **Big Data Analytics** platform for detecting credit card fraud in real-time. Built with modern technologies including Apache Spark for data processing, scikit-learn for machine learning, and React for the interactive dashboard.

### ✨ Key Features

- 🔮 **Real-time Prediction** - Instant fraud detection with < 100ms response time
- 📊 **Interactive Dashboard** - Beautiful visualizations with Recharts
- 🧠 **ML Model Comparison** - Compare Random Forest, Gradient Boosting, and Logistic Regression
- 📈 **Advanced Analytics** - Time-series analysis, risk distribution, and more
- 📥 **Export Functionality** - Download data as CSV
- 📚 **API Documentation** - Built-in REST API reference

---

## 🖼️ Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Overview)

### Model Insights
![Model](https://via.placeholder.com/800x400?text=Model+Insights)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Data Processing** | Apache Spark (PySpark) |
| **Machine Learning** | scikit-learn, Random Forest |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL 16 |
| **Frontend** | React 19 + TypeScript + Recharts |
| **Styling** | Tailwind CSS 4 |
| **Containerization** | Docker + Docker Compose |

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- 8GB+ RAM recommended
- 10GB+ free disk space

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/nicky-wrc/Big-Data-Analytics-Mini-Project.git
cd Big-Data-Analytics-Mini-Project

# 2. Download the dataset from Kaggle
# Download from: https://www.kaggle.com/mlg-ulb/creditcardfraud
# Place creditcard.csv in: spark/data/creditcard.csv

# 3. Start all services
docker-compose up -d --build

# 4. Seed database with data (takes ~10-20 minutes for full dataset)
docker-compose exec backend node src/seed.js

# 5. Open the dashboard
# Frontend: http://localhost:3000
# API: http://localhost:8000
```

> ⚠️ **Note:** The `creditcard.csv` file (~150MB) is not included in this repo due to GitHub's file size limit. Please download it from [Kaggle](https://www.kaggle.com/mlg-ulb/creditcardfraud) and place it in `spark/data/` folder.

### Service URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend Dashboard | http://localhost:3000 |
| 🔌 Backend API | http://localhost:8000 |
| 🗄️ PostgreSQL | localhost:5433 |

---

## 📁 Project Structure

```
fraudlens/
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── db/              # Database schema
│   │   └── seed.js          # Data seeding script
│   └── Dockerfile
│
├── frontend/                # React Dashboard
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   └── services/        # API client
│   └── Dockerfile
│
├── model/                   # ML Model
│   ├── fraud_model.pkl      # Trained Random Forest
│   └── predict.py           # Prediction script
│
├── spark/                   # Spark Pipeline
│   ├── data/                # Dataset (creditcard.csv)
│   ├── output/              # EDA & model results
│   ├── spark_eda.py         # EDA script
│   └── train_model.py       # Training script
│
├── docker-compose.yml
├── README.md
└── USER_MANUAL.md           # Detailed user guide
```

---

## 📊 Dataset

Using the [Kaggle Credit Card Fraud Detection Dataset](https://www.kaggle.com/mlg-ulb/creditcardfraud):

- **Total Transactions:** 284,807
- **Fraud Cases:** 492 (0.172%)
- **Features:** 30 (V1-V28 PCA + Amount + Time)
- **Highly Imbalanced:** 99.83% legitimate, 0.17% fraud

---

## 🧠 Machine Learning Model

### Model Performance

| Model | Accuracy | Precision | Recall | F1 Score | ROC AUC |
|-------|----------|-----------|--------|----------|---------|
| **Random Forest** ⭐ | 99.88% | 59.57% | 85.71% | 70.29% | 98.00% |
| Gradient Boosting | 99.75% | 39.44% | 85.71% | 54.02% | 96.21% |
| Logistic Regression | 97.33% | 5.62% | 91.84% | 10.59% | 96.99% |

### Top Features

1. V10 (17.46%)
2. V14 (14.08%)
3. V4 (11.58%)
4. V12 (10.86%)
5. V11 (10.26%)

---

## 🔌 API Reference

### Statistics

```http
GET /api/stats
```

### Transactions

```http
GET /api/transactions?page=1&limit=20&risk_level=HIGH
```

### Prediction

```http
POST /api/predict
Content-Type: application/json

{
  "features": [V1, V2, ..., V28, Amount]
}
```

**Response:**
```json
{
  "prediction": 0,
  "is_fraud": false,
  "fraud_probability": 0.0483,
  "risk_level": "LOW",
  "model": "RandomForest"
}
```

📖 Full API documentation available at http://localhost:3000/api-docs

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v

# Rebuild specific service
docker-compose up -d --build frontend
```

---

## 📝 License

This project is for educational purposes - Big Data Analytics Course.

---

## 👥 Contributors

- Your Name - Developer

---

<div align="center">

**FraudLens** - Real-Time Credit Card Fraud Detection Platform

Made with ❤️ for Big Data Analytics

</div>
