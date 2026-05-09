'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { ShieldCheck, Zap, Award, Headphones, CalendarCheck, BadgeDollarSign } from 'lucide-react'
import SectionHeader from './SectionHeader'

const ICONS = [BadgeDollarSign, Zap, Award, ShieldCheck, CalendarCheck, Headphones]

export default function WhyUsSection() {
  const { t } = useI18n()

  return (
    <section className="relative section bg-[var(--bg-2)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader num="02" title={t.whyUs.title} subtitle={t.whyUs.subtitle} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {t.whyUs.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="group relative pt-8"
              >
                {/* Top hairline that grows on hover */}
                <span className="absolute top-0 inset-x-0 h-px bg-[var(--border-strong)]" />
                <span className="absolute top-0 start-0 h-px bg-[var(--gold)] w-0 group-hover:w-12 transition-[width] duration-500" />

                <div className="flex items-start gap-4">
                  <Icon size={22} strokeWidth={1.6} className="text-[var(--gold)] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-semibold text-[var(--fg)]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
