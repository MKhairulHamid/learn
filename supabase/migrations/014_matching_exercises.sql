-- ============================================================
-- 014 — Matching exercises for Sessions 01, 02, 03, 07, 08, 09, 11, 12
-- Each session: 3 easy (order 1-3), 2 medium (4-5), 1 hard (6)
-- Total: 48 exercises
-- ============================================================

-- First, extend the type CHECK constraint to allow 'matching'
ALTER TABLE exercises DROP CONSTRAINT IF EXISTS exercises_type_check;
ALTER TABLE exercises ADD CONSTRAINT exercises_type_check
  CHECK (type IN ('sql', 'quiz', 'multiple_choice', 'matching'));

-- ============================================================
-- SESSION 01: Introduction to Data Analytics
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Data Analyst Roles & Responsibilities',
  'Peran & Tanggung Jawab Data Analyst',
  'Match each data-related role to its primary responsibility.',
  'Cocokkan setiap peran yang berkaitan dengan data dengan tanggung jawab utamanya.',
  '{"pairs":[{"left":"Data Analyst","right":"Interprets data to answer business questions"},{"left":"Data Engineer","right":"Builds and maintains data pipelines"},{"left":"Data Scientist","right":"Builds predictive models using machine learning"},{"left":"Business Intelligence Analyst","right":"Creates dashboards and reports for decision makers"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Interprets data to answer business questions","description_en":"Data Analyst is correctly matched","description_id":"Data Analyst cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Builds and maintains data pipelines","description_en":"Data Engineer is correctly matched","description_id":"Data Engineer cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Builds predictive models using machine learning","description_en":"Data Scientist is correctly matched","description_id":"Data Scientist cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Creates dashboards and reports for decision makers","description_en":"Business Intelligence Analyst is correctly matched","description_id":"Business Intelligence Analyst cocok dengan benar","points":25}]',
  '["Think about what each role does day-to-day","A Data Analyst focuses on answering questions, not building infrastructure"]',
  '["Pikirkan apa yang dilakukan setiap peran sehari-hari","Data Analyst fokus menjawab pertanyaan, bukan membangun infrastruktur"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '01' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Types of Data',
  'Jenis-Jenis Data',
  'Match each data type to its correct example.',
  'Cocokkan setiap jenis data dengan contoh yang tepat.',
  '{"pairs":[{"left":"Structured data","right":"Rows and columns in a relational database"},{"left":"Unstructured data","right":"Customer reviews written in free text"},{"left":"Quantitative data","right":"Monthly revenue in Rupiah"},{"left":"Qualitative data","right":"Customer satisfaction level (satisfied / neutral / dissatisfied)"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Rows and columns in a relational database","description_en":"Structured data is correctly matched","description_id":"Structured data cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Customer reviews written in free text","description_en":"Unstructured data is correctly matched","description_id":"Unstructured data cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Monthly revenue in Rupiah","description_en":"Quantitative data is correctly matched","description_id":"Quantitative data cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Customer satisfaction level (satisfied / neutral / dissatisfied)","description_en":"Qualitative data is correctly matched","description_id":"Qualitative data cocok dengan benar","points":25}]',
  '["Structured data fits neatly into tables","Qualitative data describes qualities, not quantities"]',
  '["Structured data pas masuk ke dalam tabel","Qualitative data menggambarkan kualitas, bukan kuantitas"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '01' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Common Data Tools',
  'Alat Data yang Umum Digunakan',
  'Match each tool to its main use case.',
  'Cocokkan setiap alat dengan kasus penggunaan utamanya.',
  '{"pairs":[{"left":"Excel","right":"Spreadsheet-based data analysis and quick calculations"},{"left":"SQL","right":"Querying and managing data in relational databases"},{"left":"Power BI","right":"Building interactive business dashboards"},{"left":"Python","right":"Automating data processing and building models"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Spreadsheet-based data analysis and quick calculations","description_en":"Excel is correctly matched","description_id":"Excel cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Querying and managing data in relational databases","description_en":"SQL is correctly matched","description_id":"SQL cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Building interactive business dashboards","description_en":"Power BI is correctly matched","description_id":"Power BI cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Automating data processing and building models","description_en":"Python is correctly matched","description_id":"Python cocok dengan benar","points":25}]',
  '["Each tool has a sweet spot — Excel is great for ad-hoc analysis","Power BI is Microsoft''s tool specifically for business dashboards"]',
  '["Setiap alat punya keunggulannya — Excel bagus untuk analisis cepat","Power BI adalah alat Microsoft khusus untuk dashboard bisnis"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '01' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Analytics Process Steps',
  'Langkah-Langkah Proses Analitik',
  'Match each step of the analytics process to what happens during that step.',
  'Cocokkan setiap langkah proses analitik dengan apa yang terjadi pada langkah tersebut.',
  '{"pairs":[{"left":"Define the question","right":"Clarify what business problem needs to be solved"},{"left":"Collect data","right":"Gather relevant data from databases, surveys, or logs"},{"left":"Clean data","right":"Handle missing values, duplicates, and formatting errors"},{"left":"Communicate findings","right":"Present insights in charts or reports for stakeholders"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Clarify what business problem needs to be solved","description_en":"Define the question is correctly matched","description_id":"Define the question cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Gather relevant data from databases, surveys, or logs","description_en":"Collect data is correctly matched","description_id":"Collect data cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Handle missing values, duplicates, and formatting errors","description_en":"Clean data is correctly matched","description_id":"Clean data cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Present insights in charts or reports for stakeholders","description_en":"Communicate findings is correctly matched","description_id":"Communicate findings cocok dengan benar","points":25}]',
  '["The analytics process always starts with a clear question","Cleaning data often takes the most time in real projects"]',
  '["Proses analitik selalu dimulai dengan pertanyaan yang jelas","Membersihkan data sering memakan waktu paling lama di proyek nyata"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '01' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Types of Analytics',
  'Jenis-Jenis Analitik',
  'Match each type of analytics to the question it answers.',
  'Cocokkan setiap jenis analitik dengan pertanyaan yang dijawabnya.',
  '{"pairs":[{"left":"Descriptive analytics","right":"What happened? (summarising past data)"},{"left":"Diagnostic analytics","right":"Why did it happen? (finding root causes)"},{"left":"Predictive analytics","right":"What will happen? (forecasting future outcomes)"},{"left":"Prescriptive analytics","right":"What should we do? (recommending actions)"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"What happened? (summarising past data)","description_en":"Descriptive analytics is correctly matched","description_id":"Descriptive analytics cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Why did it happen? (finding root causes)","description_en":"Diagnostic analytics is correctly matched","description_id":"Diagnostic analytics cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"What will happen? (forecasting future outcomes)","description_en":"Predictive analytics is correctly matched","description_id":"Predictive analytics cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"What should we do? (recommending actions)","description_en":"Prescriptive analytics is correctly matched","description_id":"Prescriptive analytics cocok dengan benar","points":25}]',
  '["Think about the key word in each type: describe, diagnose, predict, prescribe","Most companies use descriptive analytics daily — dashboards are a common example"]',
  '["Perhatikan kata kunci setiap jenis: deskripsi, diagnosis, prediksi, preskripsi","Kebanyakan perusahaan menggunakan descriptive analytics sehari-hari — dashboard adalah contoh umum"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '01' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Business Scenarios & Correct Analytics Approach',
  'Skenario Bisnis & Pendekatan Analitik yang Tepat',
  'A retail company in Jakarta faces different challenges. Match each business scenario to the most appropriate analytics approach.',
  'Sebuah perusahaan ritel di Jakarta menghadapi berbagai tantangan. Cocokkan setiap skenario bisnis dengan pendekatan analitik yang paling tepat.',
  '{"pairs":[{"left":"Sales dropped 30% last month — management wants to know why","right":"Diagnostic analytics to find root cause"},{"left":"The CFO needs a monthly revenue summary by region","right":"Descriptive analytics to summarise past performance"},{"left":"The marketing team wants to know which customers are likely to churn next month","right":"Predictive analytics to forecast future behaviour"},{"left":"Operations wants to know the optimal stock level for Ramadan season","right":"Prescriptive analytics to recommend the best action"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Diagnostic analytics to find root cause","description_en":"Sales drop scenario is correctly matched","description_id":"Skenario penurunan penjualan cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Descriptive analytics to summarise past performance","description_en":"CFO revenue summary scenario is correctly matched","description_id":"Skenario ringkasan pendapatan CFO cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Predictive analytics to forecast future behaviour","description_en":"Customer churn scenario is correctly matched","description_id":"Skenario churn pelanggan cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Prescriptive analytics to recommend the best action","description_en":"Stock optimisation scenario is correctly matched","description_id":"Skenario optimasi stok cocok dengan benar","points":25}]',
  '["Ask: is the scenario about the past, explaining the past, predicting the future, or deciding what to do?","''Why'' questions almost always point to diagnostic analytics"]',
  '["Tanya: apakah skenario ini tentang masa lalu, menjelaskan masa lalu, memprediksi masa depan, atau memutuskan apa yang harus dilakukan?","Pertanyaan ''mengapa'' hampir selalu mengarah ke diagnostic analytics"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '01' LIMIT 1;

