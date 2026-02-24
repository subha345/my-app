-- Run this in Supabase SQL Editor after 001_initial_schema.sql

-- profiles: user display name for Splitease (used for "involved in transaction")
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unique display name for search (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_display_name_lower_idx 
  ON profiles (LOWER(display_name));

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles (for friend search suggestions)
CREATE POLICY "Profiles are readable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert/update only their own profile
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to SEE transactions where they are involved (read-only for others' transactions)
DROP POLICY IF EXISTS "Users can manage own transactions" ON splitease_transactions;

-- SELECT: own transactions + transactions where user is in paid_by or split_among
CREATE POLICY "Users can view own and involved transactions"
  ON splitease_transactions FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      (SELECT display_name FROM profiles WHERE user_id = auth.uid() LIMIT 1) IS NOT NULL
      AND (
        paid_by = (SELECT display_name FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        OR EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(split_among) AS elem
          WHERE elem = (SELECT display_name FROM profiles WHERE user_id = auth.uid() LIMIT 1)
        )
      )
    )
  );

-- INSERT, UPDATE, DELETE: only own transactions
CREATE POLICY "Users can manage own transactions"
  ON splitease_transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
