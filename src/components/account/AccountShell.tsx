import Link from 'next/link'
import { Bell, FileText, LogOut, MessageSquare, Plus, User } from 'lucide-react'
import type { Profile } from '@/lib/types'

const links = [
  { href: '/account', label: 'الرئيسية', icon: FileText },
  { href: '/account/rfqs', label: 'طلبات عروض الأسعار', icon: FileText },
  { href: '/account/rfqs/new', label: 'طلب جديد', icon: Plus },
  { href: '/account/messages', label: 'المحادثات', icon: MessageSquare },
  { href: '/account/notifications', label: 'الإشعارات', icon: Bell },
  { href: '/account/profile', label: 'الملف الشخصي', icon: User },
]

export default function AccountShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]" dir="rtl">
      <div className="border-b border-[var(--border)] bg-[var(--bg-2)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold tracking-[0.18em] text-[var(--gold)]">EAST PLUS</Link>
          <div className="flex items-center gap-3 text-sm text-[var(--fg-muted)]">
            <span className="hidden sm:inline">{profile.company_name || profile.email}</span>
            <form action="/api/auth/logout" method="post">
              <input type="hidden" name="next" value="/" />
              <button className="btn-ghost !py-2 !px-3" type="submit">
                <LogOut size={15} />
                خروج
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="surface-card p-3 h-fit lg:sticky lg:top-6">
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--gold)] transition-colors">
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}