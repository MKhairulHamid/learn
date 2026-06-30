-- ============================================================
-- 025 — Session 04 (SQL Dasar: SELECT, Filter, Aggregasi)
-- Expand practice exercises to 10 total: 4 easy, 4 medium, 2 hard.
--
-- Session 04 already has 3 easy exercises (order_num 1–3) seeded in
-- 003_exercises.sql. This migration adds 7 more (order_num 4–10):
--   • 1 easy   (order 4)
--   • 4 medium (order 5–8)
--   • 2 hard   (order 9–10)
--
-- All row counts validated against the ecommerce dataset
-- (src/data/datasets/ecommerce.ts): 15 customers, 10 products,
-- 50 orders, 51 order_items.
-- Topics stay within Session 04 scope: SELECT, WHERE, BETWEEN/IN/LIKE,
-- ORDER BY, LIMIT, aggregates, GROUP BY, HAVING (no JOINs).
-- ============================================================

-- ── order 4 · EASY — Customers in Jakarta (WHERE on text) ────────────────────────
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Customers in Jakarta',
  'Pelanggan di Jakarta',
  'Show the name and city of every customer located in Jakarta.',
  'Tampilkan name dan city dari setiap pelanggan yang berada di Jakarta.',
  'SELECT name, city
FROM customers
WHERE ',
  'SELECT name, city FROM customers WHERE city = ''Jakarta'';',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":3,"description_en":"Should return 3 customers in Jakarta","description_id":"Harus mengembalikan 3 pelanggan di Jakarta","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["name","city"],"description_en":"Must select name and city","description_id":"Harus memilih kolom name dan city","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["WHERE","city"],"description_en":"Must filter with WHERE on city","description_id":"Harus memfilter dengan WHERE pada city","points":30}
  ]',
  '["Use WHERE city = ''Jakarta'' to keep only Jakarta rows","Text values must be wrapped in single quotes"]',
  '["Gunakan WHERE city = ''Jakarta'' untuk menyaring baris Jakarta","Nilai teks harus diapit tanda kutip tunggal"]',
  'easy', 4
FROM sessions s
WHERE s.session_number = '04'
  AND NOT EXISTS (SELECT 1 FROM exercises e WHERE e.session_id = s.id AND e.title_en = 'Customers in Jakarta')
LIMIT 1;

-- ── order 5 · MEDIUM — Products in a price range (BETWEEN) ───────────────────────
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Products Between 150K and 500K',
  'Produk Antara 150K dan 500K',
  'Find products whose price is between 150000 and 500000 (inclusive). Return name and price, ordered by price ascending.',
  'Cari produk dengan harga antara 150000 dan 500000 (inklusif). Tampilkan name dan price, diurutkan dari harga terendah.',
  'SELECT name, price
FROM products
WHERE price BETWEEN ',
  'SELECT name, price FROM products WHERE price BETWEEN 150000 AND 500000 ORDER BY price ASC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":5,"description_en":"Should return 5 products in range","description_id":"Harus mengembalikan 5 produk dalam rentang","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["name","price"],"description_en":"Must select name and price","description_id":"Harus memilih kolom name dan price","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["BETWEEN"],"description_en":"Must use the BETWEEN operator","description_id":"Harus menggunakan operator BETWEEN","points":30}
  ]',
  '["BETWEEN 150000 AND 500000 is inclusive on both ends","It is equivalent to price >= 150000 AND price <= 500000","Add ORDER BY price ASC to sort from cheapest"]',
  '["BETWEEN 150000 AND 500000 inklusif di kedua ujung","Sama dengan price >= 150000 AND price <= 500000","Tambahkan ORDER BY price ASC untuk urut dari termurah"]',
  'medium', 5
FROM sessions s
WHERE s.session_number = '04'
  AND NOT EXISTS (SELECT 1 FROM exercises e WHERE e.session_id = s.id AND e.title_en = 'Products Between 150K and 500K')
LIMIT 1;

