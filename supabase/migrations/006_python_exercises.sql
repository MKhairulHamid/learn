-- ============================================================
-- 006 — Python exercises for Session 10
-- Uses 'custom' validation (keyword checks) since evaluation
-- runs client-side via Pyodide — no SQL engine needed.
-- ============================================================

INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'Explore a DataFrame',
  'Eksplorasi DataFrame',
  'Create a pandas DataFrame from the dictionary below, then print its shape, the first 3 rows, and summary statistics.

data = {
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],
    "price":   [12500000, 285000, 450000, 4750000, 850000],
    "sold":    [12, 85, 60, 23, 45]
}',
  'Buat pandas DataFrame dari dictionary di bawah, lalu cetak shape-nya, 3 baris pertama, dan statistik ringkasan.

data = {
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],
    "price":   [12500000, 285000, 450000, 4750000, 850000],
    "sold":    [12, 85, 60, 23, 45]
}',
  E'import pandas as pd\n\ndata = {\n    "product": ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],\n    "price":   [12500000, 285000, 450000, 4750000, 850000],\n    "sold":    [12, 85, 60, 23, 45]\n}\n\n# Create the DataFrame\ndf = \n\n# Print shape\n\n# Print first 3 rows\n\n# Print summary statistics\n',
  E'import pandas as pd\n\ndata = {\n    "product": ["Laptop", "Mouse", "Keyboard", "Monitor", "Headset"],\n    "price":   [12500000, 285000, 450000, 4750000, 850000],\n    "sold":    [12, 85, 60, 23, 45]\n}\n\ndf = pd.DataFrame(data)\nprint(df.shape)\nprint(df.head(3))\nprint(df.describe())\n',
  '[
    {"id":"tc1","validation_type":"custom","expected_value":["pd.DataFrame","data"],"description_en":"Must create a DataFrame from data dict","description_id":"Harus membuat DataFrame dari dict data","points":35},
    {"id":"tc2","validation_type":"custom","expected_value":["shape"],"description_en":"Must print .shape","description_id":"Harus mencetak .shape","points":30},
    {"id":"tc3","validation_type":"custom","expected_value":["describe"],"description_en":"Must use .describe() for summary statistics","description_id":"Harus menggunakan .describe() untuk statistik ringkasan","points":35}
  ]',
  '["Use pd.DataFrame(data) to create the DataFrame","df.shape returns (rows, columns)","df.describe() shows count, mean, min, max etc."]',
  '["Gunakan pd.DataFrame(data) untuk membuat DataFrame","df.shape mengembalikan (baris, kolom)","df.describe() menampilkan count, mean, min, max dll."]',
  'easy', 1
FROM sessions s WHERE s.session_number = '10' LIMIT 1;


INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'GroupBy & Aggregation',
  'GroupBy & Agregasi',
  'Using the sales DataFrame below, find the total revenue per region. Then find the region with the highest average order value.

Columns: order_id, region, product, quantity, unit_price (revenue = quantity * unit_price)',
  'Menggunakan DataFrame penjualan di bawah, temukan total pendapatan per region. Lalu temukan region dengan rata-rata nilai order tertinggi.

Kolom: order_id, region, product, quantity, unit_price (revenue = quantity * unit_price)',
  E'import pandas as pd\n\ndata = {\n    "order_id": range(1, 11),\n    "region":   ["Java","Sumatra","Java","Bali","Kalimantan","Java","Sumatra","Bali","Java","Sumatra"],\n    "product":  ["Laptop","Mouse","Keyboard","Monitor","Headset","Mouse","Laptop","Keyboard","Monitor","Headset"],\n    "quantity": [2,5,3,1,4,6,1,2,3,5],\n    "unit_price":[12500000,285000,450000,4750000,850000,285000,12500000,450000,4750000,850000]\n}\n\ndf = pd.DataFrame(data)\ndf["revenue"] = df["quantity"] * df["unit_price"]\n\n# Total revenue per region\n\n\n# Region with highest average order value\n',
  E'import pandas as pd\n\ndata = {\n    "order_id": range(1, 11),\n    "region":   ["Java","Sumatra","Java","Bali","Kalimantan","Java","Sumatra","Bali","Java","Sumatra"],\n    "product":  ["Laptop","Mouse","Keyboard","Monitor","Headset","Mouse","Laptop","Keyboard","Monitor","Headset"],\n    "quantity": [2,5,3,1,4,6,1,2,3,5],\n    "unit_price":[12500000,285000,450000,4750000,850000,285000,12500000,450000,4750000,850000]\n}\n\ndf = pd.DataFrame(data)\ndf["revenue"] = df["quantity"] * df["unit_price"]\n\nprint(df.groupby("region")["revenue"].sum().sort_values(ascending=False))\nprint(df.groupby("region")["revenue"].mean().idxmax())\n',
  '[
    {"id":"tc1","validation_type":"custom","expected_value":["groupby","region"],"description_en":"Must use groupby on region","description_id":"Harus menggunakan groupby pada region","points":35},
    {"id":"tc2","validation_type":"custom","expected_value":["revenue"],"description_en":"Must use the revenue column","description_id":"Harus menggunakan kolom revenue","points":25},
    {"id":"tc3","validation_type":"custom","expected_value":["sum"],"description_en":"Must aggregate with sum()","description_id":"Harus mengagregasi dengan sum()","points":20},
    {"id":"tc4","validation_type":"custom","expected_value":["mean"],"description_en":"Must use mean() for average order value","description_id":"Harus menggunakan mean() untuk rata-rata nilai order","points":20}
  ]',
  '["Create a revenue column first: df[\"revenue\"] = df[\"quantity\"] * df[\"unit_price\"]","df.groupby(\"region\")[\"revenue\"].sum() totals revenue per region","Use .idxmax() to get the label of the maximum value"]',
  '["Buat kolom revenue dulu: df[\"revenue\"] = df[\"quantity\"] * df[\"unit_price\"]","df.groupby(\"region\")[\"revenue\"].sum() menjumlahkan pendapatan per region","Gunakan .idxmax() untuk mendapatkan label nilai maksimum"]',
  'medium', 2
