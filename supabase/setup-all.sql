-- =============================================================================
-- VIMALA SILK HOUSE — FULL SUPABASE SETUP (paste entire file in SQL Editor)
-- =============================================================================
-- Order: schema → commerce → storefront columns → seed → owner → storage
-- After PART 5: create Auth user admin@vimalasilk.com in Supabase dashboard
-- =============================================================================

-- PART 1 — BASE SCHEMA

-- Vimala base schema (VRM + storefront)
-- Safe to re-run on existing project (IF NOT EXISTS + policy refresh)

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('owner', 'staff')) DEFAULT 'staff',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  banner_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  fabric TEXT,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  stock_status TEXT CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')) DEFAULT 'in_stock',
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  category_id UUID REFERENCES categories(id),
  collection_id UUID REFERENCES collections(id),
  occasion TEXT[],
  images TEXT[],
  thumbnail TEXT,
  care_instructions TEXT,
  weight_grams INTEGER,
  blouse_included BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  image_url TEXT NOT NULL,
  image_url_mobile TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  city TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  product_id UUID REFERENCES products(id),
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update products.updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe re-run)
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Profiles
CREATE POLICY "authenticated_read_profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_update_own_profile" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "owner_manage_profiles" ON profiles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));

-- Categories
CREATE POLICY "authenticated_read_categories" ON categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_categories" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "owner_delete_categories" ON categories FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));
CREATE POLICY "public_read_active_categories" ON categories FOR SELECT TO anon USING (is_active = true);

-- Collections
CREATE POLICY "authenticated_read_collections" ON collections FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_collections" ON collections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_collections" ON collections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "owner_delete_collections" ON collections FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));
CREATE POLICY "public_read_active_collections" ON collections FOR SELECT TO anon USING (is_active = true);

-- Products
CREATE POLICY "authenticated_read_products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "owner_delete_products" ON products FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));
CREATE POLICY "public_read_active_products" ON products FOR SELECT TO anon USING (is_active = true);

-- Banners
CREATE POLICY "authenticated_read_banners" ON banners FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_banners" ON banners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_banners" ON banners FOR UPDATE TO authenticated USING (true);
CREATE POLICY "owner_delete_banners" ON banners FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));
CREATE POLICY "public_read_active_banners" ON banners FOR SELECT TO anon USING (is_active = true);

-- Testimonials
CREATE POLICY "authenticated_read_testimonials" ON testimonials FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_testimonials" ON testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "owner_delete_testimonials" ON testimonials FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));
CREATE POLICY "public_read_active_testimonials" ON testimonials FOR SELECT TO anon USING (is_active = true);

-- Announcements
CREATE POLICY "authenticated_read_announcements" ON announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_insert_announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_update_announcements" ON announcements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "owner_delete_announcements" ON announcements FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));
CREATE POLICY "public_read_active_announcements" ON announcements FOR SELECT TO anon USING (is_active = true);

-- Site settings
CREATE POLICY "authenticated_read_settings" ON site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_upsert_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT TO anon USING (true);

-- Audit log
CREATE POLICY "authenticated_insert_audit" ON audit_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "owner_read_audit" ON audit_log FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'));

-- PART 2 — COMMERCE

-- Commerce schema — orders, payments, carts, coupons, etc.
-- Safe to re-run (IF NOT EXISTS)

-- Drop commerce policies before recreate (safe re-run)
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN (
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'customers','customer_addresses','orders','order_items','payments',
        'shipments','returns','coupons','notifications','analytics_events',
        'abandoned_cart_snapshots','customer_segments','campaigns'
      )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- Vimala Commerce Schema — run after schema.sql
-- Shopify-parity: orders, payments, shipping, inventory, returns, coupons, growth

-- Product extensions for inventory & tax
ALTER TABLE products ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reserved_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hsn_code TEXT DEFAULT '5208';
ALTER TABLE products ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(5,2) DEFAULT 5.00;
ALTER TABLE products ADD COLUMN IF NOT EXISTS publish_status TEXT
  CHECK (publish_status IN ('draft', 'published')) DEFAULT 'published';
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique ON products(sku) WHERE sku IS NOT NULL;

