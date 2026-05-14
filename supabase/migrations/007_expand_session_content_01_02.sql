-- Migration 007: Expand session content for sessions 01-02
-- Rich educational content for complete beginners

UPDATE sessions SET
  content_en = $en01$
# Session 01 — Introduction to Data Analytics & The Data Analyst Career

## Welcome to Your Data Journey

You are about to learn one of the most valuable skills of the 21st century. Data analytics is everywhere — from the recommendations Netflix shows you, to how Tokopedia decides which products appear at the top of your search results, to how a hospital decides how many nurses to schedule on a Monday morning.

The best news? You do not need to be a math genius or a computer science graduate. You need curiosity, a willingness to ask questions, and the patience to learn step by step. That is exactly what this course is designed for.

---

## What Is Data Analytics? (Think Like a Detective)

Imagine you are a detective. Someone walks into your office and says, "My sales dropped 30% last month — I don't know why." Your job is not to guess. Your job is to gather **clues** (data), examine them carefully, look for patterns, and come to a conclusion backed by evidence.

That is exactly what a data analyst does.

> **Data Analytics** is the process of examining raw data to find patterns, draw conclusions, and support decision-making.

The "raw data" is your clues. Your tools — Excel, SQL, Python — are your magnifying glass and notebook. The "conclusion" is your recommendation to the business.

### A Simple Real-World Example

A café owner in Jakarta notices that revenue dropped last Tuesday. She asks her data analyst: "What happened?"

The analyst looks at the data and finds:
- Sales of hot drinks dropped 60% on Tuesday
- Weather data shows Tuesday was the hottest day of the month (38°C)
- Cold drinks sales went UP 40%

**Conclusion:** Customers switched to cold drinks. The café should stock more cold beverages when heatwaves are forecast.

This is data analytics in its purest form. A question → data → insight → action.

---

## The Four Types of Analytics

Not all analytics is the same. There is a spectrum from simple to complex, and each type answers a different kind of question.

### 1. Descriptive Analytics — "What Happened?"

This is the most common type. You are summarizing past data to understand what occurred.

**Example:** "Our app had 50,000 active users last month. The most popular feature was the payment page. Tuesday had the highest traffic."

Tools: Excel pivot tables, simple SQL queries, dashboards in Tableau or Looker Studio.

Think of this as writing the **police report** — just the facts of what happened.

### 2. Diagnostic Analytics — "Why Did It Happen?"

Now you dig deeper. You already know *what* happened, and you want to understand *why*.

**Example:** "Active users dropped 20% in week 3. Diagnostic analysis reveals that our app had a performance bug on Android devices starting Monday of week 3, causing users to uninstall."

Tools: Drill-down analysis, correlation analysis, comparing segments.

Think of this as the **investigation** phase — finding the root cause.

### 3. Predictive Analytics — "What Will Happen?"

Using historical patterns to forecast the future.

**Example:** "Based on the last 2 years of sales data, we predict that December sales will be 40% higher than November. We should hire 15 temporary staff."

Tools: Statistical models, machine learning, time-series forecasting.

Think of this as the detective making a **prediction** about the criminal's next move based on past behavior.

### 4. Prescriptive Analytics — "What Should We Do?"

The most advanced type. Not only predicts what will happen, but recommends the best action.

**Example:** "Our model predicts a 25% drop in customer retention next quarter. It recommends sending personalized discount emails to the 500 customers most at risk of churning, which will cost Rp 5 million but prevent Rp 40 million in lost revenue."

Tools: Optimization algorithms, simulation, AI/ML models.

Think of this as the detective not just solving the crime, but **preventing the next one**.

---

## Data Analyst vs Data Scientist vs Data Engineer

These three roles are often confused, even by people in the industry. Here is a clear comparison:

| Aspect | Data Analyst | Data Scientist | Data Engineer |
|---|---|---|---|
| **Main Question** | What happened? Why? | What will happen? | How do we collect & store data? |
| **Primary Tools** | SQL, Excel, Tableau | Python, R, ML libraries | Python, Spark, Airflow, dbt |
| **Output** | Reports, dashboards | Predictive models | Data pipelines, warehouses |
| **Math Required** | Basic statistics | Advanced statistics, calculus | Moderate |
| **Coding Required** | SQL (essential), Python (helpful) | Python/R (essential) | Python, Scala (essential) |
| **Who They Talk To** | Business stakeholders daily | Data team + stakeholders | Mostly engineers |
| **Salary in Indonesia (2024)** | Rp 6–25 juta/bulan | Rp 12–45 juta/bulan | Rp 10–40 juta/bulan |

### Which One Should You Become?

If you like translating numbers into business stories → **Data Analyst**
If you love building prediction models and AI → **Data Scientist**
If you love building the infrastructure that makes data possible → **Data Engineer**

This course focuses on the Data Analyst path, which is the most accessible entry point into the data world.

---

## A Day in the Life of a Data Analyst at an Indonesian Company

Let me walk you through a typical day for Rini, a junior data analyst at a mid-sized e-commerce company in Jakarta.

**9:00 AM — Morning standup**
Rini joins a 15-minute Zoom call with her team. The product manager asks: "Can you check why our checkout conversion rate dropped yesterday?"

**9:15 AM — Data exploration**
Rini opens the company's data warehouse (a large database) and writes a SQL query to pull checkout data from the past 7 days. She compares yesterday's numbers to the same day last week.

**10:30 AM — Found it!**
She notices the drop only happened on mobile devices using the iOS app. She cross-references with the engineering deploy log and finds that a new app version was released at 2 PM yesterday.

**11:00 AM — She builds a quick chart**
Using Looker Studio, she creates a simple line chart showing conversion rate before and after the deploy, broken down by platform.

**11:30 AM — She shares her findings**
She sends a Slack message with the chart and writes: "Conversion rate on iOS dropped from 3.2% to 1.8% after the v2.3.1 deploy yesterday at 2 PM. Android and web are unaffected. Recommend rollback or hotfix."

