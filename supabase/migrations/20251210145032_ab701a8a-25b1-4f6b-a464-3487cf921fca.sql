-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view logos
CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

-- Allow admins to upload logos
CREATE POLICY "Admins can upload logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));

-- Allow admins to update logos
CREATE POLICY "Admins can update logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));

-- Allow admins to delete logos
CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'logos' AND has_role(auth.uid(), 'admin'));