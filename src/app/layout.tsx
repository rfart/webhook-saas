import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
const defaultTitle = 'WebhookCatcher — Free Webhook & HTTP Request Inspector'
const defaultDescription = 'Generate a unique URL, send any HTTP request to it, and watch payloads arrive live on your dashboard.'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s | WebhookCatcher',
    default: defaultTitle,
  },
  description: defaultDescription,
  openGraph: {
    type: 'website',
    siteName: 'WebhookCatcher',
    title: defaultTitle,
    description: defaultDescription,
    url: baseUrl,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WebhookCatcher — Free Webhook & HTTP Request Inspector' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/og-image.png'],
  },
  alternates: { canonical: baseUrl },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  )
}
