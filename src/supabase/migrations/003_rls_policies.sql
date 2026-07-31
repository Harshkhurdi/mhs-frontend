-- Enable Row-Level Security on the products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public Read Access
-- Allow unauthenticated anonymous users (anon role) to SELECT from products
CREATE POLICY "Public read access" ON products
  FOR SELECT
  USING (true);

-- Restricted Write Access (Authenticated users only)
-- Only authenticated users can INSERT new products
CREATE POLICY "Authenticated insert" ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can UPDATE existing products
CREATE POLICY "Authenticated update" ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can DELETE products
CREATE POLICY "Authenticated delete" ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');