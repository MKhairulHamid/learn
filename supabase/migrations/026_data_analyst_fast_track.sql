-- ============================================================
-- 026: Seed "Data Analyst Fast Track" program — 3 phases (pekan),
--      11 sessions with full Materi, plus the July 2026 cohort
--      (with the exact live-session schedule & times).
--
-- Mirrors the structure used by the Data Analyst (002/017) and
-- HR Fast Track (018) programs so it carries Materi, Playground,
-- discussion, progress, certificates — everything other programs have.
--
-- Session numbers are prefixed "F" (F01–F11) because
-- sessions.session_number is globally UNIQUE.
-- ============================================================

DO $$
DECLARE
  prog_id     uuid;
  phase1_id   uuid;
  phase2_id   uuid;
  phase3_id   uuid;
  cohort_id   uuid;
  lesson0_id  uuid := '00000000-0000-4000-8000-000000000000'; -- shared orientation (Lesson 0)
BEGIN

-- ── 1. Program ───────────────────────────────────────────
INSERT INTO public.programs
  (slug, name_en, name_id, description_en, description_id, icon, color, is_published, order_num)
VALUES
  ('data-analyst-fast-track',
   'Data Analyst Fast Track',
   'Data Analyst Fast Track',
   'An intensive 3-week, 11-session live program — from cleaning spreadsheets and core formulas to EDA, dashboards, Power BI, SQL, portfolio building, and BNSP preparation.',
   'Program live intensif 3 pekan, 11 sesi — dari membersihkan spreadsheet dan formula inti hingga EDA, dashboard, Power BI, SQL, penyusunan portofolio, dan persiapan BNSP.',
   '⚡', 'from-cyan-500 to-blue-600', true, 1)
RETURNING id INTO prog_id;

-- ── 2. Phases (Pekan) ────────────────────────────────────
INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (prog_id, 1,
   'Week 1: Data Foundations & Core Formulas',
   'Pekan 1: Fondasi Data & Formula Dasar',
   'Clean and shape incoming data, master core spreadsheet formulas, lookups, and pivot tables to turn raw data into insight.',
   'Membersihkan dan merapikan data, menguasai formula spreadsheet inti, lookup, dan pivot table untuk mengubah data mentah menjadi insight.',
   '📊', 'from-blue-500 to-cyan-500', 1)
RETURNING id INTO phase1_id;

INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (prog_id, 2,
   'Week 2: Advanced Analysis & Visualization',
   'Pekan 2: Analisis & Visualisasi Tingkat Lanjut',
   'Exploratory Data Analysis, data visualization principles, interactive dashboards, and building dashboards in Power BI.',
   'Exploratory Data Analysis, prinsip visualisasi data, dashboard interaktif, dan membangun dashboard di Power BI.',
   '📈', 'from-orange-500 to-amber-500', 2)
RETURNING id INTO phase2_id;

INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (prog_id, 3,
   'Week 3: SQL, Portfolio & BNSP Prep',
   'Pekan 3: SQL, Portofolio & Persiapan BNSP',
   'SQL fundamentals, building a storytelling portfolio, and preparing for the BNSP competency exam.',
   'Dasar-dasar SQL, menyusun portofolio dengan storytelling, dan persiapan uji kompetensi BNSP.',
   '🗄️', 'from-violet-500 to-purple-600', 3)
RETURNING id INTO phase3_id;

-- ── 3. Sessions ──────────────────────────────────────────
INSERT INTO public.sessions
  (phase_id, session_number, title_id, title_en, unit_skkni, learning_output_id, learning_output_en, order_num, estimated_duration_minutes, content_id, content_en)
VALUES

