-- ============================================================
-- 051: Live checkpoints, round two — Kahoot-style pacing plus
--      response integrity.
--
--  Pacing (new columns on checkpoint_activations)
--    current_question_id   — the ONE question the cohort is answering now
--    question_started_at   — when it went live (drives the countdown)
--    time_limit_seconds    — 0 disables the timer (mentor-paced)
--    locked                — no more answers accepted for this question
--    revealed_question_ids — questions whose answer key is now public
--
--  Integrity (the holes 035 left open)
--    * 035 stamped is_correct on INSERT and let students read their own
--      row, so a student could flip options and read back correctness
--      until they hit the right one — an oracle around the hidden key.
--      Scoring now happens only at reveal/close, via SECURITY DEFINER
--      functions students cannot execute.
--    * A BEFORE INSERT trigger nulls any client-supplied is_correct, so
--      a student cannot self-report a correct answer.
--    * The UPDATE policy is gone: the first answer is final.
--    * The INSERT policy enforces the timer server-side (with a 2s grace
--      for latency), so a late POST cannot beat a closed question.
--
--  Mentor flow is now driven entirely by RPCs so that each step is
--  atomic and authorization lives in one place:
--    open_checkpoint → set_checkpoint_question → lock/reveal → close
-- ============================================================

-- ── Pacing columns ──────────────────────────────────────────
alter table public.checkpoint_activations
  add column if not exists current_question_id   uuid references public.checkpoint_questions(id) on delete set null,
  add column if not exists question_started_at   timestamptz,
  add column if not exists time_limit_seconds    int not null default 30,
  add column if not exists locked                boolean not null default false,
  add column if not exists revealed_question_ids uuid[] not null default '{}';

do $$ begin
  alter table public.checkpoint_activations
    add constraint time_limit_sane check (time_limit_seconds between 0 and 600);
exception when duplicate_object then null; end $$;

-- Anything already open predates the pacing columns and would accept no
-- answers (the insert policy below requires a current question), so point it
-- at its first question.
update public.checkpoint_activations a
   set current_question_id = (
         select id from public.checkpoint_questions
          where checkpoint_id = a.checkpoint_id
          order by order_num, id
          limit 1),
       question_started_at = coalesce(a.question_started_at, a.opened_at)
 where a.status = 'open' and a.current_question_id is null;

-- ── Scoring — reachable only from the definer functions below ─
-- Not granted to authenticated: a student who could call this would be
-- able to score their own in-flight answer and read the result back.
create or replace function public.score_activation(p_activation uuid, p_question uuid default null)
returns void language sql security definer set search_path = public as $$
  update public.checkpoint_responses r
     set is_correct = (k.correct_option_id = r.selected_option_id)
    from public.checkpoint_answer_keys k
   where k.question_id = r.question_id
     and r.activation_id = p_activation
     and (p_question is null or r.question_id = p_question);
$$;
revoke all on function public.score_activation(uuid, uuid) from public, anon, authenticated;

-- 035's insert-time scoring trigger is what made correctness observable
-- before the reveal. Replace it with one that strips the column instead.
drop trigger if exists trg_score_checkpoint_response on public.checkpoint_responses;
drop function if exists public.score_checkpoint_response();

create or replace function public.clear_checkpoint_response_score()
returns trigger language plpgsql set search_path = public as $$
begin
  new.is_correct := null;   -- only score_activation() may set this
  return new;
end $$;

drop trigger if exists trg_clear_checkpoint_response_score on public.checkpoint_responses;
create trigger trg_clear_checkpoint_response_score
  before insert on public.checkpoint_responses
  for each row execute function public.clear_checkpoint_response_score();

-- ── Response write rules ────────────────────────────────────
-- First answer is final.
drop policy if exists "responses_update_live" on public.checkpoint_responses;

