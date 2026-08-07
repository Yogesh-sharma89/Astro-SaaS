/*
# Auto-confirm new user emails

## Purpose
Email confirmation is enabled on this Supabase project, which blocks
login with "email_not_confirmed". This trigger auto-confirms new signups
by setting email_confirmed_at on insert, so users can log in immediately
without receiving a confirmation email.

## Security
This is a SECURITY DEFINER function that runs on auth.users insert.
It only sets email_confirmed_at — no other fields are touched.
*/

CREATE OR REPLACE FUNCTION auto_confirm_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = auth, public
AS $$
BEGIN
  NEW.email_confirmed_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auto_confirm_user_email();