**2:00 PM — Regular reporting**
Rini updates the weekly business dashboard with the latest numbers on revenue, active users, and top-selling products.

**4:00 PM — Ad-hoc request**
The marketing team asks for a list of users who bought a product in the "Electronics" category in the last 30 days but have not bought anything in the last 7 days. They want to run a re-engagement campaign. Rini writes the SQL query and exports a CSV.

**5:30 PM — Done for the day**

Notice: Rini did not use machine learning. She did not write complex algorithms. She asked good questions, queried data, made a clear chart, and communicated findings clearly. That is the job.

---

## The Data Workflow: From Question to Decision

Every data project — big or small — follows the same basic workflow. Think of it as a recipe.

### Step 1: Business Question
Everything starts with a question from the business. Good questions are specific.

- Bad: "How are sales?"
- Good: "Did our Ramadan promotion increase average order value among first-time customers in Java?"

### Step 2: Data Collection
Where is the data? It might be in a database, a spreadsheet, a Google Analytics report, a CRM system, or all of these. The analyst finds and pulls the relevant data.

### Step 3: Data Cleaning
Raw data is almost always messy. Customers spelled their city as "Jakarta", "jakarta", "JKT", and "Jkt". Products have missing prices. Orders have duplicate entries. This step — often called **data wrangling** — can take 60–80% of a project's time.

### Step 4: Analysis
Now you actually look at the data. Calculate aggregates, find trends, compare segments, spot anomalies.

### Step 5: Visualization
Numbers in a table are hard to understand. A good chart tells the story instantly. This step turns your analysis into something a non-technical manager can grasp in 10 seconds.

### Step 6: Decision & Action
The analysis reaches a decision-maker who acts on it. The analyst's job is done when the business has a clear, evidence-based recommendation.

---

## Skills You Will Learn in This Course

### SQL — The Most Important Skill
SQL (Structured Query Language) is the language of databases. If data is stored somewhere, SQL is how you ask for it. Every data role requires SQL. It is non-negotiable.

**Why it matters:** 90% of company data lives in relational databases. SQL is your key.

### Excel / Google Sheets — Still Essential
Do not let anyone tell you Excel is "old." It is used in every company in Indonesia, from a 2-person startup to Bank BCA. For quick analysis, pivot tables, and sharing results with non-technical colleagues, nothing beats it.

**Why it matters:** It is the universal language of business data.

### Python — Your Power Tool
Python lets you automate repetitive tasks, analyze millions of rows that would crash Excel, and eventually build machine learning models.

**Why it matters:** When Excel and SQL are not enough, Python is the next step.

### Visualization Tools — Making Data Speak
Tools like Tableau, Looker Studio (free!), or Power BI turn your data into interactive dashboards. A beautiful dashboard can communicate what a 20-page report cannot.

**Why it matters:** Insights that are not communicated clearly are wasted.

### Statistics — Your Bullshit Detector
Understanding basic statistics helps you avoid being fooled by misleading numbers and helps you make confident claims.

**Why it matters:** "Our new feature increased revenue by 50%!" — was that statistically significant, or just random variation?

---

## Career Path and Salary in Indonesia (2024)

| Level | Experience | Salary Range | What You Do |
|---|---|---|---|
| **Junior Data Analyst** | 0–2 years | Rp 5–10 juta/bulan | Pull reports, clean data, answer ad-hoc questions |
| **Data Analyst** | 2–4 years | Rp 10–18 juta/bulan | Own dashboards, lead small projects, mentor juniors |
| **Senior Data Analyst** | 4–7 years | Rp 18–30 juta/bulan | Drive strategic analysis, define metrics, work with leadership |
| **Lead / Principal Analyst** | 7+ years | Rp 30–50 juta/bulan | Set data strategy, manage a team, influence company direction |

Companies actively hiring data analysts in Indonesia: Gojek, Tokopedia, Shopee, Traveloka, Bank Central Asia, Bank Mandiri, Telkomsel, Akulaku, and hundreds of smaller startups.

---

## How This 12-Session Course Maps to Real Skills

| Sessions | Topic | Real-World Application |
|---|---|---|
| 01 | Introduction | Understanding the field |
| 02 | Excel | Quick analysis, reporting |
| 03 | Statistics | Interpreting results correctly |
| 04–06 | SQL (Basic → Advanced) | Querying databases daily |
| 07–08 | Python | Automation, advanced analysis |
| 09–10 | Data Visualization | Building dashboards |
| 11 | Capstone Project | Simulating a real work project |
| 12 | Career & Portfolio | Landing your first job |

By the end of this course, you will have the skills to apply for a junior data analyst role and the portfolio to prove it.

---

## Key Takeaways

- Data analytics is about turning raw information into clear decisions.
- The four types of analytics range from "what happened" to "what should we do."
- A data analyst focuses on business questions, SQL, visualization, and communication.
- The typical workflow: Question → Collect → Clean → Analyze → Visualize → Decide.
- Career paths are clear and salaries are competitive in Indonesia.

**Next session:** We start with the tool you probably already have on your computer — Microsoft Excel.
$en01$,
  content_id = $id01$
# Sesi 01 — Pengenalan Data Analytics & Karier Data Analyst

## Selamat Datang di Perjalanan Data Kamu

Kamu akan mempelajari salah satu skill paling berharga di abad ke-21 ini. Data analytics ada di mana-mana — mulai dari rekomendasi yang ditampilkan Netflix, cara Tokopedia menentukan produk apa yang muncul paling atas di hasil pencarian, hingga bagaimana rumah sakit memutuskan berapa banyak perawat yang perlu dijadwalkan pada hari Senin pagi.

Kabar baiknya? Kamu tidak perlu jadi ahli matematika atau lulusan ilmu komputer. Yang kamu butuhkan adalah rasa ingin tahu, kemauan untuk terus bertanya, dan kesabaran untuk belajar selangkah demi selangkah. Itulah yang dirancang oleh kursus ini.

