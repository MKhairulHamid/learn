-- ============================================================
-- 067 — Course content is for enrolled learners
--
-- sessions, phases and exercises were all readable with the same
-- predicate: `auth.uid() IS NOT NULL`. No enrollment check anywhere.
-- Signup is open, so anyone who registered a free account could read
-- the entire paid curriculum — measured from a real student session:
-- 191 of 191 exercises and all 61 sessions, including every lesson
-- body (~1 MB of content_en/content_id).
--
-- Row-level gating was chosen over column gating so that no frontend
-- query has to change: every existing select('*') keeps working, it
-- just returns fewer rows.
--
-- Simulated against live data before applying:
--   admin / program_manager  61 → 61 sessions (unchanged)
--   students                 61 → 13 on average, minimum 1
--   students left with only the orientation lesson: 4,
--     none of whom have any recorded progress
--   users with a pending-but-no-active enrollment: 0
--
-- The orientation lesson is the one session with phase_id IS NULL,
-- and it stays readable for everyone — CohortNotice links straight to
-- it and usePhases fetches it unconditionally.
-- ============================================================


CREATE OR REPLACE FUNCTION public.can_read_session(sess_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.is_editor()
    -- Shared orientation lesson: no phase, no program, open to all.
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
    );
$$;

REVOKE EXECUTE ON FUNCTION public.can_read_session(uuid) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.can_read_session(uuid) TO authenticated;


-- ── sessions ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can view sessions" ON public.sessions;
CREATE POLICY "Enrolled learners read sessions" ON public.sessions
  FOR SELECT USING (public.can_read_session(id));


-- ── phases ────────────────────────────────────────────────────
-- Same rule one level up, so the curriculum tree does not leak the
-- shape of programs the learner has not bought.
DROP POLICY IF EXISTS "Authenticated users can view phases" ON public.phases;
CREATE POLICY "Enrolled learners read phases" ON public.phases
  FOR SELECT USING (
    public.is_editor()
    OR EXISTS (
      SELECT 1
      FROM public.cohorts c
      JOIN public.cohort_enrollments e ON e.cohort_id = c.id
      WHERE c.program_id = phases.program_id
        AND e.user_id = auth.uid()
        AND e.status = 'active'
    )
  );


-- ── exercises ─────────────────────────────────────────────────
-- editors_write_exercises (FOR ALL, is_editor()) already covers staff.
DROP POLICY IF EXISTS "exercises_read" ON public.exercises;
CREATE POLICY "exercises_read" ON public.exercises
  FOR SELECT USING (public.can_read_session(session_id));


-- ── Answer keys leave the learner-readable table ──────────────
-- Gating rows above stops outsiders harvesting all 37 solutions, but
-- an enrolled learner could still read the answer to the exercise in
-- front of them — solution_code sits on the same row as the prompt.
-- The learner UI never reads this column; only ExerciseEditor does.
--
-- Additive on purpose: exercises.solution_code stays for now, so the
-- currently deployed frontend keeps working. Migration 068 drops it
-- once the editor has been pointed at this table.

CREATE TABLE IF NOT EXISTS public.exercise_solutions (
  exercise_id   uuid PRIMARY KEY REFERENCES public.exercises(id) ON DELETE CASCADE,
  solution_code text NOT NULL DEFAULT ''
);

INSERT INTO public.exercise_solutions (exercise_id, solution_code)
SELECT id, coalesce(solution_code, '') FROM public.exercises
ON CONFLICT (exercise_id) DO NOTHING;

ALTER TABLE public.exercise_solutions ENABLE ROW LEVEL SECURITY;

-- No policy for learners at all: staff only, read and write.
CREATE POLICY "solutions_editor_all" ON public.exercise_solutions
  FOR ALL USING (public.is_editor()) WITH CHECK (public.is_editor());


-- ============================================================
-- Rollback:
--   CREATE POLICY "Authenticated users can view sessions" ON public.sessions
--     FOR SELECT USING (auth.uid() IS NOT NULL);
--   CREATE POLICY "Authenticated users can view phases" ON public.phases
--     FOR SELECT USING (auth.uid() IS NOT NULL);
--   CREATE POLICY "exercises_read" ON public.exercises
--     FOR SELECT USING (auth.uid() IS NOT NULL);
--   (drop the three policies this migration created first)
-- ============================================================
