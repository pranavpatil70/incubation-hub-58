create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null,
  level text not null check (level in ('beginner', 'intermediate', 'expert')),
  domains text[] not null default '{}',
  frequency text not null default 'daily',
  notify_time text not null default '08:00',
  streak int not null default 0,
  total_read int not null default 0,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text[] not null default '{}',
  abstract text not null default '',
  pdf_url text,
  year int not null,
  venue text not null default '',
  domain text not null default 'General',
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'expert')),
  difficulty_score int not null default 1,
  semantic_scholar_id text unique,
  citation_count int not null default 0,
  summary text,
  word_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.user_daily_papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paper_id uuid not null references public.papers(id) on delete cascade,
  scheduled_date date not null,
  read boolean not null default false,
  read_at timestamptz,
  read_duration_minutes int,
  created_at timestamptz not null default now(),
  unique (user_id, scheduled_date)
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paper_id uuid not null references public.papers(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, paper_id)
);

create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paper_id uuid references public.papers(id) on delete set null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_papers_domain_year on public.papers(domain, year desc);
create index if not exists idx_papers_difficulty on public.papers(difficulty, difficulty_score);
create index if not exists idx_user_daily_user_date on public.user_daily_papers(user_id, scheduled_date desc);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id, created_at desc);
create index if not exists idx_chat_history_user on public.chat_history(user_id, created_at desc);

alter table public.user_profiles enable row level security;
alter table public.papers enable row level security;
alter table public.user_daily_papers enable row level security;
alter table public.bookmarks enable row level security;
alter table public.chat_history enable row level security;

drop policy if exists "user_profile_owner_select" on public.user_profiles;
create policy "user_profile_owner_select" on public.user_profiles
for select using (auth.uid() = id);

drop policy if exists "user_profile_owner_upsert" on public.user_profiles;
create policy "user_profile_owner_upsert" on public.user_profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "papers_read_all_authenticated" on public.papers;
create policy "papers_read_all_authenticated" on public.papers
for select to authenticated using (true);

drop policy if exists "daily_owner_access" on public.user_daily_papers;
create policy "daily_owner_access" on public.user_daily_papers
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "bookmarks_owner_access" on public.bookmarks;
create policy "bookmarks_owner_access" on public.bookmarks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "chat_owner_access" on public.chat_history;
create policy "chat_owner_access" on public.chat_history
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
