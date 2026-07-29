-- ============================================================
-- 053: Live-checkpoint content for X05–X08 (EDA, Visualization,
--      Power BI, Python/pandas). Same standard as 052: application
--      over recall, every distractor a real misconception.
-- ============================================================

delete from public.session_checkpoints cp
 using public.sessions s
 where cp.session_id = s.id
   and s.session_number in ('X05','X06','X07','X08');

with seed (session_number, cp_num, cp_title_en, cp_title_id,
           q_num, prompt_en, prompt_id, options, correct) as (values

-- ══════════════ X05 · Data Analysis with EDA ══════════════
('X05', 1, 'Checkpoint 1 · Univariate', 'Cek Poin 1 · Univariat', 1,
 'A histogram of basket size leans right, with a long tail of high-value baskets. What does that tell you about how to report the typical basket?',
 'Histogram ukuran keranjang miring ke kanan, dengan ekor panjang berisi keranjang bernilai tinggi. Apa artinya untuk cara melaporkan keranjang tipikal?',
 '[{"id":"a","label_en":"The mean will understate the typical basket, so report the mean anyway.","label_id":"Mean akan meremehkan keranjang tipikal, jadi tetap laporkan mean."},
   {"id":"b","label_en":"The mean will overstate the typical basket — reach for the median.","label_id":"Mean akan melebih-lebihkan keranjang tipikal — gunakan median."},
   {"id":"c","label_en":"The distribution is broken and the data needs re-pulling.","label_id":"Distribusinya rusak dan datanya perlu ditarik ulang."},
   {"id":"d","label_en":"Skew has no effect on which measure you should quote.","label_id":"Kemiringan tidak berpengaruh pada ukuran mana yang harus dikutip."}]'::jsonb, 'b'),

('X05', 1, 'Checkpoint 1 · Univariate', 'Cek Poin 1 · Univariat', 2,
 'You skip univariate analysis and go straight to a scatter of discount versus return rate. What are you most likely to miss?',
 'Anda melewati analisis univariat dan langsung ke scatter diskon versus tingkat retur. Apa yang paling mungkin Anda lewatkan?',
 '[{"id":"a","label_en":"The direction of the relationship between the two variables.","label_id":"Arah hubungan antara kedua variabel."},
   {"id":"b","label_en":"The number of rows in the dataset.","label_id":"Jumlah baris dalam dataset."},
   {"id":"c","label_en":"An outlier that quietly distorts the correlation you are about to compute.","label_id":"Outlier yang diam-diam mendistorsi korelasi yang akan Anda hitung."},
   {"id":"d","label_en":"Which of the two variables is categorical.","label_id":"Mana di antara dua variabel yang bersifat kategorikal."}]'::jsonb, 'c'),

('X05', 2, 'Checkpoint 2 · Bivariate', 'Cek Poin 2 · Bivariat', 1,
 'Days since last order and total spend show a correlation of −0.85. What is the correct reading?',
 'Hari sejak pesanan terakhir dan total belanja menunjukkan korelasi −0,85. Apa pembacaan yang benar?',
 '[{"id":"a","label_en":"Going quiet causes customers to spend less, so re-engaging them will directly raise their spend.","label_id":"Menjadi pasif menyebabkan pelanggan belanja lebih sedikit, jadi mengaktifkan mereka langsung menaikkan belanja."},
   {"id":"b","label_en":"About 85% of customers spend less than the average, which is what the coefficient reports.","label_id":"Sekitar 85% pelanggan berbelanja di bawah rata-rata, dan itulah yang dilaporkan koefisiennya."},
   {"id":"c","label_en":"There is effectively no relationship between the two once you account for order volume.","label_id":"Praktis tidak ada hubungan antara keduanya begitu volume pesanan diperhitungkan."},
   {"id":"d","label_en":"As days since last order rises, spend tends to fall — a strong negative linear relationship, not a cause.","label_id":"Saat hari sejak pesanan terakhir naik, belanja cenderung turun — hubungan linear negatif yang kuat, bukan sebab-akibat."}]'::jsonb, 'd'),

('X05', 2, 'Checkpoint 2 · Bivariate', 'Cek Poin 2 · Bivariat', 2,
 'You want to compare revenue across the four regions. Which pairing of variable types and tool is right?',
 'Anda ingin membandingkan pendapatan di empat wilayah. Pasangan tipe variabel dan alat mana yang tepat?',
 '[{"id":"a","label_en":"Category vs number — a grouped bar or box-by-group","label_id":"Kategori vs angka — grouped bar atau box per grup"},
   {"id":"b","label_en":"Number vs number — a scatter plot","label_id":"Angka vs angka — scatter plot"},
   {"id":"c","label_en":"Category vs category — a cross-tab of region against category","label_id":"Kategori vs kategori — cross-tab wilayah terhadap kategori"},
   {"id":"d","label_en":"Number alone — a histogram","label_id":"Angka saja — histogram"}]'::jsonb, 'a'),

('X05', 3, 'Checkpoint 3 · Observation to Action', 'Cek Poin 3 · Observasi ke Aksi', 1,
 'Which of these statements is still only an OBSERVATION?',
 'Pernyataan mana yang masih sekadar OBSERVASI?',
 '[{"id":"a","label_en":"Jakarta is 40% of total revenue.","label_id":"Jakarta menyumbang 40% dari total pendapatan."},
   {"id":"b","label_en":"Jakarta over-indexes because premium members cluster there and buy Electronics.","label_id":"Jakarta over-index karena member premium terkonsentrasi di sana dan membeli Electronics."},
   {"id":"c","label_en":"Pilot a premium-Electronics bundle in Jakarta next quarter.","label_id":"Uji coba bundel premium-Electronics di Jakarta kuartal depan."},
   {"id":"d","label_en":"We should shift the Electronics budget toward Jakarta.","label_id":"Kita sebaiknya mengalihkan anggaran Electronics ke Jakarta."}]'::jsonb, 'a'),

('X05', 3, 'Checkpoint 3 · Observation to Action', 'Cek Poin 3 · Observasi ke Aksi', 2,
 'Your finding is "deeper discounts correlate with higher return rates". What makes it pass the so-what test?',
 'Temuan Anda adalah "diskon lebih dalam berkorelasi dengan tingkat retur lebih tinggi". Apa yang membuatnya lolos uji so-what?',
 '[{"id":"a","label_en":"Adding the exact correlation coefficient to the slide so the strength of the link is documented.","label_id":"Menambahkan koefisien korelasi persis ke slide agar kekuatan hubungannya terdokumentasi."},
   {"id":"b","label_en":"Showing the scatter plot at a larger size so the upward trend is unmistakable to the room.","label_id":"Menampilkan scatter plot lebih besar agar tren naiknya tak terbantahkan bagi seisi ruangan."},
   {"id":"c","label_en":"Repeating the finding in the executive summary so the leadership team cannot overlook it.","label_id":"Mengulang temuan di ringkasan eksekutif agar tim pimpinan tidak melewatkannya."},
   {"id":"d","label_en":"Explaining that deal-seekers return more, and recommending a discount cap on return-prone categories.","label_id":"Menjelaskan bahwa pemburu diskon lebih sering retur, dan merekomendasikan batas diskon pada kategori rawan retur."}]'::jsonb, 'd'),

('X05', 4, 'Checkpoint 4 · Traps', 'Cek Poin 4 · Jebakan', 1,
 'Ice-cream sales and electric-fan sales rise and fall together across the year. What is the honest conclusion?',
 'Penjualan es krim dan kipas angin naik-turun bersamaan sepanjang tahun. Apa kesimpulan yang jujur?',
 '[{"id":"a","label_en":"Buying ice cream makes people buy fans.","label_id":"Membeli es krim membuat orang membeli kipas angin."},
   {"id":"b","label_en":"A third variable — the season — drives both; the link is not causal.","label_id":"Variabel ketiga — musim — mendorong keduanya; hubungannya bukan sebab-akibat."},
   {"id":"c","label_en":"The two are negatively correlated.","label_id":"Keduanya berkorelasi negatif."},
   {"id":"d","label_en":"The correlation must be a calculation error, since the two products are unrelated.","label_id":"Korelasinya pasti salah hitung, karena kedua produk itu tidak berhubungan."}]'::jsonb, 'b'),

('X05', 4, 'Checkpoint 4 · Traps', 'Cek Poin 4 · Jebakan', 2,
 'Overall conversion rate rose last quarter, yet conversion fell in every single customer segment. What is going on?',
 'Tingkat konversi keseluruhan naik kuartal lalu, tetapi konversi turun di setiap segmen pelanggan. Apa yang terjadi?',
 '[{"id":"a","label_en":"The overall figure was calculated incorrectly and needs to be recomputed.","label_id":"Angka keseluruhan salah dihitung dan perlu dihitung ulang."},
   {"id":"b","label_en":"One outlier segment is dragging the blended average upward on its own.","label_id":"Satu segmen outlier menarik rata-rata gabungan ke atas dengan sendirinya."},
   {"id":"c","label_en":"The segment mix shifted toward higher-converting segments — Simpson''s paradox.","label_id":"Komposisi segmen bergeser ke segmen berkonversi tinggi — paradoks Simpson."},
   {"id":"d","label_en":"Correlation has been mistaken for causation somewhere in the analysis.","label_id":"Korelasi telah dikira sebab-akibat di suatu tempat dalam analisis."}]'::jsonb, 'c'),

-- ══════════════ X06 · Data Visualization ══════════════
('X06', 1, 'Checkpoint 1 · Choosing the Chart', 'Cek Poin 1 · Memilih Grafik', 1,
 'The question is "does discount depth move together with return rate?". Which chart answers it?',
 'Pertanyaannya "apakah kedalaman diskon bergerak bersama tingkat retur?". Grafik mana yang menjawabnya?',
 '[{"id":"a","label_en":"A stacked bar of returns per category","label_id":"Stacked bar retur per kategori"},
   {"id":"b","label_en":"A line chart of returns per month","label_id":"Line chart retur per bulan"},
   {"id":"c","label_en":"A scatter plot of discount against return rate","label_id":"Scatter plot diskon terhadap tingkat retur"},
   {"id":"d","label_en":"A histogram of discount depth","label_id":"Histogram kedalaman diskon"}]'::jsonb, 'c'),

('X06', 1, 'Checkpoint 1 · Choosing the Chart', 'Cek Poin 1 · Memilih Grafik', 2,
 'You need to show how each category CONTRIBUTES to the monthly total, month by month. Which chart fits?',
 'Anda perlu menunjukkan bagaimana setiap kategori BERKONTRIBUSI pada total bulanan, bulan demi bulan. Grafik mana yang cocok?',
 '[{"id":"a","label_en":"A 100% stacked bar per month","label_id":"100% stacked bar per bulan"},
   {"id":"b","label_en":"A pie chart per category","label_id":"Pie chart per kategori"},
   {"id":"c","label_en":"A scatter of category against month","label_id":"Scatter kategori terhadap bulan"},
   {"id":"d","label_en":"A box plot of monthly revenue","label_id":"Box plot pendapatan bulanan"}]'::jsonb, 'a'),

('X06', 2, 'Checkpoint 2 · Colour & Layout', 'Cek Poin 2 · Warna & Tata Letak', 1,
 'Your bar chart gives each of the eight categories its own bright colour. What is the problem?',
 'Bar chart Anda memberi masing-masing dari delapan kategori warna cerah sendiri. Apa masalahnya?',
 '[{"id":"a","label_en":"Nothing stands out — with everything highlighted, there is no visual hierarchy and no point.","label_id":"Tidak ada yang menonjol — jika semua disorot, tidak ada hierarki visual dan tidak ada pesan."},
   {"id":"b","label_en":"Eight bright colours exceed what most projectors and screens can reproduce accurately in a room.","label_id":"Delapan warna cerah melampaui yang bisa direproduksi akurat oleh kebanyakan proyektor dan layar."},
   {"id":"c","label_en":"Colour should never be used in bar charts.","label_id":"Warna tidak boleh dipakai di bar chart."},
   {"id":"d","label_en":"Bright colours always fail accessibility checks.","label_id":"Warna cerah selalu gagal uji aksesibilitas."}]'::jsonb, 'a'),

('X06', 2, 'Checkpoint 2 · Colour & Layout', 'Cek Poin 2 · Warna & Tata Letak', 2,
 'Your revenue-by-region bars are ordered alphabetically. When should you keep that order?',
 'Batang pendapatan per wilayah Anda diurutkan secara alfabetis. Kapan urutan itu sebaiknya dipertahankan?',
 '[{"id":"a","label_en":"Always — alphabetical is the neutral, unbiased choice.","label_id":"Selalu — alfabetis adalah pilihan netral dan tidak bias."},
   {"id":"b","label_en":"Only when the audience will scan for a specific named region, or the order carries meaning.","label_id":"Hanya jika audiens akan mencari wilayah tertentu, atau urutannya memang bermakna."},
   {"id":"c","label_en":"Whenever there are more than five categories.","label_id":"Kapan pun kategorinya lebih dari lima."},
   {"id":"d","label_en":"Never — bars must always stay alphabetical, so the same category sits in the same place every time.","label_id":"Tidak pernah — batang harus tetap alfabetis, agar kategori yang sama selalu berada di posisi sama."}]'::jsonb, 'b'),

('X06', 3, 'Checkpoint 3 · One Message', 'Cek Poin 3 · Satu Pesan', 1,
 'Which chart title follows the one-chart-one-message principle?',
 'Judul grafik mana yang mengikuti prinsip satu grafik satu pesan?',
 '[{"id":"a","label_en":"Revenue by Month","label_id":"Pendapatan per Bulan"},
   {"id":"b","label_en":"Monthly Revenue Analysis 2026","label_id":"Analisis Pendapatan Bulanan 2026"},
   {"id":"c","label_en":"Revenue grew 22% after the April relaunch","label_id":"Pendapatan tumbuh 22% setelah peluncuran ulang April"},
   {"id":"d","label_en":"Revenue and Cost Trends by Region and Month","label_id":"Tren Pendapatan dan Biaya per Wilayah dan Bulan"}]'::jsonb, 'c'),

('X06', 3, 'Checkpoint 3 · One Message', 'Cek Poin 3 · Satu Pesan', 2,
 'Once the takeaway is in the title, what should happen to the rest of the chart?',
 'Setelah inti pesan ada di judul, apa yang harus terjadi pada sisa grafiknya?',
 '[{"id":"a","label_en":"Add a legend and gridlines so readers can verify every value.","label_id":"Tambahkan legenda dan gridline agar pembaca bisa memverifikasi setiap nilai."},
   {"id":"b","label_en":"Add a second series so the chart earns its space.","label_id":"Tambahkan seri kedua agar grafiknya sepadan dengan ruangnya."},
   {"id":"c","label_en":"Keep everything on the chart — the title is decoration, and the underlying data is the real point.","label_id":"Pertahankan semuanya di grafik — judul hanya hiasan, dan data di baliknya yang benar-benar penting."},
   {"id":"d","label_en":"Strip anything that does not support that sentence, and highlight the mark that proves it.","label_id":"Buang apa pun yang tidak mendukung kalimat itu, dan sorot elemen yang membuktikannya."}]'::jsonb, 'd'),

('X06', 4, 'Checkpoint 4 · Misleading Charts', 'Cek Poin 4 · Grafik yang Menyesatkan', 1,
 'A bar chart of revenue starts its y-axis at 4.8M instead of 0, making a 2% difference look enormous. What is wrong?',
 'Bar chart pendapatan memulai sumbu y di 4,8 juta alih-alih 0, membuat selisih 2% tampak sangat besar. Apa yang salah?',
 '[{"id":"a","label_en":"Nothing is wrong — zooming into the real range is always more informative than padding the axis to zero.","label_id":"Tidak ada yang salah — memperbesar rentang sebenarnya selalu lebih informatif daripada memaksa sumbu ke nol."},
   {"id":"b","label_en":"Bar length encodes magnitude, so a truncated axis exaggerates the difference — bars must start at 0.","label_id":"Panjang batang mewakili besaran, jadi sumbu terpotong melebih-lebihkan selisih — batang harus mulai dari 0."},
   {"id":"c","label_en":"The chart should have used a pie instead.","label_id":"Grafiknya seharusnya memakai pie."},
   {"id":"d","label_en":"The y-axis should be logarithmic.","label_id":"Sumbu y seharusnya logaritmik."}]'::jsonb, 'b'),

('X06', 4, 'Checkpoint 4 · Misleading Charts', 'Cek Poin 4 · Grafik yang Menyesatkan', 2,
 'A stakeholder asks for revenue and customer-satisfaction score on one chart with two y-axes. What is the risk you should raise?',
 'Seorang stakeholder meminta pendapatan dan skor kepuasan pelanggan dalam satu grafik dengan dua sumbu y. Risiko apa yang harus Anda sampaikan?',
 '[{"id":"a","label_en":"The scales can be set so the two lines appear to track each other, implying a correlation that may not exist.","label_id":"Skalanya bisa diatur agar dua garis tampak seiring, menyiratkan korelasi yang mungkin tidak ada."},
   {"id":"b","label_en":"Two y-axes force the engine to redraw the chart twice, which slows a large dashboard down.","label_id":"Dua sumbu y memaksa mesin menggambar ulang grafik dua kali, sehingga dashboard besar melambat."},
   {"id":"c","label_en":"Dual axes only work with bar charts, so a line-and-line combination will not render correctly.","label_id":"Sumbu ganda hanya bekerja dengan bar chart, jadi kombinasi garis-dan-garis tidak akan tampil benar."},
   {"id":"d","label_en":"Satisfaction scores are ordinal and therefore cannot legitimately be plotted over a time axis.","label_id":"Skor kepuasan bersifat ordinal sehingga tidak sah diplot di atas sumbu waktu."}]'::jsonb, 'a'),

-- ══════════════ X07 · Introduction to Power BI ══════════════
('X07', 1, 'Checkpoint 1 · The Workflow', 'Cek Poin 1 · Alur Kerja', 1,
 'Your source CSV has trailing spaces and numbers stored as text. Where in the Power BI workflow should you fix that?',
 'CSV sumber Anda punya spasi berlebih dan angka tersimpan sebagai teks. Di tahap mana dalam alur Power BI hal itu diperbaiki?',
 '[{"id":"a","label_en":"In Power Query, at the Transform step, before modelling.","label_id":"Di Power Query, pada tahap Transform, sebelum pemodelan."},
   {"id":"b","label_en":"In the Report view, by formatting the visual.","label_id":"Di Report view, dengan memformat visual."},
   {"id":"c","label_en":"In the Power BI Service, after publishing.","label_id":"Di Power BI Service, setelah publish."},
   {"id":"d","label_en":"In a DAX measure that cleans the values as it aggregates.","label_id":"Di measure DAX yang membersihkan nilai saat mengagregasi."}]'::jsonb, 'a'),

('X07', 1, 'Checkpoint 1 · The Workflow', 'Cek Poin 1 · Alur Kerja', 2,
 'Which order matches the Power BI workflow?',
 'Urutan mana yang sesuai dengan alur kerja Power BI?',
 '[{"id":"a","label_en":"Get Data → Model → Transform → Publish → Visualize","label_id":"Get Data → Model → Transform → Publish → Visualize"},
   {"id":"b","label_en":"Get Data → Transform → Model → Visualize → Publish","label_id":"Get Data → Transform → Model → Visualize → Publish"},
   {"id":"c","label_en":"Transform → Get Data → Visualize → Model → Publish","label_id":"Transform → Get Data → Visualize → Model → Publish"},
   {"id":"d","label_en":"Get Data → Visualize → Transform → Model → Publish","label_id":"Get Data → Visualize → Transform → Model → Publish"}]'::jsonb, 'b'),

('X07', 2, 'Checkpoint 2 · Relationships', 'Cek Poin 2 · Relasi', 1,
 'Your Region slicer filters the customer table but leaves the revenue card unchanged. What is the most likely cause?',
 'Slicer Region Anda memfilter tabel customer tetapi kartu pendapatan tidak berubah. Apa penyebab paling mungkin?',
 '[{"id":"a","label_en":"The card visual needs to be refreshed manually.","label_id":"Visual kartu perlu di-refresh manual."},
   {"id":"b","label_en":"Slicers only ever filter the table they were created from, so each table needs its own slicer.","label_id":"Slicer hanya memfilter tabel asal pembuatannya, jadi tiap tabel butuh slicer sendiri."},
   {"id":"c","label_en":"The revenue field must be moved into the Legend well.","label_id":"Field pendapatan harus dipindahkan ke well Legend."},
   {"id":"d","label_en":"No relationship links orders[customer_id] to customers[id], so the filter cannot travel.","label_id":"Tidak ada relasi yang menghubungkan orders[customer_id] ke customers[id], sehingga filter tidak bisa merambat."}]'::jsonb, 'd'),

('X07', 2, 'Checkpoint 2 · Relationships', 'Cek Poin 2 · Relasi', 2,
 'A stakeholder clicks the Jakarta bar and every other visual on the page narrows to Jakarta. What is that behaviour called?',
 'Seorang stakeholder mengklik batang Jakarta dan semua visual lain di halaman menyempit ke Jakarta. Apa nama perilaku itu?',
 '[{"id":"a","label_en":"Cross-filtering","label_id":"Cross-filtering"},
   {"id":"b","label_en":"Scheduled refresh","label_id":"Scheduled refresh"},
   {"id":"c","label_en":"Row-level security","label_id":"Row-level security"},
   {"id":"d","label_en":"Drill-through","label_id":"Drill-through"}]'::jsonb, 'a'),

('X07', 3, 'Checkpoint 3 · Measures & DAX', 'Cek Poin 3 · Measure & DAX', 1,
 'Why write Avg Basket as a MEASURE rather than computing it once in Power Query?',
 'Mengapa menulis Avg Basket sebagai MEASURE daripada menghitungnya sekali di Power Query?',
 '[{"id":"a","label_en":"Measures load faster than query columns, since they are computed once when the dataset refreshes.","label_id":"Measure memuat lebih cepat daripada kolom query, karena dihitung sekali saat dataset di-refresh."},
   {"id":"b","label_en":"Power Query cannot perform division, so any ratio must be written as a DAX expression instead.","label_id":"Power Query tidak bisa membagi, jadi rasio apa pun harus ditulis sebagai ekspresi DAX."},
   {"id":"c","label_en":"A measure recalculates under every filter and slicer click, which is what makes the dashboard interactive.","label_id":"Measure dihitung ulang pada setiap filter dan klik slicer, itulah yang membuat dashboard interaktif."},
   {"id":"d","label_en":"A measure is the only thing a card visual accepts, so a KPI can never come from a column.","label_id":"Measure satu-satunya yang diterima visual kartu, jadi KPI tidak pernah bisa berasal dari kolom."}]'::jsonb, 'c'),

('X07', 3, 'Checkpoint 3 · Measures & DAX', 'Cek Poin 3 · Measure & DAX', 2,
 'Which visual is the right choice for a single Total Revenue KPI at the top of the page?',
 'Visual mana yang tepat untuk satu KPI Total Revenue di bagian atas halaman?',
 '[{"id":"a","label_en":"Card","label_id":"Card"},
   {"id":"b","label_en":"Matrix","label_id":"Matrix"},
   {"id":"c","label_en":"Line chart","label_id":"Line chart"},
   {"id":"d","label_en":"Map","label_id":"Map"}]'::jsonb, 'a'),

('X07', 4, 'Checkpoint 4 · Publish & Maintain', 'Cek Poin 4 · Publish & Pemeliharaan', 1,
 'TokoSegar weekly report is published and shared, but three weeks later the numbers are stale. What was missed?',
 'Laporan mingguan TokoSegar sudah dipublish dan dibagikan, tetapi tiga minggu kemudian angkanya usang. Apa yang terlewat?',
 '[{"id":"a","label_en":"The workspace permissions were set too narrowly.","label_id":"Izin workspace disetel terlalu sempit."},
   {"id":"b","label_en":"No scheduled refresh was configured, so the dataset never re-imported.","label_id":"Scheduled refresh belum dikonfigurasi, sehingga dataset tidak pernah diimpor ulang."},
   {"id":"c","label_en":"The report needed to be re-published after every data change.","label_id":"Laporan harus dipublish ulang setiap kali data berubah."},
   {"id":"d","label_en":"Cross-filtering was left switched off.","label_id":"Cross-filtering dibiarkan nonaktif."}]'::jsonb, 'b'),

('X07', 4, 'Checkpoint 4 · Publish & Maintain', 'Cek Poin 4 · Publish & Pemeliharaan', 2,
 'A stakeholder asks you to put all 20 visuals on one page so nothing is hidden. What is the strongest argument against it?',
 'Seorang stakeholder meminta Anda menaruh semua 20 visual di satu halaman agar tidak ada yang tersembunyi. Apa argumen terkuat menolaknya?',
 '[{"id":"a","label_en":"Power BI enforces a hard limit on the number of visuals allowed on a single report page.","label_id":"Power BI menerapkan batas keras jumlah visual yang diizinkan pada satu halaman laporan."},
   {"id":"b","label_en":"Twenty visuals will not fit legibly on a standard laptop screen without scrolling.","label_id":"Dua puluh visual tidak muat terbaca di layar laptop standar tanpa menggulir."},
   {"id":"c","label_en":"A page that answers twenty questions answers none — one page should answer one question.","label_id":"Halaman yang menjawab dua puluh pertanyaan tidak menjawab satu pun — satu halaman sebaiknya menjawab satu pertanyaan."},
   {"id":"d","label_en":"Cross-filtering stops propagating reliably once a page carries more than ten visuals.","label_id":"Cross-filtering berhenti merambat andal begitu satu halaman memuat lebih dari sepuluh visual."}]'::jsonb, 'c'),

-- ══════════════ X08 · Python / Pandas 101 ══════════════
('X08', 1, 'Checkpoint 1 · Structures', 'Cek Poin 1 · Struktur Data', 1,
 'df[''revenue''] returns which structure?',
 'df[''revenue''] mengembalikan struktur apa?',
 '[{"id":"a","label_en":"A DataFrame with one column","label_id":"DataFrame dengan satu kolom"},
   {"id":"b","label_en":"A Series","label_id":"Series"},
   {"id":"c","label_en":"A Python list","label_id":"List Python"},
   {"id":"d","label_en":"A dictionary keyed by row index","label_id":"Dictionary dengan kunci indeks baris"}]'::jsonb, 'b'),

('X08', 1, 'Checkpoint 1 · Structures', 'Cek Poin 1 · Struktur Data', 2,
 'df.info() shows the revenue column as dtype object rather than float64. What does that tell you?',
 'df.info() menampilkan kolom revenue bertipe object, bukan float64. Apa artinya?',
 '[{"id":"a","label_en":"The column holds text, so sums and averages will not behave as expected.","label_id":"Kolom itu berisi teks, sehingga penjumlahan dan rata-rata tidak akan berperilaku seperti yang diharapkan."},
   {"id":"b","label_en":"The column contains Python objects that pandas is unable to display in a summary.","label_id":"Kolom itu berisi objek Python yang tidak bisa ditampilkan pandas dalam ringkasan."},
   {"id":"c","label_en":"object is the normal dtype for currency values.","label_id":"object adalah dtype normal untuk nilai mata uang."},
   {"id":"d","label_en":"The column has too many missing values to type.","label_id":"Kolom itu punya terlalu banyak nilai kosong untuk ditentukan tipenya."}]'::jsonb, 'a'),

('X08', 2, 'Checkpoint 2 · Filtering', 'Cek Poin 2 · Filter', 1,
 'You need rows where revenue exceeds 1,000,000 AND region is Jakarta. Which is correct pandas?',
 'Anda butuh baris dengan revenue di atas 1.000.000 DAN region Jakarta. Mana pandas yang benar?',
 '[{"id":"a","label_en":"df[(df.revenue > 1000000) & (df.region == ''Jakarta'')]","label_id":"df[(df.revenue > 1000000) & (df.region == ''Jakarta'')]"},
   {"id":"b","label_en":"df[df.revenue > 1000000 and df.region == ''Jakarta'']","label_id":"df[df.revenue > 1000000 and df.region == ''Jakarta'']"},
   {"id":"c","label_en":"df[df.revenue > 1000000, df.region == ''Jakarta'']","label_id":"df[df.revenue > 1000000, df.region == ''Jakarta'']"},
   {"id":"d","label_en":"df.filter(revenue > 1000000, region = ''Jakarta'')","label_id":"df.filter(revenue > 1000000, region = ''Jakarta'')"}]'::jsonb, 'a'),

('X08', 2, 'Checkpoint 2 · Filtering', 'Cek Poin 2 · Filter', 2,
 'Which call gives a quick statistical summary of every numeric column at once?',
 'Panggilan mana yang memberi ringkasan statistik cepat untuk semua kolom numerik sekaligus?',
 '[{"id":"a","label_en":"df.head(20)","label_id":"df.head(20)"},
   {"id":"b","label_en":"df.info()","label_id":"df.info()"},
   {"id":"c","label_en":"df.describe()","label_id":"df.describe()"},
   {"id":"d","label_en":"df.shape","label_id":"df.shape"}]'::jsonb, 'c'),

('X08', 3, 'Checkpoint 3 · Group & Aggregate', 'Cek Poin 3 · Group & Agregasi', 1,
 'Which line produces total revenue per category?',
 'Baris mana yang menghasilkan total pendapatan per kategori?',
 '[{"id":"a","label_en":"df.groupby(''category'').sum()[''revenue''].mean()","label_id":"df.groupby(''category'').sum()[''revenue''].mean()"},
   {"id":"b","label_en":"df[''revenue''].sum().groupby(''category'')","label_id":"df[''revenue''].sum().groupby(''category'')"},
   {"id":"c","label_en":"df.groupby(''revenue'')[''category''].sum()","label_id":"df.groupby(''revenue'')[''category''].sum()"},
   {"id":"d","label_en":"df.groupby(''category'')[''revenue''].sum()","label_id":"df.groupby(''category'')[''revenue''].sum()"}]'::jsonb, 'd'),

('X08', 3, 'Checkpoint 3 · Group & Aggregate', 'Cek Poin 3 · Group & Agregasi', 2,
 'You filter a DataFrame, assign to a new name, edit it, and pandas raises SettingWithCopyWarning. What is the fix?',
 'Anda memfilter DataFrame, menyimpannya ke nama baru, mengeditnya, dan pandas memunculkan SettingWithCopyWarning. Apa perbaikannya?',
 '[{"id":"a","label_en":"Suppress it with pd.options.mode.chained_assignment = None; the warning is purely cosmetic.","label_id":"Matikan dengan pd.options.mode.chained_assignment = None; peringatannya murni kosmetik."},
   {"id":"b","label_en":"Take an explicit copy with .copy() so you are editing a real DataFrame, not a view of the original.","label_id":"Ambil salinan eksplisit dengan .copy() agar Anda mengedit DataFrame sungguhan, bukan tampilan dari aslinya."},
   {"id":"c","label_en":"Convert the DataFrame to a list of dictionaries first, then rebuild it after the edit.","label_id":"Konversi DataFrame ke list of dictionaries dulu, lalu bangun ulang setelah pengeditan."},
   {"id":"d","label_en":"Re-read the CSV after every filter so each step starts from a clean, unmodified frame.","label_id":"Baca ulang CSV setelah setiap filter agar tiap langkah mulai dari frame bersih yang belum diubah."}]'::jsonb, 'b'),

('X08', 4, 'Checkpoint 4 · Automating Output', 'Cek Poin 4 · Otomatisasi Output', 1,
 'Your exported report.xlsx has an unwanted first column of 0, 1, 2, 3. What did you forget?',
 'File report.xlsx hasil ekspor Anda punya kolom pertama tak diinginkan berisi 0, 1, 2, 3. Apa yang terlupa?',
 '[{"id":"a","label_en":"index=False on to_excel","label_id":"index=False pada to_excel"},
   {"id":"b","label_en":"reset_index() before exporting","label_id":"reset_index() sebelum mengekspor"},
   {"id":"c","label_en":"Installing openpyxl","label_id":"Memasang openpyxl"},
   {"id":"d","label_en":"Setting the sheet name","label_id":"Menetapkan nama sheet"}]'::jsonb, 'a'),

('X08', 4, 'Checkpoint 4 · Automating Output', 'Cek Poin 4 · Otomatisasi Output', 2,
 'What is the real payoff of rebuilding a 2-hour monthly Excel report as a 15-line pandas script?',
 'Apa keuntungan nyata membangun ulang laporan Excel bulanan 2 jam menjadi skrip pandas 15 baris?',
 '[{"id":"a","label_en":"The exported file is smaller than the manually produced version, so it is easier to email.","label_id":"File hasil ekspor lebih kecil daripada versi manual, sehingga lebih mudah dikirim lewat email."},
   {"id":"b","label_en":"Python charts look more professional than Excel charts, which improves how the report lands.","label_id":"Grafik Python terlihat lebih profesional daripada grafik Excel, sehingga laporan lebih berkesan."},
   {"id":"c","label_en":"pandas calculates large sums more accurately than Excel, which drifts on floating point.","label_id":"pandas menghitung penjumlahan besar lebih akurat daripada Excel, yang melenceng pada floating point."},
   {"id":"d","label_en":"It is written once and re-run every month with zero manual steps, and it makes the same mistake never twice.","label_id":"Ditulis sekali dan dijalankan ulang setiap bulan tanpa langkah manual, dan tidak mengulang kesalahan yang sama."}]'::jsonb, 'd')

),
target as (
  select s.id as session_id, s.session_number
    from public.sessions s
    join public.phases ph  on ph.id = s.phase_id
    join public.programs p on p.id = ph.program_id
   where p.slug = 'data-analyst-fast-track-2026'
),
new_cps as (
  insert into public.session_checkpoints (session_id, order_num, title_en, title_id)
  select distinct t.session_id, seed.cp_num, seed.cp_title_en, seed.cp_title_id
    from seed join target t on t.session_number = seed.session_number
  returning id, session_id, order_num
),
new_qs as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_en, prompt_id, options)
  select c.id, seed.q_num, seed.prompt_en, seed.prompt_id, seed.options
    from seed
    join target  t on t.session_number = seed.session_number
    join new_cps c on c.session_id = t.session_id and c.order_num = seed.cp_num
  returning id, checkpoint_id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select q.id, seed.correct
  from seed
  join target  t on t.session_number = seed.session_number
  join new_cps c on c.session_id = t.session_id and c.order_num = seed.cp_num
  join new_qs  q on q.checkpoint_id = c.id and q.order_num = seed.q_num;
