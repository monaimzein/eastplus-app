import KpiCard from '@/components/workspace/KpiCard'
import { requireStaff } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StaffReportsPage() {
  await requireStaff()
  const supabase = await createClient()
  const statuses = ['new', 'in_progress', 'quote_sent', 'closed']
  const counts = await Promise.all(statuses.map((status) => supabase.from('rfqs').select('*', { count: 'exact', head: true }).eq('status', status)))
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">التقارير</h1>
      <div className="grid sm:grid-cols-4 gap-4">
        {statuses.map((status, index) => <KpiCard key={status} label={status} value={counts[index].count ?? 0} />)}
      </div>
    </div>
  )
}