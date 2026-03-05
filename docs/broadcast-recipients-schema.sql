-- Table for tracking which subscribers received which broadcast
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS broadcast_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id UUID NOT NULL REFERENCES broadcasts(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES form_submissions(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(broadcast_id, submission_id)
);

CREATE INDEX IF NOT EXISTS idx_broadcast_recipients_broadcast_id ON broadcast_recipients(broadcast_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_recipients_submission_id ON broadcast_recipients(submission_id);

ALTER TABLE broadcast_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for broadcast_recipients" ON broadcast_recipients
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);
