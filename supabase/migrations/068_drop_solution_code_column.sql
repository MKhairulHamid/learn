-- ============================================================
-- 068 — Drop exercises.solution_code
--
-- Run only after 067 is applied AND the frontend that reads and
-- writes exercise_solutions is deployed. 067 already copied every
-- row across; this removes the learner-readable copy.
--
-- Kept separate so the deployed frontend never sees a column it
-- still expects disappear underneath it.
-- ============================================================

-- Safety: refuse to drop if anything failed to copy across.
DO $$
DECLARE missing int;
BEGIN
  SELECT count(*) INTO missing
  FROM public.exercises e
  WHERE coalesce(trim(e.solution_code), '') <> ''
    AND NOT EXISTS (
      SELECT 1 FROM public.exercise_solutions s
      WHERE s.exercise_id = e.id AND trim(s.solution_code) = trim(e.solution_code)
    );

  IF missing > 0 THEN
    RAISE EXCEPTION 'Refusing to drop: % solution(s) not copied to exercise_solutions', missing;
  END IF;
END $$;

ALTER TABLE public.exercises DROP COLUMN IF EXISTS solution_code;

-- ============================================================
-- Rollback (contents restored from exercise_solutions):
--   ALTER TABLE public.exercises ADD COLUMN solution_code text DEFAULT '';
--   UPDATE public.exercises e SET solution_code = s.solution_code
--     FROM public.exercise_solutions s WHERE s.exercise_id = e.id;
-- ============================================================