---

## Apa Itu Data Analytics? (Berpikir Seperti Detektif)

Bayangkan kamu adalah seorang detektif. Seseorang datang ke kantormu dan berkata, "Penjualan saya turun 30% bulan lalu — saya tidak tahu kenapa." Tugasmu bukan menebak-nebak. Tugasmu adalah mengumpulkan **petunjuk** (data), memeriksa dengan seksama, mencari pola, dan mengambil kesimpulan berdasarkan bukti.

Itulah persis yang dilakukan seorang data analyst.

> **Data Analytics** adalah proses memeriksa data mentah untuk menemukan pola, menarik kesimpulan, dan mendukung pengambilan keputusan.

"Data mentah" adalah petunjukmu. Alat-alatmu — Excel, SQL, Python — adalah kaca pembesar dan buku catatanmu. "Kesimpulan" adalah rekomendasimu kepada bisnis.

### Contoh Nyata yang Sederhana

Seorang pemilik kafe di Jakarta menyadari pendapatannya turun pada Selasa lalu. Dia bertanya kepada data analyst-nya: "Apa yang terjadi?"

Sang analyst melihat data dan menemukan:
- Penjualan minuman panas turun 60% pada hari Selasa
- Data cuaca menunjukkan Selasa adalah hari terpanas bulan itu (38°C)
- Penjualan minuman dingin justru NAIK 40%

**Kesimpulan:** Pelanggan beralih ke minuman dingin. Kafe harus menyediakan lebih banyak minuman dingin saat gelombang panas diprediksi.

Inilah data analytics dalam bentuk paling murni. Pertanyaan → data → insight → tindakan.

---

## Empat Jenis Analytics

Tidak semua analytics itu sama. Ada spektrum dari yang sederhana ke yang kompleks, dan setiap jenis menjawab pertanyaan yang berbeda.

### 1. Descriptive Analytics — "Apa yang Terjadi?"

Ini jenis yang paling umum. Kamu merangkum data masa lalu untuk memahami apa yang terjadi.

**Contoh:** "Aplikasi kami memiliki 50.000 pengguna aktif bulan lalu. Fitur paling populer adalah halaman pembayaran. Hari Selasa memiliki traffic tertinggi."

Alat: Pivot table Excel, query SQL sederhana, dashboard di Tableau atau Looker Studio.

### 2. Diagnostic Analytics — "Kenapa Hal Itu Terjadi?"

Kamu menggali lebih dalam. Kamu sudah tahu *apa* yang terjadi, dan kamu ingin memahami *mengapa*.

**Contoh:** "Pengguna aktif turun 20% di minggu ke-3. Analisis diagnostik mengungkap bahwa aplikasi kami memiliki bug performa pada perangkat Android mulai hari Senin minggu ke-3."

### 3. Predictive Analytics — "Apa yang Akan Terjadi?"

Menggunakan pola historis untuk memprediksi masa depan.

**Contoh:** "Berdasarkan data penjualan 2 tahun terakhir, kami memprediksi penjualan Desember akan 40% lebih tinggi dari November. Kami harus merekrut 15 staf sementara."

### 4. Prescriptive Analytics — "Apa yang Harus Dilakukan?"

Jenis paling canggih. Tidak hanya memprediksi apa yang akan terjadi, tetapi merekomendasikan tindakan terbaik.

**Contoh:** "Model kami memprediksi penurunan retensi pelanggan 25% kuartal depan. Model ini merekomendasikan pengiriman email diskon personal kepada 500 pelanggan yang paling berisiko churn."

---

## Data Analyst vs Data Scientist vs Data Engineer

| Aspek | Data Analyst | Data Scientist | Data Engineer |
|---|---|---|---|
| **Pertanyaan Utama** | Apa yang terjadi? Kenapa? | Apa yang akan terjadi? | Bagaimana kita mengumpulkan & menyimpan data? |
| **Alat Utama** | SQL, Excel, Tableau | Python, R, library ML | Python, Spark, Airflow, dbt |
| **Output** | Laporan, dashboard | Model prediktif | Pipeline data, warehouse |
| **Matematika** | Statistik dasar | Statistik lanjutan, kalkulus | Sedang |
| **Coding** | SQL (wajib), Python (membantu) | Python/R (wajib) | Python, Scala (wajib) |
| **Gaji di Indonesia (2024)** | Rp 6–25 juta/bulan | Rp 12–45 juta/bulan | Rp 10–40 juta/bulan |

---

## Sehari dalam Kehidupan Data Analyst di Perusahaan Indonesia

Mari ikuti hari kerja Rini, junior data analyst di perusahaan e-commerce di Jakarta.

**09.00 — Standup pagi**
Rini ikut Zoom 15 menit dengan timnya. Product manager bertanya: "Bisa cek kenapa conversion rate checkout kita turun kemarin?"

**09.15 — Eksplorasi data**
Rini membuka data warehouse perusahaan dan menulis query SQL untuk menarik data checkout 7 hari terakhir. Dia membandingkan angka kemarin dengan hari yang sama minggu lalu.

**10.30 — Ketemu!**
Dia melihat penurunan hanya terjadi di perangkat mobile iOS. Dia memeriksa log deploy engineering dan menemukan versi aplikasi baru dirilis pukul 14.00 kemarin.

**11.00 — Membuat grafik cepat**
Menggunakan Looker Studio, dia membuat line chart yang menunjukkan conversion rate sebelum dan sesudah deploy.

**11.30 — Berbagi temuan**
Dia mengirim pesan Slack dengan chart dan menulis: "Conversion rate di iOS turun dari 3,2% ke 1,8% setelah deploy v2.3.1 kemarin pukul 14.00. Android dan web tidak terpengaruh. Rekomendasi: rollback atau hotfix."

