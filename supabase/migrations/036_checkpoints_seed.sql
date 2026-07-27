-- ============================================================
-- 036: Example live-checkpoint content for the
--      "Data Analyst Fast Track · 2026" program.
--      X01 gets 4 checkpoints (1–3 questions, exercising the full
--      range); X02–X04 get one each so several sessions are
--      immediately live-testable. Mentors author the rest in-app
--      (checkpoint editor, B7).
--
--  Each block: insert a checkpoint, its questions, and the hidden
--  answer keys in one statement via chained CTEs.
-- ============================================================

-- ── X01 · Checkpoint 1 — leading vs lagging (1 question) ────
with cp as (
  insert into public.session_checkpoints (session_id, order_num, title_id, title_en)
  select id, 1, 'Cek Poin 1 · Metrik', 'Checkpoint 1 · Metrics'
  from public.sessions where session_number = 'X01'
  returning id
), q as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_id, prompt_en, options)
  select cp.id, 1,
    'Manakah yang merupakan leading indicator?',
    'Which of these is a leading indicator?',
    '[{"id":"a","label_id":"Pendapatan bulan lalu","label_en":"Last month''s revenue"},
      {"id":"b","label_id":"Jumlah lead baru minggu ini","label_en":"Number of new leads this week"},
      {"id":"c","label_id":"Laba bersih kuartal lalu","label_en":"Last quarter''s net profit"},
      {"id":"d","label_id":"Pelanggan yang churn","label_en":"Customers who churned"}]'::jsonb
  from cp returning id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select id, 'b' from q;

-- ── X01 · Checkpoint 2 — problem statement & process (2 questions) ─
with cp as (
  insert into public.session_checkpoints (session_id, order_num, title_id, title_en)
  select id, 2, 'Cek Poin 2 · Problem Statement', 'Checkpoint 2 · Problem Statement'
  from public.sessions where session_number = 'X01'
  returning id
), q as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_id, prompt_en, options)
  select cp.id, o.order_num, o.pid, o.pen, o.opts from cp,
  (values
    (1,
     'Ciri problem statement yang baik adalah…',
     'A good problem statement is…',
     '[{"id":"a","label_id":"Samar dan luas","label_en":"Vague and broad"},
       {"id":"b","label_id":"Spesifik dan terukur","label_en":"Specific and measurable"},
       {"id":"c","label_id":"Daftar kolom data","label_en":"A list of data columns"},
       {"id":"d","label_id":"Rekomendasi akhir","label_en":"The final recommendation"}]'::jsonb),
    (2,
     'Urutan yang benar untuk memetakan proses bisnis adalah…',
     'The correct order to map a business process is…',
     '[{"id":"a","label_id":"output → proses → input","label_en":"output → process → input"},
       {"id":"b","label_id":"input → proses → output","label_en":"input → process → output"},
       {"id":"c","label_id":"proses → input → output","label_en":"process → input → output"},
       {"id":"d","label_id":"input → output","label_en":"input → output"}]'::jsonb)
  ) as o(order_num, pid, pen, opts)
  returning id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select id, 'b' from q;  -- both correct answers are 'b'

