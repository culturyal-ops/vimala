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
