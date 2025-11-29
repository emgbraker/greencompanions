-- Create user_warnings table for moderator actions
CREATE TABLE public.user_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  warned_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('warning', 'serious', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  package_type TEXT NOT NULL CHECK (package_type IN ('basic', 'premium', 'platinum')),
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create website_content table for CMS functionality
CREATE TABLE public.website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  section_key TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'html', 'image', 'heading')),
  content_nl TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  editable BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id),
  UNIQUE(page_key, section_key)
);

-- Enable RLS
ALTER TABLE public.user_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_warnings
CREATE POLICY "Admins can view all warnings"
  ON public.user_warnings FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create warnings"
  ON public.user_warnings FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update warnings"
  ON public.user_warnings FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for sponsors (public can view active sponsors)
CREATE POLICY "Anyone can view active sponsors"
  ON public.sponsors FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage sponsors"
  ON public.sponsors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for website_content
CREATE POLICY "Anyone can view website content"
  ON public.website_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage content"
  ON public.website_content FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX idx_user_warnings_user_id ON public.user_warnings(user_id);
CREATE INDEX idx_user_warnings_severity ON public.user_warnings(severity);
CREATE INDEX idx_sponsors_active ON public.sponsors(active);
CREATE INDEX idx_sponsors_display_order ON public.sponsors(display_order);
CREATE INDEX idx_website_content_page_key ON public.website_content(page_key);

-- Trigger for website_content updated_at
CREATE TRIGGER update_website_content_updated_at
  BEFORE UPDATE ON public.website_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add blocked status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP WITH TIME ZONE;