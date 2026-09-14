import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // UUID endpoint pages (e.g. /abc123-...) are protected via noindex metadata on the page itself
      disallow: ['/api/', '/auth/', '/webhooks', '/share/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/sitemap.xml`,
  }
}
