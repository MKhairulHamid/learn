-- Migration 009: Expand session content for sessions 05-06

UPDATE sessions SET
  content_en = $en05$
# Session 05 — SQL Aggregation: GROUP BY, HAVING, and JOINs

## Aggregate Functions: Summarizing Your Data

So far you have been retrieving individual rows. But most business questions require summaries: "How many orders did we get last month?" "What is the average order value?" "Which product category generates the most revenue?"

**Aggregate functions** take a group of rows and return a single value. They collapse many rows into one summary number.

### COUNT — How Many Rows?

```sql
-- How many customers do we have?
SELECT COUNT(*) AS total_customers
FROM customers;

-- How many customers provided their phone number?
SELECT COUNT(phone) AS customers_with_phone
FROM customers;
-- COUNT(column_name) ignores NULLs — it only counts rows where that column has a value
-- COUNT(*) counts ALL rows regardless of NULLs

-- How many unique cities do our customers come from?
SELECT COUNT(DISTINCT city) AS unique_cities
FROM customers;
```

### SUM — Total of a Numeric Column

```sql
-- What is our total revenue from all orders?
SELECT SUM(total_price) AS total_revenue
FROM orders;

-- Total quantity sold for product 101
SELECT SUM(quantity) AS units_sold
FROM orders
WHERE product_id = 101;
```

### AVG — Average Value

```sql
-- What is the average order value?
SELECT AVG(total_price) AS avg_order_value
FROM orders;
```

**Remember from Session 03:** AVG can be misleading if there are extreme outliers. Also look at the distribution.

### MIN and MAX — Smallest and Largest

```sql
-- What is the cheapest and most expensive product?
SELECT
    MIN(price) AS cheapest_price,
    MAX(price) AS most_expensive_price
FROM products;

-- When was our first and most recent order?
SELECT
    MIN(order_date) AS first_order_date,
    MAX(order_date) AS latest_order_date
FROM orders;
```

---

## GROUP BY: The "Sort into Piles" Concept

Using aggregate functions without GROUP BY gives you one summary number for the whole table. Most of the time, you want summaries *per category* — per city, per product, per month.

**Analogy:** Imagine you have 1,000 paper receipts from a year of sales scattered on a table. You could:
1. Count all of them → `COUNT(*)` without GROUP BY
2. Sort them into piles by product category, then count each pile → `COUNT(*) GROUP BY category`

GROUP BY sorts the rows into groups and applies the aggregate function to each group separately.

### Basic GROUP BY Example

```sql
-- How many customers do we have per city?
SELECT
    city,
    COUNT(*) AS customer_count
FROM customers
GROUP BY city
ORDER BY customer_count DESC;
```

Result:
| city | customer_count |
|---|---|
| Jakarta | 3,420 |
| Surabaya | 1,890 |
| Bandung | 1,205 |
| Medan | 876 |

### GROUP BY with SUM

```sql
-- Total revenue per product category
SELECT
    p.category,
    SUM(o.total_price) AS total_revenue,
    COUNT(o.order_id) AS order_count
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY p.category
ORDER BY total_revenue DESC;
```

### Multiple GROUP BY Columns

You can group by more than one column. The result will have one row for each unique *combination* of the grouped columns.

```sql
-- Revenue per city per month
SELECT
    c.city,
    DATE_TRUNC('month', o.order_date) AS month,
    SUM(o.total_price) AS monthly_revenue
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.city, DATE_TRUNC('month', o.order_date)
ORDER BY c.city, month;
```

### The Golden Rule of GROUP BY

**Every column in your SELECT clause must either be:**
1. In the GROUP BY clause, OR
2. Inside an aggregate function (SUM, COUNT, AVG, MIN, MAX)

This confuses nearly every beginner. Think about why: if you are grouping 1,000 orders into 5 city groups, and you want to show the city and the total revenue, that makes sense — one city name, one total. But if you tried to also show `order_id`, which order ID would you show? The first one? The last one? There is no meaningful single answer, so SQL refuses.

```sql
-- WRONG: order_id is not in GROUP BY and not in an aggregate
SELECT city, order_id, COUNT(*)
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY city;

-- RIGHT:
SELECT city, COUNT(*) AS order_count
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY city;
```

---

## WHERE vs HAVING: The Difference That Confuses Everyone

Both WHERE and HAVING filter data. The critical difference is **when** they filter.

| | WHERE | HAVING |
|---|---|---|
| **Filters** | Individual rows (before grouping) | Groups (after grouping) |
| **When it runs** | Before GROUP BY | After GROUP BY |
| **Can use aggregates?** | NO | YES |

**Analogy:** You are sorting receipts into city piles again.
- `WHERE` is a rule you apply **before** sorting: "Only sort receipts from 2024." You remove the non-2024 receipts from the table first.
- `HAVING` is a rule you apply **after** sorting: "Only show me city piles that have more than 100 receipts." You sort everything first, then discard small piles.

### WHERE Example (filter rows before grouping)

```sql
-- Revenue per city, but only for orders in 2024
SELECT
    c.city,
    SUM(o.total_price) AS total_revenue
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE EXTRACT(YEAR FROM o.order_date) = 2024  -- filter BEFORE grouping
GROUP BY c.city
ORDER BY total_revenue DESC;
```

### HAVING Example (filter groups after grouping)

```sql
-- Only show cities where total revenue exceeds Rp 100 million
SELECT
    c.city,
    SUM(o.total_price) AS total_revenue
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.city
HAVING SUM(o.total_price) > 100000000  -- filter AFTER grouping
ORDER BY total_revenue DESC;
```

### Using Both Together

```sql
-- 2024 orders only, grouped by city, only cities with > 500 orders
SELECT
    c.city,
    COUNT(o.order_id) AS order_count,
    SUM(o.total_price) AS total_revenue
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE EXTRACT(YEAR FROM o.order_date) = 2024   -- WHERE: filter rows first
GROUP BY c.city
HAVING COUNT(o.order_id) > 500                 -- HAVING: filter groups after
ORDER BY order_count DESC;
```

---

## What Is a JOIN? (The "Merge Two Spreadsheets" Analogy)

Remember our three tables: customers, products, orders. The orders table only stores `customer_id` and `product_id`. To answer the question "Which customer from Surabaya spent the most last month?", you need data from both the orders table AND the customers table.

**Analogy:** You have two Excel sheets with customer information. Sheet 1 has customer ID, name, and city. Sheet 2 has order ID, customer ID, and revenue. You want to combine them into one view using the shared customer ID column. In Excel, you would use VLOOKUP. In SQL, you use JOIN.

A JOIN combines rows from two (or more) tables based on a related column — usually a foreign key matching a primary key.

### INNER JOIN: Only Rows That Match in Both Tables

```sql
SELECT
    c.name,
    c.city,
    o.order_id,
    o.total_price,
    o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.total_price DESC;
```

`ON o.customer_id = c.customer_id` is the **join condition** — the column that links the two tables.

