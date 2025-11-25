-- Add province column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN province text;

-- Add index for faster filtering
CREATE INDEX idx_profiles_province ON public.profiles(province);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);
CREATE INDEX idx_profiles_handicap ON public.profiles(handicap);
CREATE INDEX idx_profiles_birth_date ON public.profiles(birth_date);