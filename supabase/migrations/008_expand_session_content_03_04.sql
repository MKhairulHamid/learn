-- Migration 008: Expand session content for sessions 03-04

UPDATE sessions SET
  content_en = $en03$
# Session 03 — Statistics for Data Analysts (No Math Degree Required)

## Why Statistics Matters: You Cannot Just Look at Averages

Here is a dangerous scenario. Your manager says: "Our average customer spends Rp 500,000 per order. Great!" You nod and move on.

But what if 990 customers spent Rp 100,000 and 10 VIP customers spent Rp 40,100,000 each? The average is Rp 500,000, but the *reality* of your customer base is completely different from what that number implies.

Statistics is the toolkit that stops you from being fooled — by your own data, by presentations, by news articles, and by business reports that cherry-pick convenient numbers.

You do not need a math degree. You need to understand about 10 core concepts, and this session will teach you all of them with plain language and real examples.

---

## Types of Data: Know What You Are Working With

Before you can analyze data, you need to understand what *kind* of data you have. Different data types require different analytical approaches.

### Numerical Data (Quantitative)

Numbers that have mathematical meaning — you can add, subtract, average them.

**Continuous:** Can take any value within a range, including decimals.
- Examples: height (170.5 cm), temperature (36.8°C), revenue (Rp 1,234,567), time spent on a page (47.3 seconds)

**Discrete:** Can only take specific values, usually whole numbers.
- Examples: number of orders (you cannot have 2.7 orders), number of children, number of clicks, star ratings (1, 2, 3, 4, or 5 — nothing in between)

### Categorical Data (Qualitative)

Labels or categories — you cannot meaningfully do math on them.

**Nominal:** Categories with no natural order.
- Examples: city (Jakarta, Surabaya, Medan), gender, payment method (credit card, transfer, QRIS), product category

**Ordinal:** Categories WITH a natural order, but the gaps between them are not equal.
- Examples: satisfaction rating (Very Unhappy → Unhappy → Neutral → Happy → Very Happy), education level (SD, SMP, SMA, S1, S2), size (S, M, L, XL)

### Why Does This Matter?

- You can calculate the average revenue (numerical). You cannot calculate the "average city."
- You can rank satisfaction scores (ordinal). You cannot say the gap between "Unhappy" and "Neutral" is the same as between "Neutral" and "Happy."
- Getting this wrong leads to nonsensical analysis.

---

## Measures of Central Tendency: Where Is the Middle?

These three measures all try to answer: "What is a typical value in my dataset?"

### Mean (Average)

The sum of all values divided by the count.

```
Mean = (Sum of all values) / (Number of values)
Example: [100, 200, 300, 400, 500]
Mean = 1500 / 5 = 300
```

**When to use:** When your data is roughly symmetric (similar values on both sides of center) and has no extreme outliers.

**When NOT to use:** When you have outliers that distort the picture.

**Classic example — salaries at a company:**

Imagine 10 employees: 9 earn Rp 5,000,000/month and 1 (the CEO) earns Rp 95,000,000/month.

Mean salary = (9 × 5,000,000 + 95,000,000) / 10 = 14,000,000

The "average" salary is Rp 14 million, but 9 out of 10 people earn far less. The mean is misleading here.

### Median

The middle value when data is sorted in order. Half the values are above it, half are below.

For odd count: the exact middle value.
For even count: the average of the two middle values.

```
Dataset: [3, 7, 8, 9, 50]
Sorted:  [3, 7, 8, 9, 50]
Median = 8 (the middle value)
```

Using our salary example above: Sorted salaries = [5M, 5M, 5M, 5M, 5M, 5M, 5M, 5M, 5M, 95M]. Median = average of 5th and 6th values = (5M + 5M) / 2 = **Rp 5,000,000**

The median tells the true story. This is why economists, government statisticians, and property analysts almost always report **median** income and **median** house prices, not averages.

### Mode

The most frequently occurring value.

```
Dataset: [1, 2, 2, 3, 4, 4, 4, 5]
Mode = 4 (appears 3 times)
```

**When to use:** Categorical data (what is the most popular product category?), or when you want to know the most common discrete value.

**Real example:** Your e-commerce store's most common order size (quantity) is 1 item. Mode = 1. The mean might be 2.3, but nobody orders 2.3 items — the mode tells you more about typical behavior.

---

## Measures of Spread: How Scattered Is the Data?

Knowing the "middle" is not enough. Two datasets can have the same mean but look completely different.

**Dataset A (salaries at Company A):** [4.8M, 4.9M, 5.0M, 5.1M, 5.2M] — Mean: 5M
**Dataset B (salaries at Company B):** [1M, 2M, 5M, 8M, 9M] — Mean: 5M

Both have a mean of 5M, but Company A's pay is very consistent, while Company B's is wildly varied. You need measures of spread.

### Range

The simplest: Maximum value minus minimum value.

```
Dataset A range: 5.2M - 4.8M = 0.4M
Dataset B range: 9M - 1M = 8M
```

**Weakness:** One extreme outlier blows up the range. Not very informative by itself.

### Variance

The average of the squared differences from the mean.

Do not worry about the math formula. Just understand the concept: variance measures how far, on average, each data point is from the mean. Higher variance = data is more spread out.

The reason we square the differences: to make all differences positive (a difference of -3 and +3 both contribute equally to spread).

### Standard Deviation

The square root of variance. This brings the number back to the original units, making it interpretable.

**The "how far from average" analogy:**

If students in a class all scored around 75 on an exam:
- **Low standard deviation (e.g., 3):** Most students scored between 72 and 78. The class is very consistent.
- **High standard deviation (e.g., 15):** Many students scored between 60 and 90. The class has a wide mix of abilities.

**Real example:** You are analyzing delivery times for an Indonesian logistics company. Average delivery time is 3 days.
- If standard deviation is 0.5 days: almost all deliveries arrive in 2.5 to 3.5 days — very reliable.
- If standard deviation is 2 days: deliveries range from 1 to 5 days — very unpredictable.

