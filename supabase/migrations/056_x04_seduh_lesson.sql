-- ============================================================
-- 056: X04 lesson content rewritten for the Seduh Coffee dataset.
--
--   The lesson taught SQL on the 8-table synthetic "TokoSegar" schema while the
--   learner's own project runs on Seduh's four tables. Every query in it named
--   a table Seduh does not have, so nothing in the lesson could be pasted into
--   the playground any more.
--
--   The shape of the lesson is unchanged — same seven sections, same pitfalls,
--   same glossary — but every example now runs against orders / customers /
--   products / marketing_spend. Seduh has no order_items (one orders row IS one
--   line), no categories table (category is a column) and no reviews table
--   (rating is a nullable column on orders), so the join examples were rebuilt
--   rather than renamed.
--
--   Dollar-quoted so the markdown needs no escaping.
-- ============================================================

UPDATE public.sessions SET content_en = $md$## Why SQL is the analyst's core skill

Spreadsheets stop scaling around tens of thousands of rows. **SQL** talks directly to the database where the real data lives — millions of rows, always current. If you can describe the data you want in a sentence, SQL can fetch it.

Every query in this lesson runs against the **Playground → SQL** sandbox, which is loaded with the **same Seduh Coffee data as your final-project workbook**. Run a query here and the number you get is the number you can put in your report.

---

## The Seduh Coffee database

Four related tables. The **relationships** between them are what make SQL powerful:

| Table | Key columns | Relates to |
|-------|-------------|-----------|
| `products` | product_id, product_name, category, base_price, **unit_cost**, launch_date | — |
| `customers` | customer_id, customer_name, gender, age, city, province, signup_date, acquisition_channel | — |
| `orders` | order_id, order_date, **customer_id**, **product_id**, quantity, unit_price, discount_pct, channel, payment_method, city, province, order_status, rating | customer_id → customers, product_id → products |
| `marketing_spend` | month, channel, spend_idr, impressions, clicks | joins on month + channel |

`customers → orders → products`

A **primary key** uniquely identifies a row (`customers.customer_id`). A **foreign key** points at another table's primary key (`orders.customer_id`). Joins follow those links.

> ⚠️ **Three things to know before you query.**
> 1. **One `orders` row is one order of one product.** There is no separate line-items table — `quantity` and `unit_price` live right there.
> 2. **Revenue and profit are not columns.** You compute them:
>    `revenue = quantity * unit_price * (1 - discount_pct)`
>    `profit  = quantity * (unit_price * (1 - discount_pct) - unit_cost)`
>    `unit_cost` lives in `products`, so profit always needs a JOIN.
> 3. **Only `order_status = 'Completed'` counts as revenue.** `Returned` and `Cancelled` rows stay in the table so you can measure the return rate — filter them out of every money question.

---

## 1. SELECT & WHERE

```sql
SELECT product_name, category, base_price
FROM products
WHERE category = 'Roasted Beans';
```

Common `WHERE` operators:

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` `<>` | equals / not equals | `order_status = 'Completed'` |
| `>` `<` `>=` `<=` | comparisons | `unit_price > 100000` |
| `LIKE` | pattern match | `city LIKE 'Ja%'` (starts with Ja) |
| `IN` | in a list | `channel IN ('Shopee','Tokopedia')` |
| `BETWEEN` | range | `order_date BETWEEN '2025-01-01' AND '2025-03-31'` |
| `IS NULL` | missing value | `rating IS NULL` (order was never rated) |

---

## 2. ORDER BY & LIMIT

```sql
SELECT product_name, base_price
FROM products
ORDER BY base_price DESC
LIMIT 3;
```
Sorts most-expensive first and returns the top 3. `ASC` is the default; `DESC` reverses it.

---

## 3. Aggregation with GROUP BY

Aggregates collapse many rows into one summary row **per group**.

```sql
SELECT channel,
       COUNT(*)                AS orders,
       ROUND(AVG(unit_price))  AS avg_price
