import Link from 'next/link'
import KpiCard from '@/components/workspace/KpiCard'
import StatusBadge from '@/components/workspace/StatusBadge'
import { requireStaff } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StaffHomePage() {
  await requireStaff()
  const supabase = await createClient()
  const [{ count: allRfqs = 0 }, { count: newRfqs = 0 }, { count: unreadContacts = 0 }, rfqsResult] = await Promise.all([
    supabase.from('rfqs').select('*', { count: 'exact', head: true }),
    supabase.from('rfqs').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('rfqs').select('id,title,status,created_at').order('created_at', { ascending: false }).limit(6),
  ])
  const rfqs = rfqsResult.data ?? []
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">لوحة الموظف</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <KpiCard label="كل الطلبات" value={allRfqs ?? 0} />
        <KpiCard label="طلبات جديدة" value={newRfqs ?? 0} />
        <KpiCard label="رسائل تواصل غير مقروءة" value={unreadContacts ?? 0} />
      </div>
      <section className="surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">أحدث الطلبات</h2>
          <Link href="/console/staff/rfqs" className="text-sm text-[var(--gold)]">عرض الكل</Link>
        </div>
        <div className="space-y-2">
          {rfqs.map((rfq) => (
            <Link key={rfq.id} href={`/console/staff/rfqs/${rfq.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 hover:border-[var(--gold)]/40 transition-colors">
              <span>{rfq.title}</span>
              <StatusBadge status={rfq.status} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}