Same average, completely different customer experience.

---

## The Normal Distribution and the 68-95-99.7 Rule

Many natural phenomena follow a "bell curve" or **normal distribution**: most values cluster around the mean, and fewer values appear at the extremes.

Examples: heights of Indonesian adults, exam scores in a large class, measurement errors, many financial returns.

### The 68-95-99.7 Rule (Empirical Rule)

For a normally distributed dataset:
- **68%** of data falls within **1 standard deviation** of the mean
- **95%** of data falls within **2 standard deviations** of the mean
- **99.7%** of data falls within **3 standard deviations** of the mean

**Practical example:**

Heights of adult Indonesian men: mean = 165 cm, standard deviation = 6 cm.
- 68% of men are between 159 cm and 171 cm (165 ± 6)
- 95% of men are between 153 cm and 177 cm (165 ± 12)
- 99.7% of men are between 147 cm and 183 cm (165 ± 18)

If you meet someone 2 meters (200 cm) tall, that is 5.8 standard deviations above the mean — an incredibly rare event.

### Practical Use for Analysts

In business, the normal distribution helps you identify **outliers** — data points so extreme that they are likely errors or genuinely exceptional events worth investigating.

A common rule: data points more than 3 standard deviations from the mean are outliers.

---

## Percentiles and Quartiles

Percentiles tell you what percentage of the data falls below a particular value.

- **p50 (50th percentile = Median):** 50% of values are below this. The middle value.
- **p75 (75th percentile):** 75% of values are below this.
- **p95 (95th percentile):** 95% of values are below this — this is near the top.
- **p99 (99th percentile):** 99% of values are below this — the very top.

### Real Analytics Use Cases

**Website performance:** "Our page load time p95 is 4.2 seconds." This means 95% of users experience a page load of 4.2 seconds or less, and 5% have worse performance. Tracking p95 catches the worst user experiences that the average hides.

**Customer spending:** "Our p90 customer spends Rp 2,000,000+." The top 10% of spenders are your VIP segment.

### Quartiles

Quartiles divide data into four equal parts:
- **Q1 (25th percentile):** Bottom quarter of values
- **Q2 (50th percentile):** Median
- **Q3 (75th percentile):** Top quarter of values
- **IQR (Interquartile Range) = Q3 - Q1:** The middle 50% of your data. A more robust measure of spread than range, because it ignores extreme outliers.

---

## Correlation vs Causation: The Most Important Distinction in Data

**Correlation:** Two things tend to move together (when one goes up, the other tends to go up or down).

**Causation:** One thing directly *causes* the other.

### The Classic "Ice Cream Causes Drowning" Example

Data shows that on days when ice cream sales are high, drowning deaths are also high. Ice cream sales and drowning are strongly correlated.

Does eating ice cream cause drowning? Of course not.

The hidden factor is **hot weather**. Hot days cause people to (1) buy ice cream and (2) swim more. More swimming means more drowning risk. Hot weather causes both. Ice cream and drowning are both *effects* of the same cause.

### Business Examples of Misleading Correlation

- "Users who use our app more than 3 hours per day have higher revenue for us. Let us make the app addictive to increase revenue." — But it might be that higher-spending customers naturally spend more time because they are more engaged, not the other way around.

- "Companies that have more data analysts have higher profit." — But profitable companies can afford to hire more analysts. Profit causes analyst hiring, not the other way around.

### How to Think About Causation

Ask: Is there a plausible **mechanism**? Can I explain *how* A causes B step by step?

For true causal proof, you need a **controlled experiment** (A/B test): randomly assign users to two groups, change only one thing, and measure the difference. We will cover A/B testing in a later session.

---

## Sampling: You Do Not Always Need All the Data

If you want to understand the preferences of 50 million Indonesian internet users, you do not survey all 50 million. You take a **sample** — a smaller group that represents the whole.

### Why Sampling Works

If you randomly select people, the statistics of your sample (mean, proportions) will be close to the true statistics of the whole population — as long as your sample is large enough and truly random.

**Key insight:** A well-chosen sample of 1,000 people can accurately represent 270 million people. This is why national polls work.

### Sampling Bias: When Samples Go Wrong

Your sample must be **random**. If it is not, your results are biased.

**Example:** You survey customer satisfaction by sending an email to customers who opened your newsletter last week. But customers who opened your newsletter are probably your most engaged (satisfied) customers. Your survey will be much more positive than the reality.

### Why It Matters for Analysts

When you pull data for analysis, think about whether your dataset is a representative sample or a biased one. "We analyzed orders from January" — are January orders typical of the rest of the year? (Probably not if you had Harbolnas in December.)

---

## Basic Probability: What Does "30% Chance of Rain" Mean?

**Probability** is a number between 0 and 1 (or 0% and 100%) that expresses how likely an event is.

- Probability of 0 = impossible
- Probability of 1 (100%) = certain
- Probability of 0.3 (30%) = happens about 3 times out of 10

### "30% Chance of Rain" Decoded

Weather forecasters ran their model 100 times with slightly different starting conditions. In 30 of those 100 simulations, it rained. So: 30% chance of rain.

It does NOT mean it will rain for 30% of the day. It means that in similar historical conditions, it rained about 30% of the time.

### Practical Probability for Analysts

**Conversion rate:** "Our signup page converts at 4%." This means for every 100 visitors, about 4 sign up. For 10,000 visitors, expect about 400 signups.

**Churn probability:** "The model predicts this customer has a 75% chance of churning in the next 30 days." In similar historical cases, 75% of customers with this profile did churn.

---

## How to Not Be Fooled by Statistics

### Red Flag #1: Percentages Without Absolute Numbers

"Our product grew 200% this month!" From 1 order to 3 orders. Not impressive.

Always ask: 200% of what?

### Red Flag #2: Average Without Distribution

"Our average delivery time is 2 days." But if 90% deliver in 1 day and 10% take 11 days, the average hides the real problem.

Always ask: What does the distribution look like?

### Red Flag #3: Correlation Presented as Causation

