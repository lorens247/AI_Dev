-- Simple Poll Creation Test
-- Run this in your Supabase SQL Editor to test basic functionality

-- 1. Check if you're authenticated
SELECT 'Current user ID:' as info, auth.uid() as user_id;

-- 2. Check if your profile exists
SELECT 'Profile exists:' as info, 
       CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid()) 
            THEN 'YES' ELSE 'NO' END as result;

-- 3. If no profile exists, create one
INSERT INTO public.profiles (id, name, email) 
SELECT 
  auth.uid(),
  'Test User',
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid());

-- 4. Test basic poll creation (this should work if RLS is set up correctly)
DO $$
DECLARE
  test_poll_id UUID;
  test_option_id UUID;
BEGIN
  -- Create a test poll
  INSERT INTO public.polls (id, title, description, status, created_by) VALUES
    (
      gen_random_uuid(),
      'Test Poll - ' || now()::text,
      'Test Description',
      'active',
      auth.uid()
    ) RETURNING id INTO test_poll_id;
  
  RAISE NOTICE 'Test poll created with ID: %', test_poll_id;
  
  -- Create a test option
  INSERT INTO public.poll_options (id, poll_id, text, order_index) VALUES
    (
      gen_random_uuid(),
      test_poll_id,
      'Test Option 1',
      1
    ) RETURNING id INTO test_option_id;
  
  RAISE NOTICE 'Test option created with ID: %', test_option_id;
  
  -- Clean up test data
  DELETE FROM public.poll_options WHERE id = test_option_id;
  DELETE FROM public.polls WHERE id = test_poll_id;
  
  RAISE NOTICE 'Test completed successfully - poll creation works!';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Test failed with error: %', SQLERRM;
END $$;

-- 5. Check RLS policies on polls table
SELECT 'RLS Policies:' as info, 
       policyname, 
       cmd, 
       CASE WHEN qual IS NOT NULL THEN 'Has conditions' ELSE 'No conditions' END as has_conditions
FROM pg_policies 
WHERE tablename = 'polls';

-- 6. Check if RLS is enabled
SELECT 'RLS Status:' as info,
       schemaname,
       tablename,
       CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE tablename = 'polls';

-- 7. Check table permissions
SELECT 'Table Permissions:' as info,
       grantee,
       privilege_type,
       is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'polls';

-- 8. Check if there are any active locks
SELECT 'Active Locks:' as info,
       pid,
       usename,
       application_name,
       state,
       query_start,
       LEFT(query, 100) as query_preview
FROM pg_stat_activity 
WHERE state = 'active' 
AND query NOT LIKE '%pg_stat_activity%'
AND query NOT LIKE '%pg_stat_activity%'
ORDER BY query_start DESC;
