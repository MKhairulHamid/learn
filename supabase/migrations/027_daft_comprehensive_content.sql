-- ============================================================
-- 027: Comprehensive Materi for Data Analyst Fast Track (F01–F11)
-- Replaces the concise seed content from migration 026 with full
-- in-depth bilingual lessons, matching the depth of the original
-- Data Analyst program (migrations 002/008/009).
-- Uses dollar-quoting ($da_id$ / $da_en$) so markdown can contain
-- apostrophes and newlines freely.
-- ============================================================

-- ── F01 — Cleaning and Shaping Incoming Data ───────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 1 — Membersihkan dan Merapihkan Data yang Diterima

Sebagai data analyst, sekitar **70–80% waktumu** habis untuk membersihkan data — bukan menganalisis. Data yang kamu terima dari lapangan, form, atau sistem hampir selalu berantakan: ada duplikat, sel kosong, spasi tersembunyi, dan format yang tidak konsisten. Sesi ini mengajarkan cara mengubah data mentah yang kacau menjadi dataset yang rapi dan siap dianalisis.

## Kenapa Data Kotor Berbahaya

Satu baris duplikat bisa menggelembungkan total penjualan. Satu spasi tak terlihat (`"Jakarta "` vs `"Jakarta"`) membuat dua kota dianggap berbeda. Analisis sehebat apa pun akan salah kalau datanya kotor. Prinsipnya: **garbage in, garbage out**.

## 1. Identifikasi Duplikat dan Data Kosong

### Menemukan & Menghapus Duplikat
- **Cara cepat:** blok data → **Data → Remove Duplicates**
- **Menandai dulu sebelum menghapus** (lebih aman):
```
=COUNTIF($A$2:$A$100, A2) > 1
```
Rumus ini bernilai `TRUE` untuk baris yang muncul lebih dari sekali.
- **Conditional Formatting → Highlight Cells Rules → Duplicate Values** untuk menyorotnya secara visual.

### Menemukan Sel Kosong
- **Go To Special** (`Ctrl+G` → Special → Blanks) untuk memilih semua sel kosong sekaligus.
- Menghitung sel kosong: `=COUNTBLANK(A2:A100)`
- Mengecek satu sel: `=ISBLANK(A2)`

> ⚠️ Hati-hati: sel yang "terlihat kosong" bisa berisi spasi. `ISBLANK` akan menganggapnya **tidak kosong**.

## 2. Tips Error Handling

Rumus sering menghasilkan error seperti `#N/A`, `#DIV/0!`, `#VALUE!`. Bungkus rumus agar laporan tetap rapi:

| Rumus | Fungsi |
|---|---|
| `=IFERROR(rumus, "—")` | Menangani **semua** jenis error |
| `=IFNA(rumus, "tidak ada")` | Khusus error `#N/A` (mis. dari VLOOKUP) |

```
=IFERROR(VLOOKUP(A2, data, 2, FALSE), "Tidak ditemukan")
=IFERROR(B2/C2, 0)
```

## 3. Merapikan Isian Data dengan Fungsi Teks

| Fungsi | Contoh | Hasil |
|---|---|---|
| `TRIM` | `=TRIM("  Budi  ")` | `Budi` |
| `CONCAT` | `=CONCAT(A2," ",B2)` | `Budi Santoso` |
| `LEFT` | `=LEFT("INV-2024",3)` | `INV` |
| `RIGHT` | `=RIGHT("INV-2024",4)` | `2024` |
| `MID` | `=MID("INV-2024-01",5,4)` | `2024` |
| `UPPER`/`LOWER`/`PROPER` | `=PROPER("budi santoso")` | `Budi Santoso` |
| `SUBSTITUTE` | `=SUBSTITUTE("Rp1.000","Rp","")` | `1.000` |

### Memisahkan & Menggabungkan
- **Text to Columns** (Data → Text to Columns) untuk memecah `"Budi,Jakarta"` menjadi dua kolom.
- **Flash Fill** (`Ctrl+E`) — Excel menebak pola dari contoh yang kamu ketik.

## Alur Kerja Pembersihan Data (Checklist)

1. **Buat salinan** data mentah — jangan pernah menimpa aslinya.
2. Hapus baris & kolom yang benar-benar kosong.
3. `TRIM` semua kolom teks untuk menghapus spasi tersembunyi.
4. Standarkan kapitalisasi (`PROPER`/`UPPER`).
5. Periksa & tangani duplikat.
6. Perbaiki tipe data (angka tersimpan sebagai teks → `VALUE`).
7. Bungkus rumus rawan error dengan `IFERROR`.

## Kesimpulan Utama
- Data kotor menghasilkan kesimpulan yang salah — bersihkan dulu, analisis kemudian.
- `TRIM` adalah penyelamat: spasi tersembunyi adalah sumber bug paling umum.
- `IFERROR`/`IFNA` membuat laporanmu terlihat profesional, bukan penuh `#N/A`.
- Selalu simpan salinan data mentah sebelum mengubah apa pun.
$da_id$,
content_en = $da_en$# Session 1 — Cleaning and Shaping Incoming Data

As a data analyst, roughly **70–80% of your time** goes to cleaning data — not analyzing it. Data you receive from the field, forms, or systems is almost always messy: duplicates, blank cells, hidden spaces, and inconsistent formatting. This session teaches you how to turn chaotic raw data into a tidy, analysis-ready dataset.

## Why Dirty Data Is Dangerous

A single duplicate row can inflate total sales. One invisible space (`"Jakarta "` vs `"Jakarta"`) makes two cities look different. The best analysis in the world is wrong if the data is dirty. The principle: **garbage in, garbage out**.

## 1. Identify Duplicates and Blank Data

### Finding & Removing Duplicates
- **Quick way:** select the data → **Data → Remove Duplicates**
- **Flag before deleting** (safer):
```
=COUNTIF($A$2:$A$100, A2) > 1
```
This is `TRUE` for any row that appears more than once.
- **Conditional Formatting → Highlight Cells Rules → Duplicate Values** to highlight them visually.

### Finding Blank Cells
- **Go To Special** (`Ctrl+G` → Special → Blanks) to select every blank cell at once.
- Count blanks: `=COUNTBLANK(A2:A100)`
- Check one cell: `=ISBLANK(A2)`

> ⚠️ Careful: a cell that "looks empty" may contain a space. `ISBLANK` will treat it as **not empty**.

## 2. Error Handling Tips

Formulas often produce errors like `#N/A`, `#DIV/0!`, `#VALUE!`. Wrap formulas to keep reports clean:

| Formula | Purpose |
|---|---|
| `=IFERROR(formula, "—")` | Handles **all** error types |
| `=IFNA(formula, "not found")` | Only `#N/A` errors (e.g. from VLOOKUP) |

```
=IFERROR(VLOOKUP(A2, data, 2, FALSE), "Not found")
=IFERROR(B2/C2, 0)
```

## 3. Shaping Data with Text Functions

| Function | Example | Result |
|---|---|---|
| `TRIM` | `=TRIM("  Budi  ")` | `Budi` |
| `CONCAT` | `=CONCAT(A2," ",B2)` | `Budi Santoso` |
| `LEFT` | `=LEFT("INV-2024",3)` | `INV` |
| `RIGHT` | `=RIGHT("INV-2024",4)` | `2024` |
| `MID` | `=MID("INV-2024-01",5,4)` | `2024` |
| `UPPER`/`LOWER`/`PROPER` | `=PROPER("budi santoso")` | `Budi Santoso` |
| `SUBSTITUTE` | `=SUBSTITUTE("Rp1,000","Rp","")` | `1,000` |

### Splitting & Joining
- **Text to Columns** (Data → Text to Columns) to split `"Budi,Jakarta"` into two columns.
- **Flash Fill** (`Ctrl+E`) — Excel guesses the pattern from the example you type.

## Data Cleaning Workflow (Checklist)

