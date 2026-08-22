-- Create inquiries table for contact form & RFQ submissions
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    hospital TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for admin review workflows
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);

-- Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated visitors) can submit an inquiry
CREATE POLICY "Public can submit inquiries"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated admins can read submitted inquiries
CREATE POLICY "Admins can view inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (true);
