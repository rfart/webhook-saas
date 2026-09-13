'use client'

import { useState } from 'react'
import type { WebhookRow } from '@/types'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'

const SKIP_HEADERS = new Set([
  'host', 'connection', 'transfer-encoding', 'te',
  'upgrade', 'proxy-connection', 'keep-alive',
])

interface RequestDetailProps {
  payload: WebhookRow
  catchUrl: string
}

export function RequestDetail({ payload, catchUrl }: RequestDetailProps) {
  const [activeTab, setActiveTab] = useState<'body' | 'query'>('body')
  const [copiedHeaders, setCopiedHeaders] = useState(false)

  const date = new Date(payload.received_at)
  const fullDate = date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  const contentLength = payload.headers['content-length'] ?? payload.headers['Content-Length']
  const size = contentLength
    ? `${contentLength} bytes`
    : `${JSON.stringify(payload.payload ?? {}).length} bytes`

  const ip =
    payload.headers['x-real-ip'] ??
    payload.headers['x-forwarded-for']?.split(',')[0]?.trim() ??
    '—'

  const displayHeaders = Object.fromEntries(
    Object.entries(payload.headers).filter(([k]) => !SKIP_HEADERS.has(k.toLowerCase()))
  )

  async function copyAllHeaders() {
    const text = Object.entries(displayHeaders)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
    await navigator.clipboard.writeText(text)
    setCopiedHeaders(true)
    setTimeout(() => setCopiedHeaders(false), 2000)
  }

  const hasQuery = Object.keys(payload.query_params).length > 0

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
        <Badge method={payload.method} />
        <span className="text-sm text-zinc-400 font-mono truncate">{catchUrl}</span>
      </div>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-3 border-b border-zinc-800 text-xs text-zinc-500 font-mono shrink-0">
        <span className="text-zinc-300">{fullDate}</span>
        <span>ID: <span className="text-zinc-300">{payload.id}</span></span>
        <span>Size: <span className="text-zinc-300">{size}</span></span>
        <span>IP: <span className="text-zinc-300">{ip}</span></span>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Body / Query tabs */}
        <div className="flex flex-col flex-1 overflow-hidden border-r border-zinc-800">
          <div className="flex gap-0 border-b border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveTab('body')}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'body'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Body
            </button>
            <button
              onClick={() => setActiveTab('query')}
              className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'query'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Query
              {hasQuery && (
                <span className="ml-1.5 rounded-full bg-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-300">
                  {Object.keys(payload.query_params).length}
                </span>
              )}
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'body' ? (
              payload.payload !== null && Object.keys(payload.payload).length > 0 ? (
                <CodeBlock data={payload.payload} />
              ) : (
                <p className="text-xs text-zinc-600 italic">No body</p>
              )
            ) : hasQuery ? (
              <CodeBlock data={payload.query_params} />
            ) : (
              <p className="text-xs text-zinc-600 italic">No query parameters</p>
            )}
          </div>
        </div>

        {/* Right: Headers panel */}
        <div className="w-72 shrink-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 shrink-0">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
              Request Headers
            </span>
            <button
              onClick={copyAllHeaders}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copiedHeaders ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {Object.entries(displayHeaders).map(([key, value]) => (
              <div key={key} className="px-4 py-2 border-b border-zinc-800/50">
                <div className="text-[10px] text-zinc-500 font-mono truncate">{key}</div>
                <div className="text-xs text-zinc-300 font-mono break-all">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
