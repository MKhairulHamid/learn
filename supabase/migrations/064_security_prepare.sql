-- ============================================================
-- 064 — Security hardening, phase 1 of 2: PREPARE
--
-- Purely additive. It creates the helpers, RPCs and policies that
-- migration 065 needs, but removes no access at all, so it is safe
-- to run against a live deployment on its own.
--
-- Release order that keeps users online:
--   1. run 064
--   2. deploy the frontend (it starts calling the new RPCs)
--   3. run 065, which takes the old open access away
--
-- Between steps the app works under either the old or the new rules.
-- ============================================================


-- ── Helper: do I share a cohort with this profile? ────────────
-- SECURITY DEFINER so the lookup is not itself filtered by the RLS
-- on cohort_enrollments, which only exposes the caller's own rows.
--
-- 'rejected' is the only status that does not belong to the cohort;
-- 'pending' members can already post in discussions, so their names
-- must stay resolvable for everyone else.

CREATE OR REPLACE FUNCTION public.shares_cohort_with(target uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cohort_enrollments mine
    JOIN public.cohort_enrollments theirs USING (cohort_id)
    WHERE mine.user_id   = auth.uid()
      AND theirs.user_id = target
      AND mine.status   <> 'rejected'
      AND theirs.status <> 'rejected'
  );
$$;

-- Both are relied on by the policies below, and both were flagged by
-- the database linter for a mutable search_path. Bodies unchanged.

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'mentor', 'program_manager')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_program_manager()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'program_manager'
  );
$$;


-- ── Role changes move off the table and behind an admin check ──
-- 065 revokes UPDATE on profiles, so the admin dashboard needs this
-- route before that happens.

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
END;
$$;

-- Postgres grants EXECUTE to PUBLIC on every new function, and PUBLIC
-- covers anon. Revoking from anon alone leaves that inherited grant in
-- place, so PUBLIC has to go first.
REVOKE EXECUTE ON FUNCTION public.admin_set_user_role(uuid, text) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.admin_set_user_role(uuid, text) TO authenticated;


-- ── Certificate verification by ID, not by enumeration ────────
-- 065 drops the USING (true) read policy; this is what replaces it
-- for the public /verify/:certId page.

CREATE OR REPLACE FUNCTION public.verify_certificate(p_cert_id uuid)
RETURNS SETOF certificates
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.certificates WHERE id = p_cert_id;
$$;

GRANT EXECUTE ON FUNCTION public.verify_certificate(uuid) TO anon, authenticated;

-- Signed-in reads that the open policy used to cover: a learner's own
-- certificates on their profile page, and the staff cohort views.
CREATE POLICY "own_read_certificates" ON certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "staff_read_certificates" ON certificates
  FOR SELECT USING (public.is_admin() OR public.is_program_manager());


-- ── Scoped profile reads, added alongside the open one ────────
-- Together these cover every profile read the app performs:
--   • discussion authors, @mention search, notification actors
--     → cohort peers
--   • staff names rendered to learners (mentor replies, notifications)
--     → profiles whose role is staff
--   • admin / mentor / PM panels → is_editor()
-- Own-profile, admin and PM policies from earlier migrations stay as
-- they are. 065 drops the open "Authenticated users can read public
-- profile fields" policy once these are in place.

CREATE POLICY "Members read cohort peers and staff" ON public.profiles
  FOR SELECT USING (
    public.shares_cohort_with(id)
    OR role IN ('admin', 'mentor', 'program_manager')
  );

CREATE POLICY "Editors read profiles" ON public.profiles
  FOR SELECT USING (public.is_editor());
