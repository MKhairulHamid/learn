-- ============================================================
-- 022 — Program Manager role
-- Introduces a 'program_manager' role scoped to assigned programs.
-- PMs can manage program details, schedules, mentor assignments,
-- and enrolled students within their assigned programs only.
-- Admins retain unrestricted access to all PM features.
-- ============================================================

-- 1. Expand role constraint to include 'program_manager'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'admin', 'mentor', 'program_manager'));

-- 2. Program manager ↔ program assignments (many-to-many scoping table)
CREATE TABLE IF NOT EXISTS public.program_manager_assignments (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.programs(id)  ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE (user_id, program_id)
);

ALTER TABLE public.program_manager_assignments ENABLE ROW LEVEL SECURITY;

-- 3. Add mentor_id to sessions (one mentor per session)
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS mentor_id uuid
  REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ── Helper functions ─────────────────────────────────────────────────

-- True when the caller has role = 'program_manager'
CREATE OR REPLACE FUNCTION public.is_program_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'program_manager'
  );
$$;

-- True when the caller is an admin OR a PM assigned to the given program
CREATE OR REPLACE FUNCTION public.is_program_manager_for(pid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    is_admin()
    OR EXISTS (
      SELECT 1 FROM public.program_manager_assignments
      WHERE user_id = auth.uid() AND program_id = pid
    );
$$;

-- ── RLS policies — program_manager_assignments ───────────────────────

CREATE POLICY "admin_manage_pm_assignments" ON public.program_manager_assignments
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PMs can read their own assignments
CREATE POLICY "pm_read_own_assignments" ON public.program_manager_assignments
  FOR SELECT USING (user_id = auth.uid());

-- ── RLS policies — programs ──────────────────────────────────────────

-- PMs can update programs they're assigned to (details editing)
CREATE POLICY "pm_update_own_programs" ON public.programs
  FOR UPDATE
  USING (is_program_manager_for(id))
  WITH CHECK (is_program_manager_for(id));

-- ── RLS policies — cohorts ───────────────────────────────────────────

-- PMs can create cohorts for their programs
CREATE POLICY "pm_insert_cohorts" ON public.cohorts
  FOR INSERT WITH CHECK (is_program_manager_for(program_id));

-- PMs can update cohorts in their programs
CREATE POLICY "pm_update_cohorts" ON public.cohorts
  FOR UPDATE
  USING (is_program_manager_for(program_id))
  WITH CHECK (is_program_manager_for(program_id));

-- PMs can delete cohorts in their programs
CREATE POLICY "pm_delete_cohorts" ON public.cohorts
  FOR DELETE USING (is_program_manager_for(program_id));

-- ── RLS policies — cohort_lesson_schedule ────────────────────────────

-- PMs can manage schedules for cohorts in their programs
CREATE POLICY "pm_manage_schedule" ON public.cohort_lesson_schedule
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = cohort_lesson_schedule.cohort_id
        AND is_program_manager_for(c.program_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = cohort_lesson_schedule.cohort_id
        AND is_program_manager_for(c.program_id)
    )
  );

-- ── RLS policies — cohort_enrollments ───────────────────────────────

-- PMs can view and update (approve/reject) enrollments in their programs
CREATE POLICY "pm_manage_enrollments" ON public.cohort_enrollments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = cohort_enrollments.cohort_id
        AND is_program_manager_for(c.program_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = cohort_enrollments.cohort_id
        AND is_program_manager_for(c.program_id)
    )
  );

-- ── RLS policies — sessions (mentor assignment) ──────────────────────

-- PMs can update sessions (to set mentor_id) in their programs
CREATE POLICY "pm_update_sessions" ON public.sessions
  FOR UPDATE
  USING (
    is_admin()
    OR (
      is_program_manager()
      AND phase_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.phases ph
        WHERE ph.id = sessions.phase_id
          AND is_program_manager_for(ph.program_id)
      )
    )
  )
  WITH CHECK (
    is_admin()
    OR (
      is_program_manager()
      AND phase_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.phases ph
        WHERE ph.id = sessions.phase_id
          AND is_program_manager_for(ph.program_id)
      )
    )
  );

-- ── RLS policies — session_feedback ─────────────────────────────────

-- PMs can read feedback for their programs' cohorts
CREATE POLICY "pm_read_feedback" ON public.session_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cohorts c
      WHERE c.id = session_feedback.cohort_id
        AND is_program_manager_for(c.program_id)
    )
  );

-- ── RLS policies — profiles (read enrolled students) ─────────────────

-- PMs can read profiles of students enrolled in their programs
CREATE POLICY "pm_read_student_profiles" ON public.profiles
  FOR SELECT
  USING (
    is_program_manager()
    AND EXISTS (
      SELECT 1 FROM public.cohort_enrollments ce
      JOIN public.cohorts c ON c.id = ce.cohort_id
      WHERE ce.user_id = profiles.id
        AND is_program_manager_for(c.program_id)
    )
  );

-- ── Update is_editor to include program_manager ──────────────────────
-- PMs can view all lesson content in their assigned programs
-- (they bypass cohort gating in the app, consistent with mentors)
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'mentor', 'program_manager')
  );
$$;

-- ============================================================
-- To grant PM role:
--   UPDATE profiles SET role = 'program_manager' WHERE email = 'pm@email.com';
-- To assign a PM to a program:
--   INSERT INTO program_manager_assignments (user_id, program_id)
--   VALUES ('<pm-user-id>', '<program-id>');
-- ============================================================
