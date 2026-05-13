-- ============================================================
-- 003 — Exercises & Submissions
-- ============================================================

CREATE TABLE IF NOT EXISTS exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID REFERENCES sessions(id) ON DELETE SET NULL,
  type            TEXT NOT NULL DEFAULT 'sql' CHECK (type IN ('sql','quiz','multiple_choice')),
  title_en        TEXT NOT NULL,
  title_id        TEXT NOT NULL,
  description_en  TEXT NOT NULL,
  description_id  TEXT NOT NULL,
  starter_code    TEXT DEFAULT '',
  solution_code   TEXT DEFAULT '',
  test_cases      JSONB DEFAULT '[]',
  hints_en        JSONB DEFAULT '[]',
  hints_id        JSONB DEFAULT '[]',
  difficulty      TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard')),
  dataset_name    TEXT DEFAULT 'ecommerce',
  order_num       INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercise_submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id    UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  submitted_code TEXT NOT NULL,
  passed         BOOLEAN NOT NULL DEFAULT FALSE,
  test_results   JSONB DEFAULT '[]',
  score          INTEGER DEFAULT 0,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  submitted_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exercises_session ON exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_exercise ON exercise_submissions(user_id, exercise_id);

-- RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read exercises
CREATE POLICY "exercises_read" ON exercises
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users manage their own submissions
CREATE POLICY "submissions_select" ON exercise_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "submissions_insert" ON exercise_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Seed: Session 04 — Basic SELECT & Filtering
-- ============================================================

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Select All Customers',
  'Tampilkan Semua Pelanggan',
  'Write a query to retrieve ALL columns from the customers table.',
  'Tulis query untuk mengambil SEMUA kolom dari tabel customers.',
  '-- Write your query here
SELECT ',
  'SELECT * FROM customers;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":15,"description_en":"Should return 15 rows","description_id":"Harus mengembalikan 15 baris","points":50},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["id","name","email","region","city","joined_date","membership"],"description_en":"Must include all customer columns","description_id":"Harus menyertakan semua kolom customers","points":50}
  ]',
  '["Use SELECT * to select all columns","The table name is customers"]',
  '["Gunakan SELECT * untuk memilih semua kolom","Nama tabelnya adalah customers"]',
  'easy',
  1
FROM sessions s
WHERE s.session_number = '04'
LIMIT 1;

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Filter Premium Customers',
  'Filter Pelanggan Premium',
  'Retrieve the id, name, and city of customers whose membership is ''premium''.',
  'Ambil kolom id, name, dan city dari pelanggan yang membership-nya ''premium''.',
  'SELECT id, name, city
FROM customers
WHERE ',
  'SELECT id, name, city FROM customers WHERE membership = ''premium'';',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":6,"description_en":"Should return 6 premium customers","description_id":"Harus mengembalikan 6 pelanggan premium","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["id","name","city"],"description_en":"Must select id, name, city","description_id":"Harus memilih kolom id, name, city","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["WHERE","membership"],"description_en":"Must use WHERE clause with membership column","description_id":"Harus menggunakan WHERE dengan kolom membership","points":30}
  ]',
  '["Use WHERE membership = ''premium'' to filter rows","Make sure to put string values in single quotes"]',
  '["Gunakan WHERE membership = ''premium'' untuk memfilter","Nilai string harus diapit tanda kutip tunggal"]',
  'easy',
  2
FROM sessions s
WHERE s.session_number = '04'
LIMIT 1;

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Products Under 500K',
  'Produk di Bawah 500K',
  'Find all products where price is less than 500000. Return name, category, and price, ordered by price ascending.',
  'Cari semua produk dengan harga kurang dari 500000. Tampilkan name, category, dan price, diurutkan dari harga terendah.',
  'SELECT name, category, price
FROM products
WHERE price < 500000
ORDER BY ',
  'SELECT name, category, price FROM products WHERE price < 500000 ORDER BY price ASC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":5,"description_en":"Should return 5 products under 500K","description_id":"Harus mengembalikan 5 produk di bawah 500K","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["name","category","price"],"description_en":"Must include name, category, price columns","description_id":"Harus menyertakan kolom name, category, price","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["ORDER BY","price"],"description_en":"Must ORDER BY price","description_id":"Harus ORDER BY price","points":30}
  ]',
  '["Use WHERE price < 500000 to filter by price","Use ORDER BY price ASC to sort ascending"]',
  '["Gunakan WHERE price < 500000 untuk filter harga","Gunakan ORDER BY price ASC untuk mengurutkan naik"]',
  'easy',
  3
FROM sessions s
WHERE s.session_number = '04'
LIMIT 1;

