-- Create the product-media storage bucket for image and PDF uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access: anon role can view/download files
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-media');

-- Authenticated users can upload files
CREATE POLICY "Authenticated insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-media'
  AND auth.role() = 'authenticated'
);

-- Authenticated users can update files
CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-media'
  AND auth.role() = 'authenticated'
);

-- Authenticated users can delete files
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-media'
  AND auth.role() = 'authenticated'
);