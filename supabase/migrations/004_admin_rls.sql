-- ============================================================
-- 004 — Admin RLS policies
-- Admins can read all profiles, progress, activity logs,
-- and submissions. Uses a helper function to avoid recursion.
-- ============================================================

-- Helper: returns true when the calling user has role = 'admin'
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- profiles: admins can read everyone
CREATE POLICY "admin_read_profiles" ON profiles
  FOR SELECT USING (is_admin());

-- user_progress: admins can read all rows
CREATE POLICY "admin_read_progress" ON user_progress
  FOR SELECT USING (is_admin());

-- user_activity_logs: admins can read all rows
CREATE POLICY "admin_read_activity" ON user_activity_logs
  FOR SELECT USING (is_admin());

-- exercise_submissions: admins can read all rows
CREATE POLICY "admin_read_submissions" ON exercise_submissions
  FOR SELECT USING (is_admin());

-- exercises: admins can insert/update/delete (manage content)
CREATE POLICY "admin_write_exercises" ON exercises
  FOR ALL USING (is_admin());

-- ============================================================
-- To grant admin: UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ============================================================
