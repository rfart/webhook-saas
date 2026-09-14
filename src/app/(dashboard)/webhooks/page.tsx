import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { robots: { index: false, follow: false } }
import { createSSRServerClient } from '@/lib/supabase/ssr-server'
import { GenerateButton } from '@/app/(marketing)/generate-button'
import { UserMenu } from '@/components/auth/user-menu'

export default async function WebhooksPage() {
  const ssrClient = await createSSRServerClient()
  const { data: { user } } = await ssrClient.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in?next=/webhooks')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <span className="text-lg font-semibold text-zinc-100">My Endpoints</span>
          <UserMenu user={user} />
        </div>
        <div className="flex flex-col items-center justify-center gap-6 pt-24 text-center">
          <h2 className="text-2xl font-bold text-zinc-100">Generate a new endpoint</h2>
          <p className="text-zinc-400 text-sm max-w-sm">
            Create a unique URL to catch webhooks. Point any service at it and inspect
            every request in real time.
          </p>
          <GenerateButton />
        </div>
      </div>
    </div>
  )
}
