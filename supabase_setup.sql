-- 1. Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  category VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: Ensure that RLS is disabled (UNRESTRICTED) on the `purchases` table as requested
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;

-- 2. Create Storage Bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Setup public access policies for the product-images bucket
-- (In Supabase, if RLS is enabled on storage.objects, we need policies to allow public access/uploads. 
-- Since the user said RLS is unrestricted, we still need basic storage policies if it's handled via storage.objects)

CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

CREATE POLICY "Allow Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' );

CREATE POLICY "Allow Updates" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'product-images' );

CREATE POLICY "Allow Deletes" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'product-images' );
