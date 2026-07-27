-- ============================================================
-- 033: New program "Data Analyst Fast Track · 2026" — an
--      essential (9 sessions) + extended/upscale (3 sessions)
--      track. Modelled on the existing DAFT program (026) so it
--      carries Materi, Playground, discussion, progress,
--      certificates — everything other programs have.
--
--  Two new gating primitives are introduced here:
--    * sessions.is_extension          — marks the 3 upscale lessons
--    * cohort_enrollments.enrollment_tier — 'essential' | 'extended'
--  The access rule (extension lessons unlock only for 'extended'
--  enrollments) lives in the app (src/lib/cohortAccess.ts, B3).
--
--  Session numbers are prefixed "X" (X01–X12) because
--  sessions.session_number is globally UNIQUE. Content is filled
--  in a follow-up migration (034) so it can be reviewed on its own.
-- ============================================================

-- ── 0. New gating columns (idempotent) ──────────────────────
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS is_extension boolean NOT NULL DEFAULT false;

ALTER TABLE public.cohort_enrollments
  ADD COLUMN IF NOT EXISTS enrollment_tier text NOT NULL DEFAULT 'essential'
    CHECK (enrollment_tier IN ('essential', 'extended'));

DO $$
DECLARE
  prog_id     uuid;
  phase1_id   uuid;   -- Essential
  phase2_id   uuid;   -- Extended / Upscale
  cohort_id   uuid;
  lesson0_id  uuid := '00000000-0000-4000-8000-000000000000'; -- shared orientation (Lesson 0)
BEGIN

-- ── 1. Program ───────────────────────────────────────────
INSERT INTO public.programs
  (slug, name_en, name_id, description_en, description_id, icon, color, is_published, order_num)
VALUES
  ('data-analyst-fast-track-2026',
   'Data Analyst Fast Track · 2026',
   'Data Analyst Fast Track · 2026',
   'A live Data Analyst program: 9 essential sessions from business acumen and data cleaning through SQL, EDA, visualization, Power BI, Python, and AI-assisted analysis — plus a 3-session Upscale track (advanced analysis, storytelling, and final portfolio) for eligible learners.',
   'Program Data Analyst live: 9 sesi esensial dari business acumen dan pembersihan data hingga SQL, EDA, visualisasi, Power BI, Python, dan analisis dengan bantuan AI — ditambah jalur Upscale 3 sesi (analisis lanjutan, storytelling, dan final portofolio) untuk peserta yang memenuhi syarat.',
   '⚡', 'from-cyan-500 to-blue-600', true, 2)
RETURNING id INTO prog_id;

-- ── 2. Phases ────────────────────────────────────────────
INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (prog_id, 1,
   'Essential Track',
   'Jalur Esensial',
   'The 9 core sessions every learner takes — from business acumen and clean data to SQL, EDA, visualization, Power BI, Python, and AI-assisted analysis.',
   'Sembilan sesi inti yang diikuti semua peserta — dari business acumen dan data bersih hingga SQL, EDA, visualisasi, Power BI, Python, dan analisis dengan bantuan AI.',
   '📊', 'from-blue-500 to-cyan-500', 1)
RETURNING id INTO phase1_id;

INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (prog_id, 2,
   'Upscale Track (Extended)',
   'Jalur Upscale (Ekstensi)',
   'Three additional sessions for eligible learners: advanced analysis (RFM & segmentation), storytelling with data, and the final project & portfolio.',
   'Tiga sesi tambahan untuk peserta yang memenuhi syarat: analisis lanjutan (RFM & segmentasi), storytelling with data, dan final project & portofolio.',
   '🚀', 'from-violet-500 to-purple-600', 2)
RETURNING id INTO phase2_id;

-- ── 3. Session skeletons (content filled in 034) ─────────
--   estimated_duration_minutes: 120 for the 09.00/13.00 weekend
--   sessions, 90 for the 19.30 evening sessions.
INSERT INTO public.sessions
  (phase_id, session_number, title_id, title_en, unit_skkni,
   learning_output_id, learning_output_en, order_num,
   estimated_duration_minutes, is_extension)
