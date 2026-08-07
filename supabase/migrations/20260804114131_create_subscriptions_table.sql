/*
# Create subscriptions table for Razorpay payments

1. New Tables
- `subscriptions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `plan` (text, not null — 'free', 'pro', or 'premium')
  - `status` (text, not null — 'active', 'expired', 'cancelled')
  - `razorpay_order_id` (text, nullable)
  - `razorpay_payment_id` (text, nullable)
  - `razorpay_signature` (text, nullable)
  - `current_period_end` (timestamptz, nullable — when the current billing cycle ends)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `subscriptions`.
- Owner-scoped CRUD: each authenticated user can only access their own subscription.
- SELECT: users can read their own subscription
- INSERT: users can create their own subscription (user_id defaults to auth.uid())
- UPDATE: users can update their own subscription
- DELETE: users can delete their own subscription

3. Notes
- The `user_id` column defaults to `auth.uid()` so frontend inserts omitting
  user_id will still satisfy the INSERT policy.
- Razorpay payment IDs are stored for verification and audit trail.
- `current_period_end` tracks when the subscription expires.
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_subscriptions" ON subscriptions;
CREATE POLICY "select_own_subscriptions" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_subscriptions" ON subscriptions;
CREATE POLICY "insert_own_subscriptions" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_subscriptions" ON subscriptions;
CREATE POLICY "update_own_subscriptions" ON subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_subscriptions" ON subscriptions;
CREATE POLICY "delete_own_subscriptions" ON subscriptions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
