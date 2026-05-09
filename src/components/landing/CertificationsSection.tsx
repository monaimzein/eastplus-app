'use client'

import { motion } from 'framer-motion'
import { Award, ShieldCheck, BadgeCheck, FileBadge, HeartHandshake, Globe2 } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import SectionHeader from './SectionHeader'

const BADGES = [
  { icon: FileBadge, ar: 'سجل تجاري ساري', en: 'Active CR' },
  { icon: ShieldCheck, ar: 'تأمين شامل', en: 'Full insurance' },
  { icon: BadgeCheck, ar: 'فوترة ZATCA', en: 'ZATCA invoicing' },
  { icon: Award, ar: 'شهادات مطابقة', en: 'Compliance certs' },
  { icon: HeartHandshake, ar: 'شراكات موردين', en: 'Supplier partners' },
  { icon: Globe2, ar: 'تغطية كل المملكة', en: 'Saudi-wide coverage' },
]

export default function CertificationsSection() {
  const { t, locale } = useI18n()

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          num="11"
          title={t.certifications.title}
          subtitle={t.certifications.subtitle}
          align="center"
        />

        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BADGES.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)]/30 transition-colors"
            >
              <b.icon size={26} strokeWidth={1.4} className="text-[var(--gold)]" />
              <span className="text-[12px] font-medium text-[var(--fg-muted)] text-center leading-tight">
                {b[locale]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
