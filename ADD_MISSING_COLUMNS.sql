-- Add missing columns to profiles table
-- Run this in Supabase SQL Editor

-- Add stripe_session_id column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Add stripe_customer_id column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add stripe_subscription_id column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add subscription_end column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP WITH TIME ZONE;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
