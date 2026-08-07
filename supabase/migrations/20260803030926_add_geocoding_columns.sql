/*
# Add geocoding columns to profiles

## Purpose
The onboarding flow now resolves birth place to coordinates via
geocoding. This migration adds the columns needed to store that
data so birth chart calculations can use real latitude/longitude.

## 1. Modified Tables

### profiles
- `latitude` (numeric, nullable) — geographic latitude in decimal degrees.
- `longitude` (numeric, nullable) — geographic longitude in decimal degrees.
- `timezone` (text, nullable) — IANA timezone name (e.g. "Asia/Kolkata").

All three columns are nullable because existing rows (created by the
auto-profile trigger) won't have these values until the user completes
onboarding. The columns are added with `IF NOT EXISTS` to be idempotent.

## 2. Security
No RLS policy changes — the existing profiles policies already allow
users to UPDATE their own row, which covers these new columns.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric,
  ADD COLUMN IF NOT EXISTS timezone text;
