-- ============================================================
-- 066 — Program-manager authorization: one source of truth
--
-- `is_program_manager_for()` only ever looked at
-- program_manager_assignments, never at profiles.role. The two can
-- disagree, and when they do the assignment silently wins:
--
--   * Demoting someone in the admin panel rewrites profiles.role but
--     leaves their assignment row, so they keep PM powers.
--   * The navbar gates on role, so the UI hides every PM feature
--     while the API still answers — privilege with nothing on screen
--     to reveal it.
--
-- Observed in production: an account with role = 'student' held an
-- assignment from April 2026 and could read 9 enrollment rows
-- belonging to 5 other people. Because pm_manage_enrollments is
-- FOR ALL, that also carried insert/update/delete on those rows, and
-- pm_manage_preapproved exposes the paid pre-approval email list.
--
-- The fix is to require BOTH: the role says program manager (or
-- admin) AND an assignment exists for that specific program.
--
-- Checked against live data before applying: the real admin and the
-- real program manager keep every assignment they have; only the
-- stale student row goes inert. No data is deleted here — the row is
-- simply no longer sufficient on its own.
-- ============================================================


CREATE OR REPLACE FUNCTION public.is_program_manager_for(pid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public          -- was mutable; flagged by the linter
AS $$
  SELECT public.is_admin()
     OR (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role IN ('admin', 'program_manager')
          )
          AND EXISTS (
            SELECT 1 FROM public.program_manager_assignments
            WHERE user_id = auth.uid() AND program_id = pid
          )
        );
$$;


-- Demotion should actually demote. profiles.role can now only be
-- written through this function (065 revoked the column), so this is
-- the one chokepoint where the two tables can be kept in agreement.
CREATE OR REPLACE FUNCTION public.admin_set_user_role(p_user_id uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can change user roles';
  END IF;

  IF p_role NOT IN ('student', 'admin', 'mentor', 'program_manager') THEN
    RAISE EXCEPTION 'Unknown role: %', p_role;
  END IF;

  UPDATE public.profiles SET role = p_role WHERE id = p_user_id;

  -- Leaving no orphaned grants behind.
  IF p_role NOT IN ('admin', 'program_manager') THEN
    DELETE FROM public.program_manager_assignments WHERE user_id = p_user_id;
  END IF;
END;
$$;


-- Last of the mutable search_path warnings. Altered rather than
-- rewritten so the trigger body is left exactly as it is.
ALTER FUNCTION public.set_updated_at() SET search_path = public;


-- ============================================================
-- Rollback:
--   CREATE OR REPLACE FUNCTION public.is_program_manager_for(pid uuid)
--   RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
--     SELECT is_admin() OR EXISTS (
--       SELECT 1 FROM public.program_manager_assignments
--       WHERE user_id = auth.uid() AND program_id = pid);
--   $$;
-- ============================================================
