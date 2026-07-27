-- ============================================================
-- 035: Live checkpoints — mentor-driven, MCQ-only comprehension
--      checks run during a live session over Supabase Realtime.
--
--  Model
--    session_checkpoints    — a checkpoint = a group of 1–3 MCQs on a session
--    checkpoint_questions   — the MCQs (prompt + options); NO correct answer here
--    checkpoint_answer_keys — the correct option, kept OUT of student reach
--    checkpoint_activations — a mentor "opens" a checkpoint for one cohort's
--                             live session; status open|closed + revealed_at.
--                             This is the realtime signal students subscribe to.
--    checkpoint_responses   — one row per (activation, question, student)
--
--  Rules baked in
--    * A response can be written ONLY while its activation is open (RLS write
--      guard). Answering with no open activation is front-end self-check only —
--      it never reaches the DB.
--    * Students never read the answer key before reveal, so options can be shown
--      up front without leaking the answer. `is_correct` is set by a
--      SECURITY DEFINER trigger, so a student learns only whether THEY were right.
--    * Mentors/editors read the full response aggregate; students read only their
--      own responses.
--    * checkpoint_activations + checkpoint_responses are in the realtime
--      publication with REPLICA IDENTITY FULL.
-- ============================================================

-- ── Tables ──────────────────────────────────────────────────
create table if not exists public.session_checkpoints (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  order_num   int  not null default 1,
  title_id    text not null default '',
  title_en    text not null default '',
  created_at  timestamptz not null default now()
);
create index if not exists idx_checkpoints_session on public.session_checkpoints(session_id);

