-- ============================================================
-- 028: Exercises for Data Analyst Fast Track (F01–F11)
--   * F08 (SQL): reuse the proven Session-04 SQL exercise set
--     (SELECT, Filter, Aggregation) by copying with a new session_id.
--   * F01–F07, F09–F11 (concept sessions): matching exercises
--     (2 easy, 1 medium, 1 hard each), following migration 014.
-- Idempotent: each insert guards against duplicates.
-- ============================================================

-- ── F08 — copy Session 04 SQL exercises ────────────────────
INSERT INTO public.exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id,
   difficulty, dataset_name, order_num)
SELECT
  (SELECT id FROM public.sessions WHERE session_number = 'F08'),
  e.type, e.title_en, e.title_id, e.description_en, e.description_id,
  e.starter_code, e.solution_code, e.test_cases, e.hints_en, e.hints_id,
  e.difficulty, e.dataset_name, e.order_num
FROM public.exercises e
WHERE e.session_id = (SELECT id FROM public.sessions WHERE session_number = '04')
  AND NOT EXISTS (
    SELECT 1 FROM public.exercises x
    WHERE x.session_id = (SELECT id FROM public.sessions WHERE session_number = 'F08')
      AND x.title_en = e.title_en
  );

-- ── Matching exercises for concept sessions ────────────────
-- Helper note: starter_code holds {"pairs":[{left,right}]} and
-- test_cases lists each correct "right" value in pair order.

-- ============================================================
-- F01 — Cleaning and Shaping Incoming Data
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Text Functions & Their Purpose', 'Fungsi Teks & Kegunaannya',
  'Match each text function to what it does.', 'Cocokkan setiap fungsi teks dengan kegunaannya.',
  '{"pairs":[{"left":"TRIM","right":"Removes extra spaces"},{"left":"CONCAT","right":"Joins text together"},{"left":"LEFT","right":"Extracts characters from the left"},{"left":"PROPER","right":"Capitalizes the first letter of each word"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Removes extra spaces","description_en":"TRIM matched","description_id":"TRIM cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Joins text together","description_en":"CONCAT matched","description_id":"CONCAT cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Extracts characters from the left","description_en":"LEFT matched","description_id":"LEFT cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Capitalizes the first letter of each word","description_en":"PROPER matched","description_id":"PROPER cocok","points":25}]',
  '["TRIM is about whitespace","PROPER changes capitalization"]','["TRIM soal spasi","PROPER mengubah kapitalisasi"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F01'
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
FROM public.sessions s WHERE s.session_number='F01'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Cleaning Tasks & Tools');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Formula to Result', 'Rumus ke Hasil',
  'Match each formula to the value it returns.', 'Cocokkan setiap rumus dengan nilai yang dihasilkan.',
  '{"pairs":[{"left":"=TRIM(\"  Budi  \")","right":"Budi"},{"left":"=LEFT(\"INV-2024\",3)","right":"INV"},{"left":"=RIGHT(\"INV-2024\",4)","right":"2024"},{"left":"=PROPER(\"budi santoso\")","right":"Budi Santoso"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Budi","description_en":"TRIM result","description_id":"Hasil TRIM","points":25},{"id":"tc2","validation_type":"matching","expected_value":"INV","description_en":"LEFT result","description_id":"Hasil LEFT","points":25},{"id":"tc3","validation_type":"matching","expected_value":"2024","description_en":"RIGHT result","description_id":"Hasil RIGHT","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Budi Santoso","description_en":"PROPER result","description_id":"Hasil PROPER","points":25}]',
  '["LEFT takes characters from the start","RIGHT takes them from the end"]','["LEFT ambil dari awal","RIGHT ambil dari akhir"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F01'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Formula to Result');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Data Problem & Fix', 'Masalah Data & Solusinya',
  'Match each data problem to the function that fixes it.', 'Cocokkan setiap masalah data dengan fungsi yang memperbaikinya.',
  '{"pairs":[{"left":"Number stored as text","right":"VALUE()"},{"left":"#N/A from a VLOOKUP","right":"IFNA()"},{"left":"Inconsistent capitalization","right":"PROPER()"},{"left":"Hidden trailing spaces","right":"TRIM()"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"VALUE()","description_en":"Text-to-number matched","description_id":"Teks-ke-angka cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"IFNA()","description_en":"NA handling matched","description_id":"Penanganan NA cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"PROPER()","description_en":"Capitalization matched","description_id":"Kapitalisasi cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"TRIM()","description_en":"Spaces matched","description_id":"Spasi cocok","points":25}]',
  '["IFNA targets only #N/A","VALUE converts text to numbers"]','["IFNA khusus #N/A","VALUE ubah teks jadi angka"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F01'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Data Problem & Fix');

