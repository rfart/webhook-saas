import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createSSRServerClient } from '@/lib/supabase/ssr-server'
import type { WebhookRow } from '@/types'
import { EndpointHeader } from '@/components/dashboard/endpoint-header'
import { PayloadList } from '@/components/dashboard/payload-list'
import { HistoryGate } from '@/components/dashboard/history-gate'
import { UserMenu } from '@/components/auth/user-menu'
import { ShareButton } from '@/components/dashboard/share-button'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface Props {
  params: Promise<{ endpointId: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { endpointId } = await params

  if (!UUID_REGEX.test(endpointId)) {
    notFound()
  }

  // Check auth via SSR client (reads session cookie)
  const ssrClient = await createSSRServerClient()
  const { data: { user } } = await ssrClient.auth.getUser()
  const isAuthenticated = !!user

  // Fetch payloads — limit 1 for anon, 50 for auth
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('webhooks')
    .select('*')
    .eq('endpoint_id', endpointId)
    .order('received_at', { ascending: false })
    .limit(isAuthenticated ? 50 : 1)

  const initialPayloads = (data ?? []) as WebhookRow[]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const catchUrl = `${baseUrl}/api/catch/${endpointId}`

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <EndpointHeader catchUrl={catchUrl} endpointId={endpointId} />
          {isAuthenticated && (
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <ShareButton endpointId={endpointId} />
              <UserMenu user={user} />
            </div>
          )}
        </div>
        <div className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Received Requests
            </h2>
            {initialPayloads.length > 0 && (
              <span className="text-xs text-zinc-600">
                {isAuthenticated
                  ? `${initialPayloads.length} request(s) — last 24h`
                  : 'Showing most recent — sign in for full history'}
              </span>
            )}
          </div>
          <PayloadList
            endpointId={endpointId}
            initialPayloads={initialPayloads}
            catchUrl={catchUrl}
          />
          {!isAuthenticated && <HistoryGate endpointId={endpointId} />}
        </div>
      </div>
    </div>
  )
}
