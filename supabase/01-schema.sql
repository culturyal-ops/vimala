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
