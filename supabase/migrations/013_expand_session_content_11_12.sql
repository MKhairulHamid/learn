-- Migration 009: Expand session content for sessions 11 and 12
-- Rich educational content for complete beginners

UPDATE sessions SET
  content_en = $en11$
# Session 11: Final Project — End-to-End Data Analysis

## How to Approach a Real-World Analysis Project from Scratch

In the real world, analysis projects don't come with clean datasets, clear questions, and helpful instructions. They come as vague business problems, messy spreadsheets, and stakeholders who aren't sure exactly what they want.

This session teaches you the **professional methodology** used by data analysts at top companies. Every phase is explained so you can apply it to any project — including the capstone project at the end of this session.

Think of this as your playbook. Refer back to it every time you start a new analysis.

---

## Phase 1: Understanding the Business Problem

**The most common analyst mistake: jumping straight to the data.**

Before you open a single spreadsheet or write a single SQL query, you need to understand what business decision you are trying to support. Analysis without a clear question produces answers to questions nobody asked.

### Stakeholder Interviews: The Right Questions to Ask

Schedule a 30-minute meeting with your key stakeholder before starting. Ask:

**About the problem:**
- "What is the specific decision you need to make?"
- "What do you believe is causing this problem? What's your hypothesis?"
- "What would success look like for this analysis?"

**About scope:**
- "How far back should the analysis go?"
- "Which customer segments, regions, or products should be included?"
- "Are there any areas we should deliberately exclude?"

**About constraints:**
- "When do you need this by?"
- "Who else will see this analysis? What's their background?"
- "Are there any political sensitivities I should be aware of?"

**About data:**
- "What data do you think is available?"
- "Who owns the data? Who do I need to talk to for access?"

**Example:** Your stakeholder says "Sales have been declining. Can you look into it?" This is too vague. Through questioning, you discover: the decline started in August, it's concentrated in the Surabaya region, and the hypothesis is that a competitor launched there. Now you have a real question to answer.

### Defining Success Metrics

Before starting, agree on: how will we know this analysis is successful? Common success metrics:

- **Decision made:** "The analysis will lead to a decision by October 15"
- **Hypothesis confirmed or rejected:** "We will determine whether competitor entry is the main driver"
- **Quantified impact:** "We will estimate the revenue impact of the three recommended actions"

### Scoping: What's In and Out

Write a one-paragraph scope statement that defines:
- What question the analysis will answer
- What time period it covers
- What segments are included
- What the analysis will NOT cover (to manage expectations)

Having written agreement on scope prevents scope creep and protects you when stakeholders later ask for "just one more thing."

---

## Phase 2: Data Collection and Assessment

### Identifying Data Sources

Map out every potential source of data that could help answer the question:

| Data Source | Owner | Access Method | Freshness |
|-------------|-------|---------------|-----------|
| Sales transactions | Finance | Tableau/SQL | Daily |
| Customer database | CRM team | Salesforce export | Weekly |
| Marketing spend | Marketing | Google Sheets | Monthly |
| Competitor data | External | Market research report | Quarterly |

### Data Quality Assessment

Before trusting data, audit it. Use this checklist:

**Completeness:** Are all expected records present?
```sql
-- How many orders do we have per month? Any missing months?
SELECT DATE_TRUNC('month', order_date) AS month,
       COUNT(*) AS order_count
FROM orders
WHERE order_date BETWEEN '2023-01-01' AND '2024-12-31'
GROUP BY 1
ORDER BY 1;
-- If December 2023 is missing, investigate — is it a data gap or was there really no data?
```

**Accuracy:** Do values make logical sense?
```python
# Check for impossible values
print(df[df["revenue"] < 0])     # Negative revenue — possible (returns) or error?
print(df[df["age"] > 120])       # Age > 120 — definitely an error
print(df[df["quantity"] == 0])   # Zero quantity orders — possible?
```

**Consistency:** Do the same things have the same representation everywhere?
```python
# Check for inconsistent category names
df["region"].value_counts()
# Output might show: "Jakarta", "JAKARTA", "jakarta ", "Jkt" — all the same city!
```

**Timeliness:** Is the data fresh enough for the question?
```python
print(f"Most recent record: {df['order_date'].max()}")
print(f"Oldest record: {df['order_date'].min()}")
# Check if the most recent data is recent enough
```

### Documenting Data Issues Found

Keep a running log of every data quality issue you find:

| Issue | Column | Description | Rows Affected | Action Taken |
|-------|--------|-------------|---------------|--------------|
| Inconsistent region names | region | "Jakarta" vs "JAKARTA" | 1,234 | Standardized to title case |
| Negative revenue | revenue | 45 records with negative values | 45 | Excluded (returns) |
| Missing city | customer_city | 12% of customers have no city | 2,890 | Imputed from postal code where possible |

This log is valuable because:
1. It explains your cleaning decisions (shows rigor)
2. It becomes part of your methodology section in the report
3. It helps whoever maintains the data fix the upstream source

---

## Phase 3: Data Cleaning Checklist

Use this checklist for every project:

### Missing Values
```python
# Step 1: Understand the pattern
print(df.isnull().sum())
print(df.isnull().sum() / len(df) * 100)  # Percentage

# Step 2: Visualize
import missingno as msno
msno.matrix(df)  # Visual map of missing values

# Step 3: Decide
# < 5% missing: usually safe to drop
# 5-20% missing: impute or flag
# > 20% missing: investigate the data source
```

**When to impute vs drop:**
- Drop if missing is random and < 5% of rows
- Impute numerical with median (not mean — more robust to outliers)
- Impute categorical with mode (most frequent value) or "Unknown"
- Never impute if missing itself is informative (e.g., "no email" = customer opted out)

### Duplicates
```python
# Check for full duplicates
n_dupes = df.duplicated().sum()
print(f"Full duplicates: {n_dupes}")

# Check for business-logic duplicates (same order ID appearing twice)
n_order_dupes = df.duplicated(subset=["order_id"]).sum()
print(f"Duplicate order IDs: {n_order_dupes}")

# Remove duplicates (keep first occurrence)
df_clean = df.drop_duplicates(subset=["order_id"], keep="first")
```

### Fixing Data Types
```python
# Convert strings to dates
df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")
# errors="coerce" turns unparseable dates into NaT (Not a Time) instead of crashing

# Convert string revenue to number (handles "Rp 1,500,000" format)
df["revenue"] = df["revenue"].str.replace("Rp ", "").str.replace(",", "").astype(float)

# Convert boolean-like text to actual boolean
df["is_premium"] = df["is_premium"].map({"Yes": True, "No": False, "Y": True, "N": False})
```

### Standardizing Formats
```python
# Standardize text: strip whitespace, consistent case
df["region"] = df["region"].str.strip().str.title()
# "  NORTH " → "North"

# Standardize dates to a consistent format
df["order_date"] = pd.to_datetime(df["order_date"]).dt.strftime("%Y-%m-%d")

# Standardize phone numbers (remove formatting)
df["phone"] = df["phone"].str.replace(r"[^\d]", "", regex=True)
# "+62 812-3456-7890" → "6281234567890"
```

### Outlier Detection and Treatment
```python
# Method 1: IQR (Interquartile Range) — the most common approach
Q1 = df["revenue"].quantile(0.25)
Q3 = df["revenue"].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df["revenue"] < lower_bound) | (df["revenue"] > upper_bound)]
print(f"Outliers found: {len(outliers)}")
print(outliers[["order_id", "revenue"]].head(20))

# Method 2: Z-score — for normally distributed data
from scipy import stats
z_scores = stats.zscore(df["revenue"].dropna())
outliers_z = df[abs(z_scores) > 3]
```

**What to do with outliers:**
1. **Investigate first** — is it a data error or a real extreme value?
   - Rp 500,000,000 order in a retail dataset = likely an error
   - Rp 500,000,000 order in a B2B dataset = probably a real enterprise deal
2. **Remove** if confirmed data error (document why)
3. **Cap** (Winsorize) if it's real but distorting your analysis: `df["revenue"].clip(upper=upper_bound)`
4. **Keep and note** if the outlier is relevant to the analysis

---

## Phase 4: Exploratory Data Analysis

EDA is the detective phase. You are looking for patterns, anomalies, and relationships that could become key findings.

### Univariate Analysis (One Variable at a Time)

For each important variable, understand:
- What is the range? (min, max)
- What is the typical value? (mean, median)
- Is it normally distributed or skewed?
- Are there outliers?

```python
# For numerical: histogram + box plot
import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
df["revenue"].hist(bins=30, ax=axes[0])
axes[0].set_title("Revenue Distribution")
df[["revenue"]].boxplot(ax=axes[1])
axes[1].set_title("Revenue Box Plot")
plt.show()

# For categorical: bar chart of value counts
df["region"].value_counts().plot(kind="bar")
plt.title("Order Count by Region")
plt.xticks(rotation=45)
plt.show()
```

### Bivariate Analysis (Two Variables Together)

Look for relationships between variables:

