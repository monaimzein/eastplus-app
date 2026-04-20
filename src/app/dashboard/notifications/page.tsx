'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import { useNotificationStore } from '@/lib/store'
import { Bell, Check, FileText, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import type { Notification } from '@/lib/types'

export default function NotificationsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const { notifications, setNotifications, markAsRead, markAllAsRead } = useNotificationStore()

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setNotifications(data as Notification[])
    }

    fetchNotifications()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    markAllAsRead()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'rfq_update':
        return FileText
      case 'new_message':
        return MessageCircle
      case 'quotation':
        return FileText
      default:
        return Bell
    }
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">الإشعارات</h1>
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-[#DCBE81] hover:underline"
            >
              تحديد الكل كمقروء
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 px-6 py-4 ${
                      !notification.is_read ? 'bg-[#DCBE81]/5' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        !notification.is_read
                          ? 'gold-gradient text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.is_read
                            ? 'font-semibold text-[#1A1A1A]'
                            : 'text-gray-600'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        {new Date(notification.created_at).toLocaleDateString(
                          'ar-SA'
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-xs text-[#DCBE81] hover:underline"
                        >
                          عرض
                        </Link>
                      )}
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-500"
                          title="تعيين كمقروء"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
