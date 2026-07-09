'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2, ArrowLeft, ArrowRight,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SERVICES } from '@/lib/siteConfig'

const ICONS = {
  Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2,
} as const

export default function ServicesGrid() {
  const { t, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  return (
    <section id="services" className="relative section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow">— 01</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight text-balance">
              {t.services.title}
            </h2>
          </div>
          <p className="md:text-end text-[var(--fg-muted)] max-w-md">
            {t.services.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS]
            const data = t.services.items[s.key]
            const isProjects = s.key === 'projects'

            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                className={`group relative flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-[-4px] hover:border-[color-mix(in_srgb,var(--gold)_30%,transparent)] hover:shadow-[0_12px_32px_-12px_rgba(212,184,124,0.12)] ${
                  isProjects ? 'lg:col-span-3' : ''
                }`}
              >
                <Link
                  href={s.href}
                  className={`flex flex-col h-full w-full ${
                    isProjects ? 'lg:flex-row' : ''
                  }`}
                >
                  {/* Image Section */}
                  <div
                    className={`relative overflow-hidden ${
                      isProjects ? 'aspect-[16/10] lg:aspect-auto lg:w-[45%] w-full lg:self-stretch' : 'aspect-[16/10] w-full'
                    }`}
                  >
                    <Image
                      src={s.image}
                      alt={data.title}
                      fill
                      sizes={isProjects ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-105"
                    />
                    {/* Subtle vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    
                    {/* Floating Icon badge */}
                    <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10 w-10 h-10 rounded-full flex items-center justify-center glass border border-[color-mix(in_srgb,var(--gold)_20%,transparent)] text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-[var(--primary-fg)] group-hover:scale-105 transition-all duration-300`}>
                      <Icon size={18} strokeWidth={1.6} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div
                    className={`p-6 lg:p-7 flex flex-col flex-grow justify-between ${
                      isProjects ? 'lg:w-[55%] lg:p-10 lg:justify-center' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--gold)] font-medium text-xs tracking-widest uppercase">
                          — {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-[var(--fg)] group-hover:text-[var(--gold)] transition-colors duration-300">
                        {data.title}
                      </h3>
                      
                      <p className="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed line-clamp-3">
                        {data.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)] group-hover:text-[var(--gold)] transition-all duration-300 uppercase tracking-wider">
                        {t.common.learnMore}
                        <Arrow
                          size={12}
                          className="transition-transform duration-300 group-hover:translate-x-[-3px] rtl:group-hover:translate-x-[3px]"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
