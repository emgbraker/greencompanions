-- Step 1: Restrict direct access to profiles table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Create restrictive policy: users can only view their own full profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Step 2: Create SECURITY DEFINER function for safe member search
-- This function bypasses RLS to return only non-sensitive profile data
CREATE OR REPLACE FUNCTION public.search_members()
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  avatar_url text,
  gender text,
  province text,
  city text,
  handicap text,
  bio text,
  age integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    p.gender,
    p.province,
    p.city,
    p.handicap,
    p.bio,
    EXTRACT(YEAR FROM AGE(p.birth_date))::INTEGER as age
  FROM public.profiles p
  WHERE NOT COALESCE(p.blocked, false)
    AND p.id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.search_members() TO authenticated;

COMMENT ON FUNCTION public.search_members() IS 'Returns non-sensitive member profile data for member search. Email and birth_date are excluded for privacy.';