-- ============================================================
-- Seed: Session 05 — Aggregation & GROUP BY
-- ============================================================

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Orders Per Customer',
  'Jumlah Order per Pelanggan',
  'Count how many orders each customer has placed. Return customer_id and order_count, ordered by order_count descending.',
  'Hitung berapa banyak order yang ditempatkan setiap pelanggan. Tampilkan customer_id dan order_count, diurutkan dari terbanyak.',
  'SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY ',
  'SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id ORDER BY order_count DESC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":15,"description_en":"Should return 15 rows (one per customer)","description_id":"Harus mengembalikan 15 baris (satu per pelanggan)","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["customer_id","order_count"],"description_en":"Must have customer_id and order_count columns","description_id":"Harus memiliki kolom customer_id dan order_count","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["GROUP BY","customer_id"],"description_en":"Must use GROUP BY customer_id","description_id":"Harus menggunakan GROUP BY customer_id","points":30}
  ]',
  '["Use COUNT(*) AS order_count to count rows per group","GROUP BY customer_id groups results per customer","Add ORDER BY order_count DESC to sort by most orders first"]',
  '["Gunakan COUNT(*) AS order_count untuk menghitung baris","GROUP BY customer_id mengelompokkan per pelanggan","Tambahkan ORDER BY order_count DESC untuk mengurutkan"]',
  'medium',
  1
FROM sessions s
WHERE s.session_number = '05'
LIMIT 1;

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Total Revenue by Category',
  'Total Pendapatan per Kategori',
  'Calculate the total revenue (SUM of quantity * unit_price) per product category. Join order_items with products. Name the result total_revenue.',
  'Hitung total pendapatan (SUM dari quantity * unit_price) per kategori produk. Gabungkan order_items dengan products. Beri nama kolom total_revenue.',
  'SELECT p.category, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM order_items oi
JOIN products p ON ',
  'SELECT p.category, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY p.category ORDER BY total_revenue DESC;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":3,"description_en":"Should return 3 rows (one per category)","description_id":"Harus mengembalikan 3 baris (satu per kategori)","points":35},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["category","total_revenue"],"description_en":"Must have category and total_revenue columns","description_id":"Harus memiliki kolom category dan total_revenue","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["JOIN","GROUP BY"],"description_en":"Must use JOIN and GROUP BY","description_id":"Harus menggunakan JOIN dan GROUP BY","points":35}
  ]',
  '["JOIN products p ON p.id = oi.product_id links the two tables","GROUP BY p.category to aggregate per category","SUM(oi.quantity * oi.unit_price) calculates revenue per line item"]',
  '["JOIN products p ON p.id = oi.product_id menghubungkan dua tabel","GROUP BY p.category untuk agregasi per kategori","SUM(oi.quantity * oi.unit_price) menghitung pendapatan tiap baris"]',
  'medium',
  2
FROM sessions s
WHERE s.session_number = '05'
LIMIT 1;

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'High-Value Customers',
  'Pelanggan Bernilai Tinggi',
  'Find customers who have spent more than 10,000,000 total (sum of completed orders only). Show customer_id and total_spent. Use HAVING.',
  'Temukan pelanggan yang total pengeluarannya lebih dari 10.000.000 (dari order yang completed saja). Tampilkan customer_id dan total_spent. Gunakan HAVING.',
  'SELECT customer_id, SUM(total_amount) AS total_spent
FROM orders
WHERE status = ''completed''
GROUP BY customer_id
HAVING ',
  'SELECT customer_id, SUM(total_amount) AS total_spent FROM orders WHERE status = ''completed'' GROUP BY customer_id HAVING SUM(total_amount) > 10000000 ORDER BY total_spent DESC;',
  '[
    {"id":"tc1","validation_type":"contains_columns","expected_columns":["customer_id","total_spent"],"description_en":"Must have customer_id and total_spent columns","description_id":"Harus memiliki kolom customer_id dan total_spent","points":30},
    {"id":"tc2","validation_type":"custom","expected_value":["HAVING"],"description_en":"Must use HAVING clause","description_id":"Harus menggunakan klausa HAVING","points":40},
    {"id":"tc3","validation_type":"custom","expected_value":["WHERE","completed"],"description_en":"Must filter by completed status","description_id":"Harus memfilter status completed","points":30}
  ]',
  '["HAVING filters after GROUP BY — use it to filter aggregated values","HAVING SUM(total_amount) > 10000000 keeps only high spenders","WHERE filters rows BEFORE grouping; HAVING filters groups AFTER"]',
  '["HAVING memfilter setelah GROUP BY — gunakan untuk nilai agregat","HAVING SUM(total_amount) > 10000000 menyaring pelanggan bernilai tinggi","WHERE memfilter sebelum pengelompokan; HAVING memfilter setelah pengelompokan"]',
  'hard',
  3
FROM sessions s
WHERE s.session_number = '05'
LIMIT 1;