Perhatikan: Rini tidak menggunakan machine learning. Dia tidak menulis algoritma kompleks. Dia mengajukan pertanyaan yang tepat, query data, membuat chart yang jelas, dan mengkomunikasikan temuan dengan baik. Itulah pekerjaannya.

---

## Alur Kerja Data: Dari Pertanyaan ke Keputusan

### Langkah 1: Pertanyaan Bisnis
Pertanyaan yang baik itu spesifik.
- Buruk: "Bagaimana penjualan kita?"
- Baik: "Apakah promosi Ramadan kita meningkatkan rata-rata nilai pesanan di kalangan pelanggan baru di Pulau Jawa?"

### Langkah 2: Pengumpulan Data
Di mana datanya? Bisa di database, spreadsheet, laporan Google Analytics, sistem CRM.

### Langkah 3: Pembersihan Data
Data mentah hampir selalu berantakan. Pelanggan menuliskan kotanya sebagai "Jakarta", "jakarta", "JKT", dan "Jkt". Produk ada yang harganya kosong. Pesanan ada yang duplikat. Langkah ini — sering disebut **data wrangling** — bisa memakan 60–80% waktu proyek.

### Langkah 4: Analisis
Sekarang kamu benar-benar melihat datanya. Hitung agregat, temukan tren, bandingkan segmen.

### Langkah 5: Visualisasi
Angka dalam tabel sulit dipahami. Grafik yang bagus menceritakan kisahnya seketika.

### Langkah 6: Keputusan & Tindakan
Analisis sampai ke pengambil keputusan yang bertindak berdasarkan itu.

---

## Skill yang Akan Kamu Pelajari

### SQL — Skill Paling Penting
SQL (Structured Query Language) adalah bahasa database. Jika data disimpan di suatu tempat, SQL adalah cara kamu memintanya. Setiap peran data membutuhkan SQL.

### Excel / Google Sheets — Tetap Penting
Jangan percaya siapa pun yang bilang Excel sudah "kuno." Excel digunakan di setiap perusahaan di Indonesia, dari startup 2 orang sampai Bank BCA.

### Python — Alat Andalanmu
Python memungkinkan kamu mengotomatiskan tugas berulang, menganalisis jutaan baris yang akan membuat Excel crash.

### Tools Visualisasi — Membuat Data Berbicara
Tableau, Looker Studio (gratis!), atau Power BI mengubah datamu menjadi dashboard interaktif.

### Statistik — Detektor Kebohongan
Memahami statistik dasar membantumu menghindari tertipu oleh angka-angka yang menyesatkan.

---

## Jalur Karier dan Gaji di Indonesia (2024)

| Level | Pengalaman | Kisaran Gaji | Yang Kamu Lakukan |
|---|---|---|---|
| **Junior Data Analyst** | 0–2 tahun | Rp 5–10 juta/bulan | Menarik laporan, membersihkan data |
| **Data Analyst** | 2–4 tahun | Rp 10–18 juta/bulan | Mengelola dashboard, memimpin proyek kecil |
| **Senior Data Analyst** | 4–7 tahun | Rp 18–30 juta/bulan | Analisis strategis, mendefinisikan metrik |
| **Lead / Principal Analyst** | 7+ tahun | Rp 30–50 juta/bulan | Strategi data, mengelola tim |

---

## Kesimpulan Utama

- Data analytics adalah tentang mengubah informasi mentah menjadi keputusan yang jelas.
- Empat jenis analytics: deskriptif, diagnostik, prediktif, preskriptif.
- Data analyst berfokus pada pertanyaan bisnis, SQL, visualisasi, dan komunikasi.
- Alur kerja: Pertanyaan → Kumpulkan → Bersihkan → Analisis → Visualisasi → Putuskan.

**Sesi berikutnya:** Kita mulai dengan alat yang mungkin sudah ada di komputermu — Microsoft Excel.
$id01$
WHERE session_number = '01';

UPDATE sessions SET
  content_en = $en02$
# Session 02 — Excel for Data Analysis

## Why Excel Still Matters in the Age of Python and SQL

Every time someone learns Python, they write a blog post saying "Excel is dead." Excel is not dead. Excel is used by more than 750 million people worldwide and is the default tool for data communication in almost every Indonesian company you will ever work at.

Here is the truth: **SQL and Python make you powerful. Excel makes you understood.**

When you need to share an analysis with a finance manager who does not know what Python is, you send them an Excel file. When you need to quickly check a number during a meeting, you open Excel. When a client sends you data, it arrives as an Excel file.

This session will teach you Excel not as a replacement for SQL or Python, but as an essential complement. A professional data analyst is fluent in all three.

---

## The Anatomy of Excel: Know Your Workspace

Before we run, we walk. Let us understand the building blocks.

### Cells
A **cell** is a single box in the spreadsheet. Every cell has an **address** — a combination of its column letter and row number.

- Cell **A1** = column A, row 1
- Cell **C5** = column C, row 5
- Cell **B3** = column B, row 3

Think of cells like coordinates on a map. When you say "B3", everyone knows exactly which box you mean.

### Rows and Columns
- **Rows** run horizontally (left to right). They are numbered: 1, 2, 3...
- **Columns** run vertically (top to bottom). They are lettered: A, B, C... Z, AA, AB...

A typical dataset has **columns as variables** (Product Name, Price, Quantity) and **rows as individual records** (each row is one sale, one customer, one product).

### Sheets and Workbooks
- A **sheet** (or worksheet) is one tab at the bottom of Excel. It is like one page in a notebook.
- A **workbook** is the entire Excel file, which can contain multiple sheets.

**Best practice:** Keep raw data on one sheet, analysis on another, and charts on a third. Never edit raw data directly — always work on a copy.

### Ranges
A **range** is a group of cells. You write it as `StartCell:EndCell`.
- `A1:A100` = all cells from A1 to A100 (one column, 100 rows)
- `A1:E10` = a block from A1 to E10 (5 columns, 10 rows)

---

## Essential Formulas Every Analyst Must Know

