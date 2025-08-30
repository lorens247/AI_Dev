-- Fix User Profile Script
-- Run this in your Supabase SQL Editor to create a profile for your current user

-- First, check if you have any existing profiles
SELECT * FROM public.profiles;

-- Check your current auth user ID (you'll need to get this from your app)
-- You can find this in your browser's developer tools or by logging it in your app
-- Look for the user ID in the auth context or localStorage

-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from Supabase auth
-- You can find this by running: SELECT auth.uid() as current_user_id;

-- Create a profile for your user (replace with your actual user ID)
INSERT INTO public.profiles (id, name, email) VALUES
  (
    'YOUR_USER_ID_HERE', -- Replace this with your actual user ID
    'Your Name',          -- Replace with your name
    'your.email@example.com' -- Replace with your email
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- Verify the profile was created
SELECT * FROM public.profiles WHERE id = 'YOUR_USER_ID_HERE';

-- Alternative: Create profile using auth.uid() if you're running this as the authenticated user
-- INSERT INTO public.profiles (id, name, email) VALUES
--   (
--     auth.uid(),
--     'Your Name',
--     (SELECT email FROM auth.users WHERE id = auth.uid())
--   )
-- ON CONFLICT (id) DO UPDATE SET
--   name = EXCLUDED.name,
--   email = EXCLUDED.email;
