'use client'

import { useState } from 'react'

export function CodeBlock({ data }: { data: unknown }) {
  const [copied, setCopied] = useState(false)
  const text = JSON.stringify(data, null, 2)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-300 font-mono leading-relaxed">
        {text}
      </pre>
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded px-2 py-1 text-xs bg-zinc-700 text-zinc-300 opacity-0 group-hover:opacity-100 hover:bg-zinc-600 transition-all"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
