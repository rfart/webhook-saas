'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function GenerateButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/endpoints', { method: 'POST' })
      const { endpointId } = await res.json()
      router.push(`/${endpointId}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={generate}
      disabled={loading}
      className="text-base px-8 py-3 rounded-xl"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Generating…
        </>
      ) : (
        'Generate Endpoint'
      )}
    </Button>
  )
}
