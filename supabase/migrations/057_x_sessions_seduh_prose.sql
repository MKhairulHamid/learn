-- ============================================================
-- 057: Re-theme the X-program lesson prose onto Seduh Coffee.
--
--   The whole program used a fictional grocery chain, "TokoSegar", as its
--   running example, while the final project the learner actually builds runs on
--   Seduh Coffee. This aligns the two so every worked example, case study and
--   sample table refers to the same business — and, where possible, to the same
--   figures the learner will compute in the project.
--
--   X01-X03 are rewritten in full: their narrative was grocery-specific
--   (produce, dairy, in-store baskets, delivery, shelf restocking) well beyond a
--   name swap. Every mechanics table (Excel functions, stats formulas, pivot
--   zones) is preserved verbatim — only the narrative and sample data change.
--   The descriptive-statistics numbers are kept identical so the computed mean /
--   median / range / std dev in the lesson stay correct.
--
--   X05, X07, X10, X11 change a handful of themed sentences via replace(), so
--   the surrounding mechanics are untouched. X07's DAX measure is corrected to
--   Seduh's model: revenue is computed, there is no total_amount column.
--
--   X04 was already rebuilt in migrations 055-056. X06, X08, X12 used only
--   generic vocabulary and need no change.
--
--   Dollar-quoted so the markdown needs no escaping.
-- ============================================================

-- ── X01 · Business acumen ────────────────────────────────────

UPDATE public.sessions SET content_en = $md$## Why business acumen comes first

A dashboard full of charts is worthless if it answers the wrong question. **Business acumen** is what tells you which question matters. Before touching a single formula, a strong analyst understands how the business makes money, where it loses money, and which levers move the needle.

Throughout this program we follow **Seduh Coffee**, a direct-to-consumer specialty coffee brand founded in 2022. Seduh roasts single-origin beans and sells beans, ready-to-drink coffee, brewing gear, subscriptions and gift sets — through its own webstore and through Tokopedia, Shopee and TikTok Shop. Every concept ties back to a real Seduh decision, and to the dataset you will analyse in the final project.

---

## 1. What business acumen actually means

Business acumen is the ability to read a business through three lenses at once:

| Lens | The question it asks | Seduh example |
|------|----------------------|-------------------|
| **Revenue** | How do we earn, and from whom? | Bean, RTD & gift-set orders across four channels + subscriptions |
| **Cost** | What does it cost to earn that? | Cost of goods (`unit_cost`), marketing spend, discounts |
| **Customer** | Who buys, how often, why do they leave? | Repeat home-brewers vs one-time deal-seekers |

An analyst without acumen reports *"revenue fell 8% in March."* An analyst with acumen reports *"revenue fell 8% because repeat buyers slowed while acquisition cost kept climbing — and repeat buyers drive 97% of our revenue."* Same data, very different value.

> **Rule of thumb:** every number you report should connect to money, customers, or risk. If it connects to none of those, ask why you are reporting it.

---

## 2. Mapping a business process

Every business is a chain of **input → process → output**. Mapping it shows you *where* data is created and *what* is worth measuring.

`Green beans & orders → Roast, pack, dispatch → Delivered sales`

A closer look at Seduh's online order:

| Stage | What happens | Data created | Candidate metric |
|-------|--------------|--------------|------------------|
| Input | Customer places order | order_id, product_id, quantity | Orders per day |
| Process | Roast, pick, pack, dispatch | pick time, packer_id | Avg dispatch time |
| Output | Delivered to customer | delivered_at, rating | On-time delivery %, avg rating |

### Leading vs lagging indicators

Once you can see the process, you can pick metrics that **predict** the future (leading) versus ones that **report** the past (lagging).

| Type | Definition | Examples | Use it to… |
|------|------------|----------|-----------|
| **Leading** | Moves *before* the outcome | New leads, cart adds, avg dispatch time | Steer while there is still time to act |
| **Lagging** | Confirms *after* the outcome | Revenue, churn, net profit | Judge whether a past decision worked |

> **Mini case study — the dispatch alarm.** Seduh's revenue (lagging) looked fine in week 1, but average dispatch time (leading) crept from 20 to 34 hours as orders piled up. Because the team watched the leading metric, they added a packer *before* ratings and repeat orders fell. Lagging-only teams would have seen it a month too late.

---

## 3. From a vague question to a sharp problem statement

Stakeholders ask vague questions. Your first job is to sharpen them.

