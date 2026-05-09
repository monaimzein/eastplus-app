import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { requireCustomer } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AccountMessagesPage() {
  const profile = await requireCustomer()
  const supabase = await createClient()
  const { data: rfqRows } = await supabase
    .from('rfqs')
    .select('id,title,status,updated_at')
    .eq('user_id', profile.id)
    .order('updated_at', { ascending: false })
  const rfqs = rfqRows ?? []

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">المحادثات</h1>
      <div className="surface-card divide-y divide-[var(--border)]">
        {rfqs.length === 0 ? <p className="p-5 text-sm text-[var(--fg-muted)]">لا توجد محادثات بعد.</p> : rfqs.map((rfq) => (
          <Link key={rfq.id} href={`/account/rfqs/${rfq.id}`} className="flex items-center gap-3 p-4 hover:bg-[var(--surface-2)] transition-colors">
            <MessageSquare size={18} className="text-[var(--gold)]" />
            <div>
              <p className="font-medium">{rfq.title}</p>
              <p className="text-xs text-[var(--fg-muted)]">آخر تحديث {new Date(rfq.updated_at).toLocaleString('ar-SA')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}