Formulas in Excel always start with an `=` sign. Without it, Excel treats your input as plain text.

### SUM — Add Things Up

```
=SUM(A1:A10)
```
Adds all numbers in cells A1 through A10.

**Real example:** You have a column of daily sales figures for January (31 rows). `=SUM(B2:B32)` gives you total January revenue.

### AVERAGE — The Mean

```
=AVERAGE(A1:A10)
```
Calculates the arithmetic mean (sum divided by count).

**Real example:** `=AVERAGE(C2:C100)` gives the average order value across 99 orders.

**Warning:** AVERAGE ignores empty cells but includes zeros. A zero sale is different from no data — make sure your zeros are intentional.

### COUNT vs COUNTA

```
=COUNT(A1:A100)    -- counts only cells with NUMBERS
=COUNTA(A1:A100)   -- counts cells with ANY content (numbers, text, dates)
```

**Real example:** You have a column of customer IDs. `=COUNT` and `=COUNTA` give different results if some customer IDs are text (like "CUST-001") — use `COUNTA` for text IDs.

### COUNTIF — Count with a Condition

```
=COUNTIF(range, criteria)
=COUNTIF(B2:B100, "Jakarta")
```
Counts the number of cells in a range that meet a condition.

**Real example:** `=COUNTIF(D2:D500, "Completed")` tells you how many orders have status "Completed" out of 499 orders.

You can also use operators:
```
=COUNTIF(E2:E100, ">100000")   -- count orders above Rp 100,000
=COUNTIF(E2:E100, "<>0")       -- count non-zero values
```

### SUMIF — Sum with a Condition

```
=SUMIF(range, criteria, sum_range)
=SUMIF(B2:B100, "Jakarta", C2:C100)
```
Sum the values in `sum_range` only where the corresponding cell in `range` meets the `criteria`.

**Real example:** You have columns for City (column B) and Revenue (column C). `=SUMIF(B2:B100, "Surabaya", C2:C100)` gives you total revenue from Surabaya only.

### IF — Make Decisions

```
=IF(condition, value_if_true, value_if_false)
=IF(C2>1000000, "High Value", "Regular")
```

**Real example:** You want to flag orders above Rp 1,000,000 as "High Value":
```
=IF(D2>1000000, "High Value", "Regular")
```

You can nest IFs for multiple categories:
```
=IF(D2>5000000, "Premium", IF(D2>1000000, "High", "Regular"))
```

### IFERROR — Handle Errors Gracefully

```
=IFERROR(formula, value_if_error)
=IFERROR(A2/B2, 0)
```

If dividing by zero or referencing a missing value would cause an error, `IFERROR` replaces it with something sensible.

**Real example:** If you are calculating conversion rate as `=C2/D2` and D2 is sometimes 0 (zero visitors), wrap it: `=IFERROR(C2/D2, 0)` so you get 0 instead of a #DIV/0! error.

---

## VLOOKUP — The Most Famous Excel Function

VLOOKUP stands for **Vertical Lookup**. It lets you search for a value in one column and return a corresponding value from another column — like looking up someone's name in a phonebook to find their phone number.

### Syntax

