'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, Users, TrendingUp } from 'lucide-react'
import type { RFQ } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS, RFQ_PRIORITY_LABELS } from '@/lib/types'

export default function StaffDashboard() {
  const { user } = useAuth()
  const supabase = createClient()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchRFQs()

    const channel = supabase
      .channel('staff-rfqs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rfqs' }, () => {
        fetchRFQs()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRFQs = async () => {
    const { data } = await supabase
      .from('rfqs')
      .select('*, user:profiles!rfqs_user_id_fkey(id, company_name, email, whatsapp_number)')
      .order('created_at', { ascending: false })

    if (data) setRfqs(data as unknown as RFQ[])
    setLoading(false)
  }

  const stats = [
    {
      label: 'طلبات جديدة',
      value: rfqs.filter((r) => r.status === 'new').length,
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'قيد التنفيذ',
      value: rfqs.filter((r) => ['assigned', 'in_progress'].includes(r.status)).length,
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
      label: 'إجمالي الطلبات',
      value: rfqs.length,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  return (
    <DashboardLayout role="staff">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            مرحباً، {user?.company_name}
          </h1>
          <p className="text-gray-500 mt-1">لوحة تحكم الموظفين</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
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
            <h2 className="text-lg font-bold text-[#1A1A1A]">أحدث الطلبات</h2>
            <Link href="/staff/rfqs" className="text-sm text-[#DCBE81] hover:underline">
              عرض الكل
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rfqs.slice(0, 10).map((rfq) => (
                <Link
                  key={rfq.id}
                  href={`/staff/rfqs/${rfq.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DCBE81]/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#DCBE81]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1A1A] truncate">{rfq.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(rfq.user as any)?.company_name} • {RFQ_PRIORITY_LABELS[rfq.priority]} •{' '}
                      {new Date(rfq.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <span className={`status-badge ${RFQ_STATUS_COLORS[rfq.status]}`}>
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
