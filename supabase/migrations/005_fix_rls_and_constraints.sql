-- ============================================================
-- 005 — Fix recursive RLS policies + constraint issues
-- ============================================================

-- ── 1. Drop all broken recursive admin policies ───────────────

DROP POLICY IF EXISTS "Admins can view all profiles"      ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all progress"      ON public.user_progress;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.user_activity_logs;

-- Also drop the duplicate policies added by migration 004
-- (they used is_admin() correctly but clashed with existing ones)
DROP POLICY IF EXISTS "admin_read_profiles"    ON public.profiles;
DROP POLICY IF EXISTS "admin_read_progress"    ON public.user_progress;
DROP POLICY IF EXISTS "admin_read_activity"    ON public.user_activity_logs;
DROP POLICY IF EXISTS "admin_read_submissions" ON public.exercise_submissions;
DROP POLICY IF EXISTS "admin_write_exercises"  ON public.exercises;

-- ── 2. Re-create is_admin() with SECURITY DEFINER ────────────
-- Runs as postgres → bypasses RLS → no recursion

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── 3. Correct admin policies using is_admin() ────────────────

CREATE POLICY "admin_read_profiles" ON public.profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "admin_read_progress" ON public.user_progress
  FOR SELECT USING (is_admin());

CREATE POLICY "admin_read_activity" ON public.user_activity_logs
  FOR SELECT USING (is_admin());

CREATE POLICY "admin_read_submissions" ON public.exercise_submissions
  FOR SELECT USING (is_admin());

CREATE POLICY "admin_write_exercises" ON public.exercises
  FOR ALL USING (is_admin());

-- ── 4. Fix activity_log check constraint ─────────────────────
-- exercise_complete was missing from the allowed action types

ALTER TABLE public.user_activity_logs
  DROP CONSTRAINT IF EXISTS user_activity_logs_action_type_check;

ALTER TABLE public.user_activity_logs
  ADD CONSTRAINT user_activity_logs_action_type_check
  CHECK (action_type IN (
    'login',
    'session_view',
    'session_complete',
    'exercise_start',
    'exercise_submit',
    'exercise_complete'
  ));

-- ── 5. Ensure user_progress insert policy exists ─────────────
-- Some deployments may be missing the insert/update policies

DROP POLICY IF EXISTS "user_progress_insert" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_update" ON public.user_progress;

CREATE POLICY "user_progress_insert" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_update" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);
