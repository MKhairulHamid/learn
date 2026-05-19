-- ============================================================
-- 015 — Cohort System (Batch 1: database foundation)
--   * cohorts, cohort_lesson_schedule, cohort_enrollments,
--     cohort_session_progress tables
--   * cohort_id added to discussion_posts + exercise_submissions
--   * sessions.phase_id made nullable; Lesson 0 (orientation) seeded
--   * helper functions + RLS policies
-- Order: tables -> alters -> functions -> RLS
--   (SQL function bodies are validated at creation time, so any
--    table a function references must already exist.)
-- ============================================================

-- ── Lesson 0: make phase optional, seed orientation session ───────
alter table public.sessions alter column phase_id drop not null;

insert into public.sessions (
  id, phase_id, session_number, title_id, title_en,
  content_id, content_en, unit_skkni,
  learning_output_id, learning_output_en, order_num, estimated_duration_minutes
) values (
  '00000000-0000-4000-8000-000000000000',
  null, '00',
  'Perkenalan & Orientasi Kelas',
  'Class Introduction & Orientation',
  $id$## Selamat Datang di Program 👋

Kamu akan memulai perjalanan belajar untuk menjadi Data Analyst yang siap kerja. Sebelum masuk ke materi pertama, mari kita orientasi dulu — sesi singkat ini menjelaskan cara kerja program dan membantu kamu berkenalan dengan teman satu cohort.

## Cara Kerja Program Ini

Ini adalah **program berbasis cohort** — kamu belajar bersama satu kelompok yang mulai dan selesai bersama-sama.

- **Sesi live** diadakan pada tanggal yang sudah dijadwalkan. Setiap pelajaran di platform ini berpasangan dengan satu sesi live.
- **Pelajaran terbuka berdasarkan tanggal.** Sebuah pelajaran tersedia pada hari jadwalnya — kamu tidak bisa melompat ke depan, dan tidak akan tertinggal.
- **Akses materi** berlaku selama periode tertentu setelah kelas dimulai, jadi kamu bisa mengulang kapan saja.

## Menggunakan Platform

Setiap halaman pelajaran berisi:

- **Materi pelajaran** — baca sebelum atau sesudah sesi live
- **Latihan interaktif** — praktik SQL, Python, dan lainnya langsung di browser
- **Diskusi** — bertanya dan saling membantu; setiap cohort punya ruang sendiri

Tandai pelajaran **selesai** ketika kamu sudah menyelesaikannya. Progres kamu dicatat per cohort.

## Tugas Pertamamu — Perkenalkan Diri

Scroll ke bawah ke bagian **Diskusi** di pelajaran ini dan posting perkenalan singkat:

1. Nama kamu dan domisili
2. Latar belakang — pekerjaan sekarang, kuliah, atau tujuan karir
3. Apa yang ingin kamu dapatkan dari program ini
4. Satu fakta seru tentang kamu

Luangkan waktu untuk membalas minimal dua perkenalan lain. Teman satu cohort adalah jaringanmu — mulai bangun hari ini.

## Yang Kami Harapkan

- **Hadir.** Ikuti sesi live dan jaga ritme sesuai jadwal.
- **Praktik.** Analisis adalah keterampilan — tumbuh dengan mengerjakan latihan, bukan hanya menonton.
- **Saling menghargai.** Bertanyalah dengan bebas dan bantu yang lain. Tidak ada pertanyaan yang terlalu mendasar.

Sampai jumpa di Pelajaran 1. Mari kita mulai! 🚀
$id$,
  $en$## Welcome to the Program 👋

You're about to start a hands-on journey to become a job-ready Data Analyst. Before the first lesson, let's get oriented — this short session explains how everything works and helps you meet your cohort.

## How This Program Works

This is a **cohort-based program** — you learn alongside a group of peers who start and finish together.

- **Live sessions** are held on scheduled dates. Each lesson on this platform pairs with a live session.
- **Lessons unlock by date.** A lesson becomes available on its scheduled day — you can't skip ahead, and you won't fall behind.
- **Your access** to the material lasts for a set period after the course starts, so you can review anytime.

## Using the Platform

Each lesson page contains:

- **Lesson content** — read before or after the live session
- **Interactive exercises** — practice SQL, Python, and more directly in your browser
- **Discussion** — ask questions and help your peers; each cohort has its own space

Mark a lesson **complete** when you've finished it. Your progress is tracked per cohort.

## Your First Task — Introduce Yourself

Scroll down to the **Discussion** section of this lesson and post a short introduction:

1. Your name and where you're based
2. Your background — current job, study, or career goal
3. What you want to get out of this program
4. One fun fact about you

Take a moment to reply to at least two other introductions. The people in your cohort are your network — start building it today.

## What We Expect

- **Show up.** Attend the live sessions and keep pace with the schedule.
- **Practice.** Analysis is a skill — it grows by doing the exercises, not just watching.
- **Be kind.** Ask questions freely and help others. No question is too basic.

See you in Lesson 1. Let's get started! 🚀
$en$,
  '',
  'Memahami cara kerja program dan terhubung dengan teman satu cohort.',
  'Understand how the program works and connect with your cohort.',
  0, 30
)
on conflict (session_number) do nothing;

