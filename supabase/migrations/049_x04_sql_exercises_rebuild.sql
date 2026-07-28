-- ============================================================
-- 049: REBUILD of X04 SQL exercises.
--   The ecommerce Playground dataset was regenerated (commit 986afca):
--   8 tables, products.category replaced by category_id + categories,
--   customers 15→40, orders 50→200. Every previous X04 exercise had a
--   stale row_count or referenced a dropped column, so correct answers
--   were being marked WRONG.
--
--   This replaces them with a harder set (JOIN via lookup table,
--   3-table join, HAVING, LEFT JOIN anti-join, subquery) validated on
--   ACTUAL RESULT VALUES (exact_match, order-insensitive) rather than
--   keyword sniffing — so any correct formulation passes.
--   Every expected value below was computed by executing the solution
--   against the real sql.js dataset.
-- ============================================================

DELETE FROM public.exercises
WHERE session_id = (SELECT id FROM public.sessions WHERE session_number = 'X04');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Premium & VIP Customers in Java', 'Pelanggan Premium & VIP di Java', 'From `customers`, list every premium OR vip member in the Java region. Return exactly these columns: `name`, `city`, `membership`.', 'Dari `customers`, tampilkan setiap member premium ATAU vip di region Java. Kembalikan tepat kolom ini: `name`, `city`, `membership`.',
  '-- Premium or VIP members located in the Java region
-- Return: name, city, membership
', 'SELECT name, city, membership FROM customers WHERE membership IN (''premium'',''vip'') AND region = ''Java'';',
  '[{"id":"tc1","validation_type":"exact_match","expected_rows":[{"name":"Putri Indrawati","city":"Surabaya","membership":"premium"},{"name":"Hendra Lestari","city":"Bandung","membership":"vip"},{"name":"Yuni Gunawan","city":"Yogyakarta","membership":"premium"},{"name":"Ahmad Lestari","city":"Jakarta","membership":"vip"},{"name":"Dewi Gunawan","city":"Bandung","membership":"premium"},{"name":"Rizky Setiawan","city":"Yogyakarta","membership":"premium"},{"name":"Sari Gunawan","city":"Surabaya","membership":"premium"},{"name":"Andi Setiawan","city":"Semarang","membership":"vip"}],"description_en":"Returns the correct 8 row(s) with the right values","description_id":"Mengembalikan 8 baris yang benar dengan nilai yang tepat","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name","city","membership"],"description_en":"Returns the required columns: name, city, membership","description_id":"Mengembalikan kolom yang diminta: name, city, membership","points":30}]'::jsonb, '["Two memberships qualify — IN (...) or OR both work","Do not forget to also filter the region"]'::jsonb, '["Dua membership memenuhi — IN (...) atau OR sama-sama bisa","Jangan lupa filter region juga"]'::jsonb,
  'easy', 'ecommerce', 1
FROM public.sessions s WHERE s.session_number = 'X04';

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Books Priced by Category Join', 'Buku lewat Join Kategori', 'Products no longer store a category name — join `products` to `categories`. List all products in the **Books** category, most expensive first. Return exactly: `name`, `price`.', 'Produk tidak lagi menyimpan nama kategori — join `products` ke `categories`. Tampilkan semua produk kategori **Books**, termahal dulu. Kembalikan tepat: `name`, `price`.',
  '-- Join products to categories, filter to Books
-- Return: name, price (highest price first)
', 'SELECT p.name, p.price FROM products p JOIN categories c ON c.id = p.category_id WHERE c.name = ''Books'' ORDER BY p.price DESC;',
  '[{"id":"tc1","validation_type":"exact_match","expected_rows":[{"name":"Machine Learning 101","price":210000},{"name":"Financial Modeling","price":195000},{"name":"Python Programming","price":185000},{"name":"Business Statistics","price":175000},{"name":"Data Analytics Guide","price":165000},{"name":"SQL Mastery","price":155000}],"description_en":"Returns the correct 6 row(s) with the right values","description_id":"Mengembalikan 6 baris yang benar dengan nilai yang tepat","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name","price"],"description_en":"Returns the required columns: name, price","description_id":"Mengembalikan kolom yang diminta: name, price","points":30}]'::jsonb, '["products.category_id points at categories.id","Filter on the category table''s name column"]'::jsonb, '["products.category_id menunjuk ke categories.id","Filter pada kolom name di tabel categories"]'::jsonb,
  'easy', 'ecommerce', 2
FROM public.sessions s WHERE s.session_number = 'X04';

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Top 5 Products by Revenue', '5 Produk Teratas berdasarkan Revenue', 'Join `order_items` to `products` and return the 5 products with the highest total revenue, where revenue is `quantity * unit_price`. Return exactly: `name`, `revenue`.', 'Join `order_items` ke `products` dan kembalikan 5 produk dengan total revenue tertinggi, di mana revenue = `quantity * unit_price`. Kembalikan tepat: `name`, `revenue`.',
  '-- Total revenue per product, top 5
