import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { requireStaff } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StaffMessagesPage() {
  await requireStaff()
  const supabase = await createClient()
  const { data: rfqRows } = await supabase
    .from('rfqs')
    .select('id,title,status,updated_at,customer:profiles!rfqs_user_id_fkey(company_name)')
    .order('updated_at', { ascending: false })
  const rfqs = rfqRows ?? []
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">المحادثات</h1>
      <div className="surface-card divide-y divide-[var(--border)]">
        {rfqs.map((rfq) => {
          const customer = Array.isArray(rfq.customer) ? rfq.customer[0] : rfq.customer
          return (
            <Link key={rfq.id} href={`/console/staff/rfqs/${rfq.id}`} className="flex items-center gap-3 p-4 hover:bg-[var(--surface-2)] transition-colors">
              <MessageSquare size={18} className="text-[var(--gold)]" />
              <div>
                <p className="font-medium">{rfq.title}</p>
                <p className="text-xs text-[var(--fg-muted)]">{customer?.company_name || 'عميل'} · {new Date(rfq.updated_at).toLocaleString('ar-SA')}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}