-- ============================================================
-- F02 — Presenting Data to Stakeholder Needs
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Statistic Functions', 'Fungsi Statistik',
  'Match each function to its meaning.', 'Cocokkan setiap fungsi dengan artinya.',
  '{"pairs":[{"left":"SUM","right":"Total of values"},{"left":"COUNT","right":"Counts numeric cells"},{"left":"AVERAGE","right":"Mean of values"},{"left":"MEDIAN","right":"Middle value"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Total of values","description_en":"SUM matched","description_id":"SUM cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Counts numeric cells","description_en":"COUNT matched","description_id":"COUNT cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Mean of values","description_en":"AVERAGE matched","description_id":"AVERAGE cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Middle value","description_en":"MEDIAN matched","description_id":"MEDIAN cocok","points":25}]',
  '["COUNT ignores text","MEDIAN is the middle, not the average"]','["COUNT abaikan teks","MEDIAN itu nilai tengah, bukan rata-rata"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Statistic Functions');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Cell Reference Types', 'Jenis Referensi Sel',
  'Match each reference style to its behavior.', 'Cocokkan setiap gaya referensi dengan perilakunya.',
  '{"pairs":[{"left":"A1","right":"Relative - shifts when copied"},{"left":"$A$1","right":"Absolute - fully locked"},{"left":"A$1","right":"Row locked only"},{"left":"$A1","right":"Column locked only"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Relative - shifts when copied","description_en":"Relative matched","description_id":"Relatif cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Absolute - fully locked","description_en":"Absolute matched","description_id":"Absolut cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Row locked only","description_en":"Row lock matched","description_id":"Kunci baris cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Column locked only","description_en":"Column lock matched","description_id":"Kunci kolom cocok","points":25}]',
  '["The $ sign locks what follows it","$ before the number locks the row"]','["Tanda $ mengunci yang mengikutinya","$ sebelum angka mengunci baris"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Cell Reference Types');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Conditional Formulas', 'Rumus Kondisional',
  'Match each conditional function to its job.', 'Cocokkan setiap fungsi kondisional dengan tugasnya.',
  '{"pairs":[{"left":"SUMIF","right":"Sum rows matching one criterion"},{"left":"COUNTIF","right":"Count rows matching one criterion"},{"left":"AVERAGEIF","right":"Average rows matching one criterion"},{"left":"SUMIFS","right":"Sum rows matching multiple criteria"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Sum rows matching one criterion","description_en":"SUMIF matched","description_id":"SUMIF cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Count rows matching one criterion","description_en":"COUNTIF matched","description_id":"COUNTIF cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Average rows matching one criterion","description_en":"AVERAGEIF matched","description_id":"AVERAGEIF cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Sum rows matching multiple criteria","description_en":"SUMIFS matched","description_id":"SUMIFS cocok","points":25}]',
  '["The S suffix means multiple criteria","COUNT vs SUM: counting vs totaling"]','["Akhiran S berarti banyak kriteria","COUNT vs SUM: menghitung vs menjumlah"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Conditional Formulas');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Wildcards & Dynamic Functions', 'Wildcard & Fungsi Dinamis',
  'Match each pattern to what it matches.', 'Cocokkan setiap pola dengan yang dicocokkannya.',
  '{"pairs":[{"left":"Jakarta*","right":"Starts with Jakarta"},{"left":"*Mouse*","right":"Contains the word Mouse"},{"left":"A?","right":"A plus exactly one character"},{"left":"FILTER()","right":"Returns matching rows dynamically"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Starts with Jakarta","description_en":"Prefix matched","description_id":"Awalan cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Contains the word Mouse","description_en":"Contains matched","description_id":"Mengandung cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"A plus exactly one character","description_en":"Single char matched","description_id":"Satu karakter cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Returns matching rows dynamically","description_en":"FILTER matched","description_id":"FILTER cocok","points":25}]',
  '["Asterisk means many characters","Question mark means exactly one"]','["Bintang berarti banyak karakter","Tanda tanya berarti tepat satu"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F02'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Wildcards & Dynamic Functions');

