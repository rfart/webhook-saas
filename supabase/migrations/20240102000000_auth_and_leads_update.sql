-- Add name column to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name TEXT;

-- Create endpoints table
CREATE TABLE IF NOT EXISTS endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  label TEXT
);

ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;

-- anon and authenticated can insert endpoints
CREATE POLICY "anon_insert_endpoints" ON endpoints
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "auth_insert_endpoints" ON endpoints
  FOR INSERT TO authenticated WITH CHECK (true);

-- service_role has full access
CREATE POLICY "service_role_all_endpoints" ON endpoints
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create endpoint_shares table
CREATE TABLE IF NOT EXISTS endpoint_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES leads(id) ON DELETE SET NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'base64url'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE endpoint_shares ENABLE ROW LEVEL SECURITY;

-- service_role has full access
CREATE POLICY "service_role_all_shares" ON endpoint_shares
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- owner can select their shares
CREATE POLICY "owner_select_shares" ON endpoint_shares
  FOR SELECT TO authenticated
  USING (shared_by = (SELECT id FROM leads WHERE email = auth.email() LIMIT 1));
