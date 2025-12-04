-- Drop existing and recreate
DROP FUNCTION public.search_members();

CREATE FUNCTION public.search_members()
RETURNS TABLE(id uuid, first_name text, last_name text, avatar_url text, gender text, province text, city text, handicap text, bio text, age integer, seeking_relationship boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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
    EXTRACT(YEAR FROM AGE(p.birth_date))::INTEGER as age,
    p.seeking_relationship
  FROM public.profiles p
  WHERE NOT COALESCE(p.blocked, false)
    AND p.id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
$$;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, gender, province, handicap, seeking_relationship)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'gender', ''),
    COALESCE(NEW.raw_user_meta_data->>'province', ''),
    COALESCE(NEW.raw_user_meta_data->>'handicap', ''),
    COALESCE((NEW.raw_user_meta_data->>'seeking_relationship')::boolean, false)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Update handle_new_profile_membership to create elite for relationship seekers
CREATE OR REPLACE FUNCTION public.handle_new_profile_membership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.seeking_relationship = true THEN
    INSERT INTO public.memberships (user_id, type, status, end_date)
    VALUES (NEW.id, 'elite', 'active', NOW() + INTERVAL '3 months');
  ELSE
    INSERT INTO public.memberships (user_id, type, status, end_date)
    VALUES (NEW.id, 'free', 'active', NOW() + INTERVAL '3 months');
  END IF;
  RETURN NEW;
END;
$$;