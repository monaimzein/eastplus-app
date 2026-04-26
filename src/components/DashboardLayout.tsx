'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks'
import { createClient } from '@/lib/supabase/client'
import { useNotificationStore } from '@/lib/store'
import {
  LayoutDashboard,
  FileText,
  Bell,
  User,
  LogOut,
  Plus,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
  Users,
  BarChart3,
  Home,
  Inbox,
} from 'lucide-react'
import type { Notification } from '@/lib/types'

// Module-level client - created once, not on every render
const supabase = createClient()

interface DashboardLayoutProps {
  children: React.ReactNode
  role?: 'user' | 'staff' | 'admin'
}

export default function DashboardLayout({
  children,
  role = 'user',
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const { unreadCount, setNotifications } = useNotificationStore()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) setNotifications(data as Notification[])
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch {
      setLoggingOut(false)
    }
  }

  const getNavItems = () => {
    const base =
      role === 'admin' ? '/admin' : role === 'staff' ? '/staff' : '/dashboard'
    const items = [
      { href: base, label: 'لوحة التحكم', icon: LayoutDashboard },
      { href: `${base}/rfqs`, label: 'طلبات الأسعار', icon: FileText },
      { href: `${base}/chat`, label: 'المحادثات', icon: MessageSquare },
    ]

    if (role === 'admin') {
      items.push({
        href: '/admin/staff',
        label: 'إدارة الموظفين',
        icon: Users,
      })
      items.push({
        href: '/admin/reports',
        label: 'التقارير',
        icon: BarChart3,
      })
    }

    if (role === 'admin' || role === 'staff') {
      items.push({
        href: `${base}/messages`,
        label: 'رسائل تواصل معنا',
        icon: Inbox,
      })
    }

    items.push({
      href: `${base}/notifications`,
      label: 'الإشعارات',
      icon: Bell,
    })
    items.push({
      href: `${base}/profile`,
      label: 'الملف الشخصي',
      icon: User,
    })

    return items
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="EAST PLUS" width={48} height={58} />
          <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) {
    router.replace('/auth/login')
    return null
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-100 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="EAST PLUS"
                width={32}
                height={38}
              />
              <span className="text-lg font-bold gold-text tracking-wider">
                EAST PLUS
              </span>
            </Link>
            <button
              className="lg:hidden p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* New RFQ button */}
          {role === 'user' && (
            <div className="px-4 py-4">
              <Link
                href="/rfq/new"
                className="flex items-center justify-center gap-2 w-full py-2.5 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                <Plus size={16} />
                طلب عرض سعر جديد
              </Link>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href + '/'))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#DCBE81]/10 text-[#DCBE81]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {item.icon === Bell && unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight size={14} className="text-[#DCBE81]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Back to site */}
          <div className="px-3 py-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <Home size={18} />
              العودة للموقع
            </Link>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-white text-sm font-bold">
                {user?.company_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A1A] truncate">
                  {user?.company_name || 'مستخدم'}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
            >
              <LogOut size={14} />
              {loggingOut ? 'جاري الخروج...' : 'تسجيل خروج'}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 lg:mr-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <Link
                href={
                  role === 'admin'
                    ? '/admin/notifications'
                    : role === 'staff'
                    ? '/staff/notifications'
                    : '/dashboard/notifications'
                }
                className="relative p-2 text-gray-400 hover:text-[#DCBE81] rounded-xl hover:bg-[#DCBE81]/5 transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