1. **Make a copy** of the raw data — never overwrite the original.
2. Remove fully blank rows & columns.
3. `TRIM` all text columns to strip hidden spaces.
4. Standardize capitalization (`PROPER`/`UPPER`).
5. Check & handle duplicates.
6. Fix data types (numbers stored as text → `VALUE`).
7. Wrap error-prone formulas in `IFERROR`.

## Key Takeaways
- Dirty data leads to wrong conclusions — clean first, analyze second.
- `TRIM` is a lifesaver: hidden spaces are the most common source of bugs.
- `IFERROR`/`IFNA` make your reports look professional instead of full of `#N/A`.
- Always keep a copy of the raw data before changing anything.
$da_en$
WHERE session_number = 'F01';

-- ── F02 — Presenting Data to Stakeholder Needs ─────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 2 — Menyajikan Data Sesuai Kebutuhan Stakeholder

Stakeholder tidak butuh ribuan baris data — mereka butuh **jawaban**. Sesi ini mengajarkan logika rumus, statistik dasar, serta cara menyaring dan meringkas data agar tepat sasaran.

## 1. Logika Rumus & Referensi Sel

### Relatif vs Absolut
- `A1` — **relatif**: ikut bergeser saat rumus disalin.
- `$A$1` — **absolut**: terkunci, tidak bergeser.
- `$A1` / `A$1` — **campuran**: hanya kolom / hanya baris yang terkunci.

> Gunakan `$` saat merujuk ke satu sel tetap (mis. tarif pajak di `$B$1`) yang dipakai banyak baris.

## 2. Statistik Dasar

| Rumus | Arti |
|---|---|
| `=SUM(range)` | Total |
| `=COUNT(range)` | Menghitung sel **berisi angka** |
| `=COUNTA(range)` | Menghitung sel **terisi** (apa pun) |
| `=AVERAGE(range)` | Rata-rata (mean) |
| `=MEDIAN(range)` | Nilai tengah |
| `=MIN` / `=MAX` | Terkecil / terbesar |

> 💡 **Mean vs Median:** jika ada nilai ekstrem (mis. satu pembelian Rp1 miliar), median lebih mewakili "tipikal" daripada mean.

## 3. SORT & FILTER

- **Sort** (Data → Sort) — mengurutkan, bisa multi-level (mis. wilayah lalu pendapatan).
- **Filter** (`Ctrl+Shift+L`) — menampilkan hanya baris yang relevan tanpa menghapus data.
- **Fungsi dinamis** `SORT()` dan `FILTER()` (Excel 365) menghasilkan tabel yang ter-update otomatis:
```
=FILTER(A2:D100, C2:C100="Jakarta")
=SORT(A2:D100, 4, -1)   // urut kolom ke-4, menurun
```

## 4. Rumus Kondisional & Wildcard

### IF dan IF Bertingkat
```
=IF(B2>=75, "Lulus", "Gagal")
=IFS(B2>=90,"A", B2>=75,"B", B2>=60,"C", TRUE,"D")
```

### SUMIF / COUNTIF / AVERAGEIF (dan versi -IFS)
```
=SUMIF(region, "Jakarta", sales)
=COUNTIF(status, "completed")
=SUMIFS(sales, region, "Jakarta", status, "completed")
```

### Wildcard
- `*` — banyak karakter apa pun
- `?` — tepat satu karakter

```
=COUNTIF(A:A, "Jakarta*")    // semua yang diawali "Jakarta"
=SUMIF(produk, "*Mouse*", qty) // mengandung kata "Mouse"
```

## Mindset Penyajian Data
1. Mulai dari **pertanyaan** stakeholder, bukan dari data.
2. Ringkas ke level keputusan (total, rata-rata, persentase).
3. Sembunyikan detail; tampilkan kesimpulan.
4. Beri label & format angka (Rp, %, ribuan) agar mudah dibaca.

## Kesimpulan Utama
- Kunci sel dengan `$` agar rumus tetap benar saat disalin.
- `SUMIFS`/`COUNTIFS` adalah tulang punggung pelaporan berbasis kriteria.
- Wildcard `*` dan `?` membuat pencarian fleksibel.
- Sajikan jawaban, bukan data mentah.
$da_id$,
content_en = $da_en$# Session 2 — Presenting Data to Stakeholder Needs

Stakeholders don't need thousands of rows — they need **answers**. This session covers formula logic, basic statistics, and how to filter and summarize data so it hits the mark.

## 1. Formula Logic & Cell References

### Relative vs Absolute
- `A1` — **relative**: shifts when the formula is copied.
- `$A$1` — **absolute**: locked, never shifts.
- `$A1` / `A$1` — **mixed**: only column / only row is locked.

> Use `$` when referring to one fixed cell (e.g. a tax rate in `$B$1`) reused across many rows.

## 2. Basic Statistics

| Formula | Meaning |
|---|---|
| `=SUM(range)` | Total |
| `=COUNT(range)` | Counts cells **containing numbers** |
| `=COUNTA(range)` | Counts **non-empty** cells (anything) |
| `=AVERAGE(range)` | Mean |
| `=MEDIAN(range)` | Middle value |
| `=MIN` / `=MAX` | Smallest / largest |

> 💡 **Mean vs Median:** when extreme values exist (e.g. one Rp1 billion purchase), the median represents the "typical" value better than the mean.

## 3. SORT & FILTER

- **Sort** (Data → Sort) — order data, can be multi-level (e.g. region then revenue).
- **Filter** (`Ctrl+Shift+L`) — show only relevant rows without deleting data.
- **Dynamic functions** `SORT()` and `FILTER()` (Excel 365) produce auto-updating tables:
```
=FILTER(A2:D100, C2:C100="Jakarta")
=SORT(A2:D100, 4, -1)   // sort by 4th column, descending
```

## 4. Conditional Formulas & Wildcards

### IF and Nested IF
```
=IF(B2>=75, "Pass", "Fail")
=IFS(B2>=90,"A", B2>=75,"B", B2>=60,"C", TRUE,"D")
```

### SUMIF / COUNTIF / AVERAGEIF (and -IFS versions)
```
=SUMIF(region, "Jakarta", sales)
=COUNTIF(status, "completed")
=SUMIFS(sales, region, "Jakarta", status, "completed")
```

### Wildcards
- `*` — any number of characters
- `?` — exactly one character

```
=COUNTIF(A:A, "Jakarta*")    // anything starting with "Jakarta"
=SUMIF(product, "*Mouse*", qty) // contains the word "Mouse"
```

## Data Presentation Mindset
1. Start from the stakeholder's **question**, not from the data.
2. Summarize to decision level (totals, averages, percentages).
3. Hide detail; show the conclusion.
4. Label and format numbers (Rp, %, thousands) for readability.

## Key Takeaways
- Lock cells with `$` so formulas stay correct when copied.
- `SUMIFS`/`COUNTIFS` are the backbone of criteria-based reporting.
- Wildcards `*` and `?` make matching flexible.
- Deliver the answer, not the raw data.
$da_en$
WHERE session_number = 'F02';

-- ── F03 — Joining & Highlighting Datasets ──────────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 3 — Menggabungkan & Highlight Dataset

Data jarang berada di satu tempat. Daftar transaksi ada di satu tabel, detail produk di tabel lain. Sesi ini mengajarkan cara **menggabungkan** tabel dengan fungsi lookup dan **menyoroti** kondisi penting secara visual.

## 1. Alur Berpikir Pembuatan Laporan Data

Sebelum menulis rumus, jawab dulu:
1. **Pertanyaan bisnis apa** yang harus dijawab?
2. **Data apa** yang dibutuhkan, dan dari tabel mana?
3. **Kunci penghubung** (key) apa yang sama di kedua tabel? (mis. `product_id`)
4. Bagaimana hasilnya **disajikan**?

## 2. VLOOKUP & HLOOKUP

