'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { WebhookRow } from '@/types'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { RequestItem } from './request-item'
import { RequestDetail } from './request-detail'
import { EmptyState } from './empty-state'

interface PayloadListProps {
  endpointId: string
  initialPayloads: WebhookRow[]
  catchUrl: string
}

export function PayloadList({ endpointId, initialPayloads, catchUrl }: PayloadListProps) {
  const [payloads, setPayloads] = useState<WebhookRow[]>(initialPayloads)
  const [selectedId, setSelectedId] = useState<string | null>(initialPayloads[0]?.id ?? null)
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const supabase = useRef(createBrowserSupabaseClient())

  const addRow = useCallback((row: WebhookRow) => {
    setPayloads((prev) => {
      if (prev.some((p) => p.id === row.id)) return prev
      return [row, ...prev].slice(0, 50)
    })
    setSelectedId((prev) => prev ?? row.id)
    setNewIds((prev) => new Set(prev).add(row.id))
    setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev)
        next.delete(row.id)
        return next
      })
    }, 1600)
  }, [])

  // Realtime subscription
  useEffect(() => {
    const client = supabase.current
    const channel = client
      .channel(`webhooks:${endpointId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'webhooks',
          filter: `endpoint_id=eq.${endpointId}`,
        },
        (event) => addRow(event.new as WebhookRow)
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [endpointId, addRow])

  // Polling fallback every 5s
  useEffect(() => {
    const client = supabase.current

    async function poll() {
      const mostRecent = payloads[0]?.received_at
      let query = client
        .from('webhooks')
        .select('*')
        .eq('endpoint_id', endpointId)
        .order('received_at', { ascending: false })
        .limit(50)

      if (mostRecent) {
        query = query.gt('received_at', mostRecent)
      }

      const { data } = await query
      if (data) {
        for (const row of data as WebhookRow[]) {
          addRow(row)
        }
      }
    }

    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [endpointId, payloads, addRow])

  if (payloads.length === 0) {
    return <EmptyState catchUrl={catchUrl} />
  }

  const selected = payloads.find((p) => p.id === selectedId) ?? null

  return (
    <div className="flex h-[calc(100vh-120px)] border border-zinc-800 rounded-xl overflow-hidden">
      {/* Left panel — request list */}
      <div className="w-64 shrink-0 border-r border-zinc-800 overflow-y-auto flex flex-col bg-zinc-950">
        <div className="px-3 py-2.5 border-b border-zinc-800 shrink-0 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Requests</span>
          <span className="text-xs text-zinc-600 font-mono">{payloads.length}</span>
        </div>
        {payloads.map((p) => (
          <RequestItem
            key={p.id}
            payload={p}
            selected={p.id === selectedId}
            isNew={newIds.has(p.id)}
            onClick={() => setSelectedId(p.id)}
          />
        ))}
      </div>

      {/* Right panel — detail view */}
      <div className="flex-1 overflow-hidden bg-zinc-950">
        {selected ? (
          <RequestDetail payload={selected} catchUrl={catchUrl} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-zinc-600">
            Select a request to inspect
          </div>
        )}
      </div>
    </div>
  )
}