-- ── Pekan 1 ──────────────────────────────────────────────
(phase1_id, 'F01',
 'Membersihkan dan Merapihkan Data yang Diterima',
 'Cleaning and Shaping Incoming Data',
 'Unit 1: Pengumpulan & Persiapan Data',
 'Mampu mengidentifikasi duplikat dan data kosong, menangani error, serta merapikan isian data menggunakan fungsi teks dasar.',
 'Able to identify duplicates and blank data, handle errors, and clean data entries using core text functions.',
 101, 120,
 E'## Membersihkan dan Merapihkan Data yang Diterima\n\nData dunia nyata hampir selalu berantakan. Sebelum dianalisis, data harus dibersihkan dan dirapikan terlebih dahulu.\n\n### 1. Identifikasi Duplikat dan Data Kosong\n- Menemukan baris duplikat: **Data → Remove Duplicates**, atau tandai dengan `=COUNTIF($A$2:$A$100, A2) > 1`\n- Menemukan sel kosong: **Go To Special → Blanks**, atau `=COUNTBLANK(range)`\n\n### 2. Tips Error Handling\n- `=IFERROR(rumus, "nilai_pengganti")` untuk menangani `#N/A`, `#DIV/0!`, dsb.\n- `=IFNA(rumus, "tidak ditemukan")` khusus untuk error `#N/A`\n\n### 3. Merapikan Isian Data\n- `=TRIM(A2)` — menghapus spasi berlebih\n- `=CONCAT(A2, " ", B2)` — menggabungkan teks\n- `=LEFT(A2, 3)` dan `=RIGHT(A2, 4)` — mengambil sebagian teks dari kiri/kanan\n\n> **Latihan:** Ambil dataset kotor, hapus duplikat, rapikan kolom nama dengan `TRIM` + `CONCAT`, lalu bungkus rumus rawan error dengan `IFERROR`.',
 E'## Cleaning and Shaping Incoming Data\n\nReal-world data is almost always messy. Before any analysis, data must be cleaned and shaped first.\n\n### 1. Identify Duplicates and Blank Data\n- Find duplicate rows: **Data → Remove Duplicates**, or flag with `=COUNTIF($A$2:$A$100, A2) > 1`\n- Find blank cells: **Go To Special → Blanks**, or `=COUNTBLANK(range)`\n\n### 2. Error Handling Tips\n- `=IFERROR(formula, "fallback")` to handle `#N/A`, `#DIV/0!`, etc.\n- `=IFNA(formula, "not found")` specifically for `#N/A` errors\n\n### 3. Shaping Data Entries\n- `=TRIM(A2)` — remove extra spaces\n- `=CONCAT(A2, " ", B2)` — join text\n- `=LEFT(A2, 3)` and `=RIGHT(A2, 4)` — extract part of text from left/right\n\n> **Exercise:** Take a dirty dataset, remove duplicates, clean the name column with `TRIM` + `CONCAT`, then wrap error-prone formulas in `IFERROR`.'),

(phase1_id, 'F02',
 'Menyajikan Data Sesuai Kebutuhan Stakeholder',
 'Presenting Data to Stakeholder Needs',
 'Unit 1 & 2: Pengolahan Data',
 'Mampu menerapkan logika rumus dan statistik dasar, menggunakan SORT & FILTER, serta rumus kondisional dengan wildcard.',
 'Able to apply formula logic and basic statistics, use SORT & FILTER, and conditional formulas with wildcards.',
 102, 120,
 E'## Menyajikan Data Sesuai Kebutuhan Stakeholder\n\n### 1. Logika Rumus dan Statistik Dasar\nMemahami bagaimana spreadsheet mengevaluasi rumus, referensi sel relatif vs absolut (`A1` vs `$A$1`), dan ukuran statistik dasar.\n\n### 2. Rumus Dasar\n- `=SUM(range)` — menjumlahkan\n- `=COUNT(range)` / `=COUNTA(range)` — menghitung angka / sel terisi\n- `=AVERAGE(range)` — rata-rata\n\n### 3. Fitur SORT & FILTER\n- **Sort** untuk mengurutkan data\n- **Filter** untuk menampilkan hanya baris yang relevan bagi stakeholder\n\n### 4. Rumus Kondisional & Wildcard\n- `=IF(kondisi, nilai_benar, nilai_salah)`\n- `=SUMIF(range, kriteria, sum_range)` dan `=COUNTIF(range, kriteria)`\n- **Wildcard**: `*` (banyak karakter) dan `?` (satu karakter), mis. `=COUNTIF(A:A, "Jakarta*")`\n\n> **Latihan:** Buat ringkasan penjualan per wilayah menggunakan `SUMIF` + wildcard, lalu sajikan dengan FILTER.',
 E'## Presenting Data to Stakeholder Needs\n\n### 1. Formula Logic and Basic Statistics\nUnderstand how spreadsheets evaluate formulas, relative vs absolute references (`A1` vs `$A$1`), and basic statistical measures.\n\n### 2. Core Formulas\n- `=SUM(range)` — total\n- `=COUNT(range)` / `=COUNTA(range)` — count numbers / non-empty cells\n- `=AVERAGE(range)` — mean\n\n### 3. SORT & FILTER\n- **Sort** to order data\n- **Filter** to show only the rows relevant to a stakeholder\n\n### 4. Conditional Formulas & Wildcards\n- `=IF(condition, value_if_true, value_if_false)`\n- `=SUMIF(range, criteria, sum_range)` and `=COUNTIF(range, criteria)`\n- **Wildcards**: `*` (many characters) and `?` (one character), e.g. `=COUNTIF(A:A, "Jakarta*")`\n\n> **Exercise:** Build a sales summary by region using `SUMIF` + wildcards, then present it with FILTER.'),