-- ============================================================
-- SESSION 02: Excel for Data Analysis
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Excel Functions & Their Purpose',
  'Fungsi Excel & Tujuannya',
  'Match each Excel function to what it does.',
  'Cocokkan setiap fungsi Excel dengan apa yang dilakukannya.',
  '{"pairs":[{"left":"SUM","right":"Adds up all numbers in a selected range"},{"left":"AVERAGE","right":"Calculates the arithmetic mean of a range"},{"left":"COUNT","right":"Counts cells that contain numbers"},{"left":"MAX","right":"Returns the largest value in a range"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Adds up all numbers in a selected range","description_en":"SUM is correctly matched","description_id":"SUM cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Calculates the arithmetic mean of a range","description_en":"AVERAGE is correctly matched","description_id":"AVERAGE cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Counts cells that contain numbers","description_en":"COUNT is correctly matched","description_id":"COUNT cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Returns the largest value in a range","description_en":"MAX is correctly matched","description_id":"MAX cocok dengan benar","points":25}]',
  '["SUM and AVERAGE are the most commonly used functions in daily analysis","COUNT only counts cells with numbers — use COUNTA for text cells"]',
  '["SUM dan AVERAGE adalah fungsi yang paling sering digunakan dalam analisis harian","COUNT hanya menghitung sel dengan angka — gunakan COUNTA untuk sel teks"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '02' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Excel Lookup Functions',
  'Fungsi Pencarian di Excel',
  'Match each lookup function to its typical use case.',
  'Cocokkan setiap fungsi pencarian dengan kasus penggunaan yang umum.',
  '{"pairs":[{"left":"VLOOKUP","right":"Search for a value in the first column of a table and return a value from another column"},{"left":"HLOOKUP","right":"Search for a value in the first row of a table and return a value from a row below"},{"left":"INDEX","right":"Return the value at a specific row and column position in a range"},{"left":"MATCH","right":"Return the position of a value within a row or column"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Search for a value in the first column of a table and return a value from another column","description_en":"VLOOKUP is correctly matched","description_id":"VLOOKUP cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Search for a value in the first row of a table and return a value from a row below","description_en":"HLOOKUP is correctly matched","description_id":"HLOOKUP cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Return the value at a specific row and column position in a range","description_en":"INDEX is correctly matched","description_id":"INDEX cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Return the position of a value within a row or column","description_en":"MATCH is correctly matched","description_id":"MATCH cocok dengan benar","points":25}]',
  '["V in VLOOKUP stands for Vertical — it searches down a column","INDEX+MATCH is more flexible than VLOOKUP and works in any direction"]',
  '["V pada VLOOKUP singkatan dari Vertical — mencari ke bawah kolom","INDEX+MATCH lebih fleksibel dari VLOOKUP dan bekerja ke segala arah"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '02' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Excel Features for Analysis',
  'Fitur Excel untuk Analisis',
  'Match each Excel feature to its description.',
  'Cocokkan setiap fitur Excel dengan deskripsinya.',
  '{"pairs":[{"left":"Pivot Table","right":"Summarises and aggregates large datasets by dragging and dropping fields"},{"left":"Conditional Formatting","right":"Highlights cells automatically based on rules or values"},{"left":"Data Validation","right":"Restricts what users can enter into a cell"},{"left":"Freeze Panes","right":"Keeps header rows or columns visible while scrolling"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Summarises and aggregates large datasets by dragging and dropping fields","description_en":"Pivot Table is correctly matched","description_id":"Pivot Table cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Highlights cells automatically based on rules or values","description_en":"Conditional Formatting is correctly matched","description_id":"Conditional Formatting cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Restricts what users can enter into a cell","description_en":"Data Validation is correctly matched","description_id":"Data Validation cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Keeps header rows or columns visible while scrolling","description_en":"Freeze Panes is correctly matched","description_id":"Freeze Panes cocok dengan benar","points":25}]',
  '["Pivot Tables are one of the most powerful Excel features for analysts","Conditional Formatting turns numbers into a visual heatmap instantly"]',
  '["Pivot Table adalah salah satu fitur Excel paling kuat untuk analis","Conditional Formatting mengubah angka menjadi heatmap visual secara instan"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '02' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Conditional Functions in Excel',
  'Fungsi Kondisional di Excel',
  'Match each conditional function to what it calculates.',
  'Cocokkan setiap fungsi kondisional dengan apa yang dihitungnya.',
  '{"pairs":[{"left":"COUNTIF","right":"Counts cells in a range that meet a single condition"},{"left":"SUMIF","right":"Adds values in a range where a corresponding range meets a condition"},{"left":"AVERAGEIF","right":"Calculates the average of cells that meet a single condition"},{"left":"COUNTIFS","right":"Counts cells that meet multiple conditions across multiple ranges"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Counts cells in a range that meet a single condition","description_en":"COUNTIF is correctly matched","description_id":"COUNTIF cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Adds values in a range where a corresponding range meets a condition","description_en":"SUMIF is correctly matched","description_id":"SUMIF cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Calculates the average of cells that meet a single condition","description_en":"AVERAGEIF is correctly matched","description_id":"AVERAGEIF cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Counts cells that meet multiple conditions across multiple ranges","description_en":"COUNTIFS is correctly matched","description_id":"COUNTIFS cocok dengan benar","points":25}]',
  '["The IFS suffix (plural) means the function accepts multiple conditions","SUMIF syntax: =SUMIF(range, criteria, sum_range)"]',
  '["Akhiran IFS (jamak) berarti fungsi menerima beberapa kondisi","Sintaks SUMIF: =SUMIF(range, criteria, sum_range)"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '02' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Excel Analysis Workflow Steps',
  'Langkah Alur Kerja Analisis Excel',
  'An analyst at a Jakarta e-commerce company receives raw sales data. Match each workflow step to the correct Excel action.',
  'Seorang analis di perusahaan e-commerce Jakarta menerima data penjualan mentah. Cocokkan setiap langkah alur kerja dengan tindakan Excel yang tepat.',
  '{"pairs":[{"left":"Remove duplicate orders","right":"Use Data > Remove Duplicates on the order_id column"},{"left":"Flag sales above target","right":"Apply Conditional Formatting with a rule: value > target"},{"left":"Summarise sales by product category","right":"Insert a Pivot Table with category as rows and SUM of revenue as values"},{"left":"Find orders from a specific customer ID","right":"Use VLOOKUP or MATCH to retrieve the customer''s order details"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Use Data > Remove Duplicates on the order_id column","description_en":"Remove duplicate orders is correctly matched","description_id":"Menghapus order duplikat cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Apply Conditional Formatting with a rule: value > target","description_en":"Flag sales above target is correctly matched","description_id":"Menandai penjualan di atas target cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Insert a Pivot Table with category as rows and SUM of revenue as values","description_en":"Summarise by category is correctly matched","description_id":"Merangkum per kategori cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Use VLOOKUP or MATCH to retrieve the customer''s order details","description_en":"Find specific customer orders is correctly matched","description_id":"Menemukan order pelanggan tertentu cocok dengan benar","points":25}]',
  '["Think about which Excel feature solves each specific data problem","Pivot Tables are the go-to tool for any ''summarise by'' task"]',
  '["Pikirkan fitur Excel mana yang memecahkan setiap masalah data tertentu","Pivot Table adalah alat utama untuk tugas ''rangkum berdasarkan'' apapun"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '02' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Business Metrics & Excel Formula Approach',
  'Metrik Bisnis & Pendekatan Rumus Excel',
  'A retail analyst needs to calculate key metrics. Match each business metric to the correct Excel formula approach.',
  'Seorang analis ritel perlu menghitung metrik kunci. Cocokkan setiap metrik bisnis dengan pendekatan rumus Excel yang tepat.',
  '{"pairs":[{"left":"Month-over-month revenue growth (%)","right":"=(current_month - previous_month) / previous_month * 100"},{"left":"Percentage of total for each region","right":"=region_revenue / SUM($all_revenue$) * 100 with absolute reference"},{"left":"Count of high-value orders (above Rp 5 million)","right":"=COUNTIF(revenue_range, \">5000000\")"},{"left":"Average order value per customer segment","right":"=AVERAGEIF(segment_range, segment_name, revenue_range)"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"=(current_month - previous_month) / previous_month * 100","description_en":"Month-over-month growth is correctly matched","description_id":"Pertumbuhan bulan ke bulan cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"=region_revenue / SUM($all_revenue$) * 100 with absolute reference","description_en":"Percentage of total is correctly matched","description_id":"Persentase dari total cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"=COUNTIF(revenue_range, \">5000000\")","description_en":"Count high-value orders is correctly matched","description_id":"Menghitung order bernilai tinggi cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"=AVERAGEIF(segment_range, segment_name, revenue_range)","description_en":"Average order value per segment is correctly matched","description_id":"Rata-rata nilai order per segmen cocok dengan benar","points":25}]',
  '["Growth % always uses: (new - old) / old","Use $ signs (absolute references) when dividing by a total that should not shift when you copy the formula"]',
  '["Persentase pertumbuhan selalu menggunakan: (baru - lama) / lama","Gunakan tanda $ (referensi absolut) saat membagi dengan total yang tidak boleh bergeser saat menyalin rumus"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '02' LIMIT 1;

