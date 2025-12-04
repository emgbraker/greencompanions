-- Add seeking_relationship column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS seeking_relationship boolean DEFAULT false;