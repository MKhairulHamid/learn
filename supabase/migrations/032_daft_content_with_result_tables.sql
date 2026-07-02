-- ============================================================
-- 032: Add result/data tables to DAFT examples (F01–F11)
--
-- Builds on migration 031 (extensive content). For every concrete
-- example, this shows the *actual data / query result* as a table so
-- learners can see what the output looks like — e.g. in F08 (SQL)
-- each query is followed by its result table; in F01–F05 examples
-- show before/after and computed-result tables.
--
-- Uses dollar-quoting ($da_id$ / $da_en$).
-- ============================================================

-- ── F08 — Introduction to SQL (with result tables) ─────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Senin, 20 Juli 2026 · 19.30 WIB

# Sesi 8 — Introduce SQL: SELECT, Filter, & Agregasi

SQL adalah skill **nomor satu** yang dicek recruiter data analyst. Saat data sudah terlalu besar untuk spreadsheet, SQL-lah jawabannya. Sesi ini membawamu dari nol sampai bisa menulis query agregasi — dan di setiap contoh kamu akan **melihat langsung tabel hasilnya**.

## Data Contoh yang Kita Pakai

Sepanjang sesi ini kita memakai database toko online sederhana. Berikut isinya.

**Tabel `customers`**

| customer_id | name  | city      | membership |
|-------------|-------|-----------|------------|
| C01         | Andi  | Jakarta   | premium    |
| C02         | Budi  | Bandung   | regular    |
| C03         | Citra | Jakarta   | premium    |
| C04         | Dina  | Surabaya  | regular    |
| C05         | Eko   | Bandung   | premium    |

**Tabel `products`**

| product_id | name     | category    | price    |
|------------|----------|-------------|----------|
| P01        | Mouse    | Electronics | 150000   |
| P02        | Keyboard | Electronics | 300000   |
| P03        | Notebook | Stationery  | 25000    |
| P04        | Monitor  | Electronics | 1200000  |

**Tabel `orders`**

| order_id | customer_id | city     | total   | status    |
|----------|-------------|----------|---------|-----------|
| O01      | C01         | Jakarta  | 450000  | completed |
| O02      | C02         | Bandung  | 25000   | completed |
| O03      | C01         | Jakarta  | 1200000 | completed |
| O04      | C03         | Jakarta  | 300000  | refund    |
| O05      | C05         | Bandung  | 150000  | completed |
| O06      | C04         | Surabaya | 25000   | completed |

## 1. SELECT — Meminta Data

```sql
SELECT name, city
FROM customers;
```

**Hasil:**

| name  | city     |
|-------|----------|
| Andi  | Jakarta  |
| Budi  | Bandung  |
| Citra | Jakarta  |
| Dina  | Surabaya |
| Eko   | Bandung  |

`AS` untuk mengganti nama kolom hasil:

```sql
SELECT name AS customer_name, city AS location
FROM customers;
```

**Hasil:** kolom `name` kini tampil sebagai `customer_name`, `city` sebagai `location`.

## 2. WHERE — Memfilter Baris

```sql
SELECT name, city
FROM customers
WHERE membership = 'premium';
```

**Hasil:** (hanya baris yang membership-nya `premium`)

| name  | city    |
|-------|---------|
| Andi  | Jakarta |
| Citra | Jakarta |
| Eko   | Bandung |

Operator lain: `=`, `<>`, `>`, `<`, `>=`, `<=`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.

```sql
SELECT name, price
FROM products
WHERE price BETWEEN 100000 AND 400000;
```

**Hasil:**

| name     | price  |
|----------|--------|
| Mouse    | 150000 |
| Keyboard | 300000 |

## 3. AND / OR — Menggabungkan Kondisi

```sql
SELECT order_id, city, total
FROM orders
WHERE status = 'completed' AND total > 100000;
```

**Hasil:**

| order_id | city    | total   |
|----------|---------|---------|
| O01      | Jakarta | 450000  |
| O03      | Jakarta | 1200000 |
| O05      | Bandung | 150000  |

## 4. ORDER BY & LIMIT

```sql
SELECT name, price
FROM products
ORDER BY price DESC   -- tertinggi dulu
LIMIT 3;              -- 3 teratas
```

**Hasil:**

| name     | price   |
|----------|---------|
| Monitor  | 1200000 |
| Keyboard | 300000  |
| Mouse    | 150000  |

## 5. Agregasi — Meringkas Data

Fungsi agregat menggabungkan banyak baris menjadi satu nilai.

```sql
SELECT COUNT(*) AS total_customers FROM customers;
```

**Hasil:**

| total_customers |
|-----------------|
| 5               |

```sql
SELECT SUM(total) AS omzet, AVG(total) AS rata_rata
FROM orders
WHERE status = 'completed';
```

**Hasil:**

| omzet   | rata_rata |
|---------|-----------|
| 1850000 | 370000    |

### GROUP BY — Agregasi per Kelompok

```sql
SELECT city, COUNT(*) AS jumlah_order, SUM(total) AS omzet
FROM orders
GROUP BY city;
```

**Hasil:** (satu baris per kota)

| city     | jumlah_order | omzet   |
|----------|--------------|---------|
| Jakarta  | 3            | 1950000 |
| Bandung  | 2            | 175000  |
| Surabaya | 1            | 25000   |

### HAVING — Memfilter Hasil Agregasi

`WHERE` memfilter baris **sebelum** dikelompokkan; `HAVING` memfilter **setelah** agregasi.

```sql
SELECT city, COUNT(*) AS jumlah_order
FROM orders
GROUP BY city
HAVING COUNT(*) >= 2;
```

**Hasil:** (hanya kota dengan ≥ 2 order — Surabaya tersaring keluar)

| city    | jumlah_order |
|---------|--------------|
| Jakarta | 3            |
| Bandung | 2            |

