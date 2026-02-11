# 📖 FraudLens User Manual
## คู่มือการใช้งานระบบ FraudLens - Real-Time Credit Card Fraud Detection Platform

---

## 📋 สารบัญ (Table of Contents)

1. [ภาพรวมของระบบ (System Overview)](#1-ภาพรวมของระบบ-system-overview)
2. [การติดตั้งและเริ่มต้นใช้งาน (Installation)](#2-การติดตั้งและเริ่มต้นใช้งาน-installation)
3. [หน้าต่างๆ ในระบบ (System Pages)](#3-หน้าต่างๆ-ในระบบ-system-pages)
4. [REST API Reference](#4-rest-api-reference)
5. [Machine Learning Model](#5-machine-learning-model)
6. [Troubleshooting](#6-troubleshooting)
7. [Technical Architecture](#7-technical-architecture)

---

## 1. ภาพรวมของระบบ (System Overview)

### 🎯 FraudLens คืออะไร?

FraudLens เป็นแพลตฟอร์มตรวจจับการฉ้อโกงบัตรเครดิตแบบ Real-time ที่ใช้เทคโนโลยี Big Data Analytics และ Machine Learning ในการวิเคราะห์ธุรกรรมและทำนายความเสี่ยง

### 🏗️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Data Processing** | Apache Spark (PySpark) |
| **Machine Learning** | scikit-learn, Random Forest |
| **Backend API** | Node.js + Express |
| **Database** | PostgreSQL 16 |
| **Frontend** | React + TypeScript + Recharts |
| **Containerization** | Docker + Docker Compose |

### 📊 Dataset

- **Source:** Kaggle Credit Card Fraud Detection Dataset
- **Total Transactions:** 284,807
- **Fraud Cases:** 492 (0.172%)
- **Features:** 30 (V1-V28 PCA features + Amount + Time)

---

## 2. การติดตั้งและเริ่มต้นใช้งาน (Installation)

### 📋 Prerequisites

- Docker Desktop (Windows/Mac/Linux)
- Git
- 8GB+ RAM recommended
- 10GB+ free disk space

### 🚀 Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd fraudlens

# 2. Start all services
docker-compose up -d --build

# 3. Seed database with data (ใช้เวลาประมาณ 10-20 นาที)
docker-compose exec backend node src/seed.js

# 4. Access the dashboard
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

### 🔧 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend Dashboard | 3000 | http://localhost:3000 |
| Backend API | 8000 | http://localhost:8000 |
| PostgreSQL | 5433 | localhost:5433 |

### ⏹️ หยุดการทำงาน (Stop Services)

```bash
docker-compose down
```

### 🗑️ ลบข้อมูลทั้งหมด (Reset Everything)

```bash
docker-compose down -v
```

---

## 3. หน้าต่างๆ ในระบบ (System Pages)

### 🏠 3.1 Overview Dashboard (`/`)

**หน้าแรกของระบบ แสดงภาพรวมทั้งหมด**

#### ข้อมูลที่แสดง:
- **Total Transactions** - จำนวนธุรกรรมทั้งหมด
- **Fraud Detected** - จำนวนธุรกรรมที่ตรวจพบว่าเป็น fraud
- **High Risk Alerts** - จำนวน transactions ที่มีความเสี่ยงสูง
- **Total Volume** - มูลค่ารวมของธุรกรรมทั้งหมด

#### กราฟที่แสดง:
- **Fraud Activity Over Time** - กราฟแสดง fraud ตามเวลา
- **Transaction Classification** - Pie chart แสดงสัดส่วน Legitimate vs Fraud
- **Risk Level Distribution** - Bar chart แสดงการกระจาย HIGH/MEDIUM/LOW risk

#### Recent Transactions:
- ตารางแสดง 10 ธุรกรรมล่าสุด พร้อม status

---

### 📋 3.2 Transaction Monitor (`/transactions`)

**หน้าค้นหาและ filter ธุรกรรมทั้งหมด**

#### Filters ที่ใช้ได้:

| Filter | Options | Description |
|--------|---------|-------------|
| **Risk Level** | All Levels, HIGH, MEDIUM, LOW | กรองตามระดับความเสี่ยง |
| **Classification** | All, Fraud Only, Legitimate Only | กรองตามประเภทธุรกรรม |
| **Min Amount** | 0.00 - ∞ | จำนวนเงินขั้นต่ำ |
| **Max Amount** | 0.00 - ∞ | จำนวนเงินสูงสุด |

#### วิธีใช้งาน:
1. เลือก filter ที่ต้องการจาก dropdown หรือใส่ค่า amount
2. ตารางจะ update อัตโนมัติ
3. กด "Clear all" เพื่อล้าง filter ทั้งหมด
4. ใช้ pagination ด้านล่างเพื่อดูหน้าถัดไป

#### ข้อมูลในตาราง:
- **ID** - รหัสธุรกรรม
- **TIME** - เวลาที่เกิดธุรกรรม (วินาทีจากธุรกรรมแรก)
- **AMOUNT** - จำนวนเงิน
- **ACTUAL** - ค่าจริง (Legit/Fraud)
- **PREDICTED** - ค่าที่ model ทำนาย
- **PROBABILITY** - ความน่าจะเป็น fraud (%)
- **RISK** - ระดับความเสี่ยง

---

### 📊 3.3 Advanced Analytics (`/analytics`)

**หน้าวิเคราะห์ข้อมูลเชิงลึก**

#### Features:
1. **Real-time Stats** - สถิติที่ refresh อัตโนมัติทุก 30 วินาที
2. **Model Prediction Accuracy** - แสดงความแม่นยำของ model
3. **Transaction Volume Over Time** - กราฟ Area chart แสดงปริมาณธุรกรรม
4. **Risk Level Distribution** - Pie chart แสดงสัดส่วน risk
5. **Amount Statistics by Risk Level** - เปรียบเทียบยอดเงินตาม risk
6. **Top 10 High-Risk Transactions** - ตาราง transactions ที่มีความเสี่ยงสูงสุด

#### ปุ่มต่างๆ:
- **🔄 Refresh** - รีเฟรชข้อมูลทันที
- **📥 Export CSV** - ดาวน์โหลดข้อมูลเป็นไฟล์ CSV

---

### 🧠 3.4 Model Insights (`/model`)

**หน้าแสดงประสิทธิภาพ Machine Learning Model**

#### Model Comparison:
แสดงผลการเปรียบเทียบ 3 models:
- **Logistic Regression**
- **Random Forest** ⭐ (Best Model)
- **Gradient Boosting**

#### Metrics ที่แสดง:
| Metric | Description |
|--------|-------------|
| **Accuracy** | ความถูกต้องโดยรวม |
| **Precision** | ความแม่นยำในการทำนาย fraud |
| **Recall** | อัตราการตรวจจับ fraud |
| **F1 Score** | ค่าเฉลี่ยฮาร์โมนิกของ Precision และ Recall |
| **ROC AUC** | พื้นที่ใต้เส้น ROC curve |

#### การเลือก Model:
- คลิกที่ปุ่มชื่อ model เพื่อดูรายละเอียด
- กราฟ Radar จะแสดง metrics ของ model ที่เลือก

#### Feature Importance:
- แสดง Top 15 features ที่สำคัญที่สุดในการทำนาย
- V10, V14, V4 เป็น features ที่สำคัญที่สุด

#### Confusion Matrix:
แสดงผลการทำนายเทียบกับค่าจริง:
- **True Negative (TN)** - ทำนายว่า Legit และถูกต้อง
- **False Positive (FP)** - ทำนายว่า Fraud แต่จริงๆ เป็น Legit
- **False Negative (FN)** - ทำนายว่า Legit แต่จริงๆ เป็น Fraud
- **True Positive (TP)** - ทำนายว่า Fraud และถูกต้อง

---

### 🔮 3.5 Fraud Prediction (`/predict`)

**หน้าทำนาย fraud แบบ real-time**

#### วิธีใช้งาน:

1. **ใส่ข้อมูล Transaction:**
   - **Transaction Amount ($)** - ใส่จำนวนเงิน
   - **V1-V28** - ใส่ค่า PCA features (หรือใช้ค่า default)

2. **Quick Actions:**
   - **✨ Random Values** - สุ่มค่า features ใหม่
   - **🔄 Reset to Default** - กลับค่า default

3. **กดปุ่ม "Predict Fraud Risk"**

4. **ดูผลลัพธ์:**
   - **LEGITIMATE** ✓ หรือ **FRAUDULENT** ⚠️
   - **Fraud Probability** - เปอร์เซ็นต์ความน่าจะเป็น
   - **Risk Level** - HIGH / MEDIUM / LOW
   - **Recommendations** - คำแนะนำการดำเนินการ

#### Risk Level Thresholds:
| Risk Level | Probability Range | Action |
|------------|-------------------|--------|
| **HIGH** | ≥ 70% | Block transaction immediately |
| **MEDIUM** | 30% - 70% | Request additional verification |
| **LOW** | < 30% | Proceed with standard processing |

---

### 📚 3.6 API Documentation (`/api-docs`)

**เอกสาร REST API สำหรับ developers**

แสดงรายละเอียดทุก endpoint พร้อม:
- HTTP Method (GET/POST)
- URL path
- Parameters
- Response format
- Copy to clipboard function

---

## 4. REST API Reference

### Base URL
```
http://localhost:8000/api
```

### 📊 Statistics Endpoints

#### GET /api/stats
ดึงสถิติรวมของระบบ

**Response:**
```json
{
  "total_transactions": 284807,
  "total_fraud": 492,
  "fraud_rate": 0.001727,
  "avg_amount": 88.35,
  "total_amount": 25166161.94,
  "high_risk_count": 156,
  "medium_risk_count": 892,
  "low_risk_count": 283759
}
```

#### GET /api/stats/hourly
ดึงสถิติรายชั่วโมง

#### GET /api/stats/time-series
ดึงข้อมูล time series สำหรับ chart

#### GET /api/stats/confusion-matrix
ดึง confusion matrix ของ predictions

**Response:**
```json
{
  "tn": 284315,
  "fp": 123,
  "fn": 45,
  "tp": 447
}
```

#### GET /api/stats/model-comparison
ดึงผลเปรียบเทียบ models

#### GET /api/stats/feature-importance
ดึง feature importance scores

---

### 📋 Transaction Endpoints

#### GET /api/transactions
ดึงรายการ transactions พร้อม pagination

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | หน้าที่ต้องการ (default: 1) |
| limit | number | จำนวนต่อหน้า (default: 20) |
| risk_level | string | HIGH, MEDIUM, LOW |
| actual_class | number | 0 (legit) หรือ 1 (fraud) |
| min_amount | number | จำนวนเงินขั้นต่ำ |
| max_amount | number | จำนวนเงินสูงสุด |

**Example:**
```
GET /api/transactions?page=1&limit=10&risk_level=HIGH
```

#### GET /api/transactions/:id
ดึงรายละเอียด transaction เดียว

---

### 🔮 Prediction Endpoint

#### POST /api/predict
ทำนาย fraud จาก features

**Request Body:**
```json
{
  "features": [
    -1.359807, -0.072781, 2.536347, 1.378155, -0.338321,
    0.462388, 0.239599, 0.098698, 0.363787, 0.090794,
    -0.551600, -0.617801, -0.991390, -0.311169, 1.468177,
    -0.470401, 0.207971, 0.025791, 0.403993, 0.251412,
    -0.018307, 0.277838, -0.110474, 0.066928, 0.128539,
    -0.189115, 0.133558, -0.021053, 149.62
  ]
}
```

**Features Array (29 values):**
- Index 0-27: V1-V28 (PCA transformed features)
- Index 28: Amount (transaction amount)

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

---

### 📥 Export Endpoint

#### GET /api/stats/export/csv
ดาวน์โหลดข้อมูลเป็น CSV

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | จำนวน rows (default: 1000, max: 10000) |
| risk_level | string | Filter by risk level |
| actual_class | number | Filter by class |

---

## 5. Machine Learning Model

### 🧠 Model Information

**Selected Model:** Random Forest Classifier

**Performance Metrics:**
| Metric | Score |
|--------|-------|
| Accuracy | 99.88% |
| Precision | 59.57% |
| Recall | 85.71% |
| F1 Score | 70.29% |
| ROC AUC | 98.00% |

### 📊 Feature Importance (Top 10)

| Rank | Feature | Importance |
|------|---------|------------|
| 1 | V10 | 17.46% |
| 2 | V14 | 14.08% |
| 3 | V4 | 11.58% |
| 4 | V12 | 10.86% |
| 5 | V11 | 10.26% |
| 6 | V17 | 8.21% |
| 7 | V16 | 5.76% |
| 8 | V7 | 5.02% |
| 9 | V3 | 3.19% |
| 10 | V2 | 1.90% |

### 🎯 Risk Level Classification

Model output probability → Risk Level:
- **≥ 0.70** → HIGH (สีแดง)
- **0.30 - 0.69** → MEDIUM (สีส้ม)
- **< 0.30** → LOW (สีเขียว)

---

## 6. Troubleshooting

### ❌ ปัญหาที่พบบ่อย

#### 1. Docker containers ไม่ start

```bash
# ตรวจสอบ logs
docker-compose logs

# Restart services
docker-compose down
docker-compose up -d --build
```

#### 2. Database connection error

```bash
# ตรวจสอบว่า db container running
docker-compose ps

# รอให้ database healthy
docker-compose exec db pg_isready -U postgres
```

#### 3. Frontend blank page

- Clear browser cache (Ctrl+Shift+R)
- ตรวจสอบ Console errors (F12)
- Rebuild frontend:
```bash
docker-compose up -d --build frontend
```

#### 4. No data in dashboard

- รอให้ seed process เสร็จ
- ตรวจสอบ seed progress:
```bash
docker-compose logs -f backend
```

#### 5. Prediction API error

```bash
# ตรวจสอบ Python และ model
docker-compose exec backend python3 -c "import sklearn; print('OK')"

# ตรวจสอบ model file
docker-compose exec backend ls -la /app/model/
```

#### 6. Filter "Fraud Only" ไม่มีข้อมูล

- Fraud มีแค่ 0.17% ของ dataset
- ต้องรอให้ seed ทำงานนานพอ
- ลองดู high_risk_count ใน stats ก่อน

---

## 7. Technical Architecture

### 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Docker Network                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Frontend   │    │   Backend    │    │  PostgreSQL  │      │
│  │  (React +    │◄──►│  (Node.js +  │◄──►│     (DB)     │      │
│  │   Nginx)     │    │   Express)   │    │              │      │
│  │   :3000      │    │    :8000     │    │    :5432     │      │
│  └──────────────┘    └──────┬───────┘    └──────────────┘      │
│                             │                                   │
│                      ┌──────▼───────┐                          │
│                      │   Python     │                          │
│                      │   ML Model   │                          │
│                      │  (sklearn)   │                          │
│                      └──────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 📁 Project Structure

```
fraudlens/
├── backend/                # Node.js API Server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── db/             # Database schema
│   │   └── seed.js         # Data seeding script
│   └── Dockerfile
│
├── frontend/               # React Dashboard
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── services/       # API client
│   ├── nginx.conf          # Nginx configuration
│   └── Dockerfile
│
├── model/                  # ML Model files
│   ├── fraud_model.pkl     # Trained model
│   ├── model_meta.json     # Model metadata
│   └── predict.py          # Prediction script
│
├── spark/                  # Spark pipeline outputs
│   ├── data/               # creditcard.csv
│   └── output/             # EDA & model results
│       ├── eda/
│       └── model/
│
└── docker-compose.yml      # Docker orchestration
```

### 🔄 Data Flow

```
1. CSV Data → Spark (EDA) → Feature Engineering
                    ↓
2. Training Data → scikit-learn → Model (.pkl)
                    ↓
3. New Transaction → API → Python (predict.py) → Result
                    ↓
4. Result → PostgreSQL → Dashboard Display
```

---

## 📞 Support

หากพบปัญหาหรือต้องการความช่วยเหลือ:

1. ตรวจสอบ logs: `docker-compose logs`
2. ดู Troubleshooting section ด้านบน
3. ตรวจสอบ API status: `http://localhost:8000/api/stats`

---

## 📜 License

This project is for educational purposes - Big Data Analytics Course

---

**FraudLens** - Real-Time Credit Card Fraud Detection Platform  
Version 1.0.0 | February 2026