-- ============================================================
-- SESSION 03: Data Visualization & Power BI
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Chart Types & Best Use Cases',
  'Jenis Grafik & Kasus Penggunaan Terbaik',
  'Match each chart type to its ideal use case.',
  'Cocokkan setiap jenis grafik dengan kasus penggunaan terbaiknya.',
  '{"pairs":[{"left":"Bar chart","right":"Comparing values across discrete categories"},{"left":"Line chart","right":"Showing trends over time"},{"left":"Pie chart","right":"Showing part-to-whole proportions (few categories)"},{"left":"Scatter plot","right":"Exploring the relationship between two numeric variables"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Comparing values across discrete categories","description_en":"Bar chart is correctly matched","description_id":"Bar chart cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Showing trends over time","description_en":"Line chart is correctly matched","description_id":"Line chart cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Showing part-to-whole proportions (few categories)","description_en":"Pie chart is correctly matched","description_id":"Pie chart cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Exploring the relationship between two numeric variables","description_en":"Scatter plot is correctly matched","description_id":"Scatter plot cocok dengan benar","points":25}]',
  '["Line charts imply continuity — only use them for data that changes continuously (like time)","Pie charts are best when you have 5 or fewer slices"]',
  '["Line chart mengimplikasikan kesinambungan — gunakan hanya untuk data yang berubah secara kontinu (seperti waktu)","Pie chart terbaik ketika ada 5 irisan atau lebih sedikit"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '03' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Power BI Components',
  'Komponen Power BI',
  'Match each Power BI component to its role in the tool.',
  'Cocokkan setiap komponen Power BI dengan perannya dalam alat tersebut.',
  '{"pairs":[{"left":"Power Query","right":"Connects to data sources and transforms raw data before loading"},{"left":"Data Model","right":"Defines relationships between tables using primary and foreign keys"},{"left":"DAX","right":"Formula language used to create calculated columns and measures"},{"left":"Report Canvas","right":"The visual workspace where charts and visuals are designed"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Connects to data sources and transforms raw data before loading","description_en":"Power Query is correctly matched","description_id":"Power Query cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Defines relationships between tables using primary and foreign keys","description_en":"Data Model is correctly matched","description_id":"Data Model cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Formula language used to create calculated columns and measures","description_en":"DAX is correctly matched","description_id":"DAX cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"The visual workspace where charts and visuals are designed","description_en":"Report Canvas is correctly matched","description_id":"Report Canvas cocok dengan benar","points":25}]',
  '["Power Query is the ETL layer — think of it like data prep before analysis","DAX stands for Data Analysis Expressions"]',
  '["Power Query adalah lapisan ETL — bayangkan seperti persiapan data sebelum analisis","DAX singkatan dari Data Analysis Expressions"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '03' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Visualization Principles',
  'Prinsip-Prinsip Visualisasi',
  'Match each visualization principle to its definition.',
  'Cocokkan setiap prinsip visualisasi dengan definisinya.',
  '{"pairs":[{"left":"Data-ink ratio","right":"Maximise the proportion of ink used to display actual data, remove chart junk"},{"left":"Pre-attentive attributes","right":"Visual properties (colour, size, position) that the eye detects instantly before conscious thought"},{"left":"Colour encoding","right":"Using different colours to represent categories or a gradient for magnitude"},{"left":"Annotation","right":"Adding text labels or callouts directly on a chart to highlight key insights"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Maximise the proportion of ink used to display actual data, remove chart junk","description_en":"Data-ink ratio is correctly matched","description_id":"Data-ink ratio cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Visual properties (colour, size, position) that the eye detects instantly before conscious thought","description_en":"Pre-attentive attributes is correctly matched","description_id":"Pre-attentive attributes cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Using different colours to represent categories or a gradient for magnitude","description_en":"Colour encoding is correctly matched","description_id":"Colour encoding cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Adding text labels or callouts directly on a chart to highlight key insights","description_en":"Annotation is correctly matched","description_id":"Annotation cocok dengan benar","points":25}]',
  '["Edward Tufte coined ''data-ink ratio'' — remove gridlines, borders, and backgrounds that don''t add information","Pre-attentive processing is why a red bar stands out in a sea of grey bars instantly"]',
  '["Edward Tufte menciptakan istilah ''data-ink ratio'' — hapus gridline, border, dan background yang tidak menambah informasi","Pre-attentive processing adalah mengapa bar merah langsung menonjol di antara bar abu-abu"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '03' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Choosing the Right Chart for Each Task',
  'Memilih Grafik yang Tepat untuk Setiap Tugas',
  'Match each analysis goal to the most appropriate chart type.',
  'Cocokkan setiap tujuan analisis dengan jenis grafik yang paling tepat.',
  '{"pairs":[{"left":"Show monthly sales trend across 12 months","right":"Line chart with months on the x-axis"},{"left":"Compare revenue of 5 product categories side by side","right":"Horizontal bar chart sorted by value"},{"left":"Show each region''s share of total national revenue","right":"Treemap or stacked bar showing proportions"},{"left":"Identify if higher advertising spend correlates with more sales","right":"Scatter plot with ad spend on x-axis and sales on y-axis"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Line chart with months on the x-axis","description_en":"Monthly sales trend is correctly matched","description_id":"Tren penjualan bulanan cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Horizontal bar chart sorted by value","description_en":"Compare 5 categories is correctly matched","description_id":"Membandingkan 5 kategori cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Treemap or stacked bar showing proportions","description_en":"Regional share of revenue is correctly matched","description_id":"Pangsa pendapatan per wilayah cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Scatter plot with ad spend on x-axis and sales on y-axis","description_en":"Ad spend vs sales correlation is correctly matched","description_id":"Korelasi belanja iklan vs penjualan cocok dengan benar","points":25}]',
  '["For comparison tasks, bar charts beat pie charts — human eyes judge length more accurately than angle","Scatter plots are the only chart that shows correlation between two variables"]',
  '["Untuk tugas perbandingan, bar chart lebih baik dari pie chart — mata manusia lebih akurat menilai panjang daripada sudut","Scatter plot adalah satu-satunya grafik yang menunjukkan korelasi antara dua variabel"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '03' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Power BI Dashboard Design Steps',
  'Langkah Desain Dashboard Power BI',
  'Match each dashboard design step to the correct action in Power BI.',
  'Cocokkan setiap langkah desain dashboard dengan tindakan yang tepat di Power BI.',
  '{"pairs":[{"left":"Connect to an Excel file and remove blank rows","right":"Use Power Query Editor to load the file and apply Remove Empty Rows transform"},{"left":"Link the sales table to the products table","right":"Go to Model view and drag product_id from sales to products table"},{"left":"Create a measure for total revenue","right":"In Report view, right-click table > New Measure and write DAX: Total Revenue = SUM(sales[revenue])"},{"left":"Allow users to filter by date range","right":"Add a Slicer visual with the date field"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Use Power Query Editor to load the file and apply Remove Empty Rows transform","description_en":"Connect and clean Excel is correctly matched","description_id":"Menghubungkan dan membersihkan Excel cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Go to Model view and drag product_id from sales to products table","description_en":"Link sales to products table is correctly matched","description_id":"Menghubungkan tabel penjualan ke produk cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"In Report view, right-click table > New Measure and write DAX: Total Revenue = SUM(sales[revenue])","description_en":"Create total revenue measure is correctly matched","description_id":"Membuat measure total pendapatan cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Add a Slicer visual with the date field","description_en":"Allow date range filter is correctly matched","description_id":"Mengizinkan filter rentang tanggal cocok dengan benar","points":25}]',
  '["Power Query is where you clean data BEFORE it enters the model","Slicers are the most common way to add interactivity to Power BI dashboards"]',
  '["Power Query adalah tempat Anda membersihkan data SEBELUM masuk ke model","Slicer adalah cara paling umum untuk menambahkan interaktivitas ke dashboard Power BI"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '03' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Dashboard Critique: Problem to Fix',
  'Kritik Dashboard: Masalah yang Perlu Diperbaiki',
  'A Power BI dashboard has several design problems. Match each problem description to the correct fix.',
  'Sebuah dashboard Power BI memiliki beberapa masalah desain. Cocokkan setiap deskripsi masalah dengan perbaikan yang tepat.',
  '{"pairs":[{"left":"The chart uses 12 different colours for 12 product categories, making it impossible to read","right":"Use a single colour for all bars and highlight only the top performer in a distinct colour"},{"left":"The dashboard shows raw numbers but no context — is 10,000 orders good or bad?","right":"Add KPI cards showing actual vs target and month-over-month change"},{"left":"The y-axis starts at 95,000 instead of zero, making a small difference look dramatic","right":"Reset the y-axis to start at zero to accurately represent the magnitude of change"},{"left":"There is a 3D pie chart with 10 slices and no data labels","right":"Replace with a horizontal bar chart sorted by value and add data labels"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Use a single colour for all bars and highlight only the top performer in a distinct colour","description_en":"Too many colours problem is correctly matched","description_id":"Masalah terlalu banyak warna cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Add KPI cards showing actual vs target and month-over-month change","description_en":"No context problem is correctly matched","description_id":"Masalah tidak ada konteks cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Reset the y-axis to start at zero to accurately represent the magnitude of change","description_en":"Truncated axis problem is correctly matched","description_id":"Masalah sumbu terpotong cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Replace with a horizontal bar chart sorted by value and add data labels","description_en":"3D pie chart problem is correctly matched","description_id":"Masalah 3D pie chart cocok dengan benar","points":25}]',
  '["A truncated y-axis is one of the most common ways charts mislead — always check the axis origin","Colour should encode meaning, not just decoration — use it sparingly"]',
  '["Sumbu y yang terpotong adalah salah satu cara paling umum grafik menyesatkan — selalu periksa titik asal sumbu","Warna harus mengkodekan makna, bukan sekadar dekorasi — gunakan dengan hemat"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '03' LIMIT 1;