(phase1_id, 'F03',
 'Menggabungkan & Highlight Dataset',
 'Joining & Highlighting Datasets',
 'Unit 2: Pengolahan Data Lanjutan',
 'Mampu mencari dan menggabungkan data antar tabel dengan VLOOKUP/HLOOKUP/XLOOKUP/INDEX-MATCH dan menyoroti kondisi data dengan Conditional Formatting.',
 'Able to look up and join data across tables with VLOOKUP/HLOOKUP/XLOOKUP/INDEX-MATCH and highlight data conditions with Conditional Formatting.',
 103, 120,
 E'## Menggabungkan & Highlight Dataset\n\n### 1. Alur Berpikir Pembuatan Laporan Data\nMulai dari pertanyaan bisnis → data yang dibutuhkan → penggabungan → penyajian.\n\n### 2. Pencarian Data\n- `=VLOOKUP(nilai, tabel, kolom, FALSE)` — pencarian vertikal\n- `=HLOOKUP(...)` — pencarian horizontal\n\n### 3. Teknik Tingkat Lanjut\n- `=XLOOKUP(nilai, range_cari, range_hasil)` — lebih fleksibel, bisa mencari ke kiri\n- `=INDEX(range_hasil, MATCH(nilai, range_cari, 0))` — kombinasi klasik yang andal\n\n### 4. Conditional Formatting\nMenyoroti kondisi data secara visual: nilai di atas/bawah ambang, duplikat, data bars, color scales.\n\n> **Latihan:** Gabungkan tabel transaksi dengan tabel master produk memakai `XLOOKUP`, lalu soroti margin rendah dengan Conditional Formatting.\n\n> 💡 Coba langsung di **Playground → Simulator XLOOKUP**.',
 E'## Joining & Highlighting Datasets\n\n### 1. The Reporting Thought Process\nFrom business question → data needed → joining → presentation.\n\n### 2. Data Lookups\n- `=VLOOKUP(value, table, col, FALSE)` — vertical lookup\n- `=HLOOKUP(...)` — horizontal lookup\n\n### 3. Advanced Techniques\n- `=XLOOKUP(value, lookup_range, return_range)` — more flexible, can look left\n- `=INDEX(return_range, MATCH(value, lookup_range, 0))` — the reliable classic combo\n\n### 4. Conditional Formatting\nHighlight data conditions visually: values above/below a threshold, duplicates, data bars, color scales.\n\n> **Exercise:** Join a transactions table with a product master table using `XLOOKUP`, then highlight low margins with Conditional Formatting.\n\n> 💡 Try it live in **Playground → XLOOKUP Simulator**.'),

