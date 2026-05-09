import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://eastplus.sa'

const SERVICES = [
  'plumbing',
  'electrical',
  'construction',
  'sanitary',
  'insulation',
  'maintenance',
  'projects',
]
const GALLERY = ['construction', 'electrical', 'plumbing']

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticPaths = ['', '/about', '/services', '/gallery', '/blog', '/contact']
  const services = SERVICES.map((s) => `/services/${s}`)
  const gallery = GALLERY.map((g) => `/gallery/${g}`)

  return [...staticPaths, ...services, ...gallery].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/services') ? 0.8 : 0.6,
  }))
}
