// Seduh Coffee dataset — the same four tables as the final-project workbook.
//
// The X01–X12 program builds one portfolio project on this data, so the SQL and
// Python playgrounds load the real thing rather than a lookalike: a learner who
// runs a query here gets the same rows as the workbook on their own disk.
//
// These are the RAW tables, exactly as the workbook ships them — duplicates,
// quantity <= 0, mixed channel spellings, dates stored as dd/mm/yyyy text and
// all. Cleaning them is Session 2's exercise, so the playground has to show the
// mess rather than a tidied copy.
//
// The rows are not bundled. They are fetched from public/project/data/, written
// by scripts/gen-project-files.py, and the SQL playground builds its SQLite
// database in the browser from those same CSVs.

/** Written by scripts/gen-project-files.py — do not hand-edit. */
export const SEDUH_CSV_PATHS = {
  products: 'project/data/products.csv',
  customers: 'project/data/customers.csv',
  orders: 'project/data/orders.csv',
  marketing_spend: 'project/data/marketing_spend.csv',
} as const

export type SeduhTable = keyof typeof SEDUH_CSV_PATHS

/**
 * Load order matters — orders references customers and products.
 *
 * Columns are listed in CSV order because the loader inserts positionally.
 *
 * Deliberately constraint-free: this is the raw data, so orders holds duplicate
 * order_id values, customers.city and customers.age have blanks, and order_date
 * mixes ISO dates with dd/mm/yyyy text. A PRIMARY KEY or NOT NULL here would
 * reject the very rows the learner is supposed to find and fix.
 *
 * Orders.review_text is not served to the playground — it is free text with
 * commas, and the CSV loader below splits on ','. It stays in the workbook.
 */
export const SEDUH_SCHEMA_SQL = `
CREATE TABLE products (
  product_id   TEXT,
  sku_code     TEXT,
  product_name TEXT,
  category     TEXT,
  base_price   INTEGER,
  unit_cost    INTEGER,
  launch_date  TEXT
);

CREATE TABLE customers (
  customer_id         TEXT,
  customer_name       TEXT,
  phone               TEXT,
  gender              TEXT,
  age                 INTEGER,
  city                TEXT,
  province            TEXT,
  signup_date         TEXT,
  acquisition_channel TEXT
);

CREATE TABLE orders (
  order_id       TEXT,
  order_date     TEXT,
  customer_id    TEXT,
  product_id     TEXT,
  quantity       INTEGER,
  unit_price     INTEGER,
  discount_pct   REAL,
  channel        TEXT,
  payment_method TEXT,
  city           TEXT,
  province       TEXT,
  order_status   TEXT,
  rating         INTEGER
);

CREATE TABLE marketing_spend (
  month       TEXT,
  channel     TEXT,
  spend_idr   INTEGER,
  impressions INTEGER,
  clicks      INTEGER
);
`

/** Columns that must be inserted as numbers rather than text, per table. */
export const SEDUH_NUMERIC_COLUMNS: Record<SeduhTable, number[]> = {
  products: [4, 5],
  customers: [4],
  orders: [4, 5, 6, 12],
  marketing_spend: [2, 3, 4],
}

/** Schema reference shown in the playground UI. */
export const SEDUH_DATASET_INFO = {
  name: 'Seduh Coffee',
  blurb_en: 'The final-project dataset, raw and messy — the same rows as the workbook you downloaded. Cleaning it is Session 2.',
  blurb_id: 'Dataset proyek akhir, mentah dan berantakan — baris yang sama persis dengan workbook yang kamu unduh. Membersihkannya adalah tugas Sesi 2.',
  totalRows: 40950,
  tables: [
    {
      name: 'orders',
      description: '25,804 order lines across 2024–2025 (duplicates included)',
      columns: ['order_id', 'order_date', 'customer_id', 'product_id', 'quantity', 'unit_price',
        'discount_pct', 'channel', 'payment_method', 'city', 'province', 'order_status', 'rating'],
      rowCount: 25804,
    },
    {
      name: 'customers',
      description: '15,000 customers across Indonesia',
      columns: ['customer_id', 'customer_name', 'phone', 'gender', 'age', 'city', 'province',
        'signup_date', 'acquisition_channel'],
      rowCount: 15000,
    },
    {
      name: 'products',
      description: '50 products in 6 categories',
      columns: ['product_id', 'sku_code', 'product_name', 'category', 'base_price', 'unit_cost',
        'launch_date'],
      rowCount: 50,
    },
    {
      name: 'marketing_spend',
      description: '96 rows — monthly spend per ad channel',
      columns: ['month', 'channel', 'spend_idr', 'impressions', 'clicks'],
      rowCount: 96,
    },
  ],
}

/**
 * The two formulas the whole project rests on. Worth keeping next to the schema
 * so the playground can show them without anyone re-deriving them from the brief.
 */
export const SEDUH_FORMULAS = {
  revenue: 'quantity * unit_price * (1 - discount_pct)',
  profit: 'quantity * (unit_price * (1 - discount_pct) - unit_cost)',
  note_en: "Only order_status = 'Completed' counts as revenue.",
  note_id: "Hanya order_status = 'Completed' yang dihitung sebagai revenue.",
}
