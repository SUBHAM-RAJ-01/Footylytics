-- Create match_notifications table for storing user match notification preferences
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS match_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL,
  match_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, match_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_match_notifications_user_id ON match_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_match_notifications_match_id ON match_notifications(match_id);
CREATE INDEX IF NOT EXISTS idx_match_notifications_notified ON match_notifications(notified);

-- Enable Row Level Security
ALTER TABLE match_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
  ON match_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON match_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON match_notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON match_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON match_notifications TO authenticated;
GRANT ALL ON match_notifications TO service_role;

COMMENT ON TABLE match_notifications IS 'Stores user preferences for match notifications';
COMMENT ON COLUMN match_notifications.match_data IS 'JSON data containing match details (teams, time, competition, etc.)';
COMMENT ON COLUMN match_notifications.notified IS 'Whether the notification email has been sent';
