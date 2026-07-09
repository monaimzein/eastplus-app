'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { GALLERY_CATEGORIES } from '@/lib/siteConfig'

// Preview images per category — placed in /public/images/gallary/<folder>/cover.jpg
const COVER_FALLBACK = '/images/gallary/cover-fallback.jpg'

export default function GalleryPreviewSection() {
  const { t, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="relative section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow">— 05</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight text-balance">
              {t.gallery.title}
            </h2>
            <p className="mt-3 text-[var(--fg-muted)] max-w-xl">
              {t.gallery.subtitle}
            </p>
          </div>
          <Link href="/gallery" className="btn-outline self-start md:self-end">
            {t.common.viewAll}
            <Arrow size={15} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {GALLERY_CATEGORIES.slice(0, 3).map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Link
                href={cat.href}
                className="group img-frame block aspect-[4/5]"
              >
                <Image
                  src={`/images/gallary/${encodeURIComponent(cat.folder)}/cover.jpg`}
                  alt={t.gallery.categories[cat.key]}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    if (!target.src.endsWith(COVER_FALLBACK)) target.src = COVER_FALLBACK
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="text-[0.7rem] font-medium tabular-nums text-[var(--gold)] tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{t.gallery.categories[cat.key]}</h3>
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
                    <span className="block w-6 h-px bg-[var(--gold)] transition-all duration-500 group-hover:w-12" />
                    <span>{t.common.viewAll}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
