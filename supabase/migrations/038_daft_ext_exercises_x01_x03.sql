-- ============================================================
-- 038: Practice exercises for the "Data Analyst Fast Track · 2026"
--      program — PILOT batch X01–X03. Matching exercises
--      (2 easy / 1 medium / 1 hard each), following migration 028.
--      starter_code holds {"pairs":[{left,right}]}; test_cases list
--      each correct "right" in pair order. Idempotent via NOT EXISTS.
-- ============================================================

-- ══════════════════════════════════════════════════════════
-- X01 — Business Acumen dan Basic Statistics
-- ══════════════════════════════════════════════════════════
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Statistics & What They Measure', 'Statistik & Yang Diukurnya',
  'Match each statistic to what it measures.', 'Cocokkan setiap statistik dengan yang diukurnya.',
  '{"pairs":[{"left":"Mean","right":"The average of all values"},{"left":"Median","right":"The middle value when sorted"},{"left":"Mode","right":"The most frequent value"},{"left":"Range","right":"The largest minus the smallest"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"The average of all values","description_en":"Mean matched","description_id":"Mean cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"The middle value when sorted","description_en":"Median matched","description_id":"Median cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The most frequent value","description_en":"Mode matched","description_id":"Modus cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"The largest minus the smallest","description_en":"Range matched","description_id":"Range cocok","points":25}]',
  '["The mean is the arithmetic average","Range is about spread, not center"]','["Mean adalah rata-rata aritmetika","Range soal sebaran, bukan pusat"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='X01'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Statistics & What They Measure');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Business Acumen Concepts', 'Konsep Business Acumen',
  'Match each concept to its definition.', 'Cocokkan setiap konsep dengan definisinya.',
  '{"pairs":[{"left":"Leading indicator","right":"Predicts an outcome before it happens"},{"left":"Lagging indicator","right":"Confirms an outcome after it happened"},{"left":"Problem statement","right":"A specific, measurable framing of the question"},{"left":"Outlier","right":"A value far from the rest of the data"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Predicts an outcome before it happens","description_en":"Leading matched","description_id":"Leading cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Confirms an outcome after it happened","description_en":"Lagging matched","description_id":"Lagging cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"A specific, measurable framing of the question","description_en":"Problem statement matched","description_id":"Problem statement cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A value far from the rest of the data","description_en":"Outlier matched","description_id":"Outlier cocok","points":25}]',
  '["Leading metrics move first","An outlier sits far from the others"]','["Metrik leading bergerak lebih dulu","Outlier jauh dari yang lain"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='X01'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Business Acumen Concepts');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Excel Statistics Formulas', 'Rumus Statistik Excel',
  'Match each Excel formula to its purpose.', 'Cocokkan setiap rumus Excel dengan kegunaannya.',
  '{"pairs":[{"left":"=AVERAGE(A2:A8)","right":"Mean of the range"},{"left":"=MEDIAN(A2:A8)","right":"Middle value of the range"},{"left":"=STDEV.S(A2:A8)","right":"Spread around the mean"},{"left":"=MODE.SNGL(A2:A8)","right":"Most frequent value"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Mean of the range","description_en":"AVERAGE matched","description_id":"AVERAGE cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Middle value of the range","description_en":"MEDIAN matched","description_id":"MEDIAN cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Spread around the mean","description_en":"STDEV matched","description_id":"STDEV cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Most frequent value","description_en":"MODE matched","description_id":"MODE cocok","points":25}]',
  '["STDEV is about spread","MODE finds the most common value"]','["STDEV soal sebaran","MODE cari nilai paling umum"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='X01'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Excel Statistics Formulas');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Which Measure Fits the Scenario', 'Ukuran Mana untuk Skenario Ini',
  'Match each scenario to the best statistic to use.', 'Cocokkan setiap skenario dengan statistik terbaik.',
  '{"pairs":[{"left":"Income data with a few very high earners","right":"Median"},{"left":"The most common shirt size sold","right":"Mode"},{"left":"How consistent daily sales are","right":"Standard deviation"},{"left":"Symmetric test scores with no extremes","right":"Mean"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Median","description_en":"Skewed income matched","description_id":"Pendapatan miring cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Mode","description_en":"Most common matched","description_id":"Paling umum cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Standard deviation","description_en":"Consistency matched","description_id":"Konsistensi cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Mean","description_en":"Symmetric matched","description_id":"Simetris cocok","points":25}]',
  '["Outliers push you toward the median","Consistency is about spread"]','["Outlier mendorong ke median","Konsistensi soal sebaran"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='X01'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Which Measure Fits the Scenario');

