'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, Target, Heart, Zap, Shield, Users, BadgeCheck } from 'lucide-react'
import SiteShell from '@/components/SiteShell'
import PageHero from '@/components/PageHero'
import StatsSection from '@/components/landing/StatsSection'
import CTASection from '@/components/landing/CTASection'
import TargetClientsSection from '@/components/landing/TargetClientsSection'
import { useI18n } from '@/lib/i18n/I18nProvider'

const VALUE_ICONS = [BadgeCheck, Heart, Zap, Shield, Users]

export default function AboutPage() {
  const { t } = useI18n()

  return (
    <SiteShell>
      <PageHero
        eyebrow={t.about.hero.eyebrow}
        title={t.about.hero.title}
        subtitle={t.about.hero.subtitle}
        image="/images/about/about-hero.jpg"
      />

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden surface-card"
          >
            <Image src="/images/about/about-team.jpg" alt="" fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="eyebrow">EAST PLUS</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">{t.about.hero.title}</h2>
            <p className="mt-5 text-[var(--fg-muted)] leading-relaxed text-lg">{t.about.story}</p>
          </motion.div>
        </div>
      </section>

      <StatsSection />

      {/* Vision & Mission */}
      <section id="vision" className="py-20 bg-[var(--bg-2)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {[
            { Icon: Eye, title: t.about.visionTitle, body: t.about.vision },
            { Icon: Target, title: t.about.missionTitle, body: t.about.mission },
          ].map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="surface-card p-8 gradient-border"
            >
              <div className="w-14 h-14 rounded-2xl gold-gradient text-[#15151A] flex items-center justify-center shadow-lg shadow-[var(--gold)]/30">
                <Icon size={26} />
              </div>
              <h3 className="mt-5 text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-[var(--fg-muted)] leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow">{t.about.valuesTitle}</span>
            <h2 className="mt-4 text-4xl font-bold">
              <span className="gold-text">{t.about.valuesTitle}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.about.values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length]
              return (
                <motion.div
                  key={v}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="surface-card p-6 text-center card-hover"
                >
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
                    <Icon size={22} />
                  </div>
                  <div className="mt-4 font-bold">{v}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <TargetClientsSection />
      <CTASection />
    </SiteShell>
  )
}
