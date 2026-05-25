-- ============================================================
-- 016 — Mentor role + content editor RLS
-- Adds a 'mentor' role that can edit lesson content and exercises
-- (but not curriculum structure — that stays admin-only).
-- ============================================================

-- 1. Allow 'mentor' in the role check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'admin', 'mentor'));

-- 2. Helper: true when the caller is an admin OR a mentor
CREATE OR REPLACE FUNCTION is_editor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'mentor')
  );
$$;

-- 3. Editors can update lesson content (sessions rows).
--    The UI only exposes the content fields; structure is unchanged.
CREATE POLICY "editors_update_sessions" ON public.sessions
  FOR UPDATE USING (is_editor()) WITH CHECK (is_editor());

-- 4. Editors can manage exercises (insert/update/delete).
--    004 already grants this to admins via is_admin(); broaden to editors.
DROP POLICY IF EXISTS "admin_write_exercises" ON public.exercises;
CREATE POLICY "editors_write_exercises" ON public.exercises
  FOR ALL USING (is_editor()) WITH CHECK (is_editor());

-- ============================================================
-- To grant mentor: UPDATE profiles SET role = 'mentor' WHERE email = 'someone@email.com';
-- ============================================================