FROM orders
WHERE order_status = 'Completed'
GROUP BY channel;
```

| Function | Returns |
|----------|---------|
| `COUNT(*)` | Number of rows |
| `COUNT(DISTINCT col)` | Number of different values |
| `SUM(col)` | Total |
| `AVG(col)` | Average |
| `MIN`/`MAX` | Smallest / largest |

> `AVG` skips NULLs. `AVG(rating)` averages only the orders that were actually rated — which is what you want, and why you should never fill blank ratings with 0.

---

## 4. WHERE vs HAVING

Both filter — but at different stages.

| Clause | Filters | Runs | Can use aggregates? |
|--------|---------|------|---------------------|
| `WHERE` | individual rows | **before** grouping | No |
| `HAVING` | groups | **after** grouping | Yes |

```sql
SELECT city, COUNT(*) AS orders
FROM orders
WHERE order_status = 'Completed'   -- row filter, before grouping
GROUP BY city
HAVING COUNT(*) > 900;             -- group filter, after grouping
```

---

## 5. JOINs — combining tables

Most real questions need more than one table. A **JOIN** stitches rows together on a matching key.

### INNER JOIN (only matching rows)

"Show each order line with the product's cost" — this is the join that unlocks profit:

```sql
SELECT o.order_id, p.product_name, p.category, o.quantity, o.unit_price, p.unit_cost
FROM orders o
JOIN products p ON p.product_id = o.product_id;
```

The `ON` clause is the link. Table **aliases** (`o`, `p`) keep it short. An INNER JOIN keeps only rows that match on **both** sides.

Now the actual business question (Q1) — profit per category:

```sql
SELECT p.category,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct)))                  AS revenue,
       ROUND(SUM(o.quantity * (o.unit_price * (1 - o.discount_pct) - p.unit_cost)))  AS profit
FROM orders o
JOIN products p ON p.product_id = o.product_id
WHERE o.order_status = 'Completed'
GROUP BY p.category
ORDER BY profit DESC;
```

### LEFT JOIN (keep all left rows)

"Every customer, including the ones who never completed a purchase":

```sql
SELECT c.customer_name, COUNT(o.order_id) AS completed_orders
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.customer_id
      AND o.order_status = 'Completed'
GROUP BY c.customer_id, c.customer_name
ORDER BY completed_orders;
```
A `LEFT JOIN` keeps every `customers` row; someone who never completed an order shows `0` instead of vanishing. An INNER JOIN would quietly drop them — and those are exactly the people a retention analysis is about.

> Notice where the status filter went: **inside the `ON`**, not in a `WHERE`. That matters, and the next example shows why.

### The anti-join trick (find what is missing)

A LEFT JOIN plus `IS NULL` finds rows with **no** match. Seduh has 4,200 customers and every one of them has *some* order — but 48 have never completed one:

```sql
SELECT c.customer_id, c.customer_name, c.acquisition_channel
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.customer_id
      AND o.order_status = 'Completed'
