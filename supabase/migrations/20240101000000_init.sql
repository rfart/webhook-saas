CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ─── Leads ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  captured_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_action TEXT        NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_email
  ON public.leads (email);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anon browser can submit an email (lead capture form)
CREATE POLICY "allow_anon_insert_leads" ON public.leads
  FOR INSERT TO anon WITH CHECK (true);

-- Only service_role reads leads (for email automation backend)
CREATE POLICY "allow_service_role_select_leads" ON public.leads
  FOR SELECT TO service_role USING (true);

-- ─── Webhooks ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.webhooks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id  UUID        NOT NULL,
  lead_id      UUID        REFERENCES public.leads(id) ON DELETE SET NULL,
  method       TEXT        NOT NULL CHECK (method IN ('GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS')),
  headers      JSONB       NOT NULL DEFAULT '{}',
  query_params JSONB       NOT NULL DEFAULT '{}',
  payload      JSONB,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_endpoint_received
  ON public.webhooks (endpoint_id, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhooks_lead_id
  ON public.webhooks (lead_id);

ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Anon key can read any endpoint's rows (endpoint UUID = access control)
CREATE POLICY "allow_anon_read_webhooks" ON public.webhooks
  FOR SELECT TO anon USING (true);

-- Only service_role (server-side API route) can insert
CREATE POLICY "allow_service_role_insert_webhooks" ON public.webhooks
  FOR INSERT TO service_role WITH CHECK (true);

-- ─── Cleanup ─────────────────────────────────────────────────────────────────

-- pg_cron: delete webhook payloads older than 24 hours (leads kept forever)
SELECT cron.schedule(
  'delete-old-webhooks',
  '0 * * * *',
  $$ DELETE FROM public.webhooks WHERE received_at < NOW() - INTERVAL '24 hours'; $$
);
