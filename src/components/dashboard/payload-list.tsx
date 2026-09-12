'use client'

import { useEffect, useRef, useState } from 'react'
import type { WebhookRow } from '@/types'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { PayloadCard } from './payload-card'
import { EmptyState } from './empty-state'

interface PayloadListProps {
  endpointId: string
  initialPayloads: WebhookRow[]
  catchUrl: string
}

export function PayloadList({ endpointId, initialPayloads, catchUrl }: PayloadListProps) {
  const [payloads, setPayloads] = useState<WebhookRow[]>(initialPayloads)
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const supabase = useRef(createBrowserSupabaseClient())

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
        (event) => {
          const row = event.new as WebhookRow
          setPayloads((prev) => [row, ...prev].slice(0, 50))
          setNewIds((prev) => new Set(prev).add(row.id))
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev)
              next.delete(row.id)
              return next
            })
          }, 1600)
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [endpointId])

  if (payloads.length === 0) {
    return <EmptyState catchUrl={catchUrl} />
  }

  return (
    <div className="flex flex-col gap-3">
      {payloads.map((p) => (
        <PayloadCard key={p.id} payload={p} highlighted={newIds.has(p.id)} />
      ))}
    </div>
  )
}
