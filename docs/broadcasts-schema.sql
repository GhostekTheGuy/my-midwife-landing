-- Table for manual broadcast emails
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  target_user_type TEXT CHECK (target_user_type IN ('patient', 'midwife')),  -- NULL = all
  target_city TEXT,  -- NULL = all cities
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for broadcasts" ON broadcasts
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);