-- Storefront customers (guest + registered)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  full_name TEXT,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  segment TEXT DEFAULT 'regular',
  lifetime_value NUMERIC(12,2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  marketing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Kerala',
  pincode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'IN',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Server carts
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  session_token TEXT UNIQUE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'converted', 'abandoned', 'expired')),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (cart_id, product_id, size)
);

-- Checkout sessions
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  order_id UUID,
  customer_id UUID REFERENCES customers(id),
  email TEXT,
  phone TEXT,
  shipping_address JSONB,
  billing_address JSONB,
  shipping_method TEXT,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  coupon_id UUID,
  payment_method TEXT CHECK (payment_method IN ('razorpay', 'cod', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'complete', 'expired', 'cancelled')),
  idempotency_key TEXT UNIQUE,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 minutes'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  checkout_session_id UUID REFERENCES checkout_sessions(id),
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled'
    CHECK (fulfillment_status IN ('unfulfilled','partial','fulfilled','returned')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','authorized','paid','failed','refunded','partially_refunded')),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  gstin TEXT,
  invoice_number TEXT,
  cancelled_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  size TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  tax_rate NUMERIC(5,2) DEFAULT 5,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL,
  hsn_code TEXT
);

CREATE TABLE IF NOT EXISTS tax_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  rate NUMERIC(5,2) NOT NULL,
  amount NUMERIC(10,2) NOT NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_payment_id TEXT,
  provider_order_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','authorized','captured','failed','refunded')),
  method TEXT,
  failure_reason TEXT,
  metadata JSONB,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'shiprocket',
  awb TEXT,
  courier_name TEXT,
  tracking_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','label_created','picked_up','in_transit','delivered','rto','cancelled')),
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  weight_grams INTEGER,
  metadata JSONB,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  description TEXT,
  location TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory reservations
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status TEXT NOT NULL DEFAULT 'held'
    CHECK (status IN ('held','committed','released','expired')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Returns & refunds
CREATE TABLE IF NOT EXISTS returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  return_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested','approved','rejected','received','refunded','exchanged')),
  reason TEXT NOT NULL,
  restock BOOLEAN DEFAULT true,
  refund_amount NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS return_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  condition TEXT DEFAULT 'good'
);

-- Coupons / discounts
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('fixed','percent')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  per_customer_limit INTEGER DEFAULT 1,
  category_ids UUID[],
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  discount_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications queue
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('email','sms','whatsapp')),
  recipient TEXT NOT NULL,
  template TEXT NOT NULL,
  payload JSONB,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','sent','failed')),
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abandoned carts & growth
CREATE TABLE IF NOT EXISTS abandoned_cart_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id),
  email TEXT,
  phone TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  recovery_status TEXT DEFAULT 'open'
    CHECK (recovery_status IN ('open','email_sent','recovered','expired')),
  last_reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  rules JSONB NOT NULL DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment_id UUID REFERENCES customer_segments(id),
  channel TEXT NOT NULL CHECK (channel IN ('email','sms','whatsapp')),
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','scheduled','running','completed','cancelled')),
  scheduled_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  session_id TEXT,
  customer_id UUID REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Order number sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10001;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'VSH-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_return_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RET-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Staff full access via authenticated
CREATE POLICY "staff_all_customers" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_addresses" ON customer_addresses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_order_items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_payments" ON payments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_shipments" ON shipments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_returns" ON returns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_coupons" ON coupons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_read_notifications" ON notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff_read_analytics" ON analytics_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff_all_abandoned" ON abandoned_cart_snapshots FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_segments" ON customer_segments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "staff_all_campaigns" ON campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Service role bypasses RLS; storefront APIs use service role server-side


-- PART 3 — STOREFRONT CATALOG COLUMNS

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


-- PART 4 — SEED 24 PRODUCTS

