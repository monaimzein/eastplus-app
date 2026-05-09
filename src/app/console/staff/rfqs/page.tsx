import Link from 'next/link'
import StatusBadge from '@/components/workspace/StatusBadge'
import { requireStaff } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StaffRfqsPage() {
  await requireStaff()
  const supabase = await createClient()
  const { data: rfqRows } = await supabase
    .from('rfqs')
    .select('id,title,description,status,created_at,customer:profiles!rfqs_user_id_fkey(company_name,whatsapp_number,email)')
    .order('created_at', { ascending: false })
  const rfqs = rfqRows ?? []

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">طلبات عروض الأسعار</h1>
      <div className="surface-card overflow-hidden">
        {rfqs.length === 0 ? <p className="p-5 text-sm text-[var(--fg-muted)]">لا توجد طلبات.</p> : rfqs.map((rfq) => {
          const customer = Array.isArray(rfq.customer) ? rfq.customer[0] : rfq.customer
          return (
            <Link key={rfq.id} href={`/console/staff/rfqs/${rfq.id}`} className="grid lg:grid-cols-[1.4fr_1fr_auto_auto] gap-3 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
              <div>
                <h2 className="font-semibold">{rfq.title}</h2>
                <p className="text-sm text-[var(--fg-muted)] mt-1 line-clamp-1">{rfq.description || 'بدون وصف'}</p>
              </div>
              <span className="text-sm text-[var(--fg-muted)]">{customer?.company_name || 'عميل'}</span>
              <StatusBadge status={rfq.status} />
              <span className="text-xs text-[var(--fg-muted)]">{new Date(rfq.created_at).toLocaleDateString('ar-SA')}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}