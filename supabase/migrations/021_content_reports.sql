-- ============================================================
-- 021 — Content Reports
--   * content_reports table: users flag incorrect/outdated content
--   * RLS: any authenticated user can insert; admins read all
-- ============================================================

create table if not exists public.content_reports (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  reason      text not null,   -- 'incorrect_content' | 'outdated' | 'broken_exercise' | 'missing_content' | 'other'
  details     text not null default '',
  status      text not null default 'open',  -- 'open' | 'resolved' | 'dismissed'
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_content_reports_session on public.content_reports(session_id);
create index if not exists idx_content_reports_user    on public.content_reports(user_id);
create index if not exists idx_content_reports_status  on public.content_reports(status);

alter table public.content_reports enable row level security;

-- Any authenticated user can submit a report
create policy "reports_insert_auth" on public.content_reports
  for insert with check (user_id = auth.uid());

-- Users can see their own reports; admins see all
create policy "reports_select" on public.content_reports
  for select using (user_id = auth.uid() or public.is_admin());

-- Admins can update (change status) and delete
create policy "reports_admin_update" on public.content_reports
  for update using (public.is_admin()) with check (public.is_admin());

create policy "reports_admin_delete" on public.content_reports
  for delete using (public.is_admin());
