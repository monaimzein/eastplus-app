import Link from 'next/link'
import { requireStaff } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StaffNotificationsPage() {
  const profile = await requireStaff()
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
            <input type="hidden" name="next" value="/console/staff/notifications" />
            <button type="submit" className="btn-outline">تعيين الكل كمقروء</button>
          </form>
        )}
      </div>
      <div className="surface-card divide-y divide-[var(--border)]">
        {notifications.length === 0 ? <p className="p-5 text-sm text-[var(--fg-muted)]">لا توجد إشعارات.</p> : notifications.map((item) => (
          <Link key={item.id} href={item.link || '/console/staff'} className="block p-4 hover:bg-[var(--surface-2)] transition-colors">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-[var(--fg-muted)] mt-1">{item.message}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}