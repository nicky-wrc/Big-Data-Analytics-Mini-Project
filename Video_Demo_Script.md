# 🎬 Script วิดีโอ Demo: Credit Card Fraud Detection
# ระยะเวลาประมาณ: 10-15 นาที

---

## 🎬 Opening (30 วินาที)

**[แสดงหน้าจอ Title]**

พูด:
"สวัสดีครับ วันนี้จะมานำเสนอ Mini Project เรื่อง Credit Card Fraud Detection 
หรือการตรวจจับการฉ้อโกงบัตรเครดิต โดยใช้เทคนิค Big Data Analytics 
ด้วย Apache Spark และ Machine Learning ครับ"

---

## 🎬 Cell 1: Introduction & Dataset (1 นาที)

**[แสดง Cell 1 - Import Libraries]**

พูด:
"เริ่มต้นด้วยการ Import Libraries ที่จำเป็น ได้แก่
- PySpark สำหรับ Big Data Processing
- MLlib สำหรับ Machine Learning
- Matplotlib และ Seaborn สำหรับ Visualization

จากนั้นสร้าง SparkSession ซึ่งเป็นจุดเริ่มต้นในการใช้งาน Spark ครับ"

**[Run Cell แล้วแสดงผล]**

พูด:
"เราได้สร้าง SparkSession เรียบร้อยแล้ว พร้อมใช้งาน Spark ครับ"

---

## 🎬 Cell 2: Load Dataset (1 นาที)

**[แสดง Cell 2 - Load Dataset]**

พูด:
"ต่อไปโหลด Dataset ครับ เราใช้ Credit Card Fraud Detection Dataset จาก Kaggle
ซึ่งเป็นข้อมูลธุรกรรมบัตรเครดิตจริงจากธนาคารในยุโรป"

**[Run Cell แล้วแสดงผล]**

พูด:
"Dataset มีขนาด 284,807 rows และ 31 columns ถือว่าเป็น Big Data ขนาดใหญ่ครับ

Columns ประกอบด้วย:
- Time: เวลาที่เกิด transaction
- V1 ถึง V28: Features ที่ผ่าน PCA มาแล้ว เพื่อปกป้องความเป็นส่วนตัว
- Amount: จำนวนเงินในการทำธุรกรรม
- Class: 0 คือ Normal, 1 คือ Fraud ครับ"

---

## 🎬 Cell 3: Data Exploration (1 นาที)

**[แสดง Cell 3 - Class Distribution]**

พูด:
"มาดู Distribution ของข้อมูลกันครับ ว่ามี Fraud กี่ cases"

**[Run Cell แล้วแสดงผล]**

พูด:
"จากผลลัพธ์จะเห็นว่า:
- Normal transactions มี 284,315 รายการ คิดเป็น 99.83%
- Fraud transactions มีแค่ 492 รายการ คิดเป็น 0.17%

นี่คือปัญหา Imbalanced Data ที่พบบ่อยในงาน Fraud Detection 
อัตราส่วน Fraud ต่อ Normal คือ 1:577 ครับ"

---

## 🎬 Cell 4: Visualization - Class Distribution (1 นาที)

**[แสดง Cell 4 - Bar & Pie Chart]**

พูด:
"มา Visualize ข้อมูลกันครับ เพื่อให้เห็นภาพชัดเจนขึ้น"

**[Run Cell แล้วแสดงกราฟ]**

พูด:
"จากกราฟทางซ้ายเป็น Bar Chart แสดงจำนวน Transaction
จะเห็นว่า Normal มี 284,315 รายการ ส่วน Fraud มีแค่ 492 รายการ

กราฟทางขวาเป็น Pie Chart แสดงสัดส่วน
Fraud คิดเป็นแค่ 0.17% ของทั้งหมด ซึ่งน้อยมากครับ"

---

## 🎬 Cell 5: Visualization - Amount Distribution (1 นาที)

**[แสดง Cell 5 - Histogram]**

พูด:
"ต่อไปมาดู Distribution ของจำนวนเงินในแต่ละ Transaction ครับ"

**[Run Cell แล้วแสดงกราฟ]**

พูด:
"กราฟทางซ้ายแสดง Normal Transaction จะเห็นว่าส่วนใหญ่เป็นยอดเงินน้อยๆ

กราฟทางขวาแสดง Fraud Transaction ก็มีลักษณะคล้ายกัน

ค่าเฉลี่ย Normal อยู่ที่ 88.29 ดอลลาร์
ค่าเฉลี่ย Fraud อยู่ที่ 122.21 ดอลลาร์

Fraud มีค่าเฉลี่ยสูงกว่าเล็กน้อยครับ"

---

## 🎬 Cell 6: Data Preprocessing - Feature Vector (45 วินาที)

**[แสดง Cell 6 - VectorAssembler]**

พูด:
"ต่อไปเป็นขั้นตอน Data Preprocessing ครับ
เราใช้ VectorAssembler เพื่อรวม Features ทั้งหมด 29 ตัว 
ได้แก่ V1 ถึง V28 และ Amount ให้เป็น Vector เดียว
เพื่อใช้ใน Machine Learning ครับ"

