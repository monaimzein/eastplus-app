'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import {
  FileText,
  Download,
  Send,
  Paperclip,
  Star,
  Image as ImageIcon,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { RFQ, ChatMessage, RFQTimeline } from '@/lib/types'
import {
  RFQ_STATUS_LABELS,
  RFQ_STATUS_COLORS,
  RFQ_PRIORITY_LABELS,
} from '@/lib/types'

export default function RFQDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const supabase = createClient()
  const [rfq, setRfq] = useState<RFQ | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [timeline, setTimeline] = useState<RFQTimeline[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'timeline'>(
    'details'
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchRFQ()
    fetchMessages()
    fetchTimeline()

    // Realtime chat
    const channel = supabase
      .channel(`rfq-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `rfq_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rfqs',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setRfq(payload.new as RFQ)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRFQ = async () => {
    const { data } = await supabase
      .from('rfqs')
      .select('*')
      .eq('id', id)
      .single()

    if (data) setRfq(data as RFQ)
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

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    const { error } = await supabase.from('chat_messages').insert({
      rfq_id: id,
      sender_id: user.id,
      content: newMessage,
    })

    if (error) {
      toast.error('حدث خطأ أثناء إرسال الرسالة')
    } else {
      // Notify assigned staff
      if (rfq?.assigned_to) {
        await supabase.from('notifications').insert({
          user_id: rfq.assigned_to,
          title: 'رسالة جديدة من العميل',
          message: `رسالة جديدة بخصوص طلب "${rfq.title}"`,
          type: 'new_message',
          link: `/staff/rfqs/${id}?tab=chat`,
        })
      }
      setNewMessage('')
    }
  }

  const submitRating = async () => {
    if (!rating) return

    const { error } = await supabase
      .from('rfqs')
      .update({ rating, rating_comment: ratingComment })
      .eq('id', id)

    if (error) {
      toast.error('حدث خطأ')
    } else {
      toast.success('شكراً لتقييمك!')
      fetchRFQ()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!rfq) {
    return (
      <DashboardLayout role="user">
        <div className="text-center py-12">
          <p className="text-gray-500">الطلب غير موجود</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">{rfq.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`status-badge ${RFQ_STATUS_COLORS[rfq.status]}`}
              >
                {RFQ_STATUS_LABELS[rfq.status]}
              </span>
              <span className="text-sm text-gray-400">
                {RFQ_PRIORITY_LABELS[rfq.priority]}
              </span>
            </div>
          </div>
          {rfq.quotation_pdf && (
            <a
              href={rfq.quotation_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <Download size={18} />
              تحميل عرض السعر
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'details', label: 'التفاصيل' },
            { key: 'chat', label: 'المحادثة' },
            { key: 'timeline', label: 'سجل المتابعة' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as 'details' | 'chat' | 'timeline')
              }
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-[#1A1A1A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Description */}
            {rfq.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">الوصف</h3>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {rfq.description}
                </p>
              </div>
            )}

            {/* Images */}
            {rfq.images && rfq.images.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <ImageIcon size={18} />
                  الصور المرفقة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rfq.images.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-gray-100 hover:border-[#DCBE81] transition-colors"
                    >
                      <img
                        src={img}
                        alt={`attachment-${i}`}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quotation PDF viewer */}
            {rfq.quotation_pdf && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  عرض السعر
                </h3>
                <iframe
                  src={rfq.quotation_pdf}
                  className="w-full h-96 rounded-xl border border-gray-200"
                  title="Quotation PDF"
                />
              </div>
            )}

            {/* Rating */}
            {rfq.status === 'quoted' && !rfq.rating && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">
                  قيّم عرض السعر
                </h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          star <= rating
                            ? 'text-[#DCBE81] fill-[#DCBE81]'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-[#DCBE81] transition-colors resize-none"
                  placeholder="أضف تعليق (اختياري)"
                />
                <button
                  onClick={submitRating}
                  disabled={!rating}
                  className="px-6 py-2 gold-gradient text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  إرسال التقييم
                </button>
              </div>
            )}

            {rfq.rating && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-2">تقييمك</h3>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= rfq.rating!
                          ? 'text-[#DCBE81] fill-[#DCBE81]'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                {rfq.rating_comment && (
                  <p className="text-gray-500 text-sm">{rfq.rating_comment}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-[500px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>لا توجد رسائل بعد</p>
                  <p className="text-sm mt-1">ابدأ المحادثة مع فريقنا</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          isOwn
                            ? 'bg-[#DCBE81]/10 text-[#1A1A1A]'
                            : 'bg-gray-100 text-[#1A1A1A]'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        {msg.file_url && (
                          <a
                            href={msg.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#DCBE81] hover:underline mt-1 block"
                          >
                            📎 مرفق
                          </a>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors"
                  placeholder="اكتب رسالتك..."
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 gold-gradient text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
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
                  <div
                    key={entry.id}
                    className="flex gap-4 pb-4 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#DCBE81] mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {entry.action}
                      </p>
                      {entry.details && (
                        <p className="text-xs text-gray-500 mt-1">
                          {entry.details}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(entry.created_at).toLocaleDateString('ar-SA')}{' '}
                        {new Date(entry.created_at).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
