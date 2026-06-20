-- 03 — Storefront catalog columns — run after commerce-schema.sql

ALTER TABLE products ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_label TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS scarcity_note TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hover_image_url TEXT;

-- Allow anon/public reads of published products (storefront PLP/PDP)
DROP POLICY IF EXISTS "public_read_published_products" ON products;
CREATE POLICY "public_read_published_products" ON products
  FOR SELECT TO anon
  USING (is_active = true AND COALESCE(publish_status, 'published') = 'published');