```python
# Numerical vs Numerical: scatter plot + correlation
df.plot.scatter(x="marketing_spend", y="revenue")
corr = df["marketing_spend"].corr(df["revenue"])
plt.title(f"Marketing Spend vs Revenue (r = {corr:.2f})")
plt.show()

# Categorical vs Numerical: group statistics + bar chart
region_revenue = df.groupby("region")["revenue"].agg(["sum", "mean", "count"])
region_revenue["sum"].sort_values().plot(kind="barh")
plt.title("Total Revenue by Region")
plt.show()

# Time series: line chart by category
df.groupby(["month", "region"])["revenue"].sum().unstack().plot()
plt.title("Monthly Revenue by Region")
plt.show()
```

### Identifying Key Drivers

Key questions to answer in EDA:
1. Which region/product/channel contributes the most to the metric?
2. Which segment is growing fastest? Declining fastest?
3. What correlates with the outcome variable?
4. Are there any unusual patterns or anomalies that need explanation?

Use the 80/20 rule: often, 20% of something (products, customers, regions) drives 80% of the outcome. Find that 20%.

---

## Phase 5: SQL Analysis Queries

Reference sessions 04–06 for SQL fundamentals. For a business analysis project, you will typically need:

```sql
-- Revenue trend over time
SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(revenue) AS total_revenue,
    COUNT(DISTINCT order_id) AS total_orders,
    COUNT(DISTINCT customer_id) AS unique_customers
FROM orders
WHERE order_date >= '2023-01-01'
GROUP BY 1
ORDER BY 1;

-- Performance by region (with ranking)
SELECT
    region,
    SUM(revenue) AS total_revenue,
    RANK() OVER (ORDER BY SUM(revenue) DESC) AS revenue_rank,
    SUM(revenue) / SUM(SUM(revenue)) OVER () * 100 AS pct_of_total
FROM orders
GROUP BY region
ORDER BY total_revenue DESC;

-- Customer cohort analysis (which acquisition month has the best retention?)
SELECT
    DATE_TRUNC('month', first_order_date) AS cohort_month,
    COUNT(DISTINCT customer_id) AS cohort_size,
    COUNT(DISTINCT CASE WHEN months_since_first > 0 THEN customer_id END) AS returned
FROM (
    SELECT
        customer_id,
        MIN(order_date) AS first_order_date,
        DATEDIFF(month, MIN(order_date), order_date) AS months_since_first
    FROM orders
    GROUP BY customer_id, order_date
) cohorts
GROUP BY cohort_month
ORDER BY cohort_month;
```

---

## Phase 6: Dashboard Creation Checklist

Before building your dashboard, answer these questions:

- [ ] Who is the primary audience? (executive, ops team, self-service)
- [ ] What is the single most important number they need to see?
- [ ] What filters will they need? (date range, region, product, segment)
- [ ] How often will this be refreshed? (daily, weekly, monthly)
- [ ] Does it need to be shared outside the company?

Then build using this order:
1. **Hero metric** — the one KPI at the top (total revenue, total orders, etc.)
2. **Trend chart** — how the metric moves over time
3. **Breakdown** — which categories drive the metric
4. **Details table** — for drilling down into specifics

---

## Phase 7: Writing the Business Report

Follow the structure from Session 9:

1. **Executive Summary** (3 sentences: context, finding, recommendation)
2. **Background and Objective** (1 paragraph)
3. **Methodology** (data sources, time period, assumptions, limitations)
4. **Key Findings** (3–5 findings, each with evidence and interpretation)
5. **Recommendations** (specific, measurable, owned, time-bound)
6. **Appendix** (data tables, additional charts)

For the capstone project, your report should be 4–6 pages (not including appendix).

---

## Phase 8: Presenting Findings

**Prepare:** Anticipate every question you might be asked. For each key finding, know:
- What is the alternative explanation?
- What would change your conclusion?
- What data do you wish you had but didn't?

**Present:** Lead with the recommendation. Walk through evidence. Invite questions.

**Handle objections calmly:**
- "I see where you're coming from. The data shows X, but I acknowledge it doesn't account for Y. To test that, we would need..."
- Never get defensive. You are presenting evidence, not defending your ego.

---

## Portfolio Tips: Presenting on LinkedIn and GitHub

### GitHub
1. Create a repository named `retail-sales-analysis`
2. Structure:
   ```
   retail-sales-analysis/
   ├── README.md         ← Project overview, key findings, tech stack
   ├── data/
   │   ├── raw/          ← Original data (anonymized if needed)
   │   └── processed/    ← Cleaned data
   ├── notebooks/
   │   └── analysis.ipynb ← Jupyter notebook with full analysis
   ├── reports/
   │   └── executive_summary.pdf
   └── dashboard/
       └── link_to_looker_studio.txt
   ```
3. Write a compelling README: problem statement, approach, key findings (with images of charts), link to dashboard

### LinkedIn
Post a project showcase:
- 1 compelling chart (the most interesting finding)
- 3-sentence description: what problem you solved, what you found, what you recommended
- Link to your GitHub repo
- Tags: #DataAnalytics #SQL #Python #PowerBI #DataVisualization

**Example post:**
> "I analyzed 12 months of retail sales data to understand a 23% revenue decline. Key finding: 80% of the loss came from 3 churned enterprise clients — not new customer acquisition failure. My recommendation: build a customer health scoring system. Full analysis on GitHub: [link] #DataAnalytics #BusinessIntelligence"

---

## The Capstone Project Brief

### Scenario: RetailMaju Revenue Analysis

**Company background:** RetailMaju is an Indonesian e-commerce retailer selling consumer electronics, fashion, and home goods across Java and Sumatra.

**Problem:** The CFO has noticed that overall revenue in 2024 is 15% below the 2023 run-rate, despite launching two new product categories. She wants to understand why and what to do about it.

**Your assignment:**
1. Analyze the 2023–2024 sales dataset provided (50,000+ transaction records)
2. Identify the key drivers of the revenue gap
3. Build an interactive dashboard in Looker Studio or Power BI
4. Write a business report with specific recommendations
5. Prepare a 10-minute presentation for the CFO

**Data provided:**
- `transactions.csv` — order-level data with date, product, customer, region, channel, and revenue
- `customers.csv` — customer profile data with acquisition date, segment, and city
- `products.csv` — product catalog with category, sub-category, and cost

---

## Evaluation Rubric Explained

Your capstone will be assessed on these dimensions:

### 1. Problem Definition and Scope (10 points)
- Is the business question clearly defined?
- Is the scope appropriate (not too narrow, not too broad)?
- Are success metrics defined?

### 2. Data Quality (15 points)
- Did you identify and document all major data quality issues?
- Were cleaning decisions justified?
- Was the final dataset ready for analysis?

### 3. Analytical Depth (25 points)
- Did you go beyond surface-level metrics?
- Did you identify the root cause(s), not just the symptoms?
- Is the analysis statistically sound?
- Did you consider alternative explanations?

### 4. Visualization Quality (15 points)
- Is the dashboard clear and well-designed?
- Are chart types appropriate for the data?
- Can a non-technical stakeholder understand it in 5 seconds?

### 5. Report and Recommendations (25 points)
- Does the executive summary stand alone?
- Are findings clearly articulated with evidence?
- Are recommendations specific, measurable, and prioritized?
- Does the report tell a coherent story?

### 6. Presentation (10 points)
- Is the answer delivered upfront (Pyramid Principle)?
- Are tough questions handled gracefully?
- Is the presenter confident in their analysis?

**Total: 100 points**

To pass: minimum 70 points overall, minimum 15 points in Analytical Depth and Report & Recommendations.

---

## Key Takeaways

1. A real analysis project has 8 phases — don't skip any of them.
2. Stakeholder interviews before touching data are non-negotiable.
3. Data quality assessment protects your credibility — don't trust data blindly.
4. Document every cleaning decision — your methodology section depends on it.
5. EDA is detective work — let the data surprise you before you build your hypothesis.
6. Your GitHub and LinkedIn portfolio turn your project work into career capital.
7. The capstone is your proof of competency — treat it like a real client engagement.

$en11$,
  content_id = $id11$
# Sesi 11: Proyek Akhir — Analisis Data End-to-End

## Cara Mendekati Proyek Analisis Dunia Nyata dari Nol

Di dunia nyata, proyek analisis tidak datang dengan dataset yang bersih, pertanyaan yang jelas, dan instruksi yang membantu. Mereka datang sebagai masalah bisnis yang samar, spreadsheet yang berantakan, dan stakeholder yang tidak yakin apa yang mereka inginkan.

Sesi ini mengajarkan **metodologi profesional** yang digunakan oleh analis data di perusahaan-perusahaan terkemuka. Setiap fase dijelaskan sehingga kamu bisa menerapkannya pada proyek apa pun — termasuk proyek capstone di akhir sesi ini.

Bayangkan ini sebagai playbook-mu. Kembalilah ke sini setiap kali kamu memulai analisis baru.

---

## Fase 1: Memahami Masalah Bisnis

**Kesalahan analis yang paling umum: langsung melompat ke data.**

Sebelum membuka satu spreadsheet pun atau menulis satu query SQL pun, kamu perlu memahami keputusan bisnis apa yang ingin kamu dukung. Analisis tanpa pertanyaan yang jelas menghasilkan jawaban atas pertanyaan yang tidak ada yang tanyakan.

### Wawancara Stakeholder: Pertanyaan yang Tepat untuk Diajukan

Jadwalkan pertemuan 30 menit dengan stakeholder utamamu sebelum memulai. Tanyakan:

