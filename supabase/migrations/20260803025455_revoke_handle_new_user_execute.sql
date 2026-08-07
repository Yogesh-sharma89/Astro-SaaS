/*
# Revoke execute on handle_new_user from anon and authenticated

## Purpose
The trigger function `handle_new_user()` is SECURITY DEFINER and was
callable by anon/authenticated roles via the REST RPC endpoint. It
should only be fired by the database trigger on auth.users insert,
never called directly by clients.

## Security Changes
1. REVOKE EXECUTE on `handle_new_user()` from `anon` and `authenticated`.
   This prevents direct API calls to the function while the trigger
   continues to work (triggers run with definer privileges regardless
   of caller role).
*/

REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM authenticated;
