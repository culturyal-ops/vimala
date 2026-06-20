-- Manually confirm a storefront customer when confirmation emails don't arrive.
-- Replace the email below, then run in Supabase SQL Editor.

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'customer@example.com';

-- Ensure profile exists with customer role (safe if trigger already ran)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'role', 'customer')
FROM auth.users u
WHERE u.email = 'customer@example.com'
ON CONFLICT (id) DO UPDATE SET
  role = CASE
    WHEN EXCLUDED.role IN ('owner', 'staff', 'customer') THEN EXCLUDED.role
    ELSE profiles.role
  END;

-- Link to customers table if they checked out as guest first
UPDATE public.customers c
SET auth_user_id = u.id
FROM auth.users u
WHERE u.email = 'customer@example.com'
  AND c.email = u.email
  AND c.auth_user_id IS NULL;
