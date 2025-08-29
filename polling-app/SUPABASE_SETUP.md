# Supabase Setup Guide

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18+ required
3. **npm or yarn**: Package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key
5. Paste them in your `.env.local` file

### 4. Database Setup

Run the SQL commands from `database/schema.sql` in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Click **Run** to execute the commands

### 5. Authentication Setup

1. Go to **Authentication** → **Settings** in Supabase
2. Enable **Email confirmations** if you want email verification
3. Configure **Site URL** to match your development URL (e.g., `http://localhost:3000`)

## Testing the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/register` to test user registration
3. Navigate to `/auth/login` to test user login

## Troubleshooting

### Common Issues

1. **"Module not found" errors**: Run `npm install` to ensure all dependencies are installed
2. **Authentication errors**: Check your environment variables and Supabase project settings
3. **Database errors**: Ensure the schema has been created in Supabase

### Support

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