```
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

- **lookup_value**: What you are searching for (e.g., a product ID)
- **table_array**: The range that contains your lookup table
- **col_index_num**: Which column in the table to return (1 = first column, 2 = second, etc.)
- **range_lookup**: Use `FALSE` for exact match (you almost always want this)

### Step-by-Step Business Example

You have two sheets:
- **Sheet1** has an order list with Product_ID and Quantity
- **Sheet2** has a product catalog with Product_ID and Price

You want to look up the price of each product in the order list.

**Your order list (Sheet1):**

| A: Order_ID | B: Product_ID | C: Quantity | D: Price (empty, to fill) |
|---|---|---|---|
| ORD-001 | PRD-042 | 3 | ? |
| ORD-002 | PRD-017 | 1 | ? |

**Your product catalog (Sheet2):**

| A: Product_ID | B: Product_Name | C: Price |
|---|---|---|
| PRD-017 | Laptop Stand | 250000 |
| PRD-042 | Wireless Mouse | 180000 |

In Sheet1, cell D2, you write:
```
=VLOOKUP(B2, Sheet2!A:C, 3, FALSE)
```

This says: "Take the value in B2 (PRD-042), look for it in the first column of Sheet2 columns A to C, and when you find it, return the value from the 3rd column (Price)."

Result: 180000 ✓

### Common VLOOKUP Mistakes

1. **Forgetting FALSE** at the end causes approximate matching — wrong results for text IDs
2. **The lookup column must be the FIRST column** in your table_array — VLOOKUP can only look to the right
3. **Columns inserted in your table break the col_index_num** — if someone adds a column, your number is wrong

---

## INDEX-MATCH — The Better Alternative

INDEX-MATCH solves VLOOKUP's biggest weakness (can only look right, breaks when columns are inserted).

```
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
```

- **MATCH** finds the position (row number) of your lookup value
- **INDEX** returns the value at that position from a different range

**Same example as above:**
```
=INDEX(Sheet2!C:C, MATCH(B2, Sheet2!A:A, 0))
```

This says: "Find PRD-042 in column A of Sheet2, get its row position, then return the value from column C at that same row position."

**Advantages over VLOOKUP:**
- Can look left (or in any direction)
- Does not break when columns are inserted
- Slightly faster on large datasets

---

## Pivot Tables: The Magic Summary Button

A Pivot Table is one of the most powerful features in Excel. It lets you summarize thousands of rows of data into a clear summary table — in about 30 seconds, with no formulas.

**Analogy:** Imagine you have 10,000 paper receipts from a year of sales. Manually sorting them by city and summing the totals would take days. A pivot table is like having a machine that sorts them into piles and calculates the totals instantly.

### How to Create a Pivot Table

1. Click anywhere inside your data table
2. Go to **Insert → PivotTable**
3. Excel detects your data range automatically
4. Choose to place it on a new sheet
5. Click OK

You now see the **PivotTable Field List** on the right. It shows all your column names.

### Understanding the Four Areas

- **Rows**: The values that appear as row labels (e.g., drag "City" here to see one row per city)
- **Columns**: Values that become column headers (e.g., drag "Month" here to see columns Jan, Feb, Mar...)
- **Values**: The numbers you want to calculate (e.g., drag "Revenue" here to see sums)
- **Filters**: A dropdown filter applied to the whole table (e.g., drag "Category" here to filter by product category)

### Example

You have 5,000 rows of order data with columns: Order_ID, City, Category, Revenue, Month.

**Question:** "What is the total revenue per city, broken down by category?"

1. Drag **City** to Rows
2. Drag **Category** to Columns
3. Drag **Revenue** to Values (it auto-sums)

Instant result: A grid showing each city's revenue by category. What would have taken an hour of SUMIF formulas takes 30 seconds.

---

## Common Beginner Mistakes in Excel

### Mistake 1: Storing numbers as text
If a cell shows a number but has a tiny green triangle in the corner, Excel thinks it is text. SUM will not add it. Fix: Select the cells → Data → Text to Columns → Finish.

### Mistake 2: Spaces hiding in cells
"Jakarta " and "Jakarta" look the same to a human but are different to Excel. COUNTIF("Jakarta") will miss "Jakarta ". Fix: Use `=TRIM(A2)` to remove leading/trailing spaces.

### Mistake 3: Merged cells
Merged cells look pretty but break sorting, filtering, and pivot tables. Avoid them in data tables. Use them only in report headers.

### Mistake 4: Dates stored as text
If your dates sort alphabetically instead of chronologically, they are stored as text. Fix: Use Text to Columns with "Date" format to convert them.

### Mistake 5: One giant sheet with everything
Keep raw data, calculations, and charts on separate sheets. Mixing them makes auditing and updating a nightmare.

---

## Keyboard Shortcuts Every Analyst Must Know

| Shortcut | Action |
|---|---|
| `Ctrl + C / V / X` | Copy / Paste / Cut |
| `Ctrl + Z` | Undo |
| `Ctrl + Arrow Key` | Jump to end of data |
| `Ctrl + Shift + End` | Select to last used cell |
| `Ctrl + T` | Convert range to Table |
| `Ctrl + 1` | Format cells dialog |
| `Alt + =` | Auto-SUM |
| `F2` | Edit cell |
| `F4` | Toggle absolute/relative reference ($) |
| `Ctrl + Shift + L` | Toggle filters |

### Absolute vs Relative References (F4)

This is critical. When you copy a formula down, Excel adjusts the cell references.

- `=A1*B1` copied down becomes `=A2*B2`, `=A3*B3`... (relative — moves with you)
- `=A1*$B$1` copied down becomes `=A2*$B$1`, `=A3*$B$1`... (column B row 1 is locked)

Use `$` when you want a reference to stay fixed (like a tax rate in a fixed cell).

---

## Data Cleaning Tools in Excel

### Remove Duplicates
Data → Remove Duplicates → Select columns to check → OK

Excel removes rows where all selected columns match. Always keep a backup before doing this.

### Text to Columns
Data → Text to Columns → Choose delimiter (comma, space, tab) → Finish

Splits "FirstName LastName" in one cell into two separate cells. Also converts text-formatted numbers to real numbers.

### Find and Replace (Ctrl + H)
Standardize inconsistent values: Replace "Jkt" with "Jakarta", "sby" with "Surabaya".

### Flash Fill (Ctrl + E)
Type an example of what you want in the column next to your data, then press Ctrl+E. Excel guesses the pattern and fills the rest.

**Example:** Column A has "HAMID IBRAHIM". Type "Hamid" in B1, press Ctrl+E — Excel fills B2, B3... with just the first names.

---

## Key Takeaways

- Excel is the universal language of business data — every analyst must be fluent.
- Cells have addresses (A1, B3). Ranges are groups of cells (A1:E10). Sheets are tabs. Workbooks are files.
- Master these formulas: SUM, AVERAGE, COUNT, COUNTA, COUNTIF, SUMIF, IF, IFERROR.
- VLOOKUP searches a table and returns a value. INDEX-MATCH is more flexible.
- Pivot Tables summarize thousands of rows in seconds — learn them well.
- Clean data before analyzing: remove duplicates, trim spaces, fix date formats.

**Next session:** Statistics — the secret to not being fooled by numbers.
$en02$,
  content_id = $id02$
# Sesi 02 — Excel untuk Analisis Data

## Kenapa Excel Masih Penting di Era Python dan SQL

Setiap kali seseorang belajar Python, mereka menulis artikel yang bilang "Excel sudah mati." Excel tidak mati. Excel digunakan oleh lebih dari 750 juta orang di seluruh dunia dan merupakan alat komunikasi data default di hampir setiap perusahaan Indonesia yang akan kamu masuki.

Inilah kebenarannya: **SQL dan Python membuatmu powerful. Excel membuatmu dimengerti.**

Ketika kamu perlu berbagi analisis dengan manajer keuangan yang tidak tahu apa itu Python, kamu kirim file Excel. Ketika kamu perlu cepat mengecek angka saat rapat, kamu buka Excel. Ketika klien mengirimkan data, datanya pasti berupa file Excel.

---

## Anatomi Excel: Kenali Workspace-mu

### Sel (Cell)
**Cell** adalah satu kotak dalam spreadsheet. Setiap cell punya **alamat** — gabungan huruf kolom dan nomor baris.

- Cell **A1** = kolom A, baris 1
- Cell **C5** = kolom C, baris 5

Bayangkan cell seperti koordinat di peta. Ketika kamu bilang "B3", semua orang tahu persis kotak mana yang dimaksud.

### Baris dan Kolom
- **Baris** berjalan horizontal (kiri ke kanan). Diberi nomor: 1, 2, 3...
- **Kolom** berjalan vertikal (atas ke bawah). Diberi huruf: A, B, C... Z, AA, AB...

Dataset yang khas punya **kolom sebagai variabel** (Nama Produk, Harga, Kuantitas) dan **baris sebagai catatan individual** (setiap baris adalah satu penjualan, satu pelanggan, satu produk).

### Sheet dan Workbook
- **Sheet** (atau worksheet) adalah satu tab di bagian bawah Excel. Seperti satu halaman di buku catatan.
- **Workbook** adalah seluruh file Excel, yang bisa berisi banyak sheet.

**Best practice:** Simpan data mentah di satu sheet, analisis di sheet lain, dan grafik di sheet ketiga. Jangan pernah mengedit data mentah secara langsung — selalu kerja di salinannya.

### Range
**Range** adalah sekelompok cell. Ditulis sebagai `CellAwal:CellAkhir`.
- `A1:A100` = semua cell dari A1 ke A100 (satu kolom, 100 baris)
- `A1:E10` = blok dari A1 ke E10 (5 kolom, 10 baris)

---

## Formula Penting yang Harus Dikuasai Setiap Analyst

Formula di Excel selalu dimulai dengan tanda `=`. Tanpanya, Excel menganggap input kamu sebagai teks biasa.

### SUM — Menjumlahkan

```
=SUM(A1:A10)
```
Menjumlahkan semua angka di cell A1 hingga A10.

**Contoh nyata:** Kamu punya kolom angka penjualan harian untuk Januari (31 baris). `=SUM(B2:B32)` memberikan total pendapatan Januari.

### AVERAGE — Rata-rata

```
=AVERAGE(A1:A10)
```
Menghitung rata-rata aritmatika (jumlah dibagi banyaknya data).

**Peringatan:** AVERAGE mengabaikan sel kosong tapi menghitung nol. Penjualan nol berbeda dengan tidak ada data — pastikan nol-mu memang disengaja.

### COUNT vs COUNTA

```
=COUNT(A1:A100)    -- hanya menghitung sel berisi ANGKA
=COUNTA(A1:A100)   -- menghitung sel berisi APA SAJA (angka, teks, tanggal)
```

**Contoh nyata:** Kamu punya kolom ID pelanggan seperti "CUST-001" (format teks). Gunakan `COUNTA`, bukan `COUNT`.

### COUNTIF — Hitung dengan Syarat

```
=COUNTIF(range, kriteria)
=COUNTIF(B2:B100, "Jakarta")
```

**Contoh nyata:** `=COUNTIF(D2:D500, "Selesai")` memberitahu kamu berapa pesanan berstatus "Selesai" dari 499 pesanan.

Kamu juga bisa menggunakan operator:
```
=COUNTIF(E2:E100, ">100000")   -- hitung pesanan di atas Rp 100.000
```

### SUMIF — Jumlahkan dengan Syarat

```
=SUMIF(range, kriteria, sum_range)
=SUMIF(B2:B100, "Jakarta", C2:C100)
```

**Contoh nyata:** Kamu punya kolom Kota (kolom B) dan Pendapatan (kolom C). `=SUMIF(B2:B100, "Surabaya", C2:C100)` memberikan total pendapatan dari Surabaya saja.

### IF — Membuat Keputusan

```
=IF(kondisi, nilai_jika_benar, nilai_jika_salah)
=IF(C2>1000000, "Nilai Tinggi", "Reguler")
```

Untuk beberapa kategori, kamu bisa menumpuk IF:
```
=IF(D2>5000000, "Premium", IF(D2>1000000, "Tinggi", "Reguler"))
```

### IFERROR — Tangani Error dengan Elegan

```
=IFERROR(formula, nilai_jika_error)
=IFERROR(A2/B2, 0)
```

**Contoh nyata:** Saat menghitung conversion rate sebagai `=C2/D2` dan D2 kadang nol, bungkus dengan: `=IFERROR(C2/D2, 0)` agar kamu mendapat 0 bukan error #DIV/0!.

---

## VLOOKUP — Fungsi Excel Paling Terkenal

VLOOKUP singkatan dari **Vertical Lookup**. Fungsi ini memungkinkan kamu mencari nilai di satu kolom dan mengembalikan nilai yang bersesuaian dari kolom lain — seperti mencari nama seseorang di buku telepon untuk menemukan nomor teleponnya.

### Sintaks

```
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

