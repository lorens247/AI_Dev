-- Fix Foreign Key Constraint Issue
-- Run this in your Supabase SQL Editor to fix the created_by constraint

-- First, check current foreign key constraints
SELECT 
  tc.constraint_name,
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='polls';

-- Drop the problematic foreign key constraint
ALTER TABLE public.polls DROP CONSTRAINT IF EXISTS polls_created_by_fkey;

-- Add the correct foreign key constraint
ALTER TABLE public.polls 
ADD CONSTRAINT polls_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Also fix the votes table foreign key
ALTER TABLE public.votes DROP CONSTRAINT IF EXISTS votes_user_id_fkey;

ALTER TABLE public.votes 
ADD CONSTRAINT votes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Verify the fix
SELECT 
  tc.constraint_name,
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('polls', 'votes');

-- Test the fix by checking if you can now create a poll
-- (This will work if you're authenticated in the app, not necessarily in SQL Editor)
SELECT '✅ Foreign key constraints fixed successfully!' as result;