| Vague ask | Sharpened problem statement |
|-----------|------------------------------|
| "Sales are bad." | "Average order value fell 12% MoM on Shopee in March 2026 — which categories drove the drop?" |
| "Are customers happy?" | "Has the 30-day repeat-purchase rate changed since we deepened discounts in the 12.12 campaign?" |
| "Where should we spend more?" | "Which acquisition channel returns the most revenue per rupiah of marketing spend?" |

### The 5W1H frame

**What** changed, **Where**, **When**, **Who** is affected, **Why** it matters, **How** we will measure it. A statement that answers all six is ready to analyse.

### The 5 Whys (find the real driver)

```
Repeat-purchase rate fell
↓ why? → fewer customers place a second order
↓ why? → first-time buyers arrived on a deep discount
↓ why? → the 12.12 campaign chased order volume
↓ why? → the campaign optimised for orders, not repeat value
↓ why? → success was measured on revenue, not retention
```

The fifth *why* — the success metric — is the fixable root cause. Stopping at "fewer second orders" would have hidden it.

---

## 4. Descriptive statistics that matter

Summary statistics compress thousands of rows into a few honest numbers. Consider seven Seduh order values from one afternoon (in thousand Rupiah):

`45, 52, 48, 51, 47, 300, 49`

| Measure | Excel formula | Value | What it tells you |
|---------|---------------|-------|-------------------|
| Mean | `=AVERAGE(A2:A8)` | 84.6 | The average — but distorted by the 300 outlier |
| Median | `=MEDIAN(A2:A8)` | 49 | The middle value — the *typical* order |
| Mode | `=MODE.SNGL(A2:A8)` | — | The most frequent value |
| Range | `=MAX-MIN` | 255 | Spread from smallest to largest |
| Std dev | `=STDEV.S(A2:A8)` | 94.7 | How far values sit from the mean |

Notice the mean (84.6) describes *no actual order*. The median (49) is the honest "typical order" — here the 300 is a bulk gift-set order. That gap is the outlier's fingerprint.

### Which measure, when?

| Situation | Use | Why |
|-----------|-----|-----|
| Data has outliers (order value, income) | **Median** | Resistant to extreme values |
| Symmetric data, no extremes | **Mean** | Uses every value |
| Categorical / most-common | **Mode** | Only measure that works on labels |
| Describing consistency/risk | **Std dev + range** | Two channels can share a mean but differ wildly |

> **Mini case study — two channels, same average.** Webstore and Shopee both average Rp 50k orders. Webstore's std dev is 5; Shopee's is 40. Shopee carries both big gift-set orders and tiny single-RTD baskets — a segmentation opportunity the average completely hid.

---

## Common pitfalls & edge cases

- **Reporting the mean on skewed data.** One bulk corporate gift order makes "average order value" meaningless — quote the median too.
- **Confusing correlation with cause.** Ice-cream sales and fan sales both rise in summer; neither causes the other.
- **Vanity metrics.** Total page views feels good but does not connect to money — prefer conversion rate.
- **Std dev of tiny samples.** With 3 data points, std dev is unstable; note your sample size.

---

## Glossary

| Term | Meaning |
|------|---------|
| Metric | A number that tracks something the business cares about |
| Leading indicator | Predicts an outcome before it happens |
| Lagging indicator | Confirms an outcome after it happened |
| Problem statement | A specific, measurable framing of the question |
| Outlier | A value far from the rest of the data |
| Standard deviation | Average distance of values from the mean (spread) |

---

## Key Takeaways

1. Business acumen decides *which* question is worth answering — always tie a number to money, customers, or risk.
2. Map the **input → process → output** chain to see where data is born and what to measure.
3. **Leading** metrics let you steer; **lagging** metrics let you judge. Watch both.
4. Sharpen vague asks with **5W1H**; find root causes with the **5 Whys**.
5. On skewed data, the **median** is more honest than the mean; **std dev** reveals risk the average hides.

> 💡 Practice the concepts with the matching exercises below, then build the business-process & metrics worksheet in the assignment.$md$
WHERE session_number = 'X01';

UPDATE public.sessions SET content_id = $md$## Kenapa business acumen didahulukan

Dashboard penuh grafik tidak berguna kalau menjawab pertanyaan yang salah. **Business acumen** adalah yang memberi tahu pertanyaan mana yang penting. Sebelum menyentuh satu rumus pun, analyst yang kuat memahami bagaimana bisnis menghasilkan uang, di mana kehilangan uang, dan tuas mana yang menggerakkan hasil.

