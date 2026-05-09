'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Phone, Mail, MapPin, ArrowLeft, ArrowRight, FileDown,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SITE, SERVICES } from '@/lib/siteConfig'

export default function Footer() {
  const { t, locale, dir } = useI18n()
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24 bg-[var(--bg-2)] text-[var(--fg)] hairline-top overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Top CTA */}
        <div className="py-12 border-b border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-start">
              <h3 className="text-2xl md:text-3xl font-bold">
                {t.cta.title}
              </h3>
              <p className="text-[var(--fg-muted)] mt-2">{t.cta.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={SITE.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <FileDown size={16} />
                {t.common.profile}
              </a>
              <Link href="/account/rfqs/new" className="btn-primary">
                {t.cta.button}
                <Arrow size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image src="/logo.png" alt="EAST PLUS" width={40} height={48} />
              <div className="flex flex-col">
                <span className="text-base font-semibold tracking-[0.18em] text-[var(--fg)]">EAST PLUS</span>
                <span className="text-[10px] text-[var(--fg-subtle)] tracking-[0.3em] uppercase">
                  {locale === 'ar' ? t.common.tagline : SITE.tagline.en}
                </span>
              </div>
            </div>
            <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
              {t.about.story}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[var(--fg)] font-semibold mb-5 text-sm tracking-wider uppercase">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick links'}
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: t.nav.home },
                { href: '/about', label: t.nav.about },
                { href: '/services', label: t.nav.services },
                { href: '/gallery', label: t.nav.gallery },
                { href: '/blog', label: t.nav.blog },
                { href: '/contact', label: t.nav.contact },
                { href: '/account/rfqs/new', label: t.common.requestQuote },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-[var(--fg-muted)] hover:text-[var(--gold)] transition-colors"
                  >
                    <Arrow size={12} className="opacity-0 -ms-1 group-hover:opacity-100 group-hover:ms-0 transition-all" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[var(--fg)] font-semibold mb-5 text-sm tracking-wider uppercase">
              {t.nav.services}
            </h4>
            <ul className="space-y-3 text-sm">
              {SERVICES.map((s) => (
                <li key={s.key}>
                  <Link
                    href={s.href}
                    className="group inline-flex items-center gap-2 text-[var(--fg-muted)] hover:text-[var(--gold)] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/40 group-hover:bg-[var(--gold)]" />
                    {t.services.items[s.key].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[var(--fg)] font-semibold mb-5 text-sm tracking-wider uppercase">
              {t.common.contactUs}
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-[var(--fg-muted)] hover:text-[var(--gold)] transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--gold)] group-hover:border-[var(--gold)]/50 transition-colors">
                    <Phone size={14} />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-widest text-[var(--fg-subtle)] mb-0.5">
                      {t.common.whatsapp}
                    </span>
                    <span dir="ltr">{SITE.whatsappDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-start gap-3 text-[var(--fg-muted)] hover:text-[var(--gold)] transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--gold)] group-hover:border-[var(--gold)]/50 transition-colors">
                    <Mail size={14} />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-widest text-[var(--fg-subtle)] mb-0.5">
                      {t.common.email}
                    </span>
                    {SITE.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={SITE.addressMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-[var(--fg-muted)] hover:text-[var(--gold)] transition-colors group"
                >
                  <span className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--gold)] group-hover:border-[var(--gold)]/50 transition-colors">
                    <MapPin size={14} />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-widest text-[var(--fg-subtle)] mb-0.5">
                      {t.common.address}
                    </span>
                    {locale === 'ar' ? SITE.address.ar : SITE.address.en}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--fg-subtle)] text-sm">
            © {year} EAST PLUS. {t.common.allRights}.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/about" className="text-[var(--fg-subtle)] hover:text-[var(--gold)] transition-colors">
              {t.common.privacy}
            </Link>
            <Link href="/about" className="text-[var(--fg-subtle)] hover:text-[var(--gold)] transition-colors">
              {t.common.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
