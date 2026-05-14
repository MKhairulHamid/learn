-- ============================================================
-- 007 — Admin email whitelist
-- Add emails here (via Supabase Table Editor or SQL) to grant
-- admin access. The trigger auto-sets role = 'admin' on login.
-- ============================================================

-- ── Table ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admin_whitelist (
  email     TEXT PRIMARY KEY,
  note      TEXT,
  added_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Only the service role (Supabase backend) can read this.
-- Never exposed to the client via RLS.
ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;
-- No SELECT policy → client can never query this table directly.

-- ── Sync function ────────────────────────────────────────────
-- Rebuilds role on each profile upsert, so adding an email to
-- admin_whitelist takes effect next time the user logs in.

CREATE OR REPLACE FUNCTION public.sync_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _email TEXT;
BEGIN
  SELECT email INTO _email FROM auth.users WHERE id = NEW.id;

  IF EXISTS (SELECT 1 FROM public.admin_whitelist WHERE email = _email) THEN
    NEW.role := 'admin';
  ELSE
    -- Demote if they were removed from the whitelist
    IF NEW.role = 'admin' THEN
      NEW.role := 'user';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_admin_role ON public.profiles;
CREATE TRIGGER trg_sync_admin_role
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_role();

-- ── Backfill existing users ──────────────────────────────────
-- Run this once after inserting emails into admin_whitelist to
-- promote already-registered users immediately.

CREATE OR REPLACE FUNCTION public.refresh_admin_roles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Promote users whose email is in whitelist
  UPDATE public.profiles p
  SET role = 'admin'
  FROM auth.users u
  WHERE p.id = u.id
    AND EXISTS (SELECT 1 FROM public.admin_whitelist w WHERE w.email = u.email);

  -- Demote users removed from whitelist
  UPDATE public.profiles p
  SET role = 'user'
  FROM auth.users u
  WHERE p.id = u.id
    AND p.role = 'admin'
    AND NOT EXISTS (SELECT 1 FROM public.admin_whitelist w WHERE w.email = u.email);
END;
$$;

-- ── is_admin() — also cross-checks whitelist directly ────────
-- Protects against the case where the trigger hasn't fired yet.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    -- Check profile role
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    -- Also check whitelist directly (fallback)
    EXISTS (
      SELECT 1 FROM public.admin_whitelist w
      JOIN auth.users u ON u.email = w.email
      WHERE u.id = auth.uid()
    );
$$;

-- ============================================================
-- HOW TO ADD AN ADMIN:
--
-- 1. Go to Supabase → Table Editor → admin_whitelist
-- 2. Insert a row: { email: "user@example.com", note: "Platform owner" }
-- 3. Then run: SELECT refresh_admin_roles();
--
-- Or via SQL:
--   INSERT INTO admin_whitelist (email, note)
--   VALUES ('user@example.com', 'Platform owner');
--   SELECT refresh_admin_roles();
-- ============================================================
