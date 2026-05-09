'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ImageIcon } from 'lucide-react'
import SiteShell from '@/components/SiteShell'
import PageHero from '@/components/PageHero'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { GALLERY_CATEGORIES } from '@/lib/siteConfig'

export default function GalleryClient({
  countsByKey,
}: {
  countsByKey: Record<string, number>
}) {
  const { t, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <SiteShell>
      <PageHero eyebrow={t.gallery.title} title={t.gallery.title} subtitle={t.gallery.subtitle} />

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {GALLERY_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={cat.href}
                className="group block surface-card overflow-hidden card-hover p-8 text-center"
              >
                <div className="mx-auto w-20 h-20 rounded-2xl gold-gradient flex items-center justify-center text-[#15151A] shadow-xl shadow-[var(--gold)]/30 group-hover:rotate-6 transition-transform">
                  <ImageIcon size={32} />
                </div>
                <h3 className="mt-5 text-2xl font-bold">{t.gallery.categories[cat.key]}</h3>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">
                  {countsByKey[cat.key] ?? 0} {' '}
                  {countsByKey[cat.key] === 1 ? (dir === 'rtl' ? 'صورة' : 'photo') : (dir === 'rtl' ? 'صور' : 'photos')}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gold)]">
                  {t.common.viewAll}
                  <Arrow size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}