WHERE o.order_id IS NULL;
```

That is a retention problem with names attached, and it tells you which channel acquired them.

> ⚠️ **The trap.** Move `o.order_status = 'Completed'` out of the `ON` and into the `WHERE` and this query returns **zero rows** — every time. The LEFT JOIN fills unmatched rows with NULLs, then `WHERE order_status = 'Completed'` throws those NULL rows straight back out. A row filter in `WHERE` turns any LEFT JOIN back into an INNER JOIN. Keep the filter in the `ON`.

### Three-table JOIN

Which acquisition channel brings the customers who actually spend (Q6)?

```sql
SELECT c.acquisition_channel,
       COUNT(DISTINCT o.customer_id) AS customers,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct))) AS revenue
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_status = 'Completed'
GROUP BY c.acquisition_channel
ORDER BY revenue DESC;
```

> ⚠️ To turn that into ROI you need `marketing_spend` — but its `channel` values are not the same vocabulary. Customers are acquired via `Marketplace`, `Organic Social` and `Referral`; spend is recorded against `Marketplace Ads`, and there are **no spend rows at all** for Organic Social or Referral. Decide your mapping, write it down, and state it next to the number.

| Join type | Keeps |
|-----------|-------|
| `INNER JOIN` | Only rows matching in both tables |
| `LEFT JOIN` | All left-table rows + matches (NULLs where none) |

---

## 6. Subqueries — a query inside a query

When the value you compare against must itself be computed, nest a query:

```sql
SELECT c.customer_name,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct))) AS total_spent
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_status = 'Completed'
GROUP BY c.customer_id, c.customer_name
HAVING SUM(o.quantity * o.unit_price * (1 - o.discount_pct)) > (
  SELECT AVG(t) FROM (
    SELECT SUM(quantity * unit_price * (1 - discount_pct)) AS t
    FROM orders WHERE order_status = 'Completed' GROUP BY customer_id
  )
);
```
The inner query builds per-customer totals and averages them; the outer query keeps only customers above that average. Those are the people Session 10's RFM analysis will call Champions.

---

## 7. Building a query step by step

```
Start from the question → "which category earns the most?"
↓
Find the tables → orders (quantity, price, discount) + products (unit_cost)
↓
Join them → JOIN products p ON p.product_id = o.product_id
↓
Group & aggregate → GROUP BY p.category, SUM(...)
↓
Filter & sort → WHERE order_status = 'Completed', ORDER BY profit DESC
```

> **Mini case study — revenue is not profit.** Seduh assumed Brewing Equipment was a star: at **IDR 829M** it out-sells Accessories' **744M**. But run the profit query above and the ranking flips — Accessories earns **302M** against Brewing Equipment's **252M**, because the equipment margin is 30% while accessories run at 41%. Same catalogue, opposite conclusion. This is Q1, and one query answers it.

---

## Common pitfalls

- **Forgetting the `ON` condition.** A join with no key produces a *cross join* — every row paired with every row.
- **`WHERE` on an aggregate.** `WHERE COUNT(*) > 900` errors — use `HAVING`.
- **Forgetting the status filter.** Leave `Returned` and `Cancelled` rows in and every revenue figure you report is too high.
- **Using `unit_price` as revenue.** It is the price of *one unit before discount*. Revenue needs `quantity` and `(1 - discount_pct)` too.
- **INNER JOIN hiding rows.** If you expect every customer but some never completed an order, INNER JOIN drops them — use LEFT JOIN.
- **Grouping by a non-unique name.** Customer names repeat — `GROUP BY c.customer_id, c.customer_name`, not just the name, or you silently merge two different people.

---

## Glossary

| Term | Meaning |
|------|---------|
| Primary key | Column that uniquely identifies a row |
| Foreign key | Column pointing at another table's primary key |
| JOIN | Combines rows from two tables on a matching key |
| LEFT JOIN | Keeps all left rows, NULLs where no match |
| Anti-join | LEFT JOIN + IS NULL, to find rows with no match |
| Subquery | A query nested inside another query |
| Aggregate | A function that summarises many rows (SUM, COUNT…) |

---

## Key Takeaways

1. SQL fetches data straight from the database — describe what you want, and it returns it.
2. `SELECT`/`WHERE` pick columns and rows; `ORDER BY`/`LIMIT` sort and cap; `GROUP BY` summarises.
3. `WHERE` filters rows **before** grouping; `HAVING` filters groups **after**.
4. **JOINs** follow foreign keys — and in Seduh, profit *always* needs one, because `unit_cost` lives in `products`.
5. Revenue and profit are computed, never stored, and only `Completed` orders count.

> 💡 Run every query above in **Playground → SQL**, then complete the SQL exercises below. Your totals should match the workbook you downloaded — if they do not, check your status filter first.$md$
WHERE session_number = 'X04';

UPDATE public.sessions SET content_id = $md$## Kenapa SQL adalah skill inti seorang analis

Spreadsheet mulai kewalahan di angka puluhan ribu baris. **SQL** berbicara langsung ke database tempat data sesungguhnya berada — jutaan baris, selalu terkini. Kalau kamu bisa mendeskripsikan data yang kamu mau dalam satu kalimat, SQL bisa mengambilnya.

Semua query di pelajaran ini berjalan di sandbox **Playground → SQL**, yang sudah dimuati **data Seduh Coffee yang sama dengan workbook proyek akhirmu**. Jalankan query di sini dan angkanya bisa langsung kamu pakai di laporanmu.

---

## Database Seduh Coffee

Empat tabel yang saling berelasi. **Relasi** antar tabel inilah yang membuat SQL bertenaga:

| Tabel | Kolom kunci | Berelasi ke |
|-------|-------------|-------------|
| `products` | product_id, product_name, category, base_price, **unit_cost**, launch_date | — |
| `customers` | customer_id, customer_name, gender, age, city, province, signup_date, acquisition_channel | — |
| `orders` | order_id, order_date, **customer_id**, **product_id**, quantity, unit_price, discount_pct, channel, payment_method, city, province, order_status, rating | customer_id → customers, product_id → products |
| `marketing_spend` | month, channel, spend_idr, impressions, clicks | join lewat month + channel |

`customers → orders → products`

**Primary key** mengidentifikasi satu baris secara unik (`customers.customer_id`). **Foreign key** menunjuk ke primary key tabel lain (`orders.customer_id`). Join mengikuti tautan itu.

> ⚠️ **Tiga hal yang harus kamu tahu sebelum query.**
> 1. **Satu baris `orders` adalah satu pemesanan satu produk.** Tidak ada tabel line-items terpisah — `quantity` dan `unit_price` ada langsung di situ.
> 2. **Revenue dan profit bukan kolom.** Kamu yang menghitungnya:
>    `revenue = quantity * unit_price * (1 - discount_pct)`
>    `profit  = quantity * (unit_price * (1 - discount_pct) - unit_cost)`
>    `unit_cost` ada di `products`, jadi profit selalu butuh JOIN.
> 3. **Hanya `order_status = 'Completed'` yang dihitung sebagai revenue.** Baris `Returned` dan `Cancelled` tetap disimpan agar kamu bisa mengukur return rate — saring keluar dari setiap pertanyaan soal uang.

---

## 1. SELECT & WHERE

```sql
SELECT product_name, category, base_price
FROM products
WHERE category = 'Roasted Beans';
```

Operator `WHERE` yang umum:

| Operator | Arti | Contoh |
|----------|------|--------|
| `=` `<>` | sama dengan / tidak sama | `order_status = 'Completed'` |
| `>` `<` `>=` `<=` | perbandingan | `unit_price > 100000` |
| `LIKE` | pencocokan pola | `city LIKE 'Ja%'` (diawali Ja) |
| `IN` | ada di dalam daftar | `channel IN ('Shopee','Tokopedia')` |
| `BETWEEN` | rentang | `order_date BETWEEN '2025-01-01' AND '2025-03-31'` |
| `IS NULL` | nilai kosong | `rating IS NULL` (order tak pernah dinilai) |

---

## 2. ORDER BY & LIMIT

```sql
SELECT product_name, base_price
FROM products
ORDER BY base_price DESC
LIMIT 3;
```
Mengurutkan dari termahal dan mengambil 3 teratas. `ASC` adalah default; `DESC` membalikkannya.

---

## 3. Agregasi dengan GROUP BY

Agregat meringkas banyak baris menjadi satu baris **per grup**.

```sql
SELECT channel,
       COUNT(*)                AS orders,
       ROUND(AVG(unit_price))  AS avg_price
