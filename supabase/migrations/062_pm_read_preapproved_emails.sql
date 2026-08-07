-- 062_pm_read_preapproved_emails.sql
--
-- The pre-approval list was admin-only. Let program managers see and manage the
-- pre-approval rows for cohorts in their assigned programs, so the Students tab
-- of the program-manager page can surface who is pre-approved (and on which tier)
-- before they sign up. Mirrors pm_manage_enrollments on cohort_enrollments.

create policy pm_manage_preapproved on public.cohort_preapproved_emails
  for all
  using (
    exists (
      select 1 from public.cohorts c
      where c.id = cohort_preapproved_emails.cohort_id
        and public.is_program_manager_for(c.program_id)
    )
  )
  with check (
    exists (
      select 1 from public.cohorts c
      where c.id = cohort_preapproved_emails.cohort_id
        and public.is_program_manager_for(c.program_id)
    )
  );
