import Link from 'next/link'
import KpiCard from '@/components/workspace/KpiCard'
import StatusBadge from '@/components/workspace/StatusBadge'
import { createClient } from '@/lib/supabase/server'
import { requireCustomer } from '@/lib/auth/guards'

export const dynamic = 'force-dynamic'

export default async function AccountHomePage() {
  const profile = await requireCustomer()
  const supabase = await createClient()
  const { data: rfqRows } = await supabase
    .from('rfqs')
    .select('id,title,status,created_at')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5)
  const rfqs = rfqRows ?? []
  const { count: unreadNotifications = 0 } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id)
    .eq('is_read', false)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">مرحباً {profile.company_name}</h1>
          <p className="text-[var(--fg-muted)] mt-2">تابع عروض الأسعار والملفات والرسائل من هنا.</p>
        </div>
        <Link href="/account/rfqs/new" className="btn-primary">طلب عرض سعر جديد</Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <KpiCard label="كل الطلبات" value={rfqs.length} />
        <KpiCard label="إشعارات غير مقروءة" value={unreadNotifications ?? 0} />
        <KpiCard label="حسابك" value="نشط" />
      </div>
      <section className="surface-card p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">آخر الطلبات</h2>
          <Link href="/account/rfqs" className="text-sm text-[var(--gold)]">عرض الكل</Link>
        </div>
        <div className="space-y-2">
          {rfqs.length === 0 ? <p className="text-sm text-[var(--fg-muted)]">لم ترسل أي طلب بعد.</p> : rfqs.map((rfq) => (
            <Link key={rfq.id} href={`/account/rfqs/${rfq.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 hover:border-[var(--gold)]/40 transition-colors">
              <span>{rfq.title}</span>
              <StatusBadge status={rfq.status} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}