export interface LeadRow {
  id: string
  email: string
  captured_at: string
  source_action: string
}

export interface WebhookRow {
  id: string
  endpoint_id: string
  lead_id?: string | null
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  headers: Record<string, string>
  query_params: Record<string, string>
  payload: Record<string, unknown> | null
  received_at: string
}