**Tentang masalah:**
- "Apa keputusan spesifik yang perlu kamu buat?"
- "Apa yang kamu percaya menjadi penyebab masalah ini? Apa hipotesismu?"
- "Seperti apa tampilan keberhasilan untuk analisis ini?"

**Tentang lingkup:**
- "Seberapa jauh ke belakang analisis harus dilakukan?"
- "Segmen pelanggan, wilayah, atau produk mana yang harus disertakan?"
- "Apakah ada area yang harus sengaja dikecualikan?"

**Tentang batasan:**
- "Kapan kamu membutuhkan ini?"
- "Siapa lagi yang akan melihat analisis ini? Apa latar belakang mereka?"

**Contoh:** Stakeholdermu berkata "Penjualan terus menurun. Bisakah kamu menyelidikinya?" Ini terlalu samar. Melalui pertanyaan, kamu menemukan: penurunan dimulai di Agustus, terkonsentrasi di wilayah Surabaya, dan hipotesisnya adalah bahwa kompetitor baru masuk ke sana.

### Mendefinisikan Metrik Keberhasilan

Sebelum memulai, sepakati: bagaimana kita tahu analisis ini berhasil?
- "Analisis akan mengarah pada keputusan sebelum 15 Oktober"
- "Kita akan menentukan apakah masuknya kompetitor adalah driver utama"
- "Kita akan mengestimasi dampak pendapatan dari tiga tindakan yang direkomendasikan"

### Scoping: Apa yang Masuk dan Keluar

Tulis pernyataan lingkup satu paragraf yang mendefinisikan:
- Pertanyaan apa yang akan dijawab analisis
- Periode waktu yang dicakup
- Segmen apa yang disertakan
- Apa yang TIDAK akan dicakup analisis (untuk mengelola ekspektasi)

---

## Fase 2: Pengumpulan dan Penilaian Data

### Mengidentifikasi Sumber Data

Petakan setiap sumber data potensial yang dapat membantu menjawab pertanyaan:

| Sumber Data | Pemilik | Metode Akses | Kesegaran |
|-------------|---------|--------------|-----------|
| Transaksi penjualan | Keuangan | SQL/Tableau | Harian |
| Database pelanggan | Tim CRM | Export Salesforce | Mingguan |
| Pengeluaran marketing | Marketing | Google Sheets | Bulanan |

### Penilaian Kualitas Data

Sebelum mempercayai data, audit dulu. Gunakan daftar periksa ini:

**Kelengkapan:** Apakah semua rekaman yang diharapkan ada?
```sql
-- Berapa banyak pesanan per bulan? Ada bulan yang hilang?
SELECT DATE_TRUNC('month', tanggal_pesanan) AS bulan,
       COUNT(*) AS jumlah_pesanan
FROM pesanan
WHERE tanggal_pesanan BETWEEN '2023-01-01' AND '2024-12-31'
GROUP BY 1
ORDER BY 1;
```

**Akurasi:** Apakah nilai masuk akal secara logis?
```python
# Cek nilai yang tidak mungkin
print(df[df["pendapatan"] < 0])     # Pendapatan negatif
print(df[df["umur"] > 120])         # Umur > 120 — pasti error
print(df[df["kuantitas"] == 0])     # Pesanan kuantitas nol
```

**Konsistensi:** Apakah hal yang sama memiliki representasi yang sama?
```python
# Cek nama kategori yang tidak konsisten
df["wilayah"].value_counts()
# Output mungkin menunjukkan: "Jakarta", "JAKARTA", "jakarta ", "Jkt"
```

**Ketepatan waktu:** Apakah data cukup segar untuk pertanyaan tersebut?
```python
print(f"Rekaman terbaru: {df['tanggal_pesanan'].max()}")
print(f"Rekaman tertua: {df['tanggal_pesanan'].min()}")
```

### Mendokumentasikan Masalah Data yang Ditemukan

| Masalah | Kolom | Deskripsi | Baris Terpengaruh | Tindakan yang Diambil |
|---------|-------|-----------|-------------------|-----------------------|
| Nama wilayah tidak konsisten | wilayah | "Jakarta" vs "JAKARTA" | 1.234 | Distandarisasi ke title case |
| Pendapatan negatif | pendapatan | 45 rekaman dengan nilai negatif | 45 | Dikecualikan (pengembalian) |
| Kota hilang | kota_pelanggan | 12% pelanggan tidak punya kota | 2.890 | Diimputasi dari kode pos jika mungkin |

---

## Fase 3: Daftar Periksa Pembersihan Data

### Nilai yang Hilang

```python
# Langkah 1: Pahami polanya
print(df.isnull().sum())
print(df.isnull().sum() / len(df) * 100)  # Persentase

# Langkah 3: Putuskan
# < 5% hilang: biasanya aman untuk dihapus
# 5-20% hilang: imputasi atau tandai
# > 20% hilang: investigasi sumber data
```

**Kapan imputasi vs hapus:**
- Hapus jika hilang acak dan < 5% baris
- Imputasi numerik dengan median (lebih robust terhadap outlier daripada mean)
- Imputasi kategoris dengan modus atau "Tidak Diketahui"

### Duplikat

```python
n_dupes = df.duplicated().sum()
print(f"Duplikat penuh: {n_dupes}")

n_id_dupes = df.duplicated(subset=["order_id"]).sum()
print(f"ID pesanan duplikat: {n_id_dupes}")

df_bersih = df.drop_duplicates(subset=["order_id"], keep="first")
```

### Memperbaiki Tipe Data

```python
# Konversi string ke tanggal
df["tanggal_pesanan"] = pd.to_datetime(df["tanggal_pesanan"], errors="coerce")

# Konversi string pendapatan ke angka (menangani format "Rp 1.500.000")
df["pendapatan"] = df["pendapatan"].str.replace("Rp ", "").str.replace(".", "").astype(float)
```

### Standarisasi Format

```python
# Standarisasi teks
df["wilayah"] = df["wilayah"].str.strip().str.title()
# "  UTARA " → "Utara"
```

### Deteksi dan Penanganan Outlier

```python
# Metode IQR
Q1 = df["pendapatan"].quantile(0.25)
Q3 = df["pendapatan"].quantile(0.75)
IQR = Q3 - Q1
batas_bawah = Q1 - 1.5 * IQR
batas_atas = Q3 + 1.5 * IQR

outlier = df[(df["pendapatan"] < batas_bawah) | (df["pendapatan"] > batas_atas)]
print(f"Outlier ditemukan: {len(outlier)}")
```

**Apa yang dilakukan dengan outlier:**
1. **Investigasi dulu** — apakah itu error data atau nilai ekstrem nyata?
2. **Hapus** jika dikonfirmasi error data (dokumentasikan mengapa)
3. **Cap** (Winsorisasi) jika nyata tapi mendistorsi analisis
4. **Simpan dan catat** jika outlier relevan dengan analisis

---

## Fase 4: Analisis Eksplorasi Data

EDA adalah fase detektif. Kamu mencari pola, anomali, dan hubungan yang bisa menjadi temuan utama.

### Analisis Univariat (Satu Variabel Sekaligus)

```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
df["pendapatan"].hist(bins=30, ax=axes[0])
axes[0].set_title("Distribusi Pendapatan")
df[["pendapatan"]].boxplot(ax=axes[1])
axes[1].set_title("Box Plot Pendapatan")
plt.show()

df["wilayah"].value_counts().plot(kind="bar")
plt.title("Jumlah Pesanan per Wilayah")
plt.xticks(rotation=45)
plt.show()
```

### Analisis Bivariat (Dua Variabel Bersama-sama)

```python
# Numerik vs Numerik: scatter plot + korelasi
df.plot.scatter(x="pengeluaran_marketing", y="pendapatan")
korelasi = df["pengeluaran_marketing"].corr(df["pendapatan"])
plt.title(f"Pengeluaran Marketing vs Pendapatan (r = {korelasi:.2f})")
plt.show()

# Kategoris vs Numerik: statistik grup
pendapatan_wilayah = df.groupby("wilayah")["pendapatan"].agg(["sum", "mean", "count"])
pendapatan_wilayah["sum"].sort_values().plot(kind="barh")
plt.title("Total Pendapatan per Wilayah")
plt.show()
```

### Mengidentifikasi Driver Utama

Pertanyaan kunci dalam EDA:
1. Wilayah/produk/saluran mana yang paling banyak berkontribusi pada metrik?
2. Segmen mana yang tumbuh paling cepat? Menurun paling cepat?
3. Apa yang berkorelasi dengan variabel outcome?

Gunakan aturan 80/20: seringkali, 20% dari sesuatu (produk, pelanggan, wilayah) mendorong 80% dari outcome. Temukan 20% itu.

---

## Fase 5: Query Analisis SQL

Untuk proyek analisis bisnis, kamu biasanya membutuhkan:

```sql
-- Tren pendapatan dari waktu ke waktu
SELECT
    DATE_TRUNC('month', tanggal_pesanan) AS bulan,
    SUM(pendapatan) AS total_pendapatan,
    COUNT(DISTINCT order_id) AS total_pesanan,
    COUNT(DISTINCT pelanggan_id) AS pelanggan_unik
FROM pesanan
WHERE tanggal_pesanan >= '2023-01-01'
GROUP BY 1
ORDER BY 1;

-- Kinerja per wilayah (dengan peringkat)
SELECT
    wilayah,
    SUM(pendapatan) AS total_pendapatan,
    RANK() OVER (ORDER BY SUM(pendapatan) DESC) AS peringkat_pendapatan,
    SUM(pendapatan) / SUM(SUM(pendapatan)) OVER () * 100 AS pct_dari_total
FROM pesanan
GROUP BY wilayah
ORDER BY total_pendapatan DESC;
```