Sepanjang program ini kita mengikuti **Seduh Coffee**, brand kopi specialty direct-to-consumer yang berdiri pada 2022. Seduh me-roasting biji single-origin dan menjual biji, kopi siap minum, alat seduh, langganan, dan gift set — lewat webstore sendiri serta Tokopedia, Shopee, dan TikTok Shop. Setiap konsep dikaitkan ke keputusan nyata Seduh, dan ke dataset yang akan Anda analisis di proyek akhir.

---

## 1. Apa arti business acumen sebenarnya

Business acumen adalah kemampuan membaca bisnis lewat tiga lensa sekaligus:

| Lensa | Pertanyaannya | Contoh Seduh |
|-------|---------------|------------------|
| **Revenue** | Bagaimana kita menghasilkan, dari siapa? | Order biji, RTD & gift set di empat channel + langganan |
| **Cost** | Berapa biayanya untuk menghasilkan itu? | Harga pokok (`unit_cost`), belanja marketing, diskon |
| **Customer** | Siapa yang beli, seberapa sering, kenapa pergi? | Home-brewer yang repeat vs pemburu diskon sekali beli |

Analyst tanpa acumen melapor *"revenue turun 8% di Maret."* Analyst dengan acumen melapor *"revenue turun 8% karena repeat buyer melambat sementara biaya akuisisi terus naik — dan repeat buyer menyumbang 97% revenue kita."* Data sama, nilai sangat berbeda.

> **Aturan praktis:** setiap angka yang Anda laporkan harus terhubung ke uang, pelanggan, atau risiko. Kalau tidak terhubung ke salah satunya, tanyakan kenapa Anda melaporkannya.

---

## 2. Memetakan proses bisnis

Setiap bisnis adalah rantai **input → proses → output**. Memetakannya menunjukkan *di mana* data lahir dan *apa* yang layak diukur.

`Green bean & order → Roasting, pack, dispatch → Penjualan terkirim`

Lebih dekat pada order online Seduh:

| Tahap | Yang terjadi | Data yang lahir | Kandidat metrik |
|-------|--------------|-----------------|-----------------|
| Input | Pelanggan membuat order | order_id, product_id, quantity | Order per hari |
| Proses | Roasting, pick, pack, dispatch | waktu pick, packer_id | Rata-rata waktu dispatch |
| Output | Sampai ke pelanggan | delivered_at, rating | % pengiriman tepat waktu, rata-rata rating |

### Leading vs lagging indicator

Setelah proses terlihat, Anda bisa memilih metrik yang **memprediksi** masa depan (leading) versus yang **melaporkan** masa lalu (lagging).

| Tipe | Definisi | Contoh | Gunakan untuk… |
|------|----------|--------|----------------|
| **Leading** | Bergerak *sebelum* hasil | Lead baru, add-to-cart, waktu dispatch | Mengarahkan selagi masih sempat bertindak |
| **Lagging** | Mengonfirmasi *setelah* hasil | Revenue, churn, laba bersih | Menilai apakah keputusan lalu berhasil |

> **Studi kasus mini — alarm dispatch.** Revenue Seduh (lagging) tampak baik di minggu 1, tapi rata-rata waktu dispatch (leading) merangkak dari 20 ke 34 jam saat order menumpuk. Karena tim memantau metrik leading, mereka menambah packer *sebelum* rating dan repeat order turun. Tim yang hanya melihat lagging akan telat sebulan.

---

## 3. Dari pertanyaan samar ke problem statement yang tajam

Stakeholder mengajukan pertanyaan samar. Tugas pertama Anda menajamkannya.

| Permintaan samar | Problem statement yang tajam |
|------------------|------------------------------|
| "Penjualan jelek." | "Average order value turun 12% MoM di Shopee pada Maret 2026 — kategori apa yang mendorong penurunan?" |
| "Apa pelanggan senang?" | "Apakah repeat-purchase 30 hari berubah sejak kita memperdalam diskon di kampanye 12.12?" |
| "Di mana kita harus belanja lebih banyak?" | "Channel akuisisi mana yang memberi revenue terbesar per rupiah belanja marketing?" |

### Kerangka 5W1H

**What** yang berubah, **Where**, **When**, **Who** yang terdampak, **Why** ini penting, **How** cara mengukurnya. Statement yang menjawab keenamnya siap dianalisis.

### 5 Whys (temukan pendorong sebenarnya)

```
Repeat-purchase rate turun
↓ kenapa? → makin sedikit pelanggan order kedua
↓ kenapa? → pembeli pertama datang lewat diskon dalam
↓ kenapa? → kampanye 12.12 mengejar volume order
↓ kenapa? → kampanye dioptimalkan untuk order, bukan nilai repeat
↓ kenapa? → kesuksesan diukur dari revenue, bukan retensi
```