-- ============================================================
-- Seed: Session 06 — JOINs
-- ============================================================

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Customer Order Details',
  'Detail Order Pelanggan',
  'Write a query that shows each customer''s name alongside their order date and total_amount. Use a JOIN between customers and orders.',
  'Buat query yang menampilkan nama pelanggan beserta tanggal order dan total_amount. Gunakan JOIN antara customers dan orders.',
  'SELECT c.name, o.order_date, o.total_amount
FROM customers c
JOIN orders o ON ',
  'SELECT c.name, o.order_date, o.total_amount FROM customers c JOIN orders o ON o.customer_id = c.id ORDER BY o.order_date;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":50,"description_en":"Should return 50 rows (all orders with customer names)","description_id":"Harus mengembalikan 50 baris (semua order dengan nama pelanggan)","points":40},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["name","order_date","total_amount"],"description_en":"Must include name, order_date, total_amount","description_id":"Harus menyertakan name, order_date, total_amount","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["JOIN"],"description_en":"Must use JOIN","description_id":"Harus menggunakan JOIN","points":30}
  ]',
  '["JOIN orders o ON o.customer_id = c.id links customers to their orders","Use table aliases (c, o) to shorten column references","Each customer can appear multiple times — once per order"]',
  '["JOIN orders o ON o.customer_id = c.id menghubungkan pelanggan ke ordernya","Gunakan alias tabel (c, o) untuk mempersingkat referensi kolom","Setiap pelanggan bisa muncul beberapa kali — satu per order"]',
  'easy',
  1
FROM sessions s
WHERE s.session_number = '06'
LIMIT 1;

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Top Products by Sales',
  'Produk Terlaris',
  'Find the top 5 products by total quantity sold. Show product name and total_qty. Use a JOIN between order_items and products.',
  'Temukan 5 produk terlaris berdasarkan total kuantitas terjual. Tampilkan name produk dan total_qty. Gunakan JOIN antara order_items dan products.',
  'SELECT p.name, SUM(oi.quantity) AS total_qty
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY p.name
ORDER BY total_qty DESC
LIMIT ',
  'SELECT p.name, SUM(oi.quantity) AS total_qty FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY p.name ORDER BY total_qty DESC LIMIT 5;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":5,"description_en":"Should return exactly 5 rows","description_id":"Harus mengembalikan tepat 5 baris","points":35},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["name","total_qty"],"description_en":"Must include name and total_qty columns","description_id":"Harus menyertakan kolom name dan total_qty","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["LIMIT","5"],"description_en":"Must use LIMIT 5","description_id":"Harus menggunakan LIMIT 5","points":35}
  ]',
  '["LIMIT 5 restricts output to 5 rows","SUM(oi.quantity) totals the quantity for each product","GROUP BY p.name so each product appears once"]',
  '["LIMIT 5 membatasi output menjadi 5 baris","SUM(oi.quantity) menjumlahkan kuantitas per produk","GROUP BY p.name agar setiap produk muncul sekali"]',
  'medium',
  2
FROM sessions s
WHERE s.session_number = '06'
LIMIT 1;

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id,
  'sql',
  'Multi-Table Sales Report',
  'Laporan Penjualan Multi-Tabel',
  'Create a sales report showing: customer name, product name, quantity, and line_total (quantity * unit_price). Join customers, orders, order_items, and products. Limit to 20 rows.',
  'Buat laporan penjualan yang menampilkan: nama pelanggan, nama produk, quantity, dan line_total (quantity * unit_price). Gabungkan tabel customers, orders, order_items, dan products. Batasi 20 baris.',
  'SELECT c.name AS customer_name, p.name AS product_name,
       oi.quantity, (oi.quantity * oi.unit_price) AS line_total
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON ',
  'SELECT c.name AS customer_name, p.name AS product_name, oi.quantity, (oi.quantity * oi.unit_price) AS line_total FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id ORDER BY line_total DESC LIMIT 20;',
  '[
    {"id":"tc1","validation_type":"row_count","expected_value":20,"description_en":"Should return exactly 20 rows","description_id":"Harus mengembalikan tepat 20 baris","points":30},
    {"id":"tc2","validation_type":"contains_columns","expected_columns":["customer_name","product_name","quantity","line_total"],"description_en":"Must include all 4 columns","description_id":"Harus menyertakan keempat kolom","points":40},
    {"id":"tc3","validation_type":"custom","expected_value":["JOIN","JOIN","JOIN"],"description_en":"Must use at least 3 JOINs","description_id":"Harus menggunakan minimal 3 JOIN","points":30}
  ]',
  '["Chain JOINs: customers → orders → order_items → products","Use AS to rename calculated columns: (oi.quantity * oi.unit_price) AS line_total","Add LIMIT 20 at the end"]',
  '["Rangkai JOIN: customers → orders → order_items → products","Gunakan AS untuk kolom kalkulasi: (oi.quantity * oi.unit_price) AS line_total","Tambahkan LIMIT 20 di akhir query"]',
  'hard',
  3
FROM sessions s
WHERE s.session_number = '06'
LIMIT 1;