FROM orders
WHERE order_status = 'Completed'
GROUP BY channel;
```

| Fungsi | Menghasilkan |
|--------|--------------|
| `COUNT(*)` | Jumlah baris |
| `COUNT(DISTINCT col)` | Jumlah nilai yang berbeda |
| `SUM(col)` | Total |
| `AVG(col)` | Rata-rata |
| `MIN`/`MAX` | Terkecil / terbesar |

> `AVG` melewati NULL. `AVG(rating)` hanya merata-ratakan order yang benar-benar dinilai — dan itulah yang kamu mau, sekaligus alasan kenapa rating kosong tidak boleh diisi 0.

---

## 4. WHERE vs HAVING

Keduanya memfilter — tapi di tahap berbeda.

| Klausa | Memfilter | Berjalan | Bisa pakai agregat? |
|--------|-----------|----------|---------------------|
| `WHERE` | baris individual | **sebelum** pengelompokan | Tidak |
| `HAVING` | grup | **sesudah** pengelompokan | Bisa |

```sql
SELECT city, COUNT(*) AS orders
FROM orders
WHERE order_status = 'Completed'   -- filter baris, sebelum grouping
GROUP BY city
HAVING COUNT(*) > 900;             -- filter grup, sesudah grouping
```

---

## 5. JOIN — menggabungkan tabel

Kebanyakan pertanyaan nyata butuh lebih dari satu tabel. **JOIN** menyatukan baris lewat kunci yang cocok.

### INNER JOIN (hanya baris yang cocok)

"Tampilkan tiap baris order beserta cost produknya" — inilah join yang membuka perhitungan profit:

```sql
SELECT o.order_id, p.product_name, p.category, o.quantity, o.unit_price, p.unit_cost
FROM orders o
JOIN products p ON p.product_id = o.product_id;
```

Klausa `ON` adalah tautannya. **Alias** tabel (`o`, `p`) membuatnya ringkas. INNER JOIN hanya menyimpan baris yang cocok di **kedua** sisi.

Sekarang pertanyaan bisnis sesungguhnya (Q1) — profit per kategori:

```sql
SELECT p.category,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct)))                  AS revenue,
       ROUND(SUM(o.quantity * (o.unit_price * (1 - o.discount_pct) - p.unit_cost)))  AS profit