*Why* kelima — metrik kesuksesan — adalah akar masalah yang bisa diperbaiki. Berhenti di "order kedua berkurang" akan menyembunyikannya.

---

## 4. Statistik deskriptif yang penting

Statistik ringkasan memadatkan ribuan baris menjadi beberapa angka jujur. Lihat tujuh order value Seduh (ribu Rupiah) satu sore:

`45, 52, 48, 51, 47, 300, 49`

| Ukuran | Rumus Excel | Nilai | Artinya |
|--------|-------------|-------|---------|
| Mean | `=AVERAGE(A2:A8)` | 84,6 | Rata-rata — tapi terdistorsi outlier 300 |
| Median | `=MEDIAN(A2:A8)` | 49 | Nilai tengah — order *tipikal* |
| Modus | `=MODE.SNGL(A2:A8)` | — | Nilai paling sering muncul |
| Range | `=MAX-MIN` | 255 | Rentang dari terkecil ke terbesar |
| Std dev | `=STDEV.S(A2:A8)` | 94,7 | Seberapa jauh nilai dari mean |

Perhatikan mean (84,6) tidak menggambarkan *order mana pun*. Median (49) adalah "order tipikal" yang jujur — di sini 300 adalah order gift set borongan. Selisih itu adalah sidik jari outlier.

### Ukuran mana, kapan?

| Situasi | Pakai | Kenapa |
|---------|-------|--------|
| Ada outlier (order value, pendapatan) | **Median** | Tahan terhadap nilai ekstrem |
| Data simetris, tanpa ekstrem | **Mean** | Memakai setiap nilai |
| Kategorikal / paling umum | **Modus** | Satu-satunya untuk label |
| Menggambarkan konsistensi/risiko | **Std dev + range** | Dua channel bisa ber-mean sama tapi jauh berbeda |

> **Studi kasus mini — dua channel, rata-rata sama.** Webstore dan Shopee sama-sama rata-rata order Rp 50k. Std dev Webstore 5; Shopee 40. Shopee memuat order gift set besar dan basket satu-RTD yang kecil — peluang segmentasi yang disembunyikan rata-rata.

---

## Kesalahan umum & edge case

- **Melaporkan mean pada data miring.** Satu order gift korporat borongan membuat "average order value" tak bermakna — sertakan median.
- **Mengira korelasi = sebab.** Penjualan es krim dan kipas sama-sama naik saat panas; tidak saling menyebabkan.
- **Vanity metric.** Total page view terasa enak tapi tak terhubung uang — pilih conversion rate.
- **Std dev sampel kecil.** Dengan 3 data, std dev tidak stabil; catat ukuran sampel.

---

## Glosarium

| Istilah | Arti |
|---------|------|
| Metrik | Angka yang melacak sesuatu yang bisnis pedulikan |
| Leading indicator | Memprediksi hasil sebelum terjadi |
| Lagging indicator | Mengonfirmasi hasil setelah terjadi |
| Problem statement | Framing pertanyaan yang spesifik dan terukur |
| Outlier | Nilai yang jauh dari data lain |
| Standar deviasi | Rata-rata jarak nilai dari mean (sebaran) |

---

## Kesimpulan Utama

1. Business acumen menentukan pertanyaan mana yang layak dijawab — selalu kaitkan angka ke uang, pelanggan, atau risiko.
2. Petakan rantai **input → proses → output** untuk melihat di mana data lahir dan apa yang diukur.
3. Metrik **leading** untuk mengarahkan; **lagging** untuk menilai. Pantau keduanya.
4. Tajamkan permintaan samar dengan **5W1H**; temukan akar masalah dengan **5 Whys**.
5. Pada data miring, **median** lebih jujur dari mean; **std dev** mengungkap risiko yang disembunyikan rata-rata.

> 💡 Latih konsep lewat exercise matching di bawah, lalu susun kertas kerja proses bisnis & metrik di tugas.$md$
WHERE session_number = 'X01';

-- ── X02 · Cleaning data ──────────────────────────────────────