- **lookup_value**: Apa yang kamu cari (misalnya ID produk)
- **table_array**: Range yang berisi tabel pencarian kamu
- **col_index_num**: Kolom keberapa di tabel yang akan dikembalikan (1 = kolom pertama, 2 = kedua, dst.)
- **range_lookup**: Gunakan `FALSE` untuk pencocokan tepat (hampir selalu kamu inginkan ini)

### Contoh Bisnis Langkah demi Langkah

Kamu punya dua sheet:
- **Sheet1** berisi daftar pesanan dengan Product_ID dan Quantity
- **Sheet2** berisi katalog produk dengan Product_ID dan Price

Di Sheet1, cell D2, kamu tulis:
```
=VLOOKUP(B2, Sheet2!A:C, 3, FALSE)
```

Artinya: "Ambil nilai di B2 (PRD-042), cari di kolom pertama Sheet2 kolom A sampai C, dan ketika ketemu, kembalikan nilai dari kolom ke-3 (Price)."

### Kesalahan Umum VLOOKUP

1. **Lupa FALSE** di akhir menyebabkan pencocokan perkiraan — hasil salah untuk ID teks
2. **Kolom pencarian harus kolom PERTAMA** di table_array — VLOOKUP hanya bisa melihat ke kanan
3. **Kolom yang disisipkan memecah col_index_num** — jika seseorang menambahkan kolom, nomormu salah

---

## INDEX-MATCH — Alternatif yang Lebih Baik

INDEX-MATCH menyelesaikan kelemahan terbesar VLOOKUP (hanya bisa melihat ke kanan, rusak saat kolom disisipkan).

