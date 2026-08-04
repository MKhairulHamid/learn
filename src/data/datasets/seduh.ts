// Seduh Coffee dataset — the same four tables as the final-project workbook.
//
// The X01–X12 program builds one portfolio project on this data, so the SQL and
// Python playgrounds load the real thing rather than a lookalike: a learner who
// runs a query here gets the same numbers as the workbook on their own disk.
//
// The rows are not bundled. They are fetched from public/project/data/, which
// scripts/gen-project-files.py writes from the cleaned dataset, and the SQL
// playground builds its SQLite database in the browser from those same CSVs.

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
 * `rating` is nullable on purpose: an unrated order is not a defect, and
 * Session 2 teaches exactly that.
 */
export const SEDUH_SCHEMA_SQL = `
CREATE TABLE products (
  product_id   TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  category     TEXT NOT NULL,
  base_price   INTEGER NOT NULL,
  unit_cost    INTEGER NOT NULL,
  launch_date  TEXT NOT NULL
);

CREATE TABLE customers (
  customer_id         TEXT PRIMARY KEY,
  customer_name       TEXT NOT NULL,
  gender              TEXT NOT NULL,
  age                 INTEGER NOT NULL,
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
  rating         INTEGER
);

CREATE TABLE marketing_spend (
  month       TEXT NOT NULL,
  channel     TEXT NOT NULL,
  spend_idr   INTEGER NOT NULL,
  impressions INTEGER NOT NULL,
  clicks      INTEGER NOT NULL
);
`

/** Columns that must be inserted as numbers rather than text, per table. */
export const SEDUH_NUMERIC_COLUMNS: Record<SeduhTable, number[]> = {
  products: [3, 4],
  customers: [3],
  orders: [4, 5, 6, 12],
  marketing_spend: [2, 3, 4],
}

/** Schema reference shown in the playground UI. */
export const SEDUH_DATASET_INFO = {
  name: 'Seduh Coffee',
  blurb_en: 'The final-project dataset — cleaned. Your query results here match the workbook you downloaded.',
  blurb_id: 'Dataset proyek akhir — sudah dibersihkan. Hasil query di sini sama dengan workbook yang kamu unduh.',
  totalRows: 28501,
  tables: [
    {
      name: 'orders',
      description: '24,155 order lines across 2024–2025',
      columns: ['order_id', 'order_date', 'customer_id', 'product_id', 'quantity', 'unit_price',
        'discount_pct', 'channel', 'payment_method', 'city', 'province', 'order_status', 'rating'],
      rowCount: 24155,
    },
    {
      name: 'customers',
      description: '4,200 customers across Indonesia',
      columns: ['customer_id', 'customer_name', 'gender', 'age', 'city', 'province',
        'signup_date', 'acquisition_channel'],
      rowCount: 4200,
    },
    {
      name: 'products',
      description: '50 products in 6 categories',
      columns: ['product_id', 'product_name', 'category', 'base_price', 'unit_cost', 'launch_date'],
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