UPDATE public.sessions SET content_en = replace(replace(replace(content_en,
  'TokoSegar just exported a customer list from an old POS system. We will clean it together.',
  'Seduh just pulled its customer list out of the marketplace and webstore back-ends, and the exports do not agree — the same mess you will fix in the final project. We will clean it together.'),
  '**Before → after on TokoSegar names:**',
  '**Before → after on Seduh customer names:**'),
  '> **Mini case study — the supplier export.** A supplier sent 5,000 rows where prices like `"Rp 12.500"` were text, so `SUM` returned 0. `=VALUE(SUBSTITUTE(SUBSTITUTE(A2,"Rp ",""),".",""))` converted them, and the total finally matched the invoice. One formula, an afternoon saved.',
  '> **Mini case study — the marketplace export.** A Shopee export gave Seduh 5,000 rows where prices like `"Rp 12.500"` were text, so `SUM` returned 0. `=VALUE(SUBSTITUTE(SUBSTITUTE(A2,"Rp ",""),".",""))` converted them, and the total finally matched the payout report. One formula, an afternoon saved.')
WHERE session_number = 'X02';

UPDATE public.sessions SET content_id = replace(replace(replace(content_id,
  'TokoSegar baru mengekspor daftar pelanggan dari sistem POS lama. Kita bersihkan bersama.',
  'Seduh baru menarik daftar pelanggan dari back-end marketplace dan webstore, dan ekspornya tidak konsisten — kekacauan yang sama yang akan Anda perbaiki di proyek akhir. Kita bersihkan bersama.'),
  '**Sebelum → sesudah pada nama TokoSegar:**',
  '**Sebelum → sesudah pada nama pelanggan Seduh:**'),
  '> **Studi kasus mini — ekspor pemasok.** Pemasok mengirim 5.000 baris dengan harga seperti `"Rp 12.500"` sebagai teks, sehingga `SUM` menghasilkan 0. `=VALUE(SUBSTITUTE(SUBSTITUTE(A2,"Rp ",""),".",""))` mengonversinya, dan total akhirnya cocok dengan invoice. Satu rumus, satu sore terselamatkan.',
  '> **Studi kasus mini — ekspor marketplace.** Sebuah ekspor Shopee memberi Seduh 5.000 baris dengan harga seperti `"Rp 12.500"` sebagai teks, sehingga `SUM` menghasilkan 0. `=VALUE(SUBSTITUTE(SUBSTITUTE(A2,"Rp ",""),".",""))` mengonversinya, dan total akhirnya cocok dengan laporan payout. Satu rumus, satu sore terselamatkan.')
WHERE session_number = 'X02';

-- ── X03 · Pivot tables ───────────────────────────────────────

UPDATE public.sessions SET content_en = $md$## Why pivot tables

A pivot table summarises thousands of rows into insight in seconds — no formulas, no errors, fully re-arrangeable by drag-and-drop. If you can phrase a question as *"total X by Y"*, a pivot answers it faster than any formula.

We will analyse Seduh's raw order log.

---

## 1. Anatomy of a pivot table

Every pivot has four drop zones:

| Zone | Role | Seduh example |
|------|------|-------------------|
| **Rows** | Categories down the side | Product category |
| **Columns** | Categories across the top | Month |
| **Values** | The numbers to aggregate | Sum of revenue |
| **Filters** | Slice the whole table | Channel = Shopee |

---

## 2. Building your first pivot

Raw log (one row per order line):

| order_date | category | channel | revenue |
|------|----------|--------|---------|
| 2025-03-01 | Roasted Beans | Shopee | 120 |
| 2025-03-01 | Ready to Drink | Shopee | 80 |
| 2025-03-02 | Roasted Beans | Tokopedia | 60 |
| 2025-03-02 | Roasted Beans | Shopee | 140 |

Steps: select the data → **Insert → PivotTable** → drag `category` to **Rows**, `revenue` to **Values**. Result:

| Category | Sum of revenue |
|----------|----------------|
| Roasted Beans | 320 |
| Ready to Drink | 80 |
| **Grand total** | **400** |

Drag `channel` to **Columns** and you get a category × channel matrix — same data, new question, zero formulas.

---

## 3. Aggregations and "Show Values As"

Double-click a value field → **Value Field Settings** to change how numbers combine:

| Aggregation | Answers |
|-------------|---------|
| Sum | Total revenue |
| Count | Number of orders |
| Average | Average order value |
| Max / Min | Biggest / smallest sale |

**Show Values As** reframes the same number:

| Option | Turns revenue into |
|--------|--------------------|
| % of Grand Total | Each category's share of the whole |
| % of Column Total | Share within each month |
| Running Total | Cumulative revenue over time |

---

## 4. Advanced moves

