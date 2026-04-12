create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  inferred_name text;
begin
  inferred_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    split_part(coalesce(new.email, 'user'), '@', 1),
    'User'
  );

  insert into public.user_profiles (
    id,
    name,
    email,
    role,
    level,
    domains,
    frequency,
    notify_time,
    onboarding_completed
  )
  values (
    new.id,
    inferred_name,
    coalesce(new.email, ''),
    'researcher',
    'beginner',
    '{}',
    'daily',
    '08:00',
    false
  )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
