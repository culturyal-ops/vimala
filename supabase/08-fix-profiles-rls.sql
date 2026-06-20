-- Fix profiles RLS infinite recursion (owner policy querying profiles)
-- Run once in Supabase SQL Editor

DROP POLICY IF EXISTS "owner_manage_profiles" ON profiles;

CREATE POLICY "owner_manage_profiles" ON profiles
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'owner'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'owner'
  );

-- Safer alternative: use security definer function (preferred)
DROP POLICY IF EXISTS "owner_manage_profiles" ON profiles;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner'
  );
$$;

CREATE POLICY "owner_manage_profiles" ON profiles
  FOR ALL TO authenticated
  USING (public.is_owner())
  WITH CHECK (public.is_owner());
