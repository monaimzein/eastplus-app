'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import { Mail, Clock, Check, Inbox, MessageCircle } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function StaffMessagesPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  useEffect(() => {
    if (!user) return
    fetchMessages()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setMessages(data)
    setLoading(false)
  }

  const markAsRead = async (msg: ContactMessage) => {
    setSelected(msg)
    if (!msg.is_read) {
      await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', msg.id)
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      )
    }
  }

  const formatWhatsApp = (phone: string) =>
    `https://wa.me/${phone.replace(/^0/, '966').replace(/[^0-9]/g, '')}`

  const unread = messages.filter((m) => !m.is_read).length

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">رسائل تواصل معنا</h1>
            {unread > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {unread} رسالة غير مقروءة
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Inbox size={48} className="mx-auto mb-3 opacity-30" />
            <p>لا توجد رسائل بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-2">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => markAsRead(msg)}
                  className={`w-full text-right p-4 rounded-xl border transition-all ${
                    selected?.id === msg.id
                      ? 'border-[#DCBE81] bg-[#DCBE81]/5'
                      : msg.is_read
                      ? 'border-gray-100 bg-white hover:border-gray-200'
                      : 'border-[#DCBE81]/40 bg-amber-50 hover:border-[#DCBE81]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${msg.is_read ? 'text-gray-700' : 'text-[#1A1A1A]'}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{msg.subject}</p>
                    </div>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#DCBE81] mt-1 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Clock size={11} />
                    {formatDate(msg.created_at)}
                  </p>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-[#1A1A1A]">{selected.subject}</h2>
                      <p className="text-sm text-gray-500 mt-1">من: {selected.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check size={12} />
                      مقروءة
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <a
                      href={`mailto:${selected.email}`}
                      className="flex items-center gap-1.5 text-[#DCBE81] hover:underline"
                    >
                      <Mail size={14} />
                      {selected.email}
                    </a>
                    {selected.phone && (
                      <a
                        href={formatWhatsApp(selected.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        dir="ltr"
                      >
                        <MessageCircle size={14} />
                        {selected.phone}
                      </a>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>

                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    {formatDate(selected.created_at)}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-gray-100">
                  <p className="text-sm">اختر رسالة لعرض تفاصيلها</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
