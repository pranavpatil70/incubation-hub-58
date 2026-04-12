-- Keep a deterministic local test account for development and QA.
do $$
declare
  test_user_id uuid := '11111111-1111-1111-1111-111111111111';
  test_identity_id uuid := '22222222-2222-2222-2222-222222222222';
  test_email text := 'test@email.com';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    test_user_id,
    'authenticated',
    'authenticated',
    test_email,
    crypt('test@123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Test User"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  on conflict (id) do update
  set
    email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = now(),
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

  delete from auth.identities
  where provider = 'email'
    and provider_id = test_email
    and id <> test_identity_id;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    test_identity_id,
    test_user_id,
    jsonb_build_object('sub', test_user_id::text, 'email', test_email),
    'email',
    test_email,
    now(),
    now(),
    now()
  )
  on conflict (id) do update
  set
    user_id = excluded.user_id,
    identity_data = excluded.identity_data,
    provider = excluded.provider,
    provider_id = excluded.provider_id,
    last_sign_in_at = now(),
    updated_at = now();

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
    test_user_id,
    'Test User',
    test_email,
    'researcher',
    'intermediate',
    array['Machine Learning'],
    'daily',
    '08:00',
    true
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    role = excluded.role,
    level = excluded.level,
    domains = excluded.domains,
    frequency = excluded.frequency,
    notify_time = excluded.notify_time,
    onboarding_completed = excluded.onboarding_completed,
    updated_at = now();
end $$;

insert into public.papers (
  title,
  authors,
  abstract,
  pdf_url,
  year,
  venue,
  domain,
  difficulty,
  difficulty_score,
  semantic_scholar_id,
  citation_count,
  summary,
  word_count
)
values
(
  'Efficient Transformer Research Workflows for Daily Reading',
  array['A. Scholar', 'P. Researcher', 'D. Student'],
  'A practical framework for prioritizing, annotating, and understanding modern transformer papers in a daily reading habit.',
  null,
  2026,
  'PaperMind Journal Club',
  'Machine Learning',
  'intermediate',
  6,
  'seed-eff-transformers',
  142,
  'A structured process for reading and understanding transformer papers faster.',
  520
)
on conflict (semantic_scholar_id) do nothing;