-- ============================================================
-- F03 — Joining & Highlighting Datasets
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Lookup Functions', 'Fungsi Lookup',
  'Match each lookup function to its behavior.', 'Cocokkan setiap fungsi lookup dengan perilakunya.',
  '{"pairs":[{"left":"VLOOKUP","right":"Vertical lookup, looks right only"},{"left":"HLOOKUP","right":"Horizontal lookup across rows"},{"left":"XLOOKUP","right":"Flexible lookup in either direction"},{"left":"INDEX-MATCH","right":"Find position, then return value"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Vertical lookup, looks right only","description_en":"VLOOKUP matched","description_id":"VLOOKUP cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Horizontal lookup across rows","description_en":"HLOOKUP matched","description_id":"HLOOKUP cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Flexible lookup in either direction","description_en":"XLOOKUP matched","description_id":"XLOOKUP cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Find position, then return value","description_en":"INDEX-MATCH matched","description_id":"INDEX-MATCH cocok","points":25}]',
  '["V is for vertical, H for horizontal","INDEX-MATCH is a two-step combo"]','["V untuk vertikal, H untuk horizontal","INDEX-MATCH itu kombinasi dua langkah"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Lookup Functions');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Lookup Capabilities', 'Kemampuan Lookup',
  'Match each feature to its capability.', 'Cocokkan setiap fitur dengan kemampuannya.',
  '{"pairs":[{"left":"XLOOKUP can","right":"Look to the left"},{"left":"VLOOKUP can only","right":"Look to the right"},{"left":"Conditional Formatting","right":"Highlight cells by condition"},{"left":"Exact match argument","right":"FALSE or 0"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Look to the left","description_en":"XLOOKUP matched","description_id":"XLOOKUP cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Look to the right","description_en":"VLOOKUP matched","description_id":"VLOOKUP cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Highlight cells by condition","description_en":"CF matched","description_id":"CF cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"FALSE or 0","description_en":"Exact match matched","description_id":"Cocok persis cocok","points":25}]',
  '["VLOOKUP is limited to one direction","Exact match uses FALSE"]','["VLOOKUP terbatas satu arah","Cocok persis pakai FALSE"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Lookup Capabilities');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'INDEX-MATCH & Formatting Roles', 'Peran INDEX-MATCH & Formatting',
  'Match each function to its specific role.', 'Cocokkan setiap fungsi dengan perannya.',
  '{"pairs":[{"left":"MATCH","right":"Finds the position of a value"},{"left":"INDEX","right":"Returns the value at a position"},{"left":"Data Bars","right":"Draws an in-cell bar"},{"left":"Color Scales","right":"Colors cells like a heatmap"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Finds the position of a value","description_en":"MATCH matched","description_id":"MATCH cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Returns the value at a position","description_en":"INDEX matched","description_id":"INDEX cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Draws an in-cell bar","description_en":"Data Bars matched","description_id":"Data Bars cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Colors cells like a heatmap","description_en":"Color Scales matched","description_id":"Color Scales cocok","points":25}]',
  '["MATCH returns a number (position)","INDEX fetches by position"]','["MATCH kembalikan angka (posisi)","INDEX ambil berdasarkan posisi"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='INDEX-MATCH & Formatting Roles');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Pick the Right Tool', 'Pilih Alat yang Tepat',
  'Match each scenario to the best tool.', 'Cocokkan setiap skenario dengan alat terbaik.',
  '{"pairs":[{"left":"Look up a value to the left","right":"XLOOKUP"},{"left":"Works in all versions and fast on big data","right":"INDEX-MATCH"},{"left":"Highlight rows where margin < 10%","right":"Custom formula formatting"},{"left":"Simple right-side lookup in a legacy file","right":"VLOOKUP"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"XLOOKUP","description_en":"Left lookup matched","description_id":"Lookup kiri cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"INDEX-MATCH","description_en":"Universal matched","description_id":"Universal cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Custom formula formatting","description_en":"Row highlight matched","description_id":"Sorot baris cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"VLOOKUP","description_en":"Legacy matched","description_id":"Legacy cocok","points":25}]',
  '["Left lookup rules out VLOOKUP","Row-level highlight needs a custom formula"]','["Lookup kiri menyingkirkan VLOOKUP","Sorot per baris butuh rumus kustom"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F03'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Pick the Right Tool');

-- ============================================================
-- F04 — Pivot Tables for Insight
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Pivot Table Areas', 'Area Pivot Table',
  'Match each pivot area to its function.', 'Cocokkan setiap area pivot dengan fungsinya.',
  '{"pairs":[{"left":"Rows","right":"Vertical categories"},{"left":"Columns","right":"Horizontal categories"},{"left":"Values","right":"The numbers being summarized"},{"left":"Filters","right":"An overall filter"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Vertical categories","description_en":"Rows matched","description_id":"Rows cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Horizontal categories","description_en":"Columns matched","description_id":"Columns cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The numbers being summarized","description_en":"Values matched","description_id":"Values cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"An overall filter","description_en":"Filters matched","description_id":"Filters cocok","points":25}]',
  '["Rows go down, Columns go across","Values hold the numbers"]','["Rows ke bawah, Columns ke samping","Values berisi angka"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Pivot Table Areas');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Pivot Aggregations', 'Agregasi Pivot',
  'Match each aggregation to its meaning.', 'Cocokkan setiap agregasi dengan artinya.',
  '{"pairs":[{"left":"Sum","right":"Total"},{"left":"Count","right":"Number of rows"},{"left":"Average","right":"Mean"},{"left":"Max","right":"Largest value"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Total","description_en":"Sum matched","description_id":"Sum cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Number of rows","description_en":"Count matched","description_id":"Count cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Mean","description_en":"Average matched","description_id":"Average cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Largest value","description_en":"Max matched","description_id":"Max cocok","points":25}]',
  '["Count is about how many","Max is the biggest"]','["Count soal berapa banyak","Max yang terbesar"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Pivot Aggregations');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Advanced Pivot Features', 'Fitur Pivot Lanjutan',
  'Match each feature to its purpose.', 'Cocokkan setiap fitur dengan tujuannya.',
  '{"pairs":[{"left":"Grouping","right":"Roll dates into months or quarters"},{"left":"Calculated Field","right":"A custom formula like margin"},{"left":"Slicer","right":"Interactive filter buttons"},{"left":"Timeline","right":"A slicer just for dates"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Roll dates into months or quarters","description_en":"Grouping matched","description_id":"Grouping cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"A custom formula like margin","description_en":"Calculated Field matched","description_id":"Calculated Field cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Interactive filter buttons","description_en":"Slicer matched","description_id":"Slicer cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A slicer just for dates","description_en":"Timeline matched","description_id":"Timeline cocok","points":25}]',
  '["Timeline is date-specific","Calculated Field adds new math"]','["Timeline khusus tanggal","Calculated Field menambah perhitungan"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Advanced Pivot Features');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Show Values As', 'Show Values As',
  'Match each Show Values As option to its result.', 'Cocokkan setiap opsi Show Values As dengan hasilnya.',
  '{"pairs":[{"left":"% of Grand Total","right":"Each row contribution share"},{"left":"Running Total","right":"Cumulative running sum"},{"left":"% Difference From","right":"Growth vs a prior period"},{"left":"% of Column Total","right":"Share within the column"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Each row contribution share","description_en":"Grand total matched","description_id":"Grand total cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Cumulative running sum","description_en":"Running total matched","description_id":"Running total cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Growth vs a prior period","description_en":"Difference matched","description_id":"Selisih cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Share within the column","description_en":"Column total matched","description_id":"Total kolom cocok","points":25}]',
  '["Running total accumulates","% Difference compares periods"]','["Running total mengakumulasi","% Difference membandingkan periode"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F04'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Show Values As');

