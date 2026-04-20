'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FileText, Users, TrendingUp, Clock, CheckCircle, BarChart3 } from 'lucide-react'
import type { RFQ, Profile } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS, RFQ_PRIORITY_LABELS } from '@/lib/types'

export default function AdminDashboard() {
  const { user } = useAuth()
  const supabase = createClient()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [staff, setStaff] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const [rfqsRes, staffRes] = await Promise.all([
        supabase
          .from('rfqs')
          .select('*, user:profiles!rfqs_user_id_fkey(id, company_name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('*')
          .in('role', ['staff', 'admin']),
      ])

      if (rfqsRes.data) setRfqs(rfqsRes.data as unknown as RFQ[])
      if (staffRes.data) setStaff(staffRes.data as Profile[])
      setLoading(false)
    }

    fetchData()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const closedRfqs = rfqs.filter((r) => r.status === 'closed').length
  const conversionRate = rfqs.length > 0 ? Math.round((closedRfqs / rfqs.length) * 100) : 0

  const stats = [
    { label: 'إجمالي الطلبات', value: rfqs.length, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'طلبات جديدة', value: rfqs.filter((r) => r.status === 'new').length, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'نسبة التحويل', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'الموظفون', value: staff.length, icon: Users, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">لوحة تحكم المدير</h1>
          <p className="text-gray-500 mt-1">نظرة عامة على النظام</p>
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

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/rfqs"
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#DCBE81]/30 hover:shadow-lg transition-all"
          >
            <FileText size={24} className="text-[#DCBE81] mb-3" />
            <h3 className="font-bold text-[#1A1A1A]">إدارة الطلبات</h3>
            <p className="text-sm text-gray-500 mt-1">عرض وتعيين جميع الطلبات</p>
          </Link>
          <Link
            href="/admin/staff"
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#DCBE81]/30 hover:shadow-lg transition-all"
          >
            <Users size={24} className="text-[#DCBE81] mb-3" />
            <h3 className="font-bold text-[#1A1A1A]">إدارة الموظفين</h3>
            <p className="text-sm text-gray-500 mt-1">إضافة وإدارة حسابات الموظفين</p>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#DCBE81]/30 hover:shadow-lg transition-all"
          >
            <BarChart3 size={24} className="text-[#DCBE81] mb-3" />
            <h3 className="font-bold text-[#1A1A1A]">التقارير</h3>
            <p className="text-sm text-gray-500 mt-1">إحصائيات وتقارير الأداء</p>
          </Link>
        </div>

        {/* Recent RFQs */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1A1A1A]">أحدث الطلبات</h2>
            <Link href="/admin/rfqs" className="text-sm text-[#DCBE81] hover:underline">عرض الكل</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rfqs.slice(0, 8).map((rfq) => (
                <Link
                  key={rfq.id}
                  href={`/admin/rfqs/${rfq.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DCBE81]/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#DCBE81]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1A1A] truncate">{rfq.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(rfq.user as any)?.company_name} • {new Date(rfq.created_at).toLocaleDateString('ar-SA')}
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
