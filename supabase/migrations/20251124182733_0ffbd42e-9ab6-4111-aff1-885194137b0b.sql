-- Wijzig handicap kolom naar text om ranges op te slaan
ALTER TABLE public.profiles 
ALTER COLUMN handicap TYPE text USING handicap::text;

-- Maak storage bucket voor avatar uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- RLS policies voor avatar bucket
CREATE POLICY "Avatar images zijn publiek zichtbaar"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Gebruikers kunnen eigen avatar uploaden"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Gebruikers kunnen eigen avatar updaten"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Gebruikers kunnen eigen avatar verwijderen"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);