## Urutan Eksekusi SQL
Walau ditulis `SELECT` dulu, database mengeksekusi dengan urutan:
`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Error Umum
- Lupa tanda kutip tunggal pada teks: `WHERE city = Jakarta` ❌ → `'Jakarta'` ✅
- Memakai `WHERE` untuk hasil agregasi (harusnya `HAVING`).
- Salah nama kolom/tabel.

> 💡 Latihan langsung ada di **Playground → SQL** dan di latihan sesi ini — jalankan query nyata di browser dan lihat tabel hasilnya.

## Kesimpulan Utama
- `SELECT ... FROM` mengambil kolom; `WHERE` memfilter baris.
- `ORDER BY` mengurutkan, `LIMIT` membatasi.
- Agregasi (`COUNT/SUM/AVG`) + `GROUP BY` meringkas data per kelompok.
- `HAVING` memfilter hasil agregasi; `WHERE` memfilter baris mentah.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Monday, 20 July 2026 · 19.30 WIB

# Session 8 — Introduce SQL: SELECT, Filter, & Aggregation

SQL is the **number-one** skill recruiters check for data analysts. When data is too big for a spreadsheet, SQL is the answer. This session takes you from zero to writing aggregation queries — and every example **shows you the result table** directly.

## The Sample Data We'll Use

Throughout this session we use a simple online-store database. Here it is.

**Table `customers`**

| customer_id | name  | city      | membership |
|-------------|-------|-----------|------------|
| C01         | Andi  | Jakarta   | premium    |
| C02         | Budi  | Bandung   | regular    |
| C03         | Citra | Jakarta   | premium    |
| C04         | Dina  | Surabaya  | regular    |
| C05         | Eko   | Bandung   | premium    |

**Table `products`**

| product_id | name     | category    | price    |
|------------|----------|-------------|----------|
| P01        | Mouse    | Electronics | 150000   |
| P02        | Keyboard | Electronics | 300000   |
| P03        | Notebook | Stationery  | 25000    |
| P04        | Monitor  | Electronics | 1200000  |

**Table `orders`**

| order_id | customer_id | city     | total   | status    |
|----------|-------------|----------|---------|-----------|
| O01      | C01         | Jakarta  | 450000  | completed |
| O02      | C02         | Bandung  | 25000   | completed |
| O03      | C01         | Jakarta  | 1200000 | completed |
| O04      | C03         | Jakarta  | 300000  | refund    |
| O05      | C05         | Bandung  | 150000  | completed |
| O06      | C04         | Surabaya | 25000   | completed |

## 1. SELECT — Asking for Data

```sql
SELECT name, city
FROM customers;
```

**Result:**

| name  | city     |
|-------|----------|
| Andi  | Jakarta  |
| Budi  | Bandung  |
| Citra | Jakarta  |
| Dina  | Surabaya |
| Eko   | Bandung  |

`AS` renames the output column:

```sql
SELECT name AS customer_name, city AS location
FROM customers;
```

**Result:** the `name` column now shows as `customer_name`, `city` as `location`.

## 2. WHERE — Filtering Rows

```sql
SELECT name, city
FROM customers
WHERE membership = 'premium';
```

**Result:** (only rows whose membership is `premium`)

| name  | city    |
|-------|---------|
| Andi  | Jakarta |
| Citra | Jakarta |
| Eko   | Bandung |

Other operators: `=`, `<>`, `>`, `<`, `>=`, `<=`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.

```sql
SELECT name, price
FROM products
WHERE price BETWEEN 100000 AND 400000;
```

**Result:**

| name     | price  |
|----------|--------|
| Mouse    | 150000 |
| Keyboard | 300000 |

## 3. AND / OR — Combining Conditions

```sql
SELECT order_id, city, total
FROM orders
WHERE status = 'completed' AND total > 100000;
```

**Result:**

| order_id | city    | total   |
|----------|---------|---------|
| O01      | Jakarta | 450000  |
| O03      | Jakarta | 1200000 |
| O05      | Bandung | 150000  |

## 4. ORDER BY & LIMIT

```sql
SELECT name, price
FROM products
ORDER BY price DESC   -- highest first
LIMIT 3;              -- top 3
```

**Result:**

| name     | price   |
|----------|---------|
| Monitor  | 1200000 |
| Keyboard | 300000  |
| Mouse    | 150000  |

## 5. Aggregation — Summarizing Data

Aggregate functions collapse many rows into one value.

```sql
SELECT COUNT(*) AS total_customers FROM customers;
```

**Result:**

| total_customers |
|-----------------|
| 5               |

```sql
SELECT SUM(total) AS revenue, AVG(total) AS average
FROM orders
WHERE status = 'completed';
```

**Result:**

| revenue | average |
|---------|---------|
| 1850000 | 370000  |

### GROUP BY — Aggregating per Group

```sql
SELECT city, COUNT(*) AS order_count, SUM(total) AS revenue
FROM orders
GROUP BY city;
```

**Result:** (one row per city)

| city     | order_count | revenue |
|----------|-------------|---------|
| Jakarta  | 3           | 1950000 |
| Bandung  | 2           | 175000  |
| Surabaya | 1           | 25000   |

### HAVING — Filtering Aggregated Results

`WHERE` filters rows **before** grouping; `HAVING` filters **after** aggregation.

```sql
SELECT city, COUNT(*) AS order_count
FROM orders
GROUP BY city
HAVING COUNT(*) >= 2;
```

**Result:** (only cities with ≥ 2 orders — Surabaya is filtered out)

| city    | order_count |
|---------|-------------|
| Jakarta | 3           |
| Bandung | 2           |

## SQL Order of Execution
Although you write `SELECT` first, the database executes in this order:
`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Common Errors
- Forgetting single quotes around text: `WHERE city = Jakarta` ❌ → `'Jakarta'` ✅
- Using `WHERE` on aggregated results (should be `HAVING`).
- Wrong column/table name.

> 💡 Hands-on practice is in **Playground → SQL** and in this session's exercises — run real queries in the browser and see the result table.

## Key Takeaways
- `SELECT ... FROM` picks columns; `WHERE` filters rows.
- `ORDER BY` sorts, `LIMIT` caps the result.
- Aggregation (`COUNT/SUM/AVG`) + `GROUP BY` summarizes data per group.
- `HAVING` filters aggregated results; `WHERE` filters raw rows.
$da_en$
WHERE session_number = 'F08';