VALUES
-- ── Essential (Phase 1) ──────────────────────────────────
(phase1_id, 'X01',
 'Business Acumen dan Basic Statistics',
 'Business Acumen and Basic Statistics',
 'Unit 1: Pemahaman Bisnis & Statistik Dasar',
 'Mampu mengidentifikasi proses bisnis & metriks yang relevan, serta membaca ringkasan statistik data.',
 'Able to identify business processes & relevant metrics, and read summary statistics of data.',
 201, 120, false),

(phase1_id, 'X02',
 'Membersihkan dan Merapihkan Data',
 'Cleaning and Shaping Data',
 'Unit 1: Persiapan Data',
 'Mampu menghapus duplikat, menangani error, dan merapikan isian data dengan TRIM/CONCAT/LEFT/RIGHT.',
 'Able to remove duplicates, handle errors, and clean data entries with TRIM/CONCAT/LEFT/RIGHT.',
 202, 120, false),

(phase1_id, 'X03',
 'Pivot Table untuk Dapatkan Insight',
 'Pivot Tables for Insight',
 'Unit 2: Analisis Kuantitatif',
 'Mampu menarik insight dari dataset menggunakan Pivot Table dari dasar hingga lanjutan.',
 'Able to draw insight from a dataset using Pivot Tables from basic to advanced.',
 203, 90, false),

(phase1_id, 'X04',
 'Data Collection dengan SQL',
 'Data Collection with SQL',
 'Unit 2: Pengumpulan Data',
 'Mampu mengoperasikan SQL dasar (SELECT, WHERE, ORDER BY, GROUP BY, HAVING) untuk membuat dataset.',
 'Able to operate basic SQL (SELECT, WHERE, ORDER BY, GROUP BY, HAVING) to build a dataset.',
 204, 90, false),

(phase1_id, 'X05',
 'Analisa Data dengan EDA',
 'Data Analysis with EDA',
 'Unit 3: Analisis Data',
 'Mampu melakukan exploratory data analysis (univariate & bivariate) dan menarik insight yang baik.',
 'Able to perform exploratory data analysis (univariate & bivariate) and draw good insight.',
 205, 90, false),

(phase1_id, 'X06',
 'Visualisasi Data',
 'Data Visualization',
 'Unit 3: Visualisasi Data',
 'Mampu membuat visualisasi data yang insightful dengan prinsip storytelling.',
 'Able to build insightful data visualizations with storytelling principles.',
 206, 90, false),

(phase1_id, 'X07',
 'Introduction to Power BI',
 'Introduction to Power BI',
 'Unit 3: Dashboard & BI',
 'Mampu menyusun dan mem-publish dashboard di Power BI dari sebuah case bisnis.',
 'Able to build and publish a Power BI dashboard from a business case.',
 207, 90, false),

(phase1_id, 'X08',
 'Python/Pandas 101',
 'Python/Pandas 101',
 'Unit 3: Analisis dengan Python',
 'Mampu mengoperasikan Python dasar (pandas, matplotlib/seaborn, openpyxl) untuk menarik insight.',
 'Able to operate basic Python (pandas, matplotlib/seaborn, openpyxl) to draw insight.',
 208, 90, false),

(phase1_id, 'X09',
 'Analisis Data End-to-End dengan AI',
 'End-to-End Data Analysis with AI',
 'Unit 4: Otomasi & AI',
 'Mampu merancang prompt untuk menganalisis dataset end-to-end dan memvalidasi output AI.',
 'Able to design prompts for end-to-end dataset analysis and validate AI output.',
 209, 120, false),

-- ── Upscale / Extended (Phase 2) ─────────────────────────
(phase2_id, 'X10',
 'Analisa Data Lanjutan',
 'Advanced Data Analysis',
 'Unit 5: Analisis Lanjutan',
 'Mampu melakukan segmentasi pelanggan dengan metode RFM dan menerjemahkannya jadi rekomendasi.',
 'Able to segment customers with the RFM method and translate it into recommendations.',
 210, 120, true),

