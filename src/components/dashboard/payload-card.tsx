'use client'

import { useState } from 'react'
import type { WebhookRow } from '@/types'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'

export function PayloadCard({
  payload,
  highlighted,
}: {
  payload: WebhookRow
  highlighted: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const time = new Date(payload.received_at).toLocaleTimeString()
  const date = new Date(payload.received_at).toLocaleDateString()

  return (
    <div
      className={`rounded-xl border border-zinc-800 overflow-hidden transition-colors ${
        highlighted ? 'animate-highlight' : ''
      }`}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 transition-colors text-left"
      >
        <Badge method={payload.method} />
        <span className="text-xs text-zinc-400 font-mono">
          {date} {time}
        </span>
        <span className="ml-auto text-zinc-600 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="divide-y divide-zinc-800">
          {/* Headers */}
          {Object.keys(payload.headers).length > 0 && (
            <section className="px-4 py-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Headers
              </p>
              <CodeBlock data={payload.headers} />
            </section>
          )}

          {/* Query params */}
          {Object.keys(payload.query_params).length > 0 && (
            <section className="px-4 py-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Query Params
              </p>
              <CodeBlock data={payload.query_params} />
            </section>
          )}

          {/* Body */}
          <section className="px-4 py-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Body
            </p>
            <CodeBlock data={payload.payload ?? {}} />
          </section>
        </div>
      )}
    </div>
  )
}