-- Answers are accepted only for the question that is live right now, only
-- while it is unlocked, unrevealed, and inside its time limit.
drop policy if exists "responses_insert_live" on public.checkpoint_responses;
create policy "responses_insert_live" on public.checkpoint_responses
  for insert with check (
    user_id = auth.uid()
    and public.is_cohort_member(auth.uid(), cohort_id)
    and exists (
      select 1 from public.checkpoint_activations a
      where a.id = activation_id
        and a.cohort_id = checkpoint_responses.cohort_id
        and a.status = 'open'
        and a.locked = false
        and a.current_question_id = checkpoint_responses.question_id
        and not (checkpoint_responses.question_id = any (a.revealed_question_ids))
        and (
          a.time_limit_seconds = 0
          or a.question_started_at is null
          or now() < a.question_started_at
                     + make_interval(secs => a.time_limit_seconds + 2)
        )
    )
  );

-- ── Answer keys unlock per question, not per checkpoint ─────
drop policy if exists "answerkeys_read" on public.checkpoint_answer_keys;
create policy "answerkeys_read" on public.checkpoint_answer_keys
  for select using (
    public.is_editor() or exists (
      select 1
      from public.checkpoint_questions q
      join public.checkpoint_activations a on a.checkpoint_id = q.checkpoint_id
      where q.id = checkpoint_answer_keys.question_id
        and public.is_cohort_member(auth.uid(), a.cohort_id)
        and (a.revealed_at is not null or q.id = any (a.revealed_question_ids))
    )
  );

-- ── Mentor drive RPCs ───────────────────────────────────────

-- Opens a checkpoint for one cohort, closing (and scoring) whatever else
-- that cohort still had open on this session — 035 allowed two checkpoints
-- to be open at once, which left both clients guessing at "most recent".
create or replace function public.open_checkpoint(
  p_checkpoint uuid, p_cohort uuid, p_session uuid, p_time_limit int default 30
) returns public.checkpoint_activations
language plpgsql security definer set search_path = public as $$
declare
  v_row   public.checkpoint_activations;
  v_stale public.checkpoint_activations;
  v_first uuid;
begin
  if not public.is_editor() then
    raise exception 'Only mentors can open a checkpoint';
  end if;

  for v_stale in
    select * from public.checkpoint_activations
     where cohort_id = p_cohort and session_id = p_session and status = 'open'
  loop
    perform public.score_activation(v_stale.id);
    update public.checkpoint_activations
       set status = 'closed', closed_at = now(), locked = true
     where id = v_stale.id;
  end loop;

  select id into v_first
    from public.checkpoint_questions
   where checkpoint_id = p_checkpoint
   order by order_num, id
   limit 1;

  insert into public.checkpoint_activations
    (checkpoint_id, cohort_id, session_id, status, opened_by,
     current_question_id, question_started_at, time_limit_seconds, locked)
  values
    (p_checkpoint, p_cohort, p_session, 'open', auth.uid(),
     v_first, now(), greatest(coalesce(p_time_limit, 30), 0), false)
  returning * into v_row;

  return v_row;
end $$;

-- Move to a question and (re)start its clock.
create or replace function public.set_checkpoint_question(p_activation uuid, p_question uuid)
returns public.checkpoint_activations
language plpgsql security definer set search_path = public as $$
declare v_row public.checkpoint_activations;
begin
  if not public.is_editor() then
    raise exception 'Only mentors can drive a checkpoint';
  end if;
  update public.checkpoint_activations
     set current_question_id = p_question,
         question_started_at = now(),
         locked = false
   where id = p_activation and status = 'open'
  returning * into v_row;
  if v_row.id is null then raise exception 'Checkpoint is not open'; end if;
  return v_row;
end $$;

-- Stop accepting answers without revealing the key yet.
create or replace function public.lock_checkpoint_question(p_activation uuid)
returns public.checkpoint_activations
language plpgsql security definer set search_path = public as $$
declare v_row public.checkpoint_activations;
begin
  if not public.is_editor() then
    raise exception 'Only mentors can lock a checkpoint';
  end if;
  update public.checkpoint_activations
     set locked = true
   where id = p_activation and status = 'open'
  returning * into v_row;
  if v_row.id is null then raise exception 'Checkpoint is not open'; end if;
  return v_row;
end $$;

-- Score + publish the key for one question. Sets revealed_at once every
-- question in the checkpoint has been revealed (kept for 035-era readers).
create or replace function public.reveal_checkpoint_question(
  p_activation uuid, p_question uuid default null
) returns public.checkpoint_activations
language plpgsql security definer set search_path = public as $$
declare
  v_row   public.checkpoint_activations;
  v_q     uuid;
  v_total int;