```
=VLOOKUP(nilai_cari, tabel, nomor_kolom, FALSE)
```
- `FALSE` = pencocokan **persis** (hampir selalu yang kamu mau).
- **Keterbatasan VLOOKUP:** hanya mencari ke **kanan** dari kolom kunci, dan rusak jika kolom disisipkan.

```
=VLOOKUP(A2, produk!$A$2:$D$50, 3, FALSE)
```

`HLOOKUP` sama, tapi mencari secara **horizontal** (data tersusun per baris).

## 3. Teknik Tingkat Lanjut

### XLOOKUP (modern, fleksibel)
```
=XLOOKUP(nilai_cari, range_cari, range_hasil, "Tidak ada")
```
- Bisa mencari ke **kiri maupun kanan**.
- Argumen "jika tidak ditemukan" sudah bawaan (tak perlu `IFERROR`).
- Tahan terhadap penyisipan kolom.

### INDEX-MATCH (klasik yang andal)
```
=INDEX(range_hasil, MATCH(nilai_cari, range_cari, 0))
```
- `MATCH` mencari **posisi**, `INDEX` mengambil **nilai** di posisi itu.
- Bekerja di semua versi Excel; lebih cepat pada dataset besar.

| | VLOOKUP | XLOOKUP | INDEX-MATCH |
|---|---|---|---|
| Cari ke kiri | ❌ | ✅ | ✅ |
| Tahan sisip kolom | ❌ | ✅ | ✅ |
| Tersedia di semua versi | ✅ | ❌ (365) | ✅ |

> 💡 Coba langsung di **Playground → Simulator XLOOKUP**.

## 4. Conditional Formatting

Menyoroti kondisi data secara otomatis:
- **Highlight Cells Rules** — nilai > / < ambang, teks tertentu, duplikat.
- **Top/Bottom Rules** — 10 teratas, di atas rata-rata.
- **Data Bars / Color Scales / Icon Sets** — "heatmap" mini di dalam sel.
- **Rumus kustom**, mis. soroti seluruh baris jika margin < 10%:
```
=$E2 < 0.1
```

## Kesimpulan Utama
- Gabungkan tabel lewat **kunci** yang sama dengan fungsi lookup.
- `XLOOKUP` dan `INDEX-MATCH` lebih unggul daripada `VLOOKUP`.
- Selalu pakai pencocokan persis (`FALSE` / `0`).
- Conditional Formatting mengubah angka menjadi insight yang langsung terlihat.
$da_id$,
content_en = $da_en$# Session 3 — Joining & Highlighting Datasets

Data rarely lives in one place. The transaction list is in one table, product details in another. This session teaches you how to **join** tables with lookup functions and **highlight** important conditions visually.

## 1. The Reporting Thought Process

Before writing a formula, answer:
1. **What business question** must be answered?
2. **What data** is needed, and from which table?
3. **What key** is shared between the two tables? (e.g. `product_id`)
4. How will the result be **presented**?

## 2. VLOOKUP & HLOOKUP

```
=VLOOKUP(lookup_value, table, column_number, FALSE)
```
- `FALSE` = **exact** match (almost always what you want).
- **VLOOKUP limitation:** only looks to the **right** of the key column, and breaks if columns are inserted.

```
=VLOOKUP(A2, products!$A$2:$D$50, 3, FALSE)
```

`HLOOKUP` is the same but searches **horizontally** (data laid out in rows).

## 3. Advanced Techniques

### XLOOKUP (modern, flexible)
```
=XLOOKUP(lookup_value, lookup_range, return_range, "Not found")
```
- Can look **left or right**.
- Built-in "if not found" argument (no `IFERROR` needed).
- Resilient to inserted columns.

### INDEX-MATCH (the reliable classic)
```
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
```
- `MATCH` finds the **position**, `INDEX` returns the **value** at that position.
- Works in every Excel version; faster on large datasets.

| | VLOOKUP | XLOOKUP | INDEX-MATCH |
|---|---|---|---|
| Look left | ❌ | ✅ | ✅ |
| Survives column insert | ❌ | ✅ | ✅ |
| Available everywhere | ✅ | ❌ (365) | ✅ |

> 💡 Try it live in **Playground → XLOOKUP Simulator**.

## 4. Conditional Formatting

Highlight data conditions automatically:
- **Highlight Cells Rules** — values > / < threshold, specific text, duplicates.
- **Top/Bottom Rules** — top 10, above average.
- **Data Bars / Color Scales / Icon Sets** — a mini heatmap inside cells.
- **Custom formula**, e.g. highlight a whole row when margin < 10%:
```
=$E2 < 0.1
```

## Key Takeaways
- Join tables via a shared **key** using lookup functions.
- `XLOOKUP` and `INDEX-MATCH` beat `VLOOKUP`.
- Always use exact match (`FALSE` / `0`).
- Conditional Formatting turns numbers into instantly visible insight.
$da_en$
WHERE session_number = 'F03';

-- ── F04 — Pivot Tables for Insight ─────────────────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 4 — Pivot Table untuk Dapatkan Insight

Pivot Table adalah alat paling kuat di spreadsheet untuk seorang analyst. Ia meringkas ribuan baris menjadi insight dalam hitungan detik — **tanpa satu pun rumus**.

## 1. Apa Itu Pivot Table?

Bayangkan 50.000 baris transaksi. Pertanyaan: "Berapa pendapatan per kategori per bulan?" Dengan rumus, itu rumit. Dengan Pivot Table, cukup seret-dan-letakkan beberapa field.

**Cara membuat:** pilih data → **Insert → PivotTable**.

## 2. Anatomi Pivot Table

Pivot Table punya 4 area:

| Area | Fungsi | Contoh |
|---|---|---|
| **Rows** | Kategori vertikal | Nama produk, wilayah |
| **Columns** | Kategori horizontal | Bulan, status |
| **Values** | Angka yang diringkas | Sum pendapatan, count order |
| **Filters** | Saringan keseluruhan | Tahun = 2026 |

## 3. Mengubah Agregasi

Klik kanan pada field Values → **Summarize Values By**:
- **Sum** — total (default untuk angka)
- **Count** — jumlah baris
- **Average** — rata-rata
- **Max / Min**

Dan **Show Values As**:
- **% of Grand Total** — kontribusi tiap baris
- **% of Column Total**
- **Running Total** — akumulasi
- **% Difference From** — pertumbuhan vs periode sebelumnya

## 4. Pivot Table Advanced

### Grouping
Klik kanan pada field tanggal → **Group** → kelompokkan ke Bulan / Kuartal / Tahun. Bisa juga mengelompokkan angka ke dalam rentang (mis. umur 20–29, 30–39).

### Calculated Field
**PivotTable Analyze → Fields, Items & Sets → Calculated Field**, mis. `= Profit / Revenue` untuk margin.

### Slicer & Timeline
- **Slicer** — tombol filter visual yang interaktif.
- **Timeline** — slicer khusus tanggal.

## 5. Studi Kasus Perkantoran

> *"Kategori produk mana yang tumbuh paling cepat tahun ini, dan di wilayah mana?"*

1. Rows: Kategori → Columns: Bulan → Values: Sum(Pendapatan).
2. Group Bulan ke Kuartal.
3. Show Values As → **% Difference From** kuartal sebelumnya.
4. Tambahkan Slicer Wilayah.
5. Baca: kategori dengan persentase tertinggi adalah pemenangnya.

## Kesimpulan Utama
- Pivot Table meringkas data besar tanpa rumus.
- Ingat 4 area: Rows, Columns, Values, Filters.
- "Show Values As" mengubah angka mentah menjadi persen & tren.
- Slicer membuat laporanmu interaktif untuk stakeholder.
$da_id$,
content_en = $da_en$# Session 4 — Pivot Tables for Insight

The Pivot Table is the most powerful spreadsheet tool an analyst has. It summarizes thousands of rows into insight in seconds — **without a single formula**.

## 1. What Is a Pivot Table?

