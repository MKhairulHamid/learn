# Generates supabase/migrations/055_x04_seduh_sql_exercises.sql.
#
# Session X04 teaches SELECT / WHERE / ORDER BY / GROUP BY / HAVING / JOIN on the
# final-project data, so every exercise here is one of the brief's own business
# questions rather than a toy query.
#
# Expected rows are not written by hand — each solution is executed against a
# SQLite database built from public/project/data/*.csv, the same CSVs the browser
# playground loads. That keeps the answer key and the learner's database in step:
# regenerate the dataset, re-run this, and the tests still pass.
#
#   python scripts/gen-project-files.py     # first — writes the CSVs
#   python scripts/gen-x04-exercises.py
#
# The evaluator rounds numbers to 2 decimals when comparing, so every aggregate
# below is wrapped in ROUND() to keep float noise out of the comparison.

import csv
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'public' / 'project' / 'data'
OUT = ROOT / 'supabase' / 'migrations' / '063_x04_seduh_sql_exercises_v02.sql'

# Mirrors SEDUH_SCHEMA_SQL in src/data/datasets/seduh.ts — constraint-free,
# because these CSVs are the RAW tables: duplicate order_id values, blank age
# and blank city are all still in there.
SCHEMA = """
CREATE TABLE products (product_id TEXT, sku_code TEXT, product_name TEXT, category TEXT,
  base_price INTEGER, unit_cost INTEGER, launch_date TEXT);
CREATE TABLE customers (customer_id TEXT, customer_name TEXT, phone TEXT, gender TEXT,
  age INTEGER, city TEXT, province TEXT, signup_date TEXT, acquisition_channel TEXT);
CREATE TABLE orders (order_id TEXT, order_date TEXT, customer_id TEXT,
  product_id TEXT, quantity INTEGER, unit_price INTEGER, discount_pct REAL, channel TEXT,
  payment_method TEXT, city TEXT, province TEXT, order_status TEXT, rating INTEGER);
CREATE TABLE marketing_spend (month TEXT, channel TEXT, spend_idr INTEGER,
  impressions INTEGER, clicks INTEGER);
"""

NUMERIC = {
    'products': {4, 5},
    'customers': {4},
    'orders': {4, 5, 6, 12},
    'marketing_spend': {2, 3, 4},
}


def build_db():
    con = sqlite3.connect(':memory:')
    con.executescript(SCHEMA)
    for table in ['products', 'customers', 'orders', 'marketing_spend']:
        with (DATA / f'{table}.csv').open(encoding='utf-8', newline='') as fh:
            rows = list(csv.reader(fh))
        header, body = rows[0], rows[1:]
        num = NUMERIC[table]
        clean = [[None if c == '' else (float(c) if i in num else c)
                  for i, c in enumerate(row)] for row in body]
        con.executemany(
            f'INSERT INTO {table} VALUES ({",".join("?" * len(header))})', clean)
    con.commit()
    return con


# ── The exercises ────────────────────────────────────────────────────────────
# (title_en, title_id, desc_en, desc_id, starter, solution, hints_en, hints_id,
#  difficulty, columns)

