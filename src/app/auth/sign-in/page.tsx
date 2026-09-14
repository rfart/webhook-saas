import type { Metadata } from 'next'
import { SignInButton } from '@/components/auth/sign-in-button'

export const metadata: Metadata = { robots: { index: false, follow: false } }

interface Props {
  searchParams: Promise<{ next?: string }>
}

export default async function SignInPage({ searchParams }: Props) {
  const { next = '/' } = await searchParams

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-zinc-50">Sign in to continue</h1>
          <p className="text-sm text-zinc-400">View your full webhook history and share endpoints with your team.</p>
        </div>
        <SignInButton next={next} />
        <p className="text-xs text-zinc-600">
          By signing in you agree to our terms. Your email is captured to deliver your webhook history link.
        </p>
      </div>
    </main>
  )
}
