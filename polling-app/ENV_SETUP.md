# Environment Variables Setup

## 🚨 CRITICAL: Missing Environment Variables

Your app cannot connect to Supabase because the `.env.local` file is missing!

## 🔧 How to Fix:

### Step 1: Create `.env.local` file
Create a file named `.env.local` in your `polling-app` directory with this content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Get Your Supabase Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Restart Your App
After creating `.env.local`, restart your development server:
```bash
npm run dev
```

## ❌ Without This File:
- ❌ App cannot connect to Supabase
- ❌ Poll creation will always fail
- ❌ Authentication won't work
- ❌ Database operations will timeout

## ✅ After Adding This File:
- ✅ App can connect to Supabase
- ✅ Authentication will work
- ✅ Poll creation should work (after schema fix)
- ✅ All database operations will function
