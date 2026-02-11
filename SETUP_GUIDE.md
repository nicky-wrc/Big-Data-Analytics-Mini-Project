# 🚀 FraudLens - Setup & Testing Guide

## คู่มือการติดตั้งและทดสอบระบบ FraudLens

> 📌 **สำหรับ:** เพื่อนร่วมทีมที่ต้องการ clone และทดสอบระบบ  
> ⏱️ **เวลาที่ใช้:** ประมาณ 20-30 นาที

---

## 📋 สารบัญ

1. [Prerequisites (สิ่งที่ต้องมี)](#1-prerequisites-สิ่งที่ต้องมี)
2. [การติดตั้ง (Installation)](#2-การติดตั้ง-installation)
3. [การรันระบบ (Running the System)](#3-การรันระบบ-running-the-system)
4. [การทดสอบระบบ (Testing Guide)](#4-การทดสอบระบบ-testing-guide)
5. [การแก้ปัญหา (Troubleshooting)](#5-การแก้ปัญหา-troubleshooting)
6. [คำสั่งที่ใช้บ่อย (Useful Commands)](#6-คำสั่งที่ใช้บ่อย-useful-commands)

---

## 1. Prerequisites (สิ่งที่ต้องมี)

### 💻 ซอฟต์แวร์ที่ต้องติดตั้ง

| ซอฟต์แวร์ | Version | Download Link | หมายเหตุ |
|-----------|---------|---------------|----------|
| **Docker Desktop** | Latest | [Download](https://www.docker.com/products/docker-desktop) | **จำเป็นต้องมี** |
| **Git** | Latest | [Download](https://git-scm.com/downloads) | สำหรับ clone repo |
| **Web Browser** | Chrome/Firefox/Edge | - | สำหรับเปิด Dashboard |

### 💾 ความต้องการของระบบ

- **RAM:** 8GB ขึ้นไป (แนะนำ 16GB)
- **Disk Space:** 10GB ว่าง
- **OS:** Windows 10/11, macOS, หรือ Linux

### ⚠️ สิ่งสำคัญก่อนเริ่ม

1. **เปิด Docker Desktop** และรอจนมีสถานะ "Running" (ไอคอนสีเขียว)
2. ตรวจสอบว่า **Port 3000, 5433, 8000** ไม่ถูกใช้งาน

---

## 2. การติดตั้ง (Installation)

### ขั้นตอนที่ 2.1: Clone Repository

เปิด Terminal / PowerShell / Command Prompt:

```bash
# Clone repository
git clone https://github.com/nicky-wrc/Big-Data-Analytics-Mini-Project.git

# เข้าไปใน folder
cd Big-Data-Analytics-Mini-Project
```

### ขั้นตอนที่ 2.2: Download Dataset จาก Kaggle ⚠️ สำคัญมาก!

> ⚠️ **ไฟล์ CSV ไม่ได้อยู่ใน repo** เพราะมีขนาด ~150MB (เกิน GitHub limit 100MB)

**วิธี Download:**

1. ไปที่ https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud
2. Login ด้วย Google Account (ถ้ายังไม่มี account)
3. กดปุ่ม **"Download"** (ขวาบน)
4. จะได้ไฟล์ `archive.zip`
5. **แตก zip** จะได้ไฟล์ `creditcard.csv`
6. **Copy ไฟล์** `creditcard.csv` ไปวางที่:

```
Big-Data-Analytics-Mini-Project/
└── spark/
    └── data/
        └── creditcard.csv   <-- วางที่นี่!
```

**ตรวจสอบว่าวางถูกที่:**
```bash
# Windows
dir spark\data\

# Mac/Linux
ls spark/data/
```

ต้องเห็น `creditcard.csv` ในรายการ

---

## 3. การรันระบบ (Running the System)

### ขั้นตอนที่ 3.1: Build และ Start Docker Containers

```bash
# Build และ start ทุก services (ครั้งแรกใช้เวลา 3-5 นาที)
docker-compose up -d --build
```

**รอจน terminal แสดง:**
```
✔ Container fraudlens-db-1       Started
✔ Container fraudlens-backend-1  Started
✔ Container fraudlens-frontend-1 Started
```

### ขั้นตอนที่ 3.2: ตรวจสอบว่า Containers ทำงาน

```bash
docker-compose ps
```

**ต้องเห็น 3 containers มี State เป็น "Up":**
```
NAME                    STATUS
fraudlens-db-1          Up (healthy)
fraudlens-backend-1     Up
fraudlens-frontend-1    Up
```

### ขั้นตอนที่ 3.3: Seed ข้อมูลเข้า Database

```bash
# รันคำสั่งนี้เพื่อโหลดข้อมูล 284,807 transactions
docker-compose exec backend node src/seed.js
```

**สิ่งที่จะเห็น:**
```
[Seed] Loading CSV...
[Seed] Loaded 284807 rows
[Seed] Schema reset
[Seed] Inserted 5000/284807
[Seed] Inserted 10000/284807
...
[Seed] Done! Total inserted: 284807
```

> ⏱️ **ใช้เวลา:** ประมาณ 10-20 นาที  
> 💡 **Tips:** ไม่ต้องรอจนเสร็จ! เปิดเว็บดูได้เลย ข้อมูลจะเพิ่มขึ้นเรื่อยๆ

### ขั้นตอนที่ 3.4: เปิดใช้งาน Dashboard

เปิด Browser ไปที่: **http://localhost:3000**

🎉 **เสร็จเรียบร้อย!**

---

## 4. การทดสอบระบบ (Testing Guide)

### 🧪 Test Case 1: หน้า Overview Dashboard

**URL:** http://localhost:3000

**สิ่งที่ต้องเห็น:**
- [ ] Stats Cards 4 อัน (Total Transactions, Fraud Detected, High Risk, Total Volume)
- [ ] กราฟ Fraud Activity Over Time
- [ ] Pie Chart Transaction Classification
- [ ] Bar Chart Risk Level Distribution
- [ ] ตาราง Recent Transactions

**วิธีทดสอบ:**
1. ดูว่าตัวเลขใน Stats Cards มีค่า (ไม่ใช่ 0 ทั้งหมด)
2. กราฟแสดงข้อมูลถูกต้อง
3. ตารางแสดง transactions ได้

---

### 🧪 Test Case 2: หน้า Transaction Monitor

**URL:** http://localhost:3000/transactions

**สิ่งที่ต้องทดสอบ:**

| Test | วิธีทำ | ผลที่คาดหวัง |
|------|--------|-------------|
| **Filter Risk Level** | เลือก "High Risk" | แสดงเฉพาะ transactions ที่มี RISK = HIGH |
| **Filter Fraud Only** | เลือก Classification = "Fraud Only" | แสดงเฉพาะ transactions ที่เป็น fraud (actual_class = 1) |
| **Filter Legitimate** | เลือก Classification = "Legitimate Only" | แสดงเฉพาะ transactions ที่ไม่ใช่ fraud |
| **Filter Amount** | ใส่ Min = 100, Max = 500 | แสดง transactions ที่มี amount ระหว่าง 100-500 |
| **Pagination** | กดหน้าถัดไป | เปลี่ยนหน้าได้ถูกต้อง |
| **Clear Filter** | กด "Clear all" | ล้าง filter ทั้งหมด |
| **Click Row** | คลิกที่แถวใดก็ได้ | แสดง Modal รายละเอียด transaction |

---

### 🧪 Test Case 3: หน้า Analytics

**URL:** http://localhost:3000/analytics

**สิ่งที่ต้องทดสอบ:**

| Test | วิธีทำ | ผลที่คาดหวัง |
|------|--------|-------------|
| **Stats Display** | ดูหน้า | แสดง 5 stat cards ด้านบน |
| **Prediction Accuracy** | ดู accuracy bar | แสดงเปอร์เซ็นต์ accuracy (~99%) |
| **Time Series Chart** | ดูกราฟ | แสดง Area chart ปริมาณ transactions ตามเวลา |
| **Risk Pie Chart** | ดู Pie chart | แสดงสัดส่วน HIGH/MEDIUM/LOW |
| **Refresh Button** | กดปุ่ม Refresh | ข้อมูล refresh ใหม่ |
| **Export CSV** | กดปุ่ม "Export CSV" | Download ไฟล์ CSV ได้ |
| **Top Fraud Table** | ดูตารางด้านล่าง | แสดง 10 transactions ที่มี fraud probability สูงสุด |

---

### 🧪 Test Case 4: หน้า Model Insights

**URL:** http://localhost:3000/model

**สิ่งที่ต้องทดสอบ:**

| Test | วิธีทำ | ผลที่คาดหวัง |
|------|--------|-------------|
| **Model Buttons** | คลิกปุ่ม LogisticRegression, RandomForest, GradientBoosting | เปลี่ยน model ที่แสดง |
| **Metrics Cards** | ดู 5 metrics | แสดง Accuracy, Precision, Recall, F1, ROC AUC |
| **Radar Chart** | ดู Performance Radar | กราฟ Radar แสดงค่า metrics |
| **Bar Chart** | ดู Model Comparison | กราฟแท่งเปรียบเทียบ F1 Score |
| **Feature Importance** | ดูกราฟด้านล่าง | แสดง Top 15 features (V10, V14, V4...) |
| **Confusion Matrix** | ดู matrix | แสดง TP, TN, FP, FN |
| **Comparison Table** | ดูตารางล่างสุด | ตาราง metrics ของทั้ง 3 models |

**ค่า Metrics ที่ควรเห็น (Random Forest):**
- Accuracy: ~99.88%
- Precision: ~59.57%
- Recall: ~85.71%
- F1 Score: ~70.29%
- ROC AUC: ~98.00%

---

### 🧪 Test Case 5: หน้า Fraud Prediction

**URL:** http://localhost:3000/predict

**สิ่งที่ต้องทดสอบ:**

#### Test 5.1: ทดสอบ Default Values
1. กดปุ่ม **"Predict Fraud Risk"**
2. **ผลที่คาดหวัง:** แสดงผล LEGITIMATE, LOW RISK

#### Test 5.2: ทดสอบ Random Values
1. กดปุ่ม **"Random Values"**
2. กดปุ่ม **"Predict Fraud Risk"**
3. **ผลที่คาดหวัง:** แสดงผลการทำนาย (อาจเป็น HIGH/MEDIUM/LOW)

#### Test 5.3: ทดสอบ High Amount
1. กดปุ่ม **"Reset to Default"**
2. เปลี่ยน **Transaction Amount** เป็น `9999.99`
3. กดปุ่ม **"Predict Fraud Risk"**
4. **ผลที่คาดหวัง:** ยังคงทำนายได้ (amount สูงไม่ได้หมายความว่า fraud เสมอ)

#### Test 5.4: ทดสอบค่าที่น่าจะเป็น Fraud
1. ใส่ค่าเหล่านี้:
   - V14: `-15`
   - V10: `-10`
   - V12: `-10`
   - Amount: `1`
2. กดปุ่ม **"Predict Fraud Risk"**
3. **ผลที่คาดหวัง:** มีโอกาสสูงที่จะเป็น HIGH RISK

---

### 🧪 Test Case 6: หน้า API Documentation

**URL:** http://localhost:3000/api-docs

**สิ่งที่ต้องทดสอบ:**

| Test | วิธีทำ | ผลที่คาดหวัง |
|------|--------|-------------|
| **Page Load** | เปิดหน้า | แสดงรายการ API endpoints ทั้งหมด |
| **Copy Button** | กดปุ่ม Copy ที่ endpoint ใดก็ได้ | Copy path ไป clipboard |
| **Response Preview** | ดู Response section | แสดงตัวอย่าง JSON response |

---

### 🧪 Test Case 7: ทดสอบ REST API โดยตรง

เปิด Browser หรือใช้ Postman/curl:

#### API 1: Get Stats
```
GET http://localhost:8000/api/stats
```
**ผลที่คาดหวัง:** JSON ที่มี total_transactions, total_fraud, fraud_rate

#### API 2: Get Transactions
```
GET http://localhost:8000/api/transactions?page=1&limit=5
```
**ผลที่คาดหวัง:** JSON array ของ transactions

#### API 3: Get Fraud Only
```
GET http://localhost:8000/api/transactions?actual_class=1&limit=5
```
**ผลที่คาดหวัง:** JSON array ของ fraud transactions เท่านั้น

#### API 4: Prediction
```
POST http://localhost:8000/api/predict
Content-Type: application/json

{
  "features": [-1.35, -0.07, 2.53, 1.37, -0.33, 0.46, 0.23, 0.09, 0.36, 0.09, -0.55, -0.61, -0.99, -0.31, 1.46, -0.47, 0.20, 0.02, 0.40, 0.25, -0.01, 0.27, -0.11, 0.06, 0.12, -0.18, 0.13, -0.02, 149.62]
}
```
**ผลที่คาดหวัง:**
```json
{
  "prediction": 0,
  "is_fraud": false,
  "fraud_probability": 0.0483,
  "risk_level": "LOW",
  "model": "RandomForest"
}
```

#### API 5: Model Comparison
```
GET http://localhost:8000/api/stats/model-comparison
```
**ผลที่คาดหวัง:** JSON array ของ 3 models พร้อม metrics

#### API 6: Confusion Matrix
```
GET http://localhost:8000/api/stats/confusion-matrix
```
**ผลที่คาดหวัง:** JSON ที่มี tp, tn, fp, fn

---

## 5. การแก้ปัญหา (Troubleshooting)

### ❌ ปัญหา: Docker ไม่ทำงาน
```
error during connect: This error may indicate that the docker daemon is not running
```
**วิธีแก้:**
1. เปิด Docker Desktop
2. รอจน Docker มีสถานะ "Running"
3. ลองรันคำสั่งอีกครั้ง

---

### ❌ ปัญหา: Port ถูกใช้แล้ว
```
Error: bind: address already in use
```
**วิธีแก้:**
```bash
# Windows - หา process ที่ใช้ port 3000
netstat -ano | findstr :3000

# ปิด process (แทน PID ด้วยเลขที่ได้)
taskkill /PID <PID> /F
```

---

### ❌ ปัญหา: หน้าเว็บว่างเปล่า / ไม่มีข้อมูล
**วิธีแก้:**
1. ตรวจสอบว่า seed ทำงาน:
   ```bash
   docker-compose logs backend
   ```
2. รอให้ seed ทำงานสักครู่ แล้ว refresh หน้าเว็บ

---

### ❌ ปัญหา: Error "creditcard.csv not found"
```
Error: ENOENT: no such file or directory
```
**วิธีแก้:**
1. ตรวจสอบว่า download CSV จาก Kaggle แล้ว
2. ตรวจสอบว่าวางไฟล์ถูกที่: `spark/data/creditcard.csv`
3. Restart containers:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

---

### ❌ ปัญหา: Containers หยุดทำงาน
**วิธีแก้:**
```bash
# Reset ทั้งหมด
docker-compose down -v
docker-compose up -d --build

# Seed ใหม่
docker-compose exec backend node src/seed.js
```

---

### ❌ ปัญหา: Filter "Fraud Only" ไม่มีข้อมูล
**สาเหตุ:** Fraud มีแค่ 0.17% ของ dataset
**วิธีแก้:** รอให้ seed ทำงานนานขึ้น (อย่างน้อย 5-10 นาที)

---

## 6. คำสั่งที่ใช้บ่อย (Useful Commands)

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs (all)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Check status
docker-compose ps

# Reset everything (including database)
docker-compose down -v
```

### Database Commands

```bash
# เข้า PostgreSQL
docker-compose exec db psql -U postgres -d fraudlens

# ดูจำนวน transactions
docker-compose exec db psql -U postgres -d fraudlens -c "SELECT COUNT(*) FROM transactions;"

# ดูจำนวน fraud
docker-compose exec db psql -U postgres -d fraudlens -c "SELECT actual_class, COUNT(*) FROM transactions GROUP BY actual_class;"
```

---

## 📊 สรุป Checklist การทดสอบ

### ✅ Installation
- [ ] Clone repo สำเร็จ
- [ ] Download CSV จาก Kaggle
- [ ] วาง CSV ถูกที่ (spark/data/)
- [ ] Docker containers ทำงาน (3 containers)
- [ ] Seed database สำเร็จ

### ✅ Frontend Pages
- [ ] Overview Dashboard แสดงข้อมูลถูกต้อง
- [ ] Transaction Monitor - filters ทำงาน
- [ ] Analytics - กราฟและ export ทำงาน
- [ ] Model Insights - แสดง metrics 3 models
- [ ] Predict - ทำนายได้ถูกต้อง
- [ ] API Docs - แสดงเอกสาร

### ✅ API Endpoints
- [ ] GET /api/stats ✓
- [ ] GET /api/transactions ✓
- [ ] POST /api/predict ✓
- [ ] GET /api/stats/model-comparison ✓
- [ ] GET /api/stats/confusion-matrix ✓

---

## 📞 ติดต่อ

หากพบปัญหาที่แก้ไม่ได้ ติดต่อ: [ใส่ช่องทางติดต่อ]

---

**FraudLens** - Real-Time Credit Card Fraud Detection Platform  
Big Data Analytics Mini Project | 2026
