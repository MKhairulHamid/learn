-- ============================================================
-- 054: Live-checkpoint content for X09–X12 (AI-assisted analysis,
--      Segmentation/RFM, Storytelling, Final Project). Completes the
--      4-checkpoints-per-session set for the 2026 fast track.
-- ============================================================

delete from public.session_checkpoints cp
 using public.sessions s
 where cp.session_id = s.id
   and s.session_number in ('X09','X10','X11','X12');

with seed (session_number, cp_num, cp_title_en, cp_title_id,
           q_num, prompt_en, prompt_id, options, correct) as (values

-- ══════════════ X09 · End-to-End Data Analysis with AI ══════════════
('X09', 1, 'Checkpoint 1 · Co-pilot, Not Autopilot', 'Cek Poin 1 · Co-pilot, Bukan Autopilot', 1,
 'AI can draft your SQL, summarise the pattern, and write the slide text. Which part of the job stays yours?',
 'AI bisa menyusun SQL, meringkas pola, dan menulis teks slide. Bagian pekerjaan mana yang tetap milik Anda?',
 '[{"id":"a","label_en":"Formatting the generated query so that a reviewer can follow it.","label_id":"Merapikan query hasil generate agar peninjau bisa mengikutinya."},
   {"id":"b","label_en":"Choosing which business question matters, and signing off the final claim.","label_id":"Memilih pertanyaan bisnis mana yang penting, dan bertanggung jawab atas klaim akhir."},
   {"id":"c","label_en":"Translating the summary into Indonesian for the local team.","label_id":"Menerjemahkan ringkasan ke bahasa Indonesia untuk tim lokal."},
   {"id":"d","label_en":"Choosing the colour palette the final chart will use.","label_id":"Memilih palet warna yang akan dipakai grafik akhir."}]'::jsonb, 'b'),

('X09', 1, 'Checkpoint 1 · Co-pilot, Not Autopilot', 'Cek Poin 1 · Co-pilot, Bukan Autopilot', 2,
 'An AI-written pandas snippet runs with no error and prints a clean number. What is the minimum you must do before putting that number in a deck?',
 'Sebuah snippet pandas tulisan AI berjalan tanpa error dan mencetak angka yang rapi. Apa minimum yang harus Anda lakukan sebelum memasukkan angka itu ke deck?',
 '[{"id":"a","label_en":"Run it a second time to confirm it is stable.","label_id":"Jalankan sekali lagi untuk memastikan hasilnya stabil."},
   {"id":"b","label_en":"Ask the AI whether it is confident in the result before you rely on it.","label_id":"Tanyakan pada AI apakah ia yakin dengan hasilnya sebelum Anda mengandalkannya."},
   {"id":"c","label_en":"Recompute at least one value directly against the source data.","label_id":"Hitung ulang setidaknya satu nilai langsung dari data sumber."},
   {"id":"d","label_en":"Ask it to rewrite the code more concisely.","label_id":"Minta AI menulis ulang kodenya lebih ringkas."}]'::jsonb, 'c'),

('X09', 2, 'Checkpoint 2 · Agentic AI', 'Cek Poin 2 · AI Agentik', 1,
 'What actually distinguishes agentic AI from a single prompt-and-answer?',
 'Apa yang sebenarnya membedakan AI agentik dari satu prompt-dan-jawab?',
 '[{"id":"a","label_en":"It runs multiple steps toward a goal without you prompting each one, planning and calling tools as it goes.","label_id":"Ia menjalankan banyak langkah menuju tujuan tanpa Anda memberi prompt tiap langkah, merencanakan dan memanggil tool sendiri."},
   {"id":"b","label_en":"It is trained on a larger corpus, so its answers cover more ground than a single prompt.","label_id":"Ia dilatih pada korpus lebih besar, sehingga jawabannya mencakup lebih luas daripada satu prompt."},
   {"id":"c","label_en":"It cannot hallucinate, because each step verifies the output of the step before it.","label_id":"Ia tidak bisa berhalusinasi, karena tiap langkah memverifikasi keluaran langkah sebelumnya."},
   {"id":"d","label_en":"It only works on structured tabular data, which is why analysts use it for spreadsheets.","label_id":"Ia hanya bekerja pada data tabular terstruktur, itulah sebabnya analis memakainya untuk spreadsheet."}]'::jsonb, 'a'),

('X09', 2, 'Checkpoint 2 · Agentic AI', 'Cek Poin 2 · AI Agentik', 2,
 'An agent chained five steps and produced a polished summary. Why does that demand MORE verification than a single answer, not less?',
 'Sebuah agen merangkai lima langkah dan menghasilkan ringkasan yang rapi. Mengapa itu menuntut verifikasi LEBIH banyak daripada satu jawaban tunggal?',
 '[{"id":"a","label_en":"Agents run more slowly, so errors accumulate over time.","label_id":"Agen berjalan lebih lambat, sehingga error menumpuk seiring waktu."},
   {"id":"b","label_en":"Longer outputs are statistically more likely to contain a factual slip somewhere in the text.","label_id":"Output yang lebih panjang secara statistik lebih mungkin memuat kekeliruan fakta di suatu bagian."},
   {"id":"c","label_en":"Agents are unable to show their working.","label_id":"Agen tidak mampu menunjukkan proses kerjanya."},
   {"id":"d","label_en":"A wrong assumption at step one flows silently through every later step, and the polish hides it.","label_id":"Asumsi yang salah di langkah satu mengalir diam-diam ke semua langkah berikutnya, dan kerapiannya menyembunyikannya."}]'::jsonb, 'd'),

('X09', 3, 'Checkpoint 3 · Prompting', 'Cek Poin 3 · Prompting', 1,
 'Your whole prompt is: "Find the top 3 categories by revenue growth Q1 to Q2." Which of the four parts of a strong analysis prompt are missing?',
 'Seluruh prompt Anda adalah: "Cari 3 kategori teratas berdasarkan pertumbuhan pendapatan Q1 ke Q2." Bagian mana dari empat bagian prompt analisis yang kuat yang hilang?',
 '[{"id":"a","label_en":"Nothing is missing — the task is stated clearly, and a clear task is all a model needs.","label_id":"Tidak ada yang kurang — tugasnya jelas, dan tugas yang jelas adalah semua yang dibutuhkan model."},
   {"id":"b","label_en":"Only the output format, since the model can infer the table and columns on its own.","label_id":"Hanya format keluaran, karena model bisa menyimpulkan sendiri tabel dan kolomnya."},
   {"id":"c","label_en":"Context (which table and columns), format (how to return it), and constraints (what it may assume).","label_id":"Konteks (tabel dan kolom mana), format (bentuk keluaran), dan batasan (apa yang boleh diasumsikan)."},
   {"id":"d","label_en":"The task itself, which needs restating far more precisely before anything else matters.","label_id":"Tugasnya sendiri, yang perlu dinyatakan ulang jauh lebih presisi sebelum hal lain berarti."}]'::jsonb, 'c'),

('X09', 3, 'Checkpoint 3 · Prompting', 'Cek Poin 3 · Prompting', 2,
 'The AI returns a growth figure that looks too high. Which follow-up actually helps you find out?',
 'AI mengembalikan angka pertumbuhan yang tampak terlalu tinggi. Tindak lanjut mana yang benar-benar membantu Anda mengetahuinya?',
 '[{"id":"a","label_en":"Show the calculation and list the rows you used for Q1 and Q2.","label_id":"Tunjukkan perhitungannya dan daftarkan baris yang Anda pakai untuk Q1 dan Q2."},
   {"id":"b","label_en":"Are you sure that is correct?","label_id":"Apakah Anda yakin itu benar?"},
   {"id":"c","label_en":"Try that again and give me a different answer this time.","label_id":"Coba lagi dan beri saya jawaban yang berbeda kali ini."},
   {"id":"d","label_en":"Explain revenue growth in simple terms.","label_id":"Jelaskan pertumbuhan pendapatan dengan istilah sederhana."}]'::jsonb, 'a'),

('X09', 4, 'Checkpoint 4 · Verify & Protect', 'Cek Poin 4 · Verifikasi & Lindungi', 1,
 'An AI returned average order value by region in a clean table — but had silently included cancelled orders. Which habit would have caught it?',
 'AI mengembalikan nilai pesanan rata-rata per wilayah dalam tabel rapi — tetapi diam-diam menyertakan pesanan yang dibatalkan. Kebiasaan mana yang akan menangkapnya?',
 '[{"id":"a","label_en":"Asking the AI to double-check its own answer and confirm that it is correct.","label_id":"Meminta AI memeriksa ulang jawabannya sendiri dan menegaskan bahwa itu benar."},
   {"id":"b","label_en":"Recomputing one region against the source and asking to see the filter it applied.","label_id":"Menghitung ulang satu wilayah dari sumber dan meminta melihat filter yang diterapkan."},
   {"id":"c","label_en":"Reformatting the table so the numbers are easier to read before presenting it.","label_id":"Memformat ulang tabel agar angkanya lebih mudah dibaca sebelum dipresentasikan."},
   {"id":"d","label_en":"Running the identical prompt a second time and comparing the two outputs.","label_id":"Menjalankan prompt yang sama untuk kedua kalinya dan membandingkan dua keluarannya."}]'::jsonb, 'b'),

('X09', 4, 'Checkpoint 4 · Verify & Protect', 'Cek Poin 4 · Verifikasi & Lindungi', 2,
 'A teammate pastes a customer export containing names and phone numbers into a public AI chatbot to speed up the analysis. What is your response?',
 'Rekan tim menempelkan ekspor pelanggan berisi nama dan nomor telepon ke chatbot AI publik untuk mempercepat analisis. Apa tanggapan Anda?',
 '[{"id":"a","label_en":"Acceptable, provided the chat history is deleted immediately after the analysis is finished.","label_id":"Boleh saja, asalkan riwayat percakapan dihapus segera setelah analisis selesai."},
   {"id":"b","label_en":"Acceptable, because only payment card data counts as genuinely sensitive information.","label_id":"Boleh saja, karena hanya data kartu pembayaran yang tergolong informasi benar-benar sensitif."},
   {"id":"c","label_en":"Acceptable, though the answers will be less accurate on anonymised customer records.","label_id":"Boleh saja, meski jawabannya kurang akurat pada catatan pelanggan yang dianonimkan."},
   {"id":"d","label_en":"Customer PII must not go into an unapproved tool — anonymise it first or use an approved environment.","label_id":"Data pribadi pelanggan tidak boleh masuk ke tool yang tidak disetujui — anonimkan dulu atau gunakan lingkungan yang disetujui."}]'::jsonb, 'd'),

-- ══════════════ X10 · Advanced Data Analysis (Segmentation & RFM) ══════════════
('X10', 1, 'Checkpoint 1 · Why Segment', 'Cek Poin 1 · Mengapa Segmentasi', 1,
 'TokoSegar currently emails the same 20% discount to all 15,000 customers. What does segmentation let you do instead?',
 'TokoSegar saat ini mengirim diskon 20% yang sama ke seluruh 15.000 pelanggan. Apa yang memungkinkan dilakukan segmentasi sebagai gantinya?',
 '[{"id":"a","label_en":"Forecast next month total revenue more precisely by modelling each customer group separately.","label_id":"Memproyeksikan total pendapatan bulan depan lebih presisi dengan memodelkan tiap kelompok terpisah."},
   {"id":"b","label_en":"Replace the loyalty programme entirely with a simpler tiered discount arrangement.","label_id":"Mengganti program loyalitas sepenuhnya dengan skema diskon berjenjang yang lebih sederhana."},
   {"id":"c","label_en":"Reduce the size of the customer database by archiving the least active records.","label_id":"Mengurangi ukuran basis data pelanggan dengan mengarsipkan catatan paling tidak aktif."},
   {"id":"d","label_en":"Spend the budget where it changes behaviour — win-back for the ones going quiet, rewards for the best.","label_id":"Membelanjakan anggaran di tempat yang mengubah perilaku — win-back untuk yang mulai pasif, hadiah untuk yang terbaik."}]'::jsonb, 'd'),

('X10', 1, 'Checkpoint 1 · Why Segment', 'Cek Poin 1 · Mengapa Segmentasi', 2,
 'You produce a beautiful segmentation, but no team ever changes what they do because of it. What is it worth?',
 'Anda menghasilkan segmentasi yang indah, tetapi tidak ada tim yang mengubah tindakannya karena itu. Apa nilainya?',
 '[{"id":"a","label_en":"Still valuable — it documents the customer base for later.","label_id":"Tetap berharga — ia mendokumentasikan basis pelanggan untuk nanti."},
   {"id":"b","label_en":"It proves the quintile boundaries were set incorrectly.","label_id":"Ia membuktikan batas kuintilnya salah ditetapkan."},
   {"id":"c","label_en":"It means more RFM dimensions are needed.","label_id":"Artinya dibutuhkan lebih banyak dimensi RFM."},
   {"id":"d","label_en":"It is just a label — a segment only pays off when it maps to an action.","label_id":"Itu cuma label — segmen baru berguna kalau terhubung ke tindakan."}]'::jsonb, 'd'),

('X10', 2, 'Checkpoint 2 · The RFM Dimensions', 'Cek Poin 2 · Dimensi RFM', 1,
 'Ahmad last ordered 300 days ago, has placed 1 order, and has spent Rp 300,000 in total. What is his likely RFM score?',
 'Ahmad terakhir memesan 300 hari lalu, baru 1 kali memesan, dan total belanja Rp 300.000. Berapa kemungkinan skor RFM-nya?',
 '[{"id":"a","label_en":"555","label_id":"555"},
   {"id":"b","label_en":"111","label_id":"111"},
   {"id":"c","label_en":"511","label_id":"511"},
   {"id":"d","label_en":"151","label_id":"151"}]'::jsonb, 'b'),

('X10', 2, 'Checkpoint 2 · The RFM Dimensions', 'Cek Poin 2 · Dimensi RFM', 2,
 'Customer A last ordered 5 days ago; Customer B last ordered 300 days ago. Who gets the higher Recency score, and why?',
 'Pelanggan A terakhir memesan 5 hari lalu; Pelanggan B 300 hari lalu. Siapa yang mendapat skor Recency lebih tinggi, dan mengapa?',
 '[{"id":"a","label_en":"Customer B — a larger number of days produces a larger score.","label_id":"Pelanggan B — jumlah hari yang lebih besar menghasilkan skor lebih besar."},
   {"id":"b","label_en":"They score the same; recency only separates customers within the same month.","label_id":"Skornya sama; recency hanya memisahkan pelanggan dalam bulan yang sama."},
   {"id":"c","label_en":"Customer A — recency is scored inverted, so fewer days since the last order earns a higher R.","label_id":"Pelanggan A — recency dinilai terbalik, sehingga makin sedikit hari sejak pesanan terakhir makin tinggi R."},
   {"id":"d","label_en":"It cannot be determined without their spend.","label_id":"Tidak bisa ditentukan tanpa nilai belanjanya."}]'::jsonb, 'c'),

('X10', 3, 'Checkpoint 3 · Scoring', 'Cek Poin 3 · Penilaian', 1,
 'Why rank Monetary into quintiles rather than cutting the raw rupiah range into five equal-width bins?',
 'Mengapa memeringkat Monetary ke dalam kuintil alih-alih memotong rentang rupiah mentah menjadi lima bin selebar sama?',
 '[{"id":"a","label_en":"Quintiles are considerably faster to compute on large customer tables than width-based bins.","label_id":"Kuintil jauh lebih cepat dihitung pada tabel pelanggan besar daripada bin berbasis lebar."},
   {"id":"b","label_en":"A handful of whales stretch the raw range, so equal-width bins would dump almost everyone into bin 1.","label_id":"Segelintir pembeli besar meregangkan rentang mentah, sehingga bin selebar sama akan menumpuk hampir semua orang di bin 1."},
   {"id":"c","label_en":"Equal-width binning only works on dates, so it cannot be applied to a rupiah column.","label_id":"Binning selebar sama hanya bekerja pada tanggal, jadi tidak bisa diterapkan ke kolom rupiah."},
   {"id":"d","label_en":"Quintiles guarantee the monetary data becomes normally distributed before scoring.","label_id":"Kuintil menjamin data monetary menjadi berdistribusi normal sebelum diberi skor."}]'::jsonb, 'b'),

('X10', 3, 'Checkpoint 3 · Scoring', 'Cek Poin 3 · Penilaian', 2,
 'Scoring 1–5 on three dimensions produces 125 possible RFM cells. Why roll them into about five named segments?',
 'Penilaian 1–5 pada tiga dimensi menghasilkan 125 kemungkinan sel RFM. Mengapa meringkasnya menjadi sekitar lima segmen bernama?',
 '[{"id":"a","label_en":"125 cells exceed what a spreadsheet can hold.","label_id":"125 sel melampaui kapasitas spreadsheet."},
   {"id":"b","label_en":"Named segments are statistically more accurate than raw cells, because averaging reduces noise.","label_id":"Segmen bernama secara statistik lebih akurat daripada sel mentah, karena perataan mengurangi noise."},
   {"id":"c","label_en":"The RFM model only permits five output values.","label_id":"Model RFM hanya mengizinkan lima nilai keluaran."},
   {"id":"d","label_en":"Nobody can design and run 125 different actions — segments must be actionable to be useful.","label_id":"Tidak ada yang bisa merancang dan menjalankan 125 tindakan berbeda — segmen harus bisa ditindaklanjuti agar berguna."}]'::jsonb, 'd'),

('X10', 4, 'Checkpoint 4 · Segments to Action', 'Cek Poin 4 · Segmen ke Aksi', 1,
 'The At Risk segment is 8% of customers but held 24% of last year revenue. What is the highest-value move?',
 'Segmen At Risk hanya 8% pelanggan tetapi menyumbang 24% pendapatan tahun lalu. Apa langkah bernilai tertinggi?',
 '[{"id":"a","label_en":"A blanket discount to the whole customer base.","label_id":"Diskon menyeluruh untuk seluruh basis pelanggan."},
   {"id":"b","label_en":"Focus the budget on acquiring new customers, who cost less to convert.","label_id":"Fokuskan anggaran untuk mengakuisisi pelanggan baru, yang lebih murah dikonversi."},
   {"id":"c","label_en":"Reclassify them as Lost and stop spending on them.","label_id":"Klasifikasikan ulang mereka sebagai Lost dan hentikan pengeluaran untuk mereka."},
   {"id":"d","label_en":"A targeted win-back to those customers before they churn for good.","label_id":"Win-back tertarget ke pelanggan itu sebelum mereka benar-benar pergi."}]'::jsonb, 'd'),

('X10', 4, 'Checkpoint 4 · Segments to Action', 'Cek Poin 4 · Segmen ke Aksi', 2,
 'Which action belongs to the Champions segment?',
 'Tindakan mana yang cocok untuk segmen Champions?',
 '[{"id":"a","label_en":"A win-back offer before they churn","label_id":"Penawaran win-back sebelum mereka pergi"},
   {"id":"b","label_en":"An onboarding nurture and a second-purchase nudge","label_id":"Nurture onboarding dan dorongan pembelian kedua"},
   {"id":"c","label_en":"Reward them, upsell premium, and ask for referrals","label_id":"Beri hadiah, tawarkan premium, dan minta referral"},
   {"id":"d","label_en":"One reactivation attempt, then stop spending","label_id":"Satu upaya reaktivasi, lalu hentikan pengeluaran"}]'::jsonb, 'c'),

-- ══════════════ X11 · Storytelling with Data ══════════════
('X11', 1, 'Checkpoint 1 · Know the Audience', 'Cek Poin 1 · Kenali Audiens', 1,
 'You have 20 minutes with the CEO. What belongs in the deck?',
 'Anda punya 20 menit bersama CEO. Apa yang layak ada di deck?',
 '[{"id":"a","label_en":"The methodology, assumptions, and data-quality caveats first.","label_id":"Metodologi, asumsi, dan catatan kualitas data lebih dulu."},
   {"id":"b","label_en":"Every chart you produced, so nothing looks hidden.","label_id":"Semua grafik yang Anda buat, agar tidak ada yang tampak disembunyikan."},
   {"id":"c","label_en":"The decision and the ask, with one or two charts that support it.","label_id":"Keputusan dan permintaannya, dengan satu atau dua grafik pendukung."},
   {"id":"d","label_en":"The raw dataset, so they can explore it themselves.","label_id":"Dataset mentah, agar mereka bisa menjelajahinya sendiri."}]'::jsonb, 'c'),

('X11', 1, 'Checkpoint 1 · Know the Audience', 'Cek Poin 1 · Kenali Audiens', 2,
 'The same analysis goes to Finance and to your fellow analysts. What should differ?',
 'Analisis yang sama disampaikan ke Finance dan ke sesama analis. Apa yang harus berbeda?',
 '[{"id":"a","label_en":"Nothing — the analysis is the analysis, and one well-built deck should serve every audience.","label_id":"Tidak ada — analisisnya tetap sama, dan satu deck yang baik semestinya melayani semua audiens."},
   {"id":"b","label_en":"Finance gets ROI, cost, and payback; analysts get method, assumptions, and detail.","label_id":"Finance mendapat ROI, biaya, dan payback; analis mendapat metode, asumsi, dan detail."},
   {"id":"c","label_en":"Only the colour scheme and branding.","label_id":"Hanya skema warna dan branding."},
   {"id":"d","label_en":"Only the length — Finance gets the shorter version.","label_id":"Hanya panjangnya — Finance mendapat versi lebih singkat."}]'::jsonb, 'b'),

('X11', 2, 'Checkpoint 2 · Pyramid Principle', 'Cek Poin 2 · Prinsip Piramida', 1,
 'Which sequence follows the Pyramid Principle?',
 'Urutan mana yang mengikuti Prinsip Piramida?',
 '[{"id":"a","label_en":"Context → method → results → conclusion","label_id":"Konteks → metode → hasil → kesimpulan"},
   {"id":"b","label_en":"Evidence → key reasons → conclusion","label_id":"Bukti → alasan utama → kesimpulan"},
   {"id":"c","label_en":"Key reasons → evidence → conclusion","label_id":"Alasan utama → bukti → kesimpulan"},
   {"id":"d","label_en":"Conclusion → key reasons → evidence","label_id":"Kesimpulan → alasan utama → bukti"}]'::jsonb, 'd'),

('X11', 2, 'Checkpoint 2 · Pyramid Principle', 'Cek Poin 2 · Prinsip Piramida', 2,
 'Why does leading with the conclusion work better for busy stakeholders?',
 'Mengapa memulai dengan kesimpulan lebih efektif untuk stakeholder yang sibuk?',
 '[{"id":"a","label_en":"They get the point in the first sentence, and the detail is there only if they want to drill down.","label_id":"Mereka menangkap intinya di kalimat pertama, dan detailnya tersedia hanya jika mereka ingin mendalami."},
   {"id":"b","label_en":"It makes the overall presentation shorter, which respects the time of a senior audience.","label_id":"Ia membuat presentasi lebih singkat, yang menghargai waktu audiens senior."},
   {"id":"c","label_en":"It lets you avoid showing charts entirely, since the conclusion carries the argument.","label_id":"Ia memungkinkan Anda tidak menampilkan grafik sama sekali, karena kesimpulan yang membawa argumen."},
   {"id":"d","label_en":"It draws attention away from evidence that is weaker than you would like it to be.","label_id":"Ia mengalihkan perhatian dari bukti yang lebih lemah daripada yang Anda inginkan."}]'::jsonb, 'a'),

('X11', 3, 'Checkpoint 3 · Narrative Arc', 'Cek Poin 3 · Alur Naratif', 1,
 'In the what-is to what-could-be arc, what actually creates the tension that makes an audience want to act?',
 'Dalam alur what-is ke what-could-be, apa yang sebenarnya menciptakan ketegangan yang membuat audiens ingin bertindak?',
 '[{"id":"a","label_en":"The sheer volume of supporting data.","label_id":"Banyaknya data pendukung."},
   {"id":"b","label_en":"The length and thoroughness of the presentation you deliver.","label_id":"Panjang dan ketuntasan presentasi yang Anda sampaikan."},
   {"id":"c","label_en":"A bold, high-contrast colour scheme.","label_id":"Skema warna berani dengan kontras tinggi."},
   {"id":"d","label_en":"The gap between the problem today and the better future you describe.","label_id":"Jarak antara masalah hari ini dan masa depan lebih baik yang Anda gambarkan."}]'::jsonb, 'd'),

('X11', 3, 'Checkpoint 3 · Narrative Arc', 'Cek Poin 3 · Alur Naratif', 2,
 'Your presentation ends on a well-designed summary chart. What is missing?',
 'Presentasi Anda berakhir pada grafik ringkasan yang dirancang baik. Apa yang kurang?',
 '[{"id":"a","label_en":"A thank-you slide with your contact details.","label_id":"Slide terima kasih dengan detail kontak Anda."},
   {"id":"b","label_en":"A methodology appendix for the analysts sitting in the room.","label_id":"Lampiran metodologi untuk para analis yang hadir di ruangan."},
   {"id":"c","label_en":"A repeat of the opening chart for symmetry.","label_id":"Pengulangan grafik pembuka demi simetri."},
   {"id":"d","label_en":"An explicit call to action — what you are asking them to decide or do.","label_id":"Ajakan bertindak yang eksplisit — apa yang Anda minta mereka putuskan atau lakukan."}]'::jsonb, 'd'),

('X11', 4, 'Checkpoint 4 · Slide Craft', 'Cek Poin 4 · Kerajinan Slide', 1,
 'A 25-slide data dump got no decision. Rebuilt to 6 slides, the same analysis got budget approval in ten minutes. What actually changed?',
 'Data dump 25 slide tidak menghasilkan keputusan. Dibangun ulang jadi 6 slide, analisis yang sama mendapat persetujuan anggaran dalam sepuluh menit. Apa yang sebenarnya berubah?',
 '[{"id":"a","label_en":"Fewer slides is always better, regardless of what the content actually says.","label_id":"Lebih sedikit slide selalu lebih baik, terlepas dari apa isi kontennya."},
   {"id":"b","label_en":"The structure: one conclusion, three reasons, an ROI slide, and a clear ask.","label_id":"Strukturnya: satu kesimpulan, tiga alasan, satu slide ROI, dan permintaan yang jelas."},
   {"id":"c","label_en":"The charts were redrawn with a better colour palette.","label_id":"Grafiknya digambar ulang dengan palet warna lebih baik."},
   {"id":"d","label_en":"The underlying numbers were revised upward.","label_id":"Angka dasarnya direvisi naik."}]'::jsonb, 'b'),

('X11', 4, 'Checkpoint 4 · Slide Craft', 'Cek Poin 4 · Kerajinan Slide', 2,
 'Which slide title follows the one-message-per-slide rule?',
 'Judul slide mana yang mengikuti aturan satu pesan per slide?',
 '[{"id":"a","label_en":"Returns Analysis","label_id":"Analisis Retur"},
   {"id":"b","label_en":"Q2 Returns Data by Category and Region","label_id":"Data Retur Q2 per Kategori dan Wilayah"},
   {"id":"c","label_en":"Returns doubled after the March promo","label_id":"Retur berlipat dua setelah promo Maret"},
   {"id":"d","label_en":"Appendix: Returns","label_id":"Lampiran: Retur"}]'::jsonb, 'c'),

-- ══════════════ X12 · Final Project and Portfolio ══════════════
('X12', 1, 'Checkpoint 1 · Scoping', 'Cek Poin 1 · Menentukan Lingkup', 1,
 'Two proposals land on your desk. Which is the stronger final project?',
 'Dua proposal masuk ke meja Anda. Mana proyek akhir yang lebih kuat?',
 '[{"id":"a","label_en":"Ten business questions, each answered with a chart and a sentence.","label_id":"Sepuluh pertanyaan bisnis, masing-masing dijawab dengan satu grafik dan satu kalimat."},
   {"id":"b","label_en":"One question a decision-maker would act on, taken from raw data to recommendation.","label_id":"Satu pertanyaan yang akan ditindaklanjuti pengambil keputusan, dibawa dari data mentah sampai rekomendasi."},
   {"id":"c","label_en":"A 20-visual dashboard covering every table in the dataset.","label_id":"Dashboard 20 visual yang mencakup setiap tabel dalam dataset."},
   {"id":"d","label_en":"A thoroughly cleaned dataset with the analysis left for later.","label_id":"Dataset yang dibersihkan menyeluruh dengan analisis ditunda."}]'::jsonb, 'b'),

('X12', 1, 'Checkpoint 1 · Scoping', 'Cek Poin 1 · Menentukan Lingkup', 2,
 'What does end-to-end actually mean for the final project?',
 'Apa arti end-to-end sebenarnya untuk proyek akhir?',
 '[{"id":"a","label_en":"Business question → collection and cleaning → EDA → visualization → insight → recommendation","label_id":"Pertanyaan bisnis → pengumpulan dan pembersihan → EDA → visualisasi → insight → rekomendasi"},
   {"id":"b","label_en":"Data collection → cleaning → dashboard build → stakeholder sign-off → archive","label_id":"Pengumpulan data → pembersihan → membangun dashboard → persetujuan stakeholder → arsip"},
   {"id":"c","label_en":"Business question → dashboard → EDA → cleaning → recommendation → insight","label_id":"Pertanyaan bisnis → dashboard → EDA → pembersihan → rekomendasi → insight"},
   {"id":"d","label_en":"Cleaning → EDA → statistical testing → visualization → written report","label_id":"Pembersihan → EDA → pengujian statistik → visualisasi → laporan tertulis"}]'::jsonb, 'a'),

('X12', 2, 'Checkpoint 2 · The Rubric', 'Cek Poin 2 · Rubrik', 1,
 'A project has flawless charts and clean joins, but the question it answers is vague and nobody needed it. Which criterion does it fail hardest?',
 'Sebuah proyek punya grafik sempurna dan join yang rapi, tetapi pertanyaan yang dijawabnya kabur dan tidak dibutuhkan siapa pun. Kriteria mana yang paling gagal?',
 '[{"id":"a","label_en":"Communication","label_id":"Komunikasi"},
   {"id":"b","label_en":"Analysis depth","label_id":"Kedalaman analisis"},
   {"id":"c","label_en":"Data handling","label_id":"Pengelolaan data"},
   {"id":"d","label_en":"Problem framing","label_id":"Perumusan masalah"}]'::jsonb, 'd'),

('X12', 2, 'Checkpoint 2 · The Rubric', 'Cek Poin 2 · Rubrik', 2,
 'Which rubric criterion is really asking "did you answer the so what?"',
 'Kriteria rubrik mana yang sebenarnya menanyakan "apakah Anda menjawab so what?"',
 '[{"id":"a","label_en":"Data handling","label_id":"Pengelolaan data"},
   {"id":"b","label_en":"Communication","label_id":"Komunikasi"},
   {"id":"c","label_en":"Insight quality","label_id":"Kualitas insight"},
   {"id":"d","label_en":"Problem framing","label_id":"Perumusan masalah"}]'::jsonb, 'c'),

('X12', 3, 'Checkpoint 3 · Working the Timeline', 'Cek Poin 3 · Menjalankan Linimasa', 1,
 'Why ship a rough end-to-end version in week 2 rather than perfecting the cleaning first?',
 'Mengapa merilis versi end-to-end kasar di minggu 2 alih-alih menyempurnakan pembersihan lebih dulu?',
 '[{"id":"a","label_en":"The rubric awards extra marks for submitting an early draft, independent of its quality.","label_id":"Rubrik memberi nilai tambahan untuk mengumpulkan draf awal, terlepas dari kualitasnya."},
   {"id":"b","label_en":"A complete rough draft beats a perfect half — you find the real problems only by reaching the end.","label_id":"Draf kasar yang utuh mengalahkan setengah yang sempurna — masalah sebenarnya baru terlihat setelah sampai ujung."},
   {"id":"c","label_en":"Cleaning is the least important stage, so it is safe to leave until the final week.","label_id":"Pembersihan adalah tahap paling tidak penting, jadi aman ditunda sampai minggu terakhir."},
   {"id":"d","label_en":"It reduces the volume of data you need to store while the project is in progress.","label_id":"Ia mengurangi volume data yang perlu disimpan selama proyek berjalan."}]'::jsonb, 'b'),

('X12', 3, 'Checkpoint 3 · Working the Timeline', 'Cek Poin 3 · Menjalankan Linimasa', 2,
 'By the milestone plan, what is week 3 for?',
 'Menurut rencana milestone, minggu 3 untuk apa?',
 '[{"id":"a","label_en":"Picking the question and gathering the data you need","label_id":"Memilih pertanyaan dan mengumpulkan data yang dibutuhkan"},
   {"id":"b","label_en":"Cleaning the data and running the first EDA","label_id":"Membersihkan data dan menjalankan EDA pertama"},
   {"id":"c","label_en":"Visualizing, writing the story, and recording the walkthrough","label_id":"Memvisualisasikan, menulis cerita, dan merekam walkthrough"},
   {"id":"d","label_en":"Choosing which tools and libraries to learn","label_id":"Memilih tool dan pustaka yang akan dipelajari"}]'::jsonb, 'c'),

('X12', 4, 'Checkpoint 4 · The Portfolio', 'Cek Poin 4 · Portofolio', 1,
 'Two candidates know the same tools. One lists "SQL, Python, Power BI". The other posts "How I found the 8% of customers driving 24% of revenue — and the win-back plan". Why did the second get the interview?',
 'Dua kandidat menguasai tool yang sama. Satu menulis "SQL, Python, Power BI". Yang lain memposting "Bagaimana saya menemukan 8% pelanggan yang menghasilkan 24% pendapatan — dan rencana win-back-nya". Mengapa yang kedua dipanggil wawancara?',
 '[{"id":"a","label_en":"The second candidate demonstrably knows a wider range of tools.","label_id":"Kandidat kedua jelas menguasai rentang tool yang lebih luas."},
   {"id":"b","label_en":"Recruiters do not read tool lists at all.","label_id":"Perekrut sama sekali tidak membaca daftar tool."},
   {"id":"c","label_en":"The second used a stronger CV template.","label_id":"Kandidat kedua memakai templat CV yang lebih baik."},
   {"id":"d","label_en":"The work showed business impact and the thinking behind it, not just syntax.","label_id":"Karyanya menunjukkan dampak bisnis dan proses berpikirnya, bukan sekadar sintaks."}]'::jsonb, 'd'),

('X12', 4, 'Checkpoint 4 · The Portfolio', 'Cek Poin 4 · Portofolio', 2,
 'What should the first line of a project README say?',
 'Apa yang harus tertulis di baris pertama README proyek?',
 '[{"id":"a","label_en":"The tech stack you used","label_id":"Tech stack yang Anda gunakan"},
   {"id":"b","label_en":"The finding — what you found and why it matters","label_id":"Temuannya — apa yang Anda temukan dan mengapa itu penting"},
   {"id":"c","label_en":"Where the dataset came from","label_id":"Dari mana dataset itu berasal"},
   {"id":"d","label_en":"How to install and run the project locally","label_id":"Cara memasang dan menjalankan proyek secara lokal"}]'::jsonb, 'b')

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
