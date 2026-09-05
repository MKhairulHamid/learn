# Generates the Seduh Coffee final-project artifacts in public/project/.
#
# Two source workbooks are authored by hand and committed here — one per
# enrollment tier, because their Project Brief tabs differ:
#
#   seduh-coffee-final-project-bnsp.xlsx        Extended / BNSP (Sesi 1-12)
#   seduh-coffee-final-project-fasttrack.xlsx   Essential / Fast Track (Sesi 1-9)
#
# Their four data tabs are identical, so everything derived below is generated
# once from the Fast Track file and, where a workbook carries the narrative
# tabs, written out once per tier.
#
# The program runs 12 sessions and learners join mid-way, so every session page
# offers a "ready to continue" file: the project as it should look at the START
# of that session. The data pipeline only branches once (Session 2 cleaning), so
# 12 sessions need 5 derived artifacts, not 12.
#
#   seduh-coffee-cleaned-<tier>.xlsx    after Session 2
#   seduh-coffee-data-pack.zip          cleaned CSVs + schema.sql + seduh.db
#   seduh-coffee-analysis-<tier>.xlsx   cleaned + the Q1-Q4 / Q6 answers
#   seduh-coffee-rfm-segments.csv       after Session 10
#   seduh-coffee-deck-outline.md        slide skeleton for Session 11
#
# Everything the learner reads is Bahasa Indonesia; column and table names stay
# English because the SQL / pandas / Power BI exercises query those exact
# identifiers.
#
# public/project/data/*.csv is the exception to the pipeline: those feed the SQL
# and Python playgrounds and carry the RAW tables, not the cleaned ones, so a
# learner can practise the Session 2 cleaning in the playground against the same
# mess that is in their workbook. review_text is dropped from them — it is free
# text with commas and the playground CSV loader splits on ','.
#
# Dev-only: run by hand, commit the output. Nothing in the build invokes it.
#   pip install pandas openpyxl
#   python scripts/gen-project-files.py
#
# Re-running is safe — every write is an absolute value, never an append.

import re
import shutil
import sqlite3
import zipfile
from pathlib import Path

import openpyxl
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'project'

# Filename suffix per enrollment tier, matching FINAL_PROJECT_FILES and
# CONTINUATION_FILES in src/data/finalProject.ts.
TIERS = {'extended': 'bnsp', 'essential': 'fasttrack'}

RAW = {tier: OUT / f'seduh-coffee-final-project-{slug}.xlsx' for tier, slug in TIERS.items()}

# The data tabs are identical across tiers; read them once.
DATA_SOURCE = RAW['essential']

DATA_SHEETS = ['Orders', 'Customers', 'Products', 'Marketing_Spend']

# RFM is anchored to the day after the data ends, per the brief.
SNAPSHOT = pd.Timestamp('2026-01-01')


# ── Session 2: the cleaning rules ────────────────────────────────────────────

# Every messy spelling in Orders.channel folds onto one of these four. Matching
# happens on the trimmed, whitespace-collapsed, lowercased value.
CHANNEL_MAP = {
    'webstore': 'Webstore',
    'tokopedia': 'Tokopedia',
    'tokopdia': 'Tokopedia',   # typo in the source
    'shopee': 'Shopee',
    'shoppee': 'Shopee',       # typo in the source
    'tiktok shop': 'TikTok Shop',
}

GENDER_MAP = {
    'female': 'Female', 'f': 'Female', 'perempuan': 'Female',
    'male': 'Male', 'm': 'Male', 'laki-laki': 'Male',
}

CATEGORY_MAP = {'Ready-to-Drink': 'Ready to Drink', 'Gift set': 'Gift Set'}


def _trim(series):
    """Strip and collapse internal runs of whitespace, preserving nulls."""
    return series.where(series.isna(), series.astype('string').str.strip().str.replace(r'\s+', ' ', regex=True))


def _to_date(series):
    """Excel dates and dd/mm/yyyy strings share the column in the raw data."""
    text = series.map(lambda v: isinstance(v, str))
    parsed = pd.to_datetime(series.where(~text), errors='coerce')
    if text.any():
        parsed[text] = pd.to_datetime(series[text], dayfirst=True, errors='coerce')
    return parsed