FROM sessions s WHERE s.session_number = '10' LIMIT 1;


INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'sql',
  'EDA with Visualization',
  'EDA dengan Visualisasi',
  'Perform basic EDA on the customer orders DataFrame:
1. Print missing value counts
2. Plot a bar chart of total revenue by product category
3. Plot a line chart of monthly order counts

The DataFrame has columns: order_id, customer_id, category, revenue, order_date (format: YYYY-MM-DD)',
  'Lakukan EDA dasar pada DataFrame customer orders:
1. Cetak jumlah missing value
2. Buat bar chart total pendapatan per kategori produk
3. Buat line chart jumlah order per bulan

DataFrame memiliki kolom: order_id, customer_id, category, revenue, order_date (format: YYYY-MM-DD)',
  E'import pandas as pd\nimport matplotlib.pyplot as plt\n\ndata = {\n    "order_id":    range(1, 13),\n    "customer_id": [1,2,1,3,2,4,3,1,4,2,3,4],\n    "category":    ["Electronics","Books","Electronics","Furniture","Books","Electronics","Furniture","Books","Electronics","Furniture","Books","Electronics"],\n    "revenue":     [12500000,185000,450000,3200000,165000,4750000,4500000,155000,850000,3200000,185000,12500000],\n    "order_date":  ["2024-01-05","2024-01-12","2024-02-03","2024-02-14","2024-03-01","2024-03-18","2024-04-02","2024-04-15","2024-05-06","2024-06-03","2024-07-10","2024-08-22"]\n}\n\ndf = pd.DataFrame(data)\ndf["order_date"] = pd.to_datetime(df["order_date"])\ndf["month"] = df["order_date"].dt.to_period("M").astype(str)\n\n# 1. Print missing value counts\n\n\n# 2. Bar chart: revenue by category\n\n\n# 3. Line chart: order count by month\n',
  E'import pandas as pd\nimport matplotlib.pyplot as plt\n\ndata = {\n    "order_id":    range(1, 13),\n    "customer_id": [1,2,1,3,2,4,3,1,4,2,3,4],\n    "category":    ["Electronics","Books","Electronics","Furniture","Books","Electronics","Furniture","Books","Electronics","Furniture","Books","Electronics"],\n    "revenue":     [12500000,185000,450000,3200000,165000,4750000,4500000,155000,850000,3200000,185000,12500000],\n    "order_date":  ["2024-01-05","2024-01-12","2024-02-03","2024-02-14","2024-03-01","2024-03-18","2024-04-02","2024-04-15","2024-05-06","2024-06-03","2024-07-10","2024-08-22"]\n}\n\ndf = pd.DataFrame(data)\ndf["order_date"] = pd.to_datetime(df["order_date"])\ndf["month"] = df["order_date"].dt.to_period("M").astype(str)\n\nprint(df.isnull().sum())\n\ncat_rev = df.groupby("category")["revenue"].sum()\ncat_rev.plot(kind="bar", color="#0891b2")\nplt.title("Revenue by Category")\nplt.tight_layout()\nplt.show()\n\nmonthly = df.groupby("month")["order_id"].count()\nmonthly.plot(kind="line", marker="o")\nplt.title("Monthly Orders")\nplt.tight_layout()\nplt.show()\n',
  '[
    {"id":"tc1","validation_type":"custom","expected_value":["isnull"],"description_en":"Must check for missing values with isnull()","description_id":"Harus memeriksa missing value dengan isnull()","points":25},
    {"id":"tc2","validation_type":"custom","expected_value":["groupby","revenue"],"description_en":"Must groupby and aggregate revenue","description_id":"Harus groupby dan agregasi revenue","points":25},
    {"id":"tc3","validation_type":"custom","expected_value":["plot","bar"],"description_en":"Must create a bar chart","description_id":"Harus membuat bar chart","points":25},
    {"id":"tc4","validation_type":"custom","expected_value":["plot","line"],"description_en":"Must create a line chart","description_id":"Harus membuat line chart","points":25}
  ]',
  '["df.isnull().sum() shows missing count per column","df.groupby(\"category\")[\"revenue\"].sum() aggregates revenue","Use .plot(kind=\"bar\") for bar chart and .plot(kind=\"line\") for line chart","plt.show() displays each figure"]',
  '["df.isnull().sum() menampilkan jumlah missing per kolom","df.groupby(\"category\")[\"revenue\"].sum() mengagregasi revenue","Gunakan .plot(kind=\"bar\") untuk bar chart dan .plot(kind=\"line\") untuk line chart","plt.show() menampilkan setiap gambar"]',
  'hard', 3
FROM sessions s WHERE s.session_number = '10' LIMIT 1;
