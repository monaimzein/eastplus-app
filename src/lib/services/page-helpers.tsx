// Re-usable factory for all 7 service pages.
// Each route's page.tsx imports this and supplies its ServiceKey.
import type { Metadata } from 'next'
import SiteShell from '@/components/SiteShell'
import ServiceDetail from '@/components/ServiceDetail'
import CTASection from '@/components/landing/CTASection'
import { getServiceContent } from '@/lib/services/content'
import { getServerLocale } from '@/lib/i18n/server'
import { buildServiceSchema, buildBreadcrumb, buildFaqSchema } from '@/lib/seo/serviceSchema'
import type { ServiceKey } from '@/lib/siteConfig'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eastplus.sa'

export async function buildServiceMetadata(key: ServiceKey): Promise<Metadata> {
  const locale = await getServerLocale()
  const content = getServiceContent(key)
  const url = `${SITE_URL}/services/${key}`
  return {
    title: `${content.metadata.title[locale]} — EAST PLUS`,
    description: content.metadata.description[locale],
    keywords: content.metadata.keywords[locale],
    alternates: { canonical: url },
    openGraph: {
      title: content.metadata.title[locale],
      description: content.metadata.description[locale],
      url,
      images: [{ url: content.hero.image }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metadata.title[locale],
      description: content.metadata.description[locale],
      images: [content.hero.image],
    },
  }
}

export default async function ServicePage({ serviceKey }: { serviceKey: ServiceKey }) {
  const locale = await getServerLocale()
  const content = getServiceContent(serviceKey)
  const serviceSchema = buildServiceSchema(content, locale)
  const breadcrumbSchema = buildBreadcrumb(content, locale)
  const faqSchema = buildFaqSchema(content, locale)

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ServiceDetail serviceKey={serviceKey} />
      <CTASection />
    </SiteShell>
  )
}