-- ── X01 · Checkpoint 3 — basic statistics (3 questions) ─────
with cp as (
  insert into public.session_checkpoints (session_id, order_num, title_id, title_en)
  select id, 3, 'Cek Poin 3 · Statistik Dasar', 'Checkpoint 3 · Basic Statistics'
  from public.sessions where session_number = 'X01'
  returning id
), q as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_id, prompt_en, options)
  select cp.id, o.order_num, o.pid, o.pen, o.opts from cp,
  (values
    (1,
     'Ukuran mana yang paling terpengaruh oleh outlier?',
     'Which measure is most affected by outliers?',
     '[{"id":"a","label_id":"Mean (rata-rata)","label_en":"Mean"},
       {"id":"b","label_id":"Median","label_en":"Median"},
       {"id":"c","label_id":"Modus","label_en":"Mode"}]'::jsonb),
    (2,
     'Standar deviasi mengukur…',
     'Standard deviation measures…',
     '[{"id":"a","label_id":"Nilai tengah","label_en":"The middle value"},
       {"id":"b","label_id":"Nilai yang paling sering muncul","label_en":"The most frequent value"},
       {"id":"c","label_id":"Seberapa menyebar datanya","label_en":"How spread out the data is"}]'::jsonb),
    (3,
     'Median adalah…',
     'The median is…',
     '[{"id":"a","label_id":"Rata-rata semua nilai","label_en":"The average of all values"},
       {"id":"b","label_id":"Nilai tengah setelah diurutkan","label_en":"The middle value when sorted"},
       {"id":"c","label_id":"Nilai terbesar dikurangi terkecil","label_en":"The largest minus the smallest"}]'::jsonb)
  ) as o(order_num, pid, pen, opts)
  returning id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select id, case order_num when 1 then 'a' when 2 then 'c' when 3 then 'b' end from q;

-- ── X01 · Checkpoint 4 — business acumen (2 questions) ──────
with cp as (
  insert into public.session_checkpoints (session_id, order_num, title_id, title_en)
  select id, 4, 'Cek Poin 4 · Business Acumen', 'Checkpoint 4 · Business Acumen'
  from public.sessions where session_number = 'X01'
  returning id
), q as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_id, prompt_en, options)
  select cp.id, o.order_num, o.pid, o.pen, o.opts from cp,
  (values
    (1,
     'Kenapa analyst butuh business acumen?',
     'Why does an analyst need business acumen?',
     '[{"id":"a","label_id":"Agar menulis kode lebih cepat","label_en":"To write code faster"},
       {"id":"b","label_id":"Untuk menghubungkan temuan data ke dampak bisnis","label_en":"To connect data findings to business impact"},
       {"id":"c","label_id":"Agar tidak perlu pakai Excel","label_en":"To avoid using Excel"},
       {"id":"d","label_id":"Agar bisa melewati tahap cleaning","label_en":"To skip data cleaning"}]'::jsonb),
    (2,
     'Customer acquisition cost adalah contoh…',
     'Customer acquisition cost is an example of…',
     '[{"id":"a","label_id":"Vanity metric","label_en":"A vanity metric"},
       {"id":"b","label_id":"Metrik bisnis yang terkait profitabilitas","label_en":"A business metric tied to profitability"},
       {"id":"c","label_id":"Tipe data","label_en":"A data type"},
       {"id":"d","label_id":"Jenis chart","label_en":"A type of chart"}]'::jsonb)
  ) as o(order_num, pid, pen, opts)
  returning id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select id, 'b' from q;

-- ── X02 · Checkpoint 1 — cleaning (2 questions) ─────────────
with cp as (
  insert into public.session_checkpoints (session_id, order_num, title_id, title_en)
  select id, 1, 'Cek Poin 1 · Data Cleaning', 'Checkpoint 1 · Data Cleaning'
  from public.sessions where session_number = 'X02'
  returning id
), q as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_id, prompt_en, options)
  select cp.id, o.order_num, o.pid, o.pen, o.opts from cp,
  (values
    (1,
     'Fungsi mana yang menghapus spasi berlebih?',
     'Which function removes extra spaces?',
     '[{"id":"a","label_id":"CONCAT","label_en":"CONCAT"},
       {"id":"b","label_id":"TRIM","label_en":"TRIM"},
       {"id":"c","label_id":"LEFT","label_en":"LEFT"},
       {"id":"d","label_id":"VLOOKUP","label_en":"VLOOKUP"}]'::jsonb),
    (2,
     'Error #DIV/0! artinya…',
     'The #DIV/0! error means…',
     '[{"id":"a","label_id":"Referensi terhapus","label_en":"A reference was deleted"},
       {"id":"b","label_id":"Tipe data salah","label_en":"Wrong data type"},
       {"id":"c","label_id":"Pembagian dengan nol","label_en":"Division by zero"},
       {"id":"d","label_id":"Nilai tidak ditemukan","label_en":"Value not found"}]'::jsonb)
  ) as o(order_num, pid, pen, opts)
  returning id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select id, case order_num when 1 then 'b' when 2 then 'c' end from q;