EXERCISES = [
    (
        'Roasted Beans, Most Expensive First',
        'Roasted Beans, Termahal Dulu',
        'Seduh sells six categories. List every product in the **Roasted Beans** category, '
        'most expensive first. Return exactly: `product_name`, `base_price`. '
        'This is the raw data, so `category` is not spelled consistently yet — match the exact '
        'value and note which rows that leaves out.',
        'Seduh menjual enam kategori. Tampilkan semua produk kategori **Roasted Beans**, '
        'termahal dulu. Kembalikan tepat: `product_name`, `base_price`. '
        'Ini data mentah, jadi penulisan `category` belum seragam — cocokkan nilai persisnya '
        'dan perhatikan baris mana yang jadi tidak ikut.',
        '-- Roasted Beans products, most expensive first\n'
        '-- Return: product_name, base_price\n',
        "SELECT product_name, base_price FROM products WHERE category = 'Roasted Beans' "
        'ORDER BY base_price DESC;',
        ['Filter with WHERE category = ...', 'ORDER BY ... DESC puts the largest first'],
        ['Filter dengan WHERE category = ...', 'ORDER BY ... DESC menaruh yang terbesar dulu'],
        'easy', ['product_name', 'base_price'],
    ),
    (
        'Which Channels Does Seduh Sell On?',
        'Seduh Berjualan di Channel Apa Saja?',
        'Count the **completed** orders per sales channel. Remember: only '
        "`order_status = 'Completed'` counts. Return exactly: `channel`, `orders`, busiest first. "
        'The data is raw, so you will get far more than four channels — that mess is the finding.',
        'Hitung jumlah order **Completed** per channel penjualan. Ingat: hanya '
        "`order_status = 'Completed'` yang dihitung. Kembalikan tepat: `channel`, `orders`, terbanyak dulu. "
        'Datanya mentah, jadi channel-nya akan jauh lebih dari empat — keberantakan itulah temuannya.',
        '-- Completed orders per channel\n-- Return: channel, orders\n',
        "SELECT channel, COUNT(*) AS orders FROM orders WHERE order_status = 'Completed' "
        'GROUP BY channel ORDER BY orders DESC;',
        ['WHERE filters rows before grouping', 'COUNT(*) counts rows in each group'],
        ['WHERE memfilter baris sebelum pengelompokan', 'COUNT(*) menghitung baris di tiap grup'],
        'easy', ['channel', 'orders'],
    ),
    (
        'Q2 — Which Channel Is Most Valuable After Discount?',
        'Q2 — Channel Mana yang Paling Bernilai Setelah Diskon?',
        'Gross revenue flatters a discount-heavy channel. Compute revenue **after** discount: '
        '`quantity * unit_price * (1 - discount_pct)`, completed orders only. '
        'Return exactly: `channel`, `revenue` (rounded, no decimals), highest first. '
        'Raw channel spellings split one channel across several rows; say so in your answer.',
        'Revenue kotor membuat channel yang banyak diskon terlihat bagus. Hitung revenue '
        '**setelah** diskon: `quantity * unit_price * (1 - discount_pct)`, hanya order Completed. '
        'Kembalikan tepat: `channel`, `revenue` (dibulatkan, tanpa desimal), tertinggi dulu. '
        'Penulisan channel yang mentah memecah satu channel jadi beberapa baris; sebutkan itu di jawabanmu.',
        '-- Q2: revenue after discount, per channel\n-- Return: channel, revenue\n',
        'SELECT channel, ROUND(SUM(quantity * unit_price * (1 - discount_pct))) AS revenue '
        "FROM orders WHERE order_status = 'Completed' GROUP BY channel ORDER BY revenue DESC;",
        ['Discount is a fraction — multiply by (1 - discount_pct)',
         'Wrap the SUM in ROUND() so the result has no decimals'],
        ['Diskon berupa pecahan — kalikan dengan (1 - discount_pct)',
         'Bungkus SUM dengan ROUND() agar hasilnya tanpa desimal'],
        'medium', ['channel', 'revenue'],
    ),
    (
        'Q1 — Profit by Category, Not Revenue',
        'Q1 — Profit per Kategori, Bukan Revenue',
        'The category that sells most is not always the one that earns most. `unit_cost` lives '
        'in `products`, so you need a JOIN. Profit per line is '
        '`quantity * (unit_price * (1 - discount_pct) - unit_cost)`, completed orders only. '
        'Return exactly: `category`, `profit` (rounded), highest first. '
        'Inconsistent category names split two of the six categories in two — that is what '
        'Session 2 will fix.',
        'Kategori yang paling laku belum tentu yang paling untung. `unit_cost` ada di `products`, '
        'jadi kamu butuh JOIN. Profit per baris = '
        '`quantity * (unit_price * (1 - discount_pct) - unit_cost)`, hanya order Completed. '
        'Kembalikan tepat: `category`, `profit` (dibulatkan), tertinggi dulu. '
        'Penamaan kategori yang tidak konsisten memecah dua dari enam kategori — itulah yang '
        'akan diperbaiki di Sesi 2.',
        '-- Q1: profit per category (needs products.unit_cost)\n-- Return: category, profit\n',
        'SELECT p.category, ROUND(SUM(o.quantity * (o.unit_price * (1 - o.discount_pct) '
        '- p.unit_cost))) AS profit FROM orders o JOIN products p ON p.product_id = o.product_id '
        "WHERE o.order_status = 'Completed' GROUP BY p.category ORDER BY profit DESC;",
        ['JOIN products ON p.product_id = o.product_id',
         'Subtract unit_cost per unit, then multiply by quantity'],
        ['JOIN products ON p.product_id = o.product_id',
         'Kurangi unit_cost per unit, lalu kalikan dengan quantity'],
        'medium', ['category', 'profit'],
    ),
    (
        'Q3 — Monthly Revenue in 2025',
        'Q3 — Revenue Bulanan di 2025',
        'Build the 2025 trend. `order_date` is text in `YYYY-MM-DD` form, so `substr(order_date, 1, 7)` '
        'gives you the month. Completed orders only. Return exactly: `month`, `revenue` (rounded), '
        'in date order. A few hundred rows still store the date as `dd/mm/yyyy` text, so this filter '
        'quietly skips them — check how many before you trust the trend.',
        'Bangun tren 2025. `order_date` berupa teks `YYYY-MM-DD`, jadi `substr(order_date, 1, 7)` '
        'memberi bulannya. Hanya order Completed. Kembalikan tepat: `month`, `revenue` (dibulatkan), '
        'urut tanggal. Beberapa ratus baris masih menyimpan tanggal sebagai teks `dd/mm/yyyy`, jadi '
        'filter ini diam-diam melewatkannya — cek berapa banyak sebelum memercayai trennya.',
        '-- Q3: monthly revenue for 2025 only\n-- Return: month, revenue\n',
        "SELECT substr(order_date, 1, 7) AS month, "
        'ROUND(SUM(quantity * unit_price * (1 - discount_pct))) AS revenue FROM orders '
        "WHERE order_status = 'Completed' AND order_date >= '2025-01-01' "
        "AND order_date < '2026-01-01' GROUP BY month ORDER BY month;",
        ["substr(order_date, 1, 7) turns 2025-03-14 into 2025-03",
         'Filter the year in WHERE, then GROUP BY the month expression'],
        ["substr(order_date, 1, 7) mengubah 2025-03-14 menjadi 2025-03",
         'Filter tahunnya di WHERE, lalu GROUP BY ekspresi bulan tersebut'],
        'medium', ['month', 'revenue'],
    ),
    (
        'Cities Worth Their Own Campaign',
        'Kota yang Layak Dapat Kampanye Sendiri',
        'Marketing wants to launch city-level campaigns, but only where the volume justifies '
        'it — cities with more than 900 completed orders. Which cities clear that bar? '
        'Return exactly: `city`, `orders`, busiest first.',
        'Tim marketing ingin meluncurkan kampanye di level kota, tapi hanya di kota dengan volume '
        'yang cukup besar — lebih dari 900 order Completed. Kota mana saja yang lolos? '
        'Kembalikan tepat: `city`, `orders`, terbanyak dulu.',
        '-- Cities with more than 900 completed orders\n-- Return: city, orders\n',
        "SELECT city, COUNT(*) AS orders FROM orders WHERE order_status = 'Completed' "
        'GROUP BY city HAVING COUNT(*) > 900 ORDER BY orders DESC;',
        ['WHERE runs before grouping, HAVING runs after',
         'You still need the completed-orders filter in WHERE'],
        ['WHERE berjalan sebelum pengelompokan, HAVING sesudahnya',
         'Filter order Completed tetap diperlukan di WHERE'],
        'hard', ['city', 'orders'],
    ),
    (
        'Q6 — Which Acquisition Channel Brings the Best Customers?',
        'Q6 — Channel Akuisisi Mana yang Membawa Customer Terbaik?',
        'Marketing spends across six acquisition channels, but which ones actually bring '
        'customers who buy, not just click? For each channel, compare how many distinct customers '
        'converted and how much revenue they generated (completed orders only). Return exactly: '
        '`acquisition_channel`, `customers` (distinct buyers), `revenue` (rounded), '
        'highest revenue first.',
        'Tim marketing beriklan lewat enam acquisition channel, tapi channel mana yang '
        'benar-benar mendatangkan pembeli, bukan sekadar klik? Untuk tiap channel, bandingkan '
        'berapa banyak pelanggan unik yang benar-benar membeli dan berapa revenue yang mereka '
        'hasilkan (hanya order Completed). Kembalikan tepat: `acquisition_channel`, `customers` '
        '(pembeli unik), `revenue` (dibulatkan), revenue tertinggi dulu.',
        '-- Q6: value of each acquisition channel\n'
        '-- Return: acquisition_channel, customers, revenue\n',
        'SELECT c.acquisition_channel, COUNT(DISTINCT o.customer_id) AS customers, '
        'ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct))) AS revenue '
        'FROM orders o JOIN customers c ON c.customer_id = o.customer_id '
        "WHERE o.order_status = 'Completed' GROUP BY c.acquisition_channel ORDER BY revenue DESC;",
        ['COUNT(DISTINCT ...) so a repeat buyer is not counted twice',
         'Spend lives in marketing_spend, but its channel names differ — that is the next step'],
        ['COUNT(DISTINCT ...) agar repeat buyer tidak terhitung dua kali',
         'Spend ada di marketing_spend, tapi nama channel-nya berbeda — itu langkah berikutnya'],
        'hard', ['acquisition_channel', 'customers', 'revenue'],
    ),
    (
        'Q7 — Does Discounting Actually Pay?',
        'Q7 — Apakah Diskon Benar-benar Menguntungkan?',
        'Sales keeps pushing deeper discounts to move volume, but does it actually pay off? '
        'For each discount tier, compare average order quantity against margin '
        '(`profit / revenue * 100`) on completed orders. Return exactly: `discount_pct`, '
        '`avg_quantity` (rounded to 2 decimals), `margin_pct` (rounded to 1 decimal), '
        'by discount ascending. Read the answer off your own result.',
        'Tim sales terus mendorong diskon yang lebih dalam demi mengejar volume, tapi apakah itu '
        'benar-benar menguntungkan? Untuk tiap tingkat diskon, bandingkan rata-rata quantity per '
        'order dengan margin (`profit / revenue * 100`) pada order Completed. Kembalikan tepat: '
        '`discount_pct`, `avg_quantity` (2 desimal), `margin_pct` (1 desimal), urut diskon menaik. '
        'Baca jawabannya dari hasilmu sendiri.',
        '-- Q7: discount depth vs volume vs margin\n'
        '-- Return: discount_pct, avg_quantity, margin_pct\n',
        'SELECT o.discount_pct, ROUND(AVG(o.quantity), 2) AS avg_quantity, '
        'ROUND(SUM(o.quantity * (o.unit_price * (1 - o.discount_pct) - p.unit_cost)) * 100.0 '
        '/ SUM(o.quantity * o.unit_price * (1 - o.discount_pct)), 1) AS margin_pct '
        'FROM orders o JOIN products p ON p.product_id = o.product_id '
        "WHERE o.order_status = 'Completed' GROUP BY o.discount_pct ORDER BY o.discount_pct;",
        ['Compute profit and revenue in the same query, then divide',
         'Multiply by 100.0 — integer division would flatten the result to 0'],
        ['Hitung profit dan revenue dalam satu query, lalu bagi',
         'Kalikan dengan 100.0 — pembagian integer akan membuat hasilnya 0'],
        'hard', ['discount_pct', 'avg_quantity', 'margin_pct'],
    ),
]