FROM orders o
JOIN products p ON p.product_id = o.product_id
WHERE o.order_status = 'Completed'
GROUP BY p.category
ORDER BY profit DESC;
```

### LEFT JOIN (pertahankan semua baris kiri)

"Semua customer, termasuk yang tak pernah menuntaskan pembelian":

```sql
SELECT c.customer_name, COUNT(o.order_id) AS completed_orders
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.customer_id
      AND o.order_status = 'Completed'
GROUP BY c.customer_id, c.customer_name
ORDER BY completed_orders;
```
`LEFT JOIN` menyimpan setiap baris `customers`; yang tak pernah menuntaskan order muncul sebagai `0`, bukan hilang. INNER JOIN akan membuangnya diam-diam — padahal merekalah inti dari analisis retensi.

> Perhatikan di mana filter status diletakkan: **di dalam `ON`**, bukan di `WHERE`. Ini penting, dan contoh berikutnya menunjukkan alasannya.

### Trik anti-join (menemukan yang tidak ada)

LEFT JOIN plus `IS NULL` menemukan baris yang **tidak** punya pasangan. Seduh punya 4.200 customer dan semuanya punya *sebagian* order — tapi 48 di antaranya tak pernah menuntaskan satu pun:

```sql
SELECT c.customer_id, c.customer_name, c.acquisition_channel
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.customer_id
      AND o.order_status = 'Completed'