-- ============================================================
-- F05 — Exploratory Data Analysis (EDA)
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'EDA Concepts', 'Konsep EDA',
  'Match each EDA concept to its definition.', 'Cocokkan setiap konsep EDA dengan definisinya.',
  '{"pairs":[{"left":"Univariate","right":"Analysis of one variable"},{"left":"Bivariate","right":"Relationship between two variables"},{"left":"Outlier","right":"An extreme value"},{"left":"Correlation","right":"Strength of a linear relationship"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Analysis of one variable","description_en":"Univariate matched","description_id":"Univariate cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Relationship between two variables","description_en":"Bivariate matched","description_id":"Bivariate cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"An extreme value","description_en":"Outlier matched","description_id":"Outlier cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Strength of a linear relationship","description_en":"Correlation matched","description_id":"Korelasi cocok","points":25}]',
  '["Uni = one, Bi = two","Outliers sit far from the rest"]','["Uni = satu, Bi = dua","Outlier jauh dari yang lain"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F05'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='EDA Concepts');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Statistical Measures', 'Ukuran Statistik',
  'Match each measure to its category.', 'Cocokkan setiap ukuran dengan kategorinya.',
  '{"pairs":[{"left":"Mean","right":"Central tendency"},{"left":"Standard deviation","right":"Spread"},{"left":"Median","right":"Central tendency"},{"left":"IQR","right":"Spread"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Central tendency","description_en":"Mean matched","description_id":"Mean cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Spread","description_en":"Std dev matched","description_id":"Std dev cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Central tendency","description_en":"Median matched","description_id":"Median cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Spread","description_en":"IQR matched","description_id":"IQR cocok","points":25}]',
  '["Mean and median describe the center","Std dev and IQR describe spread"]','["Mean dan median menggambarkan pusat","Std dev dan IQR menggambarkan sebaran"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F05'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Statistical Measures');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Choose the Analysis Tool', 'Pilih Alat Analisis',
  'Match each variable pairing to the right tool.', 'Cocokkan setiap pasangan variabel dengan alat yang tepat.',
  '{"pairs":[{"left":"Numeric vs Numeric","right":"Scatter plot"},{"left":"Categorical vs Numeric","right":"Box plot"},{"left":"Categorical vs Categorical","right":"Crosstab"},{"left":"One numeric distribution","right":"Histogram"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Scatter plot","description_en":"Num-num matched","description_id":"Num-num cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Box plot","description_en":"Cat-num matched","description_id":"Cat-num cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Crosstab","description_en":"Cat-cat matched","description_id":"Cat-cat cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Histogram","description_en":"Distribution matched","description_id":"Distribusi cocok","points":25}]',
  '["Scatter shows two numerics","Histogram shows one distribution"]','["Scatter untuk dua numerik","Histogram untuk satu distribusi"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F05'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Choose the Analysis Tool');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Reading Correlation Values', 'Membaca Nilai Korelasi',
  'Match each correlation value to its meaning.', 'Cocokkan setiap nilai korelasi dengan artinya.',
  '{"pairs":[{"left":"+1","right":"Perfect positive relationship"},{"left":"-1","right":"Perfect negative relationship"},{"left":"0","right":"No linear relationship"},{"left":"0.8","right":"Strong positive relationship"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Perfect positive relationship","description_en":"+1 matched","description_id":"+1 cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Perfect negative relationship","description_en":"-1 matched","description_id":"-1 cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"No linear relationship","description_en":"0 matched","description_id":"0 cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Strong positive relationship","description_en":"0.8 matched","description_id":"0.8 cocok","points":25}]',
  '["Sign shows direction, size shows strength","0 means no linear link"]','["Tanda tunjukkan arah, besaran tunjukkan kekuatan","0 berarti tidak ada hubungan linier"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F05'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Reading Correlation Values');

