-- Simple Schema Fix for Poll Creation
-- Run this in your Supabase SQL Editor to fix the foreign key constraint issue

-- Step 1: Drop existing tables (this will remove any existing data)
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.poll_options CASCADE;
DROP TABLE IF EXISTS public.polls CASCADE;

-- Step 2: Recreate polls table with correct foreign key
CREATE TABLE public.polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- FIXED: Now references auth.users directly
  status poll_status DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Recreate poll options table
CREATE TABLE public.poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Recreate votes table
CREATE TABLE public.votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- FIXED: Now references auth.users directly
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Step 5: Create indexes
CREATE INDEX idx_polls_created_by ON public.polls(created_by);
CREATE INDEX idx_polls_status ON public.polls(status);
CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);

-- Step 6: Enable RLS
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
CREATE POLICY "Users can view all polls" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Users can create polls" ON public.polls FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own polls" ON public.polls FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own polls" ON public.polls FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Users can view all poll options" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Users can manage options for own polls" ON public.poll_options FOR ALL USING (
  EXISTS (SELECT 1 FROM public.polls WHERE polls.id = poll_options.poll_id AND polls.created_by = auth.uid())
);

CREATE POLICY "Users can view all votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can create own votes" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON public.votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Success message
SELECT '✅ Schema fix completed successfully! Poll creation should now work.' as result;