create table if not exists public.checkpoint_questions (
  id            uuid primary key default gen_random_uuid(),
  checkpoint_id uuid not null references public.session_checkpoints(id) on delete cascade,
  order_num     int  not null default 1 check (order_num between 1 and 3),
  prompt_id     text not null default '',
  prompt_en     text not null default '',
  -- options: jsonb array of { "id": "a", "label_id": "...", "label_en": "..." }
  options       jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists idx_questions_checkpoint on public.checkpoint_questions(checkpoint_id);

-- Correct answers live in their own table so students can read the questions
-- (to answer) without ever being able to read the key.
create table if not exists public.checkpoint_answer_keys (
  question_id       uuid primary key references public.checkpoint_questions(id) on delete cascade,
  correct_option_id text not null
);

create table if not exists public.checkpoint_activations (
  id            uuid primary key default gen_random_uuid(),
  checkpoint_id uuid not null references public.session_checkpoints(id) on delete cascade,
  cohort_id     uuid not null references public.cohorts(id) on delete cascade,
  session_id    uuid not null references public.sessions(id) on delete cascade,
  status        text not null default 'open' check (status in ('open','closed')),
  opened_by     uuid references auth.users(id) on delete set null,
  opened_at     timestamptz not null default now(),
  revealed_at   timestamptz,
  closed_at     timestamptz
);
create index if not exists idx_activations_cohort_session
  on public.checkpoint_activations(cohort_id, session_id, status);
-- At most one OPEN activation per checkpoint per cohort (guards double-clicks).
create unique index if not exists one_open_activation
  on public.checkpoint_activations(checkpoint_id, cohort_id) where status = 'open';

create table if not exists public.checkpoint_responses (
  id                 uuid primary key default gen_random_uuid(),
  activation_id      uuid not null references public.checkpoint_activations(id) on delete cascade,
  question_id        uuid not null references public.checkpoint_questions(id) on delete cascade,
  cohort_id          uuid not null references public.cohorts(id) on delete cascade,
  user_id            uuid not null references auth.users(id) on delete cascade,
  selected_option_id text not null,
  is_correct         boolean,
  responded_at       timestamptz not null default now(),
  unique (activation_id, question_id, user_id)
);
create index if not exists idx_responses_activation on public.checkpoint_responses(activation_id);

-- ── Scoring trigger (SECURITY DEFINER: reads the hidden answer key) ─
create or replace function public.score_checkpoint_response()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select (k.correct_option_id = new.selected_option_id)
    into new.is_correct
  from public.checkpoint_answer_keys k
  where k.question_id = new.question_id;
  return new;  -- is_correct stays NULL if no key exists yet
end $$;

drop trigger if exists trg_score_checkpoint_response on public.checkpoint_responses;
create trigger trg_score_checkpoint_response
  before insert or update on public.checkpoint_responses
  for each row execute function public.score_checkpoint_response();

-- ── Helper: may the caller see a session's checkpoints? ─────
-- Editors always; students if they hold an active enrollment in a cohort of
-- the session's program.
create or replace function public.can_see_session_checkpoints(sess_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_editor() or exists (
    select 1
    from public.sessions s
    join public.phases  ph on ph.id = s.phase_id
    join public.cohorts  c on c.program_id = ph.program_id
    join public.cohort_enrollments e on e.cohort_id = c.id
    where s.id = sess_id and e.user_id = auth.uid() and e.status = 'active'
  );
$$;

-- ── Row Level Security ──────────────────────────────────────
alter table public.session_checkpoints    enable row level security;
alter table public.checkpoint_questions   enable row level security;
alter table public.checkpoint_answer_keys enable row level security;
alter table public.checkpoint_activations enable row level security;
alter table public.checkpoint_responses   enable row level security;

-- session_checkpoints: readable by members of the session's program; editors write
create policy "checkpoints_read" on public.session_checkpoints
  for select using (public.can_see_session_checkpoints(session_id));
create policy "checkpoints_editor_write" on public.session_checkpoints
  for all using (public.is_editor()) with check (public.is_editor());

-- checkpoint_questions: readable when the parent checkpoint is; editors write
create policy "questions_read" on public.checkpoint_questions
  for select using (exists (
    select 1 from public.session_checkpoints cp
    where cp.id = checkpoint_id and public.can_see_session_checkpoints(cp.session_id)
  ));
create policy "questions_editor_write" on public.checkpoint_questions
  for all using (public.is_editor()) with check (public.is_editor());

-- answer keys: editors always; students ONLY after a reveal in their cohort
create policy "answerkeys_read" on public.checkpoint_answer_keys
  for select using (
    public.is_editor() or exists (
      select 1
      from public.checkpoint_questions q
      join public.checkpoint_activations a on a.checkpoint_id = q.checkpoint_id
      where q.id = question_id
        and a.revealed_at is not null
        and public.is_cohort_member(auth.uid(), a.cohort_id)
    )
  );
create policy "answerkeys_editor_write" on public.checkpoint_answer_keys
  for all using (public.is_editor()) with check (public.is_editor());

-- activations: cohort members + editors read; editors open/close/reveal
create policy "activations_read" on public.checkpoint_activations
  for select using (public.is_cohort_member(auth.uid(), cohort_id) or public.is_editor());
create policy "activations_editor_insert" on public.checkpoint_activations
  for insert with check (public.is_editor());
create policy "activations_editor_update" on public.checkpoint_activations
  for update using (public.is_editor()) with check (public.is_editor());
create policy "activations_editor_delete" on public.checkpoint_activations
  for delete using (public.is_editor());

-- responses: students see only their own; editors see all
create policy "responses_read" on public.checkpoint_responses
  for select using (user_id = auth.uid() or public.is_editor());
-- write allowed ONLY while the referenced activation is open and belongs to the
-- student's cohort — this is what confines recording to the live window.
create policy "responses_insert_live" on public.checkpoint_responses
  for insert with check (
    user_id = auth.uid()
    and public.is_cohort_member(auth.uid(), cohort_id)
    and exists (
      select 1 from public.checkpoint_activations a
      where a.id = activation_id and a.cohort_id = checkpoint_responses.cohort_id
        and a.status = 'open'
    )
  );
create policy "responses_update_live" on public.checkpoint_responses
  for update using (user_id = auth.uid()) with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.checkpoint_activations a
      where a.id = activation_id and a.status = 'open'
    )
  );
create policy "responses_editor_delete" on public.checkpoint_responses
  for delete using (public.is_editor());

-- ── Realtime ────────────────────────────────────────────────
alter table public.checkpoint_activations replica identity full;
alter table public.checkpoint_responses   replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.checkpoint_activations;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.checkpoint_responses;
exception when duplicate_object then null; end $$;