def _phone(value):
    """0812-xxxx-xxxx, +628xxx and 0812xxx all become 08xxxxxxxxxx."""
    if pd.isna(value):
        return pd.NA
    digits = re.sub(r'\D', '', str(value))
    if digits.startswith('62'):
        digits = '0' + digits[2:]
    elif not digits.startswith('0'):
        digits = '0' + digits
    return digits


def clean(raw):
    """Apply the Session 2 rules. Returns (cleaned tables, cleaning log rows)."""
    log = []
    orders = raw['Orders'].copy()
    customers = raw['Customers'].copy()
    products = raw['Products'].copy()
    spend = raw['Marketing_Spend'].copy()

    def note(table, column, issue, rule, rows):
        log.append({
            'Langkah': len(log) + 1, 'Tabel': table, 'Kolom': column,
            'Masalah': issue, 'Aturan yang diterapkan': rule, 'Baris terdampak': rows,
        })

    # --- Orders ---------------------------------------------------------
    as_text = int(orders['order_date'].map(lambda v: isinstance(v, str)).sum())
    orders['order_date'] = _to_date(orders['order_date'])
    if orders['order_date'].isna().any():
        raise SystemExit('Orders.order_date holds a value that is neither a date nor dd/mm/yyyy')
    note('Orders', 'order_date', 'Sebagian tanggal tersimpan sebagai teks dd/mm/yyyy',
         'Ubah seluruh kolom menjadi tipe tanggal (teks dibaca hari lebih dulu)', as_text)

    orders['quantity'] = pd.to_numeric(orders['quantity'], errors='raise').astype(int)

    # Text normalisation comes BEFORE de-duplication on purpose: a duplicate
    # pair can differ only by the 'Tokopdia' typo, so normalising first turns it
    # into an exact duplicate and a single rule removes them all.
    untrimmed = int((orders['channel'] != orders['channel'].str.strip()).sum())
    variants = orders['channel'].nunique()
    orders['channel'] = _trim(orders['channel']).str.lower().map(CHANNEL_MAP)
    if orders['channel'].isna().any():
        raise SystemExit('Orders.channel has a spelling CHANNEL_MAP does not cover')
    note('Orders', 'channel',
         f'{variants} penulisan untuk 4 channel yang sebenarnya ({untrimmed} punya spasi berlebih)',
         'TRIM, rapatkan spasi, lowercase, petakan ke Webstore / Tokopedia / Shopee / TikTok Shop',
         untrimmed)

    for col in ['payment_method', 'city', 'province', 'order_status', 'review_text']:
        orders[col] = _trim(orders[col])

    before = len(orders)
    orders = orders.drop_duplicates().reset_index(drop=True)
    note('Orders', 'semua kolom', 'Baris order tercatat dua kali',
         'Hapus baris duplikat persis (setelah channel diseragamkan)', before - len(orders))

    if orders['order_id'].duplicated().any():
        raise SystemExit('Orders still has conflicting duplicate order_id values')

    before = len(orders)
    orders = orders[orders['quantity'] > 0].reset_index(drop=True)
    note('Orders', 'quantity', 'Quantity nol atau negatif bukan penjualan nyata',
         'Hapus baris dengan quantity <= 0', before - len(orders))

    note('Orders', 'rating', f'{int(orders["rating"].isna().sum())} rating kosong',
         'DIBIARKAN KOSONG — order tanpa rating bukan cacat data. Jangan diisi; '
         'kecualikan yang kosong saat menghitung rata-rata rating.', 0)

    note('Orders', 'review_text', f'{int(orders["review_text"].isna().sum())} ulasan kosong',
         'DIBIARKAN KOSONG — sebagian besar order memang tidak diulas. Dipakai di Sesi 9.', 0)

    orders['rating'] = orders['rating'].astype('Int64')

    # --- Customers ------------------------------------------------------
    variants = customers['gender'].nunique()
    before_gender = customers['gender'].copy()
    customers['gender'] = _trim(customers['gender']).str.lower().map(GENDER_MAP)
    if customers['gender'].isna().any():
        raise SystemExit('Customers.gender has a value GENDER_MAP does not cover')
    note('Customers', 'gender', f'{variants} penulisan untuk 2 nilai (campur Inggris dan Indonesia)',
         'Lowercase lalu petakan ke Female / Male',
         int((before_gender != customers['gender']).fillna(False).sum()))

    before_phone = customers['phone'].astype('string')
    customers['phone'] = customers['phone'].map(_phone).astype('string')
    note('Customers', 'phone', '3 format nomor bercampur (0812-xxxx-xxxx, +628xxx, 0812xxx)',
         'Buang seluruh karakter non-angka dan ubah awalan +62 menjadi 0',
         int((before_phone != customers['phone']).fillna(False).sum()))

    untrimmed = int((customers['city'] != customers['city'].str.strip()).fillna(False).sum())
    customers['city'] = _trim(customers['city'])
    note('Customers', 'city', 'Spasi di belakang memecah satu kota menjadi dua nilai',
         'TRIM dan rapatkan spasi', untrimmed)

    blank_cities = int(customers['city'].isna().sum())
    customers['city'] = customers['city'].fillna('Unknown')
    note('Customers', 'city', 'City kosong',
         "Isi dengan 'Unknown', bukan dibuang — order pelanggan itu tetap dihitung",
         blank_cities)

    blank_age = int(customers['age'].isna().sum())
    customers['age'] = customers['age'].astype('Int64')
    note('Customers', 'age', f'{blank_age} usia kosong',
         'DIBIARKAN KOSONG — usia tidak bisa ditebak. Kecualikan yang kosong saat '
         'menghitung rata-rata atau membuat kelompok usia.', 0)

    for col in ['customer_name', 'province', 'acquisition_channel']:
        customers[col] = _trim(customers[col])

    # --- Products -------------------------------------------------------
    messy = int(products['category'].isin(CATEGORY_MAP).sum()
                + (products['category'] != products['category'].str.strip()).sum())
    products['category'] = _trim(products['category']).replace(CATEGORY_MAP)
    for col in ['sku_code', 'product_name']:
        products[col] = _trim(products[col])
    note('Products', 'category',
         "Penamaan tidak konsisten ('Ready-to-Drink', 'Gift set', spasi di belakang)",
         "TRIM lalu petakan ke 'Ready to Drink' dan 'Gift Set'", messy)

    # --- Marketing_Spend ------------------------------------------------
    spend['channel'] = _trim(spend['channel'])

    note('Orders', 'order_status', "Hanya 'Completed' yang dihitung sebagai revenue",
         "TIDAK dihapus — baris 'Returned' dan 'Cancelled' tetap disimpan supaya return rate "
         'bisa dihitung. Saring saat menghitung revenue atau profit.', 0)

    return {'Orders': orders, 'Customers': customers, 'Products': products,
            'Marketing_Spend': spend}, pd.DataFrame(log)