INNER JOIN only returns rows where a match exists in BOTH tables. If an order exists with a customer_id that has no matching record in the customers table (data quality issue!), that order is excluded from results.

### LEFT JOIN: All Rows from the Left Table, Matching Rows from the Right

```sql
SELECT
    c.name,
    c.city,
    c.registration_date,
    COUNT(o.order_id) AS total_orders,
    SUM(o.total_price) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.city, c.registration_date
ORDER BY total_spent DESC NULLS LAST;
```

LEFT JOIN returns ALL customers, even those who have never placed an order. For customers with no orders, the order columns (total_orders, total_spent) will be NULL.

**Why LEFT JOIN is the most used JOIN:** In business analysis, you almost always want the complete picture. "Show me all customers and their order count" — you want to see customers with 0 orders too, not just the ones who have ordered.

### RIGHT JOIN: All Rows from the Right Table (Rarely Used)

RIGHT JOIN is the mirror image of LEFT JOIN. It returns all rows from the right table and matching rows from the left.

In practice, most analysts rewrite RIGHT JOINs as LEFT JOINs by flipping the table order — it is more readable.

```sql
-- These two queries return the same result:
SELECT * FROM orders o RIGHT JOIN customers c ON o.customer_id = c.customer_id;
SELECT * FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;
```

### FULL OUTER JOIN: All Rows from Both Tables

Returns all rows from both tables, with NULLs where there is no match. Used less commonly, mainly for data reconciliation.

### Visual Summary of JOIN Types

```
Table A: customers     Table B: orders
[A ∩ B] = customers who have placed orders

INNER JOIN = only A ∩ B (customers with orders)
LEFT JOIN  = all of A + A ∩ B (all customers, order data if it exists)
RIGHT JOIN = all of B + A ∩ B (all orders, customer data if it exists)
FULL JOIN  = all of A + all of B (everything)
```

---

## Joining 3+ Tables

Real queries often join many tables. Each JOIN adds one more table.

```sql
-- Order details with customer name, product name, and category
SELECT
    o.order_id,
    o.order_date,
    c.name AS customer_name,
    c.city,
    p.product_name,
    p.category,
    o.quantity,
    o.total_price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.order_date DESC
LIMIT 100;
```

---

## Subqueries: A Query Inside a Query

A **subquery** is a SELECT statement nested inside another SQL statement. Think of it as using the result of one query as input to another.

```sql
-- Find all customers who have spent more than the average customer spending
SELECT
    c.name,
    c.city,
    SUM(o.total_price) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.city
HAVING SUM(o.total_price) > (
    SELECT AVG(customer_total)
    FROM (
        SELECT customer_id, SUM(total_price) AS customer_total
        FROM orders
        GROUP BY customer_id
    ) customer_totals
);
```

Subqueries can get complex quickly. That is why CTEs exist.

---

## CTEs (WITH Clause): Making Complex Queries Readable

A **CTE** (Common Table Expression) is a temporary named result set that you define at the top of your query and then reference like a table. It makes complex queries far more readable by breaking them into named steps.

**Without CTE (hard to read):**

```sql
SELECT name, city, total_spent
FROM (
    SELECT c.customer_id, c.name, c.city, SUM(o.total_price) AS total_spent
    FROM customers c JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.name, c.city
) customer_summary
WHERE total_spent > 5000000
ORDER BY total_spent DESC;
```

**With CTE (much clearer):**

```sql
WITH customer_summary AS (
    SELECT
        c.customer_id,
        c.name,
        c.city,
        SUM(o.total_price) AS total_spent
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.name, c.city
)
SELECT name, city, total_spent
FROM customer_summary
WHERE total_spent > 5000000
ORDER BY total_spent DESC;
```

You can define multiple CTEs separated by commas:

```sql
WITH
monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(total_price) AS revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
),
monthly_avg AS (
    SELECT AVG(revenue) AS avg_monthly_revenue
    FROM monthly_revenue
)
SELECT
    mr.month,
    mr.revenue,
    ma.avg_monthly_revenue,
    mr.revenue - ma.avg_monthly_revenue AS difference_from_avg
FROM monthly_revenue mr
CROSS JOIN monthly_avg ma
ORDER BY mr.month;
```

---

## 5 Query Patterns Every Analyst Uses Daily

### Pattern 1: Ranked Top-N Per Category

"Show me the top 3 products by revenue in each category."

```sql
WITH product_revenue AS (
    SELECT
        p.category,
        p.product_name,
        SUM(o.total_price) AS revenue,
        RANK() OVER (PARTITION BY p.category ORDER BY SUM(o.total_price) DESC) AS rank
    FROM orders o
    JOIN products p ON o.product_id = p.product_id
    GROUP BY p.category, p.product_name
)
SELECT category, product_name, revenue
FROM product_revenue
WHERE rank <= 3
ORDER BY category, rank;
```

### Pattern 2: Month-over-Month Growth

```sql
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(total_price) AS revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY month)) /
        LAG(revenue) OVER (ORDER BY month) * 100, 2
    ) AS mom_growth_pct
FROM monthly
ORDER BY month;
```

### Pattern 3: Customer Cohort Size

```sql
-- How many new customers joined each month?
SELECT
    DATE_TRUNC('month', registration_date) AS cohort_month,
    COUNT(*) AS new_customers
FROM customers
GROUP BY DATE_TRUNC('month', registration_date)
ORDER BY cohort_month;
```

### Pattern 4: Customers Who Have Not Ordered Recently

```sql
-- Customers who registered more than 30 days ago but never ordered
SELECT
    c.customer_id,
    c.name,
    c.email,
    c.registration_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL
  AND c.registration_date < CURRENT_DATE - INTERVAL '30 days'
ORDER BY c.registration_date;
```

The trick: after a LEFT JOIN, rows where the right table has no match will have NULL for the right table's columns. Filtering `WHERE o.order_id IS NULL` finds customers with no matching orders.

### Pattern 5: Percentage of Total

```sql
-- Each category's share of total revenue
SELECT
    category,
    SUM(o.total_price) AS category_revenue,
    SUM(SUM(o.total_price)) OVER () AS grand_total,
    ROUND(
        SUM(o.total_price) / SUM(SUM(o.total_price)) OVER () * 100, 2
    ) AS pct_of_total
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY category
ORDER BY category_revenue DESC;
```

---

## Key Takeaways

- Aggregate functions (COUNT, SUM, AVG, MIN, MAX) collapse many rows into summary values.
- GROUP BY splits data into groups; the aggregate applies to each group separately.
- Every SELECT column must be either in GROUP BY or inside an aggregate function.
- WHERE filters rows BEFORE grouping. HAVING filters groups AFTER grouping.
- JOINs combine tables using a shared column (the foreign key / primary key relationship).
- INNER JOIN: only matched rows. LEFT JOIN: all from the left, matched from the right.
- CTEs (WITH clause) break complex queries into readable, named steps.