-- ============================================================
-- SESSION 07: Statistics for Data Analysis
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Measures of Central Tendency',
  'Ukuran Tendensi Sentral',
  'Match each statistical measure to its definition.',
  'Cocokkan setiap ukuran statistik dengan definisinya.',
  '{"pairs":[{"left":"Mean","right":"The arithmetic average — sum of all values divided by the count"},{"left":"Median","right":"The middle value when data is sorted in ascending order"},{"left":"Mode","right":"The value that appears most frequently in the dataset"},{"left":"Standard deviation","right":"Measures how spread out values are around the mean"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"The arithmetic average — sum of all values divided by the count","description_en":"Mean is correctly matched","description_id":"Mean cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"The middle value when data is sorted in ascending order","description_en":"Median is correctly matched","description_id":"Median cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The value that appears most frequently in the dataset","description_en":"Mode is correctly matched","description_id":"Mode cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Measures how spread out values are around the mean","description_en":"Standard deviation is correctly matched","description_id":"Standard deviation cocok dengan benar","points":25}]',
  '["When data is skewed (e.g. very high salaries at the top), median is a better measure than mean","Standard deviation of 0 means all values are identical"]',
  '["Ketika data miring (misalnya gaji sangat tinggi di atas), median adalah ukuran yang lebih baik dari mean","Standar deviasi 0 berarti semua nilai identik"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '07' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Distribution Types',
  'Jenis-Jenis Distribusi',
  'Match each distribution shape to its description.',
  'Cocokkan setiap bentuk distribusi dengan deskripsinya.',
  '{"pairs":[{"left":"Normal distribution","right":"Bell-shaped curve, symmetrical around the mean"},{"left":"Right-skewed distribution","right":"Most values are low, but a long tail extends to the right with high outliers"},{"left":"Left-skewed distribution","right":"Most values are high, but a long tail extends to the left with low outliers"},{"left":"Uniform distribution","right":"All values occur with equal frequency — flat histogram"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Bell-shaped curve, symmetrical around the mean","description_en":"Normal distribution is correctly matched","description_id":"Normal distribution cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Most values are low, but a long tail extends to the right with high outliers","description_en":"Right-skewed distribution is correctly matched","description_id":"Right-skewed distribution cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Most values are high, but a long tail extends to the left with low outliers","description_en":"Left-skewed distribution is correctly matched","description_id":"Left-skewed distribution cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"All values occur with equal frequency — flat histogram","description_en":"Uniform distribution is correctly matched","description_id":"Uniform distribution cocok dengan benar","points":25}]',
  '["Income data in Indonesia is typically right-skewed — most people earn modest incomes but a small number earn extremely high incomes","The direction of skew is the direction of the tail, not the peak"]',
  '["Data pendapatan di Indonesia biasanya right-skewed — kebanyakan orang berpenghasilan sederhana tetapi sebagian kecil berpenghasilan sangat tinggi","Arah skewness adalah arah ekor, bukan puncak"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '07' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Correlation Concepts',
  'Konsep Korelasi',
  'Match each correlation term to its meaning.',
  'Cocokkan setiap istilah korelasi dengan maknanya.',
  '{"pairs":[{"left":"Positive correlation","right":"As one variable increases, the other also increases"},{"left":"Negative correlation","right":"As one variable increases, the other decreases"},{"left":"No correlation","right":"There is no consistent linear relationship between the two variables"},{"left":"Correlation coefficient (r)","right":"A number between -1 and 1 measuring the strength and direction of a linear relationship"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"As one variable increases, the other also increases","description_en":"Positive correlation is correctly matched","description_id":"Positive correlation cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"As one variable increases, the other decreases","description_en":"Negative correlation is correctly matched","description_id":"Negative correlation cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"There is no consistent linear relationship between the two variables","description_en":"No correlation is correctly matched","description_id":"No correlation cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A number between -1 and 1 measuring the strength and direction of a linear relationship","description_en":"Correlation coefficient is correctly matched","description_id":"Correlation coefficient cocok dengan benar","points":25}]',
  '["Correlation does NOT mean causation — ice cream sales and drowning rates are positively correlated (both peak in summer)","r = 1 is perfect positive correlation, r = -1 is perfect negative, r = 0 is no linear relationship"]',
  '["Korelasi TIDAK berarti sebab-akibat — penjualan es krim dan tingkat tenggelam berkorelasi positif (keduanya memuncak di musim panas)","r = 1 adalah korelasi positif sempurna, r = -1 adalah negatif sempurna, r = 0 tidak ada hubungan linear"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '07' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Hypothesis Testing Concepts',
  'Konsep Pengujian Hipotesis',
  'Match each hypothesis testing term to its correct definition.',
  'Cocokkan setiap istilah pengujian hipotesis dengan definisi yang tepat.',
  '{"pairs":[{"left":"Null hypothesis (H₀)","right":"The default assumption that there is no effect or no difference"},{"left":"Alternative hypothesis (H₁)","right":"The claim you are trying to find evidence for"},{"left":"p-value","right":"The probability of observing your results (or more extreme) if the null hypothesis were true"},{"left":"Significance level (α)","right":"The threshold (commonly 0.05) below which you reject the null hypothesis"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"The default assumption that there is no effect or no difference","description_en":"Null hypothesis is correctly matched","description_id":"Null hypothesis cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"The claim you are trying to find evidence for","description_en":"Alternative hypothesis is correctly matched","description_id":"Alternative hypothesis cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The probability of observing your results (or more extreme) if the null hypothesis were true","description_en":"p-value is correctly matched","description_id":"p-value cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"The threshold (commonly 0.05) below which you reject the null hypothesis","description_en":"Significance level is correctly matched","description_id":"Significance level cocok dengan benar","points":25}]',
  '["A p-value < 0.05 means the result is statistically significant — unlikely to be due to chance alone","The null hypothesis always assumes nothing interesting is happening"]',
  '["p-value < 0,05 berarti hasilnya signifikan secara statistik — kecil kemungkinan terjadi karena kebetulan","Null hypothesis selalu mengasumsikan tidak ada hal menarik yang terjadi"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '07' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Sampling Methods',
  'Metode Pengambilan Sampel',
  'Match each sampling method to its description.',
  'Cocokkan setiap metode pengambilan sampel dengan deskripsinya.',
  '{"pairs":[{"left":"Simple random sampling","right":"Every member of the population has an equal chance of being selected"},{"left":"Stratified sampling","right":"Divide the population into subgroups and sample from each proportionally"},{"left":"Systematic sampling","right":"Select every nth member from an ordered list"},{"left":"Convenience sampling","right":"Select whoever is easiest to reach — fast but potentially biased"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Every member of the population has an equal chance of being selected","description_en":"Simple random sampling is correctly matched","description_id":"Simple random sampling cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Divide the population into subgroups and sample from each proportionally","description_en":"Stratified sampling is correctly matched","description_id":"Stratified sampling cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Select every nth member from an ordered list","description_en":"Systematic sampling is correctly matched","description_id":"Systematic sampling cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Select whoever is easiest to reach — fast but potentially biased","description_en":"Convenience sampling is correctly matched","description_id":"Convenience sampling cocok dengan benar","points":25}]',
  '["Stratified sampling ensures all subgroups (e.g. regions, age groups) are represented","Convenience sampling is common in surveys but can produce misleading results"]',
  '["Stratified sampling memastikan semua subkelompok (misalnya wilayah, kelompok usia) terwakili","Convenience sampling umum dalam survei tetapi dapat menghasilkan hasil yang menyesatkan"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '07' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Statistical Results & Correct Interpretation',
  'Hasil Statistik & Interpretasi yang Tepat',
  'A data analyst at a Bandung startup runs several tests. Match each result to its correct interpretation.',
  'Seorang data analyst di startup Bandung menjalankan beberapa pengujian. Cocokkan setiap hasil dengan interpretasi yang tepat.',
  '{"pairs":[{"left":"A/B test on new checkout page: p-value = 0.03","right":"Reject the null hypothesis — the new page likely has a real effect on conversion"},{"left":"Correlation between temperature and ice cream sales: r = 0.91","right":"Strong positive correlation — higher temperature is closely associated with higher ice cream sales"},{"left":"Customer age data: mean = 35, median = 28","right":"The data is right-skewed — a small number of older customers are pulling the mean up"},{"left":"Standard deviation of daily orders: 2 units","right":"Daily order volume is very consistent and predictable"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Reject the null hypothesis — the new page likely has a real effect on conversion","description_en":"p-value = 0.03 result is correctly matched","description_id":"Hasil p-value = 0,03 cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Strong positive correlation — higher temperature is closely associated with higher ice cream sales","description_en":"r = 0.91 result is correctly matched","description_id":"Hasil r = 0,91 cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The data is right-skewed — a small number of older customers are pulling the mean up","description_en":"Mean > Median result is correctly matched","description_id":"Hasil Mean > Median cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Daily order volume is very consistent and predictable","description_en":"Low standard deviation result is correctly matched","description_id":"Hasil standar deviasi rendah cocok dengan benar","points":25}]',
  '["When mean > median, the distribution is right-skewed — high outliers pull the mean upward","p-value < 0.05 means you have enough evidence to reject the null hypothesis"]',
  '["Ketika mean > median, distribusi right-skewed — outlier tinggi menarik mean ke atas","p-value < 0,05 berarti Anda memiliki cukup bukti untuk menolak null hypothesis"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '07' LIMIT 1;

