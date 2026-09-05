-- ============================================================
-- 060: Add a hands-on, step-by-step "build the Seduh Coffee dashboard"
--      walkthrough to session X07 (Introduction to Power BI).
--
--   The existing X07 prose teaches the concepts (workflow, visuals,
--   relationships, DAX, publishing) but never walks the learner through
--   building the dashboard end-to-end on the actual final-project data pack
--   (orders / customers / products / marketing_spend). This inserts a
--   numbered walkthrough — Get Data → Power Query → star schema → DimDate →
--   DAX measures → four report pages → slicers → publish — using the real
--   column names from the CSV data pack.
--
--   Inserted via replace() before the "Common pitfalls" / "Kesalahan umum"
--   heading so the surrounding lesson is untouched. Idempotent: the guard
--   only rewrites rows that do not already contain the new heading.
--   Dollar-quoted so the markdown needs no escaping.
-- ============================================================

UPDATE public.sessions
SET content_en = replace(
  content_en,
  '## Common pitfalls',
  $md$## 6. Hands-on: build the Seduh Coffee dashboard step by step

Now build the dashboard end-to-end on the final-project **Seduh Coffee data pack** — the four CSVs `orders`, `customers`, `products` and `marketing_spend`.

**Step 1 — Get Data.** Home → **Get Data → Text/CSV** and import all four files. Click **Transform Data** (not Load) so you land in Power Query for cleaning.

**Step 2 — Clean in Power Query.** Set column types: dates (`order_date`, `signup_date`, `launch_date`, `month`) to *Date*; `quantity`, `age`, `impressions`, `clicks` to *Whole Number*; `unit_price`, `discount_pct`, `base_price`, `unit_cost`, `spend_idr`, `rating` to *Decimal*. Remove duplicate `order_id` rows. For revenue, keep only `order_status = "Completed"`. **Close & Apply.**

**Step 3 — Model the relationships (star schema).** In **Model view** drag:

- `orders[customer_id]` → `customers[customer_id]` (many-to-one)
- `orders[product_id]` → `products[product_id]` (many-to-one)

`orders` is your fact table; `customers` and `products` are dimensions. Keep `marketing_spend` linked on month (see the date table).

**Step 4 — Add a date table.** Modeling → **New Table**:

```
DimDate = CALENDAR(DATE(2024,1,1), DATE(2025,12,31))
Month   = FORMAT(DimDate[Date], "YYYY-MM")
```

Relate `DimDate[Date]` → `orders[order_date]` and **Mark as Date Table**.

**Step 5 — Write the core measures (DAX).**

```
Revenue         = SUMX(orders, orders[quantity] * orders[unit_price] * (1 - orders[discount_pct]))
COGS            = SUMX(orders, RELATED(products[unit_cost]) * orders[quantity])
Profit          = [Revenue] - [COGS]
Profit Margin % = DIVIDE([Profit], [Revenue])
Total Orders    = DISTINCTCOUNT(orders[order_id])
Marketing Spend = SUM(marketing_spend[spend_idr])
Marketing ROI   = DIVIDE([Revenue] - [Marketing Spend], [Marketing Spend])
```

**Step 6 — Build four report pages** (one question per page):

| Page | Visual | Fields |
|------|--------|--------|
| **Revenue trend** | Cards + line | KPI cards for `Revenue`, `Profit`, `Total Orders`; line = `DimDate[Month]` × `Revenue` |
| **Channel mix** | Donut + table | Legend `orders[channel]` × `Revenue` |
| **Category profit** | Sorted bar | Axis `products[category]` × `Profit` |
| **Marketing ROI** | Column + card | `month` × `Marketing Spend` vs `Revenue`; card `Marketing ROI` |

**Step 7 — Add slicers.** Drop slicers for `DimDate[Year]`, `orders[channel]`, `products[category]` and `customers[province]` so leadership filters for themselves. Use **View → Sync slicers** to keep filters consistent across pages.

**Step 8 — Publish.** File → Save (`.pbix`) → Home → **Publish** → pick a Workspace in Power BI Service → **Share** to get a link. Keep that link for your portfolio submission.

> **Quick recap:** Get Data → clean in Power Query → star-schema relationships → DimDate → DAX measures → four pages → slicers → publish.

---

## Common pitfalls$md$
)
WHERE session_number = 'X07'
  AND content_en NOT LIKE '%Hands-on: build the Seduh Coffee dashboard%';