-- ── order 6 · MEDIUM — Customers per region (GROUP BY + COUNT) ───────────────────
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Customers per Region',
  'Jumlah Pelanggan per Wilayah',
  'Count how many customers are in each region. Return region and customer_count, ordered by customer_count descending.',
  'Hitung berapa banyak pelanggan di setiap region. Tampilkan region dan customer_count, diurutkan dari terbanyak.',
  'SELECT region, COUNT(*) AS customer_count
FROM customers
GROUP BY ',
  'SELECT region, COUNT(*) AS customer_count FROM customers GROUP BY region ORDER BY customer_count DESC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":5,"description_en":"Should return 5 regions","description_id":"Harus mengembalikan 5 region","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["region","customer_count"],"description_en":"Must have region and customer_count columns","description_id":"Harus memiliki kolom region dan customer_count","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["GROUP BY","region"],"description_en":"Must use GROUP BY region","description_id":"Harus menggunakan GROUP BY region","points":30}
  ]',
  '["COUNT(*) AS customer_count counts rows per group","GROUP BY region creates one group per region","ORDER BY customer_count DESC puts the biggest region first"]',
  '["COUNT(*) AS customer_count menghitung baris per kelompok","GROUP BY region membuat satu kelompok per region","ORDER BY customer_count DESC menaruh region terbesar di atas"]',
  'medium', 6
FROM sessions s
WHERE s.session_number = '04'
  AND NOT EXISTS (SELECT 1 FROM exercises e WHERE e.session_id = s.id AND e.title_en = 'Customers per Region')
LIMIT 1;

-- ── order 7 · MEDIUM — Average price per category (GROUP BY + AVG) ───────────────
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Average Price per Category',
  'Harga Rata-rata per Kategori',
  'Calculate the average product price for each category. Return category and avg_price, ordered by avg_price descending.',
  'Hitung harga rata-rata produk untuk setiap kategori. Tampilkan category dan avg_price, diurutkan dari rata-rata tertinggi.',
  'SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY ',
  'SELECT category, AVG(price) AS avg_price FROM products GROUP BY category ORDER BY avg_price DESC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":3,"description_en":"Should return 3 categories","description_id":"Harus mengembalikan 3 kategori","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["category","avg_price"],"description_en":"Must have category and avg_price columns","description_id":"Harus memiliki kolom category dan avg_price","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["AVG","GROUP BY"],"description_en":"Must use AVG with GROUP BY","description_id":"Harus menggunakan AVG dengan GROUP BY","points":30}
  ]',
  '["AVG(price) computes the mean for each group","GROUP BY category makes one group per category","Name the result with AS avg_price"]',
  '["AVG(price) menghitung rata-rata tiap kelompok","GROUP BY category membuat satu kelompok per kategori","Beri nama hasilnya dengan AS avg_price"]',
  'medium', 7
FROM sessions s
WHERE s.session_number = '04'
  AND NOT EXISTS (SELECT 1 FROM exercises e WHERE e.session_id = s.id AND e.title_en = 'Average Price per Category')
LIMIT 1;

-- ── order 8 · MEDIUM — Top 5 most expensive products (ORDER BY + LIMIT) ──────────
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Top 5 Most Expensive Products',
  '5 Produk Termahal',
  'List the 5 most expensive products. Return name and price, ordered from highest price to lowest, limited to 5 rows.',
  'Tampilkan 5 produk termahal. Tampilkan name dan price, diurutkan dari harga tertinggi ke terendah, dibatasi 5 baris.',
  'SELECT name, price
FROM products
ORDER BY price DESC
LIMIT ',
  'SELECT name, price FROM products ORDER BY price DESC LIMIT 5;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":5,"description_en":"Should return exactly 5 rows","description_id":"Harus mengembalikan tepat 5 baris","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["name","price"],"description_en":"Must select name and price","description_id":"Harus memilih kolom name dan price","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["ORDER BY","DESC","LIMIT"],"description_en":"Must use ORDER BY ... DESC with LIMIT","description_id":"Harus menggunakan ORDER BY ... DESC dengan LIMIT","points":30}
  ]',
  '["ORDER BY price DESC sorts from most expensive first","LIMIT 5 keeps only the first 5 rows","Combine both: ORDER BY runs before LIMIT"]',
  '["ORDER BY price DESC mengurutkan dari termahal lebih dulu","LIMIT 5 hanya mengambil 5 baris pertama","Gabungkan keduanya: ORDER BY berjalan sebelum LIMIT"]',
  'medium', 8