**Next session:** Advanced SQL — Window Functions, the superpower of analytical SQL.
$en05$,
  content_id = $id05$
# Sesi 05 — Agregasi SQL: GROUP BY, HAVING, dan JOIN

## Fungsi Agregat: Merangkum Data

Sejauh ini kamu telah mengambil baris individual. Tapi kebanyakan pertanyaan bisnis membutuhkan ringkasan: "Berapa pesanan yang kami terima bulan lalu?" "Berapa nilai pesanan rata-rata?" "Kategori produk mana yang menghasilkan pendapatan terbanyak?"

**Fungsi agregat** mengambil sekelompok baris dan mengembalikan satu nilai. Mereka merangkum banyak baris menjadi satu angka ringkasan.

### COUNT — Berapa Banyak Baris?

```sql
-- Berapa banyak pelanggan yang kita miliki?
SELECT COUNT(*) AS total_pelanggan
FROM customers;

-- Berapa banyak pelanggan yang memberikan nomor telepon?
SELECT COUNT(phone) AS pelanggan_dengan_telepon
FROM customers;
-- COUNT(nama_kolom) mengabaikan NULL — hanya menghitung baris yang kolom itu punya nilai
-- COUNT(*) menghitung SEMUA baris terlepas dari NULL

-- Berapa kota unik dari pelanggan kita?
SELECT COUNT(DISTINCT city) AS kota_unik
FROM customers;
```

### SUM — Total Kolom Numerik

```sql
-- Berapa total pendapatan dari semua pesanan?
SELECT SUM(total_price) AS total_pendapatan
FROM orders;
```

### AVG — Nilai Rata-rata

```sql
-- Berapa nilai pesanan rata-rata?
SELECT AVG(total_price) AS nilai_pesanan_rata
FROM orders;
```

**Ingat dari Sesi 03:** AVG bisa menyesatkan jika ada outlier ekstrem.

### MIN dan MAX — Terkecil dan Terbesar

```sql
-- Apa produk termurah dan termahal?
SELECT
    MIN(price) AS harga_termurah,
    MAX(price) AS harga_termahal
FROM products;

-- Kapan pesanan pertama dan terbaru kami?
SELECT
    MIN(order_date) AS tanggal_pesanan_pertama,
    MAX(order_date) AS tanggal_pesanan_terbaru
FROM orders;
```

---

## GROUP BY: Konsep "Sortir ke dalam Tumpukan"

Menggunakan fungsi agregat tanpa GROUP BY memberikan satu angka ringkasan untuk seluruh tabel. Sebagian besar waktu, kamu ingin ringkasan *per kategori* — per kota, per produk, per bulan.

**Analogi:** Bayangkan kamu punya 1.000 struk kertas dari setahun penjualan berserakan di meja. Kamu bisa:
1. Hitung semuanya → `COUNT(*)` tanpa GROUP BY
2. Sortir ke dalam tumpukan per kategori produk, lalu hitung setiap tumpukan → `COUNT(*) GROUP BY category`

GROUP BY menyortir baris ke dalam kelompok dan menerapkan fungsi agregat ke setiap kelompok secara terpisah.

### Contoh GROUP BY Dasar

```sql
-- Berapa banyak pelanggan yang kita miliki per kota?
SELECT
    city,
    COUNT(*) AS jumlah_pelanggan
FROM customers
GROUP BY city
ORDER BY jumlah_pelanggan DESC;
```

### GROUP BY dengan SUM

```sql
-- Total pendapatan per kategori produk
SELECT
    p.category,
    SUM(o.total_price) AS total_pendapatan,
    COUNT(o.order_id) AS jumlah_pesanan
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY p.category
ORDER BY total_pendapatan DESC;
```

### GROUP BY dengan Beberapa Kolom

```sql
-- Pendapatan per kota per bulan
SELECT
    c.city,
    DATE_TRUNC('month', o.order_date) AS bulan,
    SUM(o.total_price) AS pendapatan_bulanan
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.city, DATE_TRUNC('month', o.order_date)
ORDER BY c.city, bulan;
```

### Aturan Emas GROUP BY

**Setiap kolom di klausa SELECT harus:**
1. Ada di klausa GROUP BY, ATAU
2. Di dalam fungsi agregat (SUM, COUNT, AVG, MIN, MAX)

Ini membingungkan hampir setiap pemula. Pikirkan kenapa: jika kamu mengelompokkan 1.000 pesanan ke dalam 5 kelompok kota, dan kamu ingin menampilkan kota dan total pendapatan, itu masuk akal. Tapi jika kamu mencoba juga menampilkan `order_id`, order ID mana yang akan ditampilkan? Tidak ada jawaban tunggal yang bermakna.

---

## WHERE vs HAVING: Perbedaan yang Membingungkan Semua Orang

Keduanya memfilter data. Perbedaan kritisnya adalah **kapan** mereka memfilter.

| | WHERE | HAVING |
|---|---|---|
| **Memfilter** | Baris individual (sebelum pengelompokan) | Kelompok (setelah pengelompokan) |
| **Kapan berjalan** | Sebelum GROUP BY | Setelah GROUP BY |
| **Bisa pakai agregat?** | TIDAK | YA |

**Analogi:** Kamu menyortir struk ke dalam tumpukan kota lagi.
- `WHERE` adalah aturan yang kamu terapkan **sebelum** menyortir: "Hanya sortir struk dari 2024."
- `HAVING` adalah aturan yang kamu terapkan **setelah** menyortir: "Hanya tunjukkan tumpukan kota yang punya lebih dari 100 struk."

### Contoh WHERE (filter baris sebelum pengelompokan)

```sql
-- Pendapatan per kota, tapi hanya untuk pesanan di 2024
SELECT
    c.city,
    SUM(o.total_price) AS total_pendapatan
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE EXTRACT(YEAR FROM o.order_date) = 2024  -- filter SEBELUM pengelompokan
GROUP BY c.city
ORDER BY total_pendapatan DESC;
```

### Contoh HAVING (filter kelompok setelah pengelompokan)

```sql
-- Hanya tampilkan kota dengan total pendapatan di atas Rp 100 juta
SELECT
    c.city,
    SUM(o.total_price) AS total_pendapatan
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.city
HAVING SUM(o.total_price) > 100000000  -- filter SETELAH pengelompokan
ORDER BY total_pendapatan DESC;
```

---

## Apa Itu JOIN? (Analogi "Gabungkan Dua Spreadsheet")

**Analogi:** Kamu punya dua sheet Excel dengan informasi pelanggan. Sheet 1 punya ID pelanggan, nama, dan kota. Sheet 2 punya ID pesanan, ID pelanggan, dan pendapatan. Kamu ingin menggabungkan keduanya menggunakan kolom ID pelanggan bersama. Di Excel, kamu pakai VLOOKUP. Di SQL, kamu pakai JOIN.

JOIN menggabungkan baris dari dua (atau lebih) tabel berdasarkan kolom yang saling berhubungan.