---

## Fase 6: Daftar Periksa Pembuatan Dashboard

Sebelum membangun dashboard, jawab pertanyaan-pertanyaan ini:

- [ ] Siapa audiens utama? (eksekutif, tim ops, self-service)
- [ ] Apa satu angka terpenting yang perlu mereka lihat?
- [ ] Filter apa yang mereka butuhkan? (rentang tanggal, wilayah, produk, segmen)
- [ ] Seberapa sering ini akan diperbarui? (harian, mingguan, bulanan)
- [ ] Apakah perlu dibagikan ke luar perusahaan?

Kemudian bangun dengan urutan ini:
1. **Metrik utama** — satu KPI di bagian atas
2. **Grafik tren** — bagaimana metrik bergerak dari waktu ke waktu
3. **Breakdown** — kategori mana yang mendorong metrik
4. **Tabel detail** — untuk menggali spesifik

---

## Fase 7: Menulis Laporan Bisnis

Ikuti struktur dari Sesi 9:

1. **Executive Summary** (3 kalimat: konteks, temuan, rekomendasi)
2. **Latar Belakang dan Tujuan** (1 paragraf)
3. **Metodologi** (sumber data, periode waktu, asumsi, keterbatasan)
4. **Temuan Utama** (3–5 temuan, masing-masing dengan bukti dan interpretasi)
5. **Rekomendasi** (spesifik, terukur, dimiliki, terikat waktu)
6. **Lampiran** (tabel data, grafik tambahan)

---

## Fase 8: Mempresentasikan Temuan

**Persiapan:** Antisipasi setiap pertanyaan yang mungkin diajukan. Untuk setiap temuan utama, ketahui:
- Apa penjelasan alternatifnya?
- Apa yang akan mengubah kesimpulanmu?
- Data apa yang kamu inginkan tapi tidak punya?

**Presentasi:** Awali dengan rekomendasi. Tunjukkan bukti. Undang pertanyaan.

**Tangani keberatan dengan tenang:**
- "Saya mengerti sudut pandangmu. Data menunjukkan X, tapi saya mengakui tidak memperhitungkan Y. Untuk menguji itu, kita butuh..."
- Jangan pernah defensif. Kamu menyajikan bukti, bukan mempertahankan egomu.

---

## Tips Portofolio: Presentasi di LinkedIn dan GitHub

### GitHub
1. Buat repository bernama `analisis-penjualan-retail`
2. Struktur:
   ```
   analisis-penjualan-retail/
   ├── README.md         ← Ikhtisar proyek, temuan utama, tech stack
   ├── data/
   │   ├── raw/          ← Data asli (dianonimkan jika perlu)
   │   └── processed/    ← Data yang sudah dibersihkan
   ├── notebooks/
   │   └── analisis.ipynb ← Notebook Jupyter dengan analisis lengkap
   ├── reports/
   │   └── ringkasan_eksekutif.pdf
   └── dashboard/
       └── link_looker_studio.txt
   ```
3. Tulis README yang menarik: pernyataan masalah, pendekatan, temuan utama (dengan gambar grafik), tautan ke dashboard

### LinkedIn
Posting showcase proyek:
- 1 grafik yang menarik (temuan paling menarik)
- Deskripsi 3 kalimat: masalah apa yang dipecahkan, apa yang ditemukan, apa yang direkomendasikan
- Tautan ke GitHub repo
- Tag: #DataAnalytics #SQL #Python #PowerBI #DataVisualization

---

## Brief Proyek Capstone

### Skenario: Analisis Pendapatan RetailMaju

**Latar belakang perusahaan:** RetailMaju adalah retailer e-commerce Indonesia yang menjual elektronik konsumen, fashion, dan perabot rumah tangga di seluruh Jawa dan Sumatra.

**Masalah:** CFO memperhatikan bahwa total pendapatan 2024 15% di bawah run-rate 2023, meskipun sudah meluncurkan dua kategori produk baru. Ia ingin memahami mengapa dan apa yang harus dilakukan.

**Tugasmu:**
1. Analisis dataset penjualan 2023–2024 yang disediakan (50.000+ rekaman transaksi)
2. Identifikasi driver utama dari kesenjangan pendapatan
3. Bangun dashboard interaktif di Looker Studio atau Power BI
4. Tulis laporan bisnis dengan rekomendasi spesifik
5. Siapkan presentasi 10 menit untuk CFO

---

## Rubrik Evaluasi yang Dijelaskan

### 1. Definisi Masalah dan Lingkup (10 poin)
- Apakah pertanyaan bisnis didefinisikan dengan jelas?
- Apakah lingkupnya sesuai?
- Apakah metrik keberhasilan didefinisikan?

### 2. Kualitas Data (15 poin)
- Apakah semua masalah kualitas data utama diidentifikasi dan didokumentasikan?
- Apakah keputusan pembersihan dibenarkan?

### 3. Kedalaman Analitis (25 poin)
- Apakah kamu melampaui metrik permukaan?
- Apakah kamu mengidentifikasi akar masalah, bukan hanya gejala?
- Apakah analisisnya secara statistik valid?

### 4. Kualitas Visualisasi (15 poin)
- Apakah dashboard jelas dan terdesain dengan baik?
- Apakah tipe chart sesuai untuk datanya?
- Bisakah stakeholder non-teknis memahaminya dalam 5 detik?

### 5. Laporan dan Rekomendasi (25 poin)
- Apakah executive summary berdiri sendiri?
- Apakah temuan diartikulasikan dengan jelas dan bukti?
- Apakah rekomendasi spesifik, terukur, dan diprioritaskan?

### 6. Presentasi (10 poin)
- Apakah jawaban disampaikan di depan (Pyramid Principle)?
- Apakah pertanyaan sulit ditangani dengan baik?

**Total: 100 poin**
Untuk lulus: minimum 70 poin keseluruhan, minimum 15 poin di Kedalaman Analitis dan Laporan & Rekomendasi.

---

## Poin-Poin Kunci

1. Proyek analisis nyata memiliki 8 fase — jangan melewati satupun.
2. Wawancara stakeholder sebelum menyentuh data adalah hal yang tidak bisa dinegosiasikan.
3. Penilaian kualitas data melindungi kredibilitasmu — jangan percaya data secara buta.
4. Dokumentasikan setiap keputusan pembersihan — bagian metodologimu bergantung padanya.
5. EDA adalah pekerjaan detektif — biarkan data mengejutkanmu sebelum kamu membangun hipotesis.
6. GitHub dan portofolio LinkedIn mengubah pekerjaan proyekmu menjadi modal karier.
7. Capstone adalah bukti kompetensimu — perlakukan seperti keterlibatan klien nyata.

$id11$
WHERE session_number = '11';

UPDATE sessions SET
  content_en = $en12$
# Session 12: Data Ethics, Security & BNSP Certification Preparation

## Why Ethics Matters in Data Analytics

Data is not neutral. Every dataset was collected by someone, for some purpose, using methods that inevitably reflect choices and biases. When analysts use data, those choices compound. The decisions downstream affect real people.

Consider these real cases (slightly modified):

**Case 1: The hiring algorithm** — A major technology company built a machine learning model to screen resumes. The model learned from historical hiring data — which predominantly featured men because the tech industry had historically hired mostly men. The model learned to penalize resumes that contained words like "women's" (as in "women's chess club"). The company scrapped the tool, but only after discovering the bias years later.

**Case 2: The credit score disparity** — Several fintech companies found their credit models gave significantly lower scores to applicants from certain postal codes. Those postal codes happened to correlate with race. The companies did not intend to discriminate — but their data reflected historical lending patterns that were themselves discriminatory.

**Case 3: The health system error** — A major US health system used an algorithm to identify patients who needed high-risk care management. The algorithm used healthcare spending as a proxy for health needs. But sicker patients from lower-income groups spent less because they had less access to care. The algorithm systematically underestimated their needs.

In all three cases, the analysts were not malicious. The data was real. The models worked technically. But the outcomes harmed people.

**Ethical data work requires thinking beyond "is this technically correct?" to "is this fair, transparent, and accountable?"**

---

## Types of Bias in Data

### Selection Bias

Selection bias occurs when the data you have is not representative of the population you want to make claims about.

**Example:** You survey your customers about product satisfaction. You get 500 responses. But your survey response rate is 15%, and the people most likely to respond are your most engaged (happy) or most frustrated customers. The 85% who didn't respond are the "average" customers whose experience you most need to understand.

**Another example (survivorship bias, a specific type):** In World War II, engineers analyzed battle damage on returning aircraft and proposed adding armor to the areas with the most bullet holes. Abraham Wald pointed out the error: they were only looking at planes that survived. The holes they should worry about were on planes that didn't come back — the areas with no damage on returning planes might be exactly where the fatal hits occurred.

In data: if you only analyze successful customers, products, or campaigns, you miss the pattern of failure.

### Confirmation Bias

Confirmation bias is the tendency to seek out and emphasize data that confirms what you already believe, while ignoring or downplaying contradicting evidence.