def enrich(t):
    """Line-level table with the brief's revenue and profit formulas applied."""
    df = t['Orders'].merge(
        t['Products'][['product_id', 'product_name', 'category', 'unit_cost']],
        on='product_id', how='left')
    df = df.merge(
        t['Customers'][['customer_id', 'gender', 'age', 'city', 'acquisition_channel']]
        .rename(columns={'city': 'customer_city'}),  # Orders.city is the shipping city
        on='customer_id', how='left')

    net = df['unit_price'] * (1 - df['discount_pct'])
    df['net_unit_price'] = net.round(2)
    df['revenue'] = (df['quantity'] * net).round(2)
    df['cogs'] = (df['quantity'] * df['unit_cost']).round(2)
    df['profit'] = (df['revenue'] - df['cogs']).round(2)
    df['discount_idr'] = (df['quantity'] * df['unit_price'] * df['discount_pct']).round(2)
    df['is_completed'] = df['order_status'] == 'Completed'
    df['month'] = df['order_date'].dt.to_period('M').dt.to_timestamp()
    return df


# ── Sessions 3-5: the answers a mid-program joiner starts from ───────────────

def _margin(df):
    return (df['profit'] / df['revenue'] * 100).round(1)


def answers(enriched):
    """Finished Q1-Q4 and Q6 tables, completed orders only."""
    done = enriched[enriched['is_completed']]

    q1_cat = done.groupby('category', as_index=False).agg(
        orders=('order_id', 'nunique'), units=('quantity', 'sum'),
        revenue=('revenue', 'sum'), cogs=('cogs', 'sum'), profit=('profit', 'sum'))
    q1_cat['margin_pct'] = _margin(q1_cat)
    q1_cat = q1_cat.sort_values('profit', ascending=False)

    q1_prod = done.groupby(['product_id', 'product_name', 'category'], as_index=False).agg(
        units=('quantity', 'sum'), revenue=('revenue', 'sum'), profit=('profit', 'sum'))
    q1_prod['margin_pct'] = _margin(q1_prod)
    q1_prod = q1_prod.sort_values('profit', ascending=False)

    q2 = done.groupby('channel', as_index=False).agg(
        orders=('order_id', 'nunique'), customers=('customer_id', 'nunique'),
        revenue=('revenue', 'sum'), discount_given=('discount_idr', 'sum'),
        profit=('profit', 'sum'))
    q2['avg_order_value'] = (q2['revenue'] / q2['orders']).round(0)
    q2['margin_pct'] = _margin(q2)
    q2 = q2.sort_values('profit', ascending=False)

    q3 = done.groupby('month', as_index=False).agg(
        orders=('order_id', 'nunique'), customers=('customer_id', 'nunique'),
        units=('quantity', 'sum'), revenue=('revenue', 'sum'), profit=('profit', 'sum'))
    q3['avg_order_value'] = (q3['revenue'] / q3['orders']).round(0)
    q3 = q3.sort_values('month')

    per_customer = done.groupby('customer_id', as_index=False).agg(
        orders=('order_id', 'nunique'), revenue=('revenue', 'sum'))
    per_customer['buyer_type'] = per_customer['orders'].gt(1).map(
        {True: 'Repeat buyer', False: 'One-time buyer'})
    q4 = per_customer.groupby('buyer_type', as_index=False).agg(
        customers=('customer_id', 'count'), orders=('orders', 'sum'),
        revenue=('revenue', 'sum'))
    q4['customer_share_pct'] = (q4['customers'] / q4['customers'].sum() * 100).round(1)
    q4['revenue_share_pct'] = (q4['revenue'] / q4['revenue'].sum() * 100).round(1)

    q6 = done.groupby('discount_pct', as_index=False).agg(
        order_lines=('order_id', 'count'), avg_quantity=('quantity', 'mean'),
        units=('quantity', 'sum'), revenue=('revenue', 'sum'), profit=('profit', 'sum'))
    q6['avg_quantity'] = q6['avg_quantity'].round(2)
    q6['margin_pct'] = _margin(q6)

    return {
        'Q1_Category_Profit': q1_cat, 'Q1_Product_Profit': q1_prod,
        'Q2_Channel_Value': q2, 'Q3_Monthly_Trend': q3,
        'Q4_Repeat_Buyers': q4, 'Q6_Discount_vs_Volume': q6,
    }


