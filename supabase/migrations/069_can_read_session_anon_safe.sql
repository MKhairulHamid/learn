-- ============================================================
-- 069 — can_read_session() should answer "no", not raise
--
-- 067 revoked EXECUTE from anon, but the SELECT policies on sessions
-- and exercises are still evaluated for anonymous callers, and
-- evaluating them calls the function. The result was a hard
-- 401 "permission denied for function can_read_session" instead of
-- an empty result set.
--
-- No public page queries these tables today (the landing, demo, pitch
-- and presentation pages never touch Supabase), so nothing was
-- broken — but an error where "no rows" belongs is a footgun for the
-- first page that does.
--
-- Granting anon EXECUTE alone would open the orientation lesson to
-- logged-out visitors, since the phase_id IS NULL branch does not
-- look at the caller. So the function now returns false outright when
-- there is no session.
-- ============================================================

CREATE OR REPLACE FUNCTION public.can_read_session(sess_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND (
      public.is_editor()
      -- Shared orientation lesson: no phase, no program, open to every
      -- signed-in user.
      OR EXISTS (
        SELECT 1 FROM public.sessions s
        WHERE s.id = sess_id AND s.phase_id IS NULL
      )
      OR EXISTS (
        SELECT 1
        FROM public.sessions s
        JOIN public.phases ph            ON ph.id = s.phase_id
        JOIN public.cohorts c            ON c.program_id = ph.program_id
        JOIN public.cohort_enrollments e ON e.cohort_id = c.id
        WHERE s.id = sess_id
          AND e.user_id = auth.uid()
          AND e.status = 'active'
      )
    );
$$;

GRANT EXECUTE ON FUNCTION public.can_read_session(uuid) TO anon, authenticated;
