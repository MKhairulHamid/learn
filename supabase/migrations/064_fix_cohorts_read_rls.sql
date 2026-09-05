-- ============================================================
-- 064 — Fix cohorts SELECT RLS (re-applies 019, which never
-- reached production, and extends it to program managers)
--
-- Live policy was still "cohorts_read_published": is_published = true
-- OR is_admin(). Every learner enrolled in an unpublished cohort got
-- cohort: null from the cohort_enrollments join, which crashed the
-- CohortProvider (TypeError reading 'course_start_at') and blanked
-- the whole app — including /reset-password.
--
-- Program managers could update/delete cohorts in their programs but
-- not SELECT unpublished ones, so their dashboard hid the same rows.
-- ============================================================

-- Security definer so the policy does not re-enter cohort_enrollments RLS.
-- Any enrollment row counts (pending included), not just active ones.
create or replace function public.has_cohort_enrollment(cid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.cohort_enrollments
    where cohort_id = cid and user_id = auth.uid()
  );
$$;

drop policy if exists "cohorts_read_published" on public.cohorts;
drop policy if exists "cohorts_read" on public.cohorts;

create policy "cohorts_read" on public.cohorts
  for select using (
    is_published = true
    or public.is_admin()
    or public.is_program_manager_for(program_id)
    or public.has_cohort_enrollment(id)
  );
