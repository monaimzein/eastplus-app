import type { ServiceContent } from '@/lib/services/content'
import type { Locale } from '@/lib/i18n/server'
import { SITE } from '@/lib/siteConfig'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eastplus.sa'

export function buildServiceSchema(content: ServiceContent, locale: Locale) {
  const url = `${SITE_URL}/services/${content.key}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: content.metadata.title[locale],
    description: content.metadata.description[locale],
    url,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE_URL,
      telephone: SITE.phone,
      email: SITE.email,
    },
    areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
    serviceType: content.metadata.title[locale],
  }
}

export function buildBreadcrumb(content: ServiceContent, locale: Locale) {
  const home = locale === 'ar' ? 'الرئيسية' : 'Home'
  const services = locale === 'ar' ? 'الخدمات' : 'Services'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: home, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: services, item: `${SITE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: content.metadata.title[locale], item: `${SITE_URL}/services/${content.key}` },
    ],
  }
}

export function buildFaqSchema(content: ServiceContent, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((f) => ({
      '@type': 'Question',
      name: f.q[locale],
      acceptedAnswer: { '@type': 'Answer', text: f.a[locale] },
    })),
  }
}