**[Run Cell แล้วแสดงผล]**

พูด:
"สร้าง Feature Vector เรียบร้อยแล้ว มี 29 features ครับ"

---

## 🎬 Cell 7: Standardization (45 วินาที)

**[แสดง Cell 7 - StandardScaler]**

พูด:
"ขั้นตอนถัดไปคือ Standardization ครับ
เราใช้ StandardScaler เพื่อปรับ scale ของ features ให้มี mean เป็น 0 และ standard deviation เป็น 1
ซึ่งสำคัญมากก่อนทำ PCA และ Clustering ครับ"

**[Run Cell แล้วแสดงผล]**

พูด:
"Features ถูก scale เรียบร้อยแล้วครับ"

---

## 🎬 Cell 8: PCA (1 นาที)

**[แสดง Cell 8 - PCA]**

พูด:
"ต่อไปเป็น PCA หรือ Principal Component Analysis ครับ
เราลดมิติจาก 29 features เหลือ 2 components เพื่อใช้ใน Visualization"

**[Run Cell แล้วแสดงผล]**

พูด:
"ผลลัพธ์ PCA:
- PC1 เก็บ variance ได้ 6.75%
- PC2 เก็บ variance ได้ 3.45%
- รวมทั้งหมด 10.20%

ค่านี้ค่อนข้างต่ำเพราะข้อมูลมีความซับซ้อนสูง
แต่ยังสามารถใช้ Visualize เพื่อดู pattern เบื้องต้นได้ครับ"

---

## 🎬 Cell 9: PCA Visualization (1 นาที)

**[แสดง Cell 9 - PCA Scatter Plot]**

พูด:
"มา Visualize ข้อมูลหลังทำ PCA กันครับ"

**[Run Cell แล้วแสดงกราฟ]**

พูด:
"จากกราฟ จุดสีเขียวคือ Normal Transaction จุดสีแดงคือ Fraud

จะเห็นว่า Fraud ส่วนใหญ่กระจุกตัวอยู่บริเวณที่ PC2 มีค่าสูง
แสดงว่า Fraud มี pattern ที่แตกต่างจาก Normal พอสมควร
ซึ่งเป็นสัญญาณที่ดีว่า Machine Learning น่าจะสามารถแยกแยะได้ครับ"

---

## 🎬 Cell 10: K-Means Clustering (1 นาที)

**[แสดง Cell 10 - K-Means]**

พูด:
"ต่อไปเป็น K-Means Clustering ครับ
เราจะจัดกลุ่ม Transactions ออกเป็น 3 กลุ่ม
เพื่อดูว่า Fraud กระจายอยู่ใน Cluster ไหนบ้าง"

**[Run Cell แล้วแสดงผล]**

พูด:
"ผลลัพธ์ K-Means:
- Cluster 0 มี 131,917 transactions
- Cluster 1 มี 77,067 transactions
- Cluster 2 มี 75,823 transactions

และเมื่อดู Fraud ในแต่ละ Cluster:
- Cluster 0 มี Fraud 49 cases
- Cluster 1 มี Fraud 204 cases
- Cluster 2 มี Fraud 239 cases

แสดงว่า Fraud กระจุกตัวอยู่ใน Cluster 1 และ 2 มากกว่า Cluster 0 ครับ"

---

## 🎬 Cell 11: K-Means Evaluation & Visualization (1 นาที)

**[แสดง Cell 11 - Cluster Analysis]**

พูด:
"มาดู Fraud Rate ในแต่ละ Cluster กันครับ"

**[Run Cell แล้วแสดงกราฟ]**

พูด:
"Silhouette Score ได้ 0.0261 ซึ่งค่อนข้างต่ำ แสดงว่า Clusters ไม่ได้แยกจากกันชัดเจนนัก

แต่เมื่อดู Fraud Rate:
- Cluster 0: 0.037% (ต่ำสุด)
- Cluster 1: 0.265%
- Cluster 2: 0.315% (สูงสุด)

Cluster 2 มี Fraud Rate สูงกว่า Cluster 0 ถึง 8 เท่า
นี่คือ insight ที่สำคัญสำหรับการตรวจจับ Fraud ครับ"

---

## 🎬 Cell 12: Random Forest Classification (1.5 นาที)

**[แสดง Cell 12 - Random Forest]**

พูด:
"ต่อไปเป็น Classification ครับ เราจะใช้ Random Forest ในการทำนายว่า Transaction ไหนเป็น Fraud

ขั้นตอนแรกคือแบ่งข้อมูลเป็น Training 80% และ Test 20%
จากนั้นสร้าง Random Forest Model ด้วย 100 trees และ max depth 10"

**[Run Cell แล้วแสดงผล]**

พูด:
"Training set มี 228,162 rows
Test set มี 56,645 rows

Model trained เรียบร้อยแล้ว ใช้เวลาประมาณ 1-2 นาที
เนื่องจากข้อมูลมีขนาดใหญ่ครับ"

---

## 🎬 Cell 13: Model Evaluation (1 นาที)

