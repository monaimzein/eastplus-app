'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2,
  CheckCircle2, ArrowLeft, ArrowRight, FileText, Phone,
  AlertCircle, Sparkles, ChevronDown, Check, Star,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SERVICES, SITE, type ServiceKey } from '@/lib/siteConfig'
import { getServiceContent } from '@/lib/services/content'
import PageHero from '@/components/PageHero'

const ICONS = { Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2 } as const

export default function ServiceDetail({ serviceKey }: { serviceKey: ServiceKey }) {
  const { t, locale, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  const service = SERVICES.find((s) => s.key === serviceKey)!
  const content = getServiceContent(serviceKey)
  const Icon = ICONS[service.icon as keyof typeof ICONS]
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow[locale]}
        title={content.hero.title[locale]}
        subtitle={content.hero.subtitle[locale]}
        image={content.hero.image}
      >
        <Link href="/account/rfqs/new" className="btn-primary">
          <FileText size={16} />
          {t.common.requestQuote}
          <Arrow size={16} />
        </Link>
        <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-outline">
          <Phone size={16} />
          {t.common.whatsapp}
        </a>
      </PageHero>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden surface-card"
          >
            <Image src={content.hero.image} alt={content.hero.title[locale]} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
            <div className="absolute top-6 start-6 w-16 h-16 rounded-2xl flex items-center justify-center text-[var(--primary-fg)] shadow-xl shadow-[var(--gold)]/40" style={{ background: 'var(--gold)' }}>
              <Icon size={28} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">{content.hero.eyebrow[locale]}</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">{content.metadata.title[locale]}</h2>
            <p className="mt-4 text-[var(--fg-muted)] leading-relaxed">{content.intro[locale]}</p>
          </motion.div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-16 bg-[var(--bg-2)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="surface-card p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-xl font-bold">{locale === 'ar' ? 'تحديات تواجهها' : 'Challenges you face'}</h3>
            </div>
            <ul className="space-y-3">
              {content.problemSolution.problems[locale].map((p) => (
                <li key={p} className="flex items-start gap-3 text-[var(--fg-muted)]">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-bold">{locale === 'ar' ? 'حلول EAST PLUS' : 'EAST PLUS solutions'}</h3>
            </div>
            <ul className="space-y-3">
              {content.problemSolution.solutions[locale].map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check size={18} className="text-[var(--gold)] shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Materials grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="eyebrow">{locale === 'ar' ? 'الكتالوج' : 'Catalogue'}</span>
            <h3 className="mt-3 text-3xl md:text-4xl font-bold">{locale === 'ar' ? 'ما نوفّره لك' : 'What we supply'}</h3>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {content.materials.map((m) => (
              <div key={m.name.en} className="surface-card !rounded-xl px-4 py-4 card-hover">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[var(--gold)] shrink-0" />
                  <span className="text-sm font-semibold">{m.name[locale]}</span>
                </div>
                {m.brands && m.brands.length > 0 && (
                  <p className="mt-2 text-xs text-[var(--fg-muted)] ps-7">{m.brands.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-[var(--bg-2)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow">{locale === 'ar' ? 'كيف نعمل' : 'How we work'}</span>
            <h3 className="mt-3 text-3xl md:text-4xl font-bold">{locale === 'ar' ? 'خمس خطوات بسيطة' : 'Five simple steps'}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {content.process.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="surface-card p-6 relative"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--primary-fg)] font-bold text-sm" style={{ background: 'var(--gold)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h4 className="mt-4 font-bold">{step.title[locale]}</h4>
                <p className="mt-2 text-sm text-[var(--fg-muted)] leading-relaxed">{step.description[locale]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow">{locale === 'ar' ? 'الباقات' : 'Tiers'}</span>
            <h3 className="mt-3 text-3xl md:text-4xl font-bold">{locale === 'ar' ? 'اختر ما يناسب مشروعك' : 'Pick what fits your project'}</h3>
            <p className="mt-3 text-[var(--fg-muted)] max-w-2xl mx-auto">{locale === 'ar' ? 'كل الأسعار حسب الكمية والمواصفات. اطلب عرض سعر مخصصاً خلال دقائق.' : 'All pricing depends on volume and specs. Request a custom quote in minutes.'}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {content.pricingTiers.map((tier) => (
              <div
                key={tier.name.en}
                className={`surface-card p-7 relative ${tier.highlighted ? 'border-[var(--gold)] shadow-xl shadow-[var(--gold)]/10 lg:scale-[1.03]' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 text-[var(--primary-fg)]" style={{ background: 'var(--gold)' }}>
                    <Star size={12} fill="currentColor" />
                    {locale === 'ar' ? 'الأكثر طلباً' : 'Most popular'}
                  </div>
                )}
                <h4 className="text-xl font-bold">{tier.name[locale]}</h4>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">{tier.description[locale]}</p>
                <div className="mt-5 pb-5 border-b border-[var(--border)]">
                  <span className="text-2xl font-bold gold-text">{tier.priceLabel[locale]}</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {tier.features[locale].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/account/rfqs/new"
                  className={`mt-6 w-full justify-center ${tier.highlighted ? 'btn-primary' : 'btn-outline'}`}
                >
                  {t.common.requestQuote}
                  <Arrow size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[var(--bg-2)] border-y border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="eyebrow">{locale === 'ar' ? 'أسئلة شائعة' : 'FAQ'}</span>
            <h3 className="mt-3 text-3xl md:text-4xl font-bold">{locale === 'ar' ? 'إجابات لأكثر ما يُسأل' : 'Answers to common questions'}</h3>
          </div>
          <div className="space-y-3">
            {content.faq.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <div key={i} className="surface-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-start"
                  >
                    <span className="font-semibold">{f.q[locale]}</span>
                    <ChevronDown size={18} className={`text-[var(--gold)] transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[var(--fg-muted)] leading-relaxed">
                      {f.a[locale]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold">
              <span className="gold-text">{locale === 'ar' ? 'خدمات ذات صلة' : 'Related services'}</span>
            </h3>
            <Link href="/services" className="btn-ghost text-sm">
              {t.common.viewAll}
              <Arrow size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.related.map((rk) => {
              const s = SERVICES.find((x) => x.key === rk)!
              const rContent = getServiceContent(rk)
              const O = ICONS[s.icon as keyof typeof ICONS]
              return (
                <Link key={rk} href={s.href} className="group surface-card p-6 card-hover">
                  <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-[var(--primary-fg)] transition-colors">
                    <O size={22} />
                  </div>
                  <h4 className="mt-4 font-bold">{rContent.metadata.title[locale]}</h4>
                  <p className="mt-2 text-sm text-[var(--fg-muted)] line-clamp-2">
                    {rContent.metadata.description[locale]}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