-- ── cohorts ───────────────────────────────────────────────────────
create table if not exists public.cohorts (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  description            text not null default '',
  admission_open_at      timestamptz not null,
  course_start_at        timestamptz not null,
  course_close_at        timestamptz not null,
  access_duration_months int  not null default 6,
  max_seats              int,
  admission_open         boolean not null default false,
  is_published           boolean not null default false,
  created_by             uuid references auth.users(id) on delete set null,
  created_at             timestamptz not null default now(),
  check (admission_open_at <= course_start_at),
  check (course_start_at  <  course_close_at)
);

-- Only ONE cohort may have admission open at any time
create unique index if not exists one_open_admission
  on public.cohorts ((admission_open)) where admission_open = true;

-- ── cohort_lesson_schedule ────────────────────────────────────────
create table if not exists public.cohort_lesson_schedule (
  id              uuid primary key default gen_random_uuid(),
  cohort_id       uuid not null references public.cohorts(id) on delete cascade,
  session_id      uuid not null references public.sessions(id) on delete cascade,
  scheduled_date  date not null,
  zoom_link       text,
  recording_url   text,
  unlock_override boolean,            -- null = auto (by date); true = force open; false = force locked
  notes           text,
  created_at      timestamptz not null default now(),
  unique (cohort_id, session_id)
);
create index if not exists idx_schedule_cohort on public.cohort_lesson_schedule(cohort_id);

-- ── cohort_enrollments ────────────────────────────────────────────
create table if not exists public.cohort_enrollments (
  id                uuid primary key default gen_random_uuid(),
  cohort_id         uuid not null references public.cohorts(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  status            text not null default 'pending'
                       check (status in ('pending','active','rejected','removed')),
  applied_at        timestamptz not null default now(),
  approved_at       timestamptz,
  approved_by       uuid references auth.users(id) on delete set null,
  access_expires_at timestamptz,
  notes             text,
  unique (cohort_id, user_id)
);
create index if not exists idx_enroll_user   on public.cohort_enrollments(user_id, status);
create index if not exists idx_enroll_cohort on public.cohort_enrollments(cohort_id, status);

-- ── cohort_session_progress (per-cohort completion) ───────────────
create table if not exists public.cohort_session_progress (
  id           uuid primary key default gen_random_uuid(),
  cohort_id    uuid not null references public.cohorts(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  session_id   uuid not null references public.sessions(id) on delete cascade,
  completed    boolean not null default false,
  completed_at timestamptz,
  score        int default 0,
  unique (cohort_id, user_id, session_id)
);
create index if not exists idx_csp_lookup on public.cohort_session_progress(cohort_id, user_id);

-- ── Scope discussion + exercise submissions by cohort ─────────────
alter table public.discussion_posts
  add column if not exists cohort_id uuid references public.cohorts(id) on delete cascade;
create index if not exists idx_discussion_cohort on public.discussion_posts(cohort_id);

alter table public.exercise_submissions
  add column if not exists cohort_id uuid references public.cohorts(id) on delete cascade;
create index if not exists idx_submissions_cohort on public.exercise_submissions(cohort_id);

-- ── Helper functions (created after tables they reference) ────────
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- True when the user has an APPROVED (active) enrollment in the cohort
create or replace function public.is_cohort_member(uid uuid, cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.cohort_enrollments
    where user_id = uid and cohort_id = cid and status = 'active'
  );
$$;

-- ── Row Level Security ────────────────────────────────────────────
alter table public.cohorts                 enable row level security;
alter table public.cohort_lesson_schedule  enable row level security;
alter table public.cohort_enrollments      enable row level security;
alter table public.cohort_session_progress enable row level security;

-- cohorts: published cohorts readable by anyone authenticated; admins full control
create policy "cohorts_read_published" on public.cohorts
  for select using (is_published = true or public.is_admin());
create policy "cohorts_admin_all" on public.cohorts
  for all using (public.is_admin()) with check (public.is_admin());

-- schedule: cohort members + admins read; admins manage
create policy "schedule_read" on public.cohort_lesson_schedule
  for select using (public.is_cohort_member(auth.uid(), cohort_id) or public.is_admin());
create policy "schedule_admin_all" on public.cohort_lesson_schedule
  for all using (public.is_admin()) with check (public.is_admin());

-- enrollments: users see/apply for their own; admins manage all
create policy "enrollments_read_own" on public.cohort_enrollments
  for select using (user_id = auth.uid() or public.is_admin());
create policy "enrollments_self_apply" on public.cohort_enrollments
  for insert with check (
    public.is_admin()
    or (
      user_id = auth.uid()
      and status = 'pending'
      and exists (select 1 from public.cohorts c where c.id = cohort_id and c.admission_open = true)
    )
  );
create policy "enrollments_admin_update" on public.cohort_enrollments
  for update using (public.is_admin()) with check (public.is_admin());
create policy "enrollments_admin_delete" on public.cohort_enrollments
  for delete using (public.is_admin());

-- session progress: users manage their own (must be a cohort member); admins read all
create policy "progress_read" on public.cohort_session_progress
  for select using (user_id = auth.uid() or public.is_admin());
create policy "progress_insert_own" on public.cohort_session_progress
  for insert with check (
    user_id = auth.uid() and public.is_cohort_member(auth.uid(), cohort_id)
  );
create policy "progress_update_own" on public.cohort_session_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