**[แสดง Cell 13 - Evaluation Metrics]**

พูด:
"มาดูผลการประเมิน Model กันครับ"

**[Run Cell แล้วแสดงผล]**

พูด:
"ผลลัพธ์ Random Forest:
- Accuracy: 99.93% ดีมากครับ
- Precision: 0.9993
- Recall: 0.9993
- F1 Score: 0.9993
- AUC-ROC: 0.9729

AUC-ROC 0.9729 แสดงว่า Model สามารถแยกแยะ Fraud กับ Normal ได้ดีมากครับ"

---

## 🎬 Cell 14: Confusion Matrix (1 นาที)

**[แสดง Cell 14 - Confusion Matrix]**

พูด:
"มาดู Confusion Matrix กันครับ เพื่อดูรายละเอียดการทำนาย"

**[Run Cell แล้วแสดงกราฟ]**

พูด:
"จาก Confusion Matrix:
- True Negative: 56,539 คือ Normal ที่ทำนายถูกว่าเป็น Normal
- False Positive: 6 คือ Normal ที่ทำนายผิดว่าเป็น Fraud
- False Negative: 33 คือ Fraud ที่ทำนายผิดว่าเป็น Normal
- True Positive: 67 คือ Fraud ที่ทำนายถูกว่าเป็น Fraud

Fraud Detection Rate หรือ Recall อยู่ที่ 67%
หมายความว่าจาก Fraud 100 cases เราจับได้ 67 cases ครับ"

---

## 🎬 Cell 15: Feature Importance (1 นาที)

**[แสดง Cell 15 - Feature Importance]**

พูด:
"สุดท้ายมาดู Feature Importance กันครับ ว่า Features ไหนสำคัญที่สุดในการตรวจจับ Fraud"

**[Run Cell แล้วแสดงกราฟ]**

พูด:
"Top 5 Features ที่สำคัญที่สุด:
1. V12 - ความสำคัญ 13.5%
2. V17 - ความสำคัญ 11.5%
3. V7 - ความสำคัญ 8.1%
4. V16 - ความสำคัญ 7.2%
5. V10 - ความสำคัญ 6.5%

Features เหล่านี้มีอิทธิพลมากที่สุดในการตัดสินว่า Transaction ไหนเป็น Fraud ครับ"

---

## 🎬 Cell 16: Summary Report (1 นาที)

**[แสดง Cell 16 - Summary]**

พูด:
"มาถึง Cell สุดท้าย สรุปผลทั้งหมดครับ"

**[Run Cell แล้วแสดงผล]**

พูด:
"สรุปผลการวิเคราะห์:

Dataset:
- 284,807 transactions
- Fraud Rate 0.17%

PCA:
- ลดเหลือ 2 components
- เก็บ variance 10.20%

K-Means Clustering:
- 3 clusters
- Cluster 2 มี Fraud Rate สูงสุด 0.315%

Random Forest Classification:
- Accuracy 99.93%
- AUC-ROC 0.9729

Top Features: V12, V17, V7, V16, V10 ครับ"

---

## 🎬 Closing (30 วินาที)

**[แสดงหน้าจอสรุป]**

พูด:
"สรุปจาก Mini Project นี้ เราสามารถใช้ Big Data Analytics และ Machine Learning 
ในการตรวจจับการฉ้อโกงบัตรเครดิตได้อย่างมีประสิทธิภาพ

โดยใช้เทคนิค:
- PCA สำหรับ Dimensionality Reduction
- K-Means สำหรับ Clustering
- Random Forest สำหรับ Classification

ซึ่งสามารถนำไปประยุกต์ใช้กับธนาคารและสถาบันการเงินได้จริง

ขอบคุณที่รับชมครับ"

---

## 📝 Tips สำหรับการถ่ายวิดีโอ

1. **เตรียม Notebook** - Run ทุก Cell ไว้ก่อน เพื่อไม่ต้องรอ
2. **ซ้อมพูด** - ซ้อม 2-3 รอบก่อนถ่ายจริง
3. **พูดช้าๆ ชัดๆ** - ไม่ต้องรีบ
4. **Zoom หน้าจอ** - ให้ผลลัพธ์และกราฟเห็นชัด
5. **ใช้ Mouse ชี้** - ชี้ส่วนสำคัญขณะอธิบาย
6. **ตัดต่อ** - ตัดส่วนที่ผิดพลาดออก

---

## ⏱️ สรุปเวลาแต่ละ Section

| Section | เวลา |
|---------|------|
| Opening | 30 วินาที |
| Cell 1-2 (Setup & Load) | 2 นาที |
| Cell 3-5 (Exploration & Viz) | 3 นาที |
| Cell 6-9 (Preprocessing & PCA) | 3.5 นาที |
| Cell 10-11 (K-Means) | 2 นาที |
| Cell 12-15 (Classification) | 4.5 นาที |
| Cell 16 (Summary) | 1 นาที |
| Closing | 30 วินาที |
| **รวม** | **~15 นาที** |

---

# 🎉 Good Luck กับการถ่ายวิดีโอครับ!
