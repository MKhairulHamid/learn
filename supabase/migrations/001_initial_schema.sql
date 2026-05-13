-- ============================================================
-- 001: Initial Schema — DataLearn Platform
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── Profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text,
  full_name    text,
  avatar_url   text,
  preferred_language text not null default 'en' check (preferred_language in ('en','id')),
  role         text not null default 'student' check (role in ('student','admin')),
  created_at   timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, preferred_language, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'en',
    'student'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Phases ────────────────────────────────────────────────
create table if not exists public.phases (
  id           uuid primary key default gen_random_uuid(),
  phase_number int not null unique,
  name_id      text not null,
  name_en      text not null,
  description_id text not null,
  description_en text not null,
  icon         text not null default '📊',
  color        text not null default 'from-blue-500 to-cyan-500',
  order_num    int not null
);

-- ── Sessions ──────────────────────────────────────────────
create table if not exists public.sessions (
  id                      uuid primary key default gen_random_uuid(),
  phase_id                uuid not null references public.phases(id) on delete cascade,
  session_number          text not null unique,
  title_id                text not null,
  title_en                text not null,
  content_id              text not null default '',
  content_en              text not null default '',
  unit_skkni              text not null default '',
  learning_output_id      text not null default '',
  learning_output_en      text not null default '',
  order_num               int not null,
  estimated_duration_minutes int not null default 90
);

-- ── User Progress ─────────────────────────────────────────
create table if not exists public.user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  session_id   uuid not null references public.sessions(id) on delete cascade,
  completed    boolean not null default false,
  completed_at timestamptz,
  score        int default 0,
  unique(user_id, session_id)
);

-- ── Activity Logs ─────────────────────────────────────────
create table if not exists public.user_activity_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  action_type text not null check (action_type in ('login','session_view','exercise_start','exercise_submit','session_complete')),
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.phases enable row level security;
alter table public.sessions enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_activity_logs enable row level security;

-- Profiles: users read/update own row; admins read all
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Phases & Sessions: readable by all authenticated users
create policy "Authenticated users can view phases"
  on public.phases for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view sessions"
  on public.sessions for select using (auth.role() = 'authenticated');

-- User progress: own rows only
create policy "Users manage own progress"
  on public.user_progress for all using (auth.uid() = user_id);
create policy "Admins can view all progress"
  on public.user_progress for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Activity logs: own rows only; admins read all
create policy "Users insert own activity"
  on public.user_activity_logs for insert with check (auth.uid() = user_id);
create policy "Users view own activity"
  on public.user_activity_logs for select using (auth.uid() = user_id);
create policy "Admins view all activity"
  on public.user_activity_logs for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
