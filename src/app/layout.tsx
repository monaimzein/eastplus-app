import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic, Inter } from 'next/font/google'
import Providers from '@/components/providers/Providers'
import Analytics from '@/components/Analytics'
import { SITE } from '@/lib/siteConfig'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eastplus.sa'

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EAST PLUS | إيست بلس — توريد مواد البناء والتشطيب',
    template: '%s | EAST PLUS',
  },
  description:
    'منصة إيست بلس لتوريد مواد البناء والسباكة والكهرباء والتشطيبات. احصل على عرض سعر خلال دقائق.',
  keywords:
    'مواد بناء, توريد, سباكة, كهرباء, تشطيبات, أدوات صحية, السعودية, مقاولات, صيانة, إنشاءات',
  alternates: {
    canonical: '/',
    languages: { 'ar-SA': '/', 'en-SA': '/?lang=en' },
  },
  openGraph: {
    title: 'EAST PLUS | إيست بلس',
    description: 'حلول توريد متكاملة وعروض أسعار خلال دقائق',
    url: SITE_URL,
    siteName: 'EAST PLUS',
    locale: 'ar_SA',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'EAST PLUS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EAST PLUS | إيست بلس',
    description: 'حلول توريد متكاملة وعروض أسعار خلال دقائق',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: '/favicon.ico' },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EAST PLUS',
  alternateName: 'إيست بلس للتجارة',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SA',
    addressLocality: 'Riyadh',
    addressRegion: 'Riyadh',
  },
  sameAs: [SITE.social.twitter, SITE.social.instagram, SITE.social.linkedin].filter(
    (u) => u && u !== '#',
  ),
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}#localbusiness`,
  name: 'EAST PLUS',
  image: `${SITE_URL}/logo.png`,
  url: SITE_URL,
  telephone: SITE.phone,
  email: SITE.email,
  priceRange: 'SAR',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SA',
    addressLocality: 'Riyadh',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 24.8322453, longitude: 46.6376881 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabic.variable} ${inter.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-arabic)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}