-- ============================================================
-- SESSION 08: Data Storytelling & Communication
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Storytelling Principles',
  'Prinsip-Prinsip Storytelling',
  'Match each data storytelling principle to its definition.',
  'Cocokkan setiap prinsip storytelling data dengan definisinya.',
  '{"pairs":[{"left":"Lead with the insight","right":"State your main finding first, before showing supporting data"},{"left":"Know your audience","right":"Tailor the level of detail and technical language to who is listening"},{"left":"One message per slide","right":"Each slide or chart should communicate exactly one clear point"},{"left":"Context before data","right":"Explain the business situation and why it matters before showing numbers"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"State your main finding first, before showing supporting data","description_en":"Lead with the insight is correctly matched","description_id":"Lead with the insight cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Tailor the level of detail and technical language to who is listening","description_en":"Know your audience is correctly matched","description_id":"Know your audience cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Each slide or chart should communicate exactly one clear point","description_en":"One message per slide is correctly matched","description_id":"One message per slide cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Explain the business situation and why it matters before showing numbers","description_en":"Context before data is correctly matched","description_id":"Context before data cocok dengan benar","points":25}]',
  '["Think of data storytelling like a news article — the headline (insight) comes first","A CEO wants the bottom line quickly; a data team wants to see the methodology"]',
  '["Bayangkan storytelling data seperti artikel berita — headline (insight) datang duluan","CEO ingin inti permasalahan dengan cepat; tim data ingin melihat metodologinya"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '08' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Presentation Components',
  'Komponen Presentasi',
  'Match each part of a data presentation to its purpose.',
  'Cocokkan setiap bagian presentasi data dengan tujuannya.',
  '{"pairs":[{"left":"Executive summary","right":"A concise overview of the key findings and recommendations on the first page"},{"left":"Methodology slide","right":"Explains how data was collected and analysed so the audience can trust the findings"},{"left":"Recommendation","right":"The specific action you suggest the business should take based on the analysis"},{"left":"Appendix","right":"Detailed data tables and technical notes for those who want to go deeper"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"A concise overview of the key findings and recommendations on the first page","description_en":"Executive summary is correctly matched","description_id":"Executive summary cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Explains how data was collected and analysed so the audience can trust the findings","description_en":"Methodology slide is correctly matched","description_id":"Methodology slide cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"The specific action you suggest the business should take based on the analysis","description_en":"Recommendation is correctly matched","description_id":"Recommendation cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Detailed data tables and technical notes for those who want to go deeper","description_en":"Appendix is correctly matched","description_id":"Appendix cocok dengan benar","points":25}]',
  '["Busy executives read the executive summary and jump to recommendations — make those two sections very strong","Put heavy technical detail in the appendix so it doesn''t slow down the main story"]',
  '["Eksekutif sibuk membaca executive summary dan langsung ke rekomendasi — buat kedua bagian itu sangat kuat","Masukkan detail teknis berat ke appendix agar tidak memperlambat cerita utama"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '08' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Common Communication Mistakes',
  'Kesalahan Komunikasi yang Umum',
  'Match each communication mistake to its description.',
  'Cocokkan setiap kesalahan komunikasi dengan deskripsinya.',
  '{"pairs":[{"left":"Data dumping","right":"Showing all available data without filtering to what is relevant"},{"left":"Jargon overload","right":"Using technical terms (p-value, heteroscedasticity) without explaining them to a non-technical audience"},{"left":"Burying the lead","right":"Saving the most important finding for the end instead of leading with it"},{"left":"Chart clutter","right":"Adding too many chart elements (gridlines, legends, 3D effects) that distract from the data"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Showing all available data without filtering to what is relevant","description_en":"Data dumping is correctly matched","description_id":"Data dumping cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Using technical terms (p-value, heteroscedasticity) without explaining them to a non-technical audience","description_en":"Jargon overload is correctly matched","description_id":"Jargon overload cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Saving the most important finding for the end instead of leading with it","description_en":"Burying the lead is correctly matched","description_id":"Burying the lead cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Adding too many chart elements (gridlines, legends, 3D effects) that distract from the data","description_en":"Chart clutter is correctly matched","description_id":"Chart clutter cocok dengan benar","points":25}]',
  '["''Burying the lead'' is a journalism term — journalists put the most important fact first","Ask yourself: if the audience only remembers one thing from this presentation, what should it be?"]',
  '["''Burying the lead'' adalah istilah jurnalisme — jurnalis menempatkan fakta terpenting di awal","Tanyakan diri sendiri: jika audiens hanya mengingat satu hal dari presentasi ini, apa itu?"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '08' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Choosing the Right Communication Format',
  'Memilih Format Komunikasi yang Tepat',
  'Match each business situation to the most appropriate communication format.',
  'Cocokkan setiap situasi bisnis dengan format komunikasi yang paling tepat.',
  '{"pairs":[{"left":"Weekly performance update for a team of 15 analysts","right":"Automated email with a one-page summary and a link to the live dashboard"},{"left":"Presenting quarterly results to the board of directors","right":"A polished 10-slide PowerPoint deck with clear visuals and a 3-minute verbal summary"},{"left":"Answering a one-off ad-hoc question from a product manager","right":"A Slack message with a screenshot of the key chart and 2-3 bullet point takeaways"},{"left":"A deep-dive analysis report for the data science team","right":"A detailed written report with methodology, full data tables, and code appendix"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Automated email with a one-page summary and a link to the live dashboard","description_en":"Weekly team update is correctly matched","description_id":"Update tim mingguan cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"A polished 10-slide PowerPoint deck with clear visuals and a 3-minute verbal summary","description_en":"Board quarterly results is correctly matched","description_id":"Hasil kuartal untuk dewan cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"A Slack message with a screenshot of the key chart and 2-3 bullet point takeaways","description_en":"Ad-hoc PM question is correctly matched","description_id":"Pertanyaan ad-hoc dari PM cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A detailed written report with methodology, full data tables, and code appendix","description_en":"Deep-dive for data science team is correctly matched","description_id":"Analisis mendalam untuk tim data science cocok dengan benar","points":25}]',
  '["Match the format to the audience''s time, technical level, and how they will consume it","Board presentations need to be concise — senior leaders have limited time and want decisions, not details"]',
  '["Sesuaikan format dengan waktu audiens, tingkat teknis, dan cara mereka mengkonsumsinya","Presentasi dewan perlu ringkas — pemimpin senior memiliki waktu terbatas dan menginginkan keputusan, bukan detail"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '08' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Narrative Structure in Data Presentations',
  'Struktur Narasi dalam Presentasi Data',
  'Match each narrative element to its role in a data story.',
  'Cocokkan setiap elemen narasi dengan perannya dalam cerita data.',
  '{"pairs":[{"left":"Setting","right":"Describe the business context and what was happening before the problem"},{"left":"Conflict","right":"Introduce the business problem or question that triggered the analysis"},{"left":"Rising action","right":"Walk through the data findings, building evidence step by step"},{"left":"Resolution","right":"Deliver the recommendation and the expected outcome if action is taken"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Describe the business context and what was happening before the problem","description_en":"Setting is correctly matched","description_id":"Setting cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Introduce the business problem or question that triggered the analysis","description_en":"Conflict is correctly matched","description_id":"Conflict cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Walk through the data findings, building evidence step by step","description_en":"Rising action is correctly matched","description_id":"Rising action cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Deliver the recommendation and the expected outcome if action is taken","description_en":"Resolution is correctly matched","description_id":"Resolution cocok dengan benar","points":25}]',
  '["Great data presentations borrow from storytelling — they have a clear beginning, middle, and end","The conflict creates tension that makes the audience want to know the answer"]',
  '["Presentasi data yang bagus meminjam dari storytelling — memiliki awal, tengah, dan akhir yang jelas","Konflik menciptakan ketegangan yang membuat audiens ingin tahu jawabannya"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '08' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Difficult Audience Situations & Best Response',
  'Situasi Audiens Sulit & Respons Terbaik',
  'An analyst is presenting findings to leadership. Match each challenging situation to the best professional response.',
  'Seorang analis mempresentasikan temuan kepada pimpinan. Cocokkan setiap situasi menantang dengan respons profesional terbaik.',
  '{"pairs":[{"left":"A director challenges your conclusion and says ''that doesn''t match my experience''","right":"Acknowledge their perspective, present the data calmly, and offer to investigate their specific concern"},{"left":"You are asked a question you cannot answer during the presentation","right":"Say ''great question — I don''t have that data today but I''ll follow up with the answer by tomorrow''"},{"left":"The audience looks confused by your chart halfway through","right":"Pause, simplify the explanation verbally, and offer to show a simpler version"},{"left":"A stakeholder asks you to change the conclusion to match their preferred outcome","right":"Explain that you must report what the data shows, but offer to highlight any caveats or limitations"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Acknowledge their perspective, present the data calmly, and offer to investigate their specific concern","description_en":"Director challenge situation is correctly matched","description_id":"Situasi tantangan dari direktur cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Say ''great question — I don''t have that data today but I''ll follow up with the answer by tomorrow''","description_en":"Unknown answer situation is correctly matched","description_id":"Situasi jawaban tidak diketahui cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Pause, simplify the explanation verbally, and offer to show a simpler version","description_en":"Confused audience situation is correctly matched","description_id":"Situasi audiens bingung cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Explain that you must report what the data shows, but offer to highlight any caveats or limitations","description_en":"Pressure to change conclusion is correctly matched","description_id":"Tekanan untuk mengubah kesimpulan cocok dengan benar","points":25}]',
  '["Never bluff or make up data under pressure — credibility takes years to build and seconds to lose","Admitting you don''t know something is more professional than guessing"]',
  '["Jangan pernah berbohong atau membuat data di bawah tekanan — kredibilitas membutuhkan bertahun-tahun untuk dibangun dan hitungan detik untuk hilang","Mengakui bahwa Anda tidak tahu sesuatu lebih profesional daripada menebak"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '08' LIMIT 1;

