-- ============================================================
-- 029 — Auto-approve signups
-- Lets an admin/PM flip a cohort so new self-service signups land
-- as 'active' immediately instead of 'pending'.
-- ============================================================

alter table public.cohorts
  add column if not exists auto_approve_signups boolean not null default false;

-- Self-apply insert may now also land as 'active' when the target
-- cohort has auto-approve turned on (still gated on admission_open).
drop policy if exists "enrollments_self_apply" on public.cohort_enrollments;
create policy "enrollments_self_apply" on public.cohort_enrollments
  for insert with check (
    public.is_admin()
    or (
      user_id = auth.uid()
      and exists (
        select 1 from public.cohorts c
        where c.id = cohort_id
          and c.admission_open = true
          and (
            status = 'pending'
            or (status = 'active' and c.auto_approve_signups = true)
          )
      )
    )
  );