-- revenue = SUM(quantity * unit_price)
-- Return: name, revenue
', 'SELECT p.name, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON p.id = oi.product_id GROUP BY p.id, p.name ORDER BY revenue DESC LIMIT 5;',
  '[{"id":"tc1","validation_type":"exact_match","expected_rows":[{"name":"Laptop Pro 15\"","revenue":462500000},{"name":"Smartphone X","revenue":249200000},{"name":"Monitor 27\"","revenue":175750000},{"name":"Ergonomic Chair","revenue":175500000},{"name":"Tablet 10\"","revenue":140400000}],"description_en":"Returns the correct 5 row(s) with the right values","description_id":"Mengembalikan 5 baris yang benar dengan nilai yang tepat","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name","revenue"],"description_en":"Returns the required columns: name, revenue","description_id":"Mengembalikan kolom yang diminta: name, revenue","points":30}]'::jsonb, '["Revenue per line is quantity * unit_price","Group by the product, then ORDER BY ... DESC LIMIT 5"]'::jsonb, '["Revenue per baris adalah quantity * unit_price","Group per produk, lalu ORDER BY ... DESC LIMIT 5"]'::jsonb,
  'medium', 'ecommerce', 3
FROM public.sessions s WHERE s.session_number = 'X04';

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Revenue per Category (Completed Orders Only)', 'Revenue per Kategori (Hanya Order Completed)', 'Three-table join: `order_items` → `products` → `categories`, plus `orders` to filter. Count only orders with status `completed`. Revenue is `quantity * unit_price`. Return exactly: `category`, `revenue`, highest first.', 'Join tiga tabel: `order_items` → `products` → `categories`, plus `orders` untuk memfilter. Hitung hanya order berstatus `completed`. Revenue = `quantity * unit_price`. Kembalikan tepat: `category`, `revenue`, tertinggi dulu.',
  '-- Revenue per category, completed orders only
-- revenue = SUM(quantity * unit_price)
-- Return: category, revenue
', 'SELECT c.name AS category, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN categories c ON c.id = p.category_id JOIN orders o ON o.id = oi.order_id WHERE o.status = ''completed'' GROUP BY c.name ORDER BY revenue DESC;',
  '[{"id":"tc1","validation_type":"exact_match","expected_rows":[{"category":"Electronics","revenue":1062050000},{"category":"Furniture","revenue":242900000},{"category":"Home & Kitchen","revenue":110310000},{"category":"Sports & Outdoors","revenue":108010000},{"category":"Fashion","revenue":74370000},{"category":"Books","revenue":25770000}],"description_en":"Returns the correct 6 row(s) with the right values","description_id":"Mengembalikan 6 baris yang benar dengan nilai yang tepat","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["category","revenue"],"description_en":"Returns the required columns: category, revenue","description_id":"Mengembalikan kolom yang diminta: category, revenue","points":30}]'::jsonb, '["You need orders too — that is where status lives","Alias the category name column AS category"]'::jsonb, '["Anda juga butuh orders — di situlah status berada","Beri alias kolom nama kategori AS category"]'::jsonb,
  'medium', 'ecommerce', 4
FROM public.sessions s WHERE s.session_number = 'X04';

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Categories With More Than 4 Products', 'Kategori dengan Lebih dari 4 Produk', 'Which categories carry more than 4 products? Filtering on an aggregate needs `HAVING`, not `WHERE`. Return exactly: `category`, `product_count`.', 'Kategori mana yang punya lebih dari 4 produk? Memfilter hasil agregat butuh `HAVING`, bukan `WHERE`. Kembalikan tepat: `category`, `product_count`.',
  '-- Categories carrying more than 4 products
-- Return: category, product_count
', 'SELECT c.name AS category, COUNT(*) AS product_count FROM products p JOIN categories c ON c.id = p.category_id GROUP BY c.name HAVING COUNT(*) > 4 ORDER BY product_count DESC;',
  '[{"id":"tc1","validation_type":"exact_match","expected_rows":[{"category":"Electronics","product_count":10},{"category":"Books","product_count":6}],"description_en":"Returns the correct 2 row(s) with the right values","description_id":"Mengembalikan 2 baris yang benar dengan nilai yang tepat","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["category","product_count"],"description_en":"Returns the required columns: category, product_count","description_id":"Mengembalikan kolom yang diminta: category, product_count","points":30}]'::jsonb, '["WHERE cannot filter COUNT(*) — use HAVING","Group by the category name first"]'::jsonb, '["WHERE tidak bisa memfilter COUNT(*) — pakai HAVING","Group berdasarkan nama kategori dulu"]'::jsonb,
  'hard', 'ecommerce', 5
