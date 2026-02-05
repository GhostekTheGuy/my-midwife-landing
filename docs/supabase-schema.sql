-- Create table for form submissions
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'midwife')),
  email TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  privacy_consent BOOLEAN NOT NULL DEFAULT false,
  demo_testing BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups (unique constraint already creates an index)
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions(email);

-- Create index on submitted_at for sorting
CREATE INDEX IF NOT EXISTS idx_form_submissions_submitted_at ON form_submissions(submitted_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (form submissions)
CREATE POLICY "Allow public inserts" ON form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow reads only for authenticated users (optional - adjust as needed)
-- For now, we'll allow reads via service role key in API routes
-- If you want to allow public reads, uncomment the following:
-- CREATE POLICY "Allow public reads" ON form_submissions
--   FOR SELECT
--   TO anon, authenticated
--   USING (true);

