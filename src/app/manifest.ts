import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WebhookCatcher',
    short_name: 'WebhookCatcher',
    description: 'Instantly capture, inspect, and debug incoming HTTP webhooks. Free, zero-setup developer tool.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      { src: '/og-image.png', sizes: '1200x630', type: 'image/png' },
    ],
  }
}
