-- ============================================================
-- 020 — Session Feedback
--   * feedback_open flag on cohort_lesson_schedule
--   * session_feedback table with per-dimension ratings + text
--   * RLS: students submit once; admins read all
-- ============================================================

-- ── feedback_open toggle on the schedule ──────────────────────
alter table public.cohort_lesson_schedule
  add column if not exists feedback_open boolean not null default false;

-- ── session_feedback ──────────────────────────────────────────
create table if not exists public.session_feedback (
  id                      uuid primary key default gen_random_uuid(),
  cohort_id               uuid not null references public.cohorts(id) on delete cascade,
  session_id              uuid not null references public.sessions(id) on delete cascade,
  user_id                 uuid not null references auth.users(id) on delete cascade,

  -- Section 1: Materials
  rating_materials        int not null check (rating_materials between 1 and 5),
  rating_exercises        int not null check (rating_exercises between 1 and 5),

  -- Section 2: Mentor
  rating_mentor_clarity   int not null check (rating_mentor_clarity between 1 and 5),
  rating_mentor_management int not null check (rating_mentor_management between 1 and 5),
  rating_mentor_engagement int not null check (rating_mentor_engagement between 1 and 5),

  -- Section 3: Overall
  rating_overall          int not null check (rating_overall between 1 and 5),

  -- Open-ended
  comment_highlight       text not null default '',   -- what was most valuable
  comment_improve         text not null default '',   -- what could be improved
  comment_other           text not null default '',   -- any other comments

  submitted_at            timestamptz not null default now(),
  unique (cohort_id, session_id, user_id)
);

create index if not exists idx_feedback_cohort_session
  on public.session_feedback(cohort_id, session_id);
create index if not exists idx_feedback_user
  on public.session_feedback(user_id);

-- ── Row Level Security ────────────────────────────────────────
alter table public.session_feedback enable row level security;

-- Students: insert their own feedback only when the feedback window is open
create policy "feedback_insert_own" on public.session_feedback
  for insert with check (
    user_id = auth.uid()
    and public.is_cohort_member(auth.uid(), cohort_id)
    and exists (
      select 1 from public.cohort_lesson_schedule
      where cohort_id = session_feedback.cohort_id
        and session_id = session_feedback.session_id
        and feedback_open = true
    )
  );

-- Students: read their own submission
create policy "feedback_select_own" on public.session_feedback
  for select using (user_id = auth.uid() or public.is_admin());

-- Admins: full control
create policy "feedback_admin_all" on public.session_feedback
  for all using (public.is_admin()) with check (public.is_admin());
