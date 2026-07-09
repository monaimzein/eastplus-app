import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

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
const GALLERY = [
  'construction',
  'electrical',
  'plumbing',
  'sanitary',
  'insulation',
  'maintenance',
  'projects',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPaths = ['', '/about', '/services', '/gallery', '/blog', '/contact']
  const services = SERVICES.map((s) => `/services/${s}`)
  const gallery = GALLERY.map((g) => `/gallery/${g}`)

  const baseRoutes = [...staticPaths, ...services, ...gallery].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: (path === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: path === '' ? 1 : path.startsWith('/services') ? 0.8 : 0.6,
  }))

  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('published', true)

      if (!error && posts) {
        blogRoutes = posts.map((post) => ({
          url: `${BASE}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      } else {
        console.error('Error fetching blog posts for sitemap:', error)
      }
    }
  } catch (err) {
    console.error('Failed to generate dynamic sitemap routes for blog posts:', err)
  }

  return [...baseRoutes, ...blogRoutes]
}

