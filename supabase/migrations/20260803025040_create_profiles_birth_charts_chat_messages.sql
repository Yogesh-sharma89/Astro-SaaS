/*
# Create core schema: profiles, birth_charts, chat_messages

## Purpose
Sets up the three core tables for the Astralis astrology app, plus
Row Level Security policies and an auto-profile trigger.

## 1. New Tables

### profiles
- `id` (uuid, primary key) — references `auth.users(id)`, one row per user.
- `name` (text) — display name.
- `gender` (text) — user-selected gender.
- `birth_date` (date) — date of birth.
- `birth_time` (time) — time of birth (nullable if unknown).
- `birth_place` (text) — city/country of birth.
- `relationship_status` (text) — relationship status.
- `goals` (text[]) — multi-select goals.
- `interests` (text[]) — multi-select interests.
- `onboarding_completed` (boolean, default false) — whether onboarding is done.
- `created_at` (timestamptz, default now()).

### birth_charts
- `id` (uuid, primary key, default gen_random_uuid()).
- `user_id` (uuid, references profiles(id), not null) — owner of the chart.
- `chart_data` (jsonb, not null) — the full birth chart object.
- `generated_at` (timestamptz, default now()).

### chat_messages
- `id` (uuid, primary key, default gen_random_uuid()).
- `user_id` (uuid, references profiles(id), not null) — owner of the message.
- `role` (text, check role in ('user','assistant'), not null).
- `content` (text, not null) — message content.
- `created_at` (timestamptz, default now()).

## 2. Security — Row Level Security

All three tables have RLS enabled. Policies are owner-scoped: each
authenticated user can only SELECT, INSERT, UPDATE, and DELETE rows
where `user_id` (or `id` for profiles) matches `auth.uid()`. This
prevents users from reading or modifying other users' data.

### profiles (id = auth.uid())
- SELECT: user can read their own profile row.
- INSERT: user can insert their own profile row (id must = auth.uid()).
- UPDATE: user can update their own profile row.

### birth_charts (user_id = auth.uid())
- SELECT: user can read their own charts.
- INSERT: user can insert charts for themselves (user_id must = auth.uid()).
- UPDATE: user can update their own charts.
- DELETE: user can delete their own charts.

### chat_messages (user_id = auth.uid())
- SELECT: user can read their own messages.
- INSERT: user can insert messages for themselves.
- DELETE: user can delete their own messages.

## 3. Trigger — auto-create profile on signup

A trigger function `handle_new_user()` fires AFTER INSERT on
`auth.users` and inserts a matching row into `profiles` with
`onboarding_completed = false`. This avoids race conditions between
signup and profile creation — the profile row always exists by the
time the frontend queries for it.
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  gender text,
  birth_date date,
  birth_time time,
  birth_place text,
  relationship_status text,
  goals text[],
  interests text[],
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create birth_charts table
CREATE TABLE IF NOT EXISTS birth_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chart_data jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE birth_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- === profiles policies ===
-- Users can only access the row where id = their auth.uid()
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- === birth_charts policies ===
-- Users can only access charts where user_id = their auth.uid()
DROP POLICY IF EXISTS "birth_charts_select_own" ON birth_charts;
CREATE POLICY "birth_charts_select_own"
  ON birth_charts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "birth_charts_insert_own" ON birth_charts;
CREATE POLICY "birth_charts_insert_own"
  ON birth_charts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "birth_charts_update_own" ON birth_charts;
CREATE POLICY "birth_charts_update_own"
  ON birth_charts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "birth_charts_delete_own" ON birth_charts;
CREATE POLICY "birth_charts_delete_own"
  ON birth_charts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- === chat_messages policies ===
-- Users can only access messages where user_id = their auth.uid()
DROP POLICY IF EXISTS "chat_messages_select_own" ON chat_messages;
CREATE POLICY "chat_messages_select_own"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_messages_insert_own" ON chat_messages;
CREATE POLICY "chat_messages_insert_own"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_messages_delete_own" ON chat_messages;
CREATE POLICY "chat_messages_delete_own"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- === Trigger: auto-create profile on signup ===
-- Fires AFTER INSERT on auth.users, inserts a matching profiles row
-- with onboarding_completed = false. Prevents race conditions where
-- the frontend queries for a profile before it has been created.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, onboarding_completed)
  VALUES (NEW.id, false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_birth_charts_user_id ON birth_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
