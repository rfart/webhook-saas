ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_by_endpoint"
ON public.webhooks
FOR SELECT
USING (true);
