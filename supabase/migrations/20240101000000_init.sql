CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

CREATE TABLE IF NOT EXISTS public.webhooks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id  UUID        NOT NULL,
  method       TEXT        NOT NULL CHECK (method IN ('GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS')),
  headers      JSONB       NOT NULL DEFAULT '{}',
  query_params JSONB       NOT NULL DEFAULT '{}',
  payload      JSONB,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_endpoint_received
  ON public.webhooks (endpoint_id, received_at DESC);

ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Anon key can read any endpoint's rows (endpoint UUID = access control)
CREATE POLICY "allow_anon_read" ON public.webhooks
  FOR SELECT TO anon USING (true);

-- Only service_role (server-side API route) can insert
CREATE POLICY "allow_service_role_insert" ON public.webhooks
  FOR INSERT TO service_role WITH CHECK (true);

-- pg_cron: delete payloads older than 24 hours, runs every hour
SELECT cron.schedule(
  'delete-old-webhooks',
  '0 * * * *',
  $$ DELETE FROM public.webhooks WHERE received_at < NOW() - INTERVAL '24 hours'; $$
);
