'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/about', label: 'من نحن' },
    { href: '/services', label: 'خدماتنا' },
    { href: '/contact', label: 'تواصل معنا' },
    { href: '/blog', label: 'المدونة' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl shadow-lg shadow-black/5 border-b border-gray-100/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="EAST PLUS"
              width={40}
              height={48}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold gold-text tracking-wider leading-tight">
                EAST PLUS
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest">
                مواد البناء والتوريد
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-[#DCBE81]'
                    : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 right-2 left-2 h-0.5 gold-gradient rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth / CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    user.role === 'admin'
                      ? '/admin'
                      : user.role === 'staff'
                      ? '/staff'
                      : '/dashboard'
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#DCBE81]/10 text-[#DCBE81] rounded-xl hover:bg-[#DCBE81]/20 transition-colors"
                >
                  <User size={16} />
                  <span>{user.company_name || 'لوحة التحكم'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                  title="تسجيل خروج"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#1A1A1A] rounded-xl hover:bg-gray-50 transition-all"
                >
                  تسجيل دخول
                </Link>
                <Link
                  href="/rfq/new"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gold-gradient rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#DCBE81]/25"
                >
                  طلب عرض سعر
                  <ArrowLeft size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive(link.href)
                      ? 'bg-[#DCBE81]/10 text-[#DCBE81]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
                {user ? (
                  <>
                    <Link
                      href={
                        user.role === 'admin'
                          ? '/admin'
                          : user.role === 'staff'
                          ? '/staff'
                          : '/dashboard'
                      }
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#DCBE81] bg-[#DCBE81]/10 rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={16} />
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <LogOut size={16} />
                      تسجيل خروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      تسجيل دخول
                    </Link>
                    <Link
                      href="/rfq/new"
                      className="block text-center px-4 py-3 text-sm font-semibold text-white gold-gradient rounded-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      طلب عرض سعر
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
