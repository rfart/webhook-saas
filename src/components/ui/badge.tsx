import { clsx } from 'clsx'
import type { WebhookRow } from '@/types'

type Method = WebhookRow['method']

const colors: Record<Method, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  PUT: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  PATCH: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
  DELETE: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  HEAD: 'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/30',
  OPTIONS: 'bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/30',
}

export function Badge({ method }: { method: Method }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide font-mono',
        colors[method]
      )}
    >
      {method}
    </span>
  )
}
