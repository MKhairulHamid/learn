-- 061_preapproved_emails_enrollment_tier.sql
--
-- The pre-approval list (cohort_preapproved_emails) previously had no tier, so the
-- auto-enroll trigger created every enrollment as the default 'essential' tier.
-- Give the list its own tier and have the trigger honor it, so Extended students
-- land on the Extended tier automatically when they sign up.

alter table public.cohort_preapproved_emails
  add column if not exists enrollment_tier text not null default 'essential'
    check (enrollment_tier in ('essential', 'extended'));

create or replace function public.enroll_preapproved_user()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  rec record;
begin
  for rec in
    select p.cohort_id, p.enrollment_tier, c.course_start_at, c.access_duration_months
    from public.cohort_preapproved_emails p
    join public.cohorts c on c.id = p.cohort_id
    where p.email = lower(new.email)
  loop
    begin
      insert into public.cohort_enrollments
        (cohort_id, user_id, status, approved_at, access_expires_at, notes, enrollment_tier)
      values
        (rec.cohort_id, new.id, 'active', now(),
         rec.course_start_at + make_interval(months => rec.access_duration_months),
         'Auto-enrolled from paid pre-approval list', rec.enrollment_tier)
      on conflict (cohort_id, user_id) do update
        set status            = 'active',
            approved_at       = coalesce(public.cohort_enrollments.approved_at, now()),
            access_expires_at = excluded.access_expires_at,
            enrollment_tier   = excluded.enrollment_tier;
    exception when others then
      -- Never let an enrollment error break the auth signup.
      raise warning 'enroll_preapproved_user failed for %: %', new.email, sqlerrm;
    end;
  end loop;
  return new;
end;
$function$;
