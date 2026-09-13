'use client'

import { useState } from 'react'
import { BASE_PATH } from '@/lib/base-path'

interface Props {
  endpointId: string
}

export function ShareButton({ endpointId }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'copied'>('idle')

  async function handleShare() {
    setState('loading')
    try {
      const res = await fetch(`${BASE_PATH}/api/endpoints/${endpointId}/share`, { method: 'POST' })
      const json = await res.json()
      if (json.shareUrl) {
        await navigator.clipboard.writeText(json.shareUrl)
        setState('copied')
        setTimeout(() => setState('idle'), 2500)
      } else {
        setState('idle')
      }
    } catch {
      setState('idle')
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={state === 'loading'}
      className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
    >
      {state === 'copied' ? 'Link copied!' : state === 'loading' ? 'Generating…' : 'Share with Team'}
    </button>
  )
}