-- ============================================================
-- SESSION 09: Capstone Preparation & Portfolio
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Portfolio Components',
  'Komponen Portofolio',
  'Match each portfolio component to its description.',
  'Cocokkan setiap komponen portofolio dengan deskripsinya.',
  '{"pairs":[{"left":"Case study","right":"An end-to-end analysis project showing your problem-solving process from question to recommendation"},{"left":"GitHub repository","right":"A version-controlled folder containing your code, queries, and notebooks"},{"left":"LinkedIn profile","right":"Your professional online presence showcasing skills, experience, and recommendations"},{"left":"README file","right":"A text document at the top of a project explaining what it does and how to run it"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"An end-to-end analysis project showing your problem-solving process from question to recommendation","description_en":"Case study is correctly matched","description_id":"Case study cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"A version-controlled folder containing your code, queries, and notebooks","description_en":"GitHub repository is correctly matched","description_id":"GitHub repository cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Your professional online presence showcasing skills, experience, and recommendations","description_en":"LinkedIn profile is correctly matched","description_id":"LinkedIn profile cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A text document at the top of a project explaining what it does and how to run it","description_en":"README file is correctly matched","description_id":"README file cocok dengan benar","points":25}]',
  '["A portfolio with 2-3 high-quality case studies beats a portfolio with 10 shallow ones","The README is the first thing a recruiter sees when opening your GitHub project — make it clear and professional"]',
  '["Portofolio dengan 2-3 case study berkualitas tinggi mengalahkan portofolio dengan 10 yang dangkal","README adalah hal pertama yang dilihat rekruter saat membuka proyek GitHub Anda — buat jelas dan profesional"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '09' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Project Phases',
  'Fase-Fase Proyek',
  'Match each phase of a data analysis project to its key activity.',
  'Cocokkan setiap fase proyek analisis data dengan aktivitas utamanya.',
  '{"pairs":[{"left":"Scoping","right":"Define the question, success criteria, and data sources before starting"},{"left":"Data preparation","right":"Clean, join, and transform raw data into a format ready for analysis"},{"left":"Exploratory analysis","right":"Examine distributions, patterns, and outliers to understand the data"},{"left":"Insight communication","right":"Package findings into a clear report or dashboard for stakeholders"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Define the question, success criteria, and data sources before starting","description_en":"Scoping is correctly matched","description_id":"Scoping cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Clean, join, and transform raw data into a format ready for analysis","description_en":"Data preparation is correctly matched","description_id":"Data preparation cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Examine distributions, patterns, and outliers to understand the data","description_en":"Exploratory analysis is correctly matched","description_id":"Exploratory analysis cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Package findings into a clear report or dashboard for stakeholders","description_en":"Insight communication is correctly matched","description_id":"Insight communication cocok dengan benar","points":25}]',
  '["Data preparation typically takes 60-80% of total project time in real-world projects","Never skip scoping — jumping straight into the data leads to wasted work"]',
  '["Persiapan data biasanya memakan 60-80% dari total waktu proyek di dunia nyata","Jangan pernah melewati scoping — langsung ke data menyebabkan pekerjaan yang sia-sia"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '09' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Professional Skills for Data Analysts',
  'Keterampilan Profesional untuk Data Analyst',
  'Match each professional skill to its description.',
  'Cocokkan setiap keterampilan profesional dengan deskripsinya.',
  '{"pairs":[{"left":"Stakeholder management","right":"Building relationships and managing expectations with people who depend on your analysis"},{"left":"Project scoping","right":"Defining clear boundaries, deliverables, and timelines before starting work"},{"left":"Self-review","right":"Checking your own work for errors before sharing it — sanity-checking numbers and logic"},{"left":"Documentation","right":"Writing clear notes about what you did, why you did it, and what the data means"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Building relationships and managing expectations with people who depend on your analysis","description_en":"Stakeholder management is correctly matched","description_id":"Stakeholder management cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Defining clear boundaries, deliverables, and timelines before starting work","description_en":"Project scoping is correctly matched","description_id":"Project scoping cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Checking your own work for errors before sharing it — sanity-checking numbers and logic","description_en":"Self-review is correctly matched","description_id":"Self-review cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Writing clear notes about what you did, why you did it, and what the data means","description_en":"Documentation is correctly matched","description_id":"Documentation cocok dengan benar","points":25}]',
  '["Soft skills like stakeholder management are just as important as technical SQL skills in a real job","Always do a quick sanity check — does the total add up? Do the percentages sum to 100%?"]',
  '["Soft skill seperti stakeholder management sama pentingnya dengan kemampuan SQL teknis di pekerjaan nyata","Selalu lakukan sanity check cepat — apakah totalnya cocok? Apakah persentase totalnya 100%?"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '09' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Capstone Project Elements',
  'Elemen Proyek Capstone',
  'Match each capstone project element to what makes it strong.',
  'Cocokkan setiap elemen proyek capstone dengan apa yang membuatnya kuat.',
  '{"pairs":[{"left":"Problem statement","right":"Specific and measurable — e.g. ''Why did customer retention drop 15% in Q3 2024 in Java?''"},{"left":"Data source","right":"Real or realistic dataset with enough rows and columns to support meaningful analysis"},{"left":"Analysis approach","right":"Logical sequence of steps with clear reasoning for each method chosen"},{"left":"Recommendation","right":"Actionable and tied to a specific business impact or KPI change"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Specific and measurable — e.g. ''Why did customer retention drop 15% in Q3 2024 in Java?''","description_en":"Problem statement is correctly matched","description_id":"Problem statement cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Real or realistic dataset with enough rows and columns to support meaningful analysis","description_en":"Data source is correctly matched","description_id":"Data source cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Logical sequence of steps with clear reasoning for each method chosen","description_en":"Analysis approach is correctly matched","description_id":"Analysis approach cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Actionable and tied to a specific business impact or KPI change","description_en":"Recommendation is correctly matched","description_id":"Recommendation cocok dengan benar","points":25}]',
  '["A vague problem statement (''analyse sales'') leads to a vague analysis — be specific","Recommendations must say WHO should do WHAT by WHEN to be truly actionable"]',
  '["Problem statement yang samar (''analisis penjualan'') menghasilkan analisis yang samar — jadilah spesifik","Rekomendasi harus menyebutkan SIAPA yang harus melakukan APA pada KAPAN agar benar-benar dapat ditindaklanjuti"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '09' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Job Application Materials',
  'Materi Lamaran Kerja',
  'Match each job application material to its key requirement.',
  'Cocokkan setiap materi lamaran kerja dengan persyaratan utamanya.',
  '{"pairs":[{"left":"CV / Resume","right":"One to two pages maximum, tailored to the job description with measurable achievements"},{"left":"Cover letter","right":"Explains why you want this specific role and what unique value you bring to the team"},{"left":"Portfolio link","right":"Direct link to 2-3 projects that demonstrate skills relevant to the job posting"},{"left":"LinkedIn headline","right":"A concise professional summary (under 120 characters) that includes your target role and key skill"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"One to two pages maximum, tailored to the job description with measurable achievements","description_en":"CV / Resume is correctly matched","description_id":"CV / Resume cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Explains why you want this specific role and what unique value you bring to the team","description_en":"Cover letter is correctly matched","description_id":"Cover letter cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Direct link to 2-3 projects that demonstrate skills relevant to the job posting","description_en":"Portfolio link is correctly matched","description_id":"Portfolio link cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A concise professional summary (under 120 characters) that includes your target role and key skill","description_en":"LinkedIn headline is correctly matched","description_id":"LinkedIn headline cocok dengan benar","points":25}]',
  '["Tailor your CV for every application — a generic CV is less effective than a targeted one","Quantify achievements: ''improved dashboard load time by 40%'' beats ''improved dashboard performance''"]',
  '["Sesuaikan CV Anda untuk setiap lamaran — CV generik kurang efektif daripada yang ditargetkan","Kuantifikasi pencapaian: ''meningkatkan waktu muat dashboard sebesar 40%'' lebih baik dari ''meningkatkan performa dashboard''"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '09' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Interview Questions & Best Answer Strategy',
  'Pertanyaan Wawancara & Strategi Jawaban Terbaik',
  'Match each common data analyst interview question to the best answering strategy.',
  'Cocokkan setiap pertanyaan wawancara data analyst yang umum dengan strategi menjawab terbaik.',
  '{"pairs":[{"left":"''Tell me about a time you found an insight that changed a business decision''","right":"Use the STAR method: describe the Situation, Task, Action you took, and Result achieved"},{"left":"''How would you analyse a sudden 20% drop in app daily active users?''","right":"Structure your answer: check data quality first, then segment by platform, region, and user type to isolate the cause"},{"left":"''What is the difference between INNER JOIN and LEFT JOIN?''","right":"Explain with a concrete example: INNER returns only matching rows; LEFT returns all rows from the left table"},{"left":"''Where do you see yourself in 3 years?''","right":"Connect your growth to the company''s mission — show ambition aligned with the role you are applying for"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Use the STAR method: describe the Situation, Task, Action you took, and Result achieved","description_en":"Behavioural question is correctly matched","description_id":"Pertanyaan behavioral cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Structure your answer: check data quality first, then segment by platform, region, and user type to isolate the cause","description_en":"DAU drop question is correctly matched","description_id":"Pertanyaan penurunan DAU cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Explain with a concrete example: INNER returns only matching rows; LEFT returns all rows from the left table","description_en":"JOIN difference question is correctly matched","description_id":"Pertanyaan perbedaan JOIN cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Connect your growth to the company''s mission — show ambition aligned with the role you are applying for","description_en":"Career growth question is correctly matched","description_id":"Pertanyaan pertumbuhan karier cocok dengan benar","points":25}]',
  '["STAR method (Situation, Task, Action, Result) is the gold standard for behavioural interview questions","For analytical questions, always start by questioning data quality before jumping to conclusions"]',
  '["Metode STAR (Situation, Task, Action, Result) adalah standar emas untuk pertanyaan wawancara behavioral","Untuk pertanyaan analitis, selalu mulai dengan mempertanyakan kualitas data sebelum melompat ke kesimpulan"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '09' LIMIT 1;

