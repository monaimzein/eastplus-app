'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import { Bell, Check } from 'lucide-react'
import type { Notification } from '@/lib/types'

export default function AdminNotificationsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setNotifications(data as Notification[])
      setLoading(false)
    }
    fetch()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const markAllAsRead = async () => {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">الإشعارات</h1>
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#DCBE81] hover:underline"
            >
              تحديد الكل كمقروء
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 px-6 py-4 ${
                    !notif.is_read ? 'bg-[#DCBE81]/5' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      notif.is_read ? 'bg-gray-300' : 'bg-[#DCBE81]'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A]">{notif.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notif.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1 text-gray-400 hover:text-[#DCBE81]"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
