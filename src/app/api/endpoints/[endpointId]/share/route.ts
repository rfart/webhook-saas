import { NextRequest, NextResponse } from 'next/server'
import { createSSRServerClient } from '@/lib/supabase/ssr-server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { BASE_PATH } from '@/lib/base-path'

interface Params {
  params: Promise<{ endpointId: string }>
}

export async function POST(request: NextRequest, { params }: Params) {
  const { endpointId } = await params

  // Require auth
  const ssrClient = await createSSRServerClient()
  const { data: { user } } = await ssrClient.auth.getUser()

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceClient = createServerSupabaseClient()

  // Get or create the lead row for the signed-in user
  const { data: lead } = await serviceClient
    .from('leads')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  // Get or create an endpoint record
  let { data: endpoint } = await serviceClient
    .from('endpoints')
    .select('id')
    .eq('id', endpointId)
    .single()

  if (!endpoint) {
    const { data: newEndpoint } = await serviceClient
      .from('endpoints')
      .insert({ id: endpointId, lead_id: lead.id })
      .select('id')
      .single()
    endpoint = newEndpoint
  }

  if (!endpoint) {
    return NextResponse.json({ error: 'Could not create endpoint record' }, { status: 500 })
  }

  // Get or create a share token for this endpoint + lead
  const { data: existing } = await serviceClient
    .from('endpoint_shares')
    .select('share_token')
    .eq('endpoint_id', endpointId)
    .eq('shared_by', lead.id)
    .single()

  if (existing) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin
    return NextResponse.json({ shareUrl: `${baseUrl}${BASE_PATH}/share/${existing.share_token}` })
  }

  const { data: share } = await serviceClient
    .from('endpoint_shares')
    .insert({ endpoint_id: endpointId, shared_by: lead.id })
    .select('share_token')
    .single()

  if (!share) {
    return NextResponse.json({ error: 'Could not create share' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin
  return NextResponse.json({ shareUrl: `${baseUrl}${BASE_PATH}/share/${share.share_token}` })
}
