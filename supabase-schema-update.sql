-- Migration to add unique constraint on email
-- Run this SQL in your Supabase SQL Editor to prevent duplicate emails

-- First, remove any duplicate emails (keep only the most recent one)
-- This is optional - only run if you want to clean up existing duplicates
-- DELETE FROM form_submissions
-- WHERE id NOT IN (
--   SELECT DISTINCT ON (email) id
--   FROM form_submissions
--   ORDER BY email, submitted_at DESC
-- );

-- Add unique constraint on email
-- This will prevent duplicate emails from being inserted
ALTER TABLE form_submissions
ADD CONSTRAINT unique_email UNIQUE (email);

-- If the above fails because duplicates already exist, first clean them up:
-- 1. Find duplicates:
-- SELECT email, COUNT(*) as count
-- FROM form_submissions
-- GROUP BY email
-- HAVING COUNT(*) > 1;

-- 2. Delete duplicates (keep the most recent):
-- DELETE FROM form_submissions
-- WHERE id IN (
--   SELECT id
--   FROM (
--     SELECT id,
--            ROW_NUMBER() OVER (PARTITION BY email ORDER BY submitted_at DESC) as rn
--     FROM form_submissions
--   ) t
--   WHERE t.rn > 1
-- );

-- 3. Then run the ALTER TABLE command above again








