'use client'

import type { WebhookRow } from '@/types'
import { Badge } from '@/components/ui/badge'

function getContentTypeLabel(headers: Record<string, string>): string {
  const ct = headers['content-type'] ?? headers['Content-Type'] ?? ''
  if (ct.includes('application/json')) return 'JSON'
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) return 'FORM'
  if (ct.includes('text/')) return 'TEXT'
  if (ct) return 'OTHER'
  return ''
}

interface RequestItemProps {
  payload: WebhookRow
  selected: boolean
  isNew: boolean
  onClick: () => void
}

export function RequestItem({ payload, selected, isNew, onClick }: RequestItemProps) {
  const time = new Date(payload.received_at).toLocaleTimeString()
  const shortId = `#${payload.id.slice(0, 6).toUpperCase()}`
  const ctLabel = getContentTypeLabel(payload.headers)

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 border-b border-zinc-800 hover:bg-zinc-800/60 transition-colors ${
        selected ? 'bg-zinc-800' : ''
      } ${isNew ? 'ring-1 ring-inset ring-blue-500/50' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Badge method={payload.method} />
        <span className="text-xs text-zinc-500 font-mono">{shortId}</span>
        <span className="ml-auto text-xs font-mono text-emerald-400">200</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
        <span>{time}</span>
        {ctLabel && (
          <>
            <span className="text-zinc-700">·</span>
            <span>{ctLabel}</span>
          </>
        )}
      </div>
    </button>
  )
}