-- ============================================================
-- F06 — Data Visualization
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Chart Selection', 'Pemilihan Chart',
  'Match each goal to the best chart.', 'Cocokkan setiap tujuan dengan chart terbaik.',
  '{"pairs":[{"left":"Compare values","right":"Bar chart"},{"left":"Trend over time","right":"Line chart"},{"left":"Composition","right":"Pie chart"},{"left":"Relationship","right":"Scatter plot"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Bar chart","description_en":"Compare matched","description_id":"Bandingkan cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Line chart","description_en":"Trend matched","description_id":"Tren cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Pie chart","description_en":"Composition matched","description_id":"Komposisi cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Scatter plot","description_en":"Relationship matched","description_id":"Hubungan cocok","points":25}]',
  '["Lines show time","Scatter shows relationships"]','["Garis untuk waktu","Scatter untuk hubungan"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F06'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Chart Selection');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Visualization Principles', 'Prinsip Visualisasi',
  'Match each principle to its rule.', 'Cocokkan setiap prinsip dengan aturannya.',
  '{"pairs":[{"left":"Clarity","right":"One chart, one message"},{"left":"Accuracy","right":"Bar charts start at zero"},{"left":"Simplicity","right":"Remove chart junk"},{"left":"Context","right":"Add titles and labels"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"One chart, one message","description_en":"Clarity matched","description_id":"Kejelasan cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Bar charts start at zero","description_en":"Accuracy matched","description_id":"Akurasi cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Remove chart junk","description_en":"Simplicity matched","description_id":"Kesederhanaan cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Add titles and labels","description_en":"Context matched","description_id":"Konteks cocok","points":25}]',
  '["Truncated axes mislead","Chart junk hurts simplicity"]','["Sumbu terpotong menyesatkan","Chart junk merusak kesederhanaan"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F06'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Visualization Principles');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Dashboard Elements', 'Elemen Dashboard',
  'Match each element to its purpose.', 'Cocokkan setiap elemen dengan tujuannya.',
  '{"pairs":[{"left":"PivotChart","right":"A chart linked to a pivot table"},{"left":"Slicer","right":"An interactive filter"},{"left":"Scorecard","right":"A single KPI value"},{"left":"Report Connections","right":"One slicer filters many charts"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"A chart linked to a pivot table","description_en":"PivotChart matched","description_id":"PivotChart cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"An interactive filter","description_en":"Slicer matched","description_id":"Slicer cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"A single KPI value","description_en":"Scorecard matched","description_id":"Scorecard cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"One slicer filters many charts","description_en":"Connections matched","description_id":"Connections cocok","points":25}]',
  '["A scorecard shows one number","Report Connections links a slicer to many pivots"]','["Scorecard menampilkan satu angka","Report Connections menautkan slicer ke banyak pivot"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F06'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Dashboard Elements');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Match Data to Chart', 'Cocokkan Data ke Chart',
  'Match each data shape to the best chart.', 'Cocokkan setiap bentuk data dengan chart terbaik.',
  '{"pairs":[{"left":"Distribution of one numeric","right":"Histogram"},{"left":"Part-to-whole over few categories","right":"Stacked bar"},{"left":"Geographic data","right":"Map"},{"left":"Two numeric variables","right":"Scatter plot"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Histogram","description_en":"Distribution matched","description_id":"Distribusi cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Stacked bar","description_en":"Part-to-whole matched","description_id":"Bagian-keseluruhan cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Map","description_en":"Geographic matched","description_id":"Geografis cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Scatter plot","description_en":"Two numeric matched","description_id":"Dua numerik cocok","points":25}]',
  '["Histograms show distributions","Maps show geography"]','["Histogram untuk distribusi","Map untuk geografi"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F06'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Match Data to Chart');