WHERE o.order_id IS NULL;
```

Itu masalah retensi lengkap dengan namanya, sekaligus memberi tahu channel mana yang mengakuisisi mereka.

> ⚠️ **Jebakannya.** Pindahkan `o.order_status = 'Completed'` dari `ON` ke `WHERE` dan query ini akan mengembalikan **nol baris** — selalu. LEFT JOIN mengisi baris tanpa pasangan dengan NULL, lalu `WHERE order_status = 'Completed'` langsung membuang baris NULL itu. Filter baris di `WHERE` mengubah LEFT JOIN apa pun kembali menjadi INNER JOIN. Simpan filternya di `ON`.

### JOIN tiga tabel

Channel akuisisi mana yang membawa customer yang benar-benar belanja (Q6)?

```sql
SELECT c.acquisition_channel,
       COUNT(DISTINCT o.customer_id) AS customers,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct))) AS revenue
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_status = 'Completed'
GROUP BY c.acquisition_channel
ORDER BY revenue DESC;
```

> ⚠️ Untuk mengubahnya jadi ROI kamu butuh `marketing_spend` — tapi nilai `channel`-nya bukan kosakata yang sama. Customer diakuisisi lewat `Marketplace`, `Organic Social`, dan `Referral`; spend dicatat sebagai `Marketplace Ads`, dan **tidak ada baris spend sama sekali** untuk Organic Social maupun Referral. Tentukan pemetaanmu, catat, dan sebutkan di sebelah angkanya.

| Jenis join | Menyimpan |
|------------|-----------|
| `INNER JOIN` | Hanya baris yang cocok di kedua tabel |
| `LEFT JOIN` | Semua baris tabel kiri + pasangannya (NULL bila tak ada) |

---

## 6. Subquery — query di dalam query

Ketika nilai pembanding harus dihitung dulu, sarangkan sebuah query:

```sql
SELECT c.customer_name,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct))) AS total_spent
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.order_status = 'Completed'
GROUP BY c.customer_id, c.customer_name
HAVING SUM(o.quantity * o.unit_price * (1 - o.discount_pct)) > (
  SELECT AVG(t) FROM (
    SELECT SUM(quantity * unit_price * (1 - discount_pct)) AS t
    FROM orders WHERE order_status = 'Completed' GROUP BY customer_id
  )
);
```
Query dalam membangun total per customer lalu merata-ratakannya; query luar hanya menyimpan customer di atas rata-rata itu. Merekalah yang nanti disebut Champions di analisis RFM Sesi 10.

---

## 7. Menyusun query langkah demi langkah

```
Mulai dari pertanyaan → "kategori mana yang paling untung?"
↓
Cari tabelnya → orders (quantity, harga, diskon) + products (unit_cost)
↓
Join → JOIN products p ON p.product_id = o.product_id
↓
Group & agregasi → GROUP BY p.category, SUM(...)
↓
Filter & urutkan → WHERE order_status = 'Completed', ORDER BY profit DESC
```

> **Studi kasus mini — revenue bukan profit.** Seduh mengira Brewing Equipment adalah bintangnya: dengan **IDR 829 juta** ia mengalahkan Accessories yang **744 juta**. Tapi jalankan query profit di atas dan peringkatnya terbalik — Accessories menghasilkan **302 juta** melawan Brewing Equipment **252 juta**, karena margin peralatan hanya 30% sedangkan aksesori 41%. Katalog yang sama, kesimpulan yang berlawanan. Ini Q1, dan satu query menjawabnya.

---

## Kesalahan yang sering terjadi

- **Lupa klausa `ON`.** Join tanpa kunci menghasilkan *cross join* — tiap baris dipasangkan dengan semua baris.
- **`WHERE` pada agregat.** `WHERE COUNT(*) > 900` akan error — pakai `HAVING`.
- **Lupa filter status.** Membiarkan baris `Returned` dan `Cancelled` membuat semua angka revenue-mu terlalu tinggi.
- **Memakai `unit_price` sebagai revenue.** Itu harga *satu unit sebelum diskon*. Revenue juga butuh `quantity` dan `(1 - discount_pct)`.
- **INNER JOIN menyembunyikan baris.** Kalau kamu mengharapkan semua customer padahal sebagian tak pernah menuntaskan order, INNER JOIN membuangnya — pakai LEFT JOIN.
- **Group by nama yang tidak unik.** Nama customer bisa berulang — `GROUP BY c.customer_id, c.customer_name`, bukan hanya namanya, kalau tidak dua orang berbeda diam-diam tergabung.

---

## Glosarium

| Istilah | Arti |
|---------|------|
| Primary key | Kolom yang mengidentifikasi baris secara unik |
| Foreign key | Kolom yang menunjuk primary key tabel lain |
| JOIN | Menggabungkan baris dua tabel lewat kunci yang cocok |
| LEFT JOIN | Menyimpan semua baris kiri, NULL bila tak ada pasangan |
| Anti-join | LEFT JOIN + IS NULL, mencari baris tanpa pasangan |
| Subquery | Query yang bersarang di dalam query lain |
| Agregat | Fungsi yang meringkas banyak baris (SUM, COUNT…) |

---

## Poin Penting

1. SQL mengambil data langsung dari database — deskripsikan yang kamu mau, dan ia mengembalikannya.
2. `SELECT`/`WHERE` memilih kolom dan baris; `ORDER BY`/`LIMIT` mengurutkan dan membatasi; `GROUP BY` meringkas.
3. `WHERE` memfilter baris **sebelum** grouping; `HAVING` memfilter grup **sesudahnya**.
4. **JOIN** mengikuti foreign key — dan di Seduh, profit *selalu* butuh JOIN karena `unit_cost` ada di `products`.
5. Revenue dan profit selalu dihitung, tidak pernah disimpan, dan hanya order `Completed` yang dihitung.

> 💡 Jalankan semua query di atas di **Playground → SQL**, lalu kerjakan latihan SQL di bawah. Totalmu seharusnya sama dengan workbook yang kamu unduh — kalau berbeda, periksa filter status-mu lebih dulu.$md$
WHERE session_number = 'X04';