FROM public.sessions s WHERE s.session_number = 'X04';

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Products That Have Never Been Reviewed', 'Produk yang Belum Pernah Diulas', 'Find products with no row in `reviews`. An INNER JOIN would hide them — use a LEFT JOIN and keep only the rows where the review side is NULL. Return exactly: `name`.', 'Temukan produk yang tidak punya baris di `reviews`. INNER JOIN akan menyembunyikannya — pakai LEFT JOIN dan simpan hanya baris yang sisi review-nya NULL. Kembalikan tepat: `name`.',
  '-- Products with no reviews at all (anti-join)
-- Return: name
', 'SELECT p.name FROM products p LEFT JOIN reviews r ON r.product_id = p.id WHERE r.id IS NULL;',
  '[{"id":"tc1","validation_type":"exact_match","expected_rows":[{"name":"Financial Modeling"}],"description_en":"Returns the correct 1 row(s) with the right values","description_id":"Mengembalikan 1 baris yang benar dengan nilai yang tepat","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name"],"description_en":"Returns the required columns: name","description_id":"Mengembalikan kolom yang diminta: name","points":30}]'::jsonb, '["LEFT JOIN keeps products even with no matching review","The unmatched rows are the ones WHERE r.id IS NULL"]'::jsonb, '["LEFT JOIN menyimpan produk walau tak ada review yang cocok","Baris tak cocok adalah yang WHERE r.id IS NULL"]'::jsonb,
  'hard', 'ecommerce', 6
FROM public.sessions s WHERE s.session_number = 'X04';

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Customers With 8+ Completed Orders', 'Pelanggan dengan 8+ Order Completed', 'Join `orders` to `customers`, count only `completed` orders, and keep customers with at least 8. Note: customer names repeat, so group by the customer **id**. Return exactly: `name`, `completed_orders`.', 'Join `orders` ke `customers`, hitung hanya order `completed`, dan simpan pelanggan dengan minimal 8. Catatan: nama pelanggan bisa berulang, jadi group berdasarkan **id** pelanggan. Kembalikan tepat: `name`, `completed_orders`.',
  '-- Customers with at least 8 completed orders
-- Return: name, completed_orders
', 'SELECT c.name, COUNT(*) AS completed_orders FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = ''completed'' GROUP BY c.id, c.name HAVING COUNT(*) >= 8 ORDER BY completed_orders DESC;',
  '[{"id":"tc1","validation_type":"exact_match","expected_rows":[{"name":"Fitri Lestari","completed_orders":9},{"name":"Agus Santoso","completed_orders":8}],"description_en":"Returns the correct 2 row(s) with the right values","description_id":"Mengembalikan 2 baris yang benar dengan nilai yang tepat","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name","completed_orders"],"description_en":"Returns the required columns: name, completed_orders","description_id":"Mengembalikan kolom yang diminta: name, completed_orders","points":30}]'::jsonb, '["WHERE filters the rows, HAVING filters the groups","Group by c.id (not just the name) so duplicates stay separate"]'::jsonb, '["WHERE menyaring baris, HAVING menyaring grup","Group berdasarkan c.id (bukan hanya nama) agar duplikat tetap terpisah"]'::jsonb,
  'hard', 'ecommerce', 7
FROM public.sessions s WHERE s.session_number = 'X04';

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', 'Above-Average Spenders (Subquery)', 'Pembelanja di Atas Rata-rata (Subquery)', 'Find customers whose total spend on `completed` orders is greater than the average total spend across all customers. The comparison value comes from a subquery. Return exactly: `name`, `total_spent`.', 'Temukan pelanggan yang total belanja order `completed`-nya lebih besar dari rata-rata total belanja seluruh pelanggan. Nilai pembandingnya berasal dari subquery. Kembalikan tepat: `name`, `total_spent`.',
  '-- Customers spending more than the average customer total
-- Return: name, total_spent
', 'SELECT c.name, SUM(o.total_amount) AS total_spent FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = ''completed'' GROUP BY c.id, c.name HAVING SUM(o.total_amount) > (SELECT AVG(t) FROM (SELECT SUM(total_amount) AS t FROM orders WHERE status = ''completed'' GROUP BY customer_id)) ORDER BY total_spent DESC;',
  '[{"id":"tc1","validation_type":"row_count","expected_value":19,"description_en":"Returns 19 customers","description_id":"Mengembalikan 19 pelanggan","points":70},{"id":"tc2","validation_type":"contains_columns","expected_columns":["name","total_spent"],"description_en":"Returns the required columns: name, total_spent","description_id":"Mengembalikan kolom yang diminta: name, total_spent","points":30}]'::jsonb, '["First build per-customer totals, then average those totals","The subquery goes on the right-hand side of HAVING"]'::jsonb, '["Bangun dulu total per pelanggan, lalu rata-ratakan total itu","Subquery ditaruh di sisi kanan HAVING"]'::jsonb,
  'hard', 'ecommerce', 8
FROM public.sessions s WHERE s.session_number = 'X04';