- **Grouping**: right-click a date row → **Group** → by Month/Quarter to roll daily data up to months.
- **Calculated Field**: **PivotTable Analyze → Fields → Calculated Field**, e.g. `profit = revenue - cost`.
- **Slicers & Timelines**: **Insert → Slicer** gives clickable buttons; **Timeline** gives a date slider — both filter the pivot interactively for a mini dashboard.

---

## 5. Pivot table vs formulas

| Use a pivot when… | Use a formula when… |
|-------------------|----------------------|
| Exploring / slicing many ways | You need one specific number in a cell |
| Grouping and subtotalling | The result must live inside another calculation |
| The layout should be drag-to-change | The logic must update live with the sheet |

> **Mini case study — category performance.** With one pivot (category in Rows, month in Columns, revenue as Values, channel Slicer), Seduh found Roasted Beans grew 22% on Shopee but *fell* on Tokopedia — invisible in the raw log, obvious in the pivot. The fix: shift the promo budget toward Shopee.

---

## Common pitfalls

- **Stale data.** Pivots do not auto-update — **right-click → Refresh** after the source changes.
- **Source range not expanding.** New rows get ignored unless the source is a Table (`Ctrl+T`) or a dynamic range.
- **Grouping fails on text dates.** Dates stored as text will not group — convert with `DATEVALUE` first.
- **Blank cells counted oddly.** Blanks and text in a numeric column force Count instead of Sum.

---

## Glossary

| Term | Meaning |
|------|---------|
| Pivot table | A drag-and-drop summary of raw rows |
| Aggregation | How values combine (sum, count, average…) |
| Calculated field | A new field defined by a formula inside the pivot |
| Slicer | Clickable filter buttons for a pivot |
| Grand total | The overall total row/column |

---

## Key Takeaways

1. A pivot answers *"total X by Y"* instantly via four zones: **Rows, Columns, Values, Filters**.
2. Change the story with **aggregation** (sum/count/avg) and **Show Values As** (% of total, running total).
3. **Group** dates to months/quarters; add **Calculated Fields**; make it interactive with **Slicers/Timelines**.
4. Prefer a pivot for exploring and subtotalling; a formula for a single embedded number.
5. Always **Refresh** after the source changes, and base pivots on a **Table** so new rows are included.

> 💡 Practice with the matching exercises below, then pull insight from the order dataset in the assignment.$md$
WHERE session_number = 'X03';

UPDATE public.sessions SET content_id = $md$## Kenapa pivot table

Pivot table meringkas ribuan baris menjadi insight dalam hitungan detik — tanpa rumus, tanpa error, bisa diatur ulang dengan drag-and-drop. Kalau Anda bisa merumuskan pertanyaan sebagai *"total X per Y"*, pivot menjawabnya lebih cepat dari rumus apa pun.

Kita akan menganalisis log order mentah Seduh.

---

## 1. Anatomi pivot table

Setiap pivot punya empat drop zone:

| Zona | Peran | Contoh Seduh |
|------|-------|------------------|
| **Rows** | Kategori ke bawah | Kategori produk |
| **Columns** | Kategori ke samping | Bulan |
| **Values** | Angka yang diagregasi | Jumlah revenue |
| **Filters** | Menyaring seluruh tabel | Channel = Shopee |

---

## 2. Membuat pivot pertama Anda

Log mentah (satu baris per baris order):

| order_date | category | channel | revenue |
|------|----------|--------|---------|
| 2025-03-01 | Roasted Beans | Shopee | 120 |
| 2025-03-01 | Ready to Drink | Shopee | 80 |
| 2025-03-02 | Roasted Beans | Tokopedia | 60 |
| 2025-03-02 | Roasted Beans | Shopee | 140 |

Langkah: pilih data → **Insert → PivotTable** → tarik `category` ke **Rows**, `revenue` ke **Values**. Hasil:

| Kategori | Sum of revenue |
|----------|----------------|
| Roasted Beans | 320 |
| Ready to Drink | 80 |
| **Grand total** | **400** |

Tarik `channel` ke **Columns** dan Anda dapat matriks kategori × channel — data sama, pertanyaan baru, tanpa rumus.

---

## 3. Agregasi dan "Show Values As"

Klik ganda field nilai → **Value Field Settings** untuk mengubah cara angka digabung:

| Agregasi | Menjawab |
|----------|----------|
| Sum | Total revenue |
| Count | Jumlah order |
| Average | Average order value |
| Max / Min | Penjualan terbesar / terkecil |

**Show Values As** membingkai ulang angka yang sama:

