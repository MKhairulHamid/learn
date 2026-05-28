-- ============================================================
-- 023 — Drop legacy user_progress table
--
-- Progress is now tracked exclusively in cohort_session_progress,
-- scoped per-cohort. The user_progress table was the original
-- single-table approach and is no longer referenced by any code.
-- ============================================================

drop table if exists public.user_progress;
