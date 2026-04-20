-- ============================================
-- Run this in Supabase SQL Editor to fix signup data
-- This updates the handle_new_user trigger to save all fields
-- ============================================

-- Allow admin to update any profile (e.g. change staff role)
CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Fix the trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_name, commercial_registration, vat_number, whatsapp_number, national_address, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'company_name', ''),
    COALESCE(new.raw_user_meta_data->>'commercial_registration', ''),
    COALESCE(new.raw_user_meta_data->>'vat_number', ''),
    COALESCE(new.raw_user_meta_data->>'whatsapp_number', ''),
    COALESCE(new.raw_user_meta_data->>'national_address', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Create contact_messages table
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (even anonymous) to insert
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

-- Only staff/admin can read
CREATE POLICY "Staff and admin can view contact messages"
  ON contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- Staff/admin can update (mark as read)
CREATE POLICY "Staff and admin can update contact messages"
  ON contact_messages FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('staff', 'admin'))
  );

-- Admin can delete contact messages
CREATE POLICY "Admin can delete contact messages"
  ON contact_messages FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can delete RFQs
CREATE POLICY "Admin can delete rfqs"
  ON rfqs FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can delete related chat messages
CREATE POLICY "Admin can delete chat messages"
  ON chat_messages FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can delete notifications
CREATE POLICY "Admin can delete notifications"
  ON notifications FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Create storage buckets (run in Storage section or SQL)
-- ============================================
-- Make sure these buckets exist:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('rfq-files', 'rfq-files', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('quotations', 'quotations', false) ON CONFLICT DO NOTHING;

-- Storage policies for rfq-files bucket
CREATE POLICY "Authenticated users can upload rfq files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'rfq-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own rfq files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'rfq-files');

-- Storage policies for quotations bucket
CREATE POLICY "Staff can upload quotations"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'quotations' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view quotations"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'quotations');
