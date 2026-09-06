-- ============================================================
-- 065 — Security hardening, phase 2 of 2: ENFORCE
--
-- Run this only after 064 has been applied AND the matching frontend
-- is deployed. It closes three holes reachable by any signed-up
-- account:
--
--   1. CRITICAL — a learner could promote themselves to admin with a
--      single UPDATE on their own profiles.role. The policy had no
--      WITH CHECK and no column restriction, and `authenticated`
--      held a table-wide UPDATE grant.
--   2. HIGH — "Authenticated users can read public profile fields"
--      exposed every profile row, email included, to every account.
--      RLS is row-level, so the policy never did what its name says.
--   3. HIGH — certificates were readable with USING (true), so the
--      whole table (recipient names and scores) could be dumped
--      anonymously rather than verified one ID at a time.
-- ============================================================


-- ── 1. CRITICAL — lock down profiles.role ─────────────────────
-- The grants are table-wide (Supabase's default), so a column-level
-- REVOKE on its own would be a no-op: a table-level UPDATE covers
-- every column. Drop UPDATE outright, then hand back only the
-- columns a user may edit about themselves.

REVOKE UPDATE ON public.profiles FROM authenticated, anon;

GRANT UPDATE (
  username,
  full_name,
  avatar_url,
  preferred_language,
  onboarding_completed_at
) ON public.profiles TO authenticated;

-- State the check explicitly rather than relying on Postgres falling
-- back to the USING expression.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING      (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── 2. HIGH — no more reading every profile ───────────────────
-- Superseded by the scoped policies added in 064.

DROP POLICY IF EXISTS "Authenticated users can read public profile fields" ON public.profiles;


-- ── 3. HIGH — certificates are verified, not enumerated ───────
-- Superseded by verify_certificate() plus the own/staff policies
-- added in 064.

DROP POLICY IF EXISTS "public_can_read_certificates" ON certificates;


-- ── 4. Trigger functions do not belong on the REST API ────────
-- They take no arguments and were reachable as /rest/v1/rpc/...
--
-- PUBLIC must be named explicitly: Postgres grants EXECUTE to PUBLIC on
-- every new function, and revoking only from anon and authenticated
-- leaves that inherited grant — and the RPC endpoint — in place.
-- The triggers themselves are unaffected; they run as the definer.

REVOKE EXECUTE ON FUNCTION public.handle_new_user()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enroll_preapproved_user()        FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_profile_email()             FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_discussion_notification() FROM PUBLIC, anon, authenticated;


-- ============================================================
-- Rollback, if something unexpected surfaces:
--
--   GRANT UPDATE ON public.profiles TO authenticated;
--   CREATE POLICY "Authenticated users can read public profile fields"
--     ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
--   CREATE POLICY "public_can_read_certificates"
--     ON certificates FOR SELECT USING (true);
--
-- That restores the old behaviour without touching 064, which is
-- additive and safe to leave in place.
-- ============================================================
