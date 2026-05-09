import Link from 'next/link'
import { requireCustomer } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AccountNotificationsPage() {
  const profile = await requireCustomer()
  const supabase = await createClient()
  const { data: notificationRows } = await supabase
    .from('notifications')
    .select('id,title,message,link,is_read,created_at')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  const notifications = notificationRows ?? []
  const hasUnread = notifications.some((item) => !item.is_read)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">الإشعارات</h1>
        {hasUnread && (
          <form action="/api/notifications/read-all" method="post">
            <input type="hidden" name="next" value="/account/notifications" />
            <button type="submit" className="btn-outline">تعيين الكل كمقروء</button>
          </form>
        )}
      </div>
      <div className="surface-card divide-y divide-[var(--border)]">
        {notifications.length === 0 ? <p className="p-5 text-sm text-[var(--fg-muted)]">لا توجد إشعارات.</p> : notifications.map((item) => (
          <Link key={item.id} href={item.link || '/account'} className="block p-4 hover:bg-[var(--surface-2)] transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-[var(--fg-muted)] mt-1">{item.message}</p>
              </div>
              {!item.is_read && <span className="rounded-full bg-[var(--gold)] px-2 py-1 text-[10px] text-[var(--primary-fg)]">جديد</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}