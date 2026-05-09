'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Dictionary, type Locale } from './dictionaries'

type I18nContextValue = {
  locale: Locale
  dir: 'rtl' | 'ltr'
  t: Dictionary
  setLocale: (l: Locale) => void
  toggleLocale: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

const COOKIE_KEY = 'ep_locale'

function readCookie(): Locale | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )ep_locale=([^;]+)/)
  return match ? (match[1] as Locale) : null
}

function writeCookie(l: Locale) {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_KEY}=${l}; path=/; max-age=${60 * 60 * 24 * 365}`
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar')

  // Hydrate from cookie on mount
  useEffect(() => {
    const t0 = setTimeout(() => {
      const stored = readCookie()
      if (stored === 'ar' || stored === 'en') setLocaleState(stored)
    }, 0)
    return () => clearTimeout(t0)
  }, [])

  // Sync html lang/dir
  useEffect(() => {
    const html = document.documentElement
    html.lang = locale
    html.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    writeCookie(l)
    setLocaleState(l)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'ar' ? 'en' : 'ar'
      writeCookie(next)
      return next
    })
  }, [])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t: dictionaries[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
