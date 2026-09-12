export function EmptyState({ catchUrl }: { catchUrl: string }) {
  const curlExample = `curl -X POST ${catchUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"hello": "world"}'`

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 text-3xl">
        📡
      </div>
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">Waiting for requests…</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Send any HTTP request to your endpoint and it will appear here in real time.
        </p>
      </div>
      <div className="w-full max-w-xl text-left">
        <p className="text-xs text-zinc-500 mb-2 font-mono">Try it now:</p>
        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-300 font-mono leading-relaxed">
          {curlExample}
        </pre>
      </div>
    </div>
  )
}