-- ============================================================
-- F07 — Introduction to Power BI
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Power BI Components', 'Komponen Power BI',
  'Match each component to its role.', 'Cocokkan setiap komponen dengan perannya.',
  '{"pairs":[{"left":"Power BI Desktop","right":"Build reports"},{"left":"Power BI Service","right":"Publish and share"},{"left":"Power Query","right":"Clean and transform data"},{"left":"DAX","right":"Write calculations"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Build reports","description_en":"Desktop matched","description_id":"Desktop cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Publish and share","description_en":"Service matched","description_id":"Service cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Clean and transform data","description_en":"Power Query matched","description_id":"Power Query cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Write calculations","description_en":"DAX matched","description_id":"DAX cocok","points":25}]',
  '["Desktop is for building","Service is the cloud"]','["Desktop untuk membangun","Service itu cloud"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F07'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Power BI Components');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Power BI Panes', 'Panel Power BI',
  'Match each pane to its function.', 'Cocokkan setiap panel dengan fungsinya.',
  '{"pairs":[{"left":"Fields pane","right":"Lists tables and columns"},{"left":"Visualizations pane","right":"Offers visual choices"},{"left":"Filters pane","right":"Filters visuals and pages"},{"left":"Model view","right":"Manages relationships"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Lists tables and columns","description_en":"Fields matched","description_id":"Fields cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Offers visual choices","description_en":"Visualizations matched","description_id":"Visualizations cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Filters visuals and pages","description_en":"Filters matched","description_id":"Filters cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Manages relationships","description_en":"Model matched","description_id":"Model cocok","points":25}]',
  '["Model view is about relationships","Fields lists your data"]','["Model view soal relationship","Fields menampilkan data"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F07'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Power BI Panes');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Task to Feature', 'Tugas ke Fitur',
  'Match each task to the Power BI feature.', 'Cocokkan setiap tugas dengan fitur Power BI.',
  '{"pairs":[{"left":"Change data types","right":"Power Query"},{"left":"Create a measure","right":"DAX"},{"left":"Connect tables by key","right":"Relationships"},{"left":"Drill into a visual","right":"Cross-filtering"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Power Query","description_en":"Types matched","description_id":"Tipe cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"DAX","description_en":"Measure matched","description_id":"Measure cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Relationships","description_en":"Connect matched","description_id":"Hubungkan cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Cross-filtering","description_en":"Drill matched","description_id":"Drill cocok","points":25}]',
  '["Measures are written in DAX","Cleaning happens in Power Query"]','["Measure ditulis dengan DAX","Pembersihan di Power Query"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F07'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Task to Feature');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Power BI in Practice', 'Power BI dalam Praktik',
  'Match each action to its outcome.', 'Cocokkan setiap aksi dengan hasilnya.',
  '{"pairs":[{"left":"SUM(Sales[Amount])","right":"A total revenue measure"},{"left":"Schedule refresh","right":"Keeps data current"},{"left":"Relationship on product_id","right":"Joins tables once"},{"left":"Publish","right":"Shares the report online"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"A total revenue measure","description_en":"SUM matched","description_id":"SUM cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Keeps data current","description_en":"Refresh matched","description_id":"Refresh cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Joins tables once","description_en":"Relationship matched","description_id":"Relationship cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Shares the report online","description_en":"Publish matched","description_id":"Publish cocok","points":25}]',
  '["A relationship replaces repeated VLOOKUPs","Publishing goes to the Service"]','["Relationship menggantikan VLOOKUP berulang","Publish menuju Service"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F07'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Power BI in Practice');

-- ============================================================
-- F09 — Final Project & Portfolio
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Portfolio Deck Sections', 'Bagian Deck Portofolio',
  'Match each deck section to its content.', 'Cocokkan setiap bagian deck dengan isinya.',
  '{"pairs":[{"left":"Context","right":"Business background"},{"left":"Problem","right":"What you are solving"},{"left":"Analysis","right":"Key findings with visuals"},{"left":"Recommendation","right":"The suggested action"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Business background","description_en":"Context matched","description_id":"Konteks cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"What you are solving","description_en":"Problem matched","description_id":"Masalah cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Key findings with visuals","description_en":"Analysis matched","description_id":"Analisis cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"The suggested action","description_en":"Recommendation matched","description_id":"Rekomendasi cocok","points":25}]',
  '["Context sets the scene","Recommendation is the call to action"]','["Konteks membuka latar","Rekomendasi adalah ajakan bertindak"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F09'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Portfolio Deck Sections');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Publishing Platforms', 'Platform Publikasi',
  'Match each platform to its best use.', 'Cocokkan setiap platform dengan kegunaan terbaiknya.',
  '{"pairs":[{"left":"LinkedIn","right":"Visibility to recruiters"},{"left":"GitHub","right":"Hosting SQL or Python code"},{"left":"Tableau Public","right":"Interactive dashboards"},{"left":"Notion","right":"A tidy portfolio page"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Visibility to recruiters","description_en":"LinkedIn matched","description_id":"LinkedIn cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Hosting SQL or Python code","description_en":"GitHub matched","description_id":"GitHub cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Interactive dashboards","description_en":"Tableau matched","description_id":"Tableau cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A tidy portfolio page","description_en":"Notion matched","description_id":"Notion cocok","points":25}]',
  '["GitHub is for code","Tableau Public hosts dashboards"]','["GitHub untuk kode","Tableau Public untuk dashboard"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F09'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Publishing Platforms');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Portfolio Tips & Reasons', 'Tips Portofolio & Alasannya',
  'Match each tip to why it works.', 'Cocokkan setiap tips dengan alasannya.',
  '{"pairs":[{"left":"Show your process","right":"Proves you can do real work"},{"left":"Use business language","right":"Accessible to stakeholders"},{"left":"One deep project","right":"Beats many shallow ones"},{"left":"One message per slide","right":"Keeps it clear"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Proves you can do real work","description_en":"Process matched","description_id":"Proses cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Accessible to stakeholders","description_en":"Language matched","description_id":"Bahasa cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Beats many shallow ones","description_en":"Depth matched","description_id":"Kedalaman cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Keeps it clear","description_en":"Clarity matched","description_id":"Kejelasan cocok","points":25}]',
  '["Depth beats breadth","Jargon loses stakeholders"]','["Kedalaman mengalahkan keluasan","Jargon membuat stakeholder bingung"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F09'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Portfolio Tips & Reasons');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Weak vs Strong Portfolio', 'Portofolio Lemah vs Kuat',
  'Match each example to its quality label.', 'Cocokkan setiap contoh dengan label kualitasnya.',
  '{"pairs":[{"left":"A vague summary","right":"Weak - too general"},{"left":"Specific metric and impact","right":"Strong - measurable"},{"left":"Chart without a question","right":"Weak - remove it"},{"left":"Consistent formatting","right":"Strong - professional"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Weak - too general","description_en":"Vague matched","description_id":"Samar cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Strong - measurable","description_en":"Specific matched","description_id":"Spesifik cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Weak - remove it","description_en":"Pointless chart matched","description_id":"Chart tanpa guna cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Strong - professional","description_en":"Consistent matched","description_id":"Konsisten cocok","points":25}]',
  '["Specifics signal strength","Every chart should earn its place"]','["Spesifik menandakan kekuatan","Setiap chart harus punya alasan"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F09'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Weak vs Strong Portfolio');

