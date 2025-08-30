-- Sample Data for Polling App
-- Run this in your Supabase SQL Editor after running the schema.sql

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample user profiles
INSERT INTO public.profiles (id, name, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Smith', 'john@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Johnson', 'sarah@example.com'),
  ('33333333-3333-3333-3333-333333333333', 'Mike Wilson', 'mike@example.com'),
  ('44444444-4444-4444-4444-444444444444', 'Emily Davis', 'emily@example.com'),
  ('55555555-5555-5555-5555-555555555555', 'Alex Brown', 'alex@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample polls
INSERT INTO public.polls (id, title, description, status, expires_at, created_by) VALUES
  (
    'poll-1111-1111-1111-1111-111111111111',
    'What is your favorite programming language?',
    'Choose the programming language you enjoy working with the most for web development.',
    'active',
    (NOW() + INTERVAL '30 days'),
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'poll-2222-2222-2222-2222-222222222222',
    'Best pizza topping combination',
    'Vote for your favorite pizza topping combination. Be creative!',
    'active',
    (NOW() + INTERVAL '14 days'),
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'poll-3333-3333-3333-3333-333333333333',
    'Preferred work environment',
    'What type of work environment do you prefer for maximum productivity?',
    'active',
    (NOW() + INTERVAL '60 days'),
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'poll-4444-4444-4444-4444-444444444444',
    'Favorite movie genre',
    'Select your preferred movie genre for weekend entertainment.',
    'closed',
    (NOW() - INTERVAL '5 days'),
    '44444444-4444-4444-4444-444444444444'
  ),
  (
    'poll-5555-5555-5555-5555-555555555555',
    'Best coffee brewing method',
    'What is your preferred method for brewing coffee at home?',
    'draft',
    NULL,
    '55555555-5555-5555-5555-555555555555'
  ),
  (
    'poll-6666-6666-6666-6666-666666666666',
    'Preferred travel destination',
    'Where would you like to travel next for your vacation?',
    'active',
    (NOW() + INTERVAL '45 days'),
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'poll-7777-7777-7777-7777-777777777777',
    'Best social media platform',
    'Which social media platform do you find most useful for professional networking?',
    'active',
    (NOW() + INTERVAL '20 days'),
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'poll-8888-8888-8888-8888-888888888888',
    'Favorite season of the year',
    'What is your favorite season and why?',
    'active',
    (NOW() + INTERVAL '90 days'),
    '33333333-3333-3333-3333-333333333333'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "What is your favorite programming language?"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-1111-1111-1111-1111-111111111111', 'poll-1111-1111-1111-1111-111111111111', 'JavaScript/TypeScript'),
  ('opt-1111-1111-1111-1111-111111111112', 'poll-1111-1111-1111-1111-111111111111', 'Python'),
  ('opt-1111-1111-1111-1111-111111111113', 'poll-1111-1111-1111-1111-111111111111', 'Java'),
  ('opt-1111-1111-1111-1111-111111111114', 'poll-1111-1111-1111-1111-111111111111', 'C#'),
  ('opt-1111-1111-1111-1111-111111111115', 'poll-1111-1111-1111-1111-111111111111', 'Go'),
  ('opt-1111-1111-1111-1111-111111111116', 'poll-1111-1111-1111-1111-111111111111', 'Rust')
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "Best pizza topping combination"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-2222-2222-2222-2222-222222222221', 'poll-2222-2222-2222-2222-222222222222', 'Pepperoni + Mushroom'),
  ('opt-2222-2222-2222-2222-222222222222', 'poll-2222-2222-2222-2222-222222222222', 'Margherita (Basil + Mozzarella)'),
  ('opt-2222-2222-2222-2222-222222222223', 'poll-2222-2222-2222-2222-222222222222', 'BBQ Chicken + Onion'),
  ('opt-2222-2222-2222-2222-222222222224', 'poll-2222-2222-2222-2222-222222222222', 'Hawaiian (Ham + Pineapple)'),
  ('opt-2222-2222-2222-2222-222222222225', 'poll-2222-2222-2222-2222-222222222222', 'Supreme (Everything)')
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "Preferred work environment"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-3333-3333-3333-3333-333333333331', 'poll-3333-3333-3333-3333-333333333333', 'Remote work from home'),
  ('opt-3333-3333-3333-3333-333333333332', 'poll-3333-3333-3333-3333-333333333333', 'Office with private space'),
  ('opt-3333-3333-3333-3333-333333333333', 'poll-3333-3333-3333-3333-333333333333', 'Open office with team'),
  ('opt-3333-3333-3333-3333-333333333334', 'poll-3333-3333-3333-3333-333333333333', 'Co-working space'),
  ('opt-3333-3333-3333-3333-333333333335', 'poll-3333-3333-3333-3333-333333333333', 'Hybrid (mix of remote/office)')
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "Favorite movie genre"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-4444-4444-4444-4444-444444444441', 'poll-4444-4444-4444-4444-444444444444', 'Action/Adventure'),
  ('opt-4444-4444-4444-4444-444444444442', 'poll-4444-4444-4444-4444-444444444444', 'Comedy'),
  ('opt-4444-4444-4444-4444-444444444443', 'poll-4444-4444-4444-4444-444444444444', 'Drama'),
  ('opt-4444-4444-4444-4444-444444444444', 'poll-4444-4444-4444-4444-444444444444', 'Sci-Fi/Fantasy'),
  ('opt-4444-4444-4444-4444-444444444445', 'poll-4444-4444-4444-4444-444444444444', 'Thriller/Horror')
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "Best coffee brewing method"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-5555-5555-5555-5555-555555555551', 'poll-5555-5555-5555-5555-555555555555', 'Pour-over'),
  ('opt-5555-5555-5555-5555-555555555552', 'poll-5555-5555-5555-5555-555555555555', 'French Press'),
  ('opt-5555-5555-5555-5555-555555555553', 'poll-5555-5555-5555-5555-555555555555', 'Espresso Machine'),
  ('opt-5555-5555-5555-5555-555555555554', 'poll-5555-5555-5555-5555-555555555555', 'Drip Coffee Maker'),
  ('opt-5555-5555-5555-5555-555555555555', 'poll-5555-5555-5555-5555-555555555555', 'AeroPress')
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "Preferred travel destination"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-6666-6666-6666-6666-666666666661', 'poll-6666-6666-6666-6666-666666666666', 'Beach resort'),
  ('opt-6666-6666-6666-6666-666666666662', 'poll-6666-6666-6666-6666-666666666666', 'Mountain cabin'),
  ('opt-6666-6666-6666-6666-666666666663', 'poll-6666-6666-6666-6666-666666666666', 'City exploration'),
  ('opt-6666-6666-6666-6666-666666666664', 'poll-6666-6666-6666-6666-666666666666', 'Cultural heritage sites'),
  ('opt-6666-6666-6666-6666-666666666665', 'poll-6666-6666-6666-6666-666666666666', 'Adventure/Outdoor activities')
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "Best social media platform"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-7777-7777-7777-7777-777777777771', 'poll-7777-7777-7777-7777-777777777777', 'LinkedIn'),
  ('opt-7777-7777-7777-7777-777777777772', 'poll-7777-7777-7777-7777-777777777777', 'Twitter/X'),
  ('opt-7777-7777-7777-7777-777777777773', 'poll-7777-7777-7777-7777-777777777777', 'GitHub'),
  ('opt-7777-7777-7777-7777-777777777774', 'poll-7777-7777-7777-7777-777777777777', 'Reddit'),
  ('opt-7777-7777-7777-7777-777777777775', 'poll-7777-7777-7777-7777-777777777777', 'Discord')
ON CONFLICT (id) DO NOTHING;

-- Insert poll options for "Favorite season of the year"
INSERT INTO public.poll_options (id, poll_id, text) VALUES
  ('opt-8888-8888-8888-8888-888888888881', 'poll-8888-8888-8888-8888-888888888888', 'Spring - New beginnings and flowers'),
  ('opt-8888-8888-8888-8888-888888888882', 'poll-8888-8888-8888-8888-888888888888', 'Summer - Warm weather and vacations'),
  ('opt-8888-8888-8888-8888-888888888883', 'poll-8888-8888-8888-8888-888888888888', 'Fall/Autumn - Beautiful colors and cozy vibes'),
  ('opt-8888-8888-8888-8888-888888888884', 'poll-8888-8888-8888-8888-888888888888', 'Winter - Snow and holiday spirit')
ON CONFLICT (id) DO NOTHING;

-- Insert sample votes for "What is your favorite programming language?"
INSERT INTO public.votes (id, poll_id, option_id, user_id) VALUES
  ('vote-1111-1111-1111-1111-111111111111', 'poll-1111-1111-1111-1111-111111111111', 'opt-1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('vote-1111-1111-1111-1111-111111111112', 'poll-1111-1111-1111-1111-111111111111', 'opt-1111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222'),
  ('vote-1111-1111-1111-1111-111111111113', 'poll-1111-1111-1111-1111-111111111111', 'opt-1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('vote-1111-1111-1111-1111-111111111114', 'poll-1111-1111-1111-1111-111111111111', 'opt-1111-1111-1111-1111-111111111113', '44444444-4444-4444-4444-444444444444'),
  ('vote-1111-1111-1111-1111-111111111115', 'poll-1111-1111-1111-1111-111111111111', 'opt-1111-1111-1111-1111-111111111114', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Insert sample votes for "Best pizza topping combination"
INSERT INTO public.votes (id, poll_id, option_id, user_id) VALUES
  ('vote-2222-2222-2222-2222-222222222221', 'poll-2222-2222-2222-2222-222222222222', 'opt-2222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111'),
  ('vote-2222-2222-2222-2222-222222222222', 'poll-2222-2222-2222-2222-222222222222', 'opt-2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'),
  ('vote-2222-2222-2222-2222-222222222223', 'poll-2222-2222-2222-2222-222222222222', 'opt-2222-2222-2222-2222-222222222223', '44444444-4444-4444-4444-444444444444'),
  ('vote-2222-2222-2222-2222-222222222224', 'poll-2222-2222-2222-2222-222222222222', 'opt-2222-2222-2222-2222-222222222224', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Insert sample votes for "Preferred work environment"
INSERT INTO public.votes (id, poll_id, option_id, user_id) VALUES
  ('vote-3333-3333-3333-3333-333333333331', 'poll-3333-3333-3333-3333-333333333333', 'opt-3333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111'),
  ('vote-3333-3333-3333-3333-333333333332', 'poll-3333-3333-3333-3333-333333333333', 'opt-3333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222'),
  ('vote-3333-3333-3333-3333-333333333333', 'poll-3333-3333-3333-3333-333333333333', 'opt-3333-3333-3333-3333-333333333335', '44444444-4444-4444-4444-444444444444'),
  ('vote-3333-3333-3333-3333-333333333334', 'poll-3333-3333-3333-3333-333333333333', 'opt-3333-3333-3333-3333-333333333331', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Insert sample votes for "Favorite movie genre" (closed poll)
INSERT INTO public.votes (id, poll_id, option_id, user_id) VALUES
  ('vote-4444-4444-4444-4444-444444444441', 'poll-4444-4444-4444-4444-444444444444', 'opt-4444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111'),
  ('vote-4444-4444-4444-4444-444444444442', 'poll-4444-4444-4444-4444-444444444444', 'opt-4444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222'),
  ('vote-4444-4444-4444-4444-444444444443', 'poll-4444-4444-4444-4444-444444444444', 'opt-4444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333'),
  ('vote-4444-4444-4444-4444-444444444444', 'poll-4444-4444-4444-4444-444444444444', 'opt-4444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444'),
  ('vote-4444-4444-4444-4444-444444444445', 'poll-4444-4444-4444-4444-444444444444', 'opt-4444-4444-4444-4444-444444444445', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Insert sample votes for "Preferred travel destination"
INSERT INTO public.votes (id, poll_id, option_id, user_id) VALUES
  ('vote-6666-6666-6666-6666-666666666661', 'poll-6666-6666-6666-6666-666666666666', 'opt-6666-6666-6666-6666-666666666661', '22222222-2222-2222-2222-222222222222'),
  ('vote-6666-6666-6666-6666-666666666662', 'poll-6666-6666-6666-6666-666666666666', 'opt-6666-6666-6666-6666-666666666662', '33333333-3333-3333-3333-333333333333'),
  ('vote-6666-6666-6666-6666-666666666663', 'poll-6666-6666-6666-6666-666666666666', 'opt-6666-6666-6666-6666-666666666663', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Insert sample votes for "Best social media platform"
INSERT INTO public.votes (id, poll_id, option_id, user_id) VALUES
  ('vote-7777-7777-7777-7777-777777777771', 'poll-7777-7777-7777-7777-777777777777', 'opt-7777-7777-7777-7777-777777777771', '11111111-1111-1111-1111-111111111111'),
  ('vote-7777-7777-7777-7777-777777777772', 'poll-7777-7777-7777-7777-777777777777', 'opt-7777-7777-7777-7777-777777777772', '33333333-3333-3333-3333-333333333333'),
  ('vote-7777-7777-7777-7777-777777777773', 'poll-7777-7777-7777-7777-777777777777', 'opt-7777-7777-7777-7777-777777777773', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Insert sample votes for "Favorite season of the year"
INSERT INTO public.votes (id, poll_id, option_id, user_id) VALUES
  ('vote-8888-8888-8888-8888-888888888881', 'poll-8888-8888-8888-8888-888888888888', 'opt-8888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111'),
  ('vote-8888-8888-8888-8888-888888888882', 'poll-8888-8888-8888-8888-888888888888', 'opt-8888-8888-8888-8888-888888888882', '22222222-2222-2222-2222-222222222222'),
  ('vote-8888-8888-8888-8888-888888888883', 'poll-8888-8888-8888-8888-888888888888', 'opt-8888-8888-8888-8888-888888888883', '44444444-4444-4444-4444-444444444444'),
  ('vote-8888-8888-8888-8888-888888888884', 'poll-8888-8888-8888-8888-888888888888', 'opt-8888-8888-8888-8888-888888888884', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Verify the data was inserted correctly
SELECT 
  'Profiles' as table_name,
  COUNT(*) as record_count
FROM public.profiles
UNION ALL
SELECT 
  'Polls' as table_name,
  COUNT(*) as record_count
FROM public.polls
UNION ALL
SELECT 
  'Poll Options' as table_name,
  COUNT(*) as record_count
FROM public.poll_options
UNION ALL
SELECT 
  'Votes' as table_name,
  COUNT(*) as record_count
FROM public.votes;

-- Show sample poll with results
SELECT 
  p.title,
  p.status,
  po.text as option_text,
  COUNT(v.id) as vote_count,
  ROUND(
    COUNT(v.id) * 100.0 / (
      SELECT COUNT(*) 
      FROM public.votes v2 
      WHERE v2.poll_id = p.id
    ), 1
  ) as percentage
FROM public.polls p
JOIN public.poll_options po ON p.id = po.poll_id
LEFT JOIN public.votes v ON po.id = v.option_id
WHERE p.id = 'poll-1111-1111-1111-1111-111111111111'
GROUP BY p.id, p.title, p.status, po.id, po.text
ORDER BY vote_count DESC;