(phase1_id, 'F04',
 'Pivot Table untuk Dapatkan Insight',
 'Pivot Tables for Insight',
 'Unit 2: Analisis Kuantitatif',
 'Mampu melakukan analisis kuantitatif menggunakan Pivot Table dari tingkat dasar hingga lanjut melalui studi kasus.',
 'Able to perform quantitative analysis using Pivot Tables from basic to advanced through case studies.',
 104, 120,
 E'## Pivot Table untuk Dapatkan Insight\n\n### 1. Analisis Kuantitatif dengan Pivot Table\nPivot Table meringkas ribuan baris menjadi insight dalam hitungan detik — tanpa rumus.\n\n### 2. Latihan Dasar Pivot Table\n- Menarik field ke area **Rows**, **Columns**, **Values**, **Filters**\n- Mengubah agregasi: Sum, Count, Average, % of Total\n\n### 3. Pivot Table Advanced\n- **Grouping** (tanggal → bulan/kuartal)\n- **Calculated Field**\n- **Slicer** untuk interaktivitas\n- **Show Values As** (mis. % of column total, running total)\n\n### 4. Studi Kasus Perkantoran\nMenganalisis data penjualan/operasional nyata untuk menjawab pertanyaan stakeholder.\n\n> **Latihan:** Buat Pivot Table pendapatan per kategori per bulan, tambahkan Slicer wilayah, dan temukan kategori dengan pertumbuhan tertinggi.',
 E'## Pivot Tables for Insight\n\n### 1. Quantitative Analysis with Pivot Tables\nPivot Tables summarize thousands of rows into insight in seconds — no formulas needed.\n\n### 2. Basic Pivot Table Practice\n- Drag fields into **Rows**, **Columns**, **Values**, **Filters**\n- Change aggregation: Sum, Count, Average, % of Total\n\n### 3. Advanced Pivot Tables\n- **Grouping** (dates → months/quarters)\n- **Calculated Fields**\n- **Slicers** for interactivity\n- **Show Values As** (e.g. % of column total, running total)\n\n### 4. Office Case Study\nAnalyze real sales/operations data to answer stakeholder questions.\n\n> **Exercise:** Build a Pivot Table of revenue by category by month, add a region Slicer, and find the highest-growth category.'),

-- ── Pekan 2 ──────────────────────────────────────────────
(phase2_id, 'F05',
 'Exploratory Data Analysis (EDA)',
 'Exploratory Data Analysis (EDA)',
 'Unit 3: Analisis Data',
 'Mampu melakukan analisis univariate & bivariate, menggali insight, dan menyampaikan rekomendasi dari hasil EDA.',
 'Able to perform univariate & bivariate analysis, extract insight, and deliver recommendations from EDA.',
 105, 90,
 E'## Exploratory Data Analysis (EDA)\n\nEDA adalah proses memahami data sebelum mengambil kesimpulan.\n\n### 1. Analisis Univariate & Bivariate\n- **Univariate** — satu variabel: distribusi, rata-rata, median, outlier\n- **Bivariate** — hubungan dua variabel: korelasi, perbandingan kelompok\n\n### 2. Menggali Insight\n- Cari pola, anomali, dan tren\n- Tanyakan "mengapa" di balik setiap angka yang menonjol\n\n### 3. Menyampaikan Rekomendasi\n- Ubah temuan menjadi rekomendasi yang **spesifik dan dapat ditindaklanjuti**\n- Hubungkan kembali ke pertanyaan bisnis awal\n\n> **Latihan:** Lakukan EDA pada dataset penjualan — analisis distribusi pendapatan (univariate) dan hubungan diskon vs jumlah pesanan (bivariate), lalu tulis 3 rekomendasi.',
 E'## Exploratory Data Analysis (EDA)\n\nEDA is the process of understanding data before drawing conclusions.\n\n### 1. Univariate & Bivariate Analysis\n- **Univariate** — one variable: distribution, mean, median, outliers\n- **Bivariate** — relationship between two variables: correlation, group comparison\n\n### 2. Extracting Insight\n- Look for patterns, anomalies, and trends\n- Ask "why" behind every number that stands out\n\n### 3. Delivering Recommendations\n- Turn findings into **specific, actionable** recommendations\n- Tie them back to the original business question\n\n> **Exercise:** Run EDA on a sales dataset — analyze revenue distribution (univariate) and discount vs order quantity (bivariate), then write 3 recommendations.'),