-- Vimala storefront catalog seed (24 products) — idempotent
-- Run after 01-schema, 02-commerce, 03-storefront-catalog

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'Kanjivaram Pure Silk Saree',
  'kanjivaram-pure-silk-saree-bridal',
  'Handpicked Kanjivaram pure silk saree for weddings and bridal trousseaus, chosen for its rich drape and temple-worthy zari work.',
  'Kanjivaram',
  22500,
  NULL,
  'low_stock',
  true,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-SLK-001',
  500,
  2,
  0,
  'silks',
  'Bridal',
  NULL,
  'Only 2 pieces left',
  NULL,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  'published',
  true,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000002',
  'Banarasi Zari Bridal Saree',
  'banarasi-zari-bridal-saree',
  'Banarasi zari weave bridal saree with intricate brocade — a festive and wedding favourite from our Kattappana silk collection.',
  'Banarasi',
  18900,
  22000,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
  'VSH-SLK-002',
  500,
  25,
  0,
  'silks',
  'Bridal',
  NULL,
  'Selling fast this week',
  14,
  NULL,
  'published',
  true,
  2
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000003',
  'Kerala Kasavu Set',
  'kerala-kasavu-set-festive',
  'Classic Kerala Kasavu set in cotton silk — ideal for Onam, Vishu, and festive gatherings across Kerala and beyond.',
  'Cotton Silk',
  4800,
  NULL,
  'low_stock',
  true,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-SLK-003',
  500,
  3,
  0,
  'silks',
  'Festive',
  NULL,
  'Only 3 left in standard sizes',
  NULL,
  NULL,
  'published',
  true,
  3
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000004',
  'Embroidered Georgette Saree',
  'embroidered-georgette-saree-festive',
  'Lightweight embroidered georgette saree for festive evenings — easy to drape, photograph beautifully, and ship worldwide.',
  'Georgette',
  6800,
  NULL,
  'low_stock',
  false,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-WOM-004',
  500,
  3,
  0,
  'women',
  'Festive',
  ARRAY['S', 'M', 'L', 'XL'],
  'Only 3 left in this size',
  NULL,
  NULL,
  'published',
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000005',
  'Designer Anarkali Gown',
  'designer-anarkali-gown-party',
  'Designer Anarkali gown in net and silk — readymade party wear with the finish families expect from Vimala Silk House.',
  'Net & Silk',
  8900,
  NULL,
  'in_stock',
  true,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-RDY-005',
  500,
  25,
  0,
  'readymade',
  'Party Wear',
  ARRAY['S', 'M', 'L'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  5
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000006',
  'Printed Cotton Kurti',
  'printed-cotton-kurti-daily-wear',
  'Everyday printed cotton kurti — dependable readymade daily wear from our Kattappana family fashion floor.',
  'Cotton',
  1299,
  1799,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-RDY-006',
  500,
  25,
  0,
  'readymade',
  'Daily Wear',
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  NULL,
  28,
  NULL,
  'published',
  true,
  6
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000007',
  'Men''s Silk Shirt',
  'mens-silk-blend-formal-shirt',
  'Men''s silk blend formal shirt — smart readymade menswear for functions, office, and festive occasions.',
  'Silk Blend',
  2499,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'],
  'VSH-MEN-007',
  500,
  25,
  0,
  'men',
  'Formal',
  ARRAY['38', '40', '42', '44'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  7
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000008',
  'Men''s Dhoti Set',
  'mens-cotton-dhoti-set-traditional',
  'Traditional men''s cotton dhoti set — a staple for temple visits, weddings, and Kerala festive dressing.',
  'Cotton',
  1899,
  NULL,
  'in_stock',
  true,
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'],
  'VSH-MEN-008',
  500,
  25,
  0,
  'men',
  'Traditional',
  NULL,
  NULL,
  NULL,
  NULL,
  'published',
  true,
  8
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000009',
  'Kids Festive Lehenga',
  'kids-festive-lehenga-silk-blend',
  'Kids festive lehenga in silk blend — readymade children''s occasion wear for weddings and family celebrations.',
  'Silk Blend',
  3200,
  NULL,
  'low_stock',
  false,
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
  ARRAY['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'],
  'VSH-KID-009',
  500,
  4,
  0,
  'kids',
  'Festive',
  ARRAY['4-6Y', '6-8Y', '8-10Y'],
  'Only 4 left — festive sizes',
  NULL,
  NULL,
  'published',
  true,
  9
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000010',
  'Kids Casual Set',
  'kids-cotton-casual-set',
  'Comfortable kids cotton casual set — everyday readymade children''s wear from our family fashion department.',
  'Cotton',
  899,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
  ARRAY['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'],
  'VSH-KID-010',
  500,
  25,
  0,
  'kids',
  'Daily Wear',
  ARRAY['2-4Y', '4-6Y', '6-8Y'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  10
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000011',
  'Temple Jewelry Set',
  'temple-jewelry-set-gold-plated',
  'Temple jewelry set in gold-plated finish — curated to complete bridal and festive silk saree looks.',
  'Gold-plated',
  4500,
  NULL,
  'in_stock',
  true,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
  ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400'],
  'VSH-ACC-011',
  500,
  25,
  0,
  'accessories',
  'Jewelry',
  NULL,
  NULL,
  NULL,
  NULL,
  'published',
  true,
  11
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000012',
  'Kundan Earrings',
  'kundan-earrings-bridal',
  'Kundan earrings chosen to complement our silk and readymade lines — finishing touches for wedding and festive outfits.',
  'Kundan',
  1800,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
  ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400'],
  'VSH-ACC-012',
  500,
  25,
  0,
  'accessories',
  'Jewelry',
  NULL,
  NULL,
  NULL,
  NULL,
  'published',
  true,
  12
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000013',
  'Linen Summer Saree',
  'linen-summer-saree-kerala',
  'Breathable linen summer saree — light Kerala-friendly fabric for warm-weather festive and casual ethnic wear.',
  'Linen',
  3500,
  NULL,
  'in_stock',
  true,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-SUM-013',
  500,
  25,
  0,
  'summer',
  'Summer',
  NULL,
  NULL,
  NULL,
  NULL,
  'published',
  true,
  13
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000014',
  'Cotton Churidar Set',
  'cotton-churidar-set-summer',
  'Cotton churidar set for summer — readymade comfort wear in standard sizes, ideal for daily ethnic dressing.',
  'Cotton',
  2100,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-SUM-014',
  500,
  25,
  0,
  'summer',
  'Summer',
  ARRAY['S', 'M', 'L'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  14
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000015',
  'Stocklot Men''s Shirt',
  'stocklot-mens-cotton-shirt-clearance',
  'Value stocklot men''s cotton shirt — clearance readymade menswear at an accessible price point.',
  'Cotton',
  599,
  1299,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'],
  'VSH-STK-015',
  500,
  25,
  0,
  'stocklot',
  'Clearance',
  NULL,
  NULL,
  54,
  NULL,
  'published',
  true,
  15
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000016',
  'Stocklot Kurti Pack',
  'stocklot-kurti-pack-clearance',
  'Stocklot kurti pack — bundled readymade value picks from our clearance floor in Kattappana.',
  'Mixed',
  999,
  2499,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-STK-016',
  500,
  25,
  0,
  'stocklot',
  'Clearance',
  NULL,
  NULL,
  60,
  NULL,
  'published',
  true,
  16
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000017',
  'Chanderi Silk Saree',
  'chanderi-silk-saree-festive',
  'Chanderi silk saree with a refined festive drape — handpicked for Onam, weddings, and special occasions.',
  'Chanderi',
  7500,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
  'VSH-SLK-017',
  500,
  25,
  0,
  'silks',
  'Festive',
  NULL,
  'Selling fast this week',
  NULL,
  NULL,
  'published',
  true,
  17
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000018',
  'Office Wear Salwar Set',
  'office-wear-salwar-set-crepe',
  'Office wear salwar set in crepe — polished readymade ethnic workwear in standard sizes.',
  'Crepe',
  3200,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-WOM-018',
  500,
  25,
  0,
  'women',
  'Office Wear',
  ARRAY['S', 'M', 'L', 'XL'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  18
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000019',
  'Men''s Formal Trouser',
  'mens-formal-trouser-poly-wool',
  'Men''s formal trouser in poly wool blend — readymade menswear for office and function dressing.',
  'Poly Wool',
  1699,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'],
  'VSH-MEN-019',
  500,
  25,
  0,
  'men',
  'Formal',
  ARRAY['30', '32', '34', '36'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  19
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000020',
  'Bridal Silk Lehenga',
  'bridal-silk-lehenga-pure-silk',
  'Pure silk bridal lehenga — a statement wedding piece from our bridal silk collection, shipped with protective packaging.',
  'Pure Silk',
  35000,
  NULL,
  'low_stock',
  true,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
  'VSH-SLK-020',
  500,
  2,
  0,
  'silks',
  'Bridal',
  NULL,
  'Only 2 pieces left',
  NULL,
  NULL,
  'published',
  true,
  20
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000021',
  'Handbag — Ethnic',
  'ethnic-embroidered-handbag',
  'Ethnic embroidered handbag — lifestyle accessory curated to match sarees and festive readymade outfits.',
  'Embroidered',
  2200,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
  ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400'],
  'VSH-ACC-021',
  500,
  25,
  0,
  'accessories',
  'Bags',
  NULL,
  NULL,
  NULL,
  NULL,
  'published',
  true,
  21
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000022',
  'Palazzo Set',
  'rayon-palazzo-set-casual',
  'Rayon palazzo readymade set — relaxed casual ethnic wear for everyday family fashion shopping.',
  'Rayon',
  1899,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400'],
  'VSH-RDY-022',
  500,
  25,
  0,
  'readymade',
  'Casual',
  ARRAY['S', 'M', 'L'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  22
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000023',
  'Mysore Silk Saree',
  'mysore-silk-saree-premium',
  'Premium Mysore silk saree — soft lustre and classic drape from our curated Kerala silk sarees online collection.',
  'Mysore Silk',
  14200,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400'],
  'VSH-SLK-023',
  500,
  25,
  0,
  'silks',
  'Premium',
  NULL,
  NULL,
  NULL,
  NULL,
  'published',
  true,
  23
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  id, name, slug, description, fabric, price, original_price, stock_status,
  is_new, thumbnail, images, sku, weight_grams, inventory_quantity, reserved_quantity,
  department, category_label, sizes, scarcity_note, discount_percent, hover_image_url,
  publish_status, is_active, sort_order
) VALUES (
  'a0000000-0000-4000-8000-000000000024',
  'Kids School Uniform Set',
  'kids-school-uniform-cotton-set',
  'Kids cotton school uniform set — durable readymade children''s daily wear in standard age sizes.',
  'Cotton',
  750,
  NULL,
  'in_stock',
  false,
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
  ARRAY['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400'],
  'VSH-KID-024',
  500,
  25,
  0,
  'kids',
  'Daily Wear',
  ARRAY['4-6Y', '6-8Y', '8-10Y', '10-12Y'],
  NULL,
  NULL,
  NULL,
  'published',
  true,
  24
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_status = EXCLUDED.stock_status,
  is_new = EXCLUDED.is_new,
  thumbnail = EXCLUDED.thumbnail,
  images = EXCLUDED.images,
  sku = EXCLUDED.sku,
  inventory_quantity = EXCLUDED.inventory_quantity,
  department = EXCLUDED.department,
  category_label = EXCLUDED.category_label,
  sizes = EXCLUDED.sizes,
  scarcity_note = EXCLUDED.scarcity_note,
  discount_percent = EXCLUDED.discount_percent,
  hover_image_url = EXCLUDED.hover_image_url,
  publish_status = EXCLUDED.publish_status,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;


-- PART 5 — OWNER PROFILE (create Auth user first if not exists)

-- Run AFTER creating admin user in Supabase Auth dashboard
-- Suggested: admin@vimalasilk.com

-- Email: admin@vimalasilk.com  |  Password: vimalasilks@2026
-- =============================================================================

-- Create profile if trigger didn't fire (e.g. user created before schema)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  'Vimala Owner',
  'owner'
FROM auth.users u
WHERE u.email = 'admin@vimalasilk.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'owner',
  full_name = 'Vimala Owner',
  email = EXCLUDED.email;

-- PART 6 — STORAGE BUCKETS

-- Storage buckets for product/banner images

-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('banner-images', 'banner-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('category-images', 'category-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop old storage policies if re-running
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Public read for all 4 buckets
CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'product-images');
CREATE POLICY "public_read_banner_images" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'banner-images');
CREATE POLICY "public_read_category_images" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'category-images');
CREATE POLICY "public_read_avatars" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

-- Authenticated upload/update/delete for admin panel
CREATE POLICY "auth_upload_product_images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "auth_update_product_images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');
CREATE POLICY "auth_delete_product_images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "auth_upload_banner_images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'banner-images');
CREATE POLICY "auth_update_banner_images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'banner-images');
CREATE POLICY "auth_delete_banner_images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'banner-images');

CREATE POLICY "auth_upload_category_images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'category-images');
CREATE POLICY "auth_update_category_images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'category-images');
CREATE POLICY "auth_delete_category_images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'category-images');

CREATE POLICY "auth_upload_avatars" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "auth_update_avatars" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars');
CREATE POLICY "auth_delete_avatars" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars');

-- Done. Run: npm run commerce:check
