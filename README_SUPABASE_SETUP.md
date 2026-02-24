# Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).

2. Add environment variables to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   Find these in: Project Settings → API (use the "anon" "public" key).

3. Run the migration SQL in the Supabase SQL Editor (in order):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_profiles_and_shared_transactions.sql`

4. (Optional) Disable email confirmation for development:
   - Authentication → Providers → Email
   - Turn off "Confirm email"

## Quick test

After setup, run `npm run dev` and visit `/apps` — you'll be redirected to `/login` if not signed in.