FROM sessions s
WHERE s.session_number = '04'
  AND NOT EXISTS (SELECT 1 FROM exercises e WHERE e.session_id = s.id AND e.title_en = 'Top 5 Most Expensive Products')
LIMIT 1;

-- ── order 9 · HARD — Premium categories (GROUP BY + HAVING on AVG) ───────────────
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Categories with High Average Price',
  'Kategori dengan Harga Rata-rata Tinggi',
  'Find product categories whose average price is greater than 1,000,000. Return category and avg_price. Use GROUP BY and HAVING.',
  'Temukan kategori produk yang harga rata-ratanya lebih dari 1.000.000. Tampilkan category dan avg_price. Gunakan GROUP BY dan HAVING.',
  'SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING ',
  'SELECT category, AVG(price) AS avg_price FROM products GROUP BY category HAVING AVG(price) > 1000000 ORDER BY avg_price DESC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":2,"description_en":"Should return 2 categories","description_id":"Harus mengembalikan 2 kategori","points":35},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["category","avg_price"],"description_en":"Must have category and avg_price columns","description_id":"Harus memiliki kolom category dan avg_price","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["HAVING","AVG"],"description_en":"Must filter groups with HAVING AVG(...)","description_id":"Harus menyaring kelompok dengan HAVING AVG(...)","points":35}
  ]',
  '["HAVING filters groups AFTER aggregation — WHERE cannot use AVG()","HAVING AVG(price) > 1000000 keeps only expensive categories","GROUP BY category first, then apply HAVING"]',
  '["HAVING menyaring kelompok SETELAH agregasi — WHERE tidak bisa pakai AVG()","HAVING AVG(price) > 1000000 hanya menyimpan kategori mahal","GROUP BY category dulu, baru terapkan HAVING"]',
  'hard', 9
FROM sessions s
WHERE s.session_number = '04'
  AND NOT EXISTS (SELECT 1 FROM exercises e WHERE e.session_id = s.id AND e.title_en = 'Categories with High Average Price')
LIMIT 1;

-- ── order 10 · HARD — Loyal customers (GROUP BY + HAVING on COUNT) ───────────────
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Loyal Customers',
  'Pelanggan Setia',
  'Find customers who have placed at least 4 orders. Return customer_id and order_count, ordered by order_count descending. Use GROUP BY and HAVING.',
  'Temukan pelanggan yang telah membuat minimal 4 order. Tampilkan customer_id dan order_count, diurutkan dari terbanyak. Gunakan GROUP BY dan HAVING.',
  'SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING ',
  'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 4 ORDER BY order_count DESC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":4,"description_en":"Should return 4 loyal customers","description_id":"Harus mengembalikan 4 pelanggan setia","points":35},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["customer_id","order_count"],"description_en":"Must have customer_id and order_count columns","description_id":"Harus memiliki kolom customer_id dan order_count","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["HAVING","COUNT"],"description_en":"Must filter groups with HAVING COUNT(*)","description_id":"Harus menyaring kelompok dengan HAVING COUNT(*)","points":35}
  ]',
  '["GROUP BY customer_id groups all orders per customer","HAVING COUNT(*) >= 4 keeps only customers with 4+ orders","ORDER BY order_count DESC shows the most active customers first"]',
  '["GROUP BY customer_id mengelompokkan semua order per pelanggan","HAVING COUNT(*) >= 4 hanya menyimpan pelanggan dengan 4+ order","ORDER BY order_count DESC menampilkan pelanggan paling aktif dulu"]',
  'hard', 10
FROM sessions s
WHERE s.session_number = '04'
  AND NOT EXISTS (SELECT 1 FROM exercises e WHERE e.session_id = s.id AND e.title_en = 'Loyal Customers')
LIMIT 1;