| Opsi | Mengubah revenue jadi |
|------|------------------------|
| % of Grand Total | Porsi tiap kategori dari keseluruhan |
| % of Column Total | Porsi dalam tiap bulan |
| Running Total | Revenue kumulatif seiring waktu |

---

## 4. Jurus tingkat lanjut

- **Grouping**: klik kanan baris tanggal → **Group** → per Bulan/Kuartal untuk menggulung data harian ke bulan.
- **Calculated Field**: **PivotTable Analyze → Fields → Calculated Field**, mis. `profit = revenue - cost`.
- **Slicer & Timeline**: **Insert → Slicer** memberi tombol yang bisa diklik; **Timeline** memberi slider tanggal — keduanya menyaring pivot secara interaktif untuk mini dashboard.

---

## 5. Pivot table vs rumus

| Pakai pivot saat… | Pakai rumus saat… |
|-------------------|--------------------|
| Mengeksplorasi / mengiris banyak cara | Butuh satu angka spesifik di sel |
| Mengelompokkan dan subtotal | Hasil harus masuk ke perhitungan lain |
| Layout ingin diubah drag | Logika harus update live dengan sheet |

> **Studi kasus mini — performa kategori.** Dengan satu pivot (kategori di Rows, bulan di Columns, revenue di Values, Slicer channel), Seduh menemukan Roasted Beans tumbuh 22% di Shopee tapi *turun* di Tokopedia — tak terlihat di log mentah, jelas di pivot. Solusi: geser anggaran promo ke Shopee.

---

## Kesalahan umum

- **Data basi.** Pivot tidak auto-update — **klik kanan → Refresh** setelah sumber berubah.
- **Range sumber tidak melebar.** Baris baru terabaikan kecuali sumbernya Table (`Ctrl+T`) atau range dinamis.
- **Grouping gagal pada tanggal teks.** Tanggal sebagai teks tidak bisa di-group — konversi dengan `DATEVALUE` dulu.
- **Sel kosong terhitung aneh.** Blank dan teks di kolom numerik memaksa Count alih-alih Sum.

---

## Glosarium

| Istilah | Arti |
|---------|------|
| Pivot table | Ringkasan drag-and-drop dari baris mentah |
| Agregasi | Cara nilai digabung (sum, count, average…) |
| Calculated field | Field baru yang didefinisikan rumus di dalam pivot |
| Slicer | Tombol filter yang bisa diklik untuk pivot |
| Grand total | Baris/kolom total keseluruhan |

---

## Kesimpulan Utama

1. Pivot menjawab *"total X per Y"* seketika lewat empat zona: **Rows, Columns, Values, Filters**.
2. Ubah cerita dengan **agregasi** (sum/count/avg) dan **Show Values As** (% of total, running total).
3. **Group** tanggal ke bulan/kuartal; tambah **Calculated Field**; buat interaktif dengan **Slicer/Timeline**.
4. Utamakan pivot untuk eksplorasi dan subtotal; rumus untuk satu angka tertanam.
5. Selalu **Refresh** setelah sumber berubah, dan basiskan pivot pada **Table** agar baris baru ikut.

> 💡 Latih dengan exercise matching di bawah, lalu tarik insight dari dataset order di tugas.$md$
WHERE session_number = 'X03';

-- ── X05 · EDA ────────────────────────────────────────────────

UPDATE public.sessions SET content_en = replace(replace(replace(content_en,
  'We keep exploring TokoSegar''s sales.',
  'We keep exploring Seduh''s orders.'),
  '| **Insight** | "Jakarta over-indexes because premium members cluster there and buy Electronics." |',
  '| **Insight** | "Jakarta over-indexes because repeat buyers cluster there and buy Roasted Beans." |'),
  '| **Recommendation** | "Pilot a premium-Electronics bundle in Jakarta next quarter." |',
  '| **Recommendation** | "Pilot a Roasted-Beans subscription offer in Jakarta next quarter." |')
WHERE session_number = 'X05';

UPDATE public.sessions SET content_id = replace(replace(replace(content_id,
  'Kita lanjut mengeksplorasi penjualan TokoSegar.',
  'Kita lanjut mengeksplorasi order Seduh.'),
  '| **Insight** | "Jakarta over-index karena member premium menumpuk di sana dan beli Electronics." |',
  '| **Insight** | "Jakarta over-index karena repeat buyer menumpuk di sana dan beli Roasted Beans." |'),
  '| **Rekomendasi** | "Uji coba bundle premium-Electronics di Jakarta kuartal depan." |',
  '| **Rekomendasi** | "Uji coba penawaran langganan Roasted Beans di Jakarta kuartal depan." |')