```
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
```

**Contoh yang sama:**
```
=INDEX(Sheet2!C:C, MATCH(B2, Sheet2!A:A, 0))
```

**Keunggulan dibanding VLOOKUP:**
- Bisa melihat ke kiri (atau arah apapun)
- Tidak rusak saat kolom disisipkan
- Sedikit lebih cepat pada dataset besar

---

## Pivot Table: Tombol Ringkasan Ajaib

Pivot Table adalah salah satu fitur paling powerful di Excel. Fitur ini memungkinkan kamu merangkum ribuan baris data menjadi tabel ringkasan yang jelas — dalam waktu sekitar 30 detik, tanpa formula apapun.

**Analogi:** Bayangkan kamu punya 10.000 struk kertas dari setahun penjualan. Menyortirnya secara manual per kota dan menjumlahkan totalnya akan memakan waktu berhari-hari. Pivot table seperti memiliki mesin yang menyortirnya ke dalam tumpukan dan menghitung totalnya secara instan.

### Cara Membuat Pivot Table

1. Klik di mana saja di dalam tabel datamu
2. Pergi ke **Insert → PivotTable**
3. Excel mendeteksi range datamu secara otomatis
4. Pilih untuk menempatkannya di sheet baru
5. Klik OK

### Memahami Empat Area

- **Rows**: Nilai yang muncul sebagai label baris (misal: seret "Kota" ke sini untuk melihat satu baris per kota)
- **Columns**: Nilai yang menjadi header kolom (misal: seret "Bulan" ke sini untuk melihat kolom Jan, Feb, Mar...)
- **Values**: Angka yang ingin kamu hitung (misal: seret "Pendapatan" ke sini untuk melihat jumlah)
- **Filters**: Filter dropdown yang diterapkan ke seluruh tabel

### Contoh

Kamu punya 5.000 baris data pesanan dengan kolom: Order_ID, Kota, Kategori, Pendapatan, Bulan.

**Pertanyaan:** "Berapa total pendapatan per kota, dipecah berdasarkan kategori?"

1. Seret **Kota** ke Rows
2. Seret **Kategori** ke Columns
3. Seret **Pendapatan** ke Values (otomatis menjumlahkan)

Hasilnya instan: Grid yang menunjukkan pendapatan setiap kota per kategori.

---

## Kesalahan Umum Pemula di Excel

### Kesalahan 1: Menyimpan angka sebagai teks
Jika sel menampilkan angka tapi ada segitiga hijau kecil di pojok, Excel menganggapnya teks. SUM tidak akan menjumlahkannya. Perbaikan: Pilih sel → Data → Text to Columns → Finish.

### Kesalahan 2: Spasi tersembunyi di sel
"Jakarta " dan "Jakarta" terlihat sama bagi manusia tapi berbeda bagi Excel. Perbaikan: Gunakan `=TRIM(A2)` untuk menghapus spasi di awal/akhir.

### Kesalahan 3: Merged cells
Sel yang digabungkan terlihat bagus tapi merusak sorting, filtering, dan pivot table. Hindari di tabel data.

### Kesalahan 4: Tanggal tersimpan sebagai teks
Jika tanggalmu diurutkan secara alfabetis bukan kronologis, artinya tersimpan sebagai teks.

### Kesalahan 5: Satu sheet besar untuk segalanya
Pisahkan data mentah, kalkulasi, dan grafik ke sheet berbeda.

---

## Shortcut Keyboard yang Wajib Diketahui Setiap Analyst

| Shortcut | Aksi |
|---|---|
| `Ctrl + C / V / X` | Copy / Paste / Cut |
| `Ctrl + Z` | Undo |
| `Ctrl + Arrow Key` | Lompat ke akhir data |
| `Ctrl + T` | Ubah range ke Table |
| `Alt + =` | Auto-SUM |
| `F2` | Edit sel |
| `F4` | Toggle referensi absolut/relatif ($) |
| `Ctrl + Shift + L` | Toggle filter |

### Referensi Absolut vs Relatif (F4)

Ini penting. Ketika kamu menyalin formula ke bawah, Excel menyesuaikan referensi sel.

- `=A1*B1` disalin ke bawah jadi `=A2*B2`, `=A3*B3`... (relatif — ikut bergerak)
- `=A1*$B$1` disalin ke bawah jadi `=A2*$B$1`, `=A3*$B$1`... (B1 terkunci)

Gunakan `$` ketika kamu ingin referensi tetap (seperti tarif pajak di sel tetap).

---

## Pembersihan Data di Excel

### Remove Duplicates
Data → Remove Duplicates → Pilih kolom yang dicek → OK

### Text to Columns
Data → Text to Columns → Pilih delimiter → Finish

### Find and Replace (Ctrl + H)
Standarisasi nilai tidak konsisten: Ganti "Jkt" dengan "Jakarta".

### Flash Fill (Ctrl + E)
Ketik contoh apa yang kamu inginkan di kolom sebelah datamu, lalu tekan Ctrl+E. Excel menebak polanya dan mengisi sisanya.

---

## Kesimpulan Utama

- Excel adalah bahasa universal data bisnis — setiap analyst harus fasih.
- Cell punya alamat (A1, B3). Range adalah grup cell (A1:E10). Sheet adalah tab. Workbook adalah file.
- Kuasai formula ini: SUM, AVERAGE, COUNT, COUNTA, COUNTIF, SUMIF, IF, IFERROR.
- VLOOKUP mencari tabel dan mengembalikan nilai. INDEX-MATCH lebih fleksibel.
- Pivot Table merangkum ribuan baris dalam hitungan detik — pelajari dengan baik.
- Bersihkan data sebelum menganalisis: hapus duplikat, trim spasi, perbaiki format tanggal.

**Sesi berikutnya:** Statistik — rahasia agar tidak tertipu oleh angka.
$id02$
WHERE session_number = '02';
