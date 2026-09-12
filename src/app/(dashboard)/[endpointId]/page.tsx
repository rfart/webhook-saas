import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { WebhookRow } from '@/types'
import { EndpointHeader } from '@/components/dashboard/endpoint-header'
import { PayloadList } from '@/components/dashboard/payload-list'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface Props {
  params: Promise<{ endpointId: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { endpointId } = await params

  if (!UUID_REGEX.test(endpointId)) {
    notFound()
  }

  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('webhooks')
    .select('*')
    .eq('endpoint_id', endpointId)
    .order('received_at', { ascending: false })
    .limit(50)

  const initialPayloads = (data ?? []) as WebhookRow[]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const catchUrl = `${baseUrl}/api/catch/${endpointId}`

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <EndpointHeader catchUrl={catchUrl} />
        <div className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Received Requests
            </h2>
            {initialPayloads.length > 0 && (
              <span className="text-xs text-zinc-600">{initialPayloads.length} request(s) — last 24h</span>
            )}
          </div>
          <PayloadList
            endpointId={endpointId}
            initialPayloads={initialPayloads}
            catchUrl={catchUrl}
          />
        </div>
      </div>
    </div>
  )
}