**Example:** A marketing manager believes that Facebook ads are the best channel. An analyst prepares a report and, consciously or unconsciously, focuses analysis on the metrics where Facebook performs well (awareness) and pays less attention to where it underperforms (conversion rate, CAC).

**How to fight it:** Actively try to disprove your hypothesis. Before concluding "X causes Y," ask "what evidence would prove X does NOT cause Y?"

### Survivorship Bias

Only the winners are in your dataset. The failures disappeared.

**Business example:** A company wants to understand what makes their best-performing stores successful. They analyze their top 50 stores. But 30 stores closed in the past three years — those data points are gone. The factors that predicted failure are invisible in the surviving dataset.

### Measurement Bias

The way you measure something affects what you find.

**Example:** You want to measure "employee satisfaction." If you ask "Are you satisfied with your job?" (yes/no), you get different results than if you ask "On a scale of 1-10, how satisfied are you?" which gives different results than asking employees to describe their biggest frustrations.

**Example:** Response rates on satisfaction surveys are lower on Mondays and Fridays — if you only survey on certain days, your results may not represent the full picture.

---

## Indonesia's Personal Data Protection Law (UU PDP No. 27/2022)

Indonesia's Personal Data Protection Law was signed in October 2022 and represents a major shift in how organizations must handle personal data. Every data analyst working in Indonesia needs to understand the basics.

### What Counts as Personal Data?

**General personal data** (Pasal 4 UU PDP):
Any information that can identify an individual, directly or indirectly:
- Full name
- Gender
- Nationality
- Religion
- Civil status (married/unmarried/divorced)
- Address (home or work)
- Photo
- Phone number
- Email address
- Financial data (bank account, credit card number)
- IP address
- Cookies and device identifiers

**Specific (sensitive) personal data** — requires higher protection:
- Health and medical data
- Biometric data (fingerprints, facial recognition, iris scan, voice)
- Genetic data
- Criminal records
- Sexual orientation and behavior
- Political views
- Other sensitive personal data as defined by law

### Rights of Data Subjects (Explained in Plain Language)

Under UU PDP, every Indonesian citizen whose data is collected has these rights:

**Right to know (Hak untuk mengetahui):**
You must be told clearly: what data is being collected, why it's being collected, how long it will be kept, and who will have access to it.

**Right to access (Hak akses):**
Individuals can ask to see their own data that you hold. You must provide it.

**Right to correction (Hak koreksi):**
If their data is wrong, they can ask you to correct it. You must respond.

**Right to deletion (Hak penghapusan):**
Under certain circumstances, individuals can ask you to delete their data ("the right to be forgotten").

**Right to object (Hak keberatan):**
Individuals can object to how their data is being processed, especially for marketing purposes.

**Right to data portability (Hak portabilitas):**
Individuals can request their data in a machine-readable format to transfer to another service.

### Obligations of Organizations

If your organization collects personal data, it must:

1. **Obtain valid consent** before collecting — consent must be informed, specific, and freely given. Pre-ticked boxes don't count.
2. **Appoint a Data Protection Officer (DPO)** if processing data at scale
3. **Implement technical and organizational security measures** appropriate to the risk
4. **Report data breaches** to the relevant authority within 14 days of discovery
5. **Conduct Data Protection Impact Assessments (DPIA)** for high-risk processing activities
6. **Not transfer data internationally** without ensuring adequate protection

### Penalties: How Severe They Can Be

UU PDP has serious teeth:

| Violation | Maximum Penalty |
|-----------|----------------|
| Unlawful processing of personal data | Criminal: up to 5 years imprisonment and/or Rp 5 billion fine |
| Processing sensitive data without consent | Criminal: up to 5 years and/or Rp 5 billion |
| Falsifying personal data (causing losses) | Criminal: up to 7 years and/or Rp 7 billion |
| Administrative violations | Up to 2% of annual revenue |

These are not hypothetical — enforcement will increase over time as the regulatory framework matures.

### Practical Implications for Analysts Day-to-Day

**As a data analyst, you must:**

1. **Never create reports containing identifiable personal data without a legitimate business need** — aggregate whenever possible
2. **Anonymize or pseudonymize** before sharing data with external parties or in shared drives
3. **Use access control** — only access data you need for your specific task (least privilege principle)
4. **Be careful with exports** — a CSV of customer names and emails sitting in someone's Downloads folder is a data breach waiting to happen
5. **Question unusual requests** — if you're asked to pull a list of specific individuals' data for unclear purposes, ask why before complying

---

## GDPR: The International Standard

The EU's General Data Protection Regulation (GDPR) took effect in 2018 and became the global reference point for data privacy law. UU PDP was heavily influenced by it.

Key principles that overlap between GDPR and UU PDP:
- **Lawfulness, fairness, transparency** — data processing must be legal, fair, and transparent
- **Purpose limitation** — data collected for one purpose cannot be used for an unrelated purpose
- **Data minimization** — only collect what you need
- **Accuracy** — keep data accurate and up to date
- **Storage limitation** — don't keep data longer than necessary
- **Integrity and confidentiality** — protect data from unauthorized access and breaches

Even if you work for a purely Indonesian company, knowing GDPR helps because:
- Many enterprise clients, especially multinationals, require GDPR compliance
- GDPR is often used as the benchmark for "best practice" data governance

---

## Data Security Best Practices for Analysts

Security is not just for IT departments. As someone who accesses, moves, and analyzes sensitive data, you are a security actor.

### Never Share Raw Personal Data in Slack/Email

The most common real-world data breach is not a sophisticated hack — it's an analyst attaching a CSV with 10,000 customer records to an email and sending it to the wrong person, or posting it in a shared Slack channel.

**Rule:** Never send raw personal data via messaging tools or email. If you must share data, use:
- Secure file sharing (Google Drive with access controls, not "anyone with the link")
- Aggregated reports instead of individual records
- Anonymized or pseudonymized datasets

### Anonymization and Pseudonymization

**Anonymization:** Irreversibly removing all identifying information so the data cannot be linked back to an individual.
- True anonymization is hard — even with names removed, a combination of age, gender, city, and job title can identify people in small datasets
- Once truly anonymous, data is no longer subject to privacy law

**Pseudonymization:** Replacing direct identifiers with codes, while keeping a separate mapping table that allows re-identification.
- Example: Replace customer_email with customer_id = "HASH_789abc"
- The mapping table (customer_id → email) is stored separately with strict access controls
- Still personal data under UU PDP (can be re-identified), but lower risk

### Access Controls: Least Privilege Principle

The **least privilege principle** means every person and system should have access to the minimum data and permissions needed to do their job — nothing more.

