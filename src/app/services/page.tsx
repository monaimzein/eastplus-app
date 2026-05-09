'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2, ArrowLeft, ArrowRight,
} from 'lucide-react'
import SiteShell from '@/components/SiteShell'
import PageHero from '@/components/PageHero'
import CTASection from '@/components/landing/CTASection'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SERVICES } from '@/lib/siteConfig'

const ICONS = { Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2 } as const

export default function ServicesHub() {
  const { t, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <SiteShell>
      <PageHero eyebrow={t.services.title} title={t.services.title} subtitle={t.services.subtitle} />

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS]
            const data = t.services.items[s.key]
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={s.href}
                  className="group block surface-card overflow-hidden card-hover"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={data.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 start-4 w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-[#15151A] shadow-lg shadow-[var(--gold)]/30">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{data.title}</h3>
                    <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-2">{data.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gold)]">
                      {t.common.learnMore}
                      <Arrow size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      <CTASection />
    </SiteShell>
  )
}