"Companies that use our software have 40% higher revenue." Causation? Or do higher-revenue companies simply have the budget to buy your software?

Always ask: What is the mechanism? Was there a controlled experiment?

### Red Flag #4: Cherry-Picked Time Periods

"Our user growth was 50% in Q3!" But it dropped 40% in Q1 and Q2. Starting the graph at a convenient point.

Always ask: What is the full picture?

### Red Flag #5: Survivorship Bias

"90% of businesses that use our coaching program are still operating after 5 years!" But you only surveyed businesses that are still operating. What happened to all the ones that failed?

---

## Key Takeaways

- Mean can be misleading when outliers exist — often median is more informative.
- Standard deviation tells you how spread out your data is, not just where the center is.
- The normal distribution's 68-95-99.7 rule helps identify outliers.
- Percentiles (p50, p95, p99) reveal what the average hides.
- Correlation does NOT equal causation. Always look for the mechanism and potential hidden variables.
- Sampling works if it is random; biased samples give biased conclusions.
- Be skeptical of statistics without context — always ask "what is the full picture?"

**Next session:** SQL — the most important technical skill for data analysts.
$en03$,
  content_id = $id03$
# Sesi 03 — Statistik untuk Data Analyst (Tanpa Perlu Gelar Matematika)

## Kenapa Statistik Penting: Kamu Tidak Bisa Cuma Lihat Rata-rata

Ini skenario yang berbahaya. Manajermu bilang: "Rata-rata pelanggan kita belanja Rp 500.000 per pesanan. Bagus!" Kamu mengangguk dan lanjut.

Tapi bagaimana jika 990 pelanggan belanja Rp 100.000 dan 10 pelanggan VIP belanja Rp 40.100.000 masing-masing? Rata-ratanya memang Rp 500.000, tapi *kenyataan* dari basis pelangganmu sama sekali berbeda dari apa yang angka itu implikasikan.

Statistik adalah toolkit yang mencegahmu tertipu — oleh datamu sendiri, oleh presentasi, oleh artikel berita, dan oleh laporan bisnis yang memilih angka-angka yang menguntungkan.

---

## Jenis Data: Kenali Apa yang Kamu Kerjakan

### Data Numerik (Kuantitatif)

Angka yang punya makna matematis — kamu bisa menambahkan, mengurangkan, merata-ratakannya.

**Kontinu:** Bisa mengambil nilai apapun dalam suatu rentang, termasuk desimal.
- Contoh: tinggi badan (170,5 cm), suhu (36,8°C), pendapatan (Rp 1.234.567)

**Diskrit:** Hanya bisa mengambil nilai tertentu, biasanya bilangan bulat.
- Contoh: jumlah pesanan (kamu tidak bisa punya 2,7 pesanan), jumlah klik, rating bintang

### Data Kategorikal (Kualitatif)

Label atau kategori — kamu tidak bisa melakukan operasi matematika yang bermakna padanya.

**Nominal:** Kategori tanpa urutan alami.
- Contoh: kota (Jakarta, Surabaya, Medan), metode pembayaran (kartu kredit, transfer, QRIS)

**Ordinal:** Kategori DENGAN urutan alami, tapi jarak antar kategori tidak sama.
- Contoh: rating kepuasan (Sangat Tidak Puas → Tidak Puas → Netral → Puas → Sangat Puas), ukuran (S, M, L, XL)

---

## Ukuran Tendensi Sentral: Di Mana Pusatnya?

### Mean (Rata-rata)

Jumlah semua nilai dibagi banyaknya data.

**Contoh klasik — gaji di sebuah perusahaan:**

Bayangkan 10 karyawan: 9 orang mendapat Rp 5.000.000/bulan dan 1 orang (CEO) mendapat Rp 95.000.000/bulan.

Rata-rata gaji = (9 × 5.000.000 + 95.000.000) / 10 = 14.000.000

"Rata-rata" gaji adalah Rp 14 juta, tapi 9 dari 10 orang mendapat jauh lebih sedikit. Mean menyesatkan di sini.

**Kapan menggunakan:** Ketika datamu cukup simetris dan tidak ada outlier ekstrem.
**Kapan TIDAK menggunakan:** Ketika ada outlier yang mendistorsi gambaran.

### Median

Nilai tengah ketika data diurutkan. Setengah nilai ada di atasnya, setengah di bawahnya.

Dengan contoh gaji di atas: Nilai tengah = **Rp 5.000.000**

Median menceritakan kisah yang sesungguhnya. Inilah kenapa ekonom, statistisi pemerintah, dan analis properti hampir selalu melaporkan **median** pendapatan dan **median** harga rumah, bukan rata-rata.

### Mode

Nilai yang paling sering muncul.

**Kapan menggunakan:** Data kategorikal (apa kategori produk yang paling populer?), atau ketika kamu ingin tahu nilai diskrit yang paling umum.

---

## Ukuran Sebaran: Seberapa Tersebar Datanya?

Mengetahui "pusat" saja tidak cukup. Dua dataset bisa punya mean yang sama tapi terlihat sangat berbeda.

**Dataset A (gaji di Perusahaan A):** [4,8M, 4,9M, 5,0M, 5,1M, 5,2M] — Mean: 5M
**Dataset B (gaji di Perusahaan B):** [1M, 2M, 5M, 8M, 9M] — Mean: 5M

Keduanya punya mean 5M, tapi gaji Perusahaan A sangat konsisten sementara Perusahaan B sangat bervariasi.

### Range

Yang paling sederhana: Nilai maksimum dikurangi nilai minimum.

**Kelemahan:** Satu outlier ekstrem membesar-besarkan range. Tidak terlalu informatif sendirian.

### Standar Deviasi

Akar kuadrat dari varians. Ini mengembalikan angka ke unit aslinya, sehingga bisa diinterpretasikan.

**Analogi "seberapa jauh dari rata-rata":**

