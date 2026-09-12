import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const runtime = 'edge'

const SKIP_HEADERS = new Set([
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-vercel-id',
  'x-vercel-proxied-for',
  'x-vercel-deployment-url',
  'x-vercel-forwarded-for',
  'x-vercel-ip-city',
  'x-vercel-ip-country',
  'x-vercel-ip-country-region',
  'x-vercel-ip-latitude',
  'x-vercel-ip-longitude',
  'x-vercel-ip-timezone',
])

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  const { endpointId } = await params

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(endpointId)) {
    return NextResponse.json({ error: 'Invalid endpoint ID' }, { status: 400 })
  }

  // Collect headers (skip Vercel internals)
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      headers[key] = value
    }
  })

  // Collect query params
  const query_params: Record<string, string> = {}
  req.nextUrl.searchParams.forEach((value, key) => {
    query_params[key] = value
  })

  // Parse body
  let payload: Record<string, unknown> | null = null
  const contentType = req.headers.get('content-type') ?? ''

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      if (contentType.includes('application/json')) {
        payload = await req.json()
      } else if (
        contentType.includes('application/x-www-form-urlencoded') ||
        contentType.includes('multipart/form-data')
      ) {
        const formData = await req.formData()
        payload = Object.fromEntries(formData.entries()) as Record<string, unknown>
      } else {
        const text = await req.text()
        if (text) payload = { raw: text }
      }
    } catch {
      payload = null
    }
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('webhooks').insert({
    endpoint_id: endpointId,
    method: req.method,
    headers,
    query_params,
    payload,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, endpointId, method: req.method })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
export const HEAD = handler
export const OPTIONS = handler