-- ══════════════════════════════════════════════════════════
-- X02 — Membersihkan dan Merapihkan Data
-- ══════════════════════════════════════════════════════════
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Text Functions & Their Purpose', 'Fungsi Teks & Kegunaannya',
  'Match each text function to what it does.', 'Cocokkan setiap fungsi teks dengan kegunaannya.',
  '{"pairs":[{"left":"TRIM","right":"Removes extra spaces"},{"left":"CONCAT","right":"Joins text together"},{"left":"LEFT","right":"Extracts characters from the left"},{"left":"PROPER","right":"Capitalizes the first letter of each word"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Removes extra spaces","description_en":"TRIM matched","description_id":"TRIM cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Joins text together","description_en":"CONCAT matched","description_id":"CONCAT cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Extracts characters from the left","description_en":"LEFT matched","description_id":"LEFT cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Capitalizes the first letter of each word","description_en":"PROPER matched","description_id":"PROPER cocok","points":25}]',
  '["TRIM is about whitespace","PROPER changes capitalization"]','["TRIM soal spasi","PROPER mengubah kapitalisasi"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='X02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Text Functions & Their Purpose');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Cleaning Tasks & Tools', 'Tugas Pembersihan & Alatnya',
  'Match each cleaning task to the right tool.', 'Cocokkan setiap tugas pembersihan dengan alat yang tepat.',
  '{"pairs":[{"left":"Remove duplicate rows","right":"Data > Remove Duplicates"},{"left":"Select all blank cells","right":"Go To Special > Blanks"},{"left":"Flag rows that repeat","right":"COUNTIF > 1"},{"left":"Hide formula errors","right":"IFERROR"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Data > Remove Duplicates","description_en":"Remove duplicates matched","description_id":"Hapus duplikat cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Go To Special > Blanks","description_en":"Find blanks matched","description_id":"Cari kosong cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"COUNTIF > 1","description_en":"Flag duplicates matched","description_id":"Tandai duplikat cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"IFERROR","description_en":"Handle errors matched","description_id":"Tangani error cocok","points":25}]',
  '["COUNTIF counts occurrences","IFERROR wraps a formula"]','["COUNTIF menghitung kemunculan","IFERROR membungkus rumus"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='X02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Cleaning Tasks & Tools');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Formula to Result', 'Rumus ke Hasil',
  'Match each formula to the value it returns.', 'Cocokkan setiap rumus dengan nilai yang dihasilkan.',
  '{"pairs":[{"left":"=TRIM(\"  Budi  \")","right":"Budi"},{"left":"=LEFT(\"INV-2024\",3)","right":"INV"},{"left":"=RIGHT(\"INV-2024\",4)","right":"2024"},{"left":"=CONCAT(\"A\",\"B\")","right":"AB"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Budi","description_en":"TRIM result","description_id":"Hasil TRIM","points":25},{"id":"tc2","validation_type":"matching","expected_value":"INV","description_en":"LEFT result","description_id":"Hasil LEFT","points":25},{"id":"tc3","validation_type":"matching","expected_value":"2024","description_en":"RIGHT result","description_id":"Hasil RIGHT","points":25},{"id":"tc4","validation_type":"matching","expected_value":"AB","description_en":"CONCAT result","description_id":"Hasil CONCAT","points":25}]',
  '["LEFT takes characters from the start","RIGHT takes them from the end"]','["LEFT ambil dari awal","RIGHT ambil dari akhir"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='X02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Formula to Result');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Error & Its Fix', 'Error & Solusinya',
  'Match each Excel error to the fix.', 'Cocokkan setiap error Excel dengan solusinya.',
  '{"pairs":[{"left":"#N/A from a lookup","right":"IFNA()"},{"left":"#DIV/0!","right":"IFERROR(a/b, 0)"},{"left":"Number stored as text","right":"VALUE()"},{"left":"#REF!","right":"Rebuild the reference"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"IFNA()","description_en":"N/A fix matched","description_id":"Solusi N/A cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"IFERROR(a/b, 0)","description_en":"Div zero fix matched","description_id":"Solusi bagi nol cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"VALUE()","description_en":"Text-number fix matched","description_id":"Solusi angka-teks cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Rebuild the reference","description_en":"REF fix matched","description_id":"Solusi REF cocok","points":25}]',
  '["IFNA targets only #N/A","#REF means a reference was deleted"]','["IFNA khusus #N/A","#REF berarti referensi terhapus"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='X02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Error & Its Fix');