Imagine 50,000 transaction rows. The question: "What's revenue by category by month?" With formulas, that's hard. With a Pivot Table, you just drag-and-drop a few fields.

**To create:** select the data → **Insert → PivotTable**.

## 2. Anatomy of a Pivot Table

A Pivot Table has 4 areas:

| Area | Purpose | Example |
|---|---|---|
| **Rows** | Vertical categories | Product name, region |
| **Columns** | Horizontal categories | Month, status |
| **Values** | The numbers summarized | Sum of revenue, count of orders |
| **Filters** | Overall filter | Year = 2026 |

## 3. Changing the Aggregation

Right-click a Values field → **Summarize Values By**:
- **Sum** — total (default for numbers)
- **Count** — number of rows
- **Average** — mean
- **Max / Min**

And **Show Values As**:
- **% of Grand Total** — each row's contribution
- **% of Column Total**
- **Running Total** — cumulative
- **% Difference From** — growth vs prior period

## 4. Advanced Pivot Tables

### Grouping
Right-click a date field → **Group** → roll up into Month / Quarter / Year. You can also group numbers into ranges (e.g. age 20–29, 30–39).

### Calculated Field
**PivotTable Analyze → Fields, Items & Sets → Calculated Field**, e.g. `= Profit / Revenue` for margin.

### Slicer & Timeline
- **Slicer** — interactive visual filter buttons.
- **Timeline** — a slicer specifically for dates.

## 5. Office Case Study

> *"Which product category is growing fastest this year, and in which region?"*

1. Rows: Category → Columns: Month → Values: Sum(Revenue).
2. Group Month into Quarters.
3. Show Values As → **% Difference From** previous quarter.
4. Add a Region Slicer.
5. Read it: the category with the highest percentage is the winner.

## Key Takeaways
- Pivot Tables summarize big data with no formulas.
- Remember the 4 areas: Rows, Columns, Values, Filters.
- "Show Values As" turns raw numbers into percentages & trends.
- Slicers make your report interactive for stakeholders.
$da_en$
WHERE session_number = 'F04';

-- ── F05 — Exploratory Data Analysis (EDA) ──────────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 5 — Exploratory Data Analysis (EDA)

EDA adalah proses **memahami data sebelum mengambil kesimpulan**. Sebelum membuat dashboard atau model, kamu harus tahu: seperti apa bentuk datanya, di mana anomalinya, dan hubungan apa yang tersembunyi.

## Apa Itu EDA?

EDA = menjelajah data secara sistematis untuk menemukan pola, anomali, dan hubungan. Diperkenalkan oleh statistikawan John Tukey, intinya: **biarkan data berbicara dulu** sebelum kamu memaksakan hipotesis.

## 1. Analisis Univariate (Satu Variabel)

Memahami **satu kolom** pada satu waktu.

### Untuk data numerik
- **Tendensi sentral:** mean, median, modus.
- **Sebaran:** range, standar deviasi, IQR.
- **Bentuk distribusi:** normal, miring kanan (skewed), bimodal — lihat lewat histogram.
- **Outlier:** nilai ekstrem. Aturan IQR:
```
Batas bawah = Q1 − 1.5 × IQR
Batas atas  = Q3 + 1.5 × IQR
```

### Untuk data kategori
- **Frekuensi** tiap kategori (Pivot Table Count).
- Kategori dominan vs ekor panjang.

## 2. Analisis Bivariate (Dua Variabel)

Memahami **hubungan antara dua kolom**.

| Tipe pasangan | Alat |
|---|---|
| Numerik vs Numerik | Scatter plot, korelasi |
| Kategori vs Numerik | Box plot, rata-rata per grup |
| Kategori vs Kategori | Crosstab (Pivot Table) |

### Korelasi
`=CORREL(rangeA, rangeB)` → nilai antara −1 dan +1.
- +1 hubungan positif sempurna, −1 negatif sempurna, 0 tidak ada hubungan linier.

> ⚠️ **Korelasi ≠ kausalitas.** Penjualan es krim dan kasus tenggelam berkorelasi — karena sama-sama naik saat musim panas, bukan karena saling menyebabkan.

## 3. Menggali Insight

Untuk setiap temuan, tanyakan:
- **Apa** yang menonjol? (puncak, lembah, outlier)
- **Mengapa** itu terjadi? (cari penyebab di kolom lain)
- **So what?** — apa artinya bagi bisnis?

## 4. Menyampaikan Rekomendasi

Ubah temuan menjadi rekomendasi yang **spesifik & dapat ditindaklanjuti**:

❌ "Penjualan Jakarta rendah."
✅ "Penjualan Jakarta turun 18% sejak Maret, terkonsentrasi pada kategori Elektronik. Rekomendasi: audit stok Elektronik di gudang Jakarta dalam 2 minggu."

## Kesimpulan Utama
- EDA dilakukan **sebelum** analisis lanjutan — kenali datamu dulu.
- Univariate = satu kolom; bivariate = hubungan dua kolom.
- Deteksi outlier dengan aturan IQR.
- Korelasi bukan kausalitas.
- Setiap insight harus berakhir dengan rekomendasi yang konkret.
$da_id$,
content_en = $da_en$# Session 5 — Exploratory Data Analysis (EDA)

EDA is the process of **understanding data before drawing conclusions**. Before building a dashboard or a model, you must know: what the data looks like, where the anomalies are, and what relationships are hidden.

## What Is EDA?

EDA = systematically exploring data to find patterns, anomalies, and relationships. Introduced by statistician John Tukey, the core idea is: **let the data speak first** before you force a hypothesis.

## 1. Univariate Analysis (One Variable)

Understanding **one column** at a time.

### For numeric data
- **Central tendency:** mean, median, mode.
- **Spread:** range, standard deviation, IQR.
- **Distribution shape:** normal, right-skewed, bimodal — see it via a histogram.
- **Outliers:** extreme values. The IQR rule:
```
Lower bound = Q1 − 1.5 × IQR
Upper bound = Q3 + 1.5 × IQR
```

### For categorical data
- **Frequency** of each category (Pivot Table Count).
- Dominant category vs the long tail.

## 2. Bivariate Analysis (Two Variables)

Understanding the **relationship between two columns**.

| Pair type | Tool |
|---|---|
| Numeric vs Numeric | Scatter plot, correlation |
| Categorical vs Numeric | Box plot, average per group |
| Categorical vs Categorical | Crosstab (Pivot Table) |

### Correlation
`=CORREL(rangeA, rangeB)` → a value between −1 and +1.
- +1 perfect positive, −1 perfect negative, 0 no linear relationship.

> ⚠️ **Correlation ≠ causation.** Ice-cream sales and drowning incidents correlate — because both rise in summer, not because one causes the other.

## 3. Extracting Insight

For every finding, ask:
- **What** stands out? (peaks, valleys, outliers)
- **Why** did it happen? (look for the cause in other columns)
- **So what?** — what does it mean for the business?

## 4. Delivering Recommendations

Turn findings into **specific, actionable** recommendations:

❌ "Jakarta sales are low."
✅ "Jakarta sales dropped 18% since March, concentrated in Electronics. Recommendation: audit Electronics stock at the Jakarta warehouse within 2 weeks."

## Key Takeaways
- EDA happens **before** advanced analysis — know your data first.
- Univariate = one column; bivariate = relationship between two columns.
- Detect outliers with the IQR rule.
- Correlation is not causation.
- Every insight must end with a concrete recommendation.
$da_en$
WHERE session_number = 'F05';

-- ── F06 — Data Visualization ───────────────────────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 6 — Visualisasi Data

Visualisasi yang baik membuat insight **langsung terlihat**. Visualisasi yang buruk menyesatkan. Sesi ini mengajarkan prinsip memilih chart, mendesain dashboard, dan membuatnya interaktif.

## 1. Prinsip Visualisasi Data