-- ── F01 — Cleaning and Shaping Incoming Data (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Sabtu, 4 Juli 2026 · 09.00 WIB

# Sesi 1 — Membersihkan dan Merapihkan Data yang Diterima

Sebagai data analyst, sekitar **70–80% waktumu** habis untuk membersihkan data — bukan menganalisis. Data yang kamu terima hampir selalu berantakan: duplikat, sel kosong, spasi tersembunyi, dan angka yang tersimpan sebagai teks. Sesi ini mengajarkan cara mengubah data mentah yang kacau menjadi dataset yang rapi dan siap dianalisis.

## Contoh: Data Mentah yang Kotor

Bayangkan kamu menerima ekspor pendaftaran seperti ini:

**Data mentah (kotor):**

| id | nama          | kota      | belanja   |
|----|---------------|-----------|-----------|
| 1  | `  Andi  `    | Jakarta   | 150000    |
| 2  | budi santoso  | bandung   | 25.000    |
| 3  | Citra         | Jakarta   | *(kosong)* |
| 2  | budi santoso  | bandung   | 25.000    |
| 4  | DINA          | `Surabaya ` | 300000  |

Perhatikan masalahnya: `Andi` punya spasi berlebih, kapitalisasi tidak konsisten, baris `id 2` **duplikat**, `belanja` Citra **kosong**, `25.000` tersimpan sebagai **teks**, dan `Surabaya ` ada spasi di belakang.

**Setelah dibersihkan:**

| id | nama         | kota     | belanja |
|----|--------------|----------|---------|
| 1  | Andi         | Jakarta  | 150000  |
| 2  | Budi Santoso | Bandung  | 25000   |
| 3  | Citra        | Jakarta  | 0       |
| 4  | Dina         | Surabaya | 300000  |

Duplikat dihapus, nama dirapikan (`TRIM`+`PROPER`), kota diseragamkan, `belanja` kosong diisi 0, dan angka teks dikonversi.

## 1. Identifikasi Duplikat dan Data Kosong

- **Hapus duplikat:** blok data → **Data → Remove Duplicates**, atau tandai dulu dengan `=COUNTIF($A$2:$A$100, A2) > 1`.
- **Temukan sel kosong:** **Go To Special** (`Ctrl+G` → Special → Blanks), atau `=COUNTBLANK(range)`.

**Contoh nyata:**
- **E-commerce:** kolom `order_id` seharusnya unik — `=COUNTIF(A:A, A2) > 1` menandai order dobel.
- **Data penjualan:** `diskon` kosong berarti 0, tapi `harga` kosong berarti data rusak. **Kosong ≠ selalu nol** — pahami konteksnya.

## 2. Error Handling

| Rumus | Fungsi |
|---|---|
| `=IFERROR(rumus, "—")` | Menangani **semua** error (`#DIV/0!`, `#VALUE!`, dll.) |
| `=IFNA(rumus, "tidak ada")` | Khusus error `#N/A` dari VLOOKUP |

**Contoh + hasil:**

| Rumus | Input | Hasil |
|---|---|---|
| `=IFERROR(100/0, "Error")` | 100/0 | `Error` |
| `=IFERROR(VLOOKUP("X",data,2,0), "Tak ada")` | kode "X" tak ada | `Tak ada` |

## 3. Merapikan Isian Data dengan Fungsi Teks

Setiap rumus di bawah beserta **hasilnya**:

| Fungsi | Contoh | Hasil |
|---|---|---|
| `TRIM` | `=TRIM("  Budi  ")` | `Budi` |
| `PROPER` | `=PROPER("budi santoso")` | `Budi Santoso` |
| `LEFT` | `=LEFT("INV-2026",3)` | `INV` |
| `RIGHT` | `=RIGHT("INV-2026",4)` | `2026` |
| `MID` | `=MID("INV-2026-01",5,4)` | `2026` |
| `SUBSTITUTE` | `=SUBSTITUTE("0812-345","-","")` | `0812345` |
| `VALUE` | `=VALUE("25000")` | `25000` (angka) |

**Contoh gabungan:** `=PROPER(TRIM("  aNDi wijaya "))` → `Andi Wijaya`.

### Memisahkan Kolom

`"Budi,Jakarta"` dipecah dengan **Text to Columns** (pemisah koma):

| Sebelum | Kolom 1 | Kolom 2 |
|---|---|---|
| `Budi,Jakarta` | `Budi` | `Jakarta` |

## Alur Kerja Pembersihan (Checklist)
1. **Buat salinan** data mentah.
2. `TRIM` semua kolom teks.
3. Standarkan kapitalisasi (`PROPER`/`UPPER`).
4. Periksa & hapus duplikat.
5. Perbaiki tipe data (teks → angka dengan `VALUE`).
6. Bungkus rumus rawan error dengan `IFERROR`.

## Kesimpulan Utama
- Data kotor menghasilkan kesimpulan yang salah — bersihkan dulu.
- `TRIM` menyelamatkanmu dari spasi tersembunyi.
- Kosong tidak selalu berarti nol.
- Selalu simpan salinan data mentah sebelum mengubahnya.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Saturday, 4 July 2026 · 09.00 WIB

# Session 1 — Cleaning and Shaping Incoming Data

As a data analyst, roughly **70–80% of your time** goes to cleaning data — not analyzing it. The data you receive is almost always messy: duplicates, blank cells, hidden spaces, and numbers stored as text. This session teaches you how to turn chaotic raw data into a tidy, analysis-ready dataset.

## Example: Dirty Raw Data

Imagine you receive a sign-up export like this:

**Raw data (dirty):**

| id | name          | city        | spend     |
|----|---------------|-------------|-----------|
| 1  | `  Andi  `    | Jakarta     | 150000    |
| 2  | budi santoso  | bandung     | 25.000    |
| 3  | Citra         | Jakarta     | *(blank)* |
| 2  | budi santoso  | bandung     | 25.000    |
| 4  | DINA          | `Surabaya ` | 300000    |

Notice the problems: `Andi` has extra spaces, inconsistent capitalization, row `id 2` is a **duplicate**, Citra's `spend` is **blank**, `25.000` is stored as **text**, and `Surabaya ` has a trailing space.

**After cleaning:**

| id | name         | city     | spend  |
|----|--------------|----------|--------|
| 1  | Andi         | Jakarta  | 150000 |
| 2  | Budi Santoso | Bandung  | 25000  |
| 3  | Citra        | Jakarta  | 0      |
| 4  | Dina         | Surabaya | 300000 |

Duplicate removed, names tidied (`TRIM`+`PROPER`), cities standardized, blank `spend` filled with 0, and the text number converted.

## 1. Identify Duplicates and Blank Data

- **Remove duplicates:** select data → **Data → Remove Duplicates**, or flag first with `=COUNTIF($A$2:$A$100, A2) > 1`.
- **Find blank cells:** **Go To Special** (`Ctrl+G` → Special → Blanks), or `=COUNTBLANK(range)`.

**Real examples:**
- **E-commerce:** `order_id` should be unique — `=COUNTIF(A:A, A2) > 1` flags double orders.
- **Sales data:** a blank `discount` means 0, but a blank `price` means broken data. **Blank ≠ always zero** — understand the context.

## 2. Error Handling

| Formula | Purpose |
|---|---|
| `=IFERROR(formula, "—")` | Handles **all** errors (`#DIV/0!`, `#VALUE!`, etc.) |
| `=IFNA(formula, "not found")` | Only `#N/A` errors from VLOOKUP |

**Example + result:**

| Formula | Input | Result |
|---|---|---|
| `=IFERROR(100/0, "Error")` | 100/0 | `Error` |
| `=IFERROR(VLOOKUP("X",data,2,0), "None")` | code "X" missing | `None` |

## 3. Shaping Data with Text Functions

Each formula below, with its **result**:

| Function | Example | Result |
|---|---|---|
| `TRIM` | `=TRIM("  Budi  ")` | `Budi` |
| `PROPER` | `=PROPER("budi santoso")` | `Budi Santoso` |
| `LEFT` | `=LEFT("INV-2026",3)` | `INV` |
| `RIGHT` | `=RIGHT("INV-2026",4)` | `2026` |
| `MID` | `=MID("INV-2026-01",5,4)` | `2026` |
| `SUBSTITUTE` | `=SUBSTITUTE("0812-345","-","")` | `0812345` |
| `VALUE` | `=VALUE("25000")` | `25000` (a number) |

**Combined example:** `=PROPER(TRIM("  aNDi wijaya "))` → `Andi Wijaya`.

### Splitting Columns

`"Budi,Jakarta"` split with **Text to Columns** (comma delimiter):

| Before | Column 1 | Column 2 |
|---|---|---|
| `Budi,Jakarta` | `Budi` | `Jakarta` |

## Cleaning Workflow (Checklist)
1. **Make a copy** of the raw data.
2. `TRIM` all text columns.
3. Standardize capitalization (`PROPER`/`UPPER`).
4. Check & remove duplicates.
5. Fix data types (text → number with `VALUE`).
6. Wrap error-prone formulas in `IFERROR`.

## Key Takeaways
- Dirty data leads to wrong conclusions — clean first.
- `TRIM` saves you from hidden spaces.
- Blank does not always mean zero.
- Always keep a copy of the raw data before changing it.
$da_en$
WHERE session_number = 'F01';

-- ── F02 — Presenting Data to Stakeholder Needs (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Sabtu, 4 Juli 2026 · 13.00 WIB

# Sesi 2 — Menyajikan Data Sesuai Kebutuhan Stakeholder

Stakeholder tidak butuh ribuan baris data — mereka butuh **jawaban**. Sesi ini mengajarkan logika rumus, statistik dasar, serta cara meringkas data agar tepat sasaran.

## Data Contoh yang Kita Pakai

**Tabel `penjualan`**

| wilayah | produk    | qty | omzet   |
|---------|-----------|-----|---------|
| Jakarta | Mouse     | 3   | 450000  |
| Bandung | Keyboard  | 1   | 300000  |
| Jakarta | Monitor   | 2   | 2400000 |
| Bandung | Mouse     | 4   | 600000  |
| Jakarta | Keyboard  | 1   | 300000  |
| Surabaya| Mouse     | 2   | 300000  |

## 1. Referensi Sel: Relatif vs Absolut

- `A1` **relatif** — ikut bergeser saat disalin.
- `$A$1` **absolut** — terkunci.

**Contoh:** tarif PPN 11% di sel `$B$1`. Rumus `=omzet*$B$1` disalin ke semua baris tetap merujuk tarif yang sama:

| omzet   | `=omzet*$B$1` (PPN) |
|---------|---------------------|
| 450000  | 49500               |
| 300000  | 33000               |
| 2400000 | 264000              |

## 2. Statistik Dasar

Dijalankan pada kolom `omzet` di tabel di atas:

| Rumus | Hasil |
|---|---|
| `=SUM(omzet)` | 4350000 |
| `=COUNT(omzet)` | 6 |
| `=AVERAGE(omzet)` | 725000 |
| `=MAX(omzet)` | 2400000 |
| `=MEDIAN(omzet)` | 375000 |

> 💡 **Mean vs Median:** rata-rata (725.000) tertarik ke atas oleh satu transaksi Monitor Rp2,4 juta. Median (375.000) lebih mewakili transaksi "tipikal".

## 3. Rumus Kondisional (SUMIF / COUNTIF / SUMIFS)

```
=SUMIF(wilayah, "Jakarta", omzet)
```

**Hasil per wilayah:**

| Rumus | Hasil |
|---|---|
| `=SUMIF(wilayah,"Jakarta",omzet)` | 3150000 |
| `=SUMIF(wilayah,"Bandung",omzet)` | 900000 |
| `=COUNTIF(wilayah,"Jakarta")` | 3 |

**Kriteria ganda dengan SUMIFS:**

```
=SUMIFS(omzet, wilayah, "Jakarta", produk, "Keyboard")
```

**Hasil:** `300000` (hanya baris Jakarta + Keyboard).

### Wildcard

| Rumus | Menangkap | Hasil |
|---|---|---|
| `=COUNTIF(wilayah,"Jakarta*")` | "Jakarta", "Jakarta Pusat", dst | 3 |
| `=SUMIF(produk,"*Mouse*",omzet)` | semua varian "Mouse" | 1350000 |

## 4. SORT & FILTER

**Filter `wilayah = "Jakarta"`** menghasilkan mini-laporan:

| wilayah | produk   | omzet   |
|---------|----------|---------|
| Jakarta | Mouse    | 450000  |
| Jakarta | Monitor  | 2400000 |
| Jakarta | Keyboard | 300000  |

## Mindset Penyajian Data
1. Mulai dari **pertanyaan** stakeholder, bukan dari data.
2. Ringkas ke level keputusan (total, rata-rata, persentase).
3. Sajikan jawaban, bukan data mentah.

## Kesimpulan Utama
- Kunci sel dengan `$` agar rumus benar saat disalin.
- `SUMIFS`/`COUNTIFS` adalah tulang punggung pelaporan berbasis kriteria.
- Median lebih tahan terhadap nilai ekstrem daripada mean.
- Sajikan jawaban, bukan data mentah.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Saturday, 4 July 2026 · 13.00 WIB

# Session 2 — Presenting Data to Stakeholder Needs

Stakeholders don't need thousands of rows — they need **answers**. This session covers formula logic, basic statistics, and how to summarize data so it hits the mark.

## The Sample Data We'll Use

**Table `sales`**

| region   | product   | qty | revenue |
|----------|-----------|-----|---------|
| Jakarta  | Mouse     | 3   | 450000  |
| Bandung  | Keyboard  | 1   | 300000  |
| Jakarta  | Monitor   | 2   | 2400000 |
| Bandung  | Mouse     | 4   | 600000  |
| Jakarta  | Keyboard  | 1   | 300000  |
| Surabaya | Mouse     | 2   | 300000  |

## 1. Cell References: Relative vs Absolute

- `A1` **relative** — shifts when copied.
- `$A$1` **absolute** — locked.

**Example:** an 11% VAT rate in `$B$1`. The formula `=revenue*$B$1` copied to all rows keeps referencing the same rate:

| revenue | `=revenue*$B$1` (VAT) |
|---------|-----------------------|
| 450000  | 49500                 |
| 300000  | 33000                 |
| 2400000 | 264000                |

## 2. Basic Statistics

Run on the `revenue` column above:

| Formula | Result |
|---|---|
| `=SUM(revenue)` | 4350000 |
| `=COUNT(revenue)` | 6 |
| `=AVERAGE(revenue)` | 725000 |
| `=MAX(revenue)` | 2400000 |
| `=MEDIAN(revenue)` | 375000 |

> 💡 **Mean vs Median:** the average (725,000) is pulled up by one Rp2.4M Monitor sale. The median (375,000) better represents the "typical" transaction.

## 3. Conditional Formulas (SUMIF / COUNTIF / SUMIFS)

```
=SUMIF(region, "Jakarta", revenue)
```

**Result per region:**

| Formula | Result |
|---|---|
| `=SUMIF(region,"Jakarta",revenue)` | 3150000 |
| `=SUMIF(region,"Bandung",revenue)` | 900000 |
| `=COUNTIF(region,"Jakarta")` | 3 |

**Multiple criteria with SUMIFS:**

```
=SUMIFS(revenue, region, "Jakarta", product, "Keyboard")
```

**Result:** `300000` (only the Jakarta + Keyboard row).

### Wildcards

| Formula | Matches | Result |
|---|---|---|
| `=COUNTIF(region,"Jakarta*")` | "Jakarta", "Jakarta Pusat", etc | 3 |
| `=SUMIF(product,"*Mouse*",revenue)` | every "Mouse" variant | 1350000 |

## 4. SORT & FILTER

**Filter `region = "Jakarta"`** produces a mini report:

| region  | product  | revenue |
|---------|----------|---------|
| Jakarta | Mouse    | 450000  |
| Jakarta | Monitor  | 2400000 |
| Jakarta | Keyboard | 300000  |

## Data Presentation Mindset
1. Start from the stakeholder's **question**, not the data.
2. Summarize to decision level (totals, averages, percentages).
3. Deliver the answer, not raw data.

## Key Takeaways
- Lock cells with `$` so formulas stay correct when copied.
- `SUMIFS`/`COUNTIFS` are the backbone of criteria-based reporting.
- The median resists extreme values better than the mean.
- Deliver the answer, not the raw data.
$da_en$
WHERE session_number = 'F02';

-- ── F03 — Joining & Highlighting Datasets (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Minggu, 5 Juli 2026 · 09.00 WIB

# Sesi 3 — Menggabungkan & Highlight Dataset

Data jarang berada di satu tempat. Transaksi ada di satu tabel, detail produk di tabel lain. Sesi ini mengajarkan cara **menggabungkan** tabel dengan fungsi lookup dan **menyoroti** kondisi penting secara visual.

## Data Contoh: Dua Tabel

**Tabel `transaksi`** (yang kita punya)

| order_id | product_id | qty |
|----------|------------|-----|
| O01      | P02        | 2   |
| O02      | P01        | 5   |
| O03      | P03        | 1   |

**Tabel `master_produk`** (referensi)

| product_id | nama_produk | harga  |
|------------|-------------|--------|
| P01        | Mouse       | 150000 |
| P02        | Keyboard    | 300000 |
| P03        | Monitor     | 1200000|

Tujuan: menarik `nama_produk` & `harga` ke tabel transaksi lewat kunci `product_id`.

## 1. VLOOKUP

```
=VLOOKUP(product_id, master_produk, 3, FALSE)
```

Diterapkan ke setiap baris transaksi, **hasil gabungannya:**

| order_id | product_id | nama_produk | harga   | qty | subtotal |
|----------|------------|-------------|---------|-----|----------|
| O01      | P02        | Keyboard    | 300000  | 2   | 600000   |
| O02      | P01        | Mouse       | 150000  | 5   | 750000   |
| O03      | P03        | Monitor     | 1200000 | 1   | 1200000  |

`FALSE` = pencocokan **persis** (wajib untuk ID). Keterbatasan VLOOKUP: hanya mencari ke **kanan**.

## 2. XLOOKUP & INDEX-MATCH

```
=XLOOKUP(product_id, kolom_id, kolom_nama, "Tidak ada")
```
- Bisa mencari ke **kiri maupun kanan**, dan punya argumen "jika tidak ditemukan" bawaan.

```
=INDEX(kolom_hasil, MATCH(product_id, kolom_id, 0))
```
- Klasik, bekerja di semua versi, cepat pada data besar.

**Jika kode tidak ada**, mis. `product_id = "P09"`:

| Rumus | Hasil |
|---|---|
| `=XLOOKUP("P09", ...,"Tidak ada")` | `Tidak ada` |
| `=IFERROR(VLOOKUP("P09",...), "Tidak ada")` | `Tidak ada` |

| | VLOOKUP | XLOOKUP | INDEX-MATCH |
|---|---|---|---|
| Cari ke kiri | ❌ | ✅ | ✅ |
| Tahan sisip kolom | ❌ | ✅ | ✅ |

## 3. Conditional Formatting

Menyoroti kondisi secara otomatis. Contoh: soroti **merah** bila `stok < 5`.

**Data + status sorotan:**

| produk   | stok | Sorotan |
|----------|------|---------|
| Mouse    | 12   | (normal) |
| Keyboard | 3    | 🔴 merah |
| Monitor  | 2    | 🔴 merah |

Aturan lain: **Data Bars** (grafik mini dalam sel), **Color Scales** (hijau→merah), dan rumus kustom seperti `=$E2 < 0.1` untuk menyoroti seluruh baris bermargin < 10%.

## Kesimpulan Utama
- Gabungkan tabel lewat **kunci** yang sama dengan fungsi lookup.
- `XLOOKUP` & `INDEX-MATCH` lebih unggul daripada `VLOOKUP`.
- Selalu pakai pencocokan persis (`FALSE` / `0`) untuk ID.
- Conditional Formatting mengubah angka menjadi insight yang langsung terlihat.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Sunday, 5 July 2026 · 09.00 WIB

# Session 3 — Joining & Highlighting Datasets

Data rarely lives in one place. Transactions are in one table, product details in another. This session teaches you how to **join** tables with lookup functions and **highlight** important conditions visually.

## Sample Data: Two Tables

**Table `transactions`** (what we have)

| order_id | product_id | qty |
|----------|------------|-----|
| O01      | P02        | 2   |
| O02      | P01        | 5   |
| O03      | P03        | 1   |

**Table `product_master`** (reference)

| product_id | product_name | price   |
|------------|--------------|---------|
| P01        | Mouse        | 150000  |
| P02        | Keyboard     | 300000  |
| P03        | Monitor      | 1200000 |

Goal: pull `product_name` & `price` into the transactions table via the `product_id` key.

## 1. VLOOKUP

```
=VLOOKUP(product_id, product_master, 3, FALSE)
```

Applied to each transaction row, **the joined result:**

| order_id | product_id | product_name | price   | qty | subtotal |
|----------|------------|--------------|---------|-----|----------|
| O01      | P02        | Keyboard     | 300000  | 2   | 600000   |
| O02      | P01        | Mouse        | 150000  | 5   | 750000   |
| O03      | P03        | Monitor      | 1200000 | 1   | 1200000  |

`FALSE` = **exact** match (required for IDs). VLOOKUP's limit: it only looks to the **right**.

## 2. XLOOKUP & INDEX-MATCH

```
=XLOOKUP(product_id, id_col, name_col, "Not found")
```
- Can look **left or right**, and has a built-in "if not found" argument.

```
=INDEX(result_col, MATCH(product_id, id_col, 0))
```
- The classic, works everywhere, fast on large data.

**If the code is missing**, e.g. `product_id = "P09"`:

| Formula | Result |
|---|---|
| `=XLOOKUP("P09", ...,"Not found")` | `Not found` |
| `=IFERROR(VLOOKUP("P09",...), "Not found")` | `Not found` |

| | VLOOKUP | XLOOKUP | INDEX-MATCH |
|---|---|---|---|
| Look left | ❌ | ✅ | ✅ |
| Survives column insert | ❌ | ✅ | ✅ |

## 3. Conditional Formatting

Highlights conditions automatically. Example: highlight **red** when `stock < 5`.

**Data + highlight status:**

| product  | stock | Highlight |
|----------|-------|-----------|
| Mouse    | 12    | (normal)  |
| Keyboard | 3     | 🔴 red    |
| Monitor  | 2     | 🔴 red    |

Other rules: **Data Bars** (mini chart in the cell), **Color Scales** (green→red), and custom formulas like `=$E2 < 0.1` to highlight whole rows with margin < 10%.

## Key Takeaways
- Join tables via a shared **key** using lookup functions.
- `XLOOKUP` & `INDEX-MATCH` beat `VLOOKUP`.
- Always use exact match (`FALSE` / `0`) for IDs.
- Conditional Formatting turns numbers into instantly visible insight.
$da_en$
WHERE session_number = 'F03';

-- ── F04 — Pivot Tables for Insight (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Minggu, 5 Juli 2026 · 13.00 WIB

# Sesi 4 — Pivot Table untuk Dapatkan Insight

Pivot Table meringkas ribuan baris menjadi insight dalam hitungan detik — **tanpa satu pun rumus**.

## Data Mentah

Misal kita punya transaksi berikut:

| tanggal    | kategori    | wilayah | omzet   |
|------------|-------------|---------|---------|
| 2026-01-05 | Electronics | Jakarta | 1200000 |
| 2026-01-12 | Stationery  | Bandung | 150000  |
| 2026-02-03 | Electronics | Jakarta | 800000  |
| 2026-02-20 | Fashion     | Bandung | 400000  |
| 2026-03-01 | Electronics | Bandung | 600000  |
| 2026-03-15 | Fashion     | Jakarta | 500000  |

## 1. Pivot: Omzet per Kategori

Seret **Kategori** ke Rows, **omzet** ke Values (Sum). **Hasil Pivot:**

| Kategori    | Sum omzet |
|-------------|-----------|
| Electronics | 2600000   |
| Fashion     | 900000    |
| Stationery  | 150000    |
| **Total**   | **3650000** |

## 2. Pivot 2 Dimensi: Kategori × Wilayah

**Rows** = Kategori, **Columns** = Wilayah, **Values** = Sum(omzet):

| Kategori    | Jakarta | Bandung | Total   |
|-------------|---------|---------|---------|
| Electronics | 2000000 | 600000  | 2600000 |
| Fashion     | 500000  | 400000  | 900000  |
| Stationery  | 0       | 150000  | 150000  |
| **Total**   | 2500000 | 1150000 | 3650000 |

## 3. Show Values As — % of Grand Total

Ubah "Show Values As → % of Grand Total" pada Pivot pertama:

| Kategori    | % Kontribusi |
|-------------|--------------|
| Electronics | 71,2%        |
| Fashion     | 24,7%        |
| Stationery  | 4,1%         |

**Insight langsung:** Electronics menyumbang 71% omzet — fokus utama bisnis.

## 4. Grouping Tanggal → Bulan

Group field `tanggal` ke Bulan, Values = Sum(omzet):

| Bulan    | Omzet   |
|----------|---------|
| Januari  | 1350000 |
| Februari | 1200000 |
| Maret    | 1100000 |

Fitur lain: **Calculated Field** (mis. `Margin % = Profit/Revenue`), **Slicer**, dan **Timeline** untuk interaktivitas.

## Kesimpulan Utama
- Pivot Table meringkas data besar tanpa rumus.
- Ingat 4 area: Rows, Columns, Values, Filters.
- "Show Values As" mengubah angka mentah menjadi persen & tren.
- Grouping merapikan tanggal menjadi kelompok yang bermakna.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Sunday, 5 July 2026 · 13.00 WIB

# Session 4 — Pivot Tables for Insight

A Pivot Table summarizes thousands of rows into insight in seconds — **without a single formula**.

## Raw Data

Say we have the following transactions:

| date       | category    | region  | revenue |
|------------|-------------|---------|---------|
| 2026-01-05 | Electronics | Jakarta | 1200000 |
| 2026-01-12 | Stationery  | Bandung | 150000  |
| 2026-02-03 | Electronics | Jakarta | 800000  |
| 2026-02-20 | Fashion     | Bandung | 400000  |
| 2026-03-01 | Electronics | Bandung | 600000  |
| 2026-03-15 | Fashion     | Jakarta | 500000  |

## 1. Pivot: Revenue per Category

Drag **Category** to Rows, **revenue** to Values (Sum). **Pivot result:**

| Category    | Sum revenue |
|-------------|-------------|
| Electronics | 2600000     |
| Fashion     | 900000      |
| Stationery  | 150000      |
| **Total**   | **3650000** |

## 2. Two-Dimensional Pivot: Category × Region

**Rows** = Category, **Columns** = Region, **Values** = Sum(revenue):

| Category    | Jakarta | Bandung | Total   |
|-------------|---------|---------|---------|
| Electronics | 2000000 | 600000  | 2600000 |
| Fashion     | 500000  | 400000  | 900000  |
| Stationery  | 0       | 150000  | 150000  |
| **Total**   | 2500000 | 1150000 | 3650000 |

## 3. Show Values As — % of Grand Total

Set "Show Values As → % of Grand Total" on the first Pivot:

| Category    | % Contribution |
|-------------|----------------|
| Electronics | 71.2%          |
| Fashion     | 24.7%          |
| Stationery  | 4.1%           |

**Instant insight:** Electronics contributes 71% of revenue — the core of the business.

## 4. Grouping Date → Month

Group the `date` field into Month, Values = Sum(revenue):

| Month    | Revenue |
|----------|---------|
| January  | 1350000 |
| February | 1200000 |
| March    | 1100000 |

Other features: **Calculated Field** (e.g. `Margin % = Profit/Revenue`), **Slicer**, and **Timeline** for interactivity.

## Key Takeaways
- Pivot Tables summarize big data with no formulas.
- Remember the 4 areas: Rows, Columns, Values, Filters.
- "Show Values As" turns raw numbers into percentages & trends.
- Grouping tidies dates into meaningful buckets.
$da_en$
WHERE session_number = 'F04';

-- ── F05 — Exploratory Data Analysis (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Kamis, 9 Juli 2026 · 19.30 WIB

# Sesi 5 — Exploratory Data Analysis (EDA)

EDA adalah proses **memahami data sebelum mengambil kesimpulan**. Sebelum membuat dashboard atau model, kamu harus tahu bentuk datanya, di mana anomalinya, dan hubungan apa yang tersembunyi.

## Dataset Contoh

**Tabel `order`** (nilai transaksi & diskon):

| order_id | nilai   | diskon% | channel   |
|----------|---------|---------|-----------|
| 1        | 100000  | 0       | Website   |
| 2        | 150000  | 5       | Website   |
| 3        | 120000  | 5       | Instagram |
| 4        | 200000  | 10      | Instagram |
| 5        | 180000  | 10      | Website   |
| 6        | 5000000 | 20      | Instagram |

## 1. Analisis Univariate (Satu Kolom)

Statistik pada kolom `nilai`:

| Ukuran | Hasil | Catatan |
|---|---|---|
| Mean | 958.333 | tertarik ke atas oleh outlier |
| Median | 165.000 | lebih mewakili "tipikal" |
| Min | 100.000 | |
| Max | 5.000.000 | **outlier!** |

**Deteksi outlier (aturan IQR):** transaksi Rp5.000.000 jauh di atas batas atas → outlier. Setelah diselidiki: ternyata pembelian grosir korporat, bukan error — **diselidiki dulu, jangan langsung dibuang**.

## 2. Analisis Bivariate (Dua Kolom)

### Numerik × Numerik — Korelasi
`=CORREL(diskon%, nilai)` (tanpa outlier) → sekitar **+0,9** → makin besar diskon, makin besar nilai order. Tapi cek marginnya!

### Kategori × Kategori — Crosstab
Silang `channel` × apakah order > 150rb:

| channel   | ≤150rb | >150rb | Total |
|-----------|--------|--------|-------|
| Website   | 2      | 1      | 3     |
| Instagram | 1      | 2      | 3     |

**Insight:** order dari Instagram cenderung bernilai lebih besar.

> ⚠️ **Korelasi ≠ kausalitas.** Penjualan payung & jas hujan berkorelasi tinggi, tapi payung tidak menyebabkan orang beli jas hujan — hujan-lah penyebab keduanya.

## 3. Dari Temuan ke Rekomendasi

Setiap temuan → tanyakan **Apa? Mengapa? So what?**

❌ "Penjualan Jakarta rendah."
✅ "Penjualan Jakarta turun 18% sejak Maret, terkonsentrasi pada Elektronik. Rekomendasi: audit stok Elektronik gudang Jakarta dalam 2 minggu."

## Kesimpulan Utama
- EDA dilakukan **sebelum** analisis lanjutan — kenali datamu dulu.
- Univariate = satu kolom; bivariate = hubungan dua kolom.
- Deteksi outlier dengan IQR — tapi selidiki, jangan langsung buang.
- Korelasi bukan kausalitas.
- Setiap insight harus berakhir dengan rekomendasi konkret.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Thursday, 9 July 2026 · 19.30 WIB

# Session 5 — Exploratory Data Analysis (EDA)

EDA is the process of **understanding data before drawing conclusions**. Before building a dashboard or model, you must know the shape of the data, where the anomalies are, and what relationships are hidden.

## Sample Dataset

**Table `orders`** (transaction value & discount):

| order_id | value   | discount% | channel   |
|----------|---------|-----------|-----------|
| 1        | 100000  | 0         | Website   |
| 2        | 150000  | 5         | Website   |
| 3        | 120000  | 5         | Instagram |
| 4        | 200000  | 10        | Instagram |
| 5        | 180000  | 10        | Website   |
| 6        | 5000000 | 20        | Instagram |

## 1. Univariate Analysis (One Column)

Statistics on the `value` column:

| Measure | Result | Note |
|---|---|---|
| Mean | 958,333 | pulled up by the outlier |
| Median | 165,000 | better represents the "typical" |
| Min | 100,000 | |
| Max | 5,000,000 | **outlier!** |

**Outlier detection (IQR rule):** the Rp5,000,000 transaction is far above the upper bound → an outlier. After investigating: it's a corporate bulk purchase, not an error — **investigate before discarding**.

## 2. Bivariate Analysis (Two Columns)

### Numeric × Numeric — Correlation
`=CORREL(discount%, value)` (without the outlier) → about **+0.9** → bigger discounts, bigger order value. But check the margin!

### Categorical × Categorical — Crosstab
Cross `channel` × whether order > 150k:

| channel   | ≤150k | >150k | Total |
|-----------|-------|-------|-------|
| Website   | 2     | 1     | 3     |
| Instagram | 1     | 2     | 3     |

**Insight:** orders from Instagram tend to be higher-value.

> ⚠️ **Correlation ≠ causation.** Umbrella & raincoat sales correlate strongly, but umbrellas don't cause raincoat purchases — rain causes both.

## 3. From Finding to Recommendation

For every finding → ask **What? Why? So what?**

❌ "Jakarta sales are low."
✅ "Jakarta sales dropped 18% since March, concentrated in Electronics. Recommendation: audit Electronics stock at the Jakarta warehouse within 2 weeks."

## Key Takeaways
- EDA happens **before** advanced analysis — know your data first.
- Univariate = one column; bivariate = relationship between two columns.
- Detect outliers with IQR — but investigate before discarding.
- Correlation is not causation.
- Every insight must end with a concrete recommendation.
$da_en$
WHERE session_number = 'F05';

-- ── F06 — Data Visualization (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Selasa, 14 Juli 2026 · 19.30 WIB

# Sesi 6 — Visualisasi Data

Visualisasi yang baik membuat insight **langsung terlihat**. Sesi ini mengajarkan prinsip memilih chart, mendesain dashboard, dan membuatnya interaktif.

## Dari Data ke Chart

Setiap chart berasal dari sebuah tabel data. Contoh data omzet per cabang:

| cabang   | omzet   |
|----------|---------|
| Jakarta  | 2500000 |
| Bandung  | 1150000 |
| Surabaya | 400000  |

**Chart yang tepat → Bar chart** (membandingkan nilai antar cabang). Secara visual, batang Jakarta ~2× Bandung dan ~6× Surabaya.

```
Jakarta   ██████████████████████████ 2.500.000
Bandung   ████████████ 1.150.000
Surabaya  ████ 400.000
```

## Memilih Chart yang Tepat

| Data / Tujuan | Chart Terbaik |
|---|---|
| Bandingkan nilai antar kategori | **Bar chart** |
| Tren dari waktu ke waktu | **Line chart** |
| Komposisi bagian dari keseluruhan | **Pie/Donut** (maks 5 irisan) |
| Sebaran/distribusi | **Histogram / Box plot** |
| Hubungan dua angka | **Scatter plot** |

**Contoh tren (Line chart)** — pengunjung website:

| bulan | pengunjung |
|-------|-----------|
| Jan   | 1200      |
| Feb   | 1500      |
| Mar   | 1350      |
| Apr   | 1800      |

Garis naik-turun ini langsung menunjukkan pola pertumbuhan yang tak terlihat di tabel angka.

## Prinsip Penting: Sumbu Mulai dari Nol

Bar chart omzet 92 vs 95 yang sumbunya mulai dari 90 membuat selisih kecil terlihat **3× lipat** — menyesatkan. **Selalu mulai dari nol** agar jujur.

## Dashboard yang Baik
- KPI terpenting di kiri-atas.
- Warna & font konsisten.
- Satu Slicer/filter mengendalikan semua chart (PivotChart + Slicer).

## Kesimpulan Utama
- Pilih chart sesuai tujuan, bukan selera.
- Satu chart = satu pesan.
- Bar chart selalu mulai dari nol agar tidak menyesatkan.
- PivotChart + Slicer = dashboard interaktif tanpa coding.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Tuesday, 14 July 2026 · 19.30 WIB

# Session 6 — Data Visualization

Good visualization makes insight **instantly visible**. This session covers choosing charts, designing dashboards, and making them interactive.

## From Data to Chart

Every chart comes from a data table. Example revenue-by-branch data:

| branch   | revenue |
|----------|---------|
| Jakarta  | 2500000 |
| Bandung  | 1150000 |
| Surabaya | 400000  |

**The right chart → Bar chart** (comparing values across branches). Visually, Jakarta's bar is ~2× Bandung and ~6× Surabaya.

```
Jakarta   ██████████████████████████ 2,500,000
Bandung   ████████████ 1,150,000
Surabaya  ████ 400,000
```

## Choosing the Right Chart

| Data / Goal | Best Chart |
|---|---|
| Compare values across categories | **Bar chart** |
| Trend over time | **Line chart** |
| Composition (part of a whole) | **Pie/Donut** (max 5 slices) |
| Spread/distribution | **Histogram / Box plot** |
| Relationship of two numbers | **Scatter plot** |

**Trend example (Line chart)** — website visitors:

| month | visitors |
|-------|----------|
| Jan   | 1200     |
| Feb   | 1500     |
| Mar   | 1350     |
| Apr   | 1800     |

The rising line instantly reveals a growth pattern invisible in a table of numbers.

## Key Principle: Axis Starts at Zero

A revenue bar chart of 92 vs 95 whose axis starts at 90 makes a tiny gap look **3×** — misleading. **Always start at zero** to be honest.

## A Good Dashboard
- Most important KPIs top-left.
- Consistent colors & fonts.
- One Slicer/filter controls all charts (PivotChart + Slicer).

## Key Takeaways
- Choose charts by goal, not taste.
- One chart = one message.
- Bar charts always start at zero so they don't mislead.
- PivotChart + Slicer = an interactive dashboard with no coding.
$da_en$
WHERE session_number = 'F06';

-- ── F07 — Introduction to Power BI (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Kamis, 16 Juli 2026 · 19.30 WIB

# Sesi 7 — Introduce Power BI

Power BI adalah tool Business Intelligence dari Microsoft untuk membangun dashboard interaktif berskala besar — melampaui kemampuan spreadsheet.

## Alur Power BI: Data → Model → Visual

**Data sumber (`Sales`):**

| tanggal    | produk   | amount  | region  |
|------------|----------|---------|---------|
| 2026-07-01 | Mouse    | 150000  | Jakarta |
| 2026-07-01 | Monitor  | 1200000 | Jakarta |
| 2026-07-02 | Keyboard | 300000  | Bandung |

## 1. Power Query — Membersihkan (langkah terekam)

Hapus kolom, ubah tipe data, TRIM teks — **setiap langkah terekam** dan otomatis diulang saat file sumber diganti bulan depan.

## 2. Measure DAX & Hasilnya

DAX membuat **measure** dinamis. Contoh + hasil pada data di atas:

| Measure (DAX) | Rumus | Hasil |
|---|---|---|
| Total Revenue | `SUM(Sales[amount])` | 1650000 |
| Avg Order | `AVERAGE(Sales[amount])` | 550000 |
| Active Products | `DISTINCTCOUNT(Sales[produk])` | 3 |

Saat kamu klik Slicer "Jakarta", measure otomatis menyesuaikan:

| Measure | Semua | Filter: Jakarta |
|---|---|---|
| Total Revenue | 1650000 | 1350000 |
| Active Products | 3 | 2 |

## 3. Visual & Publish

Bangun Card (KPI), Line (tren), Bar (per region), Map (per provinsi) → **Publish** ke Power BI Service → **Schedule refresh** harian. Manajer tinggal buka tautan tiap pagi.

## Kesimpulan Utama
- Power BI = Power Query (bersihkan) + Model (hubungkan) + Visual (sajikan) + DAX (hitung).
- Measure DAX bersifat dinamis mengikuti filter Slicer.
- Publish ke Service untuk berbagi dashboard online.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Thursday, 16 July 2026 · 19.30 WIB

# Session 7 — Introduction to Power BI

Power BI is Microsoft's Business Intelligence tool for building large-scale interactive dashboards — beyond what spreadsheets can do.

## The Power BI Flow: Data → Model → Visual

**Source data (`Sales`):**

| date       | product  | amount  | region  |
|------------|----------|---------|---------|
| 2026-07-01 | Mouse    | 150000  | Jakarta |
| 2026-07-01 | Monitor  | 1200000 | Jakarta |
| 2026-07-02 | Keyboard | 300000  | Bandung |

## 1. Power Query — Cleaning (steps recorded)

Remove columns, change types, TRIM text — **every step is recorded** and replays automatically when you swap the source file next month.

## 2. DAX Measures & Their Results

DAX creates dynamic **measures**. Examples + results on the data above:

| Measure (DAX) | Formula | Result |
|---|---|---|
| Total Revenue | `SUM(Sales[amount])` | 1650000 |
| Avg Order | `AVERAGE(Sales[amount])` | 550000 |
| Active Products | `DISTINCTCOUNT(Sales[product])` | 3 |

When you click the "Jakarta" Slicer, measures auto-adjust:

| Measure | All | Filter: Jakarta |
|---|---|---|
| Total Revenue | 1650000 | 1350000 |
| Active Products | 3 | 2 |

## 3. Visuals & Publish

Build a Card (KPI), Line (trend), Bar (per region), Map (per province) → **Publish** to the Power BI Service → **Schedule** a daily refresh. Managers just open the link each morning.

## Key Takeaways
- Power BI = Power Query (clean) + Model (connect) + Visuals (present) + DAX (calculate).
- DAX measures are dynamic and follow the Slicer filter.
- Publish to the Service to share dashboards online.
$da_en$
WHERE session_number = 'F07';

-- ── F09 — Final Project & Portfolio (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Selasa, 21 Juli 2026 · 19.30 WIB

# Sesi 9 — Final Project dan Portofolio

Sertifikat membuktikan kamu hadir; **portofolio** membuktikan kamu bisa. Portofolio adalah bukti nyata kemampuanmu menyelesaikan masalah dari awal sampai akhir.

## Struktur Storytelling untuk Deck

Susun deck: **Konteks → Masalah → Data & Metodologi → Analisis → Insight → Rekomendasi → Dampak.** Setiap slide punya **satu pesan utama** sebagai judul.

**Judul slide: lemah vs kuat**

| ❌ Lemah | ✅ Kuat (berbasis data) |
|---|---|
| "Grafik Penjualan" | "Omzet Q3 turun 15%, dipicu kategori Fashion" |
| "Data Pelanggan" | "70% pendapatan dari 3 kota — peluang ekspansi" |

## Contoh: Dari Temuan ke Rekomendasi (dengan angka)

Inti sebuah portofolio adalah menghubungkan **data → insight → rekomendasi**:

| Temuan (data) | Insight | Rekomendasi |
|---|---|---|
| Repeat rate 34% → 21% | pelanggan tak kembali | evaluasi kurir pengiriman pertama |
| 70% omzet dari 3 kota | pasar terkonsentrasi | fokuskan iklan ke 3 kota itu |
| Margin kategori A = 8% | nyaris rugi | naikkan harga / negosiasi supplier |

## Contoh: Hasil Analisis untuk Deck

Misal Final Project-mu menghasilkan tabel omzet per kuartal:

| Kuartal | Omzet    | Pertumbuhan |
|---------|----------|-------------|
| Q1      | 12000000 | —           |
| Q2      | 15000000 | +25%        |
| Q3      | 12750000 | −15%        |

Slide ini diberi judul insight: *"Omzet Q3 turun 15% setelah tumbuh kuat di Q2"* — bukan sekadar "Tabel Omzet".

## Publikasi
LinkedIn, Notion/Google Sites, Tableau Public, GitHub. Sertakan tautan dataset, dashboard, dan deck; tulis ringkasan 2–3 kalimat di awal.

## Kesimpulan Utama
- Portofolio = bukti kemampuan; lebih penting dari sertifikat.
- Susun dengan alur storytelling dan judul slide berbasis data.
- Hubungkan data → insight → rekomendasi di setiap bagian.
- Publikasikan agar mudah ditemukan perekrut.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Tuesday, 21 July 2026 · 19.30 WIB

# Session 9 — Final Project & Portfolio

A certificate proves you showed up; a **portfolio** proves you can do the work. It's concrete evidence you can solve a problem end to end.

## Storytelling Structure for the Deck

Order the deck: **Context → Problem → Data & Methodology → Analysis → Insight → Recommendation → Impact.** Each slide has **one key message** as its title.

**Slide titles: weak vs strong**

| ❌ Weak | ✅ Strong (data-based) |
|---|---|
| "Sales Chart" | "Q3 revenue fell 15%, driven by Fashion" |
| "Customer Data" | "70% of revenue from 3 cities — expansion opportunity" |

## Example: From Finding to Recommendation (with numbers)

The heart of a portfolio is connecting **data → insight → recommendation**:

| Finding (data) | Insight | Recommendation |
|---|---|---|
| Repeat rate 34% → 21% | customers don't return | review the first-delivery courier |
| 70% revenue from 3 cities | market is concentrated | focus ads on those 3 cities |
| Category A margin = 8% | barely profitable | raise price / renegotiate supplier |

## Example: Analysis Results for the Deck

Say your Final Project produces a revenue-by-quarter table:

| Quarter | Revenue  | Growth |
|---------|----------|--------|
| Q1      | 12000000 | —      |
| Q2      | 15000000 | +25%   |
| Q3      | 12750000 | −15%   |

Give this slide an insight title: *"Q3 revenue fell 15% after strong Q2 growth"* — not just "Revenue Table".

## Publishing
LinkedIn, Notion/Google Sites, Tableau Public, GitHub. Include dataset, dashboard, and deck links; write a 2–3 sentence summary up top.

## Key Takeaways
- A portfolio = proof of ability; more important than a certificate.
- Build it with a storytelling arc and data-based slide titles.
- Connect data → insight → recommendation in every section.
- Publish it so recruiters can find you.
$da_en$
WHERE session_number = 'F09';

-- ── F10 — BNSP Prep: Business Process (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Rabu, 22 Juli 2026 · 19.30 WIB

# Sesi 10 — Kelas Persiapan BNSP: Mengidentifikasi Business Process

Uji kompetensi **BNSP** menuntut kamu berpikir seperti pemecah masalah bisnis. Sesi ini melatih: memahami proses bisnis, menemukan akar masalah, dan merumuskan masalah.

## 1. Business Process & Menemukan Bottleneck

Petakan proses dan **ukur tiap tahap**. Contoh funnel penjualan online:

| Tahap             | Jumlah | Konversi ke tahap berikut |
|-------------------|--------|---------------------------|
| Kunjungan         | 10000  | —                         |
| Tambah ke keranjang | 2000 | 20%                       |
| Mulai checkout    | 800    | 40%                       |
| **Bayar (selesai)** | 240  | **30%** ← titik terlemah  |

**Insight dari data:** penurunan terbesar di tahap checkout → bayar (hanya 30% lanjut). **Bottleneck** ada di halaman pembayaran — di situlah fokus perbaikan.

## 2. Root Cause Analysis (5 Whys)

> Bayar rendah → *mengapa?* Banyak batal di halaman bayar → *mengapa?* Loading lambat → *mengapa?* Gambar terlalu besar → *mengapa?* Tak ada kompresi → *mengapa?* Belum ada standar upload. **← akar masalah**

Alat lain: **Fishbone (Ishikawa)** — kelompokkan penyebab ke Man, Machine, Method, Material, Measurement, Environment.

## 3. Problem Statement (Rumusan Masalah)

**Formula:** *[Metrik] [berubah berapa] sejak [kapan], pada [segmen], menyebabkan [dampak].*

| ❌ Lemah | ✅ Kuat |
|---|---|
| "Penjualan bermasalah." | "Konversi checkout turun 4,2% → 2,8% sejak Maret 2026 pada pengguna mobile, potensi kehilangan ~Rp450 juta/bulan." |

## Kesimpulan Utama
- Petakan proses & ukur tiap tahap untuk menemukan bottleneck.
- 5 Whys / Fishbone memisahkan gejala dari akar masalah.
- Problem statement harus spesifik, terukur, & menyebut dampak bisnis.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Wednesday, 22 July 2026 · 19.30 WIB

# Session 10 — BNSP Prep: Identifying Business Process

The **BNSP** exam expects you to think like a business problem-solver. This session drills: understanding business processes, finding root causes, and framing the problem.

## 1. Business Process & Finding the Bottleneck

Map the process and **measure each stage**. Example online-sales funnel:

| Stage             | Count | Conversion to next |
|-------------------|-------|--------------------|
| Visits            | 10000 | —                  |
| Add to cart       | 2000  | 20%                |
| Start checkout    | 800   | 40%                |
| **Pay (complete)**| 240   | **30%** ← weakest  |

**Insight from the data:** the biggest drop is checkout → pay (only 30% continue). The **bottleneck** is the payment page — that's where to focus fixes.

## 2. Root Cause Analysis (5 Whys)

> Payments low → *why?* Many abandon the payment page → *why?* Slow loading → *why?* Images too large → *why?* No compression → *why?* No upload standard. **← root cause**

Other tool: **Fishbone (Ishikawa)** — group causes into Man, Machine, Method, Material, Measurement, Environment.

## 3. Problem Statement

**Formula:** *[Metric] [changed how much] since [when], in [segment], causing [impact].*

| ❌ Weak | ✅ Strong |
|---|---|
| "Sales have a problem." | "Checkout conversion fell 4.2% → 2.8% since March 2026 on mobile users, ~Rp450M/month potential lost revenue." |

## Key Takeaways
- Map the process & measure each stage to find the bottleneck.
- 5 Whys / Fishbone separate symptoms from root causes.
- A problem statement must be specific, measurable & state business impact.
$da_en$
WHERE session_number = 'F10';

-- ── F11 — BNSP Prep: Portfolio Mentoring (with data tables) ──
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Batch Juli 2026):** Kamis, 23 Juli 2026 · 19.30 WIB

# Sesi 11 — Kelas Persiapan BNSP: Mentoring Portofolio

Sesi terakhir sebelum ujian. Fokus: menyusun **laporan analisis data** yang meyakinkan dengan storytelling, lalu mematangkan portofolio bersama mentor.

## Struktur Laporan Standar

Latar Belakang → Rumusan Masalah → Sumber & Persiapan Data → Metodologi → **Hasil Analisis** → Insight → Rekomendasi → Kesimpulan.

## Contoh: Hasil Analisis (kasus retur tinggi)

Misal analisismu menyilangkan **jenis kemasan × status retur**:

| Jenis kemasan | Total kirim | Retur | % Retur |
|---------------|-------------|-------|---------|
| Bubble wrap   | 500         | 15    | 3%      |
| Kemasan baru  | 500         | 45    | **9%**  |

**Insight:** kemasan baru memicu retur 3× lipat. **Rekomendasi:** kembalikan bubble wrap untuk produk pecah-belah. **Dampak:** estimasi hemat ~Rp100 juta/bulan.

Inilah "so what" yang dicari asesor — angka → insight → rekomendasi → dampak.

## Checklist Pra-Ujian
- [ ] Rumusan masalah jelas, terukur, berbasis data.
- [ ] Pembersihan data terdokumentasi & dapat direplikasi.
- [ ] Visual benar (chart tepat, sumbu mulai nol, berlabel).
- [ ] Insight terhubung langsung ke rumusan masalah.
- [ ] Rekomendasi spesifik & dapat ditindaklanjuti.

## Contoh Pertanyaan Asesor & Jawaban
- *"Kenapa median, bukan mean?"* → "Ada outlier grosir yang membuat mean bias; median lebih mewakili transaksi tipikal."
- *"Bagaimana memastikan data bersih?"* → "Cek duplikat `order_id`, `TRIM` kolom teks, validasi tanggal — terdokumentasi."

## Kesimpulan Utama
- Laporan mengikuti struktur baku dari masalah hingga rekomendasi.
- Tunjukkan hasil sebagai tabel/angka, lalu tarik insight & rekomendasi.
- Siap menjelaskan setiap keputusan analisis kepada asesor BNSP.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Thursday, 23 July 2026 · 19.30 WIB

# Session 11 — BNSP Prep: Portfolio Mentoring

The final session before the exam. Focus: building a convincing **data analysis report** with storytelling, then polishing the portfolio with a mentor.

## Standard Report Structure

Background → Problem Statement → Data Sources & Prep → Methodology → **Analysis Results** → Insight → Recommendations → Conclusion.

## Example: Analysis Results (high-return case)

Say your analysis crosses **packaging type × return status**:

| Packaging type | Total shipped | Returns | % Return |
|----------------|---------------|---------|----------|
| Bubble wrap    | 500           | 15      | 3%       |
| New packaging  | 500           | 45      | **9%**   |

**Insight:** the new packaging triggers 3× the returns. **Recommendation:** restore bubble wrap for fragile products. **Impact:** estimated ~Rp100M/month savings.

This is the "so what" assessors look for — numbers → insight → recommendation → impact.

## Pre-Exam Checklist
- [ ] Problem statement clear, measurable, data-based.
- [ ] Data cleaning documented & reproducible.
- [ ] Visuals correct (right chart, axis starts at zero, labeled).
- [ ] Insights connect directly to the problem statement.
- [ ] Recommendations specific & actionable.

## Sample Assessor Questions & Answers
- *"Why the median, not the mean?"* → "A wholesale outlier biases the mean; the median better represents the typical transaction."
- *"How did you ensure clean data?"* → "Checked `order_id` duplicates, `TRIM`med text columns, validated dates — documented."

## Key Takeaways
- The report follows a standard structure from problem to recommendation.
- Show results as tables/numbers, then draw insight & recommendation.
- Be ready to justify every analytical decision to the BNSP assessor.
$da_en$
WHERE session_number = 'F11';
