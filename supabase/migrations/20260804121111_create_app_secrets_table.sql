/*
# Create app_secrets table for storing API credentials

1. New Tables
- `app_secrets`
  - `id` (uuid, primary key)
  - `key` (text, unique, not null — the secret name e.g. 'RAZORPAY_KEY_ID')
  - `value` (text, not null — the secret value)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `app_secrets`.
- NO policies created — only the service role (used by edge functions) can access this table.
- The anon and authenticated roles cannot read or write to this table.

3. Notes
- This table stores API credentials that edge functions need at runtime.
- The service role key bypasses RLS, so edge functions can read secrets.
- Frontend clients (anon/authenticated) cannot access this table.
*/

CREATE TABLE IF NOT EXISTS app_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;
