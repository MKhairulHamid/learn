-- ============================================================
-- 019 — Fix cohorts RLS: allow enrolled users to read their cohort
--
-- Previously, the cohorts_read_published policy only allowed
-- reading cohorts where is_published = true. This caused enrolled
-- students to lose visibility of their cohort on the dashboard if
-- an admin ever unpublished a cohort (the join in cohort_enrollments
-- would return cohort: null, silently dropping the enrollment).
-- ============================================================

DROP POLICY IF EXISTS "cohorts_read_published" ON public.cohorts;

CREATE POLICY "cohorts_read" ON public.cohorts
  FOR SELECT USING (
    is_published = true
    OR public.is_admin()
    OR id IN (
      SELECT cohort_id
      FROM public.cohort_enrollments
      WHERE user_id = auth.uid()
    )
  );
