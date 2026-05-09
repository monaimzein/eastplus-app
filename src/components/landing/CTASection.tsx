'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, FileDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SITE } from '@/lib/siteConfig'

export default function CTASection() {
  const { t, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="relative section">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)]"
        >
          {/* Quiet diagonal accent */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, var(--gold) 0 1px, transparent 1px 24px)',
            }}
          />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" />

          <div className="relative px-8 md:px-14 py-14 md:py-20">
            <div className="grid md:grid-cols-[1fr_auto] items-end gap-10">
              <div>
                <span className="eyebrow">— {t.quoteBanner.title}</span>
                <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-balance">
                  {t.cta.title}
                </h2>
                <p className="mt-4 text-[var(--fg-muted)] max-w-lg">
                  {t.cta.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/account/rfqs/new" className="btn-primary">
                  {t.cta.button}
                  <Arrow size={15} />
                </Link>
                <a
                  href={SITE.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <FileDown size={15} />
                  {t.common.profile}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