# ── Session 10: RFM ──────────────────────────────────────────────────────────

def _segment(r, f):
    """Champions / Loyal / At-Risk / Lost, the four the brief names."""
    if r >= 4 and f >= 4:
        return 'Champions'
    if f >= 4:
        return 'Loyal'
    if r >= 4:
        return 'Potential Loyalist'
    if r <= 2 and f >= 3:
        return 'At-Risk'
    if r <= 2:
        return 'Lost'
    return 'Needs Attention'


def rfm(enriched, customers):
    done = enriched[enriched['is_completed']]
    agg = done.groupby('customer_id', as_index=False).agg(
        last_order_date=('order_date', 'max'),
        frequency=('order_id', 'nunique'),
        monetary=('revenue', 'sum'))
    agg['recency_days'] = (SNAPSHOT - agg['last_order_date']).dt.days
    agg['monetary'] = agg['monetary'].round(0)

    # Quintiles: recent, frequent and high-spending all score 5.
    agg['r_score'] = pd.qcut(agg['recency_days'], 5, labels=[5, 4, 3, 2, 1]).astype(int)
    agg['f_score'] = pd.qcut(agg['frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    agg['m_score'] = pd.qcut(agg['monetary'], 5, labels=[1, 2, 3, 4, 5]).astype(int)
    agg['segment'] = [_segment(r, f) for r, f in zip(agg['r_score'], agg['f_score'])]

    out = customers[['customer_id', 'customer_name', 'city', 'acquisition_channel']].merge(
        agg, on='customer_id', how='left')

    # A customer with no completed order has no R/F/M to score. Kept in the file
    # rather than dropped so the row counts still reconcile against Customers —
    # filter them out before you size the segments.
    never = out['segment'].isna()
    out.loc[never, ['frequency', 'monetary']] = 0
    out.loc[never, 'segment'] = 'Never Purchased'

    out['last_order_date'] = out['last_order_date'].dt.strftime('%Y-%m-%d')
    # The left join widened the integer columns to float; Int64 keeps the blanks
    # blank without printing 112.0 where the learner expects 112.
    for col in ['recency_days', 'frequency', 'monetary', 'r_score', 'f_score', 'm_score']:
        out[col] = out[col].astype('Int64')
    out['rfm_score'] = (out['r_score'].astype('string') + out['f_score'].astype('string')
                        + out['m_score'].astype('string'))

    return out[['customer_id', 'customer_name', 'city', 'acquisition_channel',
                'last_order_date', 'recency_days', 'frequency', 'monetary',
                'r_score', 'f_score', 'm_score', 'rfm_score', 'segment']]


# ── Writers ──────────────────────────────────────────────────────────────────

def write_workbook(dest, source, sheets, order):
    """Copy a source workbook (for its Brief and Dictionary tabs), replace the data."""
    shutil.copy(source, dest)
    with pd.ExcelWriter(dest, engine='openpyxl', mode='a',
                        if_sheet_exists='replace', datetime_format='yyyy-mm-dd') as xl:
        for name, df in sheets.items():
            df.to_excel(xl, sheet_name=name, index=False)

    # to_excel appends replaced sheets at the end; restore a readable order with
    # the narrative tabs (Brief, Dictionary) still leading.
    wb = openpyxl.load_workbook(dest)
    lead = [n for n in wb.sheetnames if n not in order]
    wb._sheets = [wb[n] for n in lead + order]
    for name in order:
        wb[name].freeze_panes = 'A2'
    wb.save(dest)


SCHEMA = """\
-- Seduh Coffee — skema untuk dataset yang SUDAH dibersihkan.
-- Muat CSV-nya dengan urutan di bawah; foreign key-nya bergantung pada urutan itu.
--
--   sqlite3 seduh.db < schema.sql
--   sqlite3 seduh.db ".mode csv" ".import --skip 1 products.csv products" ...
--
-- Tanggal disimpan sebagai teks ISO (YYYY-MM-DD) supaya fungsi tanggal SQLite bekerja.

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS marketing_spend;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id   TEXT PRIMARY KEY,
  sku_code     TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category     TEXT NOT NULL,
  base_price   INTEGER NOT NULL,
  unit_cost    INTEGER NOT NULL,
  launch_date  TEXT NOT NULL
);

CREATE TABLE customers (
  customer_id         TEXT PRIMARY KEY,
  customer_name       TEXT NOT NULL,
  phone               TEXT,
  gender              TEXT NOT NULL,
  age                 INTEGER,          -- NULL: usia tidak tercatat
  city                TEXT NOT NULL,
  province            TEXT,
  signup_date         TEXT NOT NULL,
  acquisition_channel TEXT NOT NULL
);

CREATE TABLE orders (
  order_id       TEXT PRIMARY KEY,
  order_date     TEXT NOT NULL,
  customer_id    TEXT NOT NULL REFERENCES customers(customer_id),
  product_id     TEXT NOT NULL REFERENCES products(product_id),
  quantity       INTEGER NOT NULL,
  unit_price     INTEGER NOT NULL,
  discount_pct   REAL NOT NULL,
  channel        TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  city           TEXT NOT NULL,
  province       TEXT NOT NULL,
  order_status   TEXT NOT NULL,
  rating         INTEGER,          -- NULL: order tidak pernah diberi rating
  review_text    TEXT              -- NULL: pelanggan tidak menulis ulasan
);

CREATE TABLE marketing_spend (
  month       TEXT NOT NULL,
  channel     TEXT NOT NULL,
  spend_idr   INTEGER NOT NULL,
  impressions INTEGER NOT NULL,
  clicks      INTEGER NOT NULL,
  PRIMARY KEY (month, channel)
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_product  ON orders(product_id);
CREATE INDEX idx_orders_date     ON orders(order_date);
CREATE INDEX idx_orders_status   ON orders(order_status);
"""

PACK_README = """\
Seduh Coffee — paket data bersih
================================

Ini dataset SETELAH pembersihan Sesi 2, dalam format yang diimpor sesi-sesi
berikutnya. Pakai ini kalau kamu bergabung di tengah program.

  products.csv, customers.csv, orders.csv, marketing_spend.csv
      Empat tabel yang sudah bersih. UTF-8, dipisah koma, tanggal ISO.

  orders_enriched.csv
      orders yang sudah di-join ke products dan customers, dengan rumus dari
      brief sudah diterapkan: net_unit_price, revenue, cogs, profit,
      discount_idr, is_completed, month. Praktis untuk Power BI — tapi bangun
      sendiri minimal sekali supaya kamu tahu isinya.

  schema.sql
      Definisi tabel lengkap dengan key dan index.

  seduh.db
      Database SQLite dengan keempat tabel sudah dimuat. Buka dengan
      DB Browser for SQLite, atau:  sqlite3 seduh.db

APA YANG DIBERSIHKAN
  Lihat tab Cleaning_Log di seduh-coffee-cleaned-*.xlsx — setiap aturan,
  alasannya, dan berapa baris yang terdampak.

APA YANG TIDAK
  - Rating kosong tetap kosong. Order tanpa rating bukan kesalahan data.
  - review_text kosong tetap kosong; sebagian besar order memang tidak diulas.
  - Order Returned dan Cancelled masih ada. Hanya 'Completed' yang dihitung
    sebagai revenue, tapi yang lain dibutuhkan untuk mengukur return rate.

INGAT
  Revenue per baris = quantity x unit_price x (1 - discount_pct)
  Profit  per baris = revenue - (quantity x unit_cost)
  Tanggal snapshot RFM = 1 Januari 2026
"""


def _csv_text(df):
    """LF-terminated CSV. Anything else leaves a stray \\r on the last column,
    which silently turned every blank orders.rating into 0 in the playground."""
    return df.to_csv(index=False, date_format='%Y-%m-%d', lineterminator='\n')


# Dropped from the playground CSVs only: free text with commas, and the
# playground loader splits on ','. It stays in the workbook and the data pack.
PLAYGROUND_DROP = {'Orders': ['review_text']}


def write_playground_csvs(raw):
    """Serve the RAW tables to the SQL and Python playgrounds.

    Raw rather than cleaned on purpose: the Session 2 cleaning is the exercise,
    so a learner can practise it in the playground against the same mess that is
    in the workbook they downloaded.
    """
    live = OUT / 'data'
    live.mkdir(exist_ok=True)

    written = []
    for sheet, name in [('Products', 'products.csv'), ('Customers', 'customers.csv'),
                        ('Orders', 'orders.csv'), ('Marketing_Spend', 'marketing_spend.csv')]:
        out = raw[sheet].drop(columns=PLAYGROUND_DROP.get(sheet, [])).copy()
        for col in out.columns:
            if pd.api.types.is_datetime64_any_dtype(out[col]):
                out[col] = out[col].dt.strftime('%Y-%m-%d')
            elif pd.api.types.is_float_dtype(out[col]) and (out[col].dropna() % 1 == 0).all():
                # A blank cell widens a whole-number column to float, and Excel
                # shows 22 where a plain to_csv would write 22.0.
                out[col] = out[col].astype('Int64')
            elif out[col].dtype == object:
                # order_date is deliberately mixed — real dates alongside
                # dd/mm/yyyy text. Keep the text rows exactly as Excel shows them.
                out[col] = out[col].map(
                    lambda v: v.strftime('%Y-%m-%d') if hasattr(v, 'strftime') else v)

        text = _csv_text(out)
        # The playgrounds split on ',' rather than carrying a CSV parser, which
        # is only safe while no value holds a comma or a quote. Fail loudly here
        # instead of corrupting a table in the browser.
        if '"' in text or '\r' in text:
            raise SystemExit(f'{name} contains a quote or a carriage return; '
                             'the playground CSV loader cannot parse it')
        lines = text.splitlines()
        width = len(lines[0].split(','))
        if any(len(line.split(',')) != width for line in lines):
            raise SystemExit(f'{name} contains a comma-bearing field; '
                             'the playground CSV loader cannot parse it')
        # newline='' keeps Python from translating the LFs back into CRLFs.
        (live / name).write_text(text, encoding='utf-8', newline='')
        written.append((name, len(out), list(out.columns)))
    return written


def write_data_pack(dest, tables, enriched):
    csvs = {
        'products.csv': tables['Products'],
        'customers.csv': tables['Customers'],
        'orders.csv': tables['Orders'],
        'marketing_spend.csv': tables['Marketing_Spend'],
        'orders_enriched.csv': enriched,
    }

    tmp = OUT / '_seduh_tmp.db'
    tmp.unlink(missing_ok=True)
    con = sqlite3.connect(tmp)
    con.executescript(SCHEMA)
    for name, table in [('products', 'Products'), ('customers', 'Customers'),
                        ('orders', 'Orders'), ('marketing_spend', 'Marketing_Spend')]:
        df = tables[table].copy()
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].dt.strftime('%Y-%m-%d')
        df.to_sql(name, con, if_exists='append', index=False)
    con.commit()
    con.close()

    with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('README.txt', PACK_README)
        z.writestr('schema.sql', SCHEMA)
        for name, df in csvs.items():
            z.writestr(name, _csv_text(df))
        z.write(tmp, 'seduh.db')

    tmp.unlink()

    # orders_enriched stays zip-only so nobody skips building it themselves.


DECK_OUTLINE = """\
# Seduh Coffee — kerangka deck untuk stakeholder

Kerangka untuk Sesi 11. Satu pesan per slide, dan pesannya ditaruh di judul:
stakeholder yang hanya membaca judul pun harus tetap menangkap argumenmu.
Setiap slide mengikuti pola **data → insight → rekomendasi**.

Angka di bawah hanya placeholder — isi dari analisismu sendiri. Kalau kamu tidak
setuju dengan sebuah framing, ganti. Ini titik awal, bukan kunci jawaban.

---

## 1. Judul
Seduh Coffee — dari Rp 3,8 M ke Rp 5,0 M: dari mana pertumbuhannya datang.
Namamu, tanggal, dan satu kalimat kesimpulan.

## 2. Yang diminta
Leadership ingin revenue +32% di 2026 tanpa menaikkan budget iklan secara
proporsional. Sebutkan tiga kekhawatiran dari brief, masing-masing satu baris.

## 3. Posisi Seduh hari ini
Revenue 2024 → 2025, laju pertumbuhannya, dan dua hal di baliknya yang bergerak
ke arah yang salah: biaya akuisisi naik dan repeat purchase lemah.

## 4. Cara saya sampai ke sini *(metode, singkat saja)*
Empat tabel, ~26 ribu baris order, dibersihkan dengan catatan yang
terdokumentasi. Nyatakan asumsimu dalam satu baris: hanya order Completed,
snapshot 1 Januari 2026.

## 5. Q1 — Profit tidak ada di tempat volume berada
Profit vs revenue per kategori dan per produk. Sebut kategori yang laris tapi
tipis marginnya, dan yang diam-diam menanggung margin.

## 6. Q2 — Tidak semua channel bernilai sama
Perbandingan channel **setelah** diskon. Kalau sebuah channel terlihat besar di
revenue kotor tapi kecil di profit, itulah pesan slide ini.

## 7. Q3 — Bentuk satu tahun
Tren bulanan sepanjang 2024–2025 dengan Ramadan dan Harbolnas 11.11 / 12.12
diberi anotasi. Sebutkan mana yang musiman dan mana pertumbuhan sungguhan.

## 8. Q6 — Apakah diskon benar-benar bekerja?
Kedalaman diskon vs rata-rata quantity vs margin. Jawab terus terang: pada
kedalaman berapa diskon berhenti membayar dirinya sendiri?

## 9. Q4 — Masalah retensi, dengan ukurannya
Pembeli sekali vs repeat: porsi pelanggan, porsi revenue. Slide inilah yang
menopang sisa rekomendasimu.

## 10. Q5 — Ke mana uang marketing pergi
Spend, CAC, dan ROI per channel akuisisi. Tulis asumsi pemetaan channel-mu di
slide — kosakata spend dan kosakata pelanggan tidak sama persis 1:1.

## 11. *(Opsional — Sesi 10)* Q7 — Siapa sebenarnya pelanggan Seduh
Segmen RFM: Champions, Loyal, At-Risk, Lost. Ukur besar dan nilai
masing-masing. Lewati slide ini kalau kamu tidak mengerjakan Sesi 10;
argumennya tetap berdiri.

## 12. Q8 — Rencananya
Tiga sampai lima aksi, masing-masing terhubung ke slide di atas. Untuk tiap
aksi: apa yang dilakukan, berapa nilainya dalam rupiah, dan bagaimana kamu
akan mengukurnya.

## 13. Hitung-hitungannya
Jembatan dari Rp 3,8 M ke Rp 5,0 M. Tunjukkan kontribusi tiap aksi sampai
angkanya ketemu. Kalau tidak ketemu, katakan apa adanya — gap yang jujur lebih
baik daripada angka karangan.

## 14. Apa yang harus benar
Asumsi yang menopang rencanamu, dan apa yang akan menggugurkannya.
Mengantisipasi bantahan inilah yang membedakan analis dari pembuat grafik.

## 15. Lampiran
Catatan metode, cleaning log, dan chart yang tidak kamu pakai di alur utama
tapi kemungkinan akan ditanyakan.

---

## Ringkasan eksekutif satu halaman (Sesi 12)

Dokumen terpisah, satu halaman, tanpa keharusan ada chart:

1. **Situasinya** — dua kalimat.
2. **Apa kata datanya** — tiga temuan, satu baris masing-masing, tiap temuan
   membawa angka.
3. **Apa yang harus dilakukan** — tiga sampai lima aksi dengan kontribusi rupiahnya.
4. **Totalnya jadi berapa** — jembatan menuju Rp 5,0 M.
5. **Asumsi dan catatan** — hanya order Completed, tanggal snapshot, pemetaan
   channel, dan apa pun yang harus kamu putuskan saat membersihkan data.
"""


def main():
    for tier, path in RAW.items():
        if not path.exists():
            raise SystemExit(f'missing {path}  (source workbook for the {tier} tier)')

    raw = pd.read_excel(DATA_SOURCE, sheet_name=DATA_SHEETS)
    tables, log = clean(raw)
    enriched = enrich(tables)
    answered = answers(enriched)
    print(f'cleaned  {len(raw["Orders"])} -> {len(tables["Orders"])} order rows, '
          f'{len(log)} logged rules')

    produced = []
    for tier, slug in TIERS.items():
        cleaned_path = OUT / f'seduh-coffee-cleaned-{slug}.xlsx'
        write_workbook(cleaned_path, RAW[tier],
                       {**tables, 'Cleaning_Log': log},
                       ['Cleaning_Log'] + DATA_SHEETS)

        analysis_path = OUT / f'seduh-coffee-analysis-{slug}.xlsx'
        write_workbook(analysis_path, RAW[tier],
                       {**tables, 'Cleaning_Log': log, 'Orders_Enriched': enriched, **answered},
                       ['Cleaning_Log'] + list(answered) + ['Orders_Enriched'] + DATA_SHEETS)
        produced += [cleaned_path, analysis_path]

    pack_path = OUT / 'seduh-coffee-data-pack.zip'
    write_data_pack(pack_path, tables, enriched)

    rfm_path = OUT / 'seduh-coffee-rfm-segments.csv'
    rfm(enriched, tables['Customers']).to_csv(rfm_path, index=False)

    deck_path = OUT / 'seduh-coffee-deck-outline.md'
    deck_path.write_text(DECK_OUTLINE, encoding='utf-8')

    print('playground CSVs (RAW data):')
    for name, rows, cols in write_playground_csvs(raw):
        print(f'  {name:22} {rows:>6} rows  {len(cols):>2} cols  {", ".join(cols)}')

    print()
    for p in [*RAW.values(), *produced, pack_path, rfm_path, deck_path,
              *sorted((OUT / 'data').iterdir())]:
        print(f'  {p.stat().st_size / 1_048_576:6.2f} MB  {p.relative_to(OUT)}')


if __name__ == '__main__':
    main()