### Memilih Chart yang Tepat
| Tujuan | Chart Terbaik |
|---|---|
| Membandingkan nilai | Bar chart |
| Tren waktu | Line chart |
| Komposisi (bagian dari keseluruhan) | Pie/Donut (maks 5 irisan) atau Stacked bar |
| Distribusi | Histogram, Box plot |
| Hubungan | Scatter plot |
| Geografis | Map |

### 5 Prinsip Visualisasi Efektif
1. **Kejelasan** — satu chart, satu pesan.
2. **Konteks** — selalu beri judul, label sumbu, satuan.
3. **Akurasi** — bar chart mulai dari nol; jangan memotong sumbu.
4. **Kesederhanaan** — buang "chart junk" (gridline berlebih, efek 3D, bayangan).
5. **Warna** — gunakan dengan tujuan, bukan dekorasi. Maks ~7 warna; perhatikan keterbacaan untuk buta warna.

## 2. Pemanfaatan PivotChart

PivotChart adalah chart yang terhubung langsung ke Pivot Table — ikut berubah saat data difilter. **Insert → PivotChart**. Tambahkan Slicer agar audiens bisa mengeksplorasi sendiri.

## 3. Merancang Dashboard yang Baik

- **KPI terpenting di kiri-atas** (mata membaca dari sana).
- Kelompokkan chart yang berkaitan.
- Warna & font konsisten di seluruh dashboard.
- Satu filter tanggal/wilayah yang mengendalikan semua chart.
- Beri ruang kosong (white space) — jangan padat berlebihan.

### Layout Tipikal
```
┌───────────┬───────────┬───────────┐
│  KPI 1    │  KPI 2    │  KPI 3    │  ← scorecard
├───────────┴─────┬─────┴───────────┤
│  Tren (line)    │  Komposisi (bar)│
├─────────────────┼─────────────────┤
│  Tabel detail   │  Map / kategori │
└─────────────────┴─────────────────┘
```

## 4. Dashboard Interaktif dengan Pivot Chart

Gabungkan beberapa PivotChart + Slicer + Timeline pada satu sheet. Hubungkan satu Slicer ke beberapa Pivot (**Report Connections**) agar satu klik memfilter seluruh dashboard.

## Kesimpulan Utama
- Pilih chart sesuai tujuan, bukan selera.
- Satu chart = satu pesan; buang elemen yang tidak perlu.
- Bar chart selalu mulai dari nol.
- PivotChart + Slicer = dashboard interaktif tanpa coding.
$da_id$,
content_en = $da_en$# Session 6 — Data Visualization

Good visualization makes insight **instantly visible**. Bad visualization misleads. This session covers principles for choosing charts, designing dashboards, and making them interactive.

## 1. Data Visualization Principles

### Choosing the Right Chart
| Goal | Best Chart |
|---|---|
| Compare values | Bar chart |
| Trend over time | Line chart |
| Composition (part of a whole) | Pie/Donut (max 5 slices) or Stacked bar |
| Distribution | Histogram, Box plot |
| Relationship | Scatter plot |
| Geographic | Map |

### 5 Principles of Effective Visualization
1. **Clarity** — one chart, one message.
2. **Context** — always add titles, axis labels, units.
3. **Accuracy** — bar charts start at zero; don't truncate axes.
4. **Simplicity** — remove "chart junk" (excess gridlines, 3D effects, shadows).
5. **Color** — use it purposefully, not decoratively. Max ~7 colors; consider colorblind readability.

## 2. Leveraging PivotCharts

A PivotChart is wired directly to a Pivot Table — it updates as data is filtered. **Insert → PivotChart**. Add a Slicer so the audience can explore on their own.

## 3. Designing a Good Dashboard

- **Most important KPIs top-left** (the eye reads from there).
- Group related charts together.
- Consistent colors & fonts across the whole dashboard.
- One date/region filter controlling all charts.
- Leave white space — don't overcrowd.

### Typical Layout
```
┌───────────┬───────────┬───────────┐
│  KPI 1    │  KPI 2    │  KPI 3    │  ← scorecards
├───────────┴─────┬─────┴───────────┤
│  Trend (line)   │ Composition(bar)│
├─────────────────┼─────────────────┤
│  Detail table   │ Map / category  │
└─────────────────┴─────────────────┘
```

## 4. Interactive Dashboards with Pivot Charts

Combine several PivotCharts + Slicers + Timeline on one sheet. Connect one Slicer to multiple Pivots (**Report Connections**) so a single click filters the entire dashboard.

## Key Takeaways
- Choose charts by goal, not by taste.
- One chart = one message; remove what isn't needed.
- Bar charts always start at zero.
- PivotChart + Slicer = an interactive dashboard with no coding.
$da_en$
WHERE session_number = 'F06';

-- ── F07 — Introduction to Power BI ─────────────────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 7 — Introduce Power BI

Power BI adalah tool Business Intelligence dari Microsoft untuk membangun dashboard interaktif berskala besar — melampaui kemampuan spreadsheet. Sesi ini mengenalkan alurnya: dari menghubungkan data hingga mempublikasikan dashboard.

## Apa Itu Power BI?

Power BI menghubungkan banyak sumber data, membersihkannya, memodelkan hubungan antar-tabel, lalu menyajikannya sebagai dashboard yang bisa di-drill-down. Tiga komponen utamanya:
- **Power BI Desktop** — tempat membangun (gratis).
- **Power BI Service** — tempat publish & berbagi (cloud).
- **Power BI Mobile** — melihat di ponsel.

## 1. Jenis Chart & Fitur Power BI

### Panel utama
- **Fields pane** — daftar tabel & kolom.
- **Visualizations pane** — pilihan visual.
- **Filters pane** — saringan tingkat visual/halaman/laporan.

### Visual umum
Bar/Column, Line, Card (KPI tunggal), Matrix (mirip Pivot), Map, Slicer, Gauge, Treemap.

## 2. Power Query — Membersihkan Data

Sebelum membangun visual, data dibersihkan di **Power Query Editor**:
- Hapus kolom, ubah tipe data, ganti nilai.
- Split/merge kolom, unpivot.
- Setiap langkah **terekam** dan otomatis diulang saat data di-refresh.

## 3. Data Model & Relationship

Hubungkan tabel melalui kunci yang sama (mis. `product_id`) di tampilan **Model**. Ini setara dengan VLOOKUP, tetapi sekali atur untuk seluruh laporan.

## 4. Pengenalan DAX

**DAX** (Data Analysis Expressions) untuk membuat **measure** (perhitungan dinamis):
```
Total Revenue = SUM(Sales[Amount])
Avg Order     = AVERAGE(Sales[Amount])
Revenue YoY % = DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY])
```

## 5. Menyusun & Memublikasikan Dashboard

1. **Get Data** → hubungkan sumber (Excel, CSV, database).
2. **Transform** di Power Query.
3. **Model** — atur relationship.
4. **Build** — seret field ke kanvas, atur layout, tambah slicer.
5. **Publish** ke Power BI Service → bagikan tautan / sematkan (embed).
6. **Schedule refresh** agar data selalu terbaru.

## Kesimpulan Utama
- Power BI = Power Query (bersihkan) + Model (hubungkan) + Visual (sajikan) + DAX (hitung).
- Power Query merekam langkah dan mengulanginya otomatis saat refresh.
- Measure DAX bersifat dinamis mengikuti filter.
- Publish ke Service untuk berbagi dashboard secara online.
$da_id$,
content_en = $da_en$# Session 7 — Introduction to Power BI

Power BI is Microsoft's Business Intelligence tool for building large-scale interactive dashboards — beyond what spreadsheets can do. This session introduces the flow: from connecting data to publishing a dashboard.

## What Is Power BI?

Power BI connects many data sources, cleans them, models relationships between tables, then presents everything as a dashboard you can drill into. Its three main components:
- **Power BI Desktop** — where you build (free).
- **Power BI Service** — where you publish & share (cloud).
- **Power BI Mobile** — view on your phone.

## 1. Chart Types & Power BI Features