### INNER JOIN: Hanya Baris yang Cocok di Kedua Tabel

```sql
SELECT
    c.name,
    c.city,
    o.order_id,
    o.total_price,
    o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.total_price DESC;
```

INNER JOIN hanya mengembalikan baris di mana kecocokan ada di KEDUA tabel.

### LEFT JOIN: Semua Baris dari Tabel Kiri, Baris yang Cocok dari Kanan

```sql
SELECT
    c.name,
    c.city,
    c.registration_date,
    COUNT(o.order_id) AS total_pesanan,
    SUM(o.total_price) AS total_dibelanjakan
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.city, c.registration_date
ORDER BY total_dibelanjakan DESC NULLS LAST;
```

LEFT JOIN mengembalikan SEMUA pelanggan, bahkan yang belum pernah memesan. Untuk pelanggan tanpa pesanan, kolom pesanan akan NULL.

**Kenapa LEFT JOIN adalah JOIN yang paling sering digunakan:** Dalam analisis bisnis, kamu hampir selalu ingin gambaran lengkap. "Tunjukkan semua pelanggan dan jumlah pesanan mereka" — kamu ingin melihat pelanggan dengan 0 pesanan juga.

### Ringkasan Visual Jenis JOIN

```
Tabel A: customers     Tabel B: orders
[A ∩ B] = pelanggan yang sudah memesan

INNER JOIN = hanya A ∩ B (pelanggan dengan pesanan)
LEFT JOIN  = semua A + A ∩ B (semua pelanggan, data pesanan jika ada)
RIGHT JOIN = semua B + A ∩ B (semua pesanan, data pelanggan jika ada)
FULL JOIN  = semua A + semua B (segalanya)
```

---

## JOIN 3+ Tabel

```sql
-- Detail pesanan dengan nama pelanggan, nama produk, dan kategori
SELECT
    o.order_id,
    o.order_date,
    c.name AS nama_pelanggan,
    c.city,
    p.product_name,
    p.category,
    o.quantity,
    o.total_price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.order_date DESC
LIMIT 100;
```

---

## CTE (Klausa WITH): Membuat Query Kompleks Mudah Dibaca

**CTE** (Common Table Expression) adalah result set sementara yang diberi nama yang kamu definisikan di awal query dan kemudian direferensikan seperti tabel.

**Tanpa CTE (sulit dibaca):**

```sql
SELECT name, city, total_dibelanjakan
FROM (
    SELECT c.customer_id, c.name, c.city, SUM(o.total_price) AS total_dibelanjakan
    FROM customers c JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.name, c.city
) ringkasan_pelanggan
WHERE total_dibelanjakan > 5000000
ORDER BY total_dibelanjakan DESC;
```

**Dengan CTE (jauh lebih jelas):**

```sql
WITH ringkasan_pelanggan AS (
    SELECT
        c.customer_id,
        c.name,
        c.city,
        SUM(o.total_price) AS total_dibelanjakan
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.name, c.city
)
SELECT name, city, total_dibelanjakan
FROM ringkasan_pelanggan
WHERE total_dibelanjakan > 5000000
ORDER BY total_dibelanjakan DESC;
```

---

## 5 Pola Query yang Digunakan Setiap Analyst Setiap Hari

### Pola 1: Pelanggan yang Belum Pernah Memesan

```sql
SELECT
    c.customer_id,
    c.name,
    c.email,
    c.registration_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL
  AND c.registration_date < CURRENT_DATE - INTERVAL '30 days'
ORDER BY c.registration_date;
```

### Pola 2: Pendapatan Bulanan

```sql
SELECT
    DATE_TRUNC('month', order_date) AS bulan,
    COUNT(order_id) AS jumlah_pesanan,
    SUM(total_price) AS total_pendapatan,
    AVG(total_price) AS nilai_pesanan_rata
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY bulan;
```

### Pola 3: Top 10 Pelanggan berdasarkan Pengeluaran

```sql
SELECT
    c.name,
    c.city,
    COUNT(o.order_id) AS jumlah_pesanan,
    SUM(o.total_price) AS total_dibelanjakan
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name, c.city
ORDER BY total_dibelanjakan DESC
LIMIT 10;
```

### Pola 4: Persentase Pendapatan per Kategori

```sql
SELECT
    p.category,
    SUM(o.total_price) AS pendapatan_kategori,
    ROUND(
        SUM(o.total_price) * 100.0 / SUM(SUM(o.total_price)) OVER (), 2
    ) AS pct_dari_total
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY p.category
ORDER BY pendapatan_kategori DESC;
```

### Pola 5: Produk yang Belum Pernah Dipesan

```sql
SELECT
    p.product_id,
    p.product_name,
    p.category,
    p.price
FROM products p
LEFT JOIN orders o ON p.product_id = o.product_id
WHERE o.order_id IS NULL
ORDER BY p.category, p.product_name;
```

---

## Kesimpulan Utama

- Fungsi agregat (COUNT, SUM, AVG, MIN, MAX) merangkum banyak baris menjadi nilai ringkasan.
- GROUP BY membagi data ke dalam kelompok; agregat diterapkan ke setiap kelompok secara terpisah.
- Setiap kolom SELECT harus ada di GROUP BY atau di dalam fungsi agregat.
- WHERE memfilter baris SEBELUM pengelompokan. HAVING memfilter kelompok SETELAH pengelompokan.
- JOIN menggabungkan tabel menggunakan kolom bersama.
- INNER JOIN: hanya baris yang cocok. LEFT JOIN: semua dari kiri, yang cocok dari kanan.
- CTE (klausa WITH) memecah query kompleks menjadi langkah-langkah bernama yang mudah dibaca.

**Sesi berikutnya:** SQL Lanjutan — Window Functions, superpower SQL analitik.
$id05$
WHERE session_number = '05';

UPDATE sessions SET
  content_en = $en06$
# Session 06 — Advanced SQL: Window Functions

## The Problem Window Functions Solve

Let us start with a common analytics task: "Show me each order, along with the customer's total spending across all their orders."

With what you know so far, you might try:

```sql
SELECT
    customer_id,
    order_id,
    total_price,
    SUM(total_price) AS customer_total  -- this won't work!
FROM orders
GROUP BY customer_id;
```

This fails. GROUP BY collapses all of a customer's orders into one row, so you lose the individual order detail. You cannot have both "one row per order" and "sum across all orders" at the same time with GROUP BY.

**Window functions solve this problem.** They let you perform calculations across a set of related rows while keeping each individual row in the result. They "look through a window" at a set of rows without collapsing them.

```sql
-- This works perfectly with a window function:
SELECT
    customer_id,
    order_id,
    total_price,
    SUM(total_price) OVER (PARTITION BY customer_id) AS customer_total
FROM orders;
```

Result: every order row is preserved, AND you get the customer's total alongside each order.

