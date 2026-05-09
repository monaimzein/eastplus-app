import KpiCard from '@/components/workspace/KpiCard'
import { requireAdmin } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  await requireAdmin()
  const supabase = await createClient()
  const [{ count: quotes = 0 }, { count: contacts = 0 }, { count: logs = 0 }] = await Promise.all([
    supabase.from('quotations').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }),
  ])
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">تقارير المدير</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <KpiCard label="عروض الأسعار" value={quotes ?? 0} />
        <KpiCard label="رسائل التواصل" value={contacts ?? 0} />
        <KpiCard label="سجل العمليات" value={logs ?? 0} />
      </div>
    </div>
  )
}