(phase2_id, 'F06',
 'Visualisasi Data',
 'Data Visualization',
 'Unit 4: Visualisasi Data',
 'Mampu menerapkan prinsip visualisasi data, memanfaatkan PivotChart, dan merancang dashboard interaktif yang baik.',
 'Able to apply data visualization principles, leverage PivotCharts, and design good interactive dashboards.',
 106, 90,
 E'## Visualisasi Data\n\n### 1. Prinsip Visualisasi & Tips Menyajikan Laporan\n- Satu chart = satu pesan\n- Pilih chart yang tepat (bar untuk perbandingan, line untuk tren, dsb.)\n- Hilangkan "chart junk"; gunakan warna seperlunya\n\n### 2. Pemanfaatan PivotChart\nMembuat chart yang langsung terhubung dengan Pivot Table — ikut berubah saat data difilter.\n\n### 3. Merancang Dashboard yang Baik\n- KPI terpenting di atas\n- Warna konsisten, kelompokkan chart yang berkaitan\n\n### 4. Dashboard Interaktif dengan Pivot Chart\nMenggabungkan PivotChart + Slicer + Timeline menjadi satu dashboard yang interaktif.\n\n> **Latihan:** Bangun dashboard penjualan dengan 3 PivotChart dan Slicer wilayah/periode.',
 E'## Data Visualization\n\n### 1. Visualization Principles & Reporting Tips\n- One chart = one message\n- Pick the right chart (bar for comparison, line for trend, etc.)\n- Remove "chart junk"; use color purposefully\n\n### 2. Leveraging PivotCharts\nCreate charts wired directly to a Pivot Table — they update as data is filtered.\n\n### 3. Designing a Good Dashboard\n- Most important KPIs at the top\n- Consistent colors, group related charts\n\n### 4. Interactive Dashboards with Pivot Charts\nCombine PivotCharts + Slicers + Timeline into one interactive dashboard.\n\n> **Exercise:** Build a sales dashboard with 3 PivotCharts and region/period Slicers.'),

(phase2_id, 'F07',
 'Introduce Power BI',
 'Introduction to Power BI',
 'Unit 4: Business Intelligence',
 'Mampu mengenali jenis chart dan fitur Power BI, menyusun dashboard, dan memublikasikannya.',
 'Able to recognize chart types and Power BI features, build a dashboard, and publish it.',
 107, 90,
 E'## Introduce Power BI\n\nPower BI adalah tool business intelligence untuk membuat dashboard interaktif skala besar.\n\n### 1. Jenis Chart & Fitur Power BI\n- Visual: bar, line, card, matrix, map, slicer\n- Field pane, Visualizations pane, Filters pane\n\n### 2. Menyusun Dashboard\n- Hubungkan data → bersihkan di Power Query → bangun visual → atur layout\n- Pengantar interaksi antar-visual (cross-filtering)\n\n### 3. Memublikasikan Dashboard\n- Publish ke Power BI Service\n- Berbagi dan menyematkan (embed) laporan\n\n> **Latihan:** Impor dataset, buat dashboard 1 halaman dengan 4 visual + slicer, lalu publish.',
 E'## Introduction to Power BI\n\nPower BI is a business intelligence tool for building large-scale interactive dashboards.\n\n### 1. Chart Types & Power BI Features\n- Visuals: bar, line, card, matrix, map, slicer\n- Field pane, Visualizations pane, Filters pane\n\n### 2. Building a Dashboard\n- Connect data → clean in Power Query → build visuals → arrange layout\n- Intro to cross-visual interaction (cross-filtering)\n\n### 3. Publishing a Dashboard\n- Publish to the Power BI Service\n- Share and embed reports\n\n> **Exercise:** Import a dataset, build a 1-page dashboard with 4 visuals + a slicer, then publish.'),

-- ── Pekan 3 ──────────────────────────────────────────────
(phase3_id, 'F08',
 'Introduce SQL',
 'Introduction to SQL',
 'Unit 5: Query Database',
 'Mampu memahami konsep SQL, menguasai operasi dasar, dan mempraktikkannya langsung.',
 'Able to understand SQL concepts, master basic operations, and practice them hands-on.',
 108, 90,
 E'## Introduce SQL\n\nSQL adalah bahasa untuk mengambil dan menganalisis data dari database — skill yang paling sering dicek recruiter.\n\n### 1. Perkenalan Konsep SQL\n- Apa itu database relasional, tabel, baris, kolom\n- Mengapa SQL > spreadsheet untuk data besar\n\n### 2. Dasar-Dasar Operasi SQL\n```sql\nSELECT kolom FROM tabel\nWHERE kondisi\nGROUP BY kolom\nORDER BY kolom\nLIMIT n;\n```\nAgregasi: `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`.\n\n### 3. Praktik Langsung\nMenjalankan query nyata pada dataset contoh.\n\n> 💡 Berlatih langsung di **Playground → SQL** — jalankan query di browser, tanpa instalasi.',
 E'## Introduction to SQL\n\nSQL is the language for retrieving and analyzing data from databases — the skill recruiters check most.\n\n### 1. SQL Concepts\n- What a relational database, table, row, and column are\n- Why SQL beats spreadsheets for large data\n\n### 2. SQL Basics\n```sql\nSELECT columns FROM table\nWHERE condition\nGROUP BY column\nORDER BY column\nLIMIT n;\n```\nAggregations: `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`.\n\n### 3. Hands-on Practice\nRun real queries against a sample dataset.\n\n> 💡 Practice live in **Playground → SQL** — run queries in the browser, no install needed.'),

