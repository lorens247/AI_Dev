-- Test Edit Operations for Polls
-- Run this in your Supabase SQL Editor to verify edit functionality works

-- Step 1: Check if you're authenticated
SELECT 'Auth Check:' as info, 
       CASE WHEN auth.uid() IS NOT NULL 
            THEN '✅ Authenticated as: ' || auth.uid() 
            ELSE '❌ Not authenticated' 
       END as status;

-- Step 2: Check if you have any polls to edit
SELECT 'Your Polls:' as info, 
       COUNT(*) as poll_count
FROM public.polls 
WHERE created_by = auth.uid();

-- Step 3: Test basic update operation
DO $$
DECLARE
  test_poll_id UUID;
  update_result TEXT;
BEGIN
  -- Get a poll you created
  SELECT id INTO test_poll_id 
  FROM public.polls 
  WHERE created_by = auth.uid() 
  LIMIT 1;
  
  IF test_poll_id IS NULL THEN
    RAISE NOTICE '❌ No polls found to test with. Create a poll first.';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Testing with poll ID: %', test_poll_id;
  
  -- Test update operation
  UPDATE public.polls 
  SET title = 'Test Update - ' || now()::text
  WHERE id = test_poll_id;
  
  IF FOUND THEN
    RAISE NOTICE '✅ Poll update successful';
    
    -- Revert the change
    UPDATE public.polls 
    SET title = 'Test Poll'
    WHERE id = test_poll_id;
    
    RAISE NOTICE '✅ Poll reverted to original title';
  ELSE
    RAISE NOTICE '❌ Poll update failed';
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Update test failed: %', SQLERRM;
END $$;

-- Step 4: Test poll options operations
DO $$
DECLARE
  test_poll_id UUID;
  test_option_id UUID;
BEGIN
  -- Get a poll you created
  SELECT id INTO test_poll_id 
  FROM public.polls 
  WHERE created_by = auth.uid() 
  LIMIT 1;
  
  IF test_poll_id IS NULL THEN
    RAISE NOTICE '❌ No polls found to test with. Create a poll first.';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Testing poll options with poll ID: %', test_poll_id;
  
  -- Test inserting a new option
  INSERT INTO public.poll_options (poll_id, text, order_index) VALUES
    (test_poll_id, 'Test Option - ' || now()::text, 999)
  RETURNING id INTO test_option_id;
  
  IF test_option_id IS NOT NULL THEN
    RAISE NOTICE '✅ Option insert successful: %', test_option_id;
    
    -- Test updating the option
    UPDATE public.poll_options 
    SET text = 'Updated Test Option'
    WHERE id = test_option_id;
    
    IF FOUND THEN
      RAISE NOTICE '✅ Option update successful';
    END IF;
    
    -- Test deleting the option
    DELETE FROM public.poll_options WHERE id = test_option_id;
    
    IF FOUND THEN
      RAISE NOTICE '✅ Option delete successful';
    END IF;
  ELSE
    RAISE NOTICE '❌ Option insert failed';
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '❌ Poll options test failed: %', SQLERRM;
END $$;

-- Step 5: Check RLS policies
SELECT 'RLS Policy Check:' as info,
       tablename,
       policyname,
       cmd,
       CASE WHEN qual IS NOT NULL THEN 'Has conditions' ELSE 'No conditions' END as has_conditions
FROM pg_policies 
WHERE tablename IN ('polls', 'poll_options')
ORDER BY tablename, policyname;

-- Step 6: Final status
SELECT '🎯 Edit Operations Test Complete!' as result;
