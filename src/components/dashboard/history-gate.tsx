import { SignInButton } from '@/components/auth/sign-in-button'

interface Props {
  endpointId: string
}

export function HistoryGate({ endpointId }: Props) {
  return (
    <div className="relative mt-4">
      {/* Blurred placeholder rows */}
      <div className="space-y-3 select-none pointer-events-none" aria-hidden="true">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="blur-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4 opacity-60"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-16 rounded bg-zinc-700" />
              <div className="h-3 w-24 rounded bg-zinc-700" />
            </div>
            <div className="h-3 w-full rounded bg-zinc-800" />
            <div className="h-3 w-3/4 rounded bg-zinc-800 mt-1" />
          </div>
        ))}
      </div>

      {/* CTA overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-zinc-950/80 backdrop-blur-sm">
        <p className="text-sm font-medium text-zinc-300">
          Sign in to view full history (up to 50 requests)
        </p>
        <SignInButton next={`/${endpointId}`} />
      </div>
    </div>
  )
}
