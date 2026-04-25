'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import type { RFQ } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS, RFQ_PRIORITY_LABELS } from '@/lib/types'

// Module-level client - created once, not on every render
const supabase = createClient()

export default function UserDashboard() {
  const { user } = useAuth()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchRFQs = async () => {
      const { data } = await supabase
        .from('rfqs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setRfqs(data as RFQ[])
      setLoading(false)
    }

    fetchRFQs()

    // Realtime updates
    const channel = supabase
      .channel('user-rfqs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rfqs',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchRFQs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const stats = [
    {
      label: 'إجمالي الطلبات',
      value: rfqs.length,
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'قيد التنفيذ',
      value: rfqs.filter((r) => ['new', 'assigned', 'in_progress'].includes(r.status)).length,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'تم التسعير',
      value: rfqs.filter((r) => r.status === 'quoted').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'تحتاج متابعة',
      value: rfqs.filter((r) => r.status === 'negotiation').length,
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-50',
    },
  ]

  return (
    <DashboardLayout role="user">
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              مرحباً، {user?.company_name}
            </h1>
            <p className="text-gray-500 mt-1">إليك نظرة عامة على طلباتك</p>
          </div>
          <Link
            href="/rfq/new"
            className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            طلب جديد
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent RFQs */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1A1A1A]">آخر الطلبات</h2>
            <Link
              href="/dashboard/rfqs"
              className="text-sm text-[#DCBE81] hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : rfqs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">لا توجد طلبات بعد</p>
              <Link
                href="/rfq/new"
                className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Plus size={18} />
                أرسل أول طلب
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rfqs.slice(0, 5).map((rfq) => (
                <Link
                  key={rfq.id}
                  href={`/dashboard/rfqs/${rfq.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DCBE81]/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#DCBE81]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1A1A] truncate">
                      {rfq.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {RFQ_PRIORITY_LABELS[rfq.priority]} •{' '}
                      {new Date(rfq.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <span
                    className={`status-badge ${RFQ_STATUS_COLORS[rfq.status]}`}
                  >
                    {RFQ_STATUS_LABELS[rfq.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
