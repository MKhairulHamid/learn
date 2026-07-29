-- ============================================================
-- 052: Rebuild live-checkpoint content for X01–X04.
--
--  The seeded set (036) tested recall of definitions: "the median
--  is…", "TRIM removes…". Distractors came from the wrong category
--  entirely ("a data type", "a type of chart"), 10 of 14 keys were
--  option b, and two questions were the same question inverted. A
--  learner who never attended could pass most of them, so they
--  measured nothing about the teaching.
--
--  These replace that with APPLICATION: read a small table, a query,
--  or a scenario and decide. Every distractor is a misconception
--  learners actually hold — WHERE on an aggregate, membership = A AND
--  membership = B, mean on skewed data, INNER JOIN dropping unmatched
--  rows. Keys are spread across a/b/c/d.
--
--  Shape: 4 checkpoints per session × 2 questions, so a mentor can run
--  one after each section of the lesson.
-- ============================================================

delete from public.session_checkpoints cp
 using public.sessions s
 where cp.session_id = s.id
   and s.session_number in ('X01','X02','X03','X04');

with seed (session_number, cp_num, cp_title_en, cp_title_id,
           q_num, prompt_en, prompt_id, options, correct) as (values

-- ══════════════ X01 · Business Acumen & Basic Statistics ══════════════
('X01', 1, 'Checkpoint 1 · Business Acumen', 'Cek Poin 1 · Business Acumen', 1,
 'TokoSegar online sales fell 8% in March. Which version of the finding shows business acumen?',
 'Penjualan online TokoSegar turun 8% di bulan Maret. Versi temuan mana yang menunjukkan business acumen?',
 '[{"id":"a","label_en":"Online sales fell 8% in March, down from 4% growth in February — the sharpest month-on-month swing this year.","label_id":"Penjualan online turun 8% di Maret, dari pertumbuhan 4% di Februari — ayunan bulanan paling tajam tahun ini."},
   {"id":"b","label_en":"Online sales fell 8% in March; the full category and region breakdown is attached for the team to review.","label_id":"Penjualan online turun 8% di Maret; rincian lengkap per kategori dan wilayah terlampir untuk ditinjau tim."},
   {"id":"c","label_en":"Online sales fell 8% in March, which sits outside our normal monthly range and warrants a follow-up.","label_id":"Penjualan online turun 8% di Maret, di luar rentang bulanan normal kita dan perlu ditindaklanjuti."},
   {"id":"d","label_en":"Online sales fell 8% because delivery delays pushed weekly families back to in-store — and those families are 3x more valuable.","label_id":"Penjualan online turun 8% karena keterlambatan pengiriman mendorong keluarga langganan mingguan kembali belanja di toko — dan keluarga itu 3x lebih bernilai."}]'::jsonb, 'd'),

('X01', 1, 'Checkpoint 1 · Business Acumen', 'Cek Poin 1 · Business Acumen', 2,
 'Every number you report should connect to money, customers, or risk. Which of these four real metrics fails that test?',
 'Setiap angka yang Anda laporkan harus terhubung ke uang, pelanggan, atau risiko. Manakah dari empat metrik nyata ini yang gagal memenuhi syarat itu?',
 '[{"id":"a","label_en":"Total page views on the promo page this month","label_id":"Total page views halaman promo bulan ini"},
   {"id":"b","label_en":"Average order fulfilment time in minutes","label_id":"Rata-rata waktu pemenuhan pesanan dalam menit"},
   {"id":"c","label_en":"Customer acquisition cost per new member","label_id":"Biaya akuisisi pelanggan per anggota baru"},
   {"id":"d","label_en":"On-time delivery percentage by region","label_id":"Persentase pengiriman tepat waktu per wilayah"}]'::jsonb, 'a'),

('X01', 2, 'Checkpoint 2 · Process & Indicators', 'Cek Poin 2 · Proses & Indikator', 1,
 'TokoSegar revenue looked fine in week 1, but average fulfilment time crept from 20 to 34 minutes. Why did watching that second number pay off?',
 'Pendapatan TokoSegar terlihat baik di minggu 1, tetapi rata-rata waktu pemenuhan merangkak dari 20 ke 34 menit. Mengapa memantau angka kedua itu menguntungkan?',
 '[{"id":"a","label_en":"It is a lagging indicator, so it confirmed the revenue drop had already happened.","label_id":"Itu indikator lagging, jadi mengonfirmasi penurunan pendapatan yang sudah terjadi."},
   {"id":"b","label_en":"It moves before the outcome, so the team added a packer while there was still time to act.","label_id":"Ia bergerak sebelum hasilnya muncul, sehingga tim menambah packer selagi masih ada waktu bertindak."},
   {"id":"c","label_en":"It is easier and cheaper to measure than revenue.","label_id":"Ia lebih mudah dan murah diukur daripada pendapatan."},
   {"id":"d","label_en":"It proved the week-1 revenue figure had been calculated wrongly.","label_id":"Ia membuktikan angka pendapatan minggu 1 salah hitung."}]'::jsonb, 'b'),

('X01', 2, 'Checkpoint 2 · Process & Indicators', 'Cek Poin 2 · Proses & Indikator', 2,
 'In the input to process to output map of an online order, pick time and packer_id are created at which stage — and what do they measure?',
 'Dalam peta input ke proses ke output sebuah pesanan online, pick time dan packer_id tercipta di tahap mana — dan mengukur apa?',
 '[{"id":"a","label_en":"Input — orders per day","label_id":"Input — pesanan per hari"},
   {"id":"b","label_en":"Output — on-time delivery percentage","label_id":"Output — persentase pengiriman tepat waktu"},
   {"id":"c","label_en":"Process — average fulfilment time","label_id":"Proses — rata-rata waktu pemenuhan"},
   {"id":"d","label_en":"Input — average fulfilment time","label_id":"Input — rata-rata waktu pemenuhan"}]'::jsonb, 'c'),

('X01', 3, 'Checkpoint 3 · Sharpening the Question', 'Cek Poin 3 · Menajamkan Pertanyaan', 1,
 'A stakeholder says "sales are bad". Which reply is a problem statement you can actually analyse?',
 'Seorang stakeholder berkata "penjualan buruk". Balasan mana yang merupakan problem statement yang benar-benar bisa dianalisis?',
 '[{"id":"a","label_en":"In-store basket size fell 12% month-on-month in the Jakarta region in March 2026 — which categories drove the drop?","label_id":"Ukuran keranjang belanja di toko turun 12% dibanding bulan sebelumnya di wilayah Jakarta pada Maret 2026 — kategori mana yang mendorong penurunan itu?"},
   {"id":"b","label_en":"Sales have been declining for a while across several regions and we would like to understand the reasons behind this ongoing trend.","label_id":"Penjualan sudah menurun beberapa waktu di beberapa wilayah dan kami ingin memahami alasan di balik tren yang berlanjut ini."},
   {"id":"c","label_en":"Why are our customers unhappy with the shopping experience lately?","label_id":"Mengapa pelanggan kita tidak puas dengan pengalaman belanja belakangan ini?"},
   {"id":"d","label_en":"Let us pull the sales data for this year and see what patterns stand out.","label_id":"Mari kita tarik data penjualan tahun ini dan lihat pola apa yang menonjol."}]'::jsonb, 'a'),

('X01', 3, 'Checkpoint 3 · Sharpening the Question', 'Cek Poin 3 · Menajamkan Pertanyaan', 2,
 'The 5 Whys ran: basket size fell → fewer items per order → produce not added → shelves empty by afternoon → restock happens once → the roster has no midday restock. What would stopping at "fewer items per order" have cost you?',
 'Rantai 5 Whys berjalan: keranjang turun → item per pesanan lebih sedikit → produce tidak diambil → rak kosong sore hari → restock hanya sekali → roster tidak punya restock siang. Apa kerugiannya jika berhenti di "item per pesanan lebih sedikit"?',
 '[{"id":"a","label_en":"You would conclude the data was wrong and spend the week re-pulling and re-checking the extract.","label_id":"Anda akan menyimpulkan datanya salah dan menghabiskan seminggu menarik dan memeriksa ulang ekstraknya."},
   {"id":"b","label_en":"You would fix the staff roster immediately, before confirming that restocking was the real cause.","label_id":"Anda akan langsung memperbaiki roster staf, sebelum memastikan restock benar-benar penyebabnya."},
   {"id":"c","label_en":"You would launch a discount to lift items per order, while the shelves stay empty every afternoon.","label_id":"Anda akan meluncurkan diskon untuk menaikkan item per pesanan, sementara raknya tetap kosong setiap sore."},
   {"id":"d","label_en":"You would need a sixth and seventh why, since five is only ever a rough rule of thumb.","label_id":"Anda perlu why keenam dan ketujuh, karena lima hanyalah patokan kasar."}]'::jsonb, 'c'),

('X01', 4, 'Checkpoint 4 · Descriptive Statistics', 'Cek Poin 4 · Statistik Deskriptif', 1,
 'One afternoon of TokoSegar baskets, in thousand Rupiah: 45, 52, 48, 51, 47, 300, 49. The mean is 84.6 and the median is 49. What do you report to the stakeholder?',
 'Keranjang TokoSegar satu sore, dalam ribu Rupiah: 45, 52, 48, 51, 47, 300, 49. Mean-nya 84,6 dan median-nya 49. Apa yang Anda laporkan ke stakeholder?',
 '[{"id":"a","label_en":"The mean, 84.6 — it is the only measure that uses every value.","label_id":"Mean, 84,6 — satu-satunya ukuran yang memakai semua nilai."},
   {"id":"b","label_en":"The median, 49, and flag the 300 basket separately — the mean describes no actual customer.","label_id":"Median, 49, dan tandai keranjang 300 secara terpisah — mean tidak menggambarkan pelanggan mana pun."},
   {"id":"c","label_en":"The range, 255, because it captures the full spread.","label_id":"Range, 255, karena menangkap sebaran penuh."},
   {"id":"d","label_en":"Report both the mean and the median without comment, and let the stakeholder decide which one to quote.","label_id":"Laporkan mean dan median tanpa komentar, dan biarkan stakeholder memutuskan mana yang dikutip."}]'::jsonb, 'b'),

('X01', 4, 'Checkpoint 4 · Descriptive Statistics', 'Cek Poin 4 · Statistik Deskriptif', 2,
 'Store A and Store B both average Rp 50k per basket. Store A standard deviation is 5; Store B is 40. What does that tell you?',
 'Toko A dan Toko B sama-sama rata-rata Rp 50rb per keranjang. Standar deviasi Toko A 5; Toko B 40. Apa artinya?',
 '[{"id":"a","label_en":"Store B has a data-entry problem, since baskets should not vary that much within one store.","label_id":"Toko B punya masalah input data, karena keranjang tidak seharusnya sebervariasi itu dalam satu toko."},
   {"id":"b","label_en":"Store B sells more in total than Store A, because a wider spread implies a higher volume.","label_id":"Toko B menjual lebih banyak daripada Toko A, karena sebaran lebih lebar menyiratkan volume lebih tinggi."},
   {"id":"c","label_en":"Store A is the more profitable of the two, since consistent baskets mean predictable margin.","label_id":"Toko A lebih menguntungkan, karena keranjang yang konsisten berarti margin yang bisa diprediksi."},
   {"id":"d","label_en":"Store B mixes very large and very small baskets — a segmentation opportunity the average hides.","label_id":"Toko B mencampur keranjang sangat besar dan sangat kecil — peluang segmentasi yang disembunyikan rata-rata."}]'::jsonb, 'd'),

-- ══════════════ X02 · Cleaning and Shaping Data ══════════════
('X02', 1, 'Checkpoint 1 · Duplicates & Blanks', 'Cek Poin 1 · Duplikat & Sel Kosong', 1,
 'The POS export has customer C001 twice with an identical phone, and C002 with a blank phone. What must you decide BEFORE clicking Remove Duplicates?',
 'Ekspor POS memuat pelanggan C001 dua kali dengan nomor telepon identik, dan C002 dengan telepon kosong. Apa yang harus Anda putuskan SEBELUM menekan Remove Duplicates?',
 '[{"id":"a","label_en":"Whether to sort by customer_id first, so repeated records sit together and are easier to eyeball.","label_id":"Apakah perlu diurutkan berdasarkan customer_id dulu, agar catatan berulang berdekatan dan mudah dilihat."},
   {"id":"b","label_en":"Which columns define a duplicate — and whether the repeat is a data error or a customer who genuinely ordered twice.","label_id":"Kolom mana yang mendefinisikan duplikat — dan apakah pengulangan itu error data atau pelanggan yang memang memesan dua kali."},
   {"id":"c","label_en":"Whether the blank phone rows should be deleted in the same pass, to avoid going through the file twice.","label_id":"Apakah baris telepon kosong dihapus di proses yang sama, agar tidak perlu menyisir file dua kali."},
   {"id":"d","label_en":"Whether the phone column should be formatted as text first, so leading zeros are not silently stripped.","label_id":"Apakah kolom telepon perlu diformat sebagai teks dulu, agar angka nol di depan tidak hilang diam-diam."}]'::jsonb, 'b'),

('X02', 1, 'Checkpoint 1 · Duplicates & Blanks', 'Cek Poin 1 · Duplikat & Sel Kosong', 2,
 'You need the number of empty cells in B2:B100 without changing anything. Which formula gives it?',
 'Anda butuh jumlah sel kosong di B2:B100 tanpa mengubah apa pun. Rumus mana yang memberikannya?',
 '[{"id":"a","label_en":"=COUNTA(B2:B100)","label_id":"=COUNTA(B2:B100)"},
   {"id":"b","label_en":"=COUNTIF(B2:B100, 0)","label_id":"=COUNTIF(B2:B100, 0)"},
   {"id":"c","label_en":"=COUNTBLANK(B2:B100)","label_id":"=COUNTBLANK(B2:B100)"},
   {"id":"d","label_en":"=SUM(B2:B100)","label_id":"=SUM(B2:B100)"}]'::jsonb, 'c'),

('X02', 2, 'Checkpoint 2 · Errors & Wrappers', 'Cek Poin 2 · Error & Wrapper', 1,
 'Your lookup should show "no match" when a customer is not found, but you still want genuine #REF! and #VALUE! bugs to stay visible. Which wrapper?',
 'Lookup Anda harus menampilkan "no match" saat pelanggan tidak ditemukan, tetapi bug #REF! dan #VALUE! yang asli harus tetap terlihat. Wrapper mana?',
 '[{"id":"a","label_en":"=IFERROR(VLOOKUP(...), \"no match\")","label_id":"=IFERROR(VLOOKUP(...), \"no match\")"},
   {"id":"b","label_en":"=IFERROR(VLOOKUP(...), 0)","label_id":"=IFERROR(VLOOKUP(...), 0)"},
   {"id":"c","label_en":"=IF(ISERROR(VLOOKUP(...)), \"no match\", VLOOKUP(...))","label_id":"=IF(ISERROR(VLOOKUP(...)), \"no match\", VLOOKUP(...))"},
   {"id":"d","label_en":"=IFNA(VLOOKUP(...), \"no match\")","label_id":"=IFNA(VLOOKUP(...), \"no match\")"}]'::jsonb, 'd'),

('X02', 2, 'Checkpoint 2 · Errors & Wrappers', 'Cek Poin 2 · Error & Wrapper', 2,
 'A supplier sent 5,000 rows. The price column displays values like 12.500, but SUM over it returns 0. What is happening?',
 'Seorang pemasok mengirim 5.000 baris. Kolom harga menampilkan nilai seperti 12.500, tetapi SUM di atasnya menghasilkan 0. Apa yang terjadi?',
 '[{"id":"a","label_en":"The values are text, not numbers, so SUM skips them entirely.","label_id":"Nilainya teks, bukan angka, sehingga SUM melewatkannya sepenuhnya."},
   {"id":"b","label_en":"The SUM range does not cover the whole column.","label_id":"Rentang SUM tidak mencakup seluruh kolom."},
   {"id":"c","label_en":"SUM cannot handle values with decimal separators.","label_id":"SUM tidak bisa menangani nilai dengan pemisah desimal."},
   {"id":"d","label_en":"The cells contain hidden #DIV/0! errors.","label_id":"Sel-selnya mengandung error #DIV/0! tersembunyi."}]'::jsonb, 'a'),

('X02', 3, 'Checkpoint 3 · Text Cleanup', 'Cek Poin 3 · Pembersihan Teks', 1,
 'You copied names from a web page. TRIM runs without error but the leading spaces are still there. Why — and what fixes it?',
 'Anda menyalin nama dari halaman web. TRIM berjalan tanpa error tetapi spasi di depan masih ada. Mengapa — dan apa perbaikannya?',
 '[{"id":"a","label_en":"They are non-breaking spaces (CHAR 160), which TRIM does not touch — remove them with SUBSTITUTE(A2,CHAR(160),\"\").","label_id":"Itu spasi non-breaking (CHAR 160) yang tidak disentuh TRIM — hapus dengan SUBSTITUTE(A2,CHAR(160),\"\")."},
   {"id":"b","label_en":"The cells are text-formatted rather than general, so convert them with VALUE before any text function works.","label_id":"Selnya berformat teks alih-alih general, jadi konversi dengan VALUE sebelum fungsi teks apa pun bekerja."},
   {"id":"c","label_en":"TRIM only removes spaces between words and never at the ends, so leading spaces always survive it.","label_id":"TRIM hanya menghapus spasi antar kata dan tidak pernah di ujung, jadi spasi depan selalu bertahan."},
   {"id":"d","label_en":"You must run CLEAN before PROPER, otherwise TRIM silently ignores anything a browser inserted.","label_id":"Anda harus menjalankan CLEAN sebelum PROPER, jika tidak TRIM diam-diam mengabaikan sisipan dari browser."}]'::jsonb, 'a'),

('X02', 3, 'Checkpoint 3 · Text Cleanup', 'Cek Poin 3 · Pembersihan Teks', 2,
 'From the invoice code INV-2024-0007 you need just 0007. Which formula returns it?',
 'Dari kode faktur INV-2024-0007 Anda hanya butuh 0007. Rumus mana yang menghasilkannya?',
 '[{"id":"a","label_en":"=LEFT(A2,4)","label_id":"=LEFT(A2,4)"},
   {"id":"b","label_en":"=MID(A2,5,4)","label_id":"=MID(A2,5,4)"},
   {"id":"c","label_en":"=RIGHT(A2,4)","label_id":"=RIGHT(A2,4)"},
   {"id":"d","label_en":"=VALUE(A2)","label_id":"=VALUE(A2)"}]'::jsonb, 'c'),

('X02', 4, 'Checkpoint 4 · The Cleaning Workflow', 'Cek Poin 4 · Alur Kerja Pembersihan', 1,
 'Which sequence follows the repeatable cleaning workflow?',
 'Urutan mana yang mengikuti alur kerja pembersihan yang berulang?',
 '[{"id":"a","label_en":"Standardise text → remove duplicates → copy the raw data → fix types → spot-check","label_id":"Standardisasi teks → hapus duplikat → salin data mentah → perbaiki tipe → periksa ulang"},
   {"id":"b","label_en":"Remove duplicates → copy the raw data → standardise text → handle blanks → spot-check","label_id":"Hapus duplikat → salin data mentah → standardisasi teks → tangani sel kosong → periksa ulang"},
   {"id":"c","label_en":"Copy the raw data → remove duplicates → standardise text → fix types → handle blanks → spot-check","label_id":"Salin data mentah → hapus duplikat → standardisasi teks → perbaiki tipe → tangani sel kosong → periksa ulang"},
   {"id":"d","label_en":"Copy the raw data → handle blanks → spot-check → remove duplicates → fix types","label_id":"Salin data mentah → tangani sel kosong → periksa ulang → hapus duplikat → perbaiki tipe"}]'::jsonb, 'c'),

('X02', 4, 'Checkpoint 4 · The Cleaning Workflow', 'Cek Poin 4 · Alur Kerja Pembersihan', 2,
 'Why is =IFERROR(a/b, 0) risky on a revenue calculation?',
 'Mengapa =IFERROR(a/b, 0) berisiko pada perhitungan pendapatan?',
 '[{"id":"a","label_en":"IFERROR only works on division, so other formulas break.","label_id":"IFERROR hanya bekerja pada pembagian, jadi rumus lain rusak."},
   {"id":"b","label_en":"It recalculates more slowly than IFNA on large sheets.","label_id":"Ia menghitung ulang lebih lambat daripada IFNA di sheet besar."},
   {"id":"c","label_en":"IFERROR cannot be nested inside another function.","label_id":"IFERROR tidak bisa disarangkan di dalam fungsi lain."},
   {"id":"d","label_en":"A genuine bug becomes a plausible-looking 0 that nobody investigates.","label_id":"Bug yang sesungguhnya berubah jadi angka 0 yang tampak masuk akal dan tak diselidiki siapa pun."}]'::jsonb, 'd'),

-- ══════════════ X03 · Pivot Tables for Insight ══════════════
('X03', 1, 'Checkpoint 1 · Pivot Anatomy', 'Cek Poin 1 · Anatomi Pivot', 1,
 'You want total revenue per category, broken out by month across the top. Which placement is right?',
 'Anda ingin total pendapatan per kategori, dipecah per bulan di bagian atas. Penempatan mana yang benar?',
 '[{"id":"a","label_en":"category → Values, month → Rows, revenue → Columns","label_id":"category → Values, month → Rows, revenue → Columns"},
   {"id":"b","label_en":"category → Rows, month → Columns, revenue → Values","label_id":"category → Rows, month → Columns, revenue → Values"},
   {"id":"c","label_en":"category → Filters, month → Rows, revenue → Values","label_id":"category → Filters, month → Rows, revenue → Values"},
   {"id":"d","label_en":"category → Columns, month → Values, revenue → Rows","label_id":"category → Columns, month → Values, revenue → Rows"}]'::jsonb, 'b'),

('X03', 1, 'Checkpoint 1 · Pivot Anatomy', 'Cek Poin 1 · Anatomi Pivot', 2,
 'The raw log has four rows: Produce/Jakarta/120, Dairy/Jakarta/80, Produce/Bandung/60, Produce/Jakarta/140. With category in Rows and revenue in Values, what does the Produce row show?',
 'Log mentah punya empat baris: Produce/Jakarta/120, Dairy/Jakarta/80, Produce/Bandung/60, Produce/Jakarta/140. Dengan category di Rows dan revenue di Values, berapa yang ditampilkan baris Produce?',
 '[{"id":"a","label_en":"120","label_id":"120"},
   {"id":"b","label_en":"260","label_id":"260"},
   {"id":"c","label_en":"400","label_id":"400"},
   {"id":"d","label_en":"320","label_id":"320"}]'::jsonb, 'd'),

('X03', 2, 'Checkpoint 2 · Aggregation', 'Cek Poin 2 · Agregasi', 1,
 'The same pivot shows total revenue per category. You now need the NUMBER OF TRANSACTIONS per category instead. What changes?',
 'Pivot yang sama menampilkan total pendapatan per kategori. Sekarang Anda butuh JUMLAH TRANSAKSI per kategori. Apa yang berubah?',
 '[{"id":"a","label_en":"Change the value field aggregation from Sum to Count.","label_id":"Ubah agregasi value field dari Sum menjadi Count."},
   {"id":"b","label_en":"Drag category into the Filters zone.","label_id":"Seret category ke zona Filters."},
   {"id":"c","label_en":"Apply Show Values As → % of Grand Total.","label_id":"Terapkan Show Values As → % of Grand Total."},
   {"id":"d","label_en":"Add a calculated field that divides revenue by price.","label_id":"Tambahkan calculated field yang membagi revenue dengan price."}]'::jsonb, 'a'),

('X03', 2, 'Checkpoint 2 · Aggregation', 'Cek Poin 2 · Agregasi', 2,
 'With month in Columns, you set Show Values As to "% of Column Total". Each cell now answers what?',
 'Dengan month di Columns, Anda mengatur Show Values As ke "% of Column Total". Setiap sel kini menjawab apa?',
 '[{"id":"a","label_en":"Each category share within its own month.","label_id":"Porsi setiap kategori di dalam bulannya sendiri."},
   {"id":"b","label_en":"Each category share of the entire table.","label_id":"Porsi setiap kategori terhadap seluruh tabel."},
   {"id":"c","label_en":"Cumulative revenue building up across the months.","label_id":"Pendapatan kumulatif yang menumpuk sepanjang bulan."},
   {"id":"d","label_en":"The change versus the previous month.","label_id":"Perubahan dibanding bulan sebelumnya."}]'::jsonb, 'a'),

('X03', 3, 'Checkpoint 3 · Grouping & Refresh', 'Cek Poin 3 · Grouping & Refresh', 1,
 'Right-click → Group on your date rows is greyed out or fails. What is the most likely cause?',
 'Klik kanan → Group pada baris tanggal Anda tidak aktif atau gagal. Apa penyebab paling mungkin?',
 '[{"id":"a","label_en":"The pivot simply needs a Refresh first.","label_id":"Pivot hanya perlu di-Refresh dulu."},
   {"id":"b","label_en":"The dates are stored as text, so convert them with DATEVALUE first.","label_id":"Tanggalnya tersimpan sebagai teks, jadi konversi dulu dengan DATEVALUE."},
   {"id":"c","label_en":"Grouping only works on numeric fields, so date columns must first be converted into month numbers.","label_id":"Grouping hanya bekerja pada field numerik, jadi kolom tanggal harus diubah dulu menjadi angka bulan."},
   {"id":"d","label_en":"You must add a Slicer before grouping is enabled.","label_id":"Anda harus menambahkan Slicer sebelum grouping aktif."}]'::jsonb, 'b'),

('X03', 3, 'Checkpoint 3 · Grouping & Refresh', 'Cek Poin 3 · Grouping & Refresh', 2,
 'You added 200 new rows to the source sheet and clicked Refresh, but the pivot totals did not change. Why?',
 'Anda menambahkan 200 baris baru ke sheet sumber dan menekan Refresh, tetapi total pivot tidak berubah. Mengapa?',
 '[{"id":"a","label_en":"The pivot cache is corrupt and the pivot must be rebuilt.","label_id":"Cache pivot rusak dan pivot harus dibangun ulang."},
   {"id":"b","label_en":"Refresh updates existing values but never picks up new rows.","label_id":"Refresh memperbarui nilai yang ada tetapi tidak pernah mengambil baris baru."},
   {"id":"c","label_en":"The source is a fixed range rather than a Table, so it never expanded to include them.","label_id":"Sumbernya rentang tetap, bukan Table, sehingga tidak pernah meluas mencakup baris itu."},
   {"id":"d","label_en":"New rows are ignored until the workbook is closed and reopened, which rebuilds the pivot cache from scratch.","label_id":"Baris baru diabaikan sampai workbook ditutup dan dibuka lagi, yang membangun ulang cache pivot dari awal."}]'::jsonb, 'c'),

('X03', 4, 'Checkpoint 4 · Pivot vs Formula', 'Cek Poin 4 · Pivot vs Rumus', 1,
 'Which task is better served by a formula than by a pivot table?',
 'Tugas mana yang lebih cocok dikerjakan dengan rumus daripada pivot table?',
 '[{"id":"a","label_en":"Subtotalling revenue by region and category","label_id":"Menjumlahkan subtotal pendapatan per wilayah dan kategori"},
   {"id":"b","label_en":"Exploring the same data several different ways before deciding what the story is","label_id":"Menjelajahi data yang sama dengan beberapa cara sebelum memutuskan apa ceritanya"},
   {"id":"c","label_en":"One specific number that feeds into another calculation on the sheet","label_id":"Satu angka spesifik yang menjadi input perhitungan lain di sheet"},
   {"id":"d","label_en":"Cross-tabbing category against month","label_id":"Menyilangkan kategori terhadap bulan"}]'::jsonb, 'c'),

('X03', 4, 'Checkpoint 4 · Pivot vs Formula', 'Cek Poin 4 · Pivot vs Rumus', 2,
 'You need profit = revenue − cost to appear as a field inside the pivot itself. What do you use?',
 'Anda butuh profit = revenue − cost muncul sebagai field di dalam pivot itu sendiri. Apa yang Anda gunakan?',
 '[{"id":"a","label_en":"Show Values As → Difference From","label_id":"Show Values As → Difference From"},
   {"id":"b","label_en":"A Slicer on the cost field","label_id":"Slicer pada field cost"},
   {"id":"c","label_en":"Group the revenue and cost fields together","label_id":"Group field revenue dan cost bersama-sama"},
   {"id":"d","label_en":"A Calculated Field defined inside the pivot","label_id":"Calculated Field yang didefinisikan di dalam pivot"}]'::jsonb, 'd'),

-- ══════════════ X04 · Data Collection with SQL ══════════════
('X04', 1, 'Checkpoint 1 · Schema & Keys', 'Cek Poin 1 · Skema & Kunci', 1,
 'SELECT name, category FROM products fails. Why?',
 'SELECT name, category FROM products gagal. Mengapa?',
 '[{"id":"a","label_en":"category is a reserved word and must be quoted.","label_id":"category adalah kata kunci dan harus diberi tanda kutip."},
   {"id":"b","label_en":"products stores only category_id — the name lives in categories and needs a JOIN.","label_id":"products hanya menyimpan category_id — namanya ada di tabel categories dan butuh JOIN."},
   {"id":"c","label_en":"Selecting two columns requires a GROUP BY.","label_id":"Memilih dua kolom membutuhkan GROUP BY."},
   {"id":"d","label_en":"category must be aggregated before it can appear in a SELECT list alongside other columns.","label_id":"category harus diagregasi sebelum bisa muncul di daftar SELECT bersama kolom lain."}]'::jsonb, 'b'),

('X04', 1, 'Checkpoint 1 · Schema & Keys', 'Cek Poin 1 · Skema & Kunci', 2,
 'To compute revenue per category for COMPLETED orders only, which set of tables must the query touch?',
 'Untuk menghitung pendapatan per kategori hanya untuk pesanan COMPLETED, kumpulan tabel mana yang harus disentuh query?',
 '[{"id":"a","label_en":"order_items + products","label_id":"order_items + products"},
   {"id":"b","label_en":"order_items + products + categories only","label_id":"hanya order_items + products + categories"},
   {"id":"c","label_en":"order_items + products + categories + orders","label_id":"order_items + products + categories + orders"},
   {"id":"d","label_en":"products + categories + customers","label_id":"products + categories + customers"}]'::jsonb, 'c'),

('X04', 2, 'Checkpoint 2 · Filtering Rows', 'Cek Poin 2 · Memfilter Baris', 1,
 'You want customers who are premium OR vip. Which WHERE clause actually returns them?',
 'Anda ingin pelanggan premium ATAU vip. Klausa WHERE mana yang benar-benar menghasilkannya?',
 '[{"id":"a","label_en":"WHERE membership IN (''premium'',''vip'')","label_id":"WHERE membership IN (''premium'',''vip'')"},
   {"id":"b","label_en":"WHERE membership = ''premium'' AND membership = ''vip''","label_id":"WHERE membership = ''premium'' AND membership = ''vip''"},
   {"id":"c","label_en":"WHERE membership LIKE ''premium,vip''","label_id":"WHERE membership LIKE ''premium,vip''"},
   {"id":"d","label_en":"WHERE membership BETWEEN ''premium'' AND ''vip''","label_id":"WHERE membership BETWEEN ''premium'' AND ''vip''"}]'::jsonb, 'a'),

('X04', 2, 'Checkpoint 2 · Filtering Rows', 'Cek Poin 2 · Memfilter Baris', 2,
 'Which clause returns every city whose name starts with Ja?',
 'Klausa mana yang menghasilkan setiap kota yang namanya diawali Ja?',
 '[{"id":"a","label_en":"WHERE city LIKE ''%Ja''","label_id":"WHERE city LIKE ''%Ja''"},
   {"id":"b","label_en":"WHERE city = ''Ja%''","label_id":"WHERE city = ''Ja%''"},
   {"id":"c","label_en":"WHERE city IN (''Ja'')","label_id":"WHERE city IN (''Ja'')"},
   {"id":"d","label_en":"WHERE city LIKE ''Ja%''","label_id":"WHERE city LIKE ''Ja%''"}]'::jsonb, 'd'),

('X04', 3, 'Checkpoint 3 · Grouping', 'Cek Poin 3 · Pengelompokan', 1,
 'WHERE COUNT(*) > 2 returns an error. What is the correct fix?',
 'WHERE COUNT(*) > 2 menghasilkan error. Apa perbaikan yang benar?',
 '[{"id":"a","label_en":"Move the condition to HAVING, which filters groups after aggregation.","label_id":"Pindahkan kondisi ke HAVING, yang memfilter grup setelah agregasi."},
   {"id":"b","label_en":"Rewrite it as WHERE COUNT(1) > 2 so the count runs per row.","label_id":"Tulis ulang jadi WHERE COUNT(1) > 2 agar count berjalan per baris."},
   {"id":"c","label_en":"Add DISTINCT to the SELECT list before the count.","label_id":"Tambahkan DISTINCT ke daftar SELECT sebelum count."},
   {"id":"d","label_en":"Move the count into ORDER BY and take the top rows.","label_id":"Pindahkan count ke ORDER BY dan ambil baris teratas."}]'::jsonb, 'a'),

('X04', 3, 'Checkpoint 3 · Grouping', 'Cek Poin 3 · Pengelompokan', 2,
 'Customer names repeat in this dataset. What does GROUP BY c.name (instead of GROUP BY c.id, c.name) do?',
 'Nama pelanggan berulang di dataset ini. Apa akibat GROUP BY c.name (bukan GROUP BY c.id, c.name)?',
 '[{"id":"a","label_en":"It raises an error because name is not unique.","label_id":"Ia memunculkan error karena name tidak unik."},
   {"id":"b","label_en":"It returns duplicate rows for the same person.","label_id":"Ia menghasilkan baris duplikat untuk orang yang sama."},
   {"id":"c","label_en":"It silently merges two different people who share a name into one total.","label_id":"Ia diam-diam menggabungkan dua orang berbeda yang bernama sama menjadi satu total."},
   {"id":"d","label_en":"It sorts the output alphabetically but changes nothing else.","label_id":"Ia mengurutkan hasil secara alfabetis tetapi tidak mengubah apa pun."}]'::jsonb, 'c'),

('X04', 4, 'Checkpoint 4 · JOINs', 'Cek Poin 4 · JOIN', 1,
 'You need a count of times ordered for EVERY product, including ones never ordered. What happens if you use JOIN instead of LEFT JOIN?',
 'Anda butuh jumlah kali dipesan untuk SETIAP produk, termasuk yang belum pernah dipesan. Apa yang terjadi jika Anda memakai JOIN alih-alih LEFT JOIN?',
 '[{"id":"a","label_en":"Never-ordered products appear with a count of NULL.","label_id":"Produk yang belum pernah dipesan muncul dengan count NULL."},
   {"id":"b","label_en":"Never-ordered products silently disappear from the result.","label_id":"Produk yang belum pernah dipesan hilang diam-diam dari hasil."},
   {"id":"c","label_en":"Each product is duplicated once per order item.","label_id":"Setiap produk terduplikasi satu kali per order item."},
   {"id":"d","label_en":"The query errors because the counts do not match.","label_id":"Query error karena jumlahnya tidak cocok."}]'::jsonb, 'b'),

('X04', 4, 'Checkpoint 4 · JOINs', 'Cek Poin 4 · JOIN', 2,
 'What does LEFT JOIN reviews r ON r.product_id = p.id ... WHERE r.id IS NULL return?',
 'Apa yang dihasilkan LEFT JOIN reviews r ON r.product_id = p.id ... WHERE r.id IS NULL?',
 '[{"id":"a","label_en":"Products that nobody has reviewed","label_id":"Produk yang belum diulas siapa pun"},
   {"id":"b","label_en":"Products with the most reviews","label_id":"Produk dengan ulasan terbanyak"},
   {"id":"c","label_en":"Reviews that point at a deleted product","label_id":"Ulasan yang menunjuk produk yang sudah dihapus"},
   {"id":"d","label_en":"Nothing — the condition is always false after a LEFT JOIN","label_id":"Tidak ada — kondisinya selalu salah setelah LEFT JOIN"}]'::jsonb, 'a')

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
