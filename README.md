# 🔍 FraudLens

**ระบบตรวจจับการฉ้อโกงบัตรเครดิตแบบ Real-time**

> 🎓 Big Data Analytics Mini Project

---

## 📸 Preview

| Dashboard | Model Insights |
|-----------|----------------|
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard) | ![Model](https://via.placeholder.com/400x200?text=Model+Insights) |

---

## ⚡ Quick Start

### 1. ติดตั้ง Docker
👉 https://www.docker.com/products/docker-desktop

### 2. Clone & Setup
```bash
git clone https://github.com/nicky-wrc/Big-Data-Analytics-Mini-Project.git
cd Big-Data-Analytics-Mini-Project
```

### 3. Download Dataset
👉 https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud

วาง `creditcard.csv` ที่ `spark/data/`

### 4. Run
```bash
docker-compose up -d --build
docker-compose exec backend node src/seed.js
```

### 5. Open
🌐 http://localhost:3000

---

## 🛠️ Tech Stack

| | |
|---|---|
| **Frontend** | React, TypeScript, Recharts |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **ML** | scikit-learn (Random Forest) |
| **Data** | Apache Spark |
| **Deploy** | Docker |

---

## 📊 Dataset Info

- **Source:** Kaggle Credit Card Fraud Dataset
- **Transactions:** 284,807
- **Fraud Cases:** 492 (0.17%)

---

## 🎯 Features

- ✅ Real-time fraud prediction
- ✅ Interactive dashboard
- ✅ Transaction filtering & search
- ✅ ML model comparison (3 models)
- ✅ Export to CSV
- ✅ REST API

---

## 📁 Project Structure

```
├── frontend/      # React Dashboard
├── backend/       # Node.js API
├── model/         # ML Model (Random Forest)
├── spark/         # Data & Spark scripts
└── docker-compose.yml
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Get statistics |
| GET | `/api/transactions` | List transactions |
| POST | `/api/predict` | Predict fraud |
| GET | `/api/stats/model-comparison` | Compare models |

---

## 📖 Documentation

- 📘 [Setup Guide](SETUP_GUIDE.md) - วิธีติดตั้งและทดสอบ
- 📗 [User Manual](USER_MANUAL.md) - คู่มือการใช้งาน

---

## 🚀 Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Reset
docker-compose down -v
```

---

## 👥 Team

- Developer: [Your Name]

---

<p align="center">
  Made with ❤️ for Big Data Analytics Course
</p>
