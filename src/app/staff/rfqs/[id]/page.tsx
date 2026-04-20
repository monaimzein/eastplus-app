'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import {
  FileText,
  Upload,
  Send,
  User,
  Phone,
  Mail,
  Image as ImageIcon,
  Clock,
  MessageCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { RFQ, RFQStatus, ChatMessage, RFQTimeline } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS, RFQ_PRIORITY_LABELS } from '@/lib/types'

export default function StaffRFQDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const supabase = createClient()
  const [rfq, setRfq] = useState<RFQ | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [timeline, setTimeline] = useState<RFQTimeline[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [newStatus, setNewStatus] = useState<RFQStatus>('new')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'timeline'>('details')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchRFQ()
    fetchMessages()
    fetchTimeline()

    const channel = supabase
      .channel(`staff-rfq-${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `rfq_id=eq.${id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage])
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'rfqs', filter: `id=eq.${id}`,
      }, (payload) => {
        setRfq(payload.new as RFQ)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRFQ = async () => {
    const { data } = await supabase
      .from('rfqs')
      .select('*, user:profiles!rfqs_user_id_fkey(id, company_name, email, whatsapp_number, national_address, commercial_registration)')
      .eq('id', id)
      .single()

    if (data) {
      setRfq(data as unknown as RFQ)
      setNewStatus(data.status as RFQStatus)
    }
    setLoading(false)
  }

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*, sender:profiles(id, company_name, role)')
      .eq('rfq_id', id)
      .order('created_at', { ascending: true })

    if (data) setMessages(data as unknown as ChatMessage[])
  }

  const fetchTimeline = async () => {
    const { data } = await supabase
      .from('rfq_timeline')
      .select('*, profile:profiles(id, company_name)')
      .eq('rfq_id', id)
      .order('created_at', { ascending: false })

    if (data) setTimeline(data as unknown as RFQTimeline[])
  }

  const updateStatus = async () => {
    if (!user || !rfq) return

    const { error } = await supabase
      .from('rfqs')
      .update({ status: newStatus, assigned_to: user.id })
      .eq('id', id)

    if (error) {
      toast.error('حدث خطأ')
      return
    }

    // Add timeline entry
    await supabase.from('rfq_timeline').insert({
      rfq_id: id,
      action: `تم تغيير الحالة إلى: ${RFQ_STATUS_LABELS[newStatus]}`,
      created_by: user.id,
    })

    // Notify user
    await supabase.from('notifications').insert({
      user_id: rfq.user_id,
      title: 'تحديث حالة الطلب',
      message: `تم تحديث حالة طلبك "${rfq.title}" إلى ${RFQ_STATUS_LABELS[newStatus]}`,
      type: 'rfq_update',
      link: `/dashboard/rfqs/${id}`,
    })

    toast.success('تم تحديث الحالة')
    fetchRFQ()
    fetchTimeline()
  }

  const uploadQuotation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('حجم الملف كبير جداً (الحد الأقصى 10MB)')
      return
    }

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${id}/${Date.now()}-quotation.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('quotations')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      toast.error(`خطأ في الرفع: ${uploadError.message}`)
      setUploading(false)
      // Reset file input
      e.target.value = ''
      return
    }

    const { data: urlData } = supabase.storage
      .from('quotations')
      .getPublicUrl(fileName)

    await supabase
      .from('rfqs')
      .update({ quotation_pdf: urlData.publicUrl, status: 'quoted' })
      .eq('id', id)

    await supabase.from('rfq_timeline').insert({
      rfq_id: id,
      action: 'تم رفع عرض السعر',
      created_by: user.id,
    })

    await supabase.from('notifications').insert({
      user_id: rfq?.user_id,
      title: 'تم تجهيز عرض السعر',
      message: `تم رفع عرض السعر لطلبك "${rfq?.title}"`,
      type: 'quotation',
      link: `/dashboard/rfqs/${id}`,
    })

    toast.success('تم رفع عرض السعر بنجاح')
    setUploading(false)
    fetchRFQ()
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    await supabase.from('chat_messages').insert({
      rfq_id: id,
      sender_id: user.id,
      content: newMessage,
    })

    // Notify the user
    if (rfq) {
      await supabase.from('notifications').insert({
        user_id: rfq.user_id,
        title: 'رسالة جديدة',
        message: `لديك رسالة جديدة بخصوص طلب "${rfq.title}"`,
        type: 'new_message',
        link: `/dashboard/rfqs/${id}`,
      })
    }

    setNewMessage('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) {
    return (
      <DashboardLayout role="staff">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!rfq) {
    return (
      <DashboardLayout role="staff">
        <p className="text-gray-500 text-center py-12">الطلب غير موجود</p>
      </DashboardLayout>
    )
  }

  const clientInfo = rfq.user as any

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">{rfq.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`status-badge ${RFQ_STATUS_COLORS[rfq.status]}`}>
                {RFQ_STATUS_LABELS[rfq.status]}
              </span>
              <span className="text-sm text-gray-400">{RFQ_PRIORITY_LABELS[rfq.priority]}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as RFQStatus)}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#DCBE81]"
              >
                {Object.entries(RFQ_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <button
                onClick={updateStatus}
                className="px-4 py-2 gold-gradient text-white text-sm font-medium rounded-xl hover:opacity-90"
              >
                تحديث
              </button>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#DCBE81] cursor-pointer">
              <Upload size={16} />
              {uploading ? 'جاري الرفع...' : 'رفع عرض سعر'}
              <input
                type="file"
                accept=".pdf"
                onChange={uploadQuotation}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Client Info */}
        {clientInfo && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <User size={18} />
              معلومات العميل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-[#DCBE81]" />
                <span className="text-gray-600">{clientInfo.company_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-[#DCBE81]" />
                <span className="text-gray-600" dir="ltr">{clientInfo.email}</span>
              </div>
              {clientInfo.whatsapp_number ? (
                <a
                  href={`https://wa.me/${clientInfo.whatsapp_number.replace(/^0/, '966').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors w-fit"
                >
                  <MessageCircle size={16} />
                  واتساب: {clientInfo.whatsapp_number}
                </a>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-[#DCBE81]" />
                  <span className="text-gray-400">لا يوجد رقم واتساب</span>
                </div>
              )}
            </div>
            {clientInfo.commercial_registration && (
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>السجل التجاري: {clientInfo.commercial_registration}</span>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'details', label: 'التفاصيل' },
            { key: 'chat', label: 'المحادثة' },
            { key: 'timeline', label: 'سجل المتابعة' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {rfq.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">الوصف</h3>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{rfq.description}</p>
              </div>
            )}

            {rfq.images && rfq.images.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <ImageIcon size={18} /> الصور المرفقة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rfq.images.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-gray-100 hover:border-[#DCBE81]">
                      <img src={img} alt={`img-${i}`} className="w-full h-32 object-cover" loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {rfq.quotation_pdf && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <FileText size={18} /> عرض السعر المرفق
                </h3>
                <iframe
                  src={rfq.quotation_pdf}
                  className="w-full h-96 rounded-xl border border-gray-200"
                  title="Quotation PDF"
                />
              </div>
            )}

            {rfq.rating && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-2">تقييم العميل</h3>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rfq.rating! ? 'text-[#DCBE81]' : 'text-gray-300'}>★</span>
                  ))}
                </div>
                {rfq.rating_comment && <p className="text-gray-500 text-sm">{rfq.rating_comment}</p>}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center py-12 text-gray-400">لا توجد رسائل بعد</p>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isOwn ? 'bg-[#DCBE81]/10' : 'bg-gray-100'
                      }`}>
                        <p className="text-xs font-medium text-[#DCBE81] mb-1">
                          {(msg.sender as any)?.company_name}
                        </p>
                        <p className="text-sm text-[#1A1A1A]">{msg.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81]"
                  placeholder="اكتب رسالتك..."
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 gold-gradient text-white rounded-xl hover:opacity-90 disabled:opacity-50"
                >
                  <Send size={18} className="rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {timeline.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Clock size={32} className="mx-auto mb-2" />
                <p>لا يوجد سجل بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timeline.map((entry) => (
                  <div key={entry.id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-[#DCBE81] mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{entry.action}</p>
                      {entry.details && <p className="text-xs text-gray-500 mt-1">{entry.details}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(entry.created_at).toLocaleDateString('ar-SA')}{' '}
                        {new Date(entry.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
