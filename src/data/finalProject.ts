// Final Project — "Seduh Coffee" end-to-end portfolio project.
//
// The workbook in public/project/ ships a Project Brief whose deliverables table
// is mapped session-by-session (S1…S12). Those map 1:1 onto the X01–X12 program
// ("Data Analyst Fast Track · 2026"), so each session can tell the learner which
// part of the project they are now able to do with the material they just covered.
//
// Keyed by session_number, so the card renders for X01–X12 only and stays
// invisible for every other program (04/05/F08, HR H01–H25, orientation).

export interface ProjectStep {
  /** 1-based position in the 12-step project arc. */
  step: number
  /** Business questions from the brief this session equips the learner to answer. */
  questions: string[]
  title_en: string
  title_id: string
  /** The capability unlocked, phrased as "you can now …". */
  summary_en: string
  summary_id: string
  /** Concrete things the learner can do to the data right now. */
  can_do_en: string[]
  can_do_id: string[]
}

export const FINAL_PROJECT_FILE = {
  /** Served from public/ — vite base is '/', so this is the deployed path too. */
  path: '/project/seduh-coffee-final-project.xlsx',
  /** Restores a readable name on the learner's disk via the download attribute. */
  downloadName: 'Seduh Coffee - Data Analyst Final Project.xlsx',
  sizeLabel: '1.7 MB',
}

export const FINAL_PROJECT_TOTAL = 12

