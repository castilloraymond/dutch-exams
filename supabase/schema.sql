-- Supabase Schema for Dutch Inburgering Prep App
-- Run this in your Supabase SQL Editor to set up the database

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  progress_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_email ON user_progress(email);

-- Row Level Security (RLS)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (simple MVP)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all access" ON user_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Subscribers Table (for landing page email capture)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- RLS for subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anonymous users (for landing page signup)
CREATE POLICY "Allow insert access" ON subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow read access (for checking duplicates server-side)
CREATE POLICY "Allow read access" ON subscribers
  FOR SELECT
  USING (true);
