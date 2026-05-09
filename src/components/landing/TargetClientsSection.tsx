'use client'

import { motion } from 'framer-motion'
import {
  Briefcase, Building2, Home, Pencil, Wrench, Landmark,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import SectionHeader from './SectionHeader'

const ICONS = [Briefcase, Building2, Home, Pencil, Wrench, Landmark]

export default function TargetClientsSection() {
  const { t } = useI18n()

  return (
    <section className="relative section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader num="07" title={t.targetClients.title} subtitle={t.targetClients.subtitle} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {t.targetClients.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.04, duration: 0.45 }}
                className="group bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors p-6 flex flex-col items-start gap-4"
              >
                <Icon size={20} strokeWidth={1.6} className="text-[var(--gold)]" />
                <div className="text-sm font-medium text-[var(--fg)]">{item}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
