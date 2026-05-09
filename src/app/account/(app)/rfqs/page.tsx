import Link from 'next/link'
import StatusBadge from '@/components/workspace/StatusBadge'
import { requireCustomer } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AccountRfqsPage() {
  const profile = await requireCustomer()
  const supabase = await createClient()
  const { data: rfqRows } = await supabase
    .from('rfqs')
    .select('id,title,description,status,created_at,updated_at')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  const rfqs = rfqRows ?? []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">طلبات عروض الأسعار</h1>
          <p className="text-[var(--fg-muted)] mt-2">كل طلباتك وحالاتها في مكان واحد.</p>
        </div>
        <Link href="/account/rfqs/new" className="btn-primary">طلب جديد</Link>
      </div>
      <div className="surface-card overflow-hidden">
        {rfqs.length === 0 ? (
          <p className="p-5 text-sm text-[var(--fg-muted)]">لا توجد طلبات بعد.</p>
        ) : rfqs.map((rfq) => (
          <Link key={rfq.id} href={`/account/rfqs/${rfq.id}`} className="grid md:grid-cols-[1fr_auto_auto] gap-3 px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
            <div>
              <h2 className="font-semibold">{rfq.title}</h2>
              <p className="text-sm text-[var(--fg-muted)] mt-1 line-clamp-1">{rfq.description || 'بدون وصف إضافي'}</p>
            </div>
            <StatusBadge status={rfq.status} />
            <span className="text-xs text-[var(--fg-muted)]">{new Date(rfq.created_at).toLocaleDateString('ar-SA')}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}