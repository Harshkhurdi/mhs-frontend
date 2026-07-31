-- Create products table with strict constraints
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  pdf_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_specialty CHECK (specialty IN (
    'critical-care',
    'radiology',
    'ward-infrastructure',
    'patient-monitoring'
  )),
  CONSTRAINT valid_brand CHECK (brand IN (
    'hamilton',
    'samsung',
    'linet',
    'spacelabs'
  ))
);

-- Index for fast lookups by slug
CREATE INDEX idx_products_slug ON products (slug);

-- Index for filtering by specialty and brand
CREATE INDEX idx_products_specialty ON products (specialty);
CREATE INDEX idx_products_brand ON products (brand);