| customer_id | order_id | total_price | customer_total |
|---|---|---|---|
| 1 | 5001 | 180,000 | 580,000 |
| 1 | 5007 | 400,000 | 580,000 |
| 2 | 5002 | 125,000 | 125,000 |

---

## Anatomy of a Window Function

```sql
function_name(column) OVER (
    PARTITION BY partition_column
    ORDER BY order_column
    ROWS BETWEEN frame_start AND frame_end
)
```

### OVER() — The Magic Keyword

`OVER()` is what makes a function a window function. Without it, `SUM()` is an aggregate that collapses rows. With `OVER()`, it becomes a window function that does not collapse rows.

An empty `OVER()` means: "apply this function across the entire result set as the window."

```sql
-- Sum across all rows (grand total alongside each row)
SELECT order_id, total_price, SUM(total_price) OVER () AS grand_total
FROM orders;
```

### PARTITION BY — Defining Sub-Windows

`PARTITION BY` divides the rows into groups (partitions) and applies the window function independently within each partition. Think of it as GROUP BY for window functions — but without collapsing rows.

```sql
-- Each row shows its total_price AND the max price in its category
SELECT
    product_name,
    category,
    price,
    MAX(price) OVER (PARTITION BY category) AS max_price_in_category
FROM products;
```

### ORDER BY Inside OVER — Defining Computation Order

When you add `ORDER BY` inside `OVER()`, the window function computes cumulatively as it moves through the sorted rows.

```sql
-- Running total of revenue, ordered by date
SELECT
    order_date,
    total_price,
    SUM(total_price) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

### ROWS BETWEEN — The Window Frame

The window frame defines exactly which rows the function considers when computing for each row.

Common frames:
- `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — from the first row to the current row (default for running totals)
- `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` — the last 7 rows (a 7-day moving average)
- `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` — all rows in the partition

---

## ROW_NUMBER(): Assign Unique Sequential Numbers

`ROW_NUMBER()` assigns a unique integer to each row, starting from 1. It takes no column argument.

```sql
SELECT
    ROW_NUMBER() OVER (ORDER BY order_date) AS row_num,
    order_id,
    customer_id,
    order_date,
    total_price
FROM orders
ORDER BY order_date;
```

### Use Case 1: Deduplication

If you have duplicate rows (same customer_id appearing twice due to a data quality issue), you can use ROW_NUMBER() to flag and remove duplicates:

```sql
WITH ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id
            ORDER BY registration_date
        ) AS rn
    FROM customers
)
-- Keep only the first occurrence of each customer_id
SELECT * FROM ranked WHERE rn = 1;
```

This is one of the most commonly used patterns in data cleaning.

### Use Case 2: Top N Per Group (Most Important Pattern)

"Show me the top 3 customers by spending in each city."

```sql
WITH customer_spending AS (
    SELECT
        c.customer_id,
        c.name,
        c.city,
        SUM(o.total_price) AS total_spent
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.name, c.city
),
ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY total_spent DESC
        ) AS city_rank
    FROM customer_spending
)
SELECT city, city_rank, name, total_spent
FROM ranked
WHERE city_rank <= 3
ORDER BY city, city_rank;
```

This pattern — CTE to compute the metric, window function to rank within group, filter on rank — is one of the most useful in analytics.

---

## RANK() vs DENSE_RANK(): When Ties Matter

Both assign rankings, but they handle ties differently.

**Sports leaderboard analogy:**

Imagine a 100m sprint race with these times:
- Athlete A: 9.8s
- Athlete B: 9.9s
- Athlete C: 9.9s (tie with B)
- Athlete D: 10.1s

| Athlete | Time | RANK() | DENSE_RANK() |
|---|---|---|---|
| A | 9.8s | 1 | 1 |
| B | 9.9s | 2 | 2 |
| C | 9.9s | 2 | 2 |
| D | 10.1s | 4 | 3 |

**RANK():** After the tie at position 2, the next rank is 4 (skips 3). There is "no one in 3rd place."

**DENSE_RANK():** After the tie at position 2, the next rank is 3 (no gaps). "There is a 3rd place."

```sql
SELECT
    product_name,
    revenue,
    RANK() OVER (ORDER BY revenue DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY revenue DESC) AS dense_rank
FROM product_revenue_summary;
```

**When to use which:**
- Use `RANK()` when gaps are meaningful (competition standings where tied positions genuinely skip the next rank)
- Use `DENSE_RANK()` when you want continuous numbering despite ties (e.g., "show top 10 products" where tied products should both count as being in their position, not skip)
- Use `ROW_NUMBER()` when you need unique numbers and ties do not matter (deduplication, pagination)

---

## LAG() and LEAD(): Looking at Adjacent Rows

`LAG()` retrieves the value from the **previous** row. `LEAD()` retrieves the value from the **next** row. This is invaluable for period-over-period comparisons.

### Month-over-Month Growth with LAG()

```sql
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(total_price) AS revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    revenue - LAG(revenue) OVER (ORDER BY month) AS revenue_change,
    ROUND(
        (revenue - LAG(revenue) OVER (ORDER BY month)) /
        LAG(revenue) OVER (ORDER BY month) * 100,
        2
    ) AS mom_growth_pct
FROM monthly_revenue
ORDER BY month;
```

The first month will have NULL for prev_month_revenue (there is no previous month).

### LAG() with an Offset and Default Value

```sql
-- Compare to 3 months ago, defaulting to 0 if no prior data
LAG(revenue, 3, 0) OVER (ORDER BY month) AS revenue_3_months_ago
```

`LAG(column, offset, default)` — offset is how many rows back, default is what to use when there is no prior row.

### LEAD() Example: Days Until Next Order

```sql
SELECT
    customer_id,
    order_id,
    order_date,
    LEAD(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS next_order_date,
    LEAD(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) - order_date AS days_to_next_order
FROM orders
ORDER BY customer_id, order_date;
```

---

## SUM() OVER(): Running Totals

A running total (also called cumulative sum) adds up values as you move through sorted rows — like a bank account balance.

```sql
SELECT
    order_date,
    order_id,
    total_price,
    SUM(total_price) OVER (ORDER BY order_date, order_id) AS running_revenue
FROM orders
ORDER BY order_date, order_id;
```

### Running Total Per Partition

```sql
-- Running total per customer (each customer's cumulative spending)
SELECT
    customer_id,
    order_date,
    total_price,
    SUM(total_price) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS cumulative_spent
FROM orders
ORDER BY customer_id, order_date;
```

---

## AVG() OVER(): Moving Averages

A moving average smooths out short-term fluctuations to show the underlying trend. It is widely used in revenue trend analysis and product analytics.

```sql
-- 7-day moving average of daily revenue
WITH daily_revenue AS (
    SELECT
        order_date,
        SUM(total_price) AS daily_revenue
    FROM orders
    GROUP BY order_date
)
SELECT
    order_date,
    daily_revenue,
    ROUND(
        AVG(daily_revenue) OVER (
            ORDER BY order_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ),
        0
    ) AS moving_avg_7day
FROM daily_revenue
ORDER BY order_date;
```