### Main panes
- **Fields pane** — list of tables & columns.
- **Visualizations pane** — visual choices.
- **Filters pane** — visual/page/report-level filters.

### Common visuals
Bar/Column, Line, Card (single KPI), Matrix (like a Pivot), Map, Slicer, Gauge, Treemap.

## 2. Power Query — Cleaning Data

Before building visuals, data is cleaned in the **Power Query Editor**:
- Remove columns, change data types, replace values.
- Split/merge columns, unpivot.
- Every step is **recorded** and re-applied automatically on refresh.

## 3. Data Model & Relationships

Connect tables via a shared key (e.g. `product_id`) in the **Model** view. This is the equivalent of VLOOKUP, but set up once for the entire report.

## 4. Introduction to DAX

**DAX** (Data Analysis Expressions) creates **measures** (dynamic calculations):
```
Total Revenue = SUM(Sales[Amount])
Avg Order     = AVERAGE(Sales[Amount])
Revenue YoY % = DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY])
```

## 5. Building & Publishing a Dashboard

1. **Get Data** → connect a source (Excel, CSV, database).
2. **Transform** in Power Query.
3. **Model** — set up relationships.
4. **Build** — drag fields onto the canvas, arrange layout, add slicers.
5. **Publish** to the Power BI Service → share a link / embed it.
6. **Schedule refresh** so data stays current.

## Key Takeaways
- Power BI = Power Query (clean) + Model (connect) + Visuals (present) + DAX (calculate).
- Power Query records steps and replays them automatically on refresh.
- DAX measures are dynamic and respond to filters.
- Publish to the Service to share dashboards online.
$da_en$
WHERE session_number = 'F07';

-- ── F08 — Introduction to SQL (intensive: SELECT, Filter, Aggregation) ──
UPDATE public.sessions SET
content_id = $da_id$# Sesi 8 — Introduce SQL: SELECT, Filter, & Agregasi

SQL adalah skill **nomor satu** yang dicek recruiter data analyst. Saat data sudah terlalu besar untuk spreadsheet, SQL-lah jawabannya. Sesi ini membawamu dari nol sampai bisa menulis query agregasi.

## Apa Itu Database?

**Database** adalah sistem penyimpanan data yang terorganisir — seperti sekumpulan tabel Excel, tetapi mampu menampung jutaan baris, diakses banyak orang sekaligus, dan menjaga konsistensi data. Database **relasional** menyimpan data dalam tabel yang saling terhubung lewat **kunci** (key).

Contoh database e-commerce: `customers`, `products`, `orders`, `order_items`.

## Apa Itu SQL?

**SQL** = *Structured Query Language*. Kamu mendeskripsikan **apa** data yang diinginkan, database yang mengurus **bagaimana** mengambilnya.

## 1. SELECT — Meminta Data

```sql
SELECT name, email, city
FROM customers;
```
- `SELECT *` mengambil **semua** kolom (gunakan secukupnya).
- `AS` untuk mengganti nama kolom hasil:
```sql
SELECT name AS customer_name, city AS location
FROM customers;
```

## 2. WHERE — Memfilter Baris

```sql
SELECT name, city
FROM customers
WHERE membership = 'premium';
```

Operator: `=`, `<>`, `>`, `<`, `>=`, `<=`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.

```sql
WHERE price BETWEEN 150000 AND 500000
WHERE region IN ('Jakarta','Bandung')
WHERE name LIKE 'A%'        -- diawali huruf A
```

## 3. AND / OR — Menggabungkan Kondisi

```sql
SELECT * FROM orders
WHERE status = 'completed' AND total_amount > 500000;

SELECT * FROM customers
WHERE city = 'Jakarta' OR city = 'Surabaya';
```

## 4. ORDER BY & LIMIT

```sql
SELECT name, price
FROM products
ORDER BY price DESC   -- tertinggi dulu
LIMIT 5;              -- 5 teratas
```

## 5. Agregasi — Meringkas Data

Fungsi agregat menggabungkan banyak baris menjadi satu nilai:

| Fungsi | Arti |
|---|---|
| `COUNT(*)` | Jumlah baris |
| `SUM(col)` | Total |
| `AVG(col)` | Rata-rata |
| `MIN` / `MAX` | Terkecil / terbesar |

```sql
SELECT COUNT(*) AS total_customers FROM customers;
SELECT AVG(price) AS avg_price FROM products;
```

### GROUP BY — Agregasi per Kelompok
```sql
SELECT region, COUNT(*) AS jumlah
FROM customers
GROUP BY region;

SELECT category, AVG(price) AS rata_harga
FROM products
GROUP BY category;
```

### HAVING — Memfilter Hasil Agregasi
`WHERE` memfilter baris **sebelum** dikelompokkan; `HAVING` memfilter **setelah** agregasi.
```sql
SELECT category, AVG(price) AS rata_harga
FROM products
GROUP BY category
HAVING AVG(price) > 300000;
```

## Urutan Eksekusi SQL
Walau ditulis `SELECT` dulu, database mengeksekusi dengan urutan:
`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Error Umum
- Lupa tanda kutip tunggal pada teks: `WHERE city = Jakarta` ❌ → `'Jakarta'` ✅
- Memakai `WHERE` untuk hasil agregasi (harusnya `HAVING`).
- Salah nama kolom/tabel.

> 💡 Latihan langsung ada di **Playground → SQL** dan di latihan sesi ini — jalankan query nyata di browser.

## Kesimpulan Utama
- `SELECT ... FROM` mengambil kolom; `WHERE` memfilter baris.
- `ORDER BY` mengurutkan, `LIMIT` membatasi.
- Agregasi (`COUNT/SUM/AVG`) + `GROUP BY` meringkas data per kelompok.
- `HAVING` memfilter hasil agregasi; `WHERE` memfilter baris mentah.
$da_id$,
content_en = $da_en$# Session 8 — Introduce SQL: SELECT, Filter, & Aggregation

SQL is the **number-one** skill recruiters check for data analysts. When data is too big for a spreadsheet, SQL is the answer. This session takes you from zero to writing aggregation queries.

## What Is a Database?

A **database** is an organized data-storage system — like a set of Excel tables, but able to hold millions of rows, be accessed by many people at once, and enforce consistency. A **relational** database stores data in tables connected by **keys**.

Example e-commerce database: `customers`, `products`, `orders`, `order_items`.

## What Is SQL?

**SQL** = *Structured Query Language*. You describe **what** data you want; the database handles **how** to fetch it.

## 1. SELECT — Asking for Data

```sql
SELECT name, email, city
FROM customers;
```
- `SELECT *` returns **all** columns (use sparingly).
- `AS` renames the output column:
```sql
SELECT name AS customer_name, city AS location
FROM customers;
```

## 2. WHERE — Filtering Rows

```sql
SELECT name, city
FROM customers
WHERE membership = 'premium';
```

Operators: `=`, `<>`, `>`, `<`, `>=`, `<=`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.

```sql
WHERE price BETWEEN 150000 AND 500000
WHERE region IN ('Jakarta','Bandung')
WHERE name LIKE 'A%'        -- starts with A
```

## 3. AND / OR — Combining Conditions

```sql
SELECT * FROM orders
WHERE status = 'completed' AND total_amount > 500000;

SELECT * FROM customers
WHERE city = 'Jakarta' OR city = 'Surabaya';
```

## 4. ORDER BY & LIMIT

```sql
SELECT name, price
FROM products
ORDER BY price DESC   -- highest first
LIMIT 5;              -- top 5
```

## 5. Aggregation — Summarizing Data

Aggregate functions collapse many rows into one value:

| Function | Meaning |
|---|---|
| `COUNT(*)` | Number of rows |
| `SUM(col)` | Total |
| `AVG(col)` | Average |
| `MIN` / `MAX` | Smallest / largest |

```sql
SELECT COUNT(*) AS total_customers FROM customers;
SELECT AVG(price) AS avg_price FROM products;
```

### GROUP BY — Aggregating per Group
```sql
SELECT region, COUNT(*) AS count
FROM customers
GROUP BY region;

SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category;
```

### HAVING — Filtering Aggregated Results
`WHERE` filters rows **before** grouping; `HAVING` filters **after** aggregation.
```sql
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 300000;
```

## SQL Order of Execution
Although you write `SELECT` first, the database executes in this order:
`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Common Errors
- Forgetting single quotes around text: `WHERE city = Jakarta` ❌ → `'Jakarta'` ✅
- Using `WHERE` on aggregated results (should be `HAVING`).
- Wrong column/table name.

> 💡 Hands-on practice is in **Playground → SQL** and in this session's exercises — run real queries in the browser.

## Key Takeaways
- `SELECT ... FROM` picks columns; `WHERE` filters rows.
- `ORDER BY` sorts, `LIMIT` caps the result.
- Aggregation (`COUNT/SUM/AVG`) + `GROUP BY` summarizes data per group.
- `HAVING` filters aggregated results; `WHERE` filters raw rows.
$da_en$
WHERE session_number = 'F08';

-- ── F09 — Final Project & Portfolio ────────────────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 9 — Final Project dan Portofolio

Sertifikat membuktikan kamu hadir; **portofolio** membuktikan kamu bisa. Bagi perekrut data analyst, portofolio adalah bukti nyata kemampuanmu menyelesaikan masalah dari awal sampai akhir.

## Kenapa Portofolio Penting

- Menunjukkan **proses berpikir**, bukan hanya hasil.
- Membuktikan kamu bisa bekerja dengan data nyata yang berantakan.
- Menjadi bahan obrolan saat interview.

## Struktur Storytelling untuk Deck Portofolio

Susun deck mengikuti alur naratif:

1. **Konteks** — latar belakang & pertanyaan bisnis.
2. **Masalah** — apa yang ingin dipecahkan, kenapa penting.
3. **Data & Metodologi** — sumber data, cara membersihkan & menganalisis.
4. **Analisis** — temuan kunci, didukung visual.
5. **Insight** — apa arti temuan itu.
6. **Rekomendasi** — langkah konkret yang disarankan.
7. **Dampak** — perkiraan nilai bisnis.

> Setiap slide punya **satu pesan utama** yang ditulis sebagai judul slide.

## Tips Portofolio yang Menarik

- **Tunjukkan proses**, bukan hanya dashboard akhir — sertakan cuplikan pembersihan data & query.
- Pakai **bahasa bisnis**, bukan jargon teknis.
- Setiap chart harus menjawab sebuah pertanyaan.
- Konsistenkan warna, font, dan format angka.
- 1 proyek mendalam > 5 proyek dangkal.

## Memublikasikan Portofolio

| Platform | Cocok untuk |
|---|---|
| **LinkedIn** | Visibilitas ke perekrut |
| **Notion / Google Sites** | Halaman portofolio rapi |
| **Tableau Public / Power BI** | Dashboard interaktif |
| **GitHub** | Kode SQL/Python |

Sertakan tautan ke dataset, dashboard, dan deck. Tulis ringkasan 2–3 kalimat di awal agar pembaca langsung paham nilainya.

## Checklist Final Project
- [ ] Pertanyaan bisnis jelas
- [ ] Data dibersihkan & terdokumentasi
- [ ] Analisis menjawab pertanyaan
- [ ] Minimal 3 temuan + visual pendukung
- [ ] Rekomendasi spesifik & terukur
- [ ] Deck rapi dengan alur storytelling
- [ ] Dipublikasikan & tautannya dibagikan

## Kesimpulan Utama
- Portofolio = bukti kemampuan; lebih penting dari sertifikat.
- Susun dengan alur storytelling: konteks → masalah → analisis → rekomendasi.
- Tunjukkan proses dan pakai bahasa bisnis.
- Publikasikan agar mudah ditemukan perekrut.
$da_id$,
content_en = $da_en$# Session 9 — Final Project & Portfolio

A certificate proves you showed up; a **portfolio** proves you can do the work. For data-analyst recruiters, a portfolio is concrete evidence you can solve a problem end to end.

## Why a Portfolio Matters

- Shows your **thought process**, not just the result.
- Proves you can work with messy, real-world data.
- Becomes a talking point in interviews.

## Storytelling Structure for a Portfolio Deck

Build the deck along a narrative arc:

1. **Context** — background & business question.
2. **Problem** — what you're solving, why it matters.
3. **Data & Methodology** — data sources, how you cleaned & analyzed.
4. **Analysis** — key findings, backed by visuals.
5. **Insight** — what the findings mean.
6. **Recommendation** — the concrete steps you advise.
7. **Impact** — the estimated business value.

> Each slide has **one key message**, written as the slide title.

## Tips for an Engaging Portfolio

- **Show the process**, not just the final dashboard — include snippets of data cleaning & queries.
- Use **business language**, not technical jargon.
- Every chart should answer a question.
- Keep colors, fonts, and number formats consistent.
- 1 deep project > 5 shallow ones.

## Publishing a Portfolio

| Platform | Best for |
|---|---|
| **LinkedIn** | Visibility to recruiters |
| **Notion / Google Sites** | A tidy portfolio page |
| **Tableau Public / Power BI** | Interactive dashboards |
| **GitHub** | SQL/Python code |

Include links to the dataset, dashboard, and deck. Write a 2–3 sentence summary up top so readers grasp the value instantly.

## Final Project Checklist
- [ ] Clear business question
- [ ] Data cleaned & documented
- [ ] Analysis answers the question
- [ ] At least 3 findings + supporting visuals
- [ ] Specific, measurable recommendations
- [ ] Polished deck with a storytelling arc
- [ ] Published & link shared

## Key Takeaways
- A portfolio = proof of ability; more important than a certificate.
- Build it with a storytelling arc: context → problem → analysis → recommendation.
- Show the process and use business language.
- Publish it so recruiters can find you.
$da_en$
WHERE session_number = 'F09';

-- ── F10 — BNSP Prep: Identifying Business Process ──────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 10 — Kelas Persiapan BNSP: Mengidentifikasi Business Process

Uji kompetensi **BNSP** Data Analyst menuntut kamu berpikir seperti pemecah masalah bisnis, bukan sekadar pengolah angka. Sesi ini melatih tiga fondasi: memahami proses bisnis, menemukan akar masalah, dan merumuskan masalah.

## 1. Business Process (Proses Bisnis)

**Proses bisnis** adalah rangkaian langkah yang dijalankan organisasi untuk mencapai tujuan (mis. proses penjualan: prospek → penawaran → order → pengiriman → pembayaran).

Sebagai analyst, kamu memetakan proses untuk menemukan **di mana data dihasilkan** dan **di mana masalah muncul**.

### Cara Memetakan
- Identifikasi **input → aktivitas → output** tiap langkah.
- Tandai titik pengukuran (mis. lead time, tingkat konversi, error rate).
- Cari **bottleneck** — langkah yang paling lambat/sering gagal.

## 2. Root Cause Analysis (Analisis Akar Masalah)

Masalah yang terlihat sering hanya **gejala**. RCA menggali sampai akar.

### Teknik 5 Whys
Tanyakan "mengapa" berulang kali:
> Penjualan turun → *mengapa?* Pelanggan berkurang → *mengapa?* Banyak komplain → *mengapa?* Pengiriman lambat → *mengapa?* Gudang kekurangan staf → *mengapa?* Tidak ada perencanaan kapasitas. **← akar masalah**

### Diagram Fishbone (Ishikawa)
Mengelompokkan kemungkinan penyebab ke kategori: **Man, Machine, Method, Material, Measurement, Environment**. Berguna untuk masalah kompleks dengan banyak faktor.

## 3. Problem Statement (Rumusan Masalah)

Rumusan masalah yang baik bersifat **spesifik, terukur, dan terikat konteks**.

