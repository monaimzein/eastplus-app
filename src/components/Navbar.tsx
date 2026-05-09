'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ChevronDown, Sun, Moon, Languages,
  FileText, ArrowLeft, ArrowRight, CircleUserRound,
  Droplets, Zap, HardHat, ShowerHead, Shield, Wrench, Building2,
  Layers, Eye,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useI18n } from '@/lib/i18n/I18nProvider'
import { SITE } from '@/lib/siteConfig'
import { createClient } from '@/lib/supabase/client'

type MenuItem = {
  href: string
  labelKey: 'home' | 'about' | 'services' | 'gallery' | 'blog' | 'contact'
  // mega menu groups (optional)
  mega?: { titleKey: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }>; descKey?: string }[]
}

export default function Navbar() {
  const { t, locale, toggleLocale, dir } = useI18n()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [authState, setAuthState] = useState<{ isSignedIn: boolean; destination: string } | null>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!mounted) return

    const supabase = createClient()
    let active = true

    const syncAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!active) return

      if (!user) {
        setAuthState({ isSignedIn: false, destination: '/account/login' })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (!active) return

      const destination = profile?.role === 'admin'
        ? '/console/admin'
        : profile?.role === 'staff'
        ? '/console/staff'
        : '/account'

      setAuthState({ isSignedIn: true, destination })
    }

    void syncAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncAuth()
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [mounted])

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const authResolved = mounted && authState !== null
  const isSignedIn = authState?.isSignedIn === true
  const accountHref = authState?.destination || '/account'
  const quoteHref = '/account/login?next=/account/rfqs/new'

  const servicesMega = [
    { href: '/services/plumbing',     icon: Droplets,    titleKey: 'svcPlumbing' },
    { href: '/services/electrical',   icon: Zap,         titleKey: 'svcElectrical' },
    { href: '/services/construction', icon: HardHat,     titleKey: 'svcConstruction' },
    { href: '/services/sanitary',     icon: ShowerHead,  titleKey: 'svcSanitary' },
    { href: '/services/insulation',   icon: Shield,      titleKey: 'svcInsulation' },
    { href: '/services/maintenance',  icon: Wrench,      titleKey: 'svcMaintenance' },
    { href: '/services/projects',     icon: Building2,   titleKey: 'svcProjects' },
  ] as const

  const galleryMega = [
    { href: '/gallery',              icon: Layers,     titleKey: 'galleryAll' },
    { href: '/gallery/construction', icon: HardHat,    titleKey: 'galConstruction' },
    { href: '/gallery/electrical',   icon: Zap,        titleKey: 'galElectrical' },
    { href: '/gallery/plumbing',     icon: Droplets,   titleKey: 'galPlumbing' },
  ] as const

  const aboutMega = [
    { href: '/about',          icon: Eye,    titleKey: 'aboutCompany' },
    { href: '/about#vision',   icon: Layers, titleKey: 'aboutVision' },
  ] as const

  const links: MenuItem[] = [
    { href: '/', labelKey: 'home' },
    { href: '/about', labelKey: 'about' },
    { href: '/services', labelKey: 'services' },
    { href: '/gallery', labelKey: 'gallery' },
    { href: '/blog', labelKey: 'blog' },
    { href: '/contact', labelKey: 'contact' },
  ]

  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] border-b border-[var(--border)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <Image
              src="/logo.png"
              alt="EAST PLUS"
              width={40}
              height={48}
              priority
              className="transition-opacity duration-300 group-hover:opacity-90"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-[0.18em] text-[var(--fg)]">EAST PLUS</span>
              <span className="text-[10px] text-[var(--fg-subtle)] tracking-[0.3em] uppercase">
                {SITE.tagline.en}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {links.map((link) => {
              const hasMega =
                link.labelKey === 'services' || link.labelKey === 'gallery' || link.labelKey === 'about'
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => hasMega && setOpenMega(link.labelKey)}
                  onMouseLeave={() => hasMega && setOpenMega(null)}
                >
                  <Link
                    href={link.href}
                    className="relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl text-[var(--fg-muted)] hover:text-[var(--gold)] transition-colors"
                  >
                    {t.nav[link.labelKey]}
                    {hasMega && <ChevronDown size={14} className="opacity-70" />}
                  </Link>

                  {hasMega && (
                    <AnimatePresence>
                      {openMega === link.labelKey && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full start-0 pt-3"
                        >
                          <div className="surface-card glass p-3 min-w-[320px] shadow-2xl shadow-black/30">
                            <div className="grid grid-cols-1 gap-1">
                              {(link.labelKey === 'services'
                                ? servicesMega
                                : link.labelKey === 'gallery'
                                ? galleryMega
                                : aboutMega
                              ).map((item) => {
                                const Icon = item.icon
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--gold)]/10 transition-colors group/item"
                                  >
                                    <span className="w-9 h-9 rounded-lg bg-[var(--gold)]/10 border border-[var(--border)] flex items-center justify-center text-[var(--gold)] group-hover/item:bg-[var(--gold)] group-hover/item:text-[var(--primary-fg)] transition-colors">
                                      <Icon size={16} />
                                    </span>
                                    <span className="text-sm font-medium text-[var(--fg)]">
                                      {t.nav[item.titleKey]}
                                    </span>
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Right cluster */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Lang toggle */}
            <button
              onClick={toggleLocale}
              className="btn-ghost text-xs font-semibold"
              aria-label="Toggle language"
              title={locale === 'ar' ? 'English' : 'العربية'}
            >
              <Languages size={16} />
              <span>{locale === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="btn-ghost"
              aria-label="Toggle theme"
              title={isDark ? t.common.light : t.common.dark}
            >
              {mounted && (isDark ? <Sun size={16} /> : <Moon size={16} />)}
            </button>

            {authResolved && isSignedIn && (
              <Link href={accountHref} className="btn-outline !p-2.5" title={locale === 'ar' ? 'الحساب' : 'Account'} aria-label={locale === 'ar' ? 'الحساب' : 'Account'}>
                <CircleUserRound size={18} />
              </Link>
            )}

            {authResolved && !isSignedIn && (
              <Link href={quoteHref} className="btn-primary !py-2.5 !px-4 text-sm">
                <FileText size={14} />
                {t.common.requestQuote}
                <Arrow size={14} />
              </Link>
            )}
          </div>

          {/* Mobile cluster */}
          <div className="flex lg:hidden items-center gap-1">
            <button onClick={toggleLocale} className="btn-ghost text-xs font-semibold" aria-label="Lang">
              {locale === 'ar' ? 'EN' : 'AR'}
            </button>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="btn-ghost"
              aria-label="Theme"
            >
              {mounted && (isDark ? <Sun size={16} /> : <Moon size={16} />)}
            </button>
            <button
              onClick={() => setOpenMobile((v) => !v)}
              className="p-2 rounded-xl hover:bg-[var(--gold)]/10 transition-colors"
              aria-label="Menu"
            >
              {openMobile ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden glass border-t border-[var(--border)]"
          >
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-1.5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpenMobile(false)}
                  className="block px-4 py-3 text-sm font-medium rounded-xl text-[var(--fg-muted)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] transition-colors"
                >
                  {t.nav[l.labelKey]}
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-[var(--border)] grid grid-cols-2 gap-2">
                {servicesMega.slice(0, 6).map((s) => {
                  const Icon = s.icon
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setOpenMobile(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs"
                    >
                      <Icon size={14} className="text-[var(--gold)]" />
                      {t.nav[s.titleKey]}
                    </Link>
                  )
                })}
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--border)] space-y-2">
                {authResolved && isSignedIn && (
                  <Link
                    href={accountHref}
                    onClick={() => setOpenMobile(false)}
                    className="btn-outline w-full"
                  >
                    <CircleUserRound size={14} />
                    {locale === 'ar' ? 'الحساب' : 'Account'}
                  </Link>
                )}
                {authResolved && !isSignedIn && (
                  <Link
                    href={quoteHref}
                    onClick={() => setOpenMobile(false)}
                    className="btn-primary w-full"
                  >
                    <FileText size={14} />
                    {t.common.requestQuote}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