(phase2_id, 'X11',
 'Storytelling with Data',
 'Storytelling with Data',
 'Unit 5: Komunikasi Data',
 'Mampu menyusun laporan/deck yang on point sesuai kebutuhan stakeholder dengan prinsip storytelling.',
 'Able to build an on-point report/deck for stakeholder needs using storytelling principles.',
 211, 90, true),

(phase2_id, 'X12',
 'Final Project dan Portofolio',
 'Final Project and Portfolio',
 'Unit 5: Portofolio',
 'Mampu menyelesaikan final project end-to-end dan menyusun portofolio profesional.',
 'Able to complete an end-to-end final project and build a professional portfolio.',
 212, 90, true);

-- ── 4. Cohort — Batch Agustus 2026 ───────────────────────
-- admission_open is FALSE (only one cohort platform-wide may have
-- admission open at a time — unique index one_open_admission).
INSERT INTO public.cohorts
  (program_id, name, description,
   admission_open_at, course_start_at, course_close_at,
   access_duration_months, admission_open, is_published)
VALUES
  (prog_id,
   'Data Analyst Fast Track — Batch Agustus 2026',
   'Angkatan Agustus 2026. Kelas live: 8–9 Agu (09.00 & 13.00 WIB), lalu malam hari (19.30 WIB), dan sesi Upscale 16–19 Agu 2026.',
   '2026-07-01T00:00:00+07:00',   -- admission opens
   '2026-08-08T09:00:00+07:00',   -- first live session
   '2027-02-28T23:59:00+07:00',   -- course close (≈6-month access window)
   6, false, true)
RETURNING id INTO cohort_id;

-- ── 5. Lesson schedule (exact dates; instructor + time in notes) ─
INSERT INTO public.cohort_lesson_schedule (cohort_id, session_id, scheduled_date, notes)
VALUES
  -- Orientation (shared Lesson 0), opens before session 1
  (cohort_id, lesson0_id, DATE '2026-08-07', 'Orientasi — akses dibuka sebelum sesi pertama'),

  -- Essential
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X01'), DATE '2026-08-08', 'Sabtu, 8 Agu 2026 · 09.00 WIB · Ardan Aziz'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X02'), DATE '2026-08-08', 'Sabtu, 8 Agu 2026 · 13.00 WIB · Pulung Sambadha'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X03'), DATE '2026-08-09', 'Minggu, 9 Agu 2026 · 09.00 WIB · Syaukat'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X04'), DATE '2026-08-09', 'Minggu, 9 Agu 2026 · 13.00 WIB · M. Khairul Hamid'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X05'), DATE '2026-08-10', 'Senin, 10 Agu 2026 · 19.30 WIB · (HIRING)'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X06'), DATE '2026-08-11', 'Selasa, 11 Agu 2026 · 19.30 WIB · (HIRING)'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X07'), DATE '2026-08-12', 'Rabu, 12 Agu 2026 · 19.30 WIB · M. Khairul Hamid'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X08'), DATE '2026-08-13', 'Kamis, 13 Agu 2026 · 19.30 WIB · M. Khairul Hamid'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X09'), DATE '2026-08-15', 'Sabtu, 15 Agu 2026 · 09.00 WIB · M. Khairul Hamid'),

  -- Upscale / Extended
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X10'), DATE '2026-08-16', 'Minggu, 16 Agu 2026 · 09.00 WIB · M. Khairul Hamid · UPSCALE'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X11'), DATE '2026-08-18', 'Selasa, 18 Agu 2026 · 19.30 WIB · Syaukat · UPSCALE'),
  (cohort_id, (SELECT id FROM public.sessions WHERE session_number = 'X12'), DATE '2026-08-19', 'Rabu, 19 Agu 2026 · 19.30 WIB · Syaukat · UPSCALE');

END $$;