begin
  if not public.is_editor() then
    raise exception 'Only mentors can reveal a checkpoint';
  end if;

  select * into v_row from public.checkpoint_activations where id = p_activation;
  if v_row.id is null then raise exception 'Unknown activation'; end if;

  v_q := coalesce(p_question, v_row.current_question_id);
  if v_q is null then raise exception 'No question to reveal'; end if;

  perform public.score_activation(p_activation, v_q);

  update public.checkpoint_activations
     set locked = true,
         revealed_question_ids = case
           when v_q = any (revealed_question_ids) then revealed_question_ids
           else revealed_question_ids || v_q
         end
   where id = p_activation
  returning * into v_row;

  select count(*) into v_total
    from public.checkpoint_questions
   where checkpoint_id = v_row.checkpoint_id;

  if v_row.revealed_at is null
     and coalesce(array_length(v_row.revealed_question_ids, 1), 0) >= v_total then
    update public.checkpoint_activations
       set revealed_at = now()
     where id = p_activation
    returning * into v_row;
  end if;

  return v_row;
end $$;

-- Close the checkpoint and score everything, including questions the
-- mentor skipped past without revealing (so the summary stays honest).
create or replace function public.close_checkpoint(p_activation uuid)
returns public.checkpoint_activations
language plpgsql security definer set search_path = public as $$
declare v_row public.checkpoint_activations;
begin
  if not public.is_editor() then
    raise exception 'Only mentors can close a checkpoint';
  end if;
  perform public.score_activation(p_activation);
  update public.checkpoint_activations
     set status = 'closed', closed_at = now(), locked = true
   where id = p_activation
  returning * into v_row;
  if v_row.id is null then raise exception 'Unknown activation'; end if;
  return v_row;
end $$;

-- ── Roster for the mentor's per-student grid ────────────────
-- Mentors (unlike admins and program managers) cannot read learner
-- profiles under the existing policies. Rather than widen that, hand
-- back just the names of the cohort being reviewed.
create or replace function public.checkpoint_cohort_roster(p_cohort uuid)
returns table (user_id uuid, display_name text)
language sql security definer stable set search_path = public as $$
  select e.user_id,
         coalesce(nullif(p.full_name, ''), nullif(p.username, ''), 'Learner')
    from public.cohort_enrollments e
    left join public.profiles p on p.id = e.user_id
   where e.cohort_id = p_cohort
     and e.status = 'active'
     and public.is_editor();
$$;

grant execute on function public.open_checkpoint(uuid, uuid, uuid, int)          to authenticated;
grant execute on function public.set_checkpoint_question(uuid, uuid)             to authenticated;
grant execute on function public.lock_checkpoint_question(uuid)                  to authenticated;
grant execute on function public.reveal_checkpoint_question(uuid, uuid)          to authenticated;
grant execute on function public.close_checkpoint(uuid)                          to authenticated;
grant execute on function public.checkpoint_cohort_roster(uuid)                  to authenticated;

-- Functions are created with EXECUTE granted to PUBLIC, which includes anon.
-- Each one gates on is_editor() internally, but there is no reason for the
-- signed-out role to reach them at all.
revoke all on function public.open_checkpoint(uuid, uuid, uuid, int)    from public, anon;
revoke all on function public.set_checkpoint_question(uuid, uuid)       from public, anon;
revoke all on function public.lock_checkpoint_question(uuid)            from public, anon;
revoke all on function public.reveal_checkpoint_question(uuid, uuid)    from public, anon;
revoke all on function public.close_checkpoint(uuid)                    from public, anon;
revoke all on function public.checkpoint_cohort_roster(uuid)            from public, anon;

grant execute on function public.open_checkpoint(uuid, uuid, uuid, int) to authenticated;
grant execute on function public.set_checkpoint_question(uuid, uuid)    to authenticated;
grant execute on function public.lock_checkpoint_question(uuid)         to authenticated;
grant execute on function public.reveal_checkpoint_question(uuid, uuid) to authenticated;
grant execute on function public.close_checkpoint(uuid)                 to authenticated;
grant execute on function public.checkpoint_cohort_roster(uuid)         to authenticated;