-- ── X03 · Checkpoint 1 — pivot tables (2 questions) ─────────
with cp as (
  insert into public.session_checkpoints (session_id, order_num, title_id, title_en)
  select id, 1, 'Cek Poin 1 · Pivot Table', 'Checkpoint 1 · Pivot Table'
  from public.sessions where session_number = 'X03'
  returning id
), q as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_id, prompt_en, options)
  select cp.id, o.order_num, o.pid, o.pen, o.opts from cp,
  (values
    (1,
     'Di Pivot Table, field yang ingin diringkas secara numerik diletakkan di area…',
     'In a Pivot Table, the field you want to summarize numerically goes in…',
     '[{"id":"a","label_id":"Rows","label_en":"Rows"},
       {"id":"b","label_id":"Filters","label_en":"Filters"},
       {"id":"c","label_id":"Values","label_en":"Values"},
       {"id":"d","label_id":"Columns","label_en":"Columns"}]'::jsonb),
    (2,
     'Untuk mengelompokkan tanggal harian menjadi bulan di Pivot Table, gunakan…',
     'To group daily dates into months in a Pivot Table, you use…',
     '[{"id":"a","label_id":"Slicer","label_en":"Slicer"},
       {"id":"b","label_id":"Grouping","label_en":"Grouping"},
       {"id":"c","label_id":"Calculated field","label_en":"Calculated field"},
       {"id":"d","label_id":"Sort","label_en":"Sort"}]'::jsonb)
  ) as o(order_num, pid, pen, opts)
  returning id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select id, case order_num when 1 then 'c' when 2 then 'b' end from q;

-- ── X04 · Checkpoint 1 — SQL WHERE vs HAVING (2 questions) ──
with cp as (
  insert into public.session_checkpoints (session_id, order_num, title_id, title_en)
  select id, 1, 'Cek Poin 1 · SQL Filtering', 'Checkpoint 1 · SQL Filtering'
  from public.sessions where session_number = 'X04'
  returning id
), q as (
  insert into public.checkpoint_questions (checkpoint_id, order_num, prompt_id, prompt_en, options)
  select cp.id, o.order_num, o.pid, o.pen, o.opts from cp,
  (values
    (1,
     'Klausa mana yang memfilter baris SEBELUM agregasi?',
     'Which clause filters rows BEFORE aggregation?',
     '[{"id":"a","label_id":"HAVING","label_en":"HAVING"},
       {"id":"b","label_id":"WHERE","label_en":"WHERE"},
       {"id":"c","label_id":"ORDER BY","label_en":"ORDER BY"},
       {"id":"d","label_id":"GROUP BY","label_en":"GROUP BY"}]'::jsonb),
    (2,
     'Klausa mana yang memfilter SETELAH agregasi (hasil yang sudah di-group)?',
     'Which clause filters AFTER aggregation (on grouped results)?',
     '[{"id":"a","label_id":"WHERE","label_en":"WHERE"},
       {"id":"b","label_id":"HAVING","label_en":"HAVING"},
       {"id":"c","label_id":"SELECT","label_en":"SELECT"},
       {"id":"d","label_id":"LIMIT","label_en":"LIMIT"}]'::jsonb)
  ) as o(order_num, pid, pen, opts)
  returning id, order_num
)
insert into public.checkpoint_answer_keys (question_id, correct_option_id)
select id, case order_num when 1 then 'b' when 2 then 'b' end from q;
