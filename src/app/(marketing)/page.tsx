import type { Metadata } from 'next'
import { GenerateButton } from './generate-button'

export const metadata: Metadata = {
  title: 'WebhookCatcher — Free Webhook & HTTP Request Inspector',
  description: 'Instantly capture, inspect, and debug incoming HTTP webhooks. Free, zero-setup developer tool.',
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

const jsonLdApp = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WebhookCatcher',
  url: baseUrl,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  description: 'Instantly capture, inspect, and debug incoming HTTP webhooks. Free, zero-setup developer tool.',
  featureList: [
    'Real-time webhook capture',
    'Inspect HTTP headers and request body',
    'Share endpoint history with teammates',
    'Zero setup — no account required to start',
  ],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WebhookCatcher',
  url: baseUrl,
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <div className="max-w-2xl w-full text-center flex flex-col items-center gap-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Sign in with Google to unlock history
        </span>

        {/* Hero */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-50">
            Catch webhooks.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Instantly.
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl">
            Generate a unique URL, point any service at it, and watch every request arrive live in
            your browser. Sign in with Google to view full history and share with your team.
          </p>
        </div>

        {/* CTA */}
        <GenerateButton />

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 w-full mt-4 text-sm text-zinc-500">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">⚡</span>
            <span>Real-time</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">🔍</span>
            <span>Inspect headers &amp; body</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">🔐</span>
            <span>Google sign-in for history</span>
          </div>
        </div>
      </div>
    </main>
  )
}
