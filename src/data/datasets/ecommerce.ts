// E-commerce dataset for SQL practice.
// Rich, multi-table schema generated deterministically so learners have plenty
// to explore: lookups (categories, suppliers), dimensions (customers, products,
// employees) and facts (orders, order_items, reviews).

// ── Deterministic RNG (seeded) so the dataset is stable across reloads ──
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}
const rng = makeRng(42)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]
const randInt = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1))
const esc = (v: string) => v.replace(/'/g, "''")

// ── Lookup tables ──────────────────────────────────────────────────────
const CATEGORIES = [
  [1, 'Electronics', 'Devices, gadgets and accessories'],
  [2, 'Books', 'Print and reference titles'],
  [3, 'Furniture', 'Office and home furniture'],
  [4, 'Home & Kitchen', 'Appliances and kitchenware'],
  [5, 'Sports & Outdoors', 'Fitness and outdoor gear'],
  [6, 'Fashion', 'Bags, watches and apparel'],
] as const

const SUPPLIERS = [
  [1, 'TechDistributors Nusantara', 'Java',     'sales@techdist.co.id'],
  [2, 'BukuMakmur',                 'Java',     'order@bukumakmur.co.id'],
  [3, 'FurniCraft Indo',            'Sumatra',  'hello@furnicraft.co.id'],
  [4, 'HomeStyle Supply',           'Bali',     'cs@homestyle.co.id'],
  [5, 'ActiveGear ID',              'Java',     'team@activegear.co.id'],
] as const

// [name, category_id, price, cost, stock, brand, rating]
const PRODUCTS: [string, number, number, number, number, string, number][] = [
  ['Laptop Pro 15"',            1, 12500000, 9800000,  45, 'TechPro',    4.6],
  ['Wireless Mouse',            1,   285000,  180000, 200, 'Logi',       4.3],
  ['USB-C Hub',                 1,   450000,  280000, 150, 'Anker',      4.5],
  ['Monitor 27"',               1,  4750000, 3600000,  60, 'ViewMax',    4.4],
  ['Mechanical Keyboard',       1,   850000,  520000, 120, 'KeyForce',   4.7],
  ['Noise-Cancel Headphones',   1,  2100000, 1400000,  75, 'SoundWave',  4.6],
  ['Webcam HD',                 1,   620000,  400000,  90, 'ClearView',  4.1],
  ['External SSD 1TB',          1,  1350000,  950000, 110, 'DataVault',  4.8],
  ['Smartphone X',              1,  8900000, 7100000,  55, 'Nova',       4.5],
  ['Tablet 10"',                1,  5400000, 4200000,  40, 'Nova',       4.2],
  ['Python Programming',        2,   185000,   90000, 300, 'CodePress',  4.7],
  ['Data Analytics Guide',      2,   165000,   80000, 250, 'CodePress',  4.5],
  ['SQL Mastery',               2,   155000,   75000,  80, 'CodePress',  4.6],
  ['Machine Learning 101',      2,   210000,  110000, 130, 'CodePress',  4.4],
  ['Business Statistics',       2,   175000,   95000,  95, 'AkademiPress', 4.2],
  ['Financial Modeling',        2,   195000,  100000,  60, 'AkademiPress', 4.3],
  ['Standing Desk',             3,  3200000, 2100000,  30, 'ErgoLife',   4.5],
  ['Ergonomic Chair',           3,  4500000, 3000000,  25, 'ErgoLife',   4.7],
  ['Bookshelf',                 3,  1250000,  800000,  40, 'WoodCraft',  4.1],
  ['Office Cabinet',            3,  1850000, 1200000,  35, 'WoodCraft',  4.0],
  ['Coffee Maker',              4,   950000,  600000,  70, 'BrewMaster', 4.4],
  ['Air Fryer',                 4,  1450000,  950000,  85, 'KitchenPro', 4.6],
  ['Blender',                   4,   680000,  420000, 100, 'KitchenPro', 4.3],
  ['Vacuum Cleaner',            4,  2300000, 1600000,  45, 'CleanTech',  4.2],
  ['Yoga Mat',                  5,   320000,  180000, 160, 'FlexFit',    4.5],
  ['Dumbbell Set',              5,   890000,  560000,  55, 'IronCore',   4.6],
  ['Running Shoes',             5,  1150000,  720000,  90, 'StrideX',    4.4],
  ['Camping Tent',              5,  1750000, 1150000,  30, 'TrailGear',  4.3],
  ['Leather Backpack',          6,   780000,  480000,  75, 'UrbanStyle', 4.5],
  ['Wristwatch Classic',        6,  1650000, 1050000,  50, 'TimeCraft',  4.6],
]
const supplierForCategory = (cat: number) => (cat === 6 ? 5 : cat)

// ── Customers (generated) ──────────────────────────────────────────────
const FIRST = ['Budi', 'Siti', 'Ahmad', 'Dewi', 'Rizky', 'Nur', 'Wahyu', 'Fitri', 'Eko', 'Maya',
  'Doni', 'Rina', 'Hendra', 'Yuni', 'Farhan', 'Agus', 'Putri', 'Bayu', 'Sari', 'Andi']
const LAST = ['Santoso', 'Rahayu', 'Fauzi', 'Lestari', 'Pratama', 'Hidayah', 'Setiawan', 'Handayani',
  'Prasetyo', 'Indrawati', 'Kusuma', 'Wulandari', 'Gunawan', 'Astuti', 'Malik']
const PLACES: [string, string][] = [
  ['Jakarta', 'Java'], ['Surabaya', 'Java'], ['Bandung', 'Java'], ['Semarang', 'Java'],
  ['Yogyakarta', 'Java'], ['Medan', 'Sumatra'], ['Palembang', 'Sumatra'], ['Padang', 'Sumatra'],
  ['Balikpapan', 'Kalimantan'], ['Pontianak', 'Kalimantan'], ['Denpasar', 'Bali'],
  ['Makassar', 'Sulawesi'], ['Manado', 'Sulawesi'],
]
const MEMBERSHIPS = ['regular', 'regular', 'premium', 'premium', 'vip']

const NUM_CUSTOMERS = 40
const customers: { id: number; city: string }[] = []
const customerRows: string[] = []
for (let id = 1; id <= NUM_CUSTOMERS; id++) {
  const first = FIRST[(id * 7) % FIRST.length]
  const last = LAST[(id * 3) % LAST.length]
  const name = `${first} ${last}`
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${id}@email.com`
  const phone = `08${randInt(11, 89)}${randInt(1000000, 9999999)}`
  const [city, region] = PLACES[(id * 5) % PLACES.length]
  const year = 2023
  const month = String(randInt(1, 12)).padStart(2, '0')
  const day = String(randInt(1, 28)).padStart(2, '0')
  const membership = pick(MEMBERSHIPS)
  const age = randInt(21, 58)
  const gender = rng() < 0.5 ? 'M' : 'F'
  customers.push({ id, city })
  customerRows.push(
    `(${id}, '${esc(name)}', '${email}', '${phone}', '${region}', '${city}', '${year}-${month}-${day}', '${membership}', ${age}, '${gender}')`,
  )
}

// ── Employees (sales reps) ─────────────────────────────────────────────
const ROLES = ['Sales', 'Sales', 'Senior Sales', 'Manager']
const NUM_EMPLOYEES = 12
const employeeRows: string[] = []
for (let id = 1; id <= NUM_EMPLOYEES; id++) {
  const first = FIRST[(id * 4 + 2) % FIRST.length]
  const last = LAST[(id * 6 + 1) % LAST.length]
  const role = ROLES[(id) % ROLES.length]
  const [, region] = PLACES[(id * 2) % PLACES.length]
  const hire = `202${randInt(1, 3)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`
  const salary = randInt(6, 18) * 1000000
  employeeRows.push(`(${id}, '${esc(`${first} ${last}`)}', '${role}', '${region}', '${hire}', ${salary})`)
}

// ── Products rows ──────────────────────────────────────────────────────
const productRows = PRODUCTS.map(([name, cat, price, cost, stock, brand, rating], i) => {
  const id = i + 1
  const sku = `${['ELEC', 'BOOK', 'FURN', 'HOME', 'SPRT', 'FASH'][cat - 1]}-${String(id).padStart(3, '0')}`
  return `(${id}, '${esc(name)}', ${cat}, ${supplierForCategory(cat)}, '${sku}', ${price}, ${cost}, ${stock}, '${esc(brand)}', ${rating})`
})

// ── Orders + order_items (facts) ───────────────────────────────────────
const STATUSES = ['completed', 'completed', 'completed', 'completed', 'completed',
  'completed', 'completed', 'pending', 'cancelled']
const PAYMENTS = ['credit_card', 'bank_transfer', 'e-wallet', 'cod']

const NUM_ORDERS = 200
const orderRows: string[] = []
const orderItemRows: string[] = []
let itemId = 0
for (let id = 1; id <= NUM_ORDERS; id++) {
  const cust = customers[randInt(0, customers.length - 1)]
  // Spread dates across 2023-06 .. 2024-12
  const monthOffset = randInt(0, 18)
  const y = 2023 + Math.floor((5 + monthOffset) / 12)
  const m = String(((5 + monthOffset) % 12) + 1).padStart(2, '0')
  const d = String(randInt(1, 28)).padStart(2, '0')
  const status = pick(STATUSES)
  const payment = pick(PAYMENTS)
  const salesRep = randInt(1, NUM_EMPLOYEES)

  // 1–4 distinct products per order
  const n = randInt(1, 4)
  const chosen = new Set<number>()
  while (chosen.size < n) chosen.add(randInt(1, PRODUCTS.length))
  let subtotal = 0
  for (const pid of chosen) {
    const qty = randInt(1, 3)
    const unit = PRODUCTS[pid - 1][2]
    subtotal += qty * unit
    itemId++
    orderItemRows.push(`(${itemId}, ${id}, ${pid}, ${qty}, ${unit})`)
  }
  const discount = rng() < 0.3 ? Math.round((subtotal * randInt(5, 15)) / 100) : 0
  const total = subtotal - discount
  orderRows.push(
    `(${id}, ${cust.id}, ${salesRep}, '${y}-${m}-${d}', '${status}', '${payment}', '${esc(cust.city)}', ${discount}, ${total})`,
  )
}

// ── Reviews ────────────────────────────────────────────────────────────
const COMMENTS = ['Great product, highly recommend', 'Works exactly as described',
  'Good value for money', 'Quality could be better', 'Fast delivery, very satisfied',
  'Not quite what I expected', 'Excellent, will buy again', 'Average, nothing special',
  'Sturdy and reliable', 'Absolutely love it']
const NUM_REVIEWS = 90
const reviewRows: string[] = []
for (let id = 1; id <= NUM_REVIEWS; id++) {
  const pid = randInt(1, PRODUCTS.length)
  const cid = randInt(1, NUM_CUSTOMERS)
  const rating = rng() < 0.7 ? randInt(4, 5) : randInt(1, 3)
  const y = pick([2023, 2024])
  const date = `${y}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`
  reviewRows.push(`(${id}, ${pid}, ${cid}, ${rating}, '${esc(pick(COMMENTS))}', '${date}')`)
}

// ── Assemble seed SQL ──────────────────────────────────────────────────
export const ECOMMERCE_SEED_SQL = `
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE suppliers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  contact_email TEXT
);

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  joined_date TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'regular',
  age INTEGER,
  gender TEXT
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  region TEXT NOT NULL,
  hire_date TEXT NOT NULL,
  salary REAL NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
  sku TEXT NOT NULL,
  price REAL NOT NULL,
  cost REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  brand TEXT,
  rating REAL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  employee_id INTEGER REFERENCES employees(id),
  order_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  payment_method TEXT,
  shipping_city TEXT,
  discount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  review_date TEXT NOT NULL
);

INSERT INTO categories VALUES
${CATEGORIES.map(([id, n, d]) => `(${id}, '${esc(n)}', '${esc(d)}')`).join(',\n')};

INSERT INTO suppliers VALUES
${SUPPLIERS.map(([id, n, r, e]) => `(${id}, '${esc(n)}', '${r}', '${e}')`).join(',\n')};

INSERT INTO customers VALUES
${customerRows.join(',\n')};

INSERT INTO employees VALUES
${employeeRows.join(',\n')};

INSERT INTO products VALUES
${productRows.join(',\n')};

INSERT INTO orders VALUES
${orderRows.join(',\n')};

INSERT INTO order_items VALUES
${orderItemRows.join(',\n')};

INSERT INTO reviews VALUES
${reviewRows.join(',\n')};
`

// ── Schema reference shown in the playground UI ────────────────────────
export const DATASET_INFO = {
  tables: [
    {
      name: 'customers',
      description: `${NUM_CUSTOMERS} customers across Indonesia`,
      columns: ['id', 'name', 'email', 'phone', 'region', 'city', 'joined_date', 'membership', 'age', 'gender'],
      rowCount: NUM_CUSTOMERS,
    },
    {
      name: 'products',
      description: `${PRODUCTS.length} products in ${CATEGORIES.length} categories`,
      columns: ['id', 'name', 'category_id', 'supplier_id', 'sku', 'price', 'cost', 'stock', 'brand', 'rating'],
      rowCount: PRODUCTS.length,
    },
    {
      name: 'categories',
      description: `${CATEGORIES.length} product categories`,
      columns: ['id', 'name', 'description'],
      rowCount: CATEGORIES.length,
    },
    {
      name: 'suppliers',
      description: `${SUPPLIERS.length} suppliers`,
      columns: ['id', 'name', 'region', 'contact_email'],
      rowCount: SUPPLIERS.length,
    },
    {
      name: 'employees',
      description: `${NUM_EMPLOYEES} sales reps`,
      columns: ['id', 'name', 'role', 'region', 'hire_date', 'salary'],
      rowCount: NUM_EMPLOYEES,
    },
    {
      name: 'orders',
      description: `${NUM_ORDERS} orders (2023–2024)`,
      columns: ['id', 'customer_id', 'employee_id', 'order_date', 'status', 'payment_method', 'shipping_city', 'discount', 'total_amount'],
      rowCount: NUM_ORDERS,
    },
    {
      name: 'order_items',
      description: `${orderItemRows.length} line items`,
      columns: ['id', 'order_id', 'product_id', 'quantity', 'unit_price'],
      rowCount: orderItemRows.length,
    },
    {
      name: 'reviews',
      description: `${NUM_REVIEWS} product reviews`,
      columns: ['id', 'product_id', 'customer_id', 'rating', 'comment', 'review_date'],
      rowCount: NUM_REVIEWS,
    },
  ],
  get totalRows() {
    return this.tables.reduce((sum, t) => sum + t.rowCount, 0)
  },
}
