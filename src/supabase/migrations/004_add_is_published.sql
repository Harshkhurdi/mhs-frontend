-- Add is_published column to products table for admin publish/archive control
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Update existing seed products to be published
UPDATE products SET is_published = true WHERE is_published IS NULL;