import Link from 'next/link'
import KpiCard from '@/components/workspace/KpiCard'
import { requireAdmin } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminHomePage() {
  await requireAdmin()
  const supabase = await createClient()
  const [{ count: staff = 0 }, { count: customers = 0 }, { count: rfqs = 0 }, { count: newRfqs = 0 }, { count: unreadContacts = 0 }, { count: unreadNotifications = 0 }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['staff', 'admin']),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
    supabase.from('rfqs').select('*', { count: 'exact', head: true }),
    supabase.from('rfqs').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">لوحة الإدارة</h1>
          <p className="text-[var(--fg-muted)] mt-2">إدارة الفريق مع نظرة تشغيلية مباشرة على الطلبات، الرسائل، والتنبيهات.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/console/admin/employees" className="btn-primary">إدارة الموظفين</Link>
          <Link href="/console/staff/rfqs" className="btn-outline">الطلبات التشغيلية</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KpiCard label="الموظفون" value={staff ?? 0} />
        <KpiCard label="العملاء" value={customers ?? 0} />
        <KpiCard label="طلبات عروض الأسعار" value={rfqs ?? 0} />
        <KpiCard label="طلبات جديدة" value={newRfqs ?? 0} />
        <KpiCard label="رسائل تواصل غير مقروءة" value={unreadContacts ?? 0} />
        <KpiCard label="إشعارات غير مقروءة" value={unreadNotifications ?? 0} />
      </div>
      <section className="grid lg:grid-cols-3 gap-4">
        <Link href="/console/admin/employees" className="surface-card p-5 hover:border-[var(--gold)]/40 transition-colors border border-[var(--border)]">
          <h2 className="font-semibold">إدارة الموظفين</h2>
          <p className="text-sm text-[var(--fg-muted)] mt-2">إنشاء الموظفين، تعديل أدوارهم، وتعطيل الحسابات.</p>
        </Link>
        <Link href="/console/staff/messages" className="surface-card p-5 hover:border-[var(--gold)]/40 transition-colors border border-[var(--border)]">
          <h2 className="font-semibold">محادثات الطلبات</h2>
          <p className="text-sm text-[var(--fg-muted)] mt-2">متابعة رسائل العملاء والرد من نفس الطلب.</p>
        </Link>
        <Link href="/console/admin/reports" className="surface-card p-5 hover:border-[var(--gold)]/40 transition-colors border border-[var(--border)]">
          <h2 className="font-semibold">التقارير</h2>
          <p className="text-sm text-[var(--fg-muted)] mt-2">عرض أرقام العروض، السجلات، ورسائل التواصل.</p>
        </Link>
      </section>
    </div>
  )
}