Jika siswa di kelas semuanya dapat sekitar 75 dalam ujian:
- **Standar deviasi rendah (mis., 3):** Kebanyakan siswa dapat antara 72 dan 78. Kelasnya sangat konsisten.
- **Standar deviasi tinggi (mis., 15):** Banyak siswa dapat antara 60 dan 90. Kelasnya punya campuran kemampuan yang lebar.

**Contoh nyata:** Kamu menganalisis waktu pengiriman untuk perusahaan logistik Indonesia. Rata-rata waktu pengiriman 3 hari.
- Jika standar deviasi 0,5 hari: hampir semua pengiriman tiba dalam 2,5 hingga 3,5 hari — sangat andal.
- Jika standar deviasi 2 hari: pengiriman berkisar dari 1 hingga 5 hari — sangat tidak dapat diprediksi.

Rata-rata sama, pengalaman pelanggan sama sekali berbeda.

---

## Distribusi Normal dan Aturan 68-95-99,7

Banyak fenomena alam mengikuti "kurva lonceng" atau **distribusi normal**: kebanyakan nilai mengelompok di sekitar mean, dan lebih sedikit nilai muncul di ekstrem.

### Aturan 68-95-99,7 (Aturan Empiris)

Untuk dataset yang terdistribusi normal:
- **68%** data berada dalam **1 standar deviasi** dari mean
- **95%** data berada dalam **2 standar deviasi** dari mean
- **99,7%** data berada dalam **3 standar deviasi** dari mean

**Contoh praktis:**

Tinggi badan pria dewasa Indonesia: mean = 165 cm, standar deviasi = 6 cm.
- 68% pria antara 159 cm dan 171 cm
- 95% pria antara 153 cm dan 177 cm
- 99,7% pria antara 147 cm dan 183 cm

---

## Persentil dan Kuartil

Persentil menunjukkan berapa persen data yang berada di bawah nilai tertentu.

- **p50 (Median):** 50% nilai ada di bawah ini.
- **p95:** 95% nilai ada di bawah ini — ini mendekati puncak.
- **p99:** 99% nilai ada di bawah ini — puncak sangat atas.

### Kasus Penggunaan Analitik Nyata

**Performa website:** "Waktu load halaman p95 kami adalah 4,2 detik." Artinya 95% pengguna mengalami load halaman 4,2 detik atau kurang, dan 5% mengalami performa lebih buruk.

**Pengeluaran pelanggan:** "Pelanggan p90 kami menghabiskan Rp 2.000.000+." 10% pelanggan teratas adalah segmen VIP kamu.

### Kuartil

Kuartil membagi data menjadi empat bagian yang sama:
- **Q1 (persentil ke-25):** Seperempat bawah dari nilai
- **Q2 (persentil ke-50):** Median
- **Q3 (persentil ke-75):** Seperempat atas dari nilai
- **IQR = Q3 - Q1:** 50% tengah dari datamu — ukuran sebaran yang lebih robust karena mengabaikan outlier ekstrem.

---

## Korelasi vs Kausalitas: Perbedaan Terpenting dalam Data

**Korelasi:** Dua hal cenderung bergerak bersamaan.

**Kausalitas:** Satu hal secara langsung *menyebabkan* yang lain.

### Contoh Klasik "Es Krim Menyebabkan Tenggelam"

Data menunjukkan bahwa pada hari-hari ketika penjualan es krim tinggi, kematian akibat tenggelam juga tinggi.

Apakah makan es krim menyebabkan tenggelam? Tentu tidak.

Faktor tersembunyi adalah **cuaca panas**. Hari-hari panas menyebabkan orang (1) membeli es krim dan (2) lebih banyak berenang. Lebih banyak berenang berarti lebih banyak risiko tenggelam.

### Bagaimana Memikirkan Kausalitas

Tanya: Apakah ada **mekanisme** yang masuk akal? Bisakah kamu menjelaskan *bagaimana* A menyebabkan B langkah demi langkah?

Untuk bukti kausal yang sesungguhnya, kamu perlu **eksperimen terkontrol** (A/B test).

---

## Sampling: Kamu Tidak Selalu Butuh Semua Data

Jika kamu ingin memahami preferensi 50 juta pengguna internet Indonesia, kamu tidak perlu survei semua 50 juta. Kamu ambil **sampel** — kelompok yang lebih kecil yang mewakili keseluruhan.

**Wawasan kunci:** Sampel yang dipilih dengan baik sebanyak 1.000 orang dapat secara akurat mewakili 270 juta orang. Inilah kenapa polling nasional berhasil.

### Bias Sampling: Ketika Sampel Keliru

Sampelmu harus **acak**. Jika tidak, hasilmu bias.

**Contoh:** Kamu survei kepuasan pelanggan dengan mengirim email ke pelanggan yang membuka newsletter-mu minggu lalu. Tapi pelanggan yang membuka newsletter-mu mungkin adalah pelanggan yang paling terlibat (puas). Survei kamu akan jauh lebih positif dari kenyataan.

---

## Probabilitas Dasar: Apa Arti "30% Kemungkinan Hujan"?

**Probabilitas** adalah angka antara 0 dan 1 (atau 0% dan 100%) yang mengungkapkan seberapa mungkin suatu kejadian terjadi.

"30% kemungkinan hujan" berarti: prakirawan cuaca menjalankan model mereka 100 kali dengan kondisi awal yang sedikit berbeda. Dalam 30 dari 100 simulasi tersebut, hujan turun.

**Probabilitas praktis untuk analyst:**

**Conversion rate:** "Halaman pendaftaran kami dikonversi pada 4%." Artinya untuk setiap 100 pengunjung, sekitar 4 mendaftar.

**Probabilitas churn:** "Model memprediksi pelanggan ini memiliki 75% kemungkinan churn dalam 30 hari ke depan."

---

## Cara Tidak Tertipu oleh Statistik

### Tanda Bahaya #1: Persentase Tanpa Angka Absolut
"Produk kami tumbuh 200% bulan ini!" Dari 1 pesanan menjadi 3 pesanan. Tidak mengesankan.
Selalu tanya: 200% dari apa?