-- ============================================================
-- F10 — BNSP Prep: Identifying Business Process
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Business Process Concepts', 'Konsep Proses Bisnis',
  'Match each concept to its definition.', 'Cocokkan setiap konsep dengan definisinya.',
  '{"pairs":[{"left":"Business process","right":"A sequence of steps toward a goal"},{"left":"Bottleneck","right":"The slowest step"},{"left":"Root cause","right":"The underlying reason"},{"left":"Symptom","right":"The visible effect"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"A sequence of steps toward a goal","description_en":"Process matched","description_id":"Proses cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"The slowest step","description_en":"Bottleneck matched","description_id":"Bottleneck cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The underlying reason","description_en":"Root cause matched","description_id":"Akar masalah cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"The visible effect","description_en":"Symptom matched","description_id":"Gejala cocok","points":25}]',
  '["A symptom is what you see first","The root cause is underneath"]','["Gejala yang terlihat lebih dulu","Akar masalah ada di bawahnya"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F10'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Business Process Concepts');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Analysis Techniques', 'Teknik Analisis',
  'Match each technique to its use.', 'Cocokkan setiap teknik dengan kegunaannya.',
  '{"pairs":[{"left":"5 Whys","right":"Drill down to a root cause"},{"left":"Fishbone","right":"Categorize possible causes"},{"left":"Problem statement","right":"Frame the issue clearly"},{"left":"Process mapping","right":"Find where data is generated"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Drill down to a root cause","description_en":"5 Whys matched","description_id":"5 Whys cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Categorize possible causes","description_en":"Fishbone matched","description_id":"Fishbone cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Frame the issue clearly","description_en":"Statement matched","description_id":"Rumusan cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Find where data is generated","description_en":"Mapping matched","description_id":"Pemetaan cocok","points":25}]',
  '["5 Whys keeps asking why","Fishbone groups causes"]','["5 Whys terus bertanya mengapa","Fishbone mengelompokkan penyebab"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F10'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Analysis Techniques');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Fishbone Categories', 'Kategori Fishbone',
  'Match each Fishbone category to an example cause.', 'Cocokkan setiap kategori Fishbone dengan contoh penyebab.',
  '{"pairs":[{"left":"Man","right":"Understaffing"},{"left":"Machine","right":"Equipment failure"},{"left":"Method","right":"A flawed procedure"},{"left":"Material","right":"Poor input quality"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Understaffing","description_en":"Man matched","description_id":"Man cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Equipment failure","description_en":"Machine matched","description_id":"Machine cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"A flawed procedure","description_en":"Method matched","description_id":"Method cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Poor input quality","description_en":"Material matched","description_id":"Material cocok","points":25}]',
  '["Man relates to people","Material relates to inputs"]','["Man berkaitan dengan orang","Material berkaitan dengan input"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F10'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Fishbone Categories');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Problem Statement Quality', 'Kualitas Rumusan Masalah',
  'Match each statement to its quality.', 'Cocokkan setiap pernyataan dengan kualitasnya.',
  '{"pairs":[{"left":"Sales have a problem","right":"Weak - too vague"},{"left":"Conversion fell 4.2% to 2.8% since March","right":"Strong - specific and measurable"},{"left":"Names metric, time, and segment","right":"Strong - well scoped"},{"left":"Already assumes the solution","right":"Weak - not neutral"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Weak - too vague","description_en":"Vague matched","description_id":"Samar cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Strong - specific and measurable","description_en":"Measurable matched","description_id":"Terukur cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Strong - well scoped","description_en":"Scoped matched","description_id":"Terdefinisi cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Weak - not neutral","description_en":"Biased matched","description_id":"Bias cocok","points":25}]',
  '["Good statements quantify the change","A statement should not pre-pick a solution"]','["Rumusan baik mengukur perubahan","Rumusan tidak boleh menentukan solusi lebih dulu"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F10'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Problem Statement Quality');

