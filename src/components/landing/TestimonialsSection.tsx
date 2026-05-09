'use client'

import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import SectionHeader from './SectionHeader'

const TESTIMONIALS = [
  {
    name: { ar: 'محمد العتيبي', en: 'Mohammed Al-Otaibi' },
    company: { ar: 'شركة المنشآت الذهبية للمقاولات', en: 'Golden Works Contracting' },
    role: { ar: 'مدير المشاريع', en: 'Project Manager' },
    quote: {
      ar: 'تعاملنا مع EAST PLUS في ثلاثة مشاريع كبرى، الالتزام بالجودة والمواعيد كان لافتاً. الفريق محترف وعروض الأسعار وصلتنا خلال دقائق.',
      en: 'We partnered with EAST PLUS on three major projects. Their commitment to quality and timelines was outstanding — quotes arrived in minutes.',
    },
    rating: 5,
  },
  {
    name: { ar: 'فهد القحطاني', en: 'Fahad Al-Qahtani' },
    company: { ar: 'مكتب البنيان الهندسي', en: 'Al-Bunyan Engineering Office' },
    role: { ar: 'مهندس استشاري', en: 'Consulting Engineer' },
    quote: {
      ar: 'مرونة عالية في التعامل، أسعار تنافسية، وجودة لا غبار عليها. لجنتنا الفنية اعتمدتهم كمورد رئيسي للمشاريع السكنية.',
      en: 'High flexibility, competitive pricing, and impeccable quality. Our technical team approved them as primary supplier for residential projects.',
    },
    rating: 5,
  },
  {
    name: { ar: 'سارة الحربي', en: 'Sara Al-Harbi' },
    company: { ar: 'مجموعة لينا العقارية', en: 'Lina Real Estate Group' },
    role: { ar: 'مديرة المشتريات', en: 'Procurement Director' },
    quote: {
      ar: 'الفوترة الإلكترونية، التتبع المباشر للطلبات، وتواصل ممتاز مع فريق الدعم. تجربة مختلفة عن أي مورد سابق.',
      en: 'E-invoicing, live order tracking, and excellent support communication. A different experience than any previous supplier.',
    },
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const { t, locale } = useI18n()

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          num="08"
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
        />

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((tst, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)]/30 transition-colors group"
            >
              <Quote
                className="absolute top-6 end-6 text-[var(--gold)]/15 group-hover:text-[var(--gold)]/30 transition-colors"
                size={42}
                strokeWidth={1.4}
              />

              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: tst.rating }).map((_, r) => (
                  <Star key={r} size={13} className="fill-[var(--gold)] text-[var(--gold)]" />
                ))}
              </div>

              <p className="text-[15px] leading-[1.85] text-[var(--fg)] mb-7 text-pretty">
                {tst.quote[locale]}
              </p>

              <div className="pt-5 border-t border-[var(--border)]">
                <div className="font-semibold text-[14px]">{tst.name[locale]}</div>
                <div className="text-[12px] text-[var(--fg-muted)] mt-0.5">
                  {tst.role[locale]} · {tst.company[locale]}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
