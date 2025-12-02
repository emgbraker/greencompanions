-- Create membership type enum
CREATE TYPE public.membership_type AS ENUM ('free', 'premium', 'elite');

-- Create membership status enum
CREATE TYPE public.membership_status AS ENUM ('active', 'expired', 'cancelled', 'pending');

-- Create memberships table
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type membership_type NOT NULL DEFAULT 'free',
  status membership_status NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Users can view their own membership
CREATE POLICY "Users can view own membership"
ON public.memberships
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own membership (for auto_renew toggle)
CREATE POLICY "Users can update own membership"
ON public.memberships
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can manage all memberships
CREATE POLICY "Admins can manage all memberships"
ON public.memberships
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_memberships_updated_at
BEFORE UPDATE ON public.memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create function to auto-create free membership on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile_membership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.memberships (user_id, type, status, end_date)
  VALUES (NEW.id, 'free', 'active', NOW() + INTERVAL '3 months');
  RETURN NEW;
END;
$$;

-- Create trigger for auto-creating membership
CREATE TRIGGER on_profile_created_membership
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_profile_membership();

-- Create notifications table for in-app notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- System can insert notifications (via service role)
CREATE POLICY "Service role can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);