import Link from 'next/link'
import { BarChart3, Bell, BriefcaseBusiness, FileText, LogOut, MessageSquare, ShieldCheck, UserCog, Users } from 'lucide-react'
import type { Profile } from '@/lib/types'

const staffLinks = [
  { href: '/console/staff', label: 'نظرة عامة', icon: BarChart3 },
  { href: '/console/staff/rfqs', label: 'طلبات عروض الأسعار', icon: FileText },
  { href: '/console/staff/messages', label: 'المحادثات', icon: MessageSquare },
  { href: '/console/staff/notifications', label: 'الإشعارات', icon: Bell },
  { href: '/console/staff/contact-messages', label: 'رسائل تواصل معنا', icon: Users },
  { href: '/console/staff/reports', label: 'التقارير', icon: BarChart3 },
]

const adminLinks = [
  { href: '/console/admin', label: 'نظرة عامة', icon: ShieldCheck },
  { href: '/console/admin/employees', label: 'إدارة الموظفين', icon: UserCog },
  { href: '/console/admin/reports', label: 'تقارير الإدارة', icon: BarChart3 },
  { href: '/console/staff/rfqs', label: 'الطلبات التشغيلية', icon: FileText },
  { href: '/console/staff/messages', label: 'محادثات الطلبات', icon: MessageSquare },
  { href: '/console/staff/notifications', label: 'إشعارات الفريق', icon: Bell },
  { href: '/console/staff/contact-messages', label: 'رسائل تواصل معنا', icon: BriefcaseBusiness },
]

export default function ConsoleShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const isAdmin = profile.role === 'admin'
  const links = isAdmin ? adminLinks : staffLinks

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir="rtl">
      <div className="border-b border-[var(--border)] bg-[var(--bg-2)]">
        <div className="max-w-[1500px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <Link href={isAdmin ? '/console/admin' : '/console/staff'} className="font-semibold tracking-[0.18em] text-[var(--gold)]">{isAdmin ? 'EAST PLUS ADMIN' : 'EAST PLUS CONSOLE'}</Link>
            <p className="text-xs text-[var(--fg-muted)] mt-1">{profile.full_name || profile.email} · {profile.job_title || (isAdmin ? 'مدير' : 'موظف')}</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <input type="hidden" name="next" value="/console/login" />
            <button className="btn-ghost !py-2 !px-3" type="submit">
              <LogOut size={15} />
              خروج
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6 grid xl:grid-cols-[280px_1fr] gap-6">
        <aside className="surface-card p-3 h-fit xl:sticky xl:top-6">
          <nav className="space-y-1">
            {links.map((item, index) => {
              const Icon = item.icon
              const showDivider = isAdmin && index === 3
              return (
                <div key={item.href}>
                  {showDivider && <div className="my-3 border-t border-[var(--border)]" />}
                  <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--gold)] transition-colors">
                    <Icon size={16} />
                    {item.label}
                  </Link>
                </div>
              )
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}