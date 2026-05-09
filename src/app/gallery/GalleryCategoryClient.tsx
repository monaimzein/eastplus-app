'use client'

import SiteShell from '@/components/SiteShell'
import PageHero from '@/components/PageHero'
import GalleryGrid from '@/components/GalleryGrid'
import { useI18n } from '@/lib/i18n/I18nProvider'
import type { GALLERY_CATEGORIES } from '@/lib/siteConfig'

type CategoryKey = (typeof GALLERY_CATEGORIES)[number]['key']

export default function GalleryCategoryClient({
  categoryKey,
  images,
}: {
  categoryKey: CategoryKey
  images: string[]
}) {
  const { t } = useI18n()
  const title = t.gallery.categories[categoryKey]

  return (
    <SiteShell>
      <PageHero eyebrow={t.gallery.title} title={title} subtitle={t.gallery.subtitle} />
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {images.length ? (
            <GalleryGrid images={images} alt={title} />
          ) : (
            <div className="surface-card p-12 text-center text-[var(--fg-muted)]">
              {t.gallery.empty}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  )
}
