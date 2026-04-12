alter table if exists public.user_profiles
add column if not exists last_streak_check_in_at timestamptz;