(phase3_id, 'F09',
 'Final Project dan Portofolio',
 'Final Project & Portfolio',
 'Unit 6: Portofolio',
 'Mampu menyusun dan memublikasikan deck portofolio yang menarik menggunakan teknik storytelling.',
 'Able to build and publish an engaging portfolio deck using storytelling techniques.',
 109, 90,
 E'## Final Project dan Portofolio\n\nPortofolio adalah bukti kemampuanmu — lebih penting dari sekadar sertifikat.\n\n### Tips Menyusun Deck Portofolio dengan Storytelling\n- Mulai dari **konteks → masalah → analisis → insight → rekomendasi**\n- Setiap slide punya satu pesan utama\n\n### Tips Menyusun Portofolio yang Menarik\n- Tunjukkan proses, bukan hanya hasil akhir\n- Gunakan visual yang rapi dan konsisten\n- Pakai bahasa bisnis, bukan jargon teknis\n\n### Tips Memublikasikan Portofolio\n- Publikasikan di LinkedIn, Notion, atau Google Sites\n- Sertakan tautan dataset & dashboard\n\n> **Latihan:** Susun deck portofolio dari Final Project end-to-end dan publikasikan.',
 E'## Final Project & Portfolio\n\nA portfolio is proof of your ability — more important than a certificate alone.\n\n### Tips for a Storytelling Portfolio Deck\n- Flow from **context → problem → analysis → insight → recommendation**\n- Each slide carries one key message\n\n### Tips for an Engaging Portfolio\n- Show the process, not just the final result\n- Use clean, consistent visuals\n- Use business language, not technical jargon\n\n### Tips for Publishing a Portfolio\n- Publish on LinkedIn, Notion, or Google Sites\n- Include dataset & dashboard links\n\n> **Exercise:** Assemble a portfolio deck from your end-to-end Final Project and publish it.'),

(phase3_id, 'F10',
 'Kelas Persiapan BNSP — Mengidentifikasi Business Process',
 'BNSP Prep — Identifying Business Process',
 'BNSP: Persiapan Sertifikasi',
 'Mampu mengidentifikasi proses bisnis, melakukan root cause analysis, dan menyusun problem statement.',
 'Able to identify business processes, perform root cause analysis, and formulate a problem statement.',
 110, 90,
 E'## Kelas Persiapan BNSP — Mengidentifikasi Business Process\n\nPersiapan menghadapi uji kompetensi BNSP Data Analyst.\n\n### 1. Business Process (Proses Bisnis)\nMemetakan alur kerja sebuah proses bisnis untuk menemukan titik analisis data.\n\n### 2. Root Cause Analysis (Analisis Akar Masalah)\n- Teknik **5 Whys** dan diagram **Fishbone (Ishikawa)**\n- Membedakan gejala vs akar masalah\n\n### 3. Problem Statement (Rumusan Masalah)\nMerumuskan masalah secara jelas, terukur, dan terikat konteks bisnis.\n\n> **Latihan:** Pilih satu kasus bisnis, petakan prosesnya, lakukan 5 Whys, dan tuliskan problem statement.',
 E'## BNSP Prep — Identifying Business Process\n\nPreparation for the BNSP Data Analyst competency exam.\n\n### 1. Business Process\nMap the workflow of a business process to find data-analysis points.\n\n### 2. Root Cause Analysis\n- **5 Whys** technique and **Fishbone (Ishikawa)** diagram\n- Distinguish symptoms vs root causes\n\n### 3. Problem Statement\nFrame the problem clearly, measurably, and tied to business context.\n\n> **Exercise:** Pick a business case, map its process, run 5 Whys, and write a problem statement.'),

