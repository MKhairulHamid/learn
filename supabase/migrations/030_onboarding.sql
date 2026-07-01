-- ============================================================
-- 030 — Onboarding walkthrough tracking
-- Records when a user finished (or skipped) their role-based
-- product tour, so it auto-runs only once. Users can still
-- replay it on demand from the profile menu.
-- ============================================================

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;
