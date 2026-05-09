'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react'
import SiteShell from '@/components/SiteShell'
import PageHero from '@/components/PageHero'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SITE } from '@/lib/siteConfig'
import { useState } from 'react'

export default function ContactPage() {
  const { t, locale, dir } = useI18n()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <SiteShell>
      <PageHero eyebrow={t.contact.title} title={t.contact.title} subtitle={t.contact.subtitle} />

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4 lg:col-span-1">
            {[
              {
                Icon: Phone,
                label: t.common.whatsapp,
                value: SITE.whatsappDisplay,
                href: `https://wa.me/${SITE.whatsapp}`,
              },
              {
                Icon: Mail,
                label: t.common.email,
                value: SITE.email,
                href: `mailto:${SITE.email}`,
              },
              {
                Icon: MapPin,
                label: t.common.address,
                value: locale === 'ar' ? SITE.address.ar : SITE.address.en,
                href: SITE.addressMap,
              },
            ].map(({ Icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: dir === 'rtl' ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group surface-card p-5 flex items-center gap-4 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-[var(--primary-fg)] transition-colors">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">{label}</div>
                  <div className="text-sm font-semibold truncate" dir={label === t.common.whatsapp ? 'ltr' : undefined}>
                    {value}
                  </div>
                </div>
              </motion.a>
            ))}

            <motion.a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="block w-full text-center px-5 py-4 rounded-2xl bg-[#25D366] text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              {locale === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
            </motion.a>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="surface-card p-6 md:p-8 lg:col-span-2"
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setSubmitted(false)
                setError('')
                setLoading(true)
                const formData = new FormData(e.currentTarget)
                const response = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(Object.fromEntries(formData.entries())),
                })
                const body = await response.json().catch(() => ({}))
                setLoading(false)
                if (!response.ok) {
                  setError(body.error || (locale === 'ar' ? 'تعذر إرسال الرسالة.' : 'Could not send the message.'))
                  return
                }
                e.currentTarget.reset()
                setSubmitted(true)
              }}
              className="space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.formName}</label>
                  <input required name="name" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.formCompany}</label>
                  <input name="company" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.formEmail}</label>
                  <input required type="email" name="email" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.contact.formPhone}</label>
                  <input required type="tel" name="phone" className="w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.contact.formMessage}</label>
                <textarea required name="message" rows={5} className="w-full" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto disabled:opacity-50">
                <Send size={16} />
                {t.contact.formSend}
              </button>
              {error && <p className="text-sm text-red-400">{error}</p>}
              {submitted && (
                <p className="text-sm text-[var(--gold)]">
                  {locale === 'ar' ? 'تم استلام رسالتك. سنعاود التواصل معك قريباً.' : 'Message received. We will reach out shortly.'}
                </p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="surface-card overflow-hidden aspect-[16/7]">
            <iframe
              title="Map"
              src={SITE.addressEmbed}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
