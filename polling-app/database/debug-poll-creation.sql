-- Debug Poll Creation Issues
-- Run this in your Supabase SQL Editor to diagnose problems

-- 1. Check if you're authenticated
SELECT auth.uid() as current_user_id;

-- 2. Check if your profile exists
SELECT * FROM public.profiles WHERE id = auth.uid();

-- 3. Check RLS policies on polls table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'polls';

-- 4. Test basic insert permission (this should work if RLS is set up correctly)
-- Note: This will only work if you're authenticated and have the right policies
INSERT INTO public.polls (id, title, description, status, created_by) VALUES
  (
    gen_random_uuid(),
    'Test Poll',
    'Test Description',
    'active',
    auth.uid()
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Check if the test poll was created
SELECT * FROM public.polls WHERE title = 'Test Poll';

-- 6. Clean up test data
DELETE FROM public.polls WHERE title = 'Test Poll';

-- 7. Check RLS is enabled on polls table
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'polls';

-- 8. Check if there are any blocking locks
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query
FROM pg_stat_activity 
WHERE state = 'active' 
AND query NOT LIKE '%pg_stat_activity%';

-- 9. Check table structure
\d public.polls

-- 10. Check foreign key constraints
SELECT
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