**Formula:** *[Metrik] telah [berubah berapa] sejak [kapan], pada [segmen], menyebabkan [dampak bisnis].*

❌ "Penjualan bermasalah."
✅ "Tingkat konversi checkout turun dari 4,2% menjadi 2,8% sejak Maret 2026, terutama pada pengguna mobile, menyebabkan potensi kehilangan pendapatan ~Rp450 juta/bulan."

### Ciri Problem Statement yang Kuat
- Berbasis data, bukan opini.
- Menyebut metrik, besaran, waktu, dan segmen.
- Netral — belum menyimpulkan solusi.

## Kesimpulan Utama
- Petakan proses bisnis untuk menemukan titik data & bottleneck.
- Gunakan 5 Whys / Fishbone untuk membedakan gejala dari akar masalah.
- Rumusan masalah harus spesifik, terukur, dan menyebut dampak bisnis.
- Ini adalah kompetensi inti yang diuji di BNSP.
$da_id$,
content_en = $da_en$# Session 10 — BNSP Prep: Identifying Business Process

The **BNSP** Data Analyst competency exam expects you to think like a business problem-solver, not just a number-cruncher. This session drills three foundations: understanding business processes, finding root causes, and framing the problem.

## 1. Business Process

A **business process** is the sequence of steps an organization runs to reach a goal (e.g. the sales process: lead → quote → order → delivery → payment).

As an analyst, you map the process to find **where data is generated** and **where problems occur**.

### How to Map It
- Identify **input → activity → output** of each step.
- Mark measurement points (e.g. lead time, conversion rate, error rate).
- Find the **bottleneck** — the slowest / most failure-prone step.

## 2. Root Cause Analysis

The visible problem is often just a **symptom**. RCA digs to the root.

### The 5 Whys Technique
Ask "why" repeatedly:
> Sales dropped → *why?* Fewer customers → *why?* Many complaints → *why?* Slow delivery → *why?* Warehouse understaffed → *why?* No capacity planning. **← root cause**

### Fishbone (Ishikawa) Diagram
Groups possible causes into categories: **Man, Machine, Method, Material, Measurement, Environment**. Useful for complex problems with many factors.

## 3. Problem Statement

A good problem statement is **specific, measurable, and context-bound**.

**Formula:** *[Metric] has [changed how much] since [when], in [segment], causing [business impact].*

❌ "Sales have a problem."
✅ "Checkout conversion fell from 4.2% to 2.8% since March 2026, mainly on mobile users, causing an estimated ~Rp450M/month in lost revenue."

### Traits of a Strong Problem Statement
- Data-based, not opinion.
- States metric, magnitude, time, and segment.
- Neutral — doesn't pre-conclude a solution.

## Key Takeaways
- Map the business process to find data points & bottlenecks.
- Use 5 Whys / Fishbone to separate symptoms from root causes.
- A problem statement must be specific, measurable, and state business impact.
- These are core competencies tested by BNSP.
$da_en$
WHERE session_number = 'F10';

-- ── F11 — BNSP Prep: Portfolio Mentoring ───────────────────
UPDATE public.sessions SET
content_id = $da_id$# Sesi 11 — Kelas Persiapan BNSP: Mentoring Portofolio

Sesi terakhir sebelum ujian BNSP. Fokusnya: menyusun **laporan analisis data** yang meyakinkan dengan teknik storytelling, lalu mematangkan portofolio akhir melalui review mendalam bersama mentor.

## Membuat Laporan Analisis Data dengan Storytelling

Laporan untuk uji kompetensi harus mengikuti struktur yang jelas dan dapat dipertanggungjawabkan.

### Struktur Laporan Standar
1. **Latar Belakang & Tujuan** — konteks bisnis dan pertanyaan.
2. **Rumusan Masalah** — spesifik dan terukur (lihat Sesi 10).
3. **Sumber & Persiapan Data** — asal data, langkah pembersihan.
4. **Metodologi** — teknik analisis yang dipakai dan alasannya.
5. **Hasil Analisis** — temuan didukung visual yang relevan.
6. **Insight & Pembahasan** — makna temuan terhadap masalah.
7. **Rekomendasi** — langkah konkret, terukur, dan berprioritas.
8. **Kesimpulan** — ringkasan dan dampak yang diharapkan.

### Prinsip Storytelling
- Mulai dari masalah yang dipedulikan stakeholder.
- Susun temuan sebagai alur logis menuju rekomendasi.
- Tiap visual menjawab satu pertanyaan dan diberi narasi.
- Tutup dengan "so what" — nilai bisnis yang dihasilkan.

## Review Mendalam Portofolio (Checklist Pra-Ujian)

- [ ] Rumusan masalah jelas, terukur, berbasis data.
- [ ] Proses pembersihan data terdokumentasi & dapat direplikasi.
- [ ] Analisis sesuai metodologi yang dipilih.
- [ ] Visual benar (chart tepat, sumbu mulai nol, berlabel).
- [ ] Insight terhubung langsung ke rumusan masalah.
- [ ] Rekomendasi spesifik & dapat ditindaklanjuti.
- [ ] Laporan mengalir secara naratif, bukan kumpulan chart acak.
- [ ] Siap menjelaskan setiap keputusan analisis saat ditanya asesor.

## Tips Menghadapi Asesor
- Pahami **mengapa** kamu memilih tiap teknik — asesor akan bertanya.
- Jujur soal keterbatasan data; tunjukkan kesadaran analitis.
- Latih presentasi 5–10 menit yang ringkas dan percaya diri.

## Kesimpulan Utama
- Laporan analisis mengikuti struktur baku dari masalah hingga rekomendasi.
- Storytelling menghubungkan setiap bagian menjadi alur yang meyakinkan.
- Gunakan checklist pra-ujian untuk mematangkan portofolio.
- Siap menjelaskan setiap keputusan analisis kepada asesor BNSP.
$da_id$,
content_en = $da_en$# Session 11 — BNSP Prep: Portfolio Mentoring

The final session before the BNSP exam. The focus: building a convincing **data analysis report** with storytelling, then polishing the final portfolio through a deep review with a mentor.

## Creating a Data Analysis Report with Storytelling

A report for the competency exam must follow a clear, defensible structure.

### Standard Report Structure
1. **Background & Objective** — business context and the question.
2. **Problem Statement** — specific and measurable (see Session 10).
3. **Data Sources & Preparation** — where the data came from, cleaning steps.
4. **Methodology** — the analysis techniques used and why.
5. **Analysis Results** — findings backed by relevant visuals.
6. **Insight & Discussion** — what findings mean for the problem.
7. **Recommendations** — concrete, measurable, prioritized steps.
8. **Conclusion** — summary and expected impact.

### Storytelling Principles
- Start from a problem the stakeholder cares about.
- Arrange findings as a logical path toward the recommendation.
- Each visual answers one question and gets a narrative.
- Close with the "so what" — the business value delivered.

## Deep Portfolio Review (Pre-Exam Checklist)

- [ ] Problem statement is clear, measurable, data-based.
- [ ] Data cleaning process documented & reproducible.
- [ ] Analysis matches the chosen methodology.
- [ ] Visuals correct (right chart, axis starts at zero, labeled).
- [ ] Insights connect directly to the problem statement.
- [ ] Recommendations specific & actionable.
- [ ] The report flows as a narrative, not a random pile of charts.
- [ ] Ready to explain every analytical decision when asked.

## Tips for Facing the Assessor
- Know **why** you chose each technique — the assessor will ask.
- Be honest about data limitations; show analytical awareness.
- Rehearse a concise, confident 5–10 minute presentation.

## Key Takeaways
- An analysis report follows a standard structure from problem to recommendation.
- Storytelling links every section into a convincing arc.
- Use the pre-exam checklist to finalize the portfolio.
- Be ready to justify every analytical decision to the BNSP assessor.
$da_en$
WHERE session_number = 'F11';