-- ============================================================
-- F11 — BNSP Prep: Portfolio Mentoring
-- ============================================================
INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Report Sections', 'Bagian Laporan',
  'Match each report section to its content.', 'Cocokkan setiap bagian laporan dengan isinya.',
  '{"pairs":[{"left":"Background","right":"Context and objective"},{"left":"Methodology","right":"Techniques used and why"},{"left":"Results","right":"Findings with visuals"},{"left":"Recommendations","right":"Prioritized actions"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Context and objective","description_en":"Background matched","description_id":"Latar cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Techniques used and why","description_en":"Methodology matched","description_id":"Metodologi cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Findings with visuals","description_en":"Results matched","description_id":"Hasil cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Prioritized actions","description_en":"Recommendations matched","description_id":"Rekomendasi cocok","points":25}]',
  '["Methodology explains the how","Results present the findings"]','["Metodologi menjelaskan caranya","Hasil menyajikan temuan"]',
  'easy', 1
FROM public.sessions s WHERE s.session_number='F11'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Report Sections');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Storytelling Principles', 'Prinsip Storytelling',
  'Match each principle to its meaning.', 'Cocokkan setiap prinsip dengan artinya.',
  '{"pairs":[{"left":"Storytelling","right":"A logical narrative flow"},{"left":"One question per visual","right":"Keeps each chart focused"},{"left":"So what","right":"States the business value"},{"left":"Data-based","right":"Not opinion"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"A logical narrative flow","description_en":"Storytelling matched","description_id":"Storytelling cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Keeps each chart focused","description_en":"One question matched","description_id":"Satu pertanyaan cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"States the business value","description_en":"So what matched","description_id":"So what cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Not opinion","description_en":"Data-based matched","description_id":"Berbasis data cocok","points":25}]',
  '["So what gives the value","Data-based means evidence not opinion"]','["So what memberi nilai","Berbasis data berarti bukti bukan opini"]',
  'easy', 2
FROM public.sessions s WHERE s.session_number='F11'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Storytelling Principles');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Pre-Exam Checklist', 'Checklist Pra-Ujian',
  'Match each checklist item to its purpose.', 'Cocokkan setiap item checklist dengan tujuannya.',
  '{"pairs":[{"left":"Documented cleaning","right":"Makes the work reproducible"},{"left":"Correct visuals","right":"Ensures accurate reading"},{"left":"Insights tied to the problem","right":"Keeps it relevant"},{"left":"Justify decisions","right":"Prepares for assessor questions"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Makes the work reproducible","description_en":"Cleaning matched","description_id":"Pembersihan cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Ensures accurate reading","description_en":"Visuals matched","description_id":"Visual cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Keeps it relevant","description_en":"Insights matched","description_id":"Insight cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Prepares for assessor questions","description_en":"Justify matched","description_id":"Justifikasi cocok","points":25}]',
  '["Documentation enables reproduction","Assessors ask why you chose each step"]','["Dokumentasi memungkinkan replikasi","Asesor menanyakan alasan tiap langkah"]',
  'medium', 3
FROM public.sessions s WHERE s.session_number='F11'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Pre-Exam Checklist');

INSERT INTO public.exercises (session_id, type, title_en, title_id, description_en, description_id, starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT s.id, 'matching',
  'Facing the Assessor', 'Menghadapi Asesor',
  'Match each preparation step to its benefit.', 'Cocokkan setiap langkah persiapan dengan manfaatnya.',
  '{"pairs":[{"left":"Know why you chose each technique","right":"Answer assessor questions confidently"},{"left":"Be honest about limitations","right":"Show analytical awareness"},{"left":"Rehearse 5 to 10 minutes","right":"Deliver a concise presentation"},{"left":"Narrative report","right":"Not a random pile of charts"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Answer assessor questions confidently","description_en":"Why matched","description_id":"Alasan cocok","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Show analytical awareness","description_en":"Honest matched","description_id":"Jujur cocok","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Deliver a concise presentation","description_en":"Rehearse matched","description_id":"Latihan cocok","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Not a random pile of charts","description_en":"Narrative matched","description_id":"Naratif cocok","points":25}]',
  '["Knowing your why builds confidence","A narrative ties charts together"]','["Memahami alasan membangun percaya diri","Narasi menyatukan chart"]',
  'hard', 4
FROM public.sessions s WHERE s.session_number='F11'
  AND NOT EXISTS (SELECT 1 FROM public.exercises e WHERE e.session_id=s.id AND e.title_en='Facing the Assessor');
