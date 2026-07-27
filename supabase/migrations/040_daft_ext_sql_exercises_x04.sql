-- ============================================================
-- 040: SQL practice exercises for X04 · Data Collection with SQL.
--      Runnable against the ecommerce Playground schema
--      (customers/products/orders/order_items). Progression:
--      SELECT+WHERE → aggregation → INNER JOIN → JOIN+GROUP BY →
--      multi-table JOIN. Row counts verified against the seed data.
--      Idempotent via NOT EXISTS.
-- ============================================================

-- 1 · easy — SELECT + WHERE (7 premium customers)
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql',
  'Premium Customers', 'Pelanggan Premium',
  'Select the name and city of every premium customer.', 'Pilih nama dan kota setiap pelanggan premium.',
  E'-- Return name and city for customers whose membership is premium\n',
  E'SELECT name, city FROM customers WHERE membership = ''premium'';',
  '[{"id":"tc1","validation_type":"row_count","expected_value":7,"description_en":"Returns 7 premium customers","description_id":"Mengembalikan 7 pelanggan premium","points":40},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name","city"],"description_en":"Includes name and city","description_id":"Menyertakan name dan city","points":30},{"id":"tc3","validation_type":"custom","expected_value":["WHERE","membership"],"description_en":"Filters with WHERE on membership","description_id":"Memfilter dengan WHERE pada membership","points":30}]',
  '["Use WHERE membership = ''premium''","Select only the name and city columns"]','["Gunakan WHERE membership = ''premium''","Pilih hanya kolom name dan city"]',
  'easy', 'ecommerce', 1
FROM public.sessions s WHERE s.session_number='X04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Premium Customers');

-- 2 · easy — WHERE + ORDER BY (3 books)
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql',
  'Books by Price', 'Buku Berdasarkan Harga',
  'List the name and price of all Books, most expensive first.', 'Tampilkan nama dan harga semua Buku, termahal dulu.',
  E'-- List Books ordered by price, highest first\n',
  E'SELECT name, price FROM products WHERE category = ''Books'' ORDER BY price DESC;',
  '[{"id":"tc1","validation_type":"row_count","expected_value":3,"description_en":"Returns 3 books","description_id":"Mengembalikan 3 buku","points":40},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name","price"],"description_en":"Includes name and price","description_id":"Menyertakan name dan price","points":30},{"id":"tc3","validation_type":"custom","expected_value":["WHERE","ORDER BY"],"description_en":"Uses WHERE and ORDER BY","description_id":"Menggunakan WHERE dan ORDER BY","points":30}]',
  '["Filter with WHERE category = ''Books''","Sort with ORDER BY price DESC"]','["Filter dengan WHERE category = ''Books''","Urutkan dengan ORDER BY price DESC"]',
  'easy', 'ecommerce', 2
FROM public.sessions s WHERE s.session_number='X04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Books by Price');

-- 3 · medium — INNER JOIN (50 orders with customer name)
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql',
  'Orders with Customer Name', 'Order dengan Nama Pelanggan',
  'Join orders to customers so each order shows the customer name and total_amount.', 'Join orders ke customers agar tiap order menampilkan nama pelanggan dan total_amount.',
  E'-- Join orders (o) to customers (c) on customer_id\n',
  E'SELECT o.id, c.name, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id;',
  '[{"id":"tc1","validation_type":"row_count","expected_value":50,"description_en":"Returns all 50 orders","description_id":"Mengembalikan seluruh 50 order","points":40},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name"],"description_en":"Includes the customer name","description_id":"Menyertakan nama pelanggan","points":30},{"id":"tc3","validation_type":"custom","expected_value":["JOIN","ON"],"description_en":"Uses a JOIN with an ON condition","description_id":"Menggunakan JOIN dengan kondisi ON","points":30}]',
  '["Use JOIN customers c ON o.customer_id = c.id","Select c.name alongside the order columns"]','["Gunakan JOIN customers c ON o.customer_id = c.id","Pilih c.name bersama kolom order"]',
  'medium', 'ecommerce', 3
FROM public.sessions s WHERE s.session_number='X04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Orders with Customer Name');

-- 4 · hard — JOIN + GROUP BY (15 customers, revenue each)
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql',
  'Revenue per Customer', 'Revenue per Pelanggan',
  'Show each customer name and their total revenue (sum of order total_amount).', 'Tampilkan nama tiap pelanggan dan total revenue (jumlah total_amount order).',
  E'-- Total revenue per customer: JOIN then GROUP BY\n',
  E'SELECT c.name, SUM(o.total_amount) AS revenue FROM orders o JOIN customers c ON o.customer_id = c.id GROUP BY c.name;',
  '[{"id":"tc1","validation_type":"row_count","expected_value":15,"description_en":"One row per customer (15)","description_id":"Satu baris per pelanggan (15)","points":40},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name"],"description_en":"Includes the customer name","description_id":"Menyertakan nama pelanggan","points":25},{"id":"tc3","validation_type":"custom","expected_value":["JOIN","GROUP BY","SUM"],"description_en":"Uses JOIN, GROUP BY and SUM","description_id":"Menggunakan JOIN, GROUP BY, dan SUM","points":35}]',
  '["Join orders to customers, then GROUP BY c.name","Aggregate with SUM(o.total_amount)"]','["Join orders ke customers, lalu GROUP BY c.name","Agregasikan dengan SUM(o.total_amount)"]',
  'hard', 'ecommerce', 4
FROM public.sessions s WHERE s.session_number='X04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Revenue per Customer');

-- 5 · hard — multi-table JOIN (10 products, units sold)
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql',
  'Units Sold per Product', 'Unit Terjual per Produk',
  'Join order_items to products and show each product name with total units sold, highest first.', 'Join order_items ke products dan tampilkan tiap nama produk dengan total unit terjual, terbanyak dulu.',
  E'-- Units sold per product: JOIN order_items to products, then GROUP BY\n',
  E'SELECT p.name, SUM(oi.quantity) AS units_sold FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.name ORDER BY units_sold DESC;',
  '[{"id":"tc1","validation_type":"row_count","expected_value":10,"description_en":"One row per product sold (10)","description_id":"Satu baris per produk terjual (10)","points":40},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name"],"description_en":"Includes the product name","description_id":"Menyertakan nama produk","points":25},{"id":"tc3","validation_type":"custom","expected_value":["JOIN","GROUP BY","SUM"],"description_en":"Uses JOIN, GROUP BY and SUM","description_id":"Menggunakan JOIN, GROUP BY, dan SUM","points":35}]',
  '["Join order_items oi to products p on oi.product_id = p.id","GROUP BY p.name and SUM(oi.quantity)"]','["Join order_items oi ke products p pada oi.product_id = p.id","GROUP BY p.name dan SUM(oi.quantity)"]',
  'hard', 'ecommerce', 5
FROM public.sessions s WHERE s.session_number='X04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Units Sold per Product');