**In practice:**
- Don't give every analyst access to every table in the data warehouse
- Create views (SQL VIEWs) that expose only the non-sensitive columns to most users
- Keep sensitive tables (e.g., customer financial records) behind additional access controls
- Use row-level security (like Supabase's RLS) so users only see their own organization's data

### Secure Data Transfer

When data must move:
- Use encrypted channels (HTTPS, SFTP, encrypted email)
- Never email data files to personal email addresses
- Password-protect ZIP files containing sensitive data (and send the password separately)
- Use temporary, expiring links for large file transfers

### What to Do If You Suspect a Data Breach

1. **Don't panic, but act quickly**
2. **Stop the breach if possible** — revoke access, take the file down, notify whoever sent the data
3. **Document what happened** — what data, how many people, when, how it was discovered
4. **Report immediately** — to your manager, security team, and DPO
5. **Under UU PDP, the organization has 14 days** to report to the regulator
6. **Do not try to cover it up** — cover-ups make the legal situation dramatically worse

---

## Ethical Frameworks for Data Use

Beyond legal compliance, ethical data work asks deeper questions.

### Fairness: Does Your Analysis Disadvantage a Group?

Ask yourself:
- Does my model or analysis perform differently for different demographic groups?
- Is the data I'm using reflective of historical inequities that I might be perpetuating?
- Who could be harmed by the recommendations derived from my analysis?

### Transparency: Can You Explain Your Methodology?

An ethical analyst can explain:
- Where the data came from and how it was collected
- What assumptions were made
- What the limitations are
- How the analysis was performed (in plain language, not just technically)

If you cannot explain your analysis to a non-technical person, you don't understand it well enough — or it's too complex to use responsibly.

### Accountability: Who Is Responsible?

Data-driven decisions affect people. Someone needs to be responsible for those decisions. As an analyst:
- Be clear about the limits of what the data can tell us
- Don't let "the algorithm said so" be used to dodge accountability
- Advocate for human review of high-stakes automated decisions
- Document your assumptions — if your recommendation is implemented based on a flawed assumption, that should be on the record

---

## BNSP Certification Overview

### What Is BNSP?

BNSP stands for **Badan Nasional Sertifikasi Profesi** — Indonesia's national professional certification body. It operates under the Ministry of Manpower and establishes the framework for professional competency standards in Indonesia.

BNSP certifications are based on **SKKNI (Standar Kompetensi Kerja Nasional Indonesia)** — national work competency standards for each profession. Having a BNSP certification signals to employers that you have been independently assessed against a national standard.

### The 8 Competency Units for Data Analyst

The BNSP Data Analyst certification covers these competency units:

| Unit | Code | Title |
|------|------|-------|
| 1 | M.70200.001 | Plan data collection activities |
| 2 | M.70200.002 | Collect data from various sources |
| 3 | M.70200.003 | Verify and validate data |
| 4 | M.70200.004 | Process and transform data |
| 5 | M.70200.005 | Perform statistical analysis |
| 6 | M.70200.006 | Interpret analysis results |
| 7 | M.70200.007 | Create data visualizations |
| 8 | M.70200.008 | Present analysis results |

### What the Assessment Looks Like

BNSP assessments are conducted by licensed **Lembaga Sertifikasi Profesi (LSP)** — accredited certification bodies. The assessment typically has three parts:

**1. Portfolio Assessment (Portofolio)**
You submit evidence of your work — reports you've written, dashboards you've built, code you've produced. This proves you have applied the competencies in real work. Keep a portfolio of everything you produce during this course.

**2. Written/Knowledge Assessment (Tertulis)**
Multiple choice and essay questions testing your understanding of data analysis concepts, tools, and methodology. Covers all 8 competency units.

**3. Practical Demonstration (Demonstrasi Praktik)**
You perform data analysis tasks in front of the assessor. This might include: cleaning a dataset, writing SQL queries, building a visualization, and interpreting results. This is typically the most challenging part.

**4. Interview (Wawancara)**
The assessor asks questions about your portfolio and practical work to verify understanding. Questions like: "Walk me through how you would handle missing values in this dataset" or "Explain why you chose a bar chart instead of a pie chart here."

### Tips for Passing: What Assessors Look For

**1. Can you explain your thinking?**
Assessors care more about your reasoning than your conclusion. "I chose to impute with the median rather than the mean because the revenue column was right-skewed, which means the mean would be inflated by outliers" is better than just showing the correct result.

**2. Do you know your limitations?**
Assessors respect honesty. "I'm not certain whether this analysis accounts for seasonal effects — that would require data from more years" shows mature thinking.

**3. Can you connect data to business decisions?**
Don't just analyze. Always link your findings to business implications. "This 15% churn increase means approximately Rp 2.1 billion in annualized lost revenue" is what assessors want to hear.

**4. Is your portfolio presentation clean and professional?**
PDF reports, not messy notebooks. Proper labeling, no unexplained charts. Executive summaries that stand alone.

**5. Can you handle curveball questions?**
Assessors may give you data with errors and see if you catch them. Practice EDA deliberately — always check for anomalies.

### How to Prepare in 2 Weeks

**Week 1: Consolidate your knowledge**
- Days 1-2: Review Sessions 01-06 (data concepts, SQL)
- Days 3-4: Review Sessions 07-08 (visualization, Power BI)
- Days 5-6: Review Sessions 09-10 (storytelling, Python)
- Day 7: Rest and review Session 11 (end-to-end project methodology)

**Week 2: Practice and portfolio**
- Days 1-3: Complete your capstone project (if not already done)
- Days 4-5: Build your portfolio — organize reports, screenshots, notebook links
- Day 6: Practice explaining your work out loud (literally record yourself)
- Day 7: Prepare for interview questions — write answers to 20 common questions

**Common interview questions to prepare for:**
1. Explain the difference between a mean and a median. When would you use each?
2. How do you handle missing values in a dataset?
3. What is the difference between correlation and causation?
4. Walk me through how you would approach a new data analysis project from scratch.
5. What is a star schema and why is it used?
6. What is the most important DAX function in Power BI and why?
7. How do you know when to use a bar chart vs a line chart?
8. Explain the Pyramid Principle in your own words.
9. What is UU PDP and what does it mean for data analysts?
10. Describe a time when you found an insight in data that surprised you.

---

## Career Next Steps

### Building Your Portfolio

By the end of this program, you should have:
- 1 complete capstone analysis project (GitHub repo + dashboard)
- 2-3 smaller analyses from exercises in Sessions 04-10
- Documentation of your SQL exercises
- A BNSP certificate (after passing)

**Portfolio format:**
- GitHub profile with pinned repositories
- Looker Studio or Power BI dashboards (published with public access)
- A simple portfolio website (optional but impressive — free via GitHub Pages)

### Job Search Strategy

**Where to look:**
- LinkedIn (use "Data Analyst" + "Jakarta" or your target city)
- Glints, JobStreet, Kalibrr for Indonesian market
- Company websites directly (Tokopedia, Gojek, Grab, banks, consulting firms)

**What to include in your application:**
- Resume: 1 page, quantified achievements ("Built dashboard tracking Rp 4B in monthly revenue"), link to GitHub
- LinkedIn: complete profile, portfolio links, post about your projects

**The first 3-6 months in a new role:**
- You will not know everything — that is expected
- Ask questions, document what you learn
- Find one business problem to solve that nobody asked you to solve — then solve it and present the findings
- Build relationships with stakeholders and data engineers

### Salary Negotiation

**Ranges in Indonesia (2024 estimates):**

| Level | Role | Monthly Salary Range |
|-------|------|---------------------|
| Entry | Junior Data Analyst | Rp 5-10 million |
| Mid | Data Analyst | Rp 10-20 million |
| Senior | Senior Data Analyst | Rp 20-35 million |
| Lead | Lead / Analytics Manager | Rp 35-60 million |

*Ranges vary significantly by industry (tech/startup vs. FMCG vs. banking) and company size.*

**Negotiation tips:**
1. Research the market first (Glassdoor, LinkedIn Salary, Levels.fyi for tech)
2. Always negotiate — most companies expect it
3. If they ask for your expected salary: give a range, put your target at the bottom of the range
4. Consider total compensation: base + bonus + stock/options + benefits
5. Get the offer in writing before giving notice at your current job

---

## Key Takeaways

1. Data is not neutral — every dataset and analysis reflects choices that affect real people.
2. Know your biases: selection bias, confirmation bias, survivorship bias, measurement bias.
3. UU PDP No. 27/2022 gives Indonesian citizens strong rights over their personal data — analysts must understand and comply.
4. Data security is everyone's responsibility: least privilege, no raw PII in Slack, anonymize before sharing.
5. Ethical frameworks (fairness, transparency, accountability) go beyond legal compliance.
6. BNSP certification validates your competency against a national standard — prepare your portfolio and practice explaining your thinking.
7. Your career starts with the capstone, GitHub portfolio, and LinkedIn presence — treat them as seriously as the technical skills.

$en12$,
  content_id = $id12$
# Sesi 12: Etika Data, Keamanan & Persiapan Sertifikasi BNSP

## Mengapa Etika Penting dalam Analitik Data

Data tidak bersifat netral. Setiap dataset dikumpulkan oleh seseorang, untuk suatu tujuan, menggunakan metode yang mau tidak mau mencerminkan pilihan dan bias. Ketika analis menggunakan data, pilihan-pilihan itu berlipat ganda. Keputusan yang dihasilkan mempengaruhi orang nyata.

Pertimbangkan kasus-kasus nyata ini:

**Kasus 1: Algoritma rekrutmen** — Sebuah perusahaan teknologi besar membangun model machine learning untuk menyaring resume. Model belajar dari data perekrutan historis — yang didominasi laki-laki karena industri teknologi secara historis banyak merekrut laki-laki. Model belajar memberikan penalti pada resume yang mengandung kata "perempuan" (seperti dalam "klub catur perempuan"). Perusahaan menghentikan alat ini, tapi hanya setelah menemukan bias bertahun-tahun kemudian.

**Kasus 2: Disparitas skor kredit** — Beberapa perusahaan fintech menemukan model kredit mereka memberikan skor yang jauh lebih rendah kepada pelamar dari kode pos tertentu. Kode pos tersebut ternyata berkorelasi dengan ras. Perusahaan tidak bermaksud mendiskriminasi — tapi datanya mencerminkan pola peminjaman historis yang sendirinya diskriminatif.

Dalam semua kasus, para analis tidak jahat. Datanya nyata. Model bekerja secara teknis. Tapi hasilnya merugikan orang.

**Pekerjaan data yang etis membutuhkan pemikiran melampaui "apakah ini secara teknis benar?" menuju "apakah ini adil, transparan, dan bertanggung jawab?"**

---

## Jenis-Jenis Bias dalam Data

### Selection Bias (Bias Seleksi)

Bias seleksi terjadi ketika data yang kamu miliki tidak mewakili populasi yang ingin kamu buat klaim tentangnya.

**Contoh:** Kamu mensurvei pelangganmu tentang kepuasan produk. Kamu mendapat 500 respons. Tapi tingkat respons surveimu 15%, dan orang yang paling mungkin merespons adalah pelanggan yang paling terlibat (puas) atau paling frustrasi. 85% yang tidak merespons adalah pelanggan "rata-rata" yang pengalamannya paling perlu kamu pahami.

### Confirmation Bias (Bias Konfirmasi)

Confirmation bias adalah kecenderungan untuk mencari dan menekankan data yang mengkonfirmasi apa yang sudah kamu percaya, sambil mengabaikan atau meremehkan bukti yang bertentangan.

**Contoh:** Seorang manajer marketing percaya bahwa iklan Facebook adalah saluran terbaik. Seorang analis menyiapkan laporan dan, sadar atau tidak sadar, fokus pada metrik di mana Facebook berkinerja baik (kesadaran) dan kurang memperhatikan di mana kinerjanya buruk (tingkat konversi, CAC).

**Cara melawannya:** Secara aktif coba sanggah hipotesismu. Sebelum menyimpulkan "X menyebabkan Y", tanyakan "bukti apa yang akan membuktikan X TIDAK menyebabkan Y?"

### Survivorship Bias (Bias Ketahanan Hidup)

Hanya pemenang yang ada dalam datasetmu. Kegagalan menghilang.

**Contoh bisnis:** Sebuah perusahaan ingin memahami apa yang membuat toko-toko terbaik mereka sukses. Mereka menganalisis 50 toko teratas. Tapi 30 toko tutup dalam tiga tahun terakhir — titik data tersebut hilang. Faktor-faktor yang memprediksi kegagalan tidak terlihat dalam dataset yang bertahan.

### Measurement Bias (Bias Pengukuran)

Cara kamu mengukur sesuatu mempengaruhi apa yang kamu temukan.

**Contoh:** Kamu ingin mengukur "kepuasan karyawan." Jika kamu bertanya "Apakah kamu puas dengan pekerjaanmu?" (ya/tidak), kamu mendapat hasil yang berbeda dari jika kamu bertanya "Pada skala 1-10, seberapa puas kamu?"

---

## UU PDP No. 27/2022: Undang-Undang Perlindungan Data Pribadi Indonesia

UU PDP ditandatangani pada Oktober 2022 dan merupakan pergeseran besar dalam cara organisasi harus menangani data pribadi. Setiap analis data yang bekerja di Indonesia perlu memahami dasarnya.

### Apa yang Termasuk Data Pribadi?

**Data pribadi umum** (Pasal 4 UU PDP):
Informasi apa pun yang dapat mengidentifikasi seseorang, langsung atau tidak langsung:
- Nama lengkap
- Jenis kelamin
- Kewarganegaraan
- Agama
- Status perkawinan
- Alamat (rumah atau tempat kerja)
- Foto
- Nomor telepon
- Alamat email
- Data keuangan (rekening bank, nomor kartu kredit)
- Alamat IP
- Cookie dan pengenal perangkat

**Data pribadi spesifik (sensitif)** — memerlukan perlindungan lebih tinggi:
- Data kesehatan dan medis
- Data biometrik (sidik jari, pengenalan wajah, pemindaian iris, suara)
- Data genetik
- Catatan kriminal
- Orientasi seksual dan perilaku
- Pandangan politik

### Hak-Hak Subjek Data (Dijelaskan dalam Bahasa Sederhana)

**Hak untuk mengetahui:**
Kamu harus diberitahu dengan jelas: data apa yang dikumpulkan, mengapa dikumpulkan, berapa lama disimpan, dan siapa yang akan memiliki akses.

**Hak akses:**
Individu dapat meminta melihat data mereka sendiri yang kamu pegang.

**Hak koreksi:**
Jika data mereka salah, mereka dapat meminta kamu memperbaikinya.

**Hak penghapusan:**
Dalam keadaan tertentu, individu dapat meminta kamu menghapus data mereka ("hak untuk dilupakan").

**Hak keberatan:**
Individu dapat keberatan atas cara data mereka diproses, terutama untuk tujuan pemasaran.

**Hak portabilitas data:**
Individu dapat meminta data mereka dalam format yang dapat dibaca mesin untuk dipindahkan ke layanan lain.

### Kewajiban Organisasi

Jika organisasimu mengumpulkan data pribadi, harus:

1. **Mendapatkan persetujuan yang valid** sebelum mengumpulkan
2. **Menunjuk Data Protection Officer (DPO)** jika memproses data dalam skala besar
3. **Menerapkan langkah keamanan teknis dan organisasi**
4. **Melaporkan pelanggaran data** dalam 14 hari setelah penemuan
5. **Melakukan Data Protection Impact Assessment (DPIA)** untuk aktivitas pemrosesan berisiko tinggi
6. **Tidak mentransfer data secara internasional** tanpa memastikan perlindungan yang memadai

### Sanksi: Seberapa Berat

| Pelanggaran | Sanksi Maksimum |
|-------------|----------------|
| Pemrosesan data pribadi secara tidak sah | Pidana: hingga 5 tahun dan/atau denda Rp 5 miliar |
| Memproses data sensitif tanpa persetujuan | Pidana: hingga 5 tahun dan/atau Rp 5 miliar |
| Pemalsuan data pribadi (menimbulkan kerugian) | Pidana: hingga 7 tahun dan/atau Rp 7 miliar |
| Pelanggaran administratif | Hingga 2% dari pendapatan tahunan |

### Implikasi Praktis untuk Analis Sehari-Hari

**Sebagai analis data, kamu harus:**

1. **Jangan pernah membuat laporan yang berisi data pribadi yang dapat diidentifikasi** tanpa kebutuhan bisnis yang sah — agregasikan jika memungkinkan
2. **Anonimkan atau pseudonimkan** sebelum berbagi data dengan pihak eksternal
3. **Gunakan kontrol akses** — hanya akses data yang kamu butuhkan untuk tugas spesifikmu
4. **Hati-hati dengan ekspor** — CSV nama dan email pelanggan di folder Downloads seseorang adalah pelanggaran data yang menunggu terjadi
5. **Pertanyakan permintaan yang tidak biasa** — jika diminta menarik daftar data individu tertentu untuk tujuan yang tidak jelas, tanyakan mengapa sebelum mematuhi

---

## GDPR: Standar Internasional

GDPR Uni Eropa berlaku sejak 2018 dan menjadi titik referensi global untuk hukum privasi data. UU PDP sangat dipengaruhi olehnya.

Prinsip utama yang tumpang tindih antara GDPR dan UU PDP:
- **Keabsahan, keadilan, transparansi** — pemrosesan data harus legal, adil, dan transparan
- **Pembatasan tujuan** — data yang dikumpulkan untuk satu tujuan tidak dapat digunakan untuk tujuan yang tidak terkait
- **Minimisasi data** — hanya kumpulkan yang kamu butuhkan
- **Akurasi** — jaga data tetap akurat dan terkini
- **Pembatasan penyimpanan** — jangan simpan data lebih lama dari yang diperlukan
- **Integritas dan kerahasiaan** — lindungi data dari akses tidak sah

---

## Praktik Keamanan Data Terbaik untuk Analis

### Jangan Pernah Membagikan Data Pribadi Mentah di Slack/Email

Pelanggaran data dunia nyata yang paling umum bukan peretasan canggih — ini adalah analis yang melampirkan CSV berisi 10.000 rekaman pelanggan ke email dan mengirimkannya ke orang yang salah.

**Aturan:** Jangan pernah mengirim data pribadi mentah melalui alat pesan atau email. Jika harus berbagi data, gunakan:
- Berbagi file aman (Google Drive dengan kontrol akses, bukan "siapa pun dengan link")
- Laporan teragregasi alih-alih rekaman individual
- Dataset yang dianonimkan atau dipseudonymkan

### Anonimisasi dan Pseudonimisasi

**Anonimisasi:** Menghapus semua informasi identitas secara tidak dapat dibalik sehingga data tidak dapat dihubungkan kembali ke seseorang.
- Anonimisasi sejati sulit — bahkan dengan nama dihapus, kombinasi usia, jenis kelamin, kota, dan jabatan dapat mengidentifikasi orang dalam dataset kecil

**Pseudonimisasi:** Mengganti pengenal langsung dengan kode, sambil menyimpan tabel pemetaan terpisah yang memungkinkan re-identifikasi.
- Contoh: Ganti customer_email dengan customer_id = "HASH_789abc"
- Tabel pemetaan disimpan terpisah dengan kontrol akses ketat
- Masih merupakan data pribadi berdasarkan UU PDP, tapi risiko lebih rendah

### Kontrol Akses: Prinsip Least Privilege

**Prinsip least privilege** berarti setiap orang dan sistem harus memiliki akses ke data dan izin minimum yang diperlukan untuk melakukan pekerjaannya — tidak lebih.

**Dalam praktik:**
- Jangan beri setiap analis akses ke setiap tabel di data warehouse
- Buat view (SQL VIEWs) yang hanya mengekspos kolom non-sensitif kepada sebagian besar pengguna
- Simpan tabel sensitif di balik kontrol akses tambahan
- Gunakan row-level security sehingga pengguna hanya melihat data organisasi mereka sendiri

### Transfer Data yang Aman

- Gunakan saluran terenkripsi (HTTPS, SFTP)
- Jangan pernah mengirim file data ke alamat email pribadi
- Password-protect file ZIP yang berisi data sensitif (kirim passwordnya secara terpisah)

### Apa yang Dilakukan Jika Mencurigai Pelanggaran Data

1. **Jangan panik, tapi bertindak cepat**
2. **Hentikan pelanggaran jika memungkinkan** — cabut akses, turunkan file
3. **Dokumentasikan apa yang terjadi** — data apa, berapa orang, kapan, bagaimana ditemukan
4. **Laporkan segera** — ke manajermu, tim keamanan, dan DPO
5. **Berdasarkan UU PDP, organisasi memiliki 14 hari** untuk melapor ke regulator
6. **Jangan mencoba menyembunyikannya** — penyembunyian membuat situasi hukum jauh lebih buruk

---

## Kerangka Etika untuk Penggunaan Data

### Keadilan: Apakah Analisismu Merugikan Sebuah Kelompok?

Tanyakan pada dirimu:
- Apakah model atau analisisku berkinerja berbeda untuk kelompok demografis yang berbeda?
- Apakah data yang kugunakan mencerminkan ketidaksetaraan historis yang mungkin kulanggengkan?
- Siapa yang bisa dirugikan oleh rekomendasi yang berasal dari analisisku?

### Transparansi: Bisakah Kamu Menjelaskan Metodologimu?

Analis yang etis dapat menjelaskan:
- Dari mana data berasal dan bagaimana dikumpulkan
- Asumsi apa yang dibuat
- Apa keterbatasannya
- Bagaimana analisis dilakukan (dalam bahasa sederhana)

Jika kamu tidak bisa menjelaskan analisismu kepada orang non-teknis, kamu tidak cukup memahaminya — atau terlalu kompleks untuk digunakan secara bertanggung jawab.

### Akuntabilitas: Siapa yang Bertanggung Jawab?

Keputusan berbasis data mempengaruhi orang. Seseorang perlu bertanggung jawab atas keputusan tersebut. Sebagai analis:
- Jelaskan dengan jelas batas apa yang dapat diceritakan oleh data
- Jangan biarkan "algoritma bilang begitu" digunakan untuk menghindari akuntabilitas
- Advokasi tinjauan manusia atas keputusan otomatis berisiko tinggi
- Dokumentasikan asumsimu

---

## Ikhtisar Sertifikasi BNSP

### Apa Itu BNSP?

BNSP adalah **Badan Nasional Sertifikasi Profesi** — lembaga sertifikasi profesi nasional Indonesia di bawah Kementerian Ketenagakerjaan. BNSP menetapkan kerangka standar kompetensi profesional di Indonesia.

Sertifikasi BNSP didasarkan pada **SKKNI (Standar Kompetensi Kerja Nasional Indonesia)**. Memiliki sertifikasi BNSP memberi sinyal kepada pemberi kerja bahwa kamu telah dinilai secara independen terhadap standar nasional.

### 8 Unit Kompetensi untuk Analis Data

| Unit | Kode | Judul |
|------|------|-------|
| 1 | M.70200.001 | Merencanakan kegiatan pengumpulan data |
| 2 | M.70200.002 | Mengumpulkan data dari berbagai sumber |
| 3 | M.70200.003 | Memverifikasi dan memvalidasi data |
| 4 | M.70200.004 | Memproses dan mentransformasi data |
| 5 | M.70200.005 | Melakukan analisis statistik |
| 6 | M.70200.006 | Menginterpretasikan hasil analisis |
| 7 | M.70200.007 | Membuat visualisasi data |
| 8 | M.70200.008 | Mempresentasikan hasil analisis |

### Seperti Apa Penilaiannya

Penilaian BNSP dilakukan oleh **Lembaga Sertifikasi Profesi (LSP)** yang berlisensi. Penilaian biasanya memiliki tiga bagian:

**1. Penilaian Portofolio**
Kamu menyerahkan bukti pekerjaanmu — laporan yang pernah ditulis, dashboard yang dibangun, kode yang diproduksi. Ini membuktikan kamu telah menerapkan kompetensi dalam pekerjaan nyata.

**2. Penilaian Tertulis/Pengetahuan**
Soal pilihan ganda dan esai yang menguji pemahamanmu tentang konsep, alat, dan metodologi analisis data.

**3. Demonstrasi Praktik**
Kamu melakukan tugas analisis data di hadapan asesor. Ini mungkin mencakup: membersihkan dataset, menulis query SQL, membangun visualisasi, dan menginterpretasikan hasil.

**4. Wawancara**
Asesor mengajukan pertanyaan tentang portofolio dan pekerjaan praktismu. Pertanyaan seperti: "Jelaskan bagaimana kamu akan menangani nilai yang hilang dalam dataset ini" atau "Jelaskan mengapa kamu memilih bar chart daripada pie chart di sini."

### Tips untuk Lulus: Apa yang Dicari Asesor

**1. Bisakah kamu menjelaskan pemikiranmu?**
Asesor lebih peduli dengan penalaranmu daripada kesimpulanmu. "Saya memilih untuk mengimputasi dengan median daripada mean karena kolom pendapatan condong ke kanan, yang berarti mean akan membesar karena outlier" lebih baik dari sekadar menunjukkan hasil yang benar.

**2. Apakah kamu tahu keterbatasanmu?**
Asesor menghargai kejujuran. "Saya tidak yakin apakah analisis ini memperhitungkan efek musiman — itu memerlukan data dari lebih banyak tahun" menunjukkan pemikiran yang matang.

**3. Bisakah kamu menghubungkan data ke keputusan bisnis?**
Jangan hanya menganalisis. Selalu hubungkan temuanmu dengan implikasi bisnis.

**4. Apakah presentasi portofoliomu bersih dan profesional?**
Laporan PDF, bukan notebook yang berantakan. Pelabelan yang tepat, tidak ada grafik yang tidak dijelaskan. Executive summary yang berdiri sendiri.

**5. Bisakah kamu menangani pertanyaan tak terduga?**
Asesor mungkin memberimu data dengan error dan melihat apakah kamu menangkapnya.

### Cara Mempersiapkan Diri dalam 2 Minggu

**Minggu 1: Konsolidasikan pengetahuanmu**
- Hari 1-2: Tinjau Sesi 01-06 (konsep data, SQL)
- Hari 3-4: Tinjau Sesi 07-08 (visualisasi, Power BI)
- Hari 5-6: Tinjau Sesi 09-10 (storytelling, Python)
- Hari 7: Istirahat dan tinjau Sesi 11 (metodologi proyek end-to-end)

**Minggu 2: Praktik dan portofolio**
- Hari 1-3: Selesaikan proyek capstone
- Hari 4-5: Bangun portofoliomu
- Hari 6: Latih menjelaskan pekerjaanmu dengan keras (rekam dirimu)
- Hari 7: Persiapkan pertanyaan wawancara

**Pertanyaan wawancara umum untuk dipersiapkan:**
1. Jelaskan perbedaan antara mean dan median. Kapan kamu menggunakan masing-masing?
2. Bagaimana kamu menangani nilai yang hilang dalam dataset?
3. Apa perbedaan antara korelasi dan kausalitas?
4. Jelaskan bagaimana kamu mendekati proyek analisis data baru dari nol.
5. Apa itu star schema dan mengapa digunakan?
6. Apa fungsi DAX terpenting di Power BI dan mengapa?
7. Bagaimana kamu tahu kapan menggunakan bar chart vs line chart?
8. Jelaskan Pyramid Principle dengan kata-katamu sendiri.
9. Apa itu UU PDP dan apa artinya bagi analis data?
10. Ceritakan waktu ketika kamu menemukan insight dalam data yang mengejutkanmu.

---

## Langkah Karier Selanjutnya

### Membangun Portofoliomu

Di akhir program ini, kamu seharusnya memiliki:
- 1 proyek analisis capstone lengkap (repo GitHub + dashboard)
- 2-3 analisis lebih kecil dari latihan di Sesi 04-10
- Dokumentasi latihan SQL
- Sertifikat BNSP (setelah lulus)

### Strategi Pencarian Kerja

**Di mana mencari:**
- LinkedIn (gunakan "Data Analyst" + "Jakarta" atau kota targetmu)
- Glints, JobStreet, Kalibrr untuk pasar Indonesia
- Website perusahaan langsung (Tokopedia, Gojek, Grab, bank, perusahaan konsultan)

### Negosiasi Gaji

**Perkiraan di Indonesia (2024):**

| Level | Peran | Gaji Bulanan |
|-------|-------|--------------|
| Entry | Junior Data Analyst | Rp 5-10 juta |
| Mid | Data Analyst | Rp 10-20 juta |
| Senior | Senior Data Analyst | Rp 20-35 juta |
| Lead | Lead / Analytics Manager | Rp 35-60 juta |

**Tips negosiasi:**
1. Riset pasar dulu
2. Selalu negosiasi — kebanyakan perusahaan mengharapkannya
3. Jika ditanya gaji yang diharapkan: berikan rentang, tempatkan targetmu di bawah rentang
4. Pertimbangkan total kompensasi: gaji pokok + bonus + saham + tunjangan
5. Dapatkan penawaran secara tertulis sebelum memberikan pemberitahuan di pekerjaan saat ini

---

## Poin-Poin Kunci

1. Data tidak bersifat netral — setiap dataset dan analisis mencerminkan pilihan yang mempengaruhi orang nyata.
2. Kenali biasmu: selection bias, confirmation bias, survivorship bias, measurement bias.
3. UU PDP No. 27/2022 memberi warga negara Indonesia hak yang kuat atas data pribadi mereka — analis harus memahami dan mematuhinya.
4. Keamanan data adalah tanggung jawab semua orang: least privilege, tidak ada PII mentah di Slack, anonimkan sebelum berbagi.
5. Kerangka etika (keadilan, transparansi, akuntabilitas) melampaui kepatuhan hukum.
6. Sertifikasi BNSP memvalidasi kompetensimu terhadap standar nasional — persiapkan portofoliomu dan latih menjelaskan pemikiranmu.
7. Kariermu dimulai dengan capstone, portofolio GitHub, dan kehadiran LinkedIn — perlakukan mereka seserius kemampuan teknis.

$id12$
WHERE session_number = '12';
