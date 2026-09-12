export interface WebhookRow {
  id: string
  endpoint_id: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  headers: Record<string, string>
  query_params: Record<string, string>
  payload: Record<string, unknown> | null
  received_at: string
}
