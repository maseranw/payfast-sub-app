/*
  Restrict subscription writes and support pause/resume
  -------------------------------------------------------
  1. Replace the authenticated INSERT policy on subscriptions so a user can
     only ever insert their own row in 'pending' status (the row created
     before redirecting to PayFast). Without this, WITH CHECK (auth.uid() =
     user_id) alone let a signed-in user insert or update a row with any
     status, including 'active', bypassing PayFast entirely.
  2. Remove the authenticated UPDATE policy on subscriptions entirely.
     Legitimate status transitions (pending -> active, pause, resume,
     cancel) are all written by payfast-subscribe-api using the Supabase
     service role key, which bypasses RLS, so no authenticated UPDATE
     policy is required for the app to keep working.
  3. Add 'paused' to the allowed subscription statuses so pause/resume can
     be represented.
  4. Add a function to clean up subscription rows left in 'pending' status
     when a checkout is abandoned before the PayFast webhook ever fires.
*/

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;

CREATE POLICY "Users can insert own pending subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_status_check'
  ) THEN
    ALTER TABLE subscriptions
      ADD CONSTRAINT subscriptions_status_check
      CHECK (status IN ('pending', 'active', 'paused', 'cancelled'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION cleanup_stale_pending_subscriptions()
RETURNS void AS $$
BEGIN
  DELETE FROM subscriptions
  WHERE status = 'pending'
    AND created_at < now() - interval '1 hour';
END;
$$ language 'plpgsql';