### Tanda Bahaya #2: Rata-rata Tanpa Distribusi
"Rata-rata waktu pengiriman kami 2 hari." Tapi bagaimana jika 90% terkirim dalam 1 hari dan 10% butuh 11 hari?
Selalu tanya: Seperti apa distribusinya?

### Tanda Bahaya #3: Korelasi Disajikan sebagai Kausalitas
"Perusahaan yang menggunakan software kami memiliki pendapatan 40% lebih tinggi." Kausalitas? Atau apakah perusahaan berpendapatan lebih tinggi sekadar punya anggaran untuk membeli software-mu?

### Tanda Bahaya #4: Periode Waktu yang Dipilih-pilih
"Pertumbuhan pengguna kami 50% di Q3!" Tapi turun 40% di Q1 dan Q2.

### Tanda Bahaya #5: Survivorship Bias
"90% bisnis yang menggunakan program coaching kami masih beroperasi setelah 5 tahun!" Tapi kamu hanya survei bisnis yang masih beroperasi. Apa yang terjadi dengan yang gagal?

---

## Kesimpulan Utama

- Mean bisa menyesatkan saat ada outlier — seringkali median lebih informatif.
- Standar deviasi menunjukkan seberapa tersebar datamu, bukan hanya di mana pusatnya.
- Persentil (p50, p95, p99) mengungkapkan apa yang disembunyikan rata-rata.
- Korelasi TIDAK sama dengan kausalitas. Selalu cari mekanismenya.
- Sampling berhasil jika acak; sampel yang bias memberikan kesimpulan yang bias.
- Jadilah skeptis terhadap statistik tanpa konteks.

**Sesi berikutnya:** SQL — skill teknis terpenting untuk data analyst.
$id03$
WHERE session_number = '03';

UPDATE sessions SET
  content_en = $en04$
# Session 04 — SQL Basics: Your First Queries

## What Is a Database? (The Organized Spreadsheet Analogy)

Imagine you run an online store. You track:
- Your customers (name, email, address, phone)
- Your products (name, price, category, stock level)
- Your orders (which customer bought which product, when, for how much)

You could store all of this in Excel. And for a small store, that works. But after 10,000 customers, 5,000 products, and 200,000 orders, Excel becomes slow, crash-prone, and difficult for multiple people to use at the same time.

