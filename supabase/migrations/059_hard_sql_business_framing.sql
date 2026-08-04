-- ============================================================
-- 059: Hard SQL exercises read as instructions ("Use GROUP BY and HAVING",
--      "Join customers, orders, order_items, and products"), which hands
--      the learner the technique instead of asking them to find it.
--
--   Hard should mean "here is a business question, go figure out the SQL" —
--   not "here is the SQL clause, fill in the blank". This rewrites the
--   descriptions of the hard-difficulty SQL exercises as scenarios that need
--   interpretation, and drops the technique name-drops. The "how" still lives
--   in hints_en/hints_id for learners who get stuck, since those already
--   cover HAVING vs WHERE, JOIN order, etc. — nothing else changes:
--   starter_code, solution_code, test_cases and hints are untouched.
-- ============================================================

-- Session 04 "Basic SQL" #9, and its F08 "Introduction to SQL" duplicate.
UPDATE public.exercises e
SET description_en = 'Procurement wants to shortlist premium categories for a limited-edition bundle — categories where the average product price is above 1,000,000. Which categories make the cut? Return category and avg_price, most expensive first.',
    description_id = 'Tim procurement ingin menyortir kategori premium untuk bundel edisi terbatas — kategori dengan harga rata-rata produk di atas 1.000.000. Kategori mana saja yang lolos? Tampilkan category dan avg_price, termahal dulu.'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number IN ('04', 'F08') AND e.order_num = 9
  AND e.title_en = 'Categories with High Average Price';

-- Session 04 "Basic SQL" #10, and its F08 duplicate.
UPDATE public.exercises e
SET description_en = 'The loyalty team wants to launch a rewards perk for repeat buyers, but only for those who placed 4 orders or more. Who qualifies, and how many orders has each of them made? Return customer_id and order_count, most orders first.',
    description_id = 'Tim loyalitas ingin meluncurkan program reward untuk pembeli berulang, tapi hanya untuk yang sudah memesan 4 kali atau lebih. Siapa saja yang memenuhi syarat, dan berapa kali masing-masing memesan? Tampilkan customer_id dan order_count, terbanyak dulu.'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number IN ('04', 'F08') AND e.order_num = 10
  AND e.title_en = 'Loyal Customers';

-- Session 05 "Advanced SQL — JOIN, Subquery, CTE" #3.
UPDATE public.exercises e
SET description_en = 'Finance is building a VIP outreach list: customers whose completed-order spend adds up to more than 10,000,000. Who belongs on that list, and how much have they spent? Return customer_id and total_spent, biggest spenders first.',
    description_id = 'Tim finance sedang menyusun daftar VIP: pelanggan yang total belanjanya (dari order completed saja) lebih dari 10.000.000. Siapa saja yang masuk daftar itu, dan berapa total belanja mereka? Tampilkan customer_id dan total_spent, paling besar dulu.'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = '05' AND e.order_num = 3
  AND e.title_en = 'High-Value Customers';

-- Session 06 "SQL Window Functions + Business Case Analysis" #3.
UPDATE public.exercises e
SET description_en = 'Ops wants a spot-check before the weekly sales review: for each line item, show who bought it, what they bought, how many units, and the line_total (`quantity * unit_price`). Pull the 20 highest-value lines.',
    description_id = 'Tim ops ingin melakukan spot-check sebelum rapat penjualan mingguan: untuk tiap line item, tampilkan siapa pembelinya, apa yang dibeli, berapa banyak unit, dan line_total (`quantity * unit_price`). Ambil 20 line dengan nilai tertinggi.'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = '06' AND e.order_num = 3
  AND e.title_en = 'Multi-Table Sales Report';

-- X04 "Data Collection with SQL" #6 — dropped the "Filtering on a COUNT needs
-- HAVING, not WHERE" giveaway; that nudge already lives in hints_en/hints_id.
UPDATE public.exercises e
SET description_en = 'Marketing wants to launch city-level campaigns, but only where the volume justifies it — cities with more than 900 completed orders. Which cities clear that bar? Return exactly: `city`, `orders`, busiest first.',
    description_id = 'Tim marketing ingin meluncurkan kampanye di level kota, tapi hanya di kota dengan volume yang cukup besar — lebih dari 900 order Completed. Kota mana saja yang lolos? Kembalikan tepat: `city`, `orders`, terbanyak dulu.'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X04' AND e.order_num = 6
  AND e.title_en = 'Cities Worth Their Own Campaign';

-- X04 #7 (Q6) — dropped "Join orders to customers and group by
-- acquisition_channel"; the output contract (Return exactly: ...) stays,
-- since that is the grading spec, not the technique.
UPDATE public.exercises e
SET description_en = 'Marketing spends across six acquisition channels, but which ones actually bring customers who buy, not just click? For each channel, compare how many distinct customers converted and how much revenue they generated (completed orders only). Return exactly: `acquisition_channel`, `customers` (distinct buyers), `revenue` (rounded), highest revenue first.',
    description_id = 'Tim marketing beriklan lewat enam acquisition channel, tapi channel mana yang benar-benar mendatangkan pembeli, bukan sekadar klik? Untuk tiap channel, bandingkan berapa banyak pelanggan unik yang benar-benar membeli dan berapa revenue yang mereka hasilkan (hanya order Completed). Kembalikan tepat: `acquisition_channel`, `customers` (pembeli unik), `revenue` (dibulatkan), revenue tertinggi dulu.'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X04' AND e.order_num = 7
  AND e.title_en = 'Q6 — Which Acquisition Channel Brings the Best Customers?';

-- X04 #8 (Q7) — reframed as the business tension ("does it pay off") instead
-- of a "group by X and compare Y" instruction; formula and output contract
-- stay, since a learner cannot be expected to invent the margin formula.
UPDATE public.exercises e
SET description_en = 'Sales keeps pushing deeper discounts to move volume, but does it actually pay off? For each discount tier, compare average order quantity against margin (`profit / revenue * 100`) on completed orders. Return exactly: `discount_pct`, `avg_quantity` (rounded to 2 decimals), `margin_pct` (rounded to 1 decimal), by discount ascending. Read the answer off your own result.',
    description_id = 'Tim sales terus mendorong diskon yang lebih dalam demi mengejar volume, tapi apakah itu benar-benar menguntungkan? Untuk tiap tingkat diskon, bandingkan rata-rata quantity per order dengan margin (`profit / revenue * 100`) pada order Completed. Kembalikan tepat: `discount_pct`, `avg_quantity` (2 desimal), `margin_pct` (1 desimal), urut diskon menaik. Baca jawabannya dari hasilmu sendiri.'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X04' AND e.order_num = 8
  AND e.title_en = 'Q7 — Does Discounting Actually Pay?';