def q(s):
    """Postgres single-quoted literal."""
    return s.replace("'", "''")


def main():
    con = build_db()
    parts = ["""-- ============================================================
-- 063: X04 SQL exercises re-keyed to the September 2026 Seduh dataset.
--
--   Supersedes 055 (and the X04 description rewrites in 059, which are folded
--   back into the generator). The playground now serves the RAW tables rather
--   than the cleaned ones \u2014 more rows, duplicate order_id values, mixed
--   channel spellings \u2014 so every expected value from 055 was stale.
--
--   The X01-X12 program builds one portfolio project on the Seduh data, so the
--   SQL session now practises on that data instead of the synthetic ecommerce
--   schema. Every exercise is one of the brief's own business questions, and
--   the learner's playground totals match the workbook on their disk.
--
--   dataset_name moves to 'seduh', which is what routes the browser to the
--   right database. The 04/05/06/F08 sessions keep 'ecommerce' and are
--   untouched.
--
--   Generated by scripts/gen-x04-exercises.py — every expected value below was
--   produced by executing the solution against the real dataset. Do not edit by
--   hand; re-run the script instead.
--
--   UPDATE in place, matched on order_num, rather than DELETE + INSERT like 055
--   did: exercise_submissions.exercise_id cascades on delete, so re-inserting
--   would take every learner's submitted attempt with it. The row's identity is
--   what has to survive; only its content changes.
--
--   An INSERT is still emitted, guarded by NOT EXISTS, so a database that never
--   ran 055 ends up with the same eight exercises.
-- ============================================================
"""]

    for i, (t_en, t_id, d_en, d_id, starter, solution,
            h_en, h_id, diff, cols) in enumerate(EXERCISES, start=1):
        cur = con.execute(solution)
        names = [c[0] for c in cur.description]
        if names != cols:
            raise SystemExit(f'#{i} {t_en}: solution returns {names}, expected {cols}')
        rows = [dict(zip(names, r)) for r in cur.fetchall()]
        if not rows:
            raise SystemExit(f'#{i} {t_en}: solution returned no rows')
        if len(rows) > 30:
            raise SystemExit(f'#{i} {t_en}: {len(rows)} rows is too many for an answer key')

        tests = [
            {
                'id': 'tc1', 'validation_type': 'exact_match', 'expected_rows': rows,
                'description_en': f'Returns the correct {len(rows)} row(s) with the right values',
                'description_id': f'Mengembalikan {len(rows)} baris yang benar dengan nilai yang tepat',
                'points': 70,
            },
            {
                'id': 'tc2', 'validation_type': 'contains_columns', 'expected_columns': cols,
                'description_en': f'Returns the required columns: {", ".join(cols)}',
                'description_id': f'Mengembalikan kolom yang diminta: {", ".join(cols)}',
                'points': 30,
            },
        ]

        tc_json = q(json.dumps(tests, ensure_ascii=False))
        hen_json = q(json.dumps(h_en, ensure_ascii=False))
        hid_json = q(json.dumps(h_id, ensure_ascii=False))

        parts.append(f"""
-- #{i} — {q(t_en)}
UPDATE public.exercises e
SET type = 'sql',
    title_en = '{q(t_en)}',
    title_id = '{q(t_id)}',
    description_en = '{q(d_en)}',
    description_id = '{q(d_id)}',
    starter_code = '{q(starter)}',
    solution_code = '{q(solution)}',
    test_cases = '{tc_json}'::jsonb,
    hints_en = '{hen_json}'::jsonb,
    hints_id = '{hid_json}'::jsonb,
    difficulty = '{diff}',
    dataset_name = 'seduh'
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X04' AND e.order_num = {i};

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id,
  starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, dataset_name, order_num)
SELECT s.id, 'sql', '{q(t_en)}', '{q(t_id)}', '{q(d_en)}', '{q(d_id)}',
  '{q(starter)}', '{q(solution)}',
  '{tc_json}'::jsonb,
  '{hen_json}'::jsonb,
  '{hid_json}'::jsonb,
  '{diff}', 'seduh', {i}
FROM public.sessions s
WHERE s.session_number = 'X04'
  AND NOT EXISTS (
    SELECT 1 FROM public.exercises x
    WHERE x.session_id = s.id AND x.order_num = {i});
""")
        print(f'  #{i} {diff:<6} {len(rows):>2} rows  {t_en}')

    OUT.write_text(''.join(parts), encoding='utf-8', newline='\n')
    print(f'\nwrote {OUT.relative_to(ROOT)}  ({OUT.stat().st_size / 1024:.0f} KB)')


if __name__ == '__main__':
    main()