`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` means: for each row, average the current row and the 6 rows before it — a 7-row (7-day) window.

---

## NTILE(): Bucketing Into Equal Groups

`NTILE(n)` divides rows into `n` buckets of approximately equal size and assigns each row a bucket number (1 through n). Perfect for customer segmentation.

```sql
-- Segment customers into 4 spending quartiles
WITH customer_spending AS (
    SELECT
        customer_id,
        SUM(total_price) AS total_spent
    FROM orders
    GROUP BY customer_id
)
SELECT
    customer_id,
    total_spent,
    NTILE(4) OVER (ORDER BY total_spent) AS spending_quartile,
    CASE NTILE(4) OVER (ORDER BY total_spent)
        WHEN 1 THEN 'Low Spender'
        WHEN 2 THEN 'Mid Spender'
        WHEN 3 THEN 'High Spender'
        WHEN 4 THEN 'Top Spender'
    END AS segment
FROM customer_spending
ORDER BY total_spent DESC;
```

### Decile Segmentation (NTILE(10))

```sql
-- Divide customers into 10 deciles based on lifetime value
NTILE(10) OVER (ORDER BY total_spent) AS spending_decile
```

Decile 10 = top 10% spenders (your VIPs). Decile 1 = bottom 10% (at-risk of churning or lowest engagement).

---

## FIRST_VALUE() and LAST_VALUE()

`FIRST_VALUE()` returns the first value in the window frame. `LAST_VALUE()` returns the last.

```sql
-- For each order, show the customer's first-ever order date and most recent order date
SELECT
    customer_id,
    order_id,
    order_date,
    FIRST_VALUE(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS first_order_date,
    LAST_VALUE(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS last_order_date
FROM orders
ORDER BY customer_id, order_date;
```

**Important:** For `LAST_VALUE()`, always specify `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. Without it, the default frame only goes to the current row, so `LAST_VALUE()` would just return the current row's value (not useful).

---

## Real Business Use Cases

### Use Case 1: Top N Products Per Category (Most Requested)

```sql
WITH product_revenue AS (
    SELECT
        p.category,
        p.product_id,
        p.product_name,
        SUM(o.total_price) AS revenue
    FROM orders o
    JOIN products p ON o.product_id = p.product_id
    GROUP BY p.category, p.product_id, p.product_name
)
SELECT category, product_name, revenue
FROM (
    SELECT
        *,
        DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS rank_in_category
    FROM product_revenue
) ranked
WHERE rank_in_category <= 5
ORDER BY category, rank_in_category;
```

### Use Case 2: Customer Retention (Cohort Analysis)

```sql
-- For each customer cohort (month of first order), how many ordered again next month?
WITH first_orders AS (
    SELECT
        customer_id,
        MIN(DATE_TRUNC('month', order_date)) AS cohort_month
    FROM orders
    GROUP BY customer_id
),
customer_months AS (
    SELECT DISTINCT
        o.customer_id,
        DATE_TRUNC('month', o.order_date) AS order_month
    FROM orders o
),
cohort_data AS (
    SELECT
        f.cohort_month,
        cm.order_month,
        COUNT(DISTINCT cm.customer_id) AS active_customers,
        EXTRACT(MONTH FROM AGE(cm.order_month, f.cohort_month)) AS months_since_first_order
    FROM first_orders f
    JOIN customer_months cm ON f.customer_id = cm.customer_id
    GROUP BY f.cohort_month, cm.order_month
)
SELECT
    cohort_month,
    months_since_first_order,
    active_customers,
    FIRST_VALUE(active_customers) OVER (
        PARTITION BY cohort_month
        ORDER BY months_since_first_order
    ) AS cohort_size,
    ROUND(
        active_customers * 100.0 /
        FIRST_VALUE(active_customers) OVER (
            PARTITION BY cohort_month
            ORDER BY months_since_first_order
        ),
        1
    ) AS retention_pct
FROM cohort_data
ORDER BY cohort_month, months_since_first_order;
```

### Use Case 3: Period-over-Period Comparison (YoY Revenue)

```sql
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(total_price) AS revenue
    FROM orders
    GROUP BY 1
)
SELECT
    month,
    revenue,
    LAG(revenue, 12) OVER (ORDER BY month) AS same_month_last_year,
    ROUND(
        (revenue - LAG(revenue, 12) OVER (ORDER BY month)) /
        LAG(revenue, 12) OVER (ORDER BY month) * 100,
        1
    ) AS yoy_growth_pct
FROM monthly
ORDER BY month;
```

---

## Performance Tips

Window functions can be slow on large tables. Here are practical tips:

### Tip 1: Filter Before Windowing

Put your filters in a CTE before applying window functions. Do not apply window functions to millions of rows only to filter them afterward.

```sql
-- Better: filter first, then window
WITH recent_orders AS (
    SELECT * FROM orders WHERE order_date >= '2024-01-01'
)
SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
FROM recent_orders;
```

### Tip 2: Avoid Window Functions in WHERE Clauses

You cannot directly use window functions in WHERE. Use a subquery or CTE.

```sql
-- Wrong (will error):
SELECT * FROM orders WHERE ROW_NUMBER() OVER (ORDER BY order_date) <= 10;

-- Right:
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (ORDER BY order_date) AS rn FROM orders
) t WHERE rn <= 10;
```

### Tip 3: Ensure the PARTITION BY Column Is Indexed

Window functions with `PARTITION BY customer_id` benefit greatly from an index on `customer_id`. Discuss with your data engineer if queries are slow.

### Tip 4: Limit the Window Frame

Avoid `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` on large datasets unless necessary — it forces the database to scan all rows for each row's calculation.

---

## Key Takeaways

- Window functions compute across a set of related rows without collapsing them — unlike GROUP BY.
- `OVER()` is the keyword. `PARTITION BY` defines sub-groups. `ORDER BY` defines computation order. `ROWS BETWEEN` defines the frame.
- `ROW_NUMBER()`: unique sequential numbers. Use for deduplication and top-N per group.
- `RANK()` vs `DENSE_RANK()`: differ in how they handle ties (gaps vs no gaps).
- `LAG()` / `LEAD()`: access previous/next row values. Essential for period-over-period analysis.
- `SUM() OVER(ORDER BY)`: running totals. `AVG() OVER(ROWS BETWEEN)`: moving averages.
- `NTILE(n)`: split into n equal buckets for customer segmentation.
- Filter in a CTE before windowing for better performance.

**You have now completed the SQL series.** In the next session, we move to Python — automating what you have been doing manually, and scaling your analysis beyond what SQL alone can do.
$en06$,
  content_id = $id06$
# Sesi 06 — SQL Lanjutan: Window Functions

## Masalah yang Diselesaikan Window Functions

Mari mulai dengan tugas analitik yang umum: "Tampilkan setiap pesanan, bersama dengan total pengeluaran pelanggan di semua pesanan mereka."

Dengan apa yang kamu tahu sejauh ini, kamu mungkin mencoba GROUP BY. Tapi GROUP BY merangkum semua pesanan pelanggan menjadi satu baris — kamu kehilangan detail pesanan individual. Kamu tidak bisa punya "satu baris per pesanan" sekaligus "jumlah di semua pesanan" dengan GROUP BY.

**Window functions menyelesaikan masalah ini.** Mereka memungkinkan kamu melakukan kalkulasi di sekumpulan baris yang terkait sambil tetap mempertahankan setiap baris individual dalam hasil.

```sql
-- Ini berhasil dengan window function:
SELECT
    customer_id,
    order_id,
    total_price,
    SUM(total_price) OVER (PARTITION BY customer_id) AS customer_total
