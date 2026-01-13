# การตรวจจับการฉ้อโกงบัตรเครดิตด้วย Apache Spark (Credit Card Fraud Detection)

![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat-square)
![Spark](https://img.shields.io/badge/Apache_Spark-PySpark-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Completed-success?style=flat-square)

## บทสรุปผู้บริหาร (Project Overview)
โครงการนี้เป็นส่วนหนึ่งของรายวิชา **Big Data Analytics** โดยมีวัตถุประสงค์เพื่อพัฒนาระบบตรวจจับธุรกรรมบัตรเครดิตที่ผิดปกติ (Fraud Detection) โดยประยุกต์ใช้เทคโนโลยีการประมวลผลข้อมูลขนาดใหญ่ (Big Data)

ความท้าทายหลักของชุดข้อมูลนี้คือ **ความไม่สมดุลของข้อมูล (Imbalanced Data)** ซึ่งมีสัดส่วนของธุรกรรมฉ้อโกงเพียง 0.17% ของข้อมูลทั้งหมด คณะผู้จัดทำจึงได้ออกแบบกระบวนการทำงานแบบ **End-to-End Machine Learning Pipeline** บน Apache Spark โดยเลือกใช้โมเดล **Random Forest Classifier** เพื่อให้ได้ผลลัพธ์ที่มีความแม่นยำสูงทั้งในด้าน Precision และ Recall

## รายละเอียดชุดข้อมูล (Dataset)
ข้อมูลที่ใช้ในการวิเคราะห์ได้มาจาก [Kaggle: Credit Card Fraud Detection Dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)

* **จำนวนข้อมูล:** 284,807 รายการ (Transactions)
* **คุณลักษณะ (Features):** ประกอบด้วย 30 ตัวแปร
    * `Time`, `Amount`
    * `V1` ถึง `V28` (เป็นข้อมูลที่ผ่านการทำ PCA เพื่อปกป้องข้อมูลส่วนบุคคล)
* **ตัวแปรเป้าหมาย (Target):** `Class`
    * `0` = ธุรกรรมปกติ (Normal)
    * `1` = ธุรกรรมฉ้อโกง (Fraud)

## เครื่องมือและเทคโนโลยี (Tech Stack)
โครงการนี้พัฒนาโดยใช้สภาพแวดล้อมและเครื่องมือ ดังนี้:

* **Core Engine:** Apache Spark (PySpark) - สำหรับประมวลผลข้อมูลขนาดใหญ่แบบขนาน
* **Language:** Python
* **IDE:** Visual Studio Code / Jupyter Notebook
* **Libraries ที่สำคัญ:**
    * `pyspark.ml`: สำหรับสร้าง ML Pipeline, Feature Engineering และ Model Training
    * `scikit-learn`: สำหรับการวัดผลโมเดลขั้นสูง (Confusion Matrix, Classification Report)
    * `pandas` & `seaborn`: สำหรับการสร้างภาพข้อมูล (Data Visualization)

## ระเบียบวิธีวิจัย (Methodology)
ทางคณะผู้จัดทำได้วางแผนกระบวนการวิเคราะห์ข้อมูล (Data Analytics Pipeline) ดังนี้:

1.  **Data Ingestion:** การนำเข้าข้อมูลเข้าสู่ Spark Session โดยมีการปรับจูน Configuration เพื่อประสิทธิภาพสูงสุด
2.  **Exploratory Data Analysis (EDA):** การสำรวจข้อมูลและตรวจสอบการกระจายตัวของคลาส (Class Imbalance Investigation)
3.  **Feature Engineering:** การเตรียมข้อมูลสำหรับโมเดล
    * ใช้ `VectorAssembler` ในการรวมคุณลักษณะ
    * ใช้ `StandardScaler` เพื่อปรับมาตรฐานข้อมูล (Normalization)
4.  **Modeling:** การสร้างโมเดลจำแนกประเภทด้วย **Random Forest Classifier** เนื่องจากมีความทนทานต่อข้อมูลที่ไม่สมดุลและลดโอกาสเกิด Overfitting
5.  **Evaluation:** การประเมินผลแบบผสมผสาน (Hybrid Evaluation) ระหว่าง Spark Evaluator และ Scikit-learn Metrics

## ผลลัพธ์การดำเนินงาน (Experimental Results)
เนื่องจากข้อมูลมีความไม่สมดุลสูง การวัดผลจึงให้ความสำคัญกับค่า **F1-Score** และ **Recall** มากกว่าค่า Accuracy เพียงอย่างเดียว

| ตัวชี้วัด (Metric) | ผลลัพธ์ (Score) |
| :--- | :--- |
| **Accuracy** | *[ใส่ค่าที่ได้ เช่น 99.95%]* |
| **Precision (Fraud)** | *[ใส่ค่าที่ได้ เช่น 0.94]* |
| **Recall (Fraud)** | *[ใส่ค่าที่ได้ เช่น 0.81]* |
| **F1-Score** | *[ใส่ค่าที่ได้ เช่น 0.87]* |

> **หมายเหตุ:** สามารถดูตาราง Confusion Matrix ฉบับเต็มได้ในไฟล์ Notebook

## ขั้นตอนการติดตั้งและใช้งาน (Installation)
หากต้องการทดสอบระบบหรือรันโค้ดซ้ำ สามารถทำตามขั้นตอนได้ดังนี้:

1.  **เตรียมความพร้อม:** ตรวจสอบว่าเครื่องคอมพิวเตอร์ติดตั้ง Java (JDK 8 หรือ 11) และ Python เรียบร้อยแล้ว
2.  **ติดตั้ง Libraries:**
    ```bash
    pip install pyspark scikit-learn pandas seaborn matplotlib findspark
    ```
3.  **เตรียมข้อมูล:** ดาวน์โหลดไฟล์ `creditcard.csv` และนำไปวางในโฟลเดอร์หลักของโปรเจกต์
4.  **การประมวลผล:** เปิดไฟล์ `fraud_detection_demo.ipynb` ผ่าน VS Code หรือ Jupyter และกด Run All Cells

## สมาชิกในกลุ่ม
* **[ชื่อ-นามสกุล Nicky]** - ผู้พัฒนาโมเดล, จัดทำ Demo และวิดีโอสาธิต
* **[ชื่อ-นามสกุล เพื่อนคนที่ 2]** - จัดทำรายงานส่วนบทนำ ทฤษฎีที่เกี่ยวข้อง และระเบียบวิธีวิจัย
* **[ชื่อ-นามสกุล เพื่อนคนที่ 3]** - จัดทำรายงานส่วนผลการวิเคราะห์ สรุปผล และข้อเสนอแนะ

---
*Mini-Project รายวิชา Big Data Analytics | [ชื่อมหาวิทยาลัยของคุณ]*