WHERE session_number = 'X05';

-- ── X07 · Power BI ───────────────────────────────────────────
-- Seduh has no total_amount column — revenue is computed with SUMX.

UPDATE public.sessions SET content_en = replace(replace(content_en,
  'Total Revenue = SUM(orders[total_amount])',
  'Total Revenue = SUMX(orders, orders[quantity] * orders[unit_price] * (1 - orders[discount_pct]))'),
  '> **Mini case study.** TokoSegar''s weekly deck used to take 3 hours of copy-paste. Rebuilt as one Power BI report with a scheduled refresh, it now updates itself every Monday morning — the analyst just adds a one-line commentary.',
  '> **Mini case study.** Seduh''s weekly deck used to take 3 hours of copy-paste. Rebuilt as one Power BI report with a scheduled refresh, it now updates itself every Monday morning — the analyst just adds a one-line commentary.')
WHERE session_number = 'X07';

UPDATE public.sessions SET content_id = replace(replace(content_id,
  'Total Revenue = SUM(orders[total_amount])',
  'Total Revenue = SUMX(orders, orders[quantity] * orders[unit_price] * (1 - orders[discount_pct]))'),
  '> **Studi kasus mini.** Deck mingguan TokoSegar dulu butuh 3 jam copy-paste. Dibangun ulang sebagai satu laporan Power BI dengan scheduled refresh, kini ia memperbarui diri setiap Senin pagi — analyst tinggal menambah komentar satu baris.',
  '> **Studi kasus mini.** Deck mingguan Seduh dulu butuh 3 jam copy-paste. Dibangun ulang sebagai satu laporan Power BI dengan scheduled refresh, kini ia memperbarui diri setiap Senin pagi — analyst tinggal menambah komentar satu baris.')
WHERE session_number = 'X07';

-- ── X10 · RFM / segmentation ─────────────────────────────────
-- Seduh has 4,200 customers; the At-Risk segment is ~8% of them.

UPDATE public.sessions SET content_en = replace(content_en,
  '> **Mini case study.** TokoSegar scored 15,000 customers. The 8% "At Risk" segment held 24% of last year''s revenue. A targeted win-back email to just that group recovered more than a blanket discount to everyone — at a fraction of the cost.',
  '> **Mini case study.** Seduh scored its 4,200 customers. The "At-Risk" segment was only about 8% of them but held a disproportionate share of last year''s revenue. A targeted win-back email to just that group recovered more than a blanket discount to everyone — at a fraction of the cost.')
WHERE session_number = 'X10';

UPDATE public.sessions SET content_id = replace(content_id,
  '> **Studi kasus mini.** TokoSegar menskor 15.000 pelanggan. Segmen "At Risk" yang 8% memegang 24% revenue tahun lalu. Email win-back tertarget hanya ke grup itu memulihkan lebih banyak dibanding diskon merata ke semua — dengan biaya jauh lebih kecil.',
  '> **Studi kasus mini.** Seduh menskor 4.200 pelanggannya. Segmen "At-Risk" hanya sekitar 8% dari mereka tapi memegang porsi revenue tahun lalu yang tidak proporsional. Email win-back tertarget hanya ke grup itu memulihkan lebih banyak dibanding diskon merata ke semua — dengan biaya jauh lebih kecil.')
WHERE session_number = 'X10';

-- ── X11 · Storytelling ───────────────────────────────────────
-- Conclusion reframed onto the real Q7 finding (margin 51%→35%, volume flat).

UPDATE public.sessions SET content_en = replace(replace(content_en,
  'Conclusion → "Cut discounts on Electronics; it will lift margin 4pts"',
  'Conclusion → "Cap discounts on Roasted Beans; margin climbs without losing volume"'),
  'Key reasons → returns rise with discount; Electronics has thin margin',
  'Key reasons → margin falls from 51% to 35% as discounts deepen, while quantity barely moves')
WHERE session_number = 'X11';

UPDATE public.sessions SET content_id = replace(replace(content_id,
  'Kesimpulan → "Kurangi diskon Electronics; margin naik 4 poin"',
  'Kesimpulan → "Batasi diskon Roasted Beans; margin naik tanpa kehilangan volume"'),
  'Alasan utama → retur naik seiring diskon; margin Electronics tipis',
  'Alasan utama → margin turun dari 51% ke 35% saat diskon makin dalam, sementara quantity nyaris tak bergerak')
WHERE session_number = 'X11';