FROM orders;
```

Hasil: setiap baris pesanan dipertahankan, DAN kamu mendapat total pelanggan di setiap pesanan.

| customer_id | order_id | total_price | customer_total |
|---|---|---|---|
| 1 | 5001 | 180.000 | 580.000 |
| 1 | 5007 | 400.000 | 580.000 |
| 2 | 5002 | 125.000 | 125.000 |

---

## Anatomi Window Function

```sql
nama_fungsi(kolom) OVER (
    PARTITION BY kolom_partisi
    ORDER BY kolom_urut
    ROWS BETWEEN frame_awal AND frame_akhir
)
```

### OVER() — Kata Kunci Ajaib

`OVER()` adalah yang membuat fungsi menjadi window function. Tanpanya, `SUM()` adalah agregat yang merangkum baris. Dengan `OVER()`, ini menjadi window function yang tidak merangkum baris.

```sql
-- Jumlah di semua baris (grand total di setiap baris)
SELECT order_id, total_price, SUM(total_price) OVER () AS grand_total
FROM orders;
```

### PARTITION BY — Mendefinisikan Sub-Window

`PARTITION BY` membagi baris ke dalam kelompok (partisi) dan menerapkan window function secara independen dalam setiap partisi. Bayangkan seperti GROUP BY untuk window functions — tapi tanpa merangkum baris.

```sql
-- Setiap baris menampilkan harga dan harga maksimum di kategorinya
SELECT
    product_name,
    category,
    price,
    MAX(price) OVER (PARTITION BY category) AS harga_max_dalam_kategori