-- ══════════════════════════════════════════════════════════
-- X03 — Pivot Table untuk Dapatkan Insight
-- ══════════════════════════════════════════════════════════
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Pivot Table Zones', 'Zona Pivot Table',
  'Match each pivot zone to its role.', 'Cocokkan setiap zona pivot dengan perannya.',
  '{"pairs":[{"left":"Rows","right":"Categories down the side"},{"left":"Columns","right":"Categories across the top"},{"left":"Values","right":"The numbers to aggregate"},{"left":"Filters","right":"Slice the whole table"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Categories down the side","description_en":"Rows matched","description_id":"Rows cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Categories across the top","description_en":"Columns matched","description_id":"Columns cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The numbers to aggregate","description_en":"Values matched","description_id":"Values cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Slice the whole table","description_en":"Filters matched","description_id":"Filters cocok","points":25}]',
  '["Values holds the numbers","Filters affect the entire pivot"]','["Values menampung angka","Filters memengaruhi seluruh pivot"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='X03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Pivot Table Zones');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Aggregation & What It Answers', 'Agregasi & Yang Dijawabnya',
  'Match each aggregation to the question it answers.', 'Cocokkan setiap agregasi dengan pertanyaan yang dijawab.',
  '{"pairs":[{"left":"Sum","right":"Total revenue"},{"left":"Count","right":"Number of transactions"},{"left":"Average","right":"Average basket size"},{"left":"Max","right":"Largest single sale"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Total revenue","description_en":"Sum matched","description_id":"Sum cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Number of transactions","description_en":"Count matched","description_id":"Count cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Average basket size","description_en":"Average matched","description_id":"Average cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Largest single sale","description_en":"Max matched","description_id":"Max cocok","points":25}]',
  '["Count is about how many rows","Max is the biggest value"]','["Count soal berapa banyak baris","Max adalah nilai terbesar"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='X03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Aggregation & What It Answers');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Show Values As', 'Show Values As',
  'Match each "Show Values As" option to its meaning.', 'Cocokkan setiap opsi "Show Values As" dengan artinya.',
  '{"pairs":[{"left":"% of Grand Total","right":"Share of the whole table"},{"left":"% of Column Total","right":"Share within each column"},{"left":"Running Total","right":"Cumulative value over time"},{"left":"Difference From","right":"Change versus a baseline"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Share of the whole table","description_en":"Grand total matched","description_id":"Grand total cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Share within each column","description_en":"Column total matched","description_id":"Column total cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Cumulative value over time","description_en":"Running total matched","description_id":"Running total cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Change versus a baseline","description_en":"Difference from matched","description_id":"Difference from cocok","points":25}]',
  '["Running total accumulates","Difference From compares to a base"]','["Running total menumpuk","Difference From bandingkan ke basis"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='X03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Show Values As');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Task to Pivot Feature', 'Tugas ke Fitur Pivot',
  'Match each task to the pivot feature that does it.', 'Cocokkan setiap tugas dengan fitur pivot yang tepat.',
  '{"pairs":[{"left":"Roll daily dates up to months","right":"Grouping"},{"left":"Add profit = revenue - cost","right":"Calculated Field"},{"left":"Clickable filter buttons","right":"Slicer"},{"left":"Update after the source changes","right":"Refresh"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Grouping","description_en":"Grouping matched","description_id":"Grouping cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Calculated Field","description_en":"Calculated field matched","description_id":"Calculated field cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Slicer","description_en":"Slicer matched","description_id":"Slicer cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Refresh","description_en":"Refresh matched","description_id":"Refresh cocok","points":25}]',
  '["Grouping rolls dates up","A slicer is a set of buttons"]','["Grouping menggulung tanggal","Slicer adalah kumpulan tombol"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='X03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Task to Pivot Feature');
