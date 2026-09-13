import { notFound, redirect } from 'next/navigation'
import { createSSRServerClient } from '@/lib/supabase/ssr-server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { WebhookRow } from '@/types'
import { BASE_PATH } from '@/lib/base-path'
import { EndpointHeader } from '@/components/dashboard/endpoint-header'
import { PayloadList } from '@/components/dashboard/payload-list'
import { UserMenu } from '@/components/auth/user-menu'

interface Props {
  params: Promise<{ token: string }>
}

export default async function SharePage({ params }: Props) {
  const { token } = await params

  // Require auth
  const ssrClient = await createSSRServerClient()
  const { data: { user } } = await ssrClient.auth.getUser()

  if (!user) {
    redirect(`${BASE_PATH}/auth/sign-in?next=${BASE_PATH}/share/${token}`)
  }

  // Look up share token
  const serviceClient = createServerSupabaseClient()
  const { data: share } = await serviceClient
    .from('endpoint_shares')
    .select('endpoint_id')
    .eq('share_token', token)
    .single()

  if (!share) {
    notFound()
  }

  const endpointId: string = share.endpoint_id
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const catchUrl = `${baseUrl}${BASE_PATH}/api/catch/${endpointId}`

  const { data } = await serviceClient
    .from('webhooks')
    .select('*')
    .eq('endpoint_id', endpointId)
    .order('received_at', { ascending: false })
    .limit(50)

  const payloads = (data ?? []) as WebhookRow[]

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <EndpointHeader catchUrl={catchUrl} endpointId={endpointId} />
          <div className="shrink-0 ml-4">
            <UserMenu user={user} />
          </div>
        </div>
        <div className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
              Received Requests
            </h2>
            <span className="text-xs text-zinc-600">{payloads.length} request(s) — shared view</span>
          </div>
          <PayloadList endpointId={endpointId} initialPayloads={payloads} catchUrl={catchUrl} />
        </div>
      </div>
    </div>
  )
}