-- ============================================================
-- SESSION 11: Final Project
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Project Methodology Concepts',
  'Konsep Metodologi Proyek',
  'Match each project methodology term to its definition.',
  'Cocokkan setiap istilah metodologi proyek dengan definisinya.',
  '{"pairs":[{"left":"Scope creep","right":"When a project''s requirements expand beyond the original agreement without adjusting time or resources"},{"left":"Milestone","right":"A significant checkpoint or deliverable that marks progress in the project timeline"},{"left":"Stakeholder sign-off","right":"Formal approval from key decision-makers before moving to the next project phase"},{"left":"Iteration","right":"Revisiting and improving a previous output based on new findings or feedback"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"When a project''s requirements expand beyond the original agreement without adjusting time or resources","description_en":"Scope creep is correctly matched","description_id":"Scope creep cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"A significant checkpoint or deliverable that marks progress in the project timeline","description_en":"Milestone is correctly matched","description_id":"Milestone cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Formal approval from key decision-makers before moving to the next project phase","description_en":"Stakeholder sign-off is correctly matched","description_id":"Stakeholder sign-off cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Revisiting and improving a previous output based on new findings or feedback","description_en":"Iteration is correctly matched","description_id":"Iteration cocok dengan benar","points":25}]',
  '["Scope creep is one of the top reasons projects are delayed — always document what is in and out of scope","Good analysts iterate — the first version of an analysis is rarely the final version"]',
  '["Scope creep adalah salah satu alasan utama proyek terlambat — selalu dokumentasikan apa yang termasuk dan tidak termasuk dalam scope","Analis yang baik melakukan iterasi — versi pertama analisis jarang menjadi versi final"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '11' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Analysis Phase Deliverables',
  'Deliverable Setiap Fase Analisis',
  'Match each analysis phase to its primary deliverable.',
  'Cocokkan setiap fase analisis dengan deliverable utamanya.',
  '{"pairs":[{"left":"Business understanding phase","right":"A written problem statement and list of key questions the analysis must answer"},{"left":"Data collection phase","right":"A data inventory table listing sources, columns, row counts, and data quality issues"},{"left":"Analysis phase","right":"A set of charts, summary statistics, and annotated findings"},{"left":"Presentation phase","right":"A slide deck or dashboard presented to stakeholders with recommendations"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"A written problem statement and list of key questions the analysis must answer","description_en":"Business understanding phase is correctly matched","description_id":"Business understanding phase cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"A data inventory table listing sources, columns, row counts, and data quality issues","description_en":"Data collection phase is correctly matched","description_id":"Data collection phase cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"A set of charts, summary statistics, and annotated findings","description_en":"Analysis phase is correctly matched","description_id":"Analysis phase cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"A slide deck or dashboard presented to stakeholders with recommendations","description_en":"Presentation phase is correctly matched","description_id":"Presentation phase cocok dengan benar","points":25}]',
  '["Every phase should produce a concrete, tangible output — this keeps projects on track","A data inventory helps you understand what you have before you start analyzing"]',
  '["Setiap fase harus menghasilkan output yang konkret dan nyata — ini menjaga proyek tetap pada jalurnya","Inventaris data membantu Anda memahami apa yang Anda miliki sebelum mulai menganalisis"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '11' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Data Quality Checks',
  'Pemeriksaan Kualitas Data',
  'Match each data quality check to what it detects.',
  'Cocokkan setiap pemeriksaan kualitas data dengan apa yang dideteksinya.',
  '{"pairs":[{"left":"Completeness check","right":"Identifies columns or rows with missing or null values"},{"left":"Uniqueness check","right":"Detects duplicate records that should appear only once"},{"left":"Validity check","right":"Flags values that fall outside expected ranges or formats (e.g. negative age)"},{"left":"Consistency check","right":"Finds contradictions between related fields (e.g. end date before start date)"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Identifies columns or rows with missing or null values","description_en":"Completeness check is correctly matched","description_id":"Completeness check cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Detects duplicate records that should appear only once","description_en":"Uniqueness check is correctly matched","description_id":"Uniqueness check cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Flags values that fall outside expected ranges or formats (e.g. negative age)","description_en":"Validity check is correctly matched","description_id":"Validity check cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Finds contradictions between related fields (e.g. end date before start date)","description_en":"Consistency check is correctly matched","description_id":"Consistency check cocok dengan benar","points":25}]',
  '["Always run data quality checks before any analysis — garbage in, garbage out","Duplicate records are one of the most common data quality issues in Indonesian business data"]',
  '["Selalu jalankan pemeriksaan kualitas data sebelum analisis apapun — sampah masuk, sampah keluar","Rekaman duplikat adalah salah satu masalah kualitas data paling umum dalam data bisnis Indonesia"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '11' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Final Project Common Pitfalls',
  'Jebakan Umum Proyek Akhir',
  'Match each common final project mistake to its consequence.',
  'Cocokkan setiap kesalahan umum proyek akhir dengan konsekuensinya.',
  '{"pairs":[{"left":"Analysing data without first defining a business question","right":"The analysis produces interesting statistics but no actionable recommendation"},{"left":"Using only aggregated totals without segmenting the data","right":"Important differences between subgroups (regions, products, customer types) are hidden"},{"left":"Reporting findings without checking if the source data is up to date","right":"Recommendations are based on stale data that no longer reflects current business reality"},{"left":"Presenting without a clear narrative structure","right":"The audience understands the individual charts but cannot connect them into a coherent story"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"The analysis produces interesting statistics but no actionable recommendation","description_en":"No business question pitfall is correctly matched","description_id":"Jebakan tanpa pertanyaan bisnis cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Important differences between subgroups (regions, products, customer types) are hidden","description_en":"No segmentation pitfall is correctly matched","description_id":"Jebakan tanpa segmentasi cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Recommendations are based on stale data that no longer reflects current business reality","description_en":"Stale data pitfall is correctly matched","description_id":"Jebakan data usang cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"The audience understands the individual charts but cannot connect them into a coherent story","description_en":"No narrative structure pitfall is correctly matched","description_id":"Jebakan tanpa struktur narasi cocok dengan benar","points":25}]',
  '["Segmentation is powerful — national averages often hide dramatic regional differences in Indonesia","Always check the data''s timestamp or extraction date before drawing conclusions"]',
  '["Segmentasi sangat powerful — rata-rata nasional sering menyembunyikan perbedaan regional yang dramatis di Indonesia","Selalu periksa timestamp atau tanggal ekstraksi data sebelum menarik kesimpulan"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '11' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Analysis Techniques & When to Use Them',
  'Teknik Analisis & Kapan Menggunakannya',
  'Match each analysis technique to the business situation where it is most appropriate.',
  'Cocokkan setiap teknik analisis dengan situasi bisnis di mana teknik tersebut paling tepat.',
  '{"pairs":[{"left":"Cohort analysis","right":"Tracking how groups of users acquired in different months behave over time"},{"left":"Funnel analysis","right":"Identifying at which step in a multi-step process (e.g. registration) most users drop off"},{"left":"Trend decomposition","right":"Separating a time series into trend, seasonality, and noise components"},{"left":"Pareto analysis","right":"Finding the 20% of products or customers that generate 80% of revenue"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Tracking how groups of users acquired in different months behave over time","description_en":"Cohort analysis is correctly matched","description_id":"Cohort analysis cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Identifying at which step in a multi-step process (e.g. registration) most users drop off","description_en":"Funnel analysis is correctly matched","description_id":"Funnel analysis cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Separating a time series into trend, seasonality, and noise components","description_en":"Trend decomposition is correctly matched","description_id":"Trend decomposition cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Finding the 20% of products or customers that generate 80% of revenue","description_en":"Pareto analysis is correctly matched","description_id":"Pareto analysis cocok dengan benar","points":25}]',
  '["Cohort analysis is the gold standard for understanding user retention in apps and subscription businesses","Pareto analysis (80/20 rule) helps businesses focus limited resources on the highest-impact areas"]',
  '["Cohort analysis adalah standar emas untuk memahami retensi pengguna di aplikasi dan bisnis berlangganan","Pareto analysis (aturan 80/20) membantu bisnis memfokuskan sumber daya terbatas pada area berdampak tertinggi"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '11' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Business Metric & Correct Interpretation',
  'Metrik Bisnis & Interpretasi yang Tepat',
  'You are reviewing the final project of a junior analyst. Match each metric result to the correct interpretation and next step.',
  'Anda meninjau proyek akhir analis junior. Cocokkan setiap hasil metrik dengan interpretasi yang tepat dan langkah selanjutnya.',
  '{"pairs":[{"left":"Customer acquisition cost increased 40% while revenue per customer stayed flat","right":"Profitability per customer is declining — recommend investigating which acquisition channel is driving the cost increase"},{"left":"Top 5 products account for 78% of total revenue","right":"High revenue concentration risk — recommend diversifying the product mix or protecting those 5 products strategically"},{"left":"Month-3 retention is 15% compared to industry benchmark of 35%","right":"Retention is critically below benchmark — recommend a focused investigation into the onboarding and month-1 experience"},{"left":"Average order value grew 25% but order volume dropped 18%","right":"Fewer but higher-value transactions — investigate whether pricing changes drove away price-sensitive customers"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Profitability per customer is declining — recommend investigating which acquisition channel is driving the cost increase","description_en":"CAC increase metric is correctly matched","description_id":"Metrik peningkatan CAC cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"High revenue concentration risk — recommend diversifying the product mix or protecting those 5 products strategically","description_en":"Revenue concentration metric is correctly matched","description_id":"Metrik konsentrasi pendapatan cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Retention is critically below benchmark — recommend a focused investigation into the onboarding and month-1 experience","description_en":"Low retention metric is correctly matched","description_id":"Metrik retensi rendah cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Fewer but higher-value transactions — investigate whether pricing changes drove away price-sensitive customers","description_en":"AOV up, volume down metric is correctly matched","description_id":"Metrik AOV naik, volume turun cocok dengan benar","points":25}]',
  '["Always pair a metric result with a business implication and a recommended next step","Revenue concentration in a few products is a common risk in Indonesian SME businesses — one discontinuation can be devastating"]',
  '["Selalu pasangkan hasil metrik dengan implikasi bisnis dan langkah selanjutnya yang direkomendasikan","Konsentrasi pendapatan di beberapa produk adalah risiko umum di bisnis UKM Indonesia — satu penghentian produk bisa sangat merugikan"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '11' LIMIT 1;

-- ============================================================
-- SESSION 12: Ethics, Privacy & Career
-- ============================================================

-- Easy 1
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Data Ethics Concepts',
  'Konsep Etika Data',
  'Match each data ethics concept to its definition.',
  'Cocokkan setiap konsep etika data dengan definisinya.',
  '{"pairs":[{"left":"Data privacy","right":"The right of individuals to control how their personal information is collected and used"},{"left":"Informed consent","right":"Users must be clearly told how their data will be used before they agree to share it"},{"left":"Data minimisation","right":"Collecting only the data that is strictly necessary for the stated purpose"},{"left":"Anonymisation","right":"Removing or masking identifying information so individuals cannot be traced in a dataset"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"The right of individuals to control how their personal information is collected and used","description_en":"Data privacy is correctly matched","description_id":"Data privacy cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Users must be clearly told how their data will be used before they agree to share it","description_en":"Informed consent is correctly matched","description_id":"Informed consent cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Collecting only the data that is strictly necessary for the stated purpose","description_en":"Data minimisation is correctly matched","description_id":"Data minimisation cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Removing or masking identifying information so individuals cannot be traced in a dataset","description_en":"Anonymisation is correctly matched","description_id":"Anonymisation cocok dengan benar","points":25}]',
  '["Indonesia''s Personal Data Protection Law (UU PDP) came into effect in 2022 — data analysts must be aware of it","Data minimisation is a key GDPR principle — only collect what you need"]',
  '["Undang-Undang Perlindungan Data Pribadi Indonesia (UU PDP) mulai berlaku tahun 2022 — data analyst harus mengetahuinya","Data minimisation adalah prinsip GDPR utama — hanya kumpulkan apa yang Anda butuhkan"]',
  'easy', 1
FROM sessions s WHERE s.session_number = '12' LIMIT 1;