A **database** is a more organized, more powerful, more reliable system for storing and retrieving data. Think of it like a very organized set of Excel files (called "tables"), but:
- Multiple people can read and write to it simultaneously
- It can hold millions (or billions) of rows without slowing down
- It enforces rules (a customer ID cannot be blank; a price cannot be negative)
- Tables can be **linked to each other** (an order knows which customer placed it, without duplicating all the customer's information)

### Relational Databases

A **relational database** stores data in tables, and those tables are related to each other through shared columns (called **keys**).

**Example: Our e-commerce database has three tables:**

**customers table:**
| customer_id | name | email | city |
|---|---|---|---|
| 1 | Budi Santoso | budi@email.com | Jakarta |
| 2 | Sari Dewi | sari@email.com | Surabaya |

**products table:**
| product_id | product_name | price | category |
|---|---|---|---|
| 101 | Wireless Mouse | 180000 | Electronics |
| 102 | Notebook A5 | 25000 | Stationery |

**orders table:**
| order_id | customer_id | product_id | quantity | order_date |
|---|---|---|---|---|
| 5001 | 1 | 101 | 2 | 2024-01-15 |
| 5002 | 2 | 102 | 5 | 2024-01-15 |

Notice: the orders table does NOT repeat Budi's name and email. It just stores his `customer_id` (1). When you need his name, you "join" the tables using that ID. This design (called **normalization**) avoids data duplication and inconsistency.

---

## What Is SQL and How Do You Pronounce It?

**SQL** stands for **Structured Query Language**. It is the standard language for talking to relational databases.

**Pronunciation:** Both "S-Q-L" (saying the letters) and "sequel" are widely accepted. Most data professionals say "sequel." Either is fine.

SQL is not a programming language in the traditional sense. It is a **query language** — you describe *what* data you want, not *how* to get it. The database figures out the "how."

SQL is used by virtually every technology company in the world. MySQL, PostgreSQL, Microsoft SQL Server, SQLite, Snowflake, BigQuery, Redshift — they all speak SQL (with minor differences in syntax).

**The single most important skill for a data analyst is SQL.**

---

## The SELECT Statement: Asking for Data

Every SQL query starts with `SELECT`. It tells the database: "Give me these columns."

### Basic Syntax

```sql
SELECT column1, column2, column3
FROM table_name;
```

The semicolon `;` at the end marks the end of a query. Always include it.

### Selecting Specific Columns

```sql
SELECT name, email, city
FROM customers;
```

This returns only the name, email, and city columns from the customers table. Result:

| name | email | city |
|---|---|---|
| Budi Santoso | budi@email.com | Jakarta |
| Sari Dewi | sari@email.com | Surabaya |

### Selecting All Columns with *

```sql
SELECT *
FROM customers;
```

The `*` (asterisk) means "all columns." Returns every column in the table.

**Warning:** Use `SELECT *` sparingly. In real databases with 50+ columns, it returns a lot of unnecessary data. Always specify the columns you actually need.

### Aliasing with AS

You can rename a column in your output using `AS`:

```sql
SELECT
    name AS customer_name,
    email AS contact_email,
    city AS location
FROM customers;
```

Result: The column headers in your output will say "customer_name", "contact_email", "location" instead of the original names. Useful for making results more readable.

---

## The WHERE Clause: Filtering Rows

`WHERE` lets you retrieve only the rows that meet certain conditions. Think of it as a filter.

```sql
SELECT name, email, city
FROM customers
WHERE city = 'Jakarta';
```

This returns only customers whose city is exactly "Jakarta".

### Comparison Operators

| Operator | Meaning | Example |
|---|---|---|
| `=` | Equals | `city = 'Jakarta'` |
| `!=` or `<>` | Not equals | `city != 'Jakarta'` |
| `>` | Greater than | `price > 100000` |
| `<` | Less than | `price < 100000` |
| `>=` | Greater than or equal | `price >= 100000` |
| `<=` | Less than or equal | `price <= 100000` |

### BETWEEN: A Range of Values

```sql
SELECT product_name, price
FROM products
WHERE price BETWEEN 50000 AND 200000;
```

This returns products priced from 50,000 to 200,000 (inclusive — both endpoints are included).

Equivalent to: `WHERE price >= 50000 AND price <= 200000`

### IN: Match Any of These Values

```sql
SELECT name, city
FROM customers
WHERE city IN ('Jakarta', 'Surabaya', 'Bandung');
```

Instead of writing `WHERE city = 'Jakarta' OR city = 'Surabaya' OR city = 'Bandung'`, use `IN` for a cleaner list.

### LIKE: Pattern Matching

`LIKE` lets you search for partial matches using wildcards:
- `%` = any sequence of characters (zero or more)
- `_` = exactly one character

```sql
-- Find all customers whose email ends with @gmail.com
SELECT name, email
FROM customers
WHERE email LIKE '%@gmail.com';

-- Find products whose name starts with "Wireless"
SELECT product_name
FROM products
WHERE product_name LIKE 'Wireless%';

-- Find products with exactly 5 characters in the name
SELECT product_name
FROM products
WHERE product_name LIKE '_____';
```

### IS NULL and IS NOT NULL

NULL in databases means "no value" or "unknown." It is NOT the same as zero or an empty string.

```sql
-- Find customers who have not provided their phone number
SELECT name, email
FROM customers
WHERE phone IS NULL;

-- Find orders that have been shipped (have a ship date)
SELECT order_id
FROM orders
WHERE shipped_date IS NOT NULL;
```

**Critical rule:** You cannot use `= NULL`. You MUST use `IS NULL`. `WHERE phone = NULL` will always return zero rows.

---

## AND vs OR: Combining Conditions

This is one of the most common sources of confusion for beginners. Use a truth table to think it through.

### AND: Both Conditions Must Be True

```sql
SELECT name, city
FROM customers
WHERE city = 'Jakarta' AND registration_year = 2024;
```

Only returns customers who are BOTH in Jakarta AND registered in 2024.

### OR: At Least One Condition Must Be True

```sql
SELECT name, city
FROM customers
WHERE city = 'Jakarta' OR city = 'Surabaya';
```

Returns customers in Jakarta, customers in Surabaya, and anyone in both (though a person can only be in one city at a time).

### Truth Table for AND vs OR

| Condition A | Condition B | A AND B | A OR B |
|---|---|---|---|
| TRUE | TRUE | TRUE | TRUE |
| TRUE | FALSE | FALSE | TRUE |
| FALSE | TRUE | FALSE | TRUE |
| FALSE | FALSE | FALSE | FALSE |

### Combining AND and OR — Use Parentheses!

```sql
-- Return Jakarta customers who spent > 1M, OR any VIP customers regardless of city
SELECT name, city, total_spent, is_vip
FROM customers
WHERE (city = 'Jakarta' AND total_spent > 1000000) OR is_vip = TRUE;
```

Without parentheses, the logic changes! Always use `()` to make your intent explicit when mixing AND and OR.

---

## ORDER BY: Sorting Your Results

```sql
SELECT product_name, price
FROM products
ORDER BY price;  -- ascending by default (lowest to highest)

SELECT product_name, price
FROM products
ORDER BY price DESC;  -- descending (highest to lowest)

-- Sort by multiple columns
SELECT name, city, registration_year
FROM customers
ORDER BY city ASC, registration_year DESC;
-- First sort alphabetically by city, then within each city, newest registrations first
```

---

## LIMIT: Always Use It When Exploring

When you connect to a real database with millions of rows, a `SELECT *` without LIMIT can return so much data that it:
- Crashes your query tool
- Takes minutes to run
- Overloads the database server

Always use `LIMIT` when exploring:

```sql
SELECT *
FROM orders
LIMIT 10;  -- Only return the first 10 rows
```

Think of `LIMIT` as saying "just show me a sample." Once you know the data structure, you can remove it for full analysis.

---

## Your First 5 Queries: Step by Step

Let us practice with our e-commerce database (customers, products, orders tables).

### Query 1: See all customers from Bali

```sql
SELECT name, email, city
FROM customers
WHERE city = 'Bali'
ORDER BY name ASC
LIMIT 20;
```

### Query 2: Find expensive electronics

```sql
SELECT product_name, price, category
FROM products
WHERE category = 'Electronics'
  AND price > 500000
ORDER BY price DESC;
```

### Query 3: Find orders placed in January 2024

```sql
SELECT order_id, customer_id, product_id, quantity, order_date
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY order_date DESC
LIMIT 50;
```

### Query 4: Find products with "wireless" in the name (case-insensitive)

```sql
SELECT product_name, price, category
FROM products
WHERE LOWER(product_name) LIKE '%wireless%'
ORDER BY price;
```

`LOWER()` converts the product name to lowercase before comparing, so "Wireless", "WIRELESS", and "wireless" all match.

### Query 5: Find customers who have not filled in their phone number

```sql
SELECT name, email, city
FROM customers
WHERE phone IS NULL
ORDER BY name;
```

---

## Common SQL Errors and What They Mean

### Error: "column does not exist"
You misspelled a column name, or you are using a column that does not exist in that table.
```sql
SELECT custmer_name FROM customers;  -- "custmer_name" should be "name" or "customer_name"
```

### Error: "table does not exist"
You misspelled the table name, or you are querying the wrong database/schema.

### Error: "syntax error at or near..."
You have a typo in your SQL keywords, a missing comma, or unclosed parentheses.
```sql
SELECT name email FROM customers;  -- Missing comma between name and email
```

### No rows returned (but no error)
Your WHERE clause is too restrictive and filtered out everything. Try relaxing the conditions.

### Too many rows / query is very slow
You forgot LIMIT when exploring, or your WHERE clause is missing and you are scanning the whole table.

---

## How SQL Reads a Query (Order of Execution)

You write SQL in this order:
```
SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...
```

But the database **executes** it in this order:
1. `FROM` — which table?
2. `WHERE` — filter the rows
3. `SELECT` — pick the columns
4. `ORDER BY` — sort the results
5. `LIMIT` — cut to the requested number of rows

Understanding this order is important later when you use aggregation (GROUP BY runs after WHERE but before SELECT).

---

## Key Takeaways

- A relational database stores data in related tables, connected by shared IDs.
- SQL is the language for talking to databases — the #1 skill for data analysts.
- `SELECT` picks columns, `FROM` picks the table, `WHERE` filters rows.
- Operators: `=`, `!=`, `>`, `<`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.
- `AND` requires both conditions; `OR` requires at least one. Use parentheses when mixing.
- Always `LIMIT` when exploring to avoid overwhelming your tool and the database.
- SQL executes in a different order than you write it: FROM → WHERE → SELECT → ORDER BY → LIMIT.

**Next session:** SQL Aggregation — GROUP BY, HAVING, and JOINs.
$en04$,
  content_id = $id04$
# Sesi 04 — SQL Dasar: Query Pertamamu

## Apa Itu Database? (Analogi Spreadsheet Terorganisir)

Bayangkan kamu menjalankan toko online. Kamu melacak:
- Pelangganmu (nama, email, alamat, telepon)
- Produkmu (nama, harga, kategori, stok)
- Pesananmu (pelanggan mana yang membeli produk apa, kapan, dengan harga berapa)

Kamu bisa menyimpan semua ini di Excel. Dan untuk toko kecil, itu berhasil. Tapi setelah 10.000 pelanggan, 5.000 produk, dan 200.000 pesanan, Excel menjadi lambat, sering crash, dan sulit digunakan oleh banyak orang sekaligus.

**Database** adalah sistem yang lebih terorganisir, lebih powerful, lebih andal untuk menyimpan dan mengambil data. Bayangkan seperti sekumpulan file Excel yang sangat terorganisir (disebut "tabel"), tapi:
- Banyak orang bisa membaca dan menulis ke dalamnya secara bersamaan
- Bisa menampung jutaan (atau miliaran) baris tanpa melambat
- Tabel bisa **saling terhubung** satu sama lain

### Database Relasional

Database **relasional** menyimpan data dalam tabel, dan tabel-tabel itu saling berhubungan melalui kolom bersama (disebut **key**).

**Contoh: Database e-commerce kita punya tiga tabel:**

**Tabel customers:**
| customer_id | name | email | city |
|---|---|---|---|
| 1 | Budi Santoso | budi@email.com | Jakarta |
| 2 | Sari Dewi | sari@email.com | Surabaya |

**Tabel products:**
| product_id | product_name | price | category |
|---|---|---|---|
| 101 | Wireless Mouse | 180000 | Electronics |
| 102 | Notebook A5 | 25000 | Stationery |

**Tabel orders:**
| order_id | customer_id | product_id | quantity | order_date |
|---|---|---|---|---|
| 5001 | 1 | 101 | 2 | 2024-01-15 |
| 5002 | 2 | 102 | 5 | 2024-01-15 |

Perhatikan: tabel orders TIDAK mengulang nama dan email Budi. Hanya menyimpan `customer_id`-nya (1). Saat kamu butuh namanya, kamu "gabungkan" tabelnya menggunakan ID itu.

---

## Apa Itu SQL dan Cara Mengucapkannya?

**SQL** singkatan dari **Structured Query Language**. Ini adalah bahasa standar untuk berkomunikasi dengan database relasional.

**Pengucapan:** Baik "S-Q-L" (mengeja hurufnya) maupun "sequel" keduanya diterima luas. Kebanyakan profesional data bilang "sequel."

SQL bukan bahasa pemrograman dalam arti tradisional. Ini adalah **bahasa query** — kamu mendeskripsikan *apa* data yang kamu inginkan, bukan *bagaimana* mendapatkannya.

**Skill terpenting untuk data analyst adalah SQL.**

---

## Pernyataan SELECT: Meminta Data

Setiap query SQL dimulai dengan `SELECT`. Ini memberitahu database: "Berikan aku kolom-kolom ini."

### Sintaks Dasar

```sql
SELECT kolom1, kolom2, kolom3
FROM nama_tabel;
```

Titik koma `;` di akhir menandai akhir query. Selalu sertakan.

### Memilih Kolom Tertentu

```sql
SELECT name, email, city
FROM customers;
```

### Memilih Semua Kolom dengan *

```sql
SELECT *
FROM customers;
```

`*` (asterisk) berarti "semua kolom." **Peringatan:** Gunakan `SELECT *` secukupnya. Di database nyata dengan 50+ kolom, ini mengembalikan banyak data yang tidak perlu.

### Alias dengan AS

Kamu bisa mengganti nama kolom di outputmu menggunakan `AS`:

```sql
SELECT
    name AS nama_pelanggan,
    email AS kontak_email,
    city AS lokasi
FROM customers;
```

---

## Klausa WHERE: Memfilter Baris

`WHERE` memungkinkan kamu mengambil hanya baris yang memenuhi kondisi tertentu.

```sql
SELECT name, email, city
FROM customers
WHERE city = 'Jakarta';
```

### Operator Perbandingan

| Operator | Arti | Contoh |
|---|---|---|
| `=` | Sama dengan | `city = 'Jakarta'` |
| `!=` atau `<>` | Tidak sama | `city != 'Jakarta'` |
| `>` | Lebih besar dari | `price > 100000` |
| `<` | Lebih kecil dari | `price < 100000` |
| `>=` | Lebih besar atau sama | `price >= 100000` |
| `<=` | Lebih kecil atau sama | `price <= 100000` |

### BETWEEN: Rentang Nilai

```sql
SELECT product_name, price
FROM products
WHERE price BETWEEN 50000 AND 200000;
```

### IN: Cocokkan Salah Satu dari Daftar Ini

```sql
SELECT name, city
FROM customers
WHERE city IN ('Jakarta', 'Surabaya', 'Bandung');
```

### LIKE: Pencocokan Pola

`LIKE` memungkinkan kamu mencari kecocokan parsial menggunakan wildcard:
- `%` = urutan karakter apapun (nol atau lebih)
- `_` = tepat satu karakter

```sql
-- Temukan pelanggan yang emailnya berakhir dengan @gmail.com
SELECT name, email
FROM customers
WHERE email LIKE '%@gmail.com';

-- Temukan produk yang namanya dimulai dengan "Wireless"
SELECT product_name
FROM products
WHERE product_name LIKE 'Wireless%';
```

### IS NULL dan IS NOT NULL

NULL di database berarti "tidak ada nilai." Ini BUKAN sama dengan nol atau string kosong.

```sql
-- Temukan pelanggan yang belum mengisi nomor telepon
SELECT name, email
FROM customers
WHERE phone IS NULL;
```

**Aturan kritis:** Kamu TIDAK BISA menggunakan `= NULL`. Kamu HARUS menggunakan `IS NULL`.

---

## AND vs OR: Menggabungkan Kondisi

Ini salah satu sumber kebingungan paling umum bagi pemula.

### AND: Kedua Kondisi Harus Benar

```sql
SELECT name, city
FROM customers
WHERE city = 'Jakarta' AND registration_year = 2024;
```

### OR: Setidaknya Satu Kondisi Harus Benar

```sql
SELECT name, city
FROM customers
WHERE city = 'Jakarta' OR city = 'Surabaya';
```

### Tabel Kebenaran AND vs OR

| Kondisi A | Kondisi B | A AND B | A OR B |
|---|---|---|---|
| TRUE | TRUE | TRUE | TRUE |
| TRUE | FALSE | FALSE | TRUE |
| FALSE | TRUE | FALSE | TRUE |
| FALSE | FALSE | FALSE | FALSE |

### Menggabungkan AND dan OR — Gunakan Tanda Kurung!

```sql
SELECT name, city, total_spent, is_vip
FROM customers
WHERE (city = 'Jakarta' AND total_spent > 1000000) OR is_vip = TRUE;
```

Tanpa tanda kurung, logikanya berubah! Selalu gunakan `()` untuk memperjelas maksudmu saat menggabungkan AND dan OR.

---

## ORDER BY: Mengurutkan Hasilmu

```sql
SELECT product_name, price
FROM products
ORDER BY price;  -- naik secara default (terendah ke tertinggi)

SELECT product_name, price
FROM products
ORDER BY price DESC;  -- turun (tertinggi ke terendah)

-- Urutkan berdasarkan beberapa kolom
SELECT name, city, registration_year
FROM customers
ORDER BY city ASC, registration_year DESC;
```

---

## LIMIT: Selalu Gunakan Saat Eksplorasi

Saat kamu terhubung ke database nyata dengan jutaan baris, `SELECT *` tanpa LIMIT bisa mengembalikan begitu banyak data sehingga:
- Mencrash tool query-mu
- Membutuhkan waktu menit untuk dijalankan
- Membebani server database

```sql
SELECT *
FROM orders
LIMIT 10;  -- Hanya kembalikan 10 baris pertama
```

---

## 5 Query Pertamamu: Langkah demi Langkah

### Query 1: Lihat semua pelanggan dari Bali

```sql
SELECT name, email, city
FROM customers
WHERE city = 'Bali'
ORDER BY name ASC
LIMIT 20;
```

### Query 2: Temukan elektronik mahal

```sql
SELECT product_name, price, category
FROM products
WHERE category = 'Electronics'
  AND price > 500000
ORDER BY price DESC;
```

### Query 3: Temukan pesanan yang dibuat di Januari 2024

```sql
SELECT order_id, customer_id, product_id, quantity, order_date
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY order_date DESC
LIMIT 50;
```

### Query 4: Temukan produk dengan "wireless" di namanya

```sql
SELECT product_name, price, category
FROM products
WHERE LOWER(product_name) LIKE '%wireless%'
ORDER BY price;
```

### Query 5: Temukan pelanggan yang belum mengisi nomor telepon

```sql
SELECT name, email, city
FROM customers
WHERE phone IS NULL
ORDER BY name;
```

---

## Error SQL Umum dan Artinya

### Error: "column does not exist"
Kamu salah eja nama kolom, atau menggunakan kolom yang tidak ada di tabel itu.

### Error: "table does not exist"
Kamu salah eja nama tabel, atau query di database/schema yang salah.

### Error: "syntax error at or near..."
Ada typo di kata kunci SQL, koma yang hilang, atau tanda kurung yang tidak ditutup.

### Tidak ada baris yang dikembalikan (tapi tidak ada error)
Klausa WHERE-mu terlalu ketat dan memfilter segalanya. Coba longgarkan kondisinya.

---

## Urutan Eksekusi SQL

Kamu menulis SQL dalam urutan ini:
```
SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...
```

Tapi database **mengeksekusi** dalam urutan ini:
1. `FROM` — tabel mana?
2. `WHERE` — filter barisnya
3. `SELECT` — pilih kolomnya
4. `ORDER BY` — urutkan hasilnya
5. `LIMIT` — potong ke jumlah yang diminta

---

## Kesimpulan Utama

- Database relasional menyimpan data dalam tabel yang terhubung melalui ID bersama.
- SQL adalah bahasa untuk berbicara ke database — skill #1 untuk data analyst.
- `SELECT` memilih kolom, `FROM` memilih tabel, `WHERE` memfilter baris.
- Operator: `=`, `!=`, `>`, `<`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.
- `AND` membutuhkan kedua kondisi; `OR` membutuhkan setidaknya satu. Gunakan tanda kurung saat menggabungkan.
- Selalu `LIMIT` saat eksplorasi untuk menghindari membebani tool dan database.

**Sesi berikutnya:** Agregasi SQL — GROUP BY, HAVING, dan JOIN.
$id04$
WHERE session_number = '04';
