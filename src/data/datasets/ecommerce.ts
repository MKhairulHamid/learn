// E-commerce dataset for SQL practice
// Tables: customers, products, orders, order_items

export const ECOMMERCE_SEED_SQL = `
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  joined_date TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'regular'
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  order_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  total_amount REAL NOT NULL
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);

INSERT INTO customers VALUES
(1,  'Budi Santoso',      'budi@email.com',     'Java',       'Jakarta',   '2023-01-15', 'premium'),
(2,  'Siti Rahayu',       'siti@email.com',      'Java',       'Surabaya',  '2023-02-20', 'regular'),
(3,  'Ahmad Fauzi',       'ahmad@email.com',     'Sumatra',    'Medan',     '2023-03-10', 'premium'),
(4,  'Dewi Lestari',      'dewi@email.com',      'Java',       'Bandung',   '2023-03-25', 'regular'),
(5,  'Rizky Pratama',     'rizky@email.com',     'Java',       'Jakarta',   '2023-04-05', 'premium'),
(6,  'Nur Hidayah',       'nur@email.com',       'Kalimantan', 'Balikpapan','2023-04-18', 'regular'),
(7,  'Wahyu Setiawan',    'wahyu@email.com',     'Java',       'Semarang',  '2023-05-02', 'regular'),
(8,  'Fitri Handayani',   'fitri@email.com',     'Sumatra',    'Palembang', '2023-05-20', 'premium'),
(9,  'Eko Prasetyo',      'eko@email.com',       'Java',       'Yogyakarta','2023-06-08', 'regular'),
(10, 'Maya Indrawati',    'maya@email.com',      'Bali',       'Denpasar',  '2023-06-15', 'premium'),
(11, 'Doni Kusuma',       'doni@email.com',      'Java',       'Jakarta',   '2023-07-01', 'regular'),
(12, 'Rina Wulandari',    'rina@email.com',      'Sulawesi',   'Makassar',  '2023-07-14', 'regular'),
(13, 'Hendra Gunawan',    'hendra@email.com',    'Java',       'Surabaya',  '2023-08-03', 'premium'),
(14, 'Yuni Astuti',       'yuni@email.com',      'Java',       'Bandung',   '2023-08-22', 'regular'),
(15, 'Farhan Malik',      'farhan@email.com',    'Sumatra',    'Medan',     '2023-09-10', 'premium');

INSERT INTO products VALUES
(1,  'Laptop Pro 15"',       'Electronics',  12500000, 45),
(2,  'Wireless Mouse',       'Electronics',    285000, 200),
(3,  'USB-C Hub',            'Electronics',    450000, 150),
(4,  'Python Programming',   'Books',          185000, 300),
(5,  'Data Analytics Guide', 'Books',          165000, 250),
(6,  'SQL Mastery',          'Books',          155000,  80),
(7,  'Standing Desk',        'Furniture',     3200000,  30),
(8,  'Ergonomic Chair',      'Furniture',     4500000,  25),
(9,  'Monitor 27"',          'Electronics',  4750000,  60),
(10, 'Mechanical Keyboard',  'Electronics',    850000, 120);

INSERT INTO orders VALUES
(1,  1,  '2024-01-05', 'completed', 12785000),
(2,  2,  '2024-01-12', 'completed',   450000),
(3,  3,  '2024-01-18', 'completed',  5200000),
(4,  4,  '2024-01-22', 'completed',   350000),
(5,  5,  '2024-02-03', 'completed', 17250000),
(6,  1,  '2024-02-10', 'completed',  1135000),
(7,  6,  '2024-02-14', 'completed',   735000),
(8,  7,  '2024-02-20', 'completed',  4500000),
(9,  3,  '2024-02-28', 'completed',   320000),
(10, 8,  '2024-03-05', 'completed', 13350000),
(11, 9,  '2024-03-11', 'completed',   505000),
(12, 10, '2024-03-18', 'completed',  4750000),
(13, 2,  '2024-03-25', 'completed',  3200000),
(14, 11, '2024-04-02', 'completed',   285000),
(15, 12, '2024-04-09', 'completed',  1700000),
(16, 5,  '2024-04-15', 'completed',  9500000),
(17, 13, '2024-04-22', 'completed',   920000),
(18, 14, '2024-04-28', 'completed',  5600000),
(19, 4,  '2024-05-06', 'cancelled',   165000),
(20, 15, '2024-05-12', 'completed', 12500000),
(21, 1,  '2024-05-20', 'completed',  4750000),
(22, 6,  '2024-05-27', 'completed',   850000),
(23, 10, '2024-06-03', 'completed',  3200000),
(24, 7,  '2024-06-10', 'completed',  1005000),
(25, 9,  '2024-06-18', 'completed',   450000),
(26, 3,  '2024-06-24', 'completed',  4800000),
(27, 13, '2024-07-02', 'completed',  4500000),
(28, 8,  '2024-07-09', 'completed',   340000),
(29, 2,  '2024-07-15', 'completed',   850000),
(30, 11, '2024-07-22', 'completed',  5000000),
(31, 5,  '2024-08-01', 'completed', 13000000),
(32, 14, '2024-08-08', 'completed',   450000),
(33, 15, '2024-08-15', 'completed',  1700000),
(34, 12, '2024-08-21', 'completed',   310000),
(35, 4,  '2024-09-03', 'completed',  3200000),
(36, 1,  '2024-09-10', 'completed',   735000),
(37, 6,  '2024-09-17', 'completed',  4750000),
(38, 9,  '2024-09-24', 'completed',  1850000),
(39, 13, '2024-10-02', 'completed',  5450000),
(40, 3,  '2024-10-08', 'completed',   285000),
(41, 7,  '2024-10-15', 'completed',  8700000),
(42, 10, '2024-10-22', 'completed',   920000),
(43, 2,  '2024-11-01', 'completed',  4500000),
(44, 15, '2024-11-08', 'completed',  9250000),
(45, 5,  '2024-11-15', 'completed',   850000),
(46, 8,  '2024-11-22', 'completed', 12500000),
(47, 14, '2024-12-03', 'completed',  4750000),
(48, 11, '2024-12-10', 'completed',  3200000),
(49, 1,  '2024-12-17', 'completed',   505000),
(50, 12, '2024-12-24', 'completed',   450000);

INSERT INTO order_items VALUES
(1,  1,  1,  1, 12500000), (2,  1,  2,  1,   285000),
(3,  2,  3,  1,   450000),
(4,  3,  9,  1,  4750000), (5,  3,  4,  2,   185000), (6,  3,  7,  0,        0),
(7,  4,  4,  1,   185000), (8,  4,  5,  1,   165000),
(9,  5,  1,  1, 12500000), (10, 5,  9,  1,  4750000),
(11, 6,  2,  2,   285000), (12, 6,  3,  1,   450000), (13, 6,  6,  1,   155000),
(14, 7,  2,  1,   285000), (15, 7,  10, 0,        0), (16, 7,  6,  3,   155000),
(17, 8,  8,  1,  4500000),
(18, 9,  5,  1,   165000), (19, 9,  6,  1,   155000),
(20,10,  1,  1, 12500000), (21,10,  2,  3,   285000),
(22,11,  4,  1,   185000), (23,11,  2,  1,   285000), (24,11,  6,  1,   155000),
(25,12,  9,  1,  4750000),
(26,13,  7,  1,  3200000),
(27,14,  2,  1,   285000),
(28,15, 10,  2,   850000),
(29,16,  9,  2,  4750000),
(30,17, 10,  1,   850000), (31,17,  6,  1,   155000),
(32,18,  7,  1,  3200000), (33,18,  4,  5,   185000),
(34,20,  1,  1, 12500000),
(35,21,  9,  1,  4750000),
(36,22, 10,  1,   850000),
(37,23,  7,  1,  3200000),
(38,24,  3,  1,   450000), (39,24, 10,  1,   850000),
(40,25,  3,  1,   450000),
(41,26,  9,  1,  4750000), (42,26,  6,  1,   155000),
(43,27,  8,  1,  4500000),
(44,28,  4,  1,   185000), (45,28,  5,  1,   155000),
(46,29, 10,  1,   850000),
(47,30,  9,  1,  4750000), (48,30,  4,  1,   185000),
(49,31,  1,  1, 12500000), (50,31,  3,  1,   450000);
`

export const DATASET_INFO = {
  tables: [
    {
      name: 'customers',
      description: '15 customers across Indonesia',
      columns: ['id', 'name', 'email', 'region', 'city', 'joined_date', 'membership'],
      rowCount: 15,
    },
    {
      name: 'products',
      description: '10 products in 3 categories',
      columns: ['id', 'name', 'category', 'price', 'stock'],
      rowCount: 10,
    },
    {
      name: 'orders',
      description: '50 orders (Jan–Dec 2024)',
      columns: ['id', 'customer_id', 'order_date', 'status', 'total_amount'],
      rowCount: 50,
    },
    {
      name: 'order_items',
      description: 'Line items for each order',
      columns: ['id', 'order_id', 'product_id', 'quantity', 'unit_price'],
      rowCount: 51,
    },
  ],
}