FROM products;
```

### ORDER BY dalam OVER — Mendefinisikan Urutan Komputasi

Ketika kamu menambahkan `ORDER BY` dalam `OVER()`, window function menghitung secara kumulatif saat bergerak melalui baris yang diurutkan.

---

## ROW_NUMBER(): Menetapkan Nomor Baris Unik

`ROW_NUMBER()` menetapkan integer unik ke setiap baris, dimulai dari 1.

### Kasus Penggunaan 1: Deduplication

```sql
WITH ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id
            ORDER BY registration_date
        ) AS rn
    FROM customers
)
-- Hanya pertahankan kemunculan pertama dari setiap customer_id
SELECT * FROM ranked WHERE rn = 1;
```

### Kasus Penggunaan 2: Top N Per Grup (Pola Paling Penting)

"Tampilkan 3 pelanggan teratas berdasarkan pengeluaran di setiap kota."

```sql
WITH pengeluaran_pelanggan AS (
    SELECT
        c.customer_id,
        c.name,
        c.city,
        SUM(o.total_price) AS total_dibelanjakan
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.name, c.city
),
ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY total_dibelanjakan DESC
        ) AS ranking_kota
    FROM pengeluaran_pelanggan
)
SELECT city, ranking_kota, name, total_dibelanjakan
FROM ranked
WHERE ranking_kota <= 3
ORDER BY city, ranking_kota;
```

---

## RANK() vs DENSE_RANK(): Ketika Seri Penting

Keduanya menetapkan peringkat, tapi menangani seri secara berbeda.

**Analogi papan peringkat olahraga:**

Balapkan 100m dengan waktu-waktu ini:
- Atlet A: 9,8s
- Atlet B: 9,9s
- Atlet C: 9,9s (seri dengan B)
- Atlet D: 10,1s

| Atlet | Waktu | RANK() | DENSE_RANK() |
|---|---|---|---|
| A | 9,8s | 1 | 1 |
| B | 9,9s | 2 | 2 |
| C | 9,9s | 2 | 2 |
| D | 10,1s | 4 | 3 |

**RANK():** Setelah seri di posisi 2, peringkat berikutnya adalah 4 (melewati 3).

**DENSE_RANK():** Setelah seri di posisi 2, peringkat berikutnya adalah 3 (tidak ada celah).

**Kapan menggunakan mana:**
- `RANK()`: ketika celah bermakna (peringkat kompetisi)
- `DENSE_RANK()`: ketika kamu ingin penomoran kontinu meski ada seri
- `ROW_NUMBER()`: ketika kamu butuh nomor unik dan seri tidak penting

---

## LAG() dan LEAD(): Melihat Baris Sebelah

`LAG()` mengambil nilai dari baris **sebelumnya**. `LEAD()` mengambil nilai dari baris **berikutnya**.

### Pertumbuhan Bulan-ke-Bulan dengan LAG()

```sql
WITH pendapatan_bulanan AS (
    SELECT
        DATE_TRUNC('month', order_date) AS bulan,
        SUM(total_price) AS pendapatan
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
    bulan,
    pendapatan,
    LAG(pendapatan) OVER (ORDER BY bulan) AS pendapatan_bulan_lalu,
    pendapatan - LAG(pendapatan) OVER (ORDER BY bulan) AS perubahan_pendapatan,
    ROUND(
        (pendapatan - LAG(pendapatan) OVER (ORDER BY bulan)) /
        LAG(pendapatan) OVER (ORDER BY bulan) * 100,
        2
    ) AS pct_pertumbuhan_mom
FROM pendapatan_bulanan
ORDER BY bulan;
```

---

## SUM() OVER(): Running Total

Running total (juga disebut cumulative sum) menjumlahkan nilai saat kamu bergerak melalui baris yang diurutkan — seperti saldo rekening bank.

```sql
SELECT
    order_date,
    order_id,
    total_price,
    SUM(total_price) OVER (ORDER BY order_date, order_id) AS running_revenue
FROM orders
ORDER BY order_date, order_id;
```

### Running Total Per Partisi

```sql
-- Running total per pelanggan (pengeluaran kumulatif setiap pelanggan)
SELECT
    customer_id,
    order_date,
    total_price,
    SUM(total_price) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS cumulative_spent
FROM orders
ORDER BY customer_id, order_date;
```

---

## AVG() OVER(): Moving Average

Moving average memuluskan fluktuasi jangka pendek untuk menunjukkan tren yang mendasarinya. Banyak digunakan dalam analisis tren pendapatan.

```sql
-- Moving average 7 hari dari pendapatan harian
WITH pendapatan_harian AS (
    SELECT
        order_date,
        SUM(total_price) AS pendapatan_harian
    FROM orders
    GROUP BY order_date
)
SELECT
    order_date,
    pendapatan_harian,
    ROUND(
        AVG(pendapatan_harian) OVER (
            ORDER BY order_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ),
        0
    ) AS moving_avg_7hari
FROM pendapatan_harian
ORDER BY order_date;
```

`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` berarti: untuk setiap baris, rata-rata baris saat ini dan 6 baris sebelumnya — jendela 7 baris (7 hari).

---

## NTILE(): Membagi ke dalam Kelompok yang Sama Rata

`NTILE(n)` membagi baris ke dalam `n` bucket yang kurang lebih sama besar dan menetapkan nomor bucket ke setiap baris. Sempurna untuk segmentasi pelanggan.

```sql
-- Segmentasi pelanggan ke dalam 4 kuartil pengeluaran
WITH pengeluaran_pelanggan AS (
    SELECT
        customer_id,
        SUM(total_price) AS total_dibelanjakan
    FROM orders
    GROUP BY customer_id
)
SELECT
    customer_id,
    total_dibelanjakan,
    NTILE(4) OVER (ORDER BY total_dibelanjakan) AS kuartil_pengeluaran,
    CASE NTILE(4) OVER (ORDER BY total_dibelanjakan)
        WHEN 1 THEN 'Pengeluaran Rendah'
        WHEN 2 THEN 'Pengeluaran Menengah'
        WHEN 3 THEN 'Pengeluaran Tinggi'
        WHEN 4 THEN 'Pengeluaran Teratas'
    END AS segmen
FROM pengeluaran_pelanggan
ORDER BY total_dibelanjakan DESC;
```

---

## FIRST_VALUE() dan LAST_VALUE()

`FIRST_VALUE()` mengembalikan nilai pertama dalam frame window. `LAST_VALUE()` mengembalikan yang terakhir.

```sql
-- Untuk setiap pesanan, tampilkan tanggal pesanan pertama dan terbaru pelanggan
SELECT
    customer_id,
    order_id,
    order_date,
    FIRST_VALUE(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS tanggal_pesanan_pertama,
    LAST_VALUE(order_date) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS tanggal_pesanan_terakhir
FROM orders
ORDER BY customer_id, order_date;
```

**Penting:** Untuk `LAST_VALUE()`, selalu tentukan `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. Tanpanya, frame default hanya sampai ke baris saat ini.

---

## Kasus Penggunaan Bisnis Nyata

### Kasus 1: Perbandingan Year-over-Year

```sql
WITH bulanan AS (
    SELECT
        DATE_TRUNC('month', order_date) AS bulan,
        SUM(total_price) AS pendapatan
    FROM orders
    GROUP BY 1
)
SELECT
    bulan,
    pendapatan,
    LAG(pendapatan, 12) OVER (ORDER BY bulan) AS pendapatan_bulan_sama_tahun_lalu,
    ROUND(
        (pendapatan - LAG(pendapatan, 12) OVER (ORDER BY bulan)) /
        LAG(pendapatan, 12) OVER (ORDER BY bulan) * 100,
        1
    ) AS pct_pertumbuhan_yoy
FROM bulanan
ORDER BY bulan;
```

### Kasus 2: Retensi Pelanggan (Analisis Cohort)

```sql
WITH pesanan_pertama AS (
    SELECT
        customer_id,
        MIN(DATE_TRUNC('month', order_date)) AS cohort_month
    FROM orders
    GROUP BY customer_id
),
bulan_pelanggan AS (
    SELECT DISTINCT
        o.customer_id,
        DATE_TRUNC('month', o.order_date) AS bulan_pesan
    FROM orders o
),
data_cohort AS (
    SELECT
        p.cohort_month,
        bp.bulan_pesan,
        COUNT(DISTINCT bp.customer_id) AS pelanggan_aktif,
        EXTRACT(MONTH FROM AGE(bp.bulan_pesan, p.cohort_month)) AS bulan_sejak_pertama
    FROM pesanan_pertama p
    JOIN bulan_pelanggan bp ON p.customer_id = bp.customer_id
    GROUP BY p.cohort_month, bp.bulan_pesan
)
SELECT
    cohort_month,
    bulan_sejak_pertama,
    pelanggan_aktif,
    FIRST_VALUE(pelanggan_aktif) OVER (
        PARTITION BY cohort_month
        ORDER BY bulan_sejak_pertama
    ) AS ukuran_cohort,
    ROUND(
        pelanggan_aktif * 100.0 /
        FIRST_VALUE(pelanggan_aktif) OVER (
            PARTITION BY cohort_month
            ORDER BY bulan_sejak_pertama
        ),
        1
    ) AS pct_retensi
FROM data_cohort
ORDER BY cohort_month, bulan_sejak_pertama;
```

---

## Tips Performa

### Tips 1: Filter Sebelum Windowing

```sql
-- Lebih baik: filter dulu, lalu window
WITH pesanan_terbaru AS (
    SELECT * FROM orders WHERE order_date >= '2024-01-01'
)
SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS rn
FROM pesanan_terbaru;
```

### Tips 2: Hindari Window Functions di Klausa WHERE

Kamu tidak bisa langsung menggunakan window functions di WHERE. Gunakan subquery atau CTE.

```sql
-- Salah (akan error):
SELECT * FROM orders WHERE ROW_NUMBER() OVER (ORDER BY order_date) <= 10;

-- Benar:
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (ORDER BY order_date) AS rn FROM orders
) t WHERE rn <= 10;
```

### Tips 3: Pastikan Kolom PARTITION BY Diindeks

Window functions dengan `PARTITION BY customer_id` sangat terbantu dari indeks pada `customer_id`.

---

## Kesimpulan Utama

- Window functions menghitung di sekumpulan baris yang terkait tanpa merangkumnya — tidak seperti GROUP BY.
- `OVER()` adalah kata kunci. `PARTITION BY` mendefinisikan sub-grup. `ORDER BY` mendefinisikan urutan komputasi.
- `ROW_NUMBER()`: nomor berurutan unik. Gunakan untuk deduplication dan top-N per grup.
- `RANK()` vs `DENSE_RANK()`: berbeda dalam menangani seri (ada celah vs tidak ada celah).
- `LAG()` / `LEAD()`: akses nilai baris sebelumnya/berikutnya. Penting untuk analisis period-over-period.
- `SUM() OVER(ORDER BY)`: running total. `AVG() OVER(ROWS BETWEEN)`: moving average.
- `NTILE(n)`: bagi ke dalam n bucket yang sama untuk segmentasi pelanggan.
- Filter dalam CTE sebelum windowing untuk performa yang lebih baik.

**Kamu telah menyelesaikan seri SQL.** Di sesi berikutnya, kita beralih ke Python — mengotomatiskan apa yang selama ini kamu lakukan secara manual, dan menskalakan analisismu melampaui apa yang bisa dilakukan SQL saja.
$id06$
WHERE session_number = '06';
