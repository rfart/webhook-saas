export interface LeadRow {
  id: string
  email: string
  name?: string
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

export interface EndpointRow {
  id: string
  lead_id?: string | null
  created_at: string
  label?: string | null
}

export interface EndpointShareRow {
  id: string
  endpoint_id: string
  shared_by?: string | null
  share_token: string
  created_at: string
}