-- Easy 2
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Types of Bias in Data',
  'Jenis-Jenis Bias dalam Data',
  'Match each type of bias to its description.',
  'Cocokkan setiap jenis bias dengan deskripsinya.',
  '{"pairs":[{"left":"Sampling bias","right":"The data sample does not represent the full population being studied"},{"left":"Confirmation bias","right":"Selectively looking for or interpreting data that supports a pre-existing belief"},{"left":"Survivorship bias","right":"Analysing only the data from entities that survived a process, ignoring those that did not"},{"left":"Automation bias","right":"Over-trusting the output of algorithms or AI tools without critical review"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"The data sample does not represent the full population being studied","description_en":"Sampling bias is correctly matched","description_id":"Sampling bias cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Selectively looking for or interpreting data that supports a pre-existing belief","description_en":"Confirmation bias is correctly matched","description_id":"Confirmation bias cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Analysing only the data from entities that survived a process, ignoring those that did not","description_en":"Survivorship bias is correctly matched","description_id":"Survivorship bias cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Over-trusting the output of algorithms or AI tools without critical review","description_en":"Automation bias is correctly matched","description_id":"Automation bias cocok dengan benar","points":25}]',
  '["Survivorship bias example: studying successful startups only — you ignore the majority that failed with similar strategies","Confirmation bias is the enemy of good analysis — always look for evidence that challenges your hypothesis"]',
  '["Contoh survivorship bias: hanya mempelajari startup sukses — Anda mengabaikan mayoritas yang gagal dengan strategi serupa","Confirmation bias adalah musuh analisis yang baik — selalu cari bukti yang menantang hipotesis Anda"]',
  'easy', 2
FROM sessions s WHERE s.session_number = '12' LIMIT 1;

-- Easy 3
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Data Career Paths',
  'Jalur Karier Data',
  'Match each data career role to its primary focus.',
  'Cocokkan setiap peran karier data dengan fokus utamanya.',
  '{"pairs":[{"left":"Data Analyst","right":"Answers business questions by exploring and summarising data using SQL, Excel, and dashboards"},{"left":"Analytics Engineer","right":"Builds and maintains the data transformation layer (dbt models, data warehouse)"},{"left":"Data Product Manager","right":"Defines the roadmap for data products and coordinates between engineering and business teams"},{"left":"Chief Data Officer (CDO)","right":"Leads the organisation''s overall data strategy, governance, and culture"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Answers business questions by exploring and summarising data using SQL, Excel, and dashboards","description_en":"Data Analyst is correctly matched","description_id":"Data Analyst cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Builds and maintains the data transformation layer (dbt models, data warehouse)","description_en":"Analytics Engineer is correctly matched","description_id":"Analytics Engineer cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Defines the roadmap for data products and coordinates between engineering and business teams","description_en":"Data Product Manager is correctly matched","description_id":"Data Product Manager cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Leads the organisation''s overall data strategy, governance, and culture","description_en":"Chief Data Officer is correctly matched","description_id":"Chief Data Officer cocok dengan benar","points":25}]',
  '["Analytics Engineer is a newer role that sits between Data Engineer and Data Analyst — growing rapidly in Indonesia","Most data analysts start their career path and can move into data science, analytics engineering, or management"]',
  '["Analytics Engineer adalah peran yang lebih baru yang berada di antara Data Engineer dan Data Analyst — berkembang pesat di Indonesia","Kebanyakan data analyst memulai jalur karier mereka dan dapat berpindah ke data science, analytics engineering, atau manajemen"]',
  'easy', 3
FROM sessions s WHERE s.session_number = '12' LIMIT 1;

-- Medium 4
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Data Governance Concepts',
  'Konsep Tata Kelola Data',
  'Match each data governance concept to its description.',
  'Cocokkan setiap konsep tata kelola data dengan deskripsinya.',
  '{"pairs":[{"left":"Data catalogue","right":"A searchable inventory of all datasets in an organisation with descriptions and ownership"},{"left":"Data lineage","right":"A traceable record of where data comes from, how it is transformed, and where it flows"},{"left":"Role-based access control","right":"Restricting access to sensitive data based on the user''s job function and need-to-know"},{"left":"Data retention policy","right":"Rules defining how long different types of data must be kept before being deleted"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"A searchable inventory of all datasets in an organisation with descriptions and ownership","description_en":"Data catalogue is correctly matched","description_id":"Data catalogue cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"A traceable record of where data comes from, how it is transformed, and where it flows","description_en":"Data lineage is correctly matched","description_id":"Data lineage cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Restricting access to sensitive data based on the user''s job function and need-to-know","description_en":"Role-based access control is correctly matched","description_id":"Role-based access control cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Rules defining how long different types of data must be kept before being deleted","description_en":"Data retention policy is correctly matched","description_id":"Data retention policy cocok dengan benar","points":25}]',
  '["Data governance sounds boring but prevents catastrophic data quality and compliance failures","A data catalogue prevents analysts from duplicating work — they can find existing datasets instead of rebuilding them"]',
  '["Tata kelola data terdengar membosankan tetapi mencegah kegagalan kualitas data dan kepatuhan yang bencana","Data catalogue mencegah analis menduplikasi pekerjaan — mereka dapat menemukan dataset yang ada daripada membangunnya kembali"]',
  'medium', 4
FROM sessions s WHERE s.session_number = '12' LIMIT 1;

-- Medium 5
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Ethical Dilemmas & Correct Response',
  'Dilema Etis & Respons yang Tepat',
  'Match each data ethics dilemma to the most appropriate professional response.',
  'Cocokkan setiap dilema etika data dengan respons profesional yang paling tepat.',
  '{"pairs":[{"left":"Your manager asks you to exclude the data from an underperforming region to make the report look better","right":"Refuse and explain that excluding data misrepresents business reality — offer to add context instead"},{"left":"You discover customer data in an unsecured shared drive accessible to all employees","right":"Report it immediately to your data security team or manager as a data breach risk"},{"left":"A model you built correctly predicts outcomes but disproportionately disadvantages certain demographic groups","right":"Raise the fairness issue to your team and investigate ways to reduce discriminatory impact"},{"left":"You are asked to use personal customer data for a purpose not covered by the original consent","right":"Escalate to legal or compliance before proceeding — new consent may be required under UU PDP"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Refuse and explain that excluding data misrepresents business reality — offer to add context instead","description_en":"Exclude underperforming data dilemma is correctly matched","description_id":"Dilema mengecualikan data underperforming cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Report it immediately to your data security team or manager as a data breach risk","description_en":"Unsecured data dilemma is correctly matched","description_id":"Dilema data tidak aman cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Raise the fairness issue to your team and investigate ways to reduce discriminatory impact","description_en":"Biased model dilemma is correctly matched","description_id":"Dilema model bias cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Escalate to legal or compliance before proceeding — new consent may be required under UU PDP","description_en":"Out-of-scope data use dilemma is correctly matched","description_id":"Dilema penggunaan data di luar scope cocok dengan benar","points":25}]',
  '["Ethical dilemmas in data often involve pressure from above — know when to escalate vs when to push back","A data analyst''s integrity is their most valuable professional asset — once compromised, it is hard to recover"]',
  '["Dilema etis dalam data sering melibatkan tekanan dari atas — ketahui kapan harus eskalasi vs kapan harus menolak","Integritas data analyst adalah aset profesional paling berharga — sekali dikompromikan, sulit untuk dipulihkan"]',
  'medium', 5
FROM sessions s WHERE s.session_number = '12' LIMIT 1;

-- Hard 6
INSERT INTO exercises
  (session_id, type, title_en, title_id, description_en, description_id,
   starter_code, solution_code, test_cases, hints_en, hints_id, difficulty, order_num)
SELECT
  s.id, 'matching',
  'Career Scenarios & Strategic Next Step',
  'Skenario Karier & Langkah Strategis Berikutnya',
  'A junior data analyst at a Jakarta fintech company faces different career decisions. Match each scenario to the best strategic next step.',
  'Seorang data analyst junior di perusahaan fintech Jakarta menghadapi berbagai keputusan karier. Cocokkan setiap skenario dengan langkah strategis terbaik berikutnya.',
  '{"pairs":[{"left":"You want to move into a Data Science role within 18 months","right":"Build Python and machine learning skills, take on a prediction project at work, and publish the results on GitHub"},{"left":"You are strong technically but get overlooked for senior roles","right":"Develop communication and stakeholder skills — volunteer to present findings directly to business leaders"},{"left":"You feel stuck doing the same reports and want more impactful work","right":"Propose a new analysis project to your manager that addresses a real business problem you have identified"},{"left":"You are considering freelancing as a data analyst","right":"Build a strong portfolio with 3 diverse case studies, set competitive rates based on market research, and start on a freelance platform"}]}',
  '',
  '[{"id":"tc1","validation_type":"matching","expected_value":"Build Python and machine learning skills, take on a prediction project at work, and publish the results on GitHub","description_en":"Move to Data Science scenario is correctly matched","description_id":"Skenario pindah ke Data Science cocok dengan benar","points":25},{"id":"tc2","validation_type":"matching","expected_value":"Develop communication and stakeholder skills — volunteer to present findings directly to business leaders","description_en":"Technically strong but overlooked scenario is correctly matched","description_id":"Skenario kuat secara teknis tapi diabaikan cocok dengan benar","points":25},{"id":"tc3","validation_type":"matching","expected_value":"Propose a new analysis project to your manager that addresses a real business problem you have identified","description_en":"Stuck on routine reports scenario is correctly matched","description_id":"Skenario terjebak dalam laporan rutin cocok dengan benar","points":25},{"id":"tc4","validation_type":"matching","expected_value":"Build a strong portfolio with 3 diverse case studies, set competitive rates based on market research, and start on a freelance platform","description_en":"Considering freelancing scenario is correctly matched","description_id":"Skenario mempertimbangkan freelancing cocok dengan benar","points":25}]',
  '["Senior roles require both technical excellence AND the ability to influence decisions — invest in both","The best way to get more interesting work is to identify a real problem and propose to solve it — don''t wait to be assigned"]',
  '["Peran senior membutuhkan keunggulan teknis DAN kemampuan untuk mempengaruhi keputusan — investasikan di keduanya","Cara terbaik untuk mendapatkan pekerjaan yang lebih menarik adalah mengidentifikasi masalah nyata dan mengusulkan untuk memecahkannya — jangan menunggu ditugaskan"]',
  'hard', 6
FROM sessions s WHERE s.session_number = '12' LIMIT 1;
