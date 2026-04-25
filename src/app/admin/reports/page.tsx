'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import { BarChart3, FileText, Clock, Users, TrendingUp, Star } from 'lucide-react'
import type { RFQ, Profile } from '@/lib/types'

export default function AdminReportsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [staff, setStaff] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const [rfqsRes, staffRes] = await Promise.all([
        supabase.from('rfqs').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').in('role', ['staff', 'admin']),
      ])

      if (rfqsRes.data) setRfqs(rfqsRes.data as RFQ[])
      if (staffRes.data) setStaff(staffRes.data as Profile[])
      setLoading(false)
    }

    fetchData()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalRfqs = rfqs.length
  const closedRfqs = rfqs.filter((r) => r.status === 'closed').length
  const quotedRfqs = rfqs.filter((r) => ['quoted', 'closed'].includes(r.status)).length
  const conversionRate = totalRfqs > 0 ? Math.round((closedRfqs / totalRfqs) * 100) : 0
  const avgRating = rfqs.filter((r) => r.rating).length > 0
    ? (rfqs.filter((r) => r.rating).reduce((acc, r) => acc + (r.rating || 0), 0) /
        rfqs.filter((r) => r.rating).length
      ).toFixed(1)
    : '—'

  // Calculate avg response time (from new to quoted)
  const responseTimesMs = rfqs
    .filter((r) => r.status !== 'new')
    .map((r) => new Date(r.updated_at).getTime() - new Date(r.created_at).getTime())
  const avgResponseHours = responseTimesMs.length > 0
    ? Math.round(responseTimesMs.reduce((a, b) => a + b, 0) / responseTimesMs.length / 3600000)
    : 0

  // Staff performance
  const staffPerformance = staff.map((s) => {
    const assigned = rfqs.filter((r) => r.assigned_to === s.id)
    const completed = assigned.filter((r) => ['quoted', 'closed'].includes(r.status))
    return {
      ...s,
      total: assigned.length,
      completed: completed.length,
      rate: assigned.length > 0 ? Math.round((completed.length / assigned.length) * 100) : 0,
    }
  })

  // Monthly breakdown
  const monthlyData = rfqs.reduce<Record<string, number>>((acc, rfq) => {
    const month = new Date(rfq.created_at).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
    })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">التقارير والإحصائيات</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">نظرة شاملة على أداء المنصة</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: 'إجمالي الطلبات', value: totalRfqs, icon: FileText, color: 'bg-blue-50 text-blue-600' },
            { label: 'تم التسعير', value: quotedRfqs, icon: FileText, color: 'bg-green-50 text-green-600' },
            { label: 'نسبة التحويل', value: `${conversionRate}%`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
            { label: 'متوسط وقت الرد', value: `${avgResponseHours}h`, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'متوسط التقييم', value: avgRating, icon: Star, color: 'bg-orange-50 text-orange-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${stat.color} flex items-center justify-center mb-2 sm:mb-3`}>
                <stat.icon size={18} />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] break-words">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
              <Users size={20} />
              أداء الموظفين
            </h2>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {staffPerformance.length === 0 ? (
              <p className="text-center text-gray-400 py-8">لا يوجد موظفون</p>
            ) : (
              staffPerformance.map((s) => (
                <div key={s.id} className="p-4">
                  <p className="font-medium text-[#1A1A1A] mb-2 break-words">{s.company_name}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>المعينة: <span className="text-gray-700 font-medium">{s.total}</span></span>
                    <span>المنجزة: <span className="text-gray-700 font-medium">{s.completed}</span></span>
                    <span className="text-gray-700 font-medium">{s.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full gold-gradient rounded-full"
                      style={{ width: `${s.rate}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">الموظف</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">المعينة</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">المنجزة</th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-medium text-gray-500">نسبة الإنجاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staffPerformance.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 sm:px-6 py-4 font-medium text-[#1A1A1A]">{s.company_name}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600">{s.total}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600">{s.completed}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full gold-gradient rounded-full"
                            style={{ width: `${s.rate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">{s.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
              <BarChart3 size={20} />
              الطلبات الشهرية
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            {Object.keys(monthlyData).length === 0 ? (
              <p className="text-center text-gray-400 py-8">لا توجد بيانات بعد</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(monthlyData).map(([month, count]) => (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-1 sm:hidden">
                      <span className="text-xs text-gray-600 truncate">{month}</span>
                      <span className="text-xs font-bold text-[#1A1A1A]">{count}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:block text-sm text-gray-600 w-32 shrink-0 truncate">{month}</span>
                      <div className="flex-1 h-7 sm:h-8 bg-gray-50 rounded-lg overflow-hidden">
                        <div
                          className="h-full gold-gradient rounded-lg flex items-center justify-end px-3"
                          style={{
                            width: `${Math.max((count / Math.max(...Object.values(monthlyData))) * 100, 10)}%`,
                          }}
                        >
                          <span className="hidden sm:inline text-xs font-bold text-white">{count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
