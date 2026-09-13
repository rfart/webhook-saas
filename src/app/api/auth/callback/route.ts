import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { BASE_PATH } from '@/lib/base-path'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const error = searchParams.get('error')
  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin}/`)
  }

  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') ?? '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('://')
    ? rawNext
    : '/'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin

  if (!code) {
    return NextResponse.redirect(`${baseUrl}${next}`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !sessionData.user) {
    return NextResponse.redirect(`${baseUrl}${BASE_PATH}/auth/sign-in`)
  }

  const { user } = sessionData
  const email = user.email ?? ''
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''

  // Upsert lead using service_role client (bypasses RLS)
  const serviceClient = createServerSupabaseClient()
  await serviceClient.from('leads').upsert(
    { email, name, source_action: 'google_oauth' },
    { onConflict: 'email', ignoreDuplicates: false }
  )

  return NextResponse.redirect(`${baseUrl}${next}`)
}