UPDATE public.sessions
SET content_id = replace(
  content_id,
  '## Kesalahan umum',
  $md$## 6. Hands-on: bangun dashboard Seduh Coffee langkah demi langkah

Sekarang bangun dashboard-nya dari awal sampai akhir memakai **Data Pack Seduh Coffee** dari tugas akhir — empat CSV: `orders`, `customers`, `products`, dan `marketing_spend`.

**Langkah 1 — Get Data.** Home → **Get Data → Text/CSV** lalu impor keempat file. Klik **Transform Data** (bukan Load) supaya masuk ke Power Query untuk cleaning.

**Langkah 2 — Bersihkan di Power Query.** Set tipe kolom: tanggal (`order_date`, `signup_date`, `launch_date`, `month`) jadi *Date*; `quantity`, `age`, `impressions`, `clicks` jadi *Whole Number*; `unit_price`, `discount_pct`, `base_price`, `unit_cost`, `spend_idr`, `rating` jadi *Decimal*. Hapus baris `order_id` duplikat. Untuk revenue, saring hanya `order_status = "Completed"`. **Close & Apply.**

**Langkah 3 — Modelkan relasi (star schema).** Di **Model view** tarik:

- `orders[customer_id]` → `customers[customer_id]` (many-to-one)
- `orders[product_id]` → `products[product_id]` (many-to-one)

`orders` adalah fact table; `customers` dan `products` adalah dimensi. Hubungkan `marketing_spend` lewat bulan (lihat tabel tanggal).

**Langkah 4 — Tambah tabel tanggal.** Modeling → **New Table**:

```
DimDate = CALENDAR(DATE(2024,1,1), DATE(2025,12,31))
Month   = FORMAT(DimDate[Date], "YYYY-MM")
```

Relasikan `DimDate[Date]` → `orders[order_date]` dan **Mark as Date Table**.

**Langkah 5 — Tulis measure inti (DAX).**

```
Revenue         = SUMX(orders, orders[quantity] * orders[unit_price] * (1 - orders[discount_pct]))
COGS            = SUMX(orders, RELATED(products[unit_cost]) * orders[quantity])
Profit          = [Revenue] - [COGS]
Profit Margin % = DIVIDE([Profit], [Revenue])
Total Orders    = DISTINCTCOUNT(orders[order_id])
Marketing Spend = SUM(marketing_spend[spend_idr])
Marketing ROI   = DIVIDE([Revenue] - [Marketing Spend], [Marketing Spend])
```

**Langkah 6 — Bangun empat halaman laporan** (satu pertanyaan per halaman):

| Halaman | Visual | Field |
|---------|--------|-------|
| **Tren revenue** | Card + line | KPI card `Revenue`, `Profit`, `Total Orders`; line = `DimDate[Month]` × `Revenue` |
| **Bauran channel** | Donut + tabel | Legend `orders[channel]` × `Revenue` |
| **Profit kategori** | Bar terurut | Axis `products[category]` × `Profit` |
| **ROI marketing** | Column + card | `month` × `Marketing Spend` vs `Revenue`; card `Marketing ROI` |

**Langkah 7 — Tambah slicer.** Pasang slicer `DimDate[Year]`, `orders[channel]`, `products[category]`, dan `customers[province]` agar leadership bisa memfilter sendiri. Pakai **View → Sync slicers** supaya filter konsisten antar halaman.

**Langkah 8 — Publish.** File → Save (`.pbix`) → Home → **Publish** → pilih Workspace di Power BI Service → **Share** untuk mendapat link. Simpan link itu untuk submission portofolio.

> **Ringkasan cepat:** Get Data → bersihkan di Power Query → relasi star schema → DimDate → measure DAX → empat halaman → slicer → publish.

---

## Kesalahan umum$md$
)
WHERE session_number = 'X07'
  AND content_id NOT LIKE '%Hands-on: bangun dashboard Seduh Coffee%';
