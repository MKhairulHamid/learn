-- Migration 007: Expand session content for sessions 07 and 08
-- Rich educational content for complete beginners

UPDATE sessions SET
  content_en = $en07$
# Session 7: Data Visualization Principles & Looker Studio

## Why Visualization Matters

Imagine you receive a spreadsheet with 10,000 rows of sales data. Your manager asks: "Is our business growing?" You scroll. You squint. You try to mentally calculate averages. After 20 minutes, you still aren't sure.

Now imagine a single line chart that shows monthly revenue climbing steadily from left to right with one dip in February. Within three seconds, you know the answer: yes, the business is growing, and something happened in February worth investigating.

**That is the power of data visualization.** It transforms numbers that require active analysis into images that your brain processes almost automatically.

This is not just intuition — it is neuroscience.

---

## Pre-Attentive Attributes: What Your Brain Processes Instantly

Researchers in visual perception discovered that certain visual properties are processed by the brain **before conscious attention kicks in** — in roughly 200–250 milliseconds. These are called **pre-attentive attributes**.

Think of it this way: if someone in a crowd is wearing a red jacket and everyone else wears grey, you spot them instantly without scanning face by face. That is pre-attentive processing at work.

The main pre-attentive attributes useful to data analysts:

| Attribute | Example Use | Strength |
|-----------|-------------|----------|
| **Color hue** | Highlight a specific category | Very strong |
| **Color intensity** | Show magnitude (light = low, dark = high) | Strong |
| **Position** | Bar lengths, dot positions on a scatter plot | Very strong |
| **Size** | Bubble size in a bubble chart | Moderate |
| **Shape** | Different markers on a line chart | Moderate |
| **Orientation** | Angle of a line or arrow | Weak |

### Practical rule
Use **one** pre-attentive attribute to guide the viewer's eye to the most important insight. Using three simultaneously creates visual noise and confusion.

---

## Choosing the Right Chart Type: A Detailed Guide

Picking the wrong chart is one of the most common analyst mistakes. Here is a systematic guide.

### Bar Chart — Comparing Categories

A bar chart compares values across discrete categories. Think of each bar as a container holding an amount.

**Use a bar chart when:**
- You are comparing items that do not have a natural order (product names, country names, department names)
- You want to show rankings
- You have up to ~15 categories (beyond that, a table is often clearer)

**Horizontal vs vertical bars:**
- Vertical bars (column chart): best for time periods (Jan, Feb, Mar) because time flows left to right
- Horizontal bars: best for long category names (country names, product descriptions) because labels are readable

**Do's:**
- Always start your y-axis at zero. A bar's height conveys magnitude — truncating the axis makes small differences look enormous.
- Sort bars by value (descending) unless the categories have a natural order.
- Use a single color unless you are highlighting something specific.

**Don'ts:**
- Don't use 3D bars — the depth adds nothing and distorts perception.
- Don't use more than two colors unless each color carries meaning.
- Don't add gridlines so heavy they compete with the bars.

```
Good bar chart:        Bad bar chart:
Revenue by Region      Revenue by Region (truncated axis)

400 |███             400 |
300 |██              395 |███
200 |█               390 |██
  0 +------            385 |█
    N  S  E               N  S  E

The left chart shows North is 2x South.
The right chart makes them look nearly equal!
```

---

### Line Chart — Trends Over Time

A line chart connects data points with a line, implying continuity between points. This is its strength — and its limitation.

**Use a line chart when:**
- The x-axis represents time (days, months, quarters, years)
- You want to show a trend or rate of change
- You have multiple series to compare over the same time period

