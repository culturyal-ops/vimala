-- Run AFTER creating admin user in Supabase Auth dashboard
-- Suggested: admin@vimalasilk.com

-- Email: admin@vimalasilk.com  |  Password: vimalasilks@2026
-- =============================================================================

-- Create profile if trigger didn't fire (e.g. user created before schema)
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