(phase3_id, 'F11',
 'Kelas Persiapan BNSP — Mentoring Portofolio',
 'BNSP Prep — Portfolio Mentoring',
 'BNSP: Persiapan Sertifikasi',
 'Mampu membuat laporan analisis data dengan storytelling dan menyelesaikan portofolio akhir sebelum ujian.',
 'Able to create a data analysis report with storytelling and finalize the portfolio before the exam.',
 111, 90,
 E'## Kelas Persiapan BNSP — Mentoring Portofolio\n\nSesi mentoring akhir sebelum pelaksanaan ujian BNSP.\n\n### Membuat Laporan Analisis Data dengan Storytelling\n- Struktur laporan sesuai standar uji kompetensi\n- Menyampaikan temuan dengan narasi yang runtut dan meyakinkan\n\n### Review Mendalam & Pengerjaan Portofolio Akhir\n- Review menyeluruh portofolio bersama mentor\n- Perbaikan akhir sebelum maju ujian\n\n> **Latihan:** Finalisasi portofolio akhir dan presentasikan untuk review mentor.',
 E'## BNSP Prep — Portfolio Mentoring\n\nThe final mentoring session before the BNSP exam.\n\n### Creating a Data Analysis Report with Storytelling\n- Report structure aligned with the competency exam standard\n- Deliver findings with a coherent, convincing narrative\n\n### Deep Review & Final Portfolio Work\n- Thorough portfolio review with a mentor\n- Final fixes before sitting the exam\n\n> **Exercise:** Finalize your portfolio and present it for mentor review.');

-- ── 4. July 2026 Cohort ──────────────────────────────────
-- admission_open is intentionally FALSE: only one cohort platform-wide
-- may have admission open at a time (unique index one_open_admission).
-- An admin opens admissions from the Cohort Manager when ready.
INSERT INTO public.cohorts
  (program_id, name, description,
   admission_open_at, course_start_at, course_close_at,
   access_duration_months, admission_open, is_published)
VALUES
  (prog_id,
   'Data Analyst Fast Track — Juli 2026',
   'Angkatan Juli 2026. Kelas live diadakan pada akhir pekan (4–5 Juli, 09.00 & 13.00 WIB) lalu malam hari (19.30 WIB) sepanjang Juli 2026.',
   '2026-06-01T00:00:00+07:00',   -- admission opens
   '2026-07-04T09:00:00+07:00',   -- first live session
   '2026-12-31T23:59:00+07:00',   -- course close (access window)
   6, false, true)
RETURNING id INTO cohort_id;

-- ── 5. Lesson schedule (exact dates; times kept in notes) ─
-- cohort_lesson_schedule stores a DATE only, so the precise WIB time
-- for each live session is recorded in the notes column.
INSERT INTO public.cohort_lesson_schedule (cohort_id, session_id, scheduled_date, notes)
VALUES
  -- Orientation (shared Lesson 0), opens before week 1
  (cohort_id, lesson0_id, DATE '2026-07-03', 'Orientasi — akses dibuka sebelum sesi pertama'),

  -- Pekan 1
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F01'), DATE '2026-07-04', 'Sabtu, 4 Juli 2026 · 09.00 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F02'), DATE '2026-07-04', 'Sabtu, 4 Juli 2026 · 13.00 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F03'), DATE '2026-07-05', 'Minggu, 5 Juli 2026 · 09.00 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F04'), DATE '2026-07-05', 'Minggu, 5 Juli 2026 · 13.00 WIB'),

  -- Pekan 2
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F05'), DATE '2026-07-09', 'Kamis, 9 Juli 2026 · 19.30 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F06'), DATE '2026-07-14', 'Selasa, 14 Juli 2026 · 19.30 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F07'), DATE '2026-07-16', 'Kamis, 16 Juli 2026 · 19.30 WIB'),

  -- Pekan 3
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F08'), DATE '2026-07-20', 'Senin, 20 Juli 2026 · 19.30 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F09'), DATE '2026-07-21', 'Selasa, 21 Juli 2026 · 19.30 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F10'), DATE '2026-07-22', 'Rabu, 22 Juli 2026 · 19.30 WIB'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'F11'), DATE '2026-07-23', 'Kamis, 23 Juli 2026 · 19.30 WIB');

END $$;