export const FINAL_PROJECT_STEPS: Record<string, ProjectStep> = {
  X01: {
    step: 1,
    questions: [],
    title_en: 'Frame the problem and size the business',
    title_id: 'Rumuskan masalah dan ukur skala bisnisnya',
    summary_en:
      'You can now write Seduh\'s problem statement: map the business end-to-end, decide which metric matters at each stage, and describe the data with basic statistics before analysing anything.',
    summary_id:
      'Kamu sekarang bisa menulis problem statement Seduh: memetakan proses bisnis dari hulu ke hilir, menentukan metrik yang penting di tiap tahap, dan mendeskripsikan data dengan statistik dasar sebelum menganalisis apa pun.',
    can_do_en: [
      'Write a problem statement for the IDR 5.5B 2026 target and map acquisition → conversion → order value → retention',
      'Define the metric that matters at each stage (CAC, AOV, repeat rate, margin)',
      'Compute mean, median, min/max and spread for quantity, unit_price and rating in Orders',
      'Count rows per table and state what one row means in Orders vs Customers',
    ],
    can_do_id: [
      'Menulis problem statement untuk target IDR 5,5 M di 2026 dan memetakan akuisisi → konversi → nilai order → retensi',
      'Menentukan metrik kunci di tiap tahap (CAC, AOV, repeat rate, margin)',
      'Menghitung mean, median, min/max, dan sebaran untuk quantity, unit_price, dan rating di Orders',
      'Menghitung jumlah baris tiap tabel dan menjelaskan arti satu baris di Orders vs Customers',
    ],
  },
  X02: {
    step: 2,
    questions: [],
    title_en: 'Clean the raw data',
    title_id: 'Bersihkan data mentah',
    summary_en:
      'The workbook is deliberately messy. You can now fix every quality issue in it — duplicates, inconsistent text, blanks and invalid values — and produce the cleaned dataset that the rest of the project runs on.',
    summary_id:
      'Workbook ini sengaja dibuat kotor. Kamu sekarang bisa memperbaiki semua masalah kualitasnya — duplikat, teks tidak konsisten, sel kosong, dan nilai tidak valid — lalu menghasilkan dataset bersih yang dipakai seluruh sisa proyek.',
    can_do_en: [
      'Remove the duplicate order rows in Orders',
      'Standardize channel names (Webstore / Tokopedia / Shopee / TikTok Shop) with TRIM and consistent casing',
      'Normalize gender in Customers (Female / F / female / Perempuan → one value) and clean city blanks and trailing spaces',
      'Fix the category naming inconsistency in Products, and drop or flag zero and negative quantity',
    ],
    can_do_id: [
      'Menghapus baris order duplikat di Orders',
      'Menyeragamkan nama channel (Webstore / Tokopedia / Shopee / TikTok Shop) dengan TRIM dan kapitalisasi konsisten',
      'Menormalkan gender di Customers (Female / F / female / Perempuan → satu nilai) serta membersihkan city yang kosong dan berspasi',
      'Memperbaiki inkonsistensi penamaan category di Products, dan membuang atau menandai quantity nol dan negatif',
    ],
  },
  X03: {
    step: 3,
    questions: ['Q1', 'Q2', 'Q3', 'Q4'],
    title_en: 'Answer the first four questions with Pivot Tables',
    title_id: 'Jawab empat pertanyaan pertama dengan Pivot Table',
    summary_en:
      'With the cleaned data you can now answer four of the eight business questions without writing a single line of code — profit by category, value by channel, the monthly trend, and the repeat-buyer split.',
    summary_id:
      'Dengan data yang sudah bersih, kamu sekarang bisa menjawab empat dari delapan pertanyaan bisnis tanpa menulis satu baris kode pun — profit per kategori, nilai per channel, tren bulanan, dan pembagian repeat buyer.',
    can_do_en: [
      'Q1 — pivot revenue and profit by category and by product, using unit_cost from Products',
      'Q2 — compare channels after discount, not on gross revenue',
      'Q3 — build the month-by-month 2024–2025 trend and spot Ramadan / Harbolnas 11.11 and 12.12 peaks',
      'Q4 — count orders per customer to split one-time buyers from repeat buyers',
    ],
    can_do_id: [
      'Q1 — pivot revenue dan profit per kategori dan per produk, memakai unit_cost dari Products',
      'Q2 — membandingkan channel setelah diskon, bukan dari revenue kotor',
      'Q3 — menyusun tren bulanan 2024–2025 dan menemukan puncak Ramadan / Harbolnas 11.11 dan 12.12',
      'Q4 — menghitung jumlah order per customer untuk memisahkan pembeli sekali dari repeat buyer',
    ],
  },
  X04: {
    step: 4,
    questions: ['Q1', 'Q2'],
    title_en: 'Rebuild the analysis in SQL',
    title_id: 'Bangun ulang analisisnya dengan SQL',
    summary_en:
      'You can now load all four tabs into a database and query them directly — joining Orders to Products to compute real profit, and Orders to Customers for segment analysis, instead of dragging pivot fields.',
    summary_id:
      'Kamu sekarang bisa memuat keempat tab ke database dan meng-query-nya langsung — men-join Orders ke Products untuk menghitung profit sesungguhnya, dan Orders ke Customers untuk analisis segmen, tanpa menarik-narik field pivot.',
    can_do_en: [
      'Load Orders, Customers, Products and Marketing_Spend as four related tables',
      'JOIN Orders to Products on product_id to compute profit per line with unit_cost',
      'Filter to order_status = \'Completed\' in WHERE so returns and cancellations never enter revenue',
      'GROUP BY category or channel with HAVING to surface only the segments that clear a threshold',
    ],
    can_do_id: [
      'Memuat Orders, Customers, Products, dan Marketing_Spend sebagai empat tabel yang saling berelasi',
      'JOIN Orders ke Products lewat product_id untuk menghitung profit per baris dengan unit_cost',
      'Memfilter order_status = \'Completed\' di WHERE agar retur dan pembatalan tidak pernah masuk revenue',
      'GROUP BY category atau channel dengan HAVING untuk menampilkan hanya segmen yang melewati ambang tertentu',
    ],
  },
  X05: {
    step: 5,
    questions: ['Q7'],
    title_en: 'Explore distributions and relationships',
    title_id: 'Eksplorasi distribusi dan hubungan antar variabel',
    summary_en:
      'You can now interrogate the data rather than just summarise it — look at how order value, quantity and rating are distributed, and test whether discounting actually moves volume.',
    summary_id:
      'Kamu sekarang bisa menggali data, bukan sekadar meringkasnya — melihat sebaran order value, quantity, dan rating, serta menguji apakah diskon benar-benar menaikkan volume.',
    can_do_en: [
      'Univariate — distribution and outliers of order value, quantity and rating',
      'Q7 — plot discount_pct against quantity to test whether discounting actually grows volume, then check whether it grows profit',
      'Bivariate — price vs demand, and rating vs whether the customer came back',
      'Flag the outliers worth explaining in the final deck rather than silently deleting them',
    ],
    can_do_id: [
      'Univariat — sebaran dan outlier dari order value, quantity, dan rating',
      'Q7 — memplot discount_pct terhadap quantity untuk menguji apakah diskon benar menaikkan volume, lalu cek apakah profitnya ikut naik',
      'Bivariat — harga vs permintaan, dan rating vs apakah customer kembali membeli',
      'Menandai outlier yang layak dijelaskan di deck akhir, bukan dihapus diam-diam',
    ],
  },
  X06: {
    step: 6,
    questions: ['Q3'],
    title_en: 'Turn the findings into readable charts',
    title_id: 'Ubah temuan menjadi grafik yang mudah dibaca',
    summary_en:
      'You can now pick the right chart for each finding and design it so a stakeholder reads the point in seconds — the revenue trend and the segment story become visual, not tabular.',
    summary_id:
      'Kamu sekarang bisa memilih jenis grafik yang tepat untuk tiap temuan dan mendesainnya agar stakeholder menangkap intinya dalam hitungan detik — tren revenue dan cerita segmen jadi visual, bukan tabel.',
    can_do_en: [
      'Choose the correct chart type per question — trend, composition, comparison, distribution',
      'Chart the 2024–2025 monthly revenue trend with the seasonal peaks annotated',
      'Visualize channel mix and category profit so the winner is obvious without reading numbers',
      'Apply consistent colour, labelling and layout across every chart in the deck',
    ],
    can_do_id: [
      'Memilih jenis grafik yang tepat per pertanyaan — tren, komposisi, perbandingan, distribusi',
      'Membuat grafik tren revenue bulanan 2024–2025 dengan puncak musiman yang diberi anotasi',
      'Memvisualkan bauran channel dan profit kategori agar pemenangnya terlihat tanpa membaca angka',
      'Menerapkan warna, pelabelan, dan tata letak yang konsisten di seluruh grafik dalam deck',
    ],
  },
  X07: {
    step: 7,
    questions: ['Q2', 'Q3', 'Q6'],
    title_en: 'Assemble the interactive dashboard',
    title_id: 'Rakit dashboard interaktif',
    summary_en:
      'You can now put the whole analysis into one interactive Power BI dashboard and publish it — the artefact that goes in your portfolio as a shareable link.',
    summary_id:
      'Kamu sekarang bisa menyatukan seluruh analisis ke dalam satu dashboard Power BI interaktif dan mempublikasikannya — artefak yang masuk ke portofoliomu sebagai tautan yang bisa dibagikan.',
    can_do_en: [
      'Model the four tables with the right relationships (customer_id, product_id, month + channel)',
      'Build pages for revenue trend, channel mix, category profit and marketing ROI',
      'Add slicers so leadership can filter by period, channel and category themselves',
      'Publish the dashboard and keep the link for your portfolio submission',
    ],
    can_do_id: [
      'Memodelkan keempat tabel dengan relasi yang benar (customer_id, product_id, month + channel)',
      'Membuat halaman untuk tren revenue, bauran channel, profit kategori, dan ROI marketing',
      'Menambahkan slicer agar leadership bisa memfilter sendiri per periode, channel, dan kategori',
      'Mempublikasikan dashboard dan menyimpan tautannya untuk submission portofolio',
    ],
  },
  X08: {
    step: 8,
    questions: ['Q1', 'Q3'],
    title_en: 'Reproduce it in Python',
    title_id: 'Reproduksi analisisnya dengan Python',
    summary_en:
      'You can now redo the cleaning and the key aggregations in pandas — which makes the whole analysis repeatable, and proves to a hiring manager that the result was not a one-off spreadsheet.',
    summary_id:
      'Kamu sekarang bisa mengulang proses cleaning dan agregasi utama di pandas — sehingga seluruh analisis bisa diulang, dan membuktikan ke hiring manager bahwa hasilnya bukan spreadsheet sekali jadi.',
    can_do_en: [
      'Read all four sheets with pandas and redo the Session 2 cleaning as code',
      'Reproduce the category, channel and monthly aggregations with groupby',
      'Plot the same charts with Matplotlib or Seaborn',
      'Optionally automate the Excel report output with openpyxl',
    ],
    can_do_id: [
      'Membaca keempat sheet dengan pandas dan mengulang cleaning Sesi 2 dalam bentuk kode',
      'Mereproduksi agregasi kategori, channel, dan bulanan dengan groupby',
      'Membuat grafik yang sama dengan Matplotlib atau Seaborn',
      'Opsional: mengotomasi output laporan Excel dengan openpyxl',
    ],
  },
  X09: {
    step: 9,
    questions: [],
    title_en: 'Accelerate the workflow with AI',
    title_id: 'Percepat alur kerjanya dengan AI',
    summary_en:
      'You can now use an AI or agentic workflow to speed up part of the analysis — and, just as importantly, document how you used it so the work stays yours and stays verifiable.',
    summary_id:
      'Kamu sekarang bisa memakai AI atau alur kerja agentik untuk mempercepat sebagian analisis — dan yang tak kalah penting, mendokumentasikan cara pemakaiannya agar hasilnya tetap milikmu dan bisa diverifikasi.',
    can_do_en: [
      'Generate and then verify SQL for the Seduh tables instead of writing every query by hand',
      'Summarize findings across the eight questions into draft insight statements',
      'Automate a repeatable report step in the pipeline',
      'Write down what you delegated to AI, what you checked yourself, and what you corrected',
    ],
    can_do_id: [
      'Menghasilkan lalu memverifikasi SQL untuk tabel Seduh, alih-alih menulis tiap query manual',
      'Merangkum temuan dari delapan pertanyaan menjadi draf pernyataan insight',
      'Mengotomasi satu langkah pelaporan yang berulang dalam pipeline',
      'Mencatat apa yang didelegasikan ke AI, apa yang kamu periksa sendiri, dan apa yang kamu koreksi',
    ],
  },
  X10: {
    step: 10,
    questions: ['Q5', 'Q6'],
    title_en: 'Segment the customers with RFM',
    title_id: 'Segmentasi customer dengan RFM',
    summary_en:
      'You can now answer the retention half of the brief — score every customer on Recency, Frequency and Monetary, group them into real segments, and recommend a different play for each.',
    summary_id:
      'Kamu sekarang bisa menjawab bagian retensi dari brief — memberi skor Recency, Frequency, dan Monetary untuk tiap customer, mengelompokkannya jadi segmen nyata, dan merekomendasikan strategi berbeda untuk masing-masing.',
    can_do_en: [
      'Compute R, F and M per customer with the snapshot date of 1 January 2026',
      'Q5 — score and segment into Champions, Loyal, At-Risk and Lost, then size each segment by count and value',
      'Q6 — join Customers.acquisition_channel to Marketing_Spend to compare CAC and ROI per channel',
      'Recommend a specific retention action per segment',
    ],
    can_do_id: [
      'Menghitung R, F, dan M per customer dengan tanggal snapshot 1 Januari 2026',
      'Q5 — memberi skor dan segmentasi menjadi Champions, Loyal, At-Risk, dan Lost, lalu mengukur besar dan nilai tiap segmen',
      'Q6 — men-join Customers.acquisition_channel ke Marketing_Spend untuk membandingkan CAC dan ROI per channel',
      'Merekomendasikan aksi retensi spesifik untuk tiap segmen',
    ],
  },
  X11: {
    step: 11,
    questions: ['Q8'],
    title_en: 'Build the stakeholder narrative',
    title_id: 'Susun narasi untuk stakeholder',
    summary_en:
      'You can now turn ten sessions of analysis into a story Seduh\'s leadership will actually act on — data leading to insight leading to a recommendation, not a pile of charts.',
    summary_id:
      'Kamu sekarang bisa mengubah sepuluh sesi analisis menjadi cerita yang benar-benar ditindaklanjuti leadership Seduh — data menuju insight menuju rekomendasi, bukan tumpukan grafik.',
    can_do_en: [
      'Structure the deck as data → insight → recommendation for each of the eight questions',
      'Lead with the answer, not the method — one message per slide',
      'Q8 — argue a concrete path from IDR 4.4B to the 5.5B target and show the arithmetic behind it',
      'Anticipate leadership\'s pushback: what would have to be true for the plan to work',
    ],
    can_do_id: [
      'Menyusun deck dengan pola data → insight → rekomendasi untuk tiap dari delapan pertanyaan',
      'Membuka dengan jawaban, bukan metode — satu pesan per slide',
      'Q8 — mengargumentasikan jalur konkret dari IDR 4,4 M ke target 5,5 M beserta hitungannya',
      'Mengantisipasi sanggahan leadership: apa yang harus benar agar rencana ini berhasil',
    ],
  },
  X12: {
    step: 12,
    questions: ['Q8'],
    title_en: 'Package the portfolio piece',
    title_id: 'Kemas menjadi karya portofolio',
    summary_en:
      'Everything is unlocked. You can now assemble the seven deliverables the brief asks for into one professional portfolio piece — the artefact you show in interviews.',
    summary_id:
      'Semuanya sudah terbuka. Kamu sekarang bisa merangkai tujuh deliverable yang diminta brief menjadi satu karya portofolio profesional — artefak yang kamu tunjukkan saat interview.',
    can_do_en: [
      'Collect all seven deliverables: cleaned dataset, SQL scripts, pivot analysis, dashboard link, Python notebook, deck, executive summary',
      'Write the one-page executive summary answering Q8',
      'Document your assumptions — completed-orders-only revenue, the 1 Jan 2026 snapshot, and every cleaning decision you made',
      'Publish it so a recruiter can open it without asking you for access',
    ],
    can_do_id: [
      'Mengumpulkan tujuh deliverable: dataset bersih, skrip SQL, analisis pivot, tautan dashboard, notebook Python, deck, ringkasan eksekutif',
      'Menulis ringkasan eksekutif satu halaman yang menjawab Q8',
      'Mendokumentasikan asumsimu — revenue hanya dari order Completed, snapshot 1 Jan 2026, dan setiap keputusan cleaning yang kamu ambil',
      'Mempublikasikannya agar rekruter bisa membuka tanpa perlu meminta akses padamu',
    ],
  },
}

/** Steps unlocked up to and including the given session, in order. */
export function stepsUnlockedThrough(sessionNumber: string): ProjectStep[] {
  const current = FINAL_PROJECT_STEPS[sessionNumber]
  if (!current) return []
  return Object.values(FINAL_PROJECT_STEPS)
    .filter(s => s.step <= current.step)
    .sort((a, b) => a.step - b.step)
}
