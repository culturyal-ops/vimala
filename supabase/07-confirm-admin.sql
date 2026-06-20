-- Run in Supabase SQL Editor after admin@vimalasilk.com is created
-- Confirms email + sets VRM owner role (no service key needed)

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'admin@vimalasilk.com';

INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  'Vimala Owner',
  'owner'
FROM auth.users u
WHERE u.email = 'admin@vimalasilk.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'owner',
  full_name = 'Vimala Owner',
  email = EXCLUDED.email;