**When NOT to use a line chart:**
- When the x-axis is categories with no natural order (don't connect "Asia" to "Europe" with a line — a line implies that something exists between them)
- When you have fewer than 3 data points (use a simple text callout instead)
- When the values are not continuous (discrete events don't belong on a line chart)

**Pro tip:** If your line chart has more than 5-6 lines, it becomes a "spaghetti chart" — impossible to read. Consider showing only the top 3 and grouping the rest as "Other."

---

### Pie and Donut Charts — Parts of a Whole

A pie chart shows how individual parts contribute to a total. The whole pie = 100%.

**Honest assessment: most professional analysts avoid pie charts.** Here is why:

Humans are much better at comparing lengths (bars) than angles (pie slices). Ask someone to tell you whether the blue slice is 28% or 32% — they cannot. On a bar chart, that difference is obvious.

**When a pie chart is acceptable:**
- You have 2–3 slices only
- The proportions are dramatically different (one slice is clearly dominant)
- Your audience is non-technical and the "part of whole" concept is the key message

**Donut charts** are slightly better because the center can hold a total or label, but the same limitations apply.

**Better alternative in most cases:** A stacked bar chart or a simple bar chart showing percentages.

---

### Scatter Plot — Correlation Between Two Variables

A scatter plot places dots on a two-axis grid where each dot represents one data point (e.g., one customer, one store, one month).

**Use when:**
- You want to explore the relationship between two numerical variables
- Example: Does advertising spend correlate with sales? Plot ad spend on x-axis and sales on y-axis. If dots trend upward left-to-right, there is a positive correlation.

**Key vocabulary:**
- **Positive correlation:** as x increases, y tends to increase
- **Negative correlation:** as x increases, y tends to decrease
- **No correlation:** dots scattered randomly

**Important warning:** Correlation is not causation. If ice cream sales and drowning deaths both spike in summer, they are correlated — but ice cream does not cause drowning. (Both are caused by hot weather and people going swimming.)

---

### Histogram — Distribution of a Single Variable

A histogram looks like a bar chart but is fundamentally different. Instead of showing category values, it shows how data is **distributed** across numerical ranges called "bins."

**Example:** You have 500 customer order values ranging from $5 to $500. A histogram might show:
- $0–50: 200 orders
- $50–100: 150 orders
- $100–200: 80 orders
- $200+: 70 orders

This tells you most orders are small, with a long tail of high-value orders. This is called a **right-skewed distribution**.

**Use when:**
- You want to understand the shape of your data
- You want to check if data is normally distributed (bell curve)
- You want to find outliers or unusual clusters

---

### Heat Map — Patterns in a Matrix

A heat map uses color intensity to show values in a grid. Think of it as a table where instead of reading numbers, you read colors.

**Classic examples:**
- Website traffic by day of week vs. hour of day (when are users most active?)
- Sales by product category and region
- Correlation matrix (showing correlations between many variables simultaneously)

**Tip:** Always include a color legend. Never make the reader guess what dark blue vs. light blue means.

---

### Waterfall Chart — Cumulative Changes

A waterfall chart shows how you get from a starting value to an ending value through a series of additions and subtractions.

**Perfect for:**
- Financial P&L: Revenue → minus COGS → minus OpEx → equals Net Income
- Explaining why this month's sales differ from last month's

Each bar "floats" at different heights to show the cumulative effect of each component.

---

## The Lie Factor: How Charts Mislead

The statistician Edward Tufte defined the **Lie Factor** as:

```
Lie Factor = (Size of effect shown in graphic) / (Size of effect in data)
```

A Lie Factor of 1.0 = perfectly honest chart.
A Lie Factor of 3.0 = the chart makes a change look 3x larger than it really is.

### Common misleading techniques:

**1. Truncated y-axis**
Starting the y-axis at 92 instead of 0 can make a 3% increase look like a 300% increase. Bar charts must start at zero. Line charts can start elsewhere, but only if clearly labeled.

**2. 3D effects**
3D pie charts tilt the front slices toward the viewer, making them appear larger than their actual percentage. This is pure visual distortion.

**3. Cherry-picked time ranges**
A company might show a chart that starts at the moment a stock was at its lowest to make subsequent performance look spectacular. Always ask: why did they start the chart here?

**4. Dual axes with different scales**
Having two y-axes with different scales can make two completely unrelated trends appear to move together. Treat dual-axis charts with suspicion.

---

## Color Theory for Data Analysts

Color is your most powerful visual tool. Use it strategically, not decoratively.

### Three types of color palettes:

**Sequential palette** — for ordered data from low to high
- Example: light blue → medium blue → dark blue
- Use for: population density, sales volume, temperature
- Rule: lighter = less, darker = more

**Diverging palette** — for data with a meaningful midpoint
- Example: red → white → blue (negative → neutral → positive)
- Use for: profit/loss, above/below average, approval ratings
- Rule: the midpoint (neutral color) should be visually distinct

**Categorical palette** — for unordered categories
- Example: blue, orange, green, red (each a distinct hue)
- Use for: product lines, regions, customer segments
- Rule: colors should be equally distinct from each other

### Colorblind-safe colors

About 8% of men and 0.5% of women have some form of color blindness. The most common type confuses red and green.

**Always test your charts with colorblind simulation tools.** Safe combinations:
- Blue and orange (instead of red and green)
- Blue and yellow
- Avoid red/green combinations for encoding important data

**Free tool:** Coblis (Color Blindness Simulator) — paste your chart image to see how it looks to colorblind viewers.

---

## Dashboard Design Principles

A dashboard is a collection of visualizations arranged to tell a coherent story. Good dashboard design is a discipline in itself.

### Visual hierarchy
Guide the viewer's eye. The most important metric should be the largest, most prominent element — usually top-left (because most cultures read left to right, top to bottom). Support metrics should be smaller.

### Alignment and grid
Use an invisible grid. Align elements to consistent columns and rows. Misaligned charts feel messy and untrustworthy. Most dashboard tools have snap-to-grid features — use them.

### Whitespace
Empty space is not wasted space. Crowding eight charts into a single screen makes all of them harder to read. Give each element room to breathe. A focused dashboard with 4 great charts outperforms a cluttered one with 12 mediocre charts.

### Consistency
- Use the same font family throughout
- Use the same color palette for the same categories across all charts
- Use the same date format everywhere (don't mix "Jan 2024" with "2024-01")

### The "5-second rule"
A stakeholder should be able to glance at your dashboard for 5 seconds and answer: "Is the business doing well or not?" If that requires careful study, the design needs work.

---

## Looker Studio Walkthrough

Looker Studio (formerly Google Data Studio) is Google's free dashboard tool. It connects to dozens of data sources and runs entirely in your browser.

### Step 1: Connect Google Sheets as a data source

1. Go to **lookerstudio.google.com** and sign in with your Google account
2. Click **Create → Report**
3. In the "Add data to report" panel, choose **Google Sheets**
4. Select your spreadsheet and the specific sheet/tab
5. Click **Add** and then **Add to report**

Looker Studio reads your column headers as field names and automatically detects data types (number, text, date).

### Step 2: Add charts, scorecards, and tables

**Scorecard** — shows a single large number (perfect for KPIs like Total Revenue, Total Orders, Average Order Value)
- Click **Insert → Scorecard**
- Drag onto the canvas
- In the right panel, set the "Metric" to the field you want (e.g., Revenue)

**Bar chart**
- Click **Insert → Bar chart**
- Set "Dimension" to your category field (e.g., Product Category)
- Set "Metric" to your measure (e.g., Revenue)
- Looker Studio aggregates automatically (SUM by default)

**Time series chart** (line chart for dates)
- Click **Insert → Time series**
- Set "Dimension" to your date field
- Looker Studio automatically groups by month, week, or day depending on zoom level

**Table**
- Click **Insert → Table**
- Add dimensions (rows) and metrics (columns)
- Click column headers to sort

### Step 3: Filters and date range controls

**Date range control:** Lets the viewer pick any date range.
- Click **Insert → Date range control**
- Place it at the top of the dashboard
- All charts that use the same data source will update automatically

**Filter control:** A dropdown that filters by a dimension.
- Click **Insert → Drop-down list**
- Set the "Control field" to the dimension you want to filter by (e.g., Region)
- Viewers can then select "North", "South", etc. and all charts update

**Page-level vs. report-level filters:**
- Right-click a filter control → "Make filter available to all pages" for a report-level filter

### Step 4: Sharing and scheduling reports

**Share with specific people:**
- Click **Share** (top right) → Enter email addresses
- Choose "Viewer" (can see only) or "Editor" (can modify)

**Share via link:**
- Click **Share → Manage access → Anyone with the link can view**
- Copy the link and send it — no Google account required to view

**Schedule email delivery:**
- Click the three-dot menu → **Schedule email delivery**
- Set frequency (daily, weekly, monthly), time, and recipients
- Recipients receive a PDF snapshot of the report by email

---

## Common Visualization Mistakes and How to Fix Them

| Mistake | Why It's a Problem | Fix |
|---------|-------------------|-----|
| Pie chart with 8 slices | Impossible to compare thin slices | Use a bar chart instead |
| Y-axis doesn't start at zero | Exaggerates differences | Fix the axis range |
| Too many colors | Visual chaos | Limit to 3-4 colors max |
| No chart title | Reader doesn't know what they're looking at | Add a descriptive title |
| Title says "Revenue by Month" | States what, not so what | "Revenue Grew 23% YoY Despite Feb Dip" |
| Clutter: gridlines, borders, legends in wrong place | Distracts from data | Remove chart junk (Tufte's term) |
| Using a line chart for categories | Implies false continuity | Switch to a bar chart |
| Inconsistent date formats | Confuses the reader | Standardize to one format |

---

## Key Takeaways

1. The right chart type depends on your **data type** and your **question** — not personal preference.
2. Your brain processes pre-attentive attributes before you consciously look at a chart — use this to guide attention.
3. Color is a communication tool, not decoration. Use categorical, sequential, or diverging palettes appropriately.
4. Dashboards tell stories. Apply design principles: hierarchy, alignment, whitespace, consistency.
5. Charts can lie — learn to recognize and avoid misleading techniques.
6. Looker Studio is free and powerful for building interactive dashboards connected to Google Sheets.

$en07$,
  content_id = $id07$
# Sesi 7: Prinsip Visualisasi Data & Looker Studio

## Mengapa Visualisasi Itu Penting

Bayangkan kamu menerima spreadsheet berisi 10.000 baris data penjualan. Manajermu bertanya: "Apakah bisnis kita berkembang?" Kamu scroll ke bawah. Kamu mencoba menghitung rata-rata dalam kepala. Setelah 20 menit, kamu masih belum yakin.

Sekarang bayangkan sebuah grafik garis yang menunjukkan pendapatan bulanan naik perlahan dari kiri ke kanan, dengan satu penurunan di bulan Februari. Dalam tiga detik, kamu sudah tahu jawabannya: ya, bisnis berkembang, dan ada sesuatu yang terjadi di Februari yang perlu diselidiki.

**Itulah kekuatan visualisasi data.** Ia mengubah angka-angka yang butuh analisis aktif menjadi gambar yang otak kita proses hampir secara otomatis.

---

## Atribut Pre-Attentive: Yang Langsung Ditangkap Otak

Para peneliti menemukan bahwa ada sifat visual tertentu yang diproses otak **sebelum kita sadar melihatnya** — sekitar 200–250 milidetik. Ini disebut **atribut pre-attentive**.

Analoginya begini: kalau ada satu orang pakai jaket merah di tengah kerumunan yang semuanya pakai abu-abu, kamu langsung menemukannya tanpa perlu memindai satu per satu. Itulah cara kerja otak kita.

Atribut pre-attentive yang paling berguna buat analis data:

| Atribut | Contoh Penggunaan | Kekuatan |
|---------|-------------------|----------|
| **Warna (hue)** | Menonjolkan satu kategori tertentu | Sangat kuat |
| **Intensitas warna** | Menunjukkan besaran (terang = rendah, gelap = tinggi) | Kuat |
| **Posisi** | Panjang batang, posisi titik di scatter plot | Sangat kuat |
| **Ukuran** | Ukuran gelembung di bubble chart | Sedang |
| **Bentuk** | Marker berbeda di grafik garis | Sedang |

### Aturan praktis
Gunakan **satu** atribut pre-attentive untuk mengarahkan mata pembaca ke insight paling penting. Menggunakan tiga sekaligus menciptakan kekacauan visual.

---

## Memilih Tipe Chart yang Tepat: Panduan Lengkap

### Bar Chart — Membandingkan Kategori

Bar chart membandingkan nilai antar kategori diskrit. Bayangkan setiap batang sebagai wadah yang menampung suatu jumlah.

**Gunakan bar chart ketika:**
- Membandingkan item yang tidak punya urutan alami (nama produk, nama negara, nama departemen)
- Ingin menampilkan peringkat
- Memiliki maksimal ~15 kategori

**Bar vertikal vs horizontal:**
- Bar vertikal: terbaik untuk periode waktu (Jan, Feb, Mar) karena waktu mengalir dari kiri ke kanan
- Bar horizontal: terbaik untuk nama kategori yang panjang karena label lebih mudah dibaca

**Harus dilakukan:**
- Selalu mulai sumbu-y dari nol. Tinggi batang menyampaikan besaran — memotong sumbu membuat perbedaan kecil terlihat sangat besar.
- Urutkan batang dari nilai terbesar ke terkecil, kecuali kategori punya urutan alami.

**Jangan dilakukan:**
- Jangan gunakan bar 3D — efek kedalaman tidak menambah informasi dan mendistorsi persepsi.
- Jangan gunakan lebih dari dua warna kecuali setiap warna membawa makna.

---

### Line Chart — Tren Sepanjang Waktu

Line chart menghubungkan titik-titik data dengan sebuah garis, yang mengimplikasikan kesinambungan. Inilah kekuatan sekaligus keterbatasannya.

**Gunakan line chart ketika:**
- Sumbu-x mewakili waktu (hari, bulan, kuartal, tahun)
- Ingin menunjukkan tren atau laju perubahan
- Memiliki beberapa seri yang dibandingkan dalam periode waktu yang sama

**Kapan TIDAK menggunakan line chart:**
- Ketika sumbu-x adalah kategori tanpa urutan alami (jangan hubungkan "Asia" dan "Eropa" dengan garis — garis mengimplikasikan ada sesuatu di antaranya)
- Ketika kamu punya kurang dari 3 titik data

**Tips profesional:** Kalau grafik garismu punya lebih dari 5–6 garis, ia menjadi "spaghetti chart" — tidak bisa dibaca. Tampilkan hanya 3 teratas dan kelompokkan sisanya sebagai "Lainnya."

---

### Pie/Donut Chart — Bagian dari Keseluruhan

Pie chart menunjukkan kontribusi masing-masing bagian terhadap total. Seluruh pie = 100%.

**Penilaian jujur: kebanyakan analis profesional menghindari pie chart.** Alasannya:

Manusia jauh lebih baik membandingkan panjang (batang) daripada sudut (irisan pie). Coba tebak apakah irisan biru 28% atau 32% — hampir tidak mungkin. Di bar chart, perbedaan itu terlihat jelas.

**Kapan pie chart masih bisa diterima:**
- Hanya ada 2–3 irisan
- Proporsinya sangat berbeda (satu irisan jelas mendominasi)
- Audiens non-teknis dan konsep "bagian dari keseluruhan" adalah pesan utama

**Alternatif yang lebih baik:** Stacked bar chart atau bar chart biasa yang menampilkan persentase.

---

### Scatter Plot — Korelasi Antara Dua Variabel

Scatter plot menempatkan titik-titik pada grid dua sumbu, di mana setiap titik mewakili satu data point (misalnya, satu pelanggan, satu toko, satu bulan).

**Gunakan ketika:**
- Ingin mengeksplorasi hubungan antara dua variabel numerik
- Contoh: Apakah pengeluaran iklan berkorelasi dengan penjualan? Plot belanja iklan di sumbu-x dan penjualan di sumbu-y. Kalau titik-titik cenderung naik dari kiri ke kanan, ada korelasi positif.

**Peringatan penting:** Korelasi bukan kausalitas. Kalau penjualan es krim dan angka tenggelam sama-sama meningkat di musim panas, keduanya berkorelasi — tapi es krim tidak menyebabkan tenggelam. (Keduanya disebabkan oleh cuaca panas.)

---

### Histogram — Distribusi Satu Variabel

Histogram terlihat seperti bar chart tapi secara fundamental berbeda. Alih-alih menampilkan nilai kategori, ia menunjukkan bagaimana data **terdistribusi** di rentang numerik yang disebut "bin."

**Contoh:** Kamu punya 500 nilai pesanan pelanggan dari Rp50.000 hingga Rp5.000.000. Histogram mungkin menunjukkan:
- Rp0–500rb: 200 pesanan
- Rp500rb–1jt: 150 pesanan
- Rp1jt–2jt: 80 pesanan
- Rp2jt+: 70 pesanan

Ini memberitahumu bahwa sebagian besar pesanan bernilai kecil, dengan ekor panjang pesanan bernilai tinggi.

---

### Heat Map — Pola dalam Matriks

Heat map menggunakan intensitas warna untuk menampilkan nilai dalam sebuah grid. Bayangkan sebagai tabel di mana kamu membaca warna, bukan angka.

**Contoh klasik:**
- Traffic website berdasarkan hari dalam seminggu vs jam dalam sehari (kapan pengguna paling aktif?)
- Penjualan berdasarkan kategori produk dan wilayah

**Tips:** Selalu sertakan legenda warna. Jangan biarkan pembaca menebak artinya.

---

### Waterfall Chart — Perubahan Kumulatif

Waterfall chart menunjukkan bagaimana kamu mencapai nilai akhir dari nilai awal melalui serangkaian penambahan dan pengurangan.

**Sempurna untuk:**
- P&L keuangan: Pendapatan → dikurangi HPP → dikurangi OpEx → sama dengan Laba Bersih
- Menjelaskan mengapa penjualan bulan ini berbeda dari bulan lalu

---

## Faktor Kebohongan: Bagaimana Chart Bisa Menyesatkan

Statistikawan Edward Tufte mendefinisikan **Lie Factor** (Faktor Kebohongan) sebagai:

```
Lie Factor = (Besarnya efek yang ditampilkan grafik) / (Besarnya efek dalam data sesungguhnya)
```

Lie Factor = 1,0 berarti chart jujur sepenuhnya.
Lie Factor = 3,0 berarti chart membuat perubahan terlihat 3x lebih besar dari kenyataannya.

### Teknik menyesatkan yang umum:

**1. Sumbu-y yang terpotong**
Memulai sumbu-y dari 92 alih-alih 0 bisa membuat kenaikan 3% terlihat seperti kenaikan 300%. Bar chart harus dimulai dari nol.

**2. Efek 3D**
Pie chart 3D memiringkan irisan depan ke arah penonton, membuatnya terlihat lebih besar dari persentase sebenarnya.

**3. Rentang waktu yang dipilih-pilih**
Sebuah perusahaan mungkin menampilkan chart yang dimulai saat saham berada di titik terendah agar kinerja berikutnya terlihat luar biasa.

**4. Dua sumbu dengan skala berbeda**
Dua sumbu-y dengan skala berbeda dapat membuat dua tren yang sama sekali tidak berkaitan terlihat bergerak bersamaan.

---

## Teori Warna untuk Analis Data

### Tiga jenis palet warna:

**Palet sekuensial** — untuk data berurutan dari rendah ke tinggi
- Contoh: biru muda → biru sedang → biru gelap
- Aturan: lebih terang = lebih sedikit, lebih gelap = lebih banyak

**Palet divergen** — untuk data dengan titik tengah yang bermakna
- Contoh: merah → putih → biru (negatif → netral → positif)
- Gunakan untuk: laba/rugi, di atas/di bawah rata-rata

**Palet kategoris** — untuk kategori yang tidak berurutan
- Contoh: biru, oranye, hijau, merah (masing-masing hue berbeda)
- Aturan: warna harus sama-sama berbeda satu sama lain

### Warna yang aman untuk buta warna

Sekitar 8% pria mengalami buta warna. Kombinasi yang aman:
- Biru dan oranye (menggantikan merah dan hijau)
- Biru dan kuning
- Hindari kombinasi merah/hijau untuk data penting

---

## Prinsip Desain Dashboard

### Hierarki visual
Metrik terpenting harus menjadi elemen terbesar dan paling menonjol — biasanya di kiri atas.

### Alignment dan grid
Gunakan grid yang tidak terlihat. Sejajarkan elemen ke kolom dan baris yang konsisten. Elemen yang tidak sejajar terasa berantakan dan tidak terpercaya.

### Whitespace
Ruang kosong bukan ruang yang terbuang. Dashboard yang fokus dengan 4 chart yang bagus lebih baik dari yang penuh dengan 12 chart biasa-biasa saja.

### Konsistensi
- Gunakan keluarga font yang sama di seluruh dashboard
- Gunakan palet warna yang sama untuk kategori yang sama di semua chart
- Gunakan format tanggal yang sama di mana pun

### Aturan "5 detik"
Seorang stakeholder harus bisa menatap dashboardmu selama 5 detik dan menjawab: "Apakah bisnis berjalan baik?" Jika butuh studi teliti, desainnya perlu diperbaiki.

---

## Panduan Looker Studio

Looker Studio (dulu Google Data Studio) adalah alat dashboard gratis dari Google.

### Langkah 1: Hubungkan Google Sheets sebagai sumber data

1. Buka **lookerstudio.google.com** dan masuk dengan akun Google
2. Klik **Create → Report**
3. Di panel "Add data to report", pilih **Google Sheets**
4. Pilih spreadsheet dan sheet/tab yang diinginkan
5. Klik **Add** lalu **Add to report**

### Langkah 2: Tambahkan chart, scorecard, dan tabel

**Scorecard** — menampilkan satu angka besar (sempurna untuk KPI seperti Total Pendapatan)
- Klik **Insert → Scorecard**
- Di panel kanan, atur "Metric" ke field yang diinginkan

**Bar chart**
- Klik **Insert → Bar chart**
- Atur "Dimension" ke field kategori
- Atur "Metric" ke field ukuran

**Time series chart** (grafik garis untuk tanggal)
- Klik **Insert → Time series**
- Atur "Dimension" ke field tanggal

### Langkah 3: Filter dan kontrol rentang tanggal

**Kontrol rentang tanggal:** Membiarkan penonton memilih rentang tanggal apa pun.
- Klik **Insert → Date range control**
- Tempatkan di bagian atas dashboard
- Semua chart yang menggunakan sumber data yang sama akan diperbarui otomatis

**Filter dropdown:**
- Klik **Insert → Drop-down list**
- Atur "Control field" ke dimensi yang ingin difilter (misalnya, Wilayah)

### Langkah 4: Berbagi dan menjadwalkan laporan

**Bagikan dengan orang tertentu:**
- Klik **Share** → Masukkan alamat email
- Pilih "Viewer" atau "Editor"

**Jadwalkan pengiriman email:**
- Klik menu tiga titik → **Schedule email delivery**
- Atur frekuensi, waktu, dan penerima
- Penerima mendapat snapshot PDF laporan via email

---

## Kesalahan Visualisasi Umum dan Cara Memperbaikinya

| Kesalahan | Mengapa Bermasalah | Perbaikan |
|-----------|-------------------|-----------|
| Pie chart dengan 8 irisan | Tidak bisa membandingkan irisan tipis | Ganti dengan bar chart |
| Sumbu-y tidak mulai dari nol | Membesar-besarkan perbedaan | Perbaiki rentang sumbu |
| Terlalu banyak warna | Kekacauan visual | Batasi 3-4 warna maksimal |
| Tidak ada judul chart | Pembaca tidak tahu artinya | Tambahkan judul deskriptif |
| Judul hanya deskriptif | Tidak menyampaikan insight | Ubah ke kalimat insight |
| Gridline terlalu tebal | Mengalihkan perhatian dari data | Kurangi atau hapus gridline |

---

## Poin-Poin Kunci

1. Tipe chart yang tepat bergantung pada **jenis data** dan **pertanyaan** kamu — bukan preferensi pribadi.
2. Otak memproses atribut pre-attentive sebelum kamu sadar melihatnya — manfaatkan ini untuk mengarahkan perhatian.
3. Warna adalah alat komunikasi, bukan dekorasi. Gunakan palet kategoris, sekuensial, atau divergen dengan tepat.
4. Dashboard menceritakan kisah. Terapkan prinsip desain: hierarki, alignment, whitespace, konsistensi.
5. Chart bisa berbohong — pelajari cara mengenali dan menghindari teknik yang menyesatkan.
6. Looker Studio gratis dan powerful untuk membangun dashboard interaktif yang terhubung ke Google Sheets.

$id07$
WHERE session_number = '07';

UPDATE sessions SET
  content_en = $en08$
# Session 8: Power BI — Data Model, DAX & Professional Dashboards

## What Is Power BI?

Power BI is Microsoft's business intelligence platform. It lets you connect to data sources, clean and transform data, build data models, create visualizations, and publish interactive dashboards — all within one ecosystem.

**How it compares to tools you may know:**

| Feature | Excel | Looker Studio | Power BI |
|---------|-------|---------------|----------|
| Data volume | ~1M rows max | Google data sources | Tens of millions of rows |
| Data modeling | Basic (VLOOKUP/pivot) | None | Full star schema |
| Custom calculations | Formulas | Limited | DAX (very powerful) |
| Sharing | Files via email | Google link | Power BI Service |
| Cost | Included in Office | Free | Free (Desktop) + paid (Service) |
| Learning curve | Low | Low | Medium-High |

Power BI shines when you need to handle **large datasets**, build **complex calculations**, or create **automated, refreshed reports** shared across an organization.

---

## Power BI's Three Components

### Power BI Desktop
A free Windows application you download and install. This is where all the actual work happens: connecting data, transforming it, building models, and designing reports. Think of it as your workshop.

### Power BI Service
The web-based platform at **app.powerbi.com**. Once you publish a report from Desktop, it lives here. Team members can view it in a browser, set up automatic data refreshes, and collaborate. Some features (like row-level security administration) are only available here.

### Power BI Mobile
Apps for iOS and Android. Optimized for viewing reports on phones and tablets. Useful for managers who want to check KPIs on the go.

**The typical workflow: Desktop → Service → Mobile**

---

## The Power BI Workflow

Think of building a Power BI report in five distinct phases:

```
1. GET DATA        → Connect to your source (Excel, SQL, web, etc.)
       ↓
2. TRANSFORM       → Clean and reshape the data in Power Query
       ↓
3. MODEL           → Define relationships between tables, build a star schema
       ↓
4. VISUALIZE       → Design charts, tables, scorecards on report pages
       ↓
5. PUBLISH         → Send to Power BI Service for sharing and scheduling
```

Each phase has its own tool within Power BI Desktop. Let's explore each one.

---

## Phase 2: Power Query — Transform Your Data

Power Query is Power BI's built-in data transformation engine. It uses a language called **M** behind the scenes, but you almost never write M directly — you use the graphical interface and Power Query generates the M code for you.

**Why Power Query matters:** Raw data is almost never analysis-ready. It has wrong column names, merged columns that should be split, text values that should be numbers, missing values, and inconsistent formats. Power Query fixes all of this **before** the data enters your data model.

**Important principle:** Every transformation in Power Query is a **step** recorded in a list. You can see, reorder, or delete any step. If you add new data to the source, clicking "Refresh" replays all the steps on the new data automatically. This is automation built in from day one.

### Common Power Query transformations:

**Remove columns**
Right-click a column header → Remove. Only keep what you actually need. Fewer columns = smaller file = faster performance.

**Rename columns**
Double-click a column header → Type the new name. Use clear, consistent names: "OrderDate" instead of "order_date_field_v2".

**Filter rows**
Click the dropdown arrow on a column header → Filter. Works like Excel's AutoFilter. Common use: remove rows where status = "Cancelled" or remove test records.

**Change data types**
Click the icon to the left of the column header (it shows a small symbol indicating the current type). Change to: Whole Number, Decimal Number, Text, Date, Date/Time, True/False.

**This is critical.** If a "Date" column is stored as text, you cannot group by month or use time intelligence functions. Always set the correct data type.

**Merge Queries (equivalent of SQL JOIN)**
When you have two tables that share a common key (e.g., Orders table with CustomerID, and Customers table with CustomerID), Merge Queries combines them into one.

- Home → Merge Queries
- Select the column that matches in each table (the "join key")
- Choose join type: Left Outer (keep all rows from left table), Inner (only matching rows), etc.

```
Orders table:        Customers table:     After Merge:
OrderID | CustID     CustID | CustName     OrderID | CustID | CustName
1001    | C001       C001   | Alice         1001    | C001   | Alice
1002    | C002       C002   | Bob           1002    | C002   | Bob
```

**Append Queries (equivalent of SQL UNION)**
When you have two tables with the same columns but different rows (e.g., Sales_2023 and Sales_2024), Append stacks them on top of each other into one table.

**Pivot and Unpivot**
Raw data often comes "wide" when you need it "tall" (or vice versa).

*Unpivot example:* You have a table where January, February, March are separate columns. Unpivot turns each month-value pair into its own row — which is the format required for time series charts.

```
Before (wide):              After Unpivot (tall):
Product | Jan | Feb | Mar   Product | Month | Sales
A       | 100 | 120 | 90    A       | Jan   | 100
B       | 80  | 95  | 110   A       | Feb   | 120
                            A       | Mar   | 90
                            B       | Jan   | 80
                            ...
```

---

## Phase 3: Data Modeling — The Star Schema

The **data model** is the set of tables and the relationships between them. A well-designed data model is the foundation of a fast, accurate Power BI report.

### The Star Schema explained

The star schema is the gold standard for analytical data models. It organizes tables into two types:

**Fact table:** Contains the measurable events or transactions.
- Examples: Sales, Orders, Calls, Website sessions
- Columns: mostly numbers (amounts, quantities, counts) and foreign keys
- Can have millions of rows

**Dimension tables:** Describe the context of each fact.
- Examples: Customers, Products, Dates, Stores, Employees
- Columns: descriptive attributes (names, categories, types)
- Usually much smaller than the fact table

The pattern looks like a star: one fact table in the center, dimension tables radiating outward.

```
              [Date Table]
                   |
[Product Table] — [Sales Fact Table] — [Customer Table]
                   |
              [Store Table]
```

**Why is the star schema important?**

1. **Performance:** Power BI's engine (VertiPaq) is optimized for star schemas. Queries run faster.
2. **Clarity:** It is easy to understand which table holds which information.
3. **Accurate filtering:** Filters flow from dimension tables into the fact table cleanly, without unexpected behavior.

### Creating relationships in Power BI

In the **Model view** (the icon that looks like a diagram in the left sidebar):

1. You will see all your tables laid out as boxes
2. Drag a column from one table and drop it onto the matching column in another table
3. A line appears connecting the two tables — this is the relationship

Power BI will show a **1** on the dimension table side and a ***** (asterisk/star) on the fact table side.

### Cardinality: One-to-Many vs Many-to-Many

**One-to-many (1:*):** One customer can have many orders. One product can appear in many order lines. This is the normal, healthy relationship in a star schema.

**Many-to-many (*:*):** Both sides can have multiple matches. Example: a student can be enrolled in many courses, and a course can have many students. Power BI can handle this but it requires care — unexpected results are common. If you see this in your model, check whether a "bridge table" can resolve it into two 1:* relationships.

---

## Phase 4: DAX — Data Analysis Expressions

DAX is Power BI's formula language. If Power Query transforms your raw data before it loads, DAX creates new calculations on the data after it loads.

**The single most important thing to understand about DAX:**

> DAX calculations are not static — they respond to whatever filters are active in the visual or report at that moment.

---

### Measures vs Calculated Columns

This is the concept beginners get wrong most often. Read this carefully.

**Calculated Column:**
- Computed row by row when the data loads
- Stored in the table (increases file size)
- Evaluated in **row context** (it knows the value in each row)
- Example: adding a column that concatenates FirstName and LastName
- Use for: categorization, bucketing, lookups

```dax
Full Name = Customers[FirstName] & " " & Customers[LastName]

Profit Margin % = DIVIDE(Sales[Profit], Sales[Revenue])
```

**Measure:**
- Computed on demand, only when a visual needs it
- Not stored — calculated fresh each time (does NOT increase file size)
- Evaluated in **filter context** (it knows which filters are active)
- Example: Total Sales (which changes depending on which year/region is selected)
- Use for: aggregations (sums, counts, averages, ratios, YoY comparisons)

```dax
Total Revenue = SUM(Sales[Revenue])

Average Order Value = DIVIDE(SUM(Sales[Revenue]), COUNT(Sales[OrderID]))
```

**The key question:** If every row needs its own value → Calculated Column. If you want a summary that changes based on filters → Measure.

---

### Row Context vs Filter Context

This is the hardest concept in DAX. Let's use an analogy.

**Imagine a restaurant.**

- **Row context** is like the kitchen, where a chef prepares one specific dish for one specific customer. The chef knows exactly what ingredients are in front of them for that one plate.

- **Filter context** is like the dining room manager who looks at the big picture: "Tonight, we only served vegetarian dishes (filter: vegetarian = true). How much revenue did we make?" The manager aggregates across many rows, constrained by the active filter.

In a calculated column, DAX operates in row context — it looks at one row at a time.
In a measure, DAX operates in filter context — it aggregates rows that pass through the current filters (like slicers, page filters, visual filters).

**Why does this matter?**

A common mistake: trying to reference another table's column directly in a measure. This fails because measures have no row context. You need aggregation functions (SUM, COUNT, etc.) to work in filter context.

---

### Basic DAX Measures

```dax
-- SUM: adds up a column
Total Revenue = SUM(Sales[Revenue])

-- COUNT: counts rows (including blanks)
Total Orders = COUNT(Sales[OrderID])

-- COUNTROWS: counts rows in a table (more reliable)
Total Orders = COUNTROWS(Sales)

-- AVERAGE
Avg Order Value = AVERAGE(Sales[Revenue])

-- DIVIDE: safe division (avoids divide-by-zero errors)
-- Syntax: DIVIDE(numerator, denominator, [alternate_result])
Profit Margin = DIVIDE(SUM(Sales[Profit]), SUM(Sales[Revenue]), 0)
-- The 0 at the end means "return 0 if denominator is zero"
```

---

### CALCULATE: The Most Important DAX Function

`CALCULATE` does one thing: it evaluates an expression in a **modified filter context**.

Think of `CALCULATE` as a way to temporarily change the rules of the room before running your calculation.

**Syntax:**
```dax
CALCULATE(<expression>, <filter1>, <filter2>, ...)
```

**Example 1: Filter to a specific value**
```dax
Revenue North = CALCULATE(SUM(Sales[Revenue]), Sales[Region] = "North")
```
Even if a user is looking at all regions, this measure always returns only North region revenue.

**Example 2: Remove all filters (ALL function)**
```dax
Total Revenue All Regions = CALCULATE(SUM(Sales[Revenue]), ALL(Sales[Region]))
```
Useful for calculating "% of Total" — divide the current filtered revenue by the unfiltered total.

**Example 3: Combining with FILTER**
```dax
High Value Orders Revenue = CALCULATE(
    SUM(Sales[Revenue]),
    FILTER(Sales, Sales[Revenue] > 500)
)
```

---

### Time Intelligence Functions

Time intelligence functions work only if you have a proper **Date table** in your model — a table with one row per day, every day, with no gaps, across your entire data range. Power BI can create one automatically.

```dax
-- Year-over-Year Revenue
Revenue LY = CALCULATE(
    SUM(Sales[Revenue]),
    SAMEPERIODLASTYEAR(DateTable[Date])
)

-- YoY Growth %
YoY Growth % = DIVIDE(
    SUM(Sales[Revenue]) - [Revenue LY],
    [Revenue LY],
    0
)

-- Revenue same period shifted by 1 month
Revenue Prior Month = CALCULATE(
    SUM(Sales[Revenue]),
    DATEADD(DateTable[Date], -1, MONTH)
)

-- Year-to-date revenue
Revenue YTD = CALCULATE(
    SUM(Sales[Revenue]),
    DATESYTD(DateTable[Date])
)
-- DATESYTD returns all dates from the start of the year
-- up to the current date in context
```

---

### RANKX: Ranking Within a Visual

```dax
Revenue Rank = RANKX(
    ALL(Products[ProductName]),   -- Rank against all products (ignore visual filter)
    SUM(Sales[Revenue]),          -- The value to rank by
    ,                             -- (blank = use current value)
    DESC,                         -- Descending: rank 1 = highest
    Dense                         -- Dense ranking: no gaps (1,2,3 not 1,3,5)
)
```

Use this to create a "Top 10 Products" visual where the ranking is dynamic based on date/region slicers.

---

## Building a Professional Dashboard

### Layout tips

- Use a **consistent canvas size**: 1280×720 (16:9) is standard for desktop viewing
- Create a **header bar** with the company logo, report title, and last refresh date
- Organize content in logical **sections** separated by subtle background shapes
- Place the most important metric top-left, supplementary details below and to the right

### Bookmarks

Bookmarks capture the current state of a report page (which visuals are visible, which filters are applied, which slicers are selected). Use them to create:
- **Navigation buttons** between different views of the same data
- **Show/hide** panels (click a button to reveal a filter panel, click again to hide it)
- **Storytelling flows** (preset views that walk through an analysis step by step)

### Drill-through

Drill-through lets a user right-click on a data point in one page and jump to a detailed page filtered to that specific item.

Example: Right-click on "Product A" in a summary chart → drill through to a page showing all orders, returns, and monthly trends for Product A specifically.

To set up:
1. Create a new report page
2. In the **Visualizations** pane, drag the field you want to drill by (e.g., ProductName) into the **Drill through** well
3. Build detailed visuals on this page — they will automatically filter to the item drilled from

---

## Publishing and Scheduling Refresh

### Publish to Power BI Service
In Power BI Desktop: **Home → Publish → Select workspace → Click Publish**

Your report and its data model upload to the Service. Note: if your data source is a local Excel file, you will need to install the **Personal Gateway** for scheduled refresh to work.

### Setting up scheduled refresh
1. In Power BI Service, find your dataset (not the report — the dataset)
2. Click the three-dot menu → **Settings**
3. Go to **Scheduled refresh**
4. Toggle on, choose frequency (daily, twice daily, etc.) and time
5. Make sure your data source credentials are saved

**Free Power BI accounts:** up to 8 refreshes per day
**Power BI Pro:** up to 48 refreshes per day (every 30 minutes)

---

## Key Takeaways

1. Power BI's workflow is: Get Data → Transform (Power Query) → Model (star schema) → Visualize → Publish.
2. Power Query cleans your data before it enters the model — every transformation is a recorded, replayable step.
3. The star schema (fact table + dimension tables) is the correct structure for analytical models.
4. **Measures** are DAX calculations that respond to filter context; **Calculated Columns** are row-by-row computations stored in the table.
5. `CALCULATE` is the most important DAX function — it modifies the filter context for a calculation.
6. Time intelligence functions require a proper Date table.
7. Publish to Power BI Service to share with your team and set up automatic data refreshes.

$en08$,
  content_id = $id08$
# Sesi 8: Power BI — Model Data, DAX & Dashboard Profesional

## Apa Itu Power BI?

Power BI adalah platform business intelligence dari Microsoft. Ia memungkinkan kamu menghubungkan sumber data, membersihkan dan mentransformasi data, membangun model data, membuat visualisasi, dan mempublikasikan dashboard interaktif — semuanya dalam satu ekosistem.

**Perbandingan dengan alat yang mungkin sudah kamu kenal:**

| Fitur | Excel | Looker Studio | Power BI |
|-------|-------|---------------|----------|
| Volume data | ~1 juta baris maks. | Sumber data Google | Puluhan juta baris |
| Pemodelan data | Dasar (VLOOKUP/pivot) | Tidak ada | Star schema penuh |
| Kalkulasi kustom | Formula Excel | Terbatas | DAX (sangat powerful) |
| Berbagi | File via email | Link Google | Power BI Service |
| Biaya | Termasuk dalam Office | Gratis | Gratis (Desktop) + berbayar (Service) |
| Kurva belajar | Rendah | Rendah | Menengah-Tinggi |

Power BI unggul ketika kamu perlu menangani **dataset besar**, membangun **kalkulasi kompleks**, atau membuat **laporan otomatis yang diperbarui** dan dibagikan di seluruh organisasi.

---

## Tiga Komponen Power BI

### Power BI Desktop
Aplikasi Windows gratis yang kamu unduh dan instal. Di sinilah semua pekerjaan nyata terjadi: menghubungkan data, mentransformasinya, membangun model, dan mendesain laporan. Bayangkan ini sebagai bengkel kerjamu.

### Power BI Service
Platform berbasis web di **app.powerbi.com**. Setelah kamu mempublikasikan laporan dari Desktop, ia hidup di sini. Anggota tim bisa melihatnya di browser, mengatur refresh data otomatis, dan berkolaborasi.

### Power BI Mobile
Aplikasi untuk iOS dan Android. Dioptimalkan untuk melihat laporan di ponsel dan tablet.

**Alur kerja tipikal: Desktop → Service → Mobile**

---

## Alur Kerja Power BI

Bayangkan membangun laporan Power BI dalam lima fase berbeda:

```
1. GET DATA        → Hubungkan ke sumbermu (Excel, SQL, web, dll.)
       ↓
2. TRANSFORM       → Bersihkan dan ubah bentuk data di Power Query
       ↓
3. MODEL           → Tentukan relasi antar tabel, bangun star schema
       ↓
4. VISUALIZE       → Desain chart, tabel, scorecard di halaman laporan
       ↓
5. PUBLISH         → Kirim ke Power BI Service untuk berbagi dan penjadwalan
```

---

## Fase 2: Power Query — Transformasi Datamu

Power Query adalah mesin transformasi data bawaan Power BI. Ia menggunakan bahasa bernama **M** di balik layar, tapi kamu hampir tidak perlu menulis M secara langsung — kamu menggunakan antarmuka grafis dan Power Query menghasilkan kode M untuk kamu.

**Mengapa Power Query penting:** Data mentah hampir tidak pernah siap untuk dianalisis. Ia punya nama kolom yang salah, kolom yang digabung yang seharusnya dipisah, nilai teks yang seharusnya angka, nilai yang hilang, dan format yang tidak konsisten. Power Query memperbaiki semua ini **sebelum** data masuk ke model datamu.

**Prinsip penting:** Setiap transformasi di Power Query adalah sebuah **langkah** yang direkam dalam daftar. Kamu bisa melihat, mengurutkan ulang, atau menghapus langkah apa pun. Jika kamu menambahkan data baru ke sumber, mengklik "Refresh" memutar ulang semua langkah secara otomatis.

### Transformasi Power Query yang umum:

**Hapus kolom**
Klik kanan header kolom → Remove. Hanya simpan yang benar-benar kamu butuhkan.

**Ganti nama kolom**
Klik dua kali header kolom → Ketik nama baru. Gunakan nama yang jelas: "TanggalPesanan" bukan "order_date_field_v2".

**Filter baris**
Klik panah dropdown pada header kolom → Filter. Gunaan umum: hapus baris di mana status = "Dibatalkan".

**Ubah tipe data**
Klik ikon di sebelah kiri header kolom untuk mengubah tipe ke: Whole Number, Decimal Number, Text, Date, dll.

**Ini krusial.** Jika kolom "Tanggal" disimpan sebagai teks, kamu tidak bisa mengelompokkan berdasarkan bulan atau menggunakan fungsi time intelligence.

**Merge Queries (setara JOIN di SQL)**
Ketika kamu punya dua tabel yang berbagi kunci bersama (misalnya, tabel Orders dengan CustomerID, dan tabel Customers dengan CustomerID), Merge Queries menggabungkannya.

```
Tabel Orders:        Tabel Customers:     Setelah Merge:
OrderID | CustID     CustID | NamaCust    OrderID | CustID | NamaCust
1001    | C001       C001   | Andi         1001    | C001   | Andi
1002    | C002       C002   | Budi         1002    | C002   | Budi
```

**Append Queries (setara UNION di SQL)**
Ketika kamu punya dua tabel dengan kolom yang sama tapi baris berbeda (misalnya, Penjualan_2023 dan Penjualan_2024), Append menumpuknya menjadi satu tabel.

**Pivot dan Unpivot**
Data mentah sering datang dalam format "lebar" padahal kamu butuh format "tinggi" (atau sebaliknya).

```
Sebelum (lebar):                Setelah Unpivot (tinggi):
Produk | Jan | Feb | Mar        Produk | Bulan | Penjualan
A      | 100 | 120 | 90         A      | Jan   | 100
B      | 80  | 95  | 110        A      | Feb   | 120
                                A      | Mar   | 90
                                B      | Jan   | 80
```

---

## Fase 3: Pemodelan Data — Star Schema

### Penjelasan Star Schema

Star schema mengorganisasi tabel menjadi dua jenis:

**Tabel Fakta (Fact Table):** Berisi peristiwa atau transaksi yang bisa diukur.
- Contoh: Penjualan, Pesanan, Panggilan, Sesi website
- Kolom: sebagian besar angka (jumlah, kuantitas, hitungan) dan foreign key
- Bisa memiliki jutaan baris

**Tabel Dimensi (Dimension Tables):** Mendeskripsikan konteks dari setiap fakta.
- Contoh: Pelanggan, Produk, Tanggal, Toko, Karyawan
- Kolom: atribut deskriptif (nama, kategori, tipe)
- Biasanya jauh lebih kecil dari tabel fakta

Polanya terlihat seperti bintang: satu tabel fakta di tengah, tabel dimensi memancar ke luar.

```
           [Tabel Tanggal]
                  |
[Tabel Produk] — [Tabel Fakta Penjualan] — [Tabel Pelanggan]
                  |
            [Tabel Toko]
```

**Mengapa star schema penting?**
1. **Performa:** Mesin Power BI dioptimalkan untuk star schema.
2. **Kejelasan:** Mudah dipahami tabel mana yang menyimpan informasi apa.
3. **Filter yang akurat:** Filter mengalir dari tabel dimensi ke tabel fakta secara bersih.

### Membuat relasi di Power BI

Di **tampilan Model** (ikon diagram di sidebar kiri):
1. Kamu akan melihat semua tabel dalam kotak
2. Seret kolom dari satu tabel dan jatuhkan ke kolom yang cocok di tabel lain
3. Sebuah garis muncul menghubungkan keduanya

Power BI menampilkan **1** di sisi tabel dimensi dan ***** di sisi tabel fakta.

### Kardinalitas: One-to-Many vs Many-to-Many

**One-to-many (1:*):** Satu pelanggan bisa punya banyak pesanan. Ini relasi normal dan sehat dalam star schema.

**Many-to-many (*:*):** Kedua sisi bisa punya banyak kecocokan. Power BI bisa menangani ini tapi membutuhkan kehati-hatian — hasil yang tidak terduga sering terjadi.

---

## Fase 4: DAX — Data Analysis Expressions

DAX adalah bahasa formula Power BI. Power Query mentransformasi data mentahmu sebelum dimuat, DAX membuat kalkulasi baru pada data setelah dimuat.

**Hal terpenting untuk dipahami tentang DAX:**

> Kalkulasi DAX tidak statis — mereka merespons filter apa pun yang aktif di visual atau laporan saat itu.

---

### Measures vs Calculated Columns

Ini adalah konsep yang paling sering salah dipahami oleh pemula.

**Calculated Column (Kolom Kalkulasi):**
- Dihitung baris demi baris saat data dimuat
- Disimpan dalam tabel (menambah ukuran file)
- Dievaluasi dalam **row context** (tahu nilai di setiap baris)
- Contoh: menambahkan kolom yang menggabungkan NamaDepan dan NamaBelakang
- Gunakan untuk: kategorisasi, pengelompokan, pencarian

```dax
Nama Lengkap = Pelanggan[NamaDepan] & " " & Pelanggan[NamaBelakang]

Margin Keuntungan % = DIVIDE(Penjualan[Keuntungan], Penjualan[Pendapatan])
```

**Measure:**
- Dihitung sesuai permintaan, hanya saat visual membutuhkannya
- Tidak disimpan — dihitung ulang setiap saat (TIDAK menambah ukuran file)
- Dievaluasi dalam **filter context** (tahu filter apa yang aktif)
- Contoh: Total Penjualan (yang berubah tergantung tahun/wilayah yang dipilih)
- Gunakan untuk: agregasi (jumlah, hitungan, rata-rata, rasio, perbandingan YoY)

```dax
Total Pendapatan = SUM(Penjualan[Pendapatan])

Nilai Pesanan Rata-rata = DIVIDE(SUM(Penjualan[Pendapatan]), COUNT(Penjualan[OrderID]))
```

**Pertanyaan kunci:** Jika setiap baris butuh nilainya sendiri → Calculated Column. Jika kamu ingin ringkasan yang berubah berdasarkan filter → Measure.

---

### Row Context vs Filter Context

Ini adalah konsep tersulit dalam DAX. Mari gunakan analogi.

**Bayangkan sebuah restoran.**

- **Row context** seperti dapur, di mana seorang chef menyiapkan satu hidangan spesifik untuk satu pelanggan spesifik. Chef tahu persis bahan-bahan yang ada di depannya untuk satu piring itu.

- **Filter context** seperti manajer ruang makan yang melihat gambaran besar: "Malam ini, kita hanya melayani hidangan vegetarian (filter: vegetarian = true). Berapa pendapatan yang kita hasilkan?" Manajer mengagregasi banyak baris, dibatasi oleh filter aktif.

Dalam calculated column, DAX beroperasi dalam row context — melihat satu baris dalam satu waktu.
Dalam measure, DAX beroperasi dalam filter context — mengagregasi baris yang lolos filter saat ini.

---

### Measure DAX Dasar

```dax
-- SUM: menjumlahkan kolom
Total Pendapatan = SUM(Penjualan[Pendapatan])

-- COUNT: menghitung baris
Total Pesanan = COUNT(Penjualan[OrderID])

-- COUNTROWS: menghitung baris dalam tabel (lebih andal)
Total Pesanan = COUNTROWS(Penjualan)

-- AVERAGE
Nilai Pesanan Rata-rata = AVERAGE(Penjualan[Pendapatan])

-- DIVIDE: pembagian aman (menghindari error bagi nol)
-- Sintaks: DIVIDE(pembilang, penyebut, [hasil_alternatif])
Margin Keuntungan = DIVIDE(SUM(Penjualan[Keuntungan]), SUM(Penjualan[Pendapatan]), 0)
-- Angka 0 di akhir berarti "kembalikan 0 jika penyebut nol"
```

---

### CALCULATE: Fungsi DAX Paling Penting

`CALCULATE` melakukan satu hal: mengevaluasi ekspresi dalam **filter context yang dimodifikasi**.

Bayangkan `CALCULATE` sebagai cara untuk sementara mengubah aturan ruangan sebelum menjalankan kalkulasi.

**Sintaks:**
```dax
CALCULATE(<ekspresi>, <filter1>, <filter2>, ...)
```

**Contoh 1: Filter ke nilai tertentu**
```dax
Pendapatan Wilayah Utara = CALCULATE(SUM(Penjualan[Pendapatan]), Penjualan[Wilayah] = "Utara")
```
Bahkan jika pengguna melihat semua wilayah, measure ini selalu mengembalikan pendapatan wilayah Utara saja.

**Contoh 2: Hapus semua filter (fungsi ALL)**
```dax
Total Pendapatan Semua Wilayah = CALCULATE(SUM(Penjualan[Pendapatan]), ALL(Penjualan[Wilayah]))
```
Berguna untuk menghitung "% dari Total" — bagi pendapatan yang difilter dengan total yang tidak difilter.

---

### Fungsi Time Intelligence

Fungsi time intelligence hanya bekerja jika kamu punya **tabel Tanggal** yang tepat — tabel dengan satu baris per hari, setiap hari, tanpa celah, di seluruh rentang datamu.

```dax
-- Pendapatan Tahun Lalu
Pendapatan TL = CALCULATE(
    SUM(Penjualan[Pendapatan]),
    SAMEPERIODLASTYEAR(TabelTanggal[Tanggal])
)

-- Pertumbuhan YoY %
Pertumbuhan YoY % = DIVIDE(
    SUM(Penjualan[Pendapatan]) - [Pendapatan TL],
    [Pendapatan TL],
    0
)

-- Pendapatan Year-to-date
Pendapatan YTD = CALCULATE(
    SUM(Penjualan[Pendapatan]),
    DATESYTD(TabelTanggal[Tanggal])
)
```

---

### RANKX: Peringkat dalam Visual

```dax
Peringkat Pendapatan = RANKX(
    ALL(Produk[NamaProduk]),     -- Peringkat dibandingkan semua produk
    SUM(Penjualan[Pendapatan]),  -- Nilai yang diperingkat
    ,                            -- (kosong = gunakan nilai saat ini)
    DESC,                        -- Turun: peringkat 1 = tertinggi
    Dense                        -- Dense ranking: tidak ada celah (1,2,3 bukan 1,3,5)
)
```

---

## Membangun Dashboard Profesional

### Tips tata letak

- Gunakan **ukuran canvas konsisten**: 1280×720 (16:9) adalah standar untuk tampilan desktop
- Buat **header bar** dengan logo perusahaan, judul laporan, dan tanggal refresh terakhir
- Atur konten dalam **seksi logis** yang dipisahkan oleh bentuk latar belakang yang halus
- Tempatkan metrik terpenting di kiri atas

### Bookmark

Bookmark menangkap kondisi halaman laporan saat ini. Gunakan untuk:
- **Tombol navigasi** antar tampilan berbeda dari data yang sama
- **Panel show/hide** (klik tombol untuk membuka panel filter, klik lagi untuk menyembunyikannya)
- **Alur bercerita** (tampilan yang sudah ditetapkan yang memandu melalui analisis langkah demi langkah)

### Drill-through

Drill-through membiarkan pengguna mengklik kanan pada titik data di satu halaman dan melompat ke halaman detail yang difilter ke item spesifik tersebut.

Contoh: Klik kanan "Produk A" di chart ringkasan → drill-through ke halaman yang menampilkan semua pesanan, pengembalian, dan tren bulanan untuk Produk A secara spesifik.

---

## Mempublikasikan dan Menjadwalkan Refresh

### Publikasi ke Power BI Service
Di Power BI Desktop: **Home → Publish → Pilih workspace → Klik Publish**

### Mengatur scheduled refresh
1. Di Power BI Service, temukan datasetmu
2. Klik menu tiga titik → **Settings**
3. Buka **Scheduled refresh**
4. Aktifkan, pilih frekuensi dan waktu
5. Pastikan kredensial sumber datamu tersimpan

---

## Poin-Poin Kunci

1. Alur kerja Power BI: Get Data → Transform (Power Query) → Model (star schema) → Visualize → Publish.
2. Power Query membersihkan datamu sebelum masuk ke model — setiap transformasi adalah langkah yang direkam dan bisa diputar ulang.
3. Star schema (tabel fakta + tabel dimensi) adalah struktur yang benar untuk model analitis.
4. **Measures** adalah kalkulasi DAX yang merespons filter context; **Calculated Columns** adalah komputasi baris-per-baris yang disimpan dalam tabel.
5. `CALCULATE` adalah fungsi DAX terpenting — ia memodifikasi filter context untuk sebuah kalkulasi.
6. Fungsi time intelligence membutuhkan tabel Tanggal yang tepat.
7. Publikasikan ke Power BI Service untuk berbagi dengan tim dan mengatur refresh data otomatis.

$id08$
WHERE session_number = '08';
