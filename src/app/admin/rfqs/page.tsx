'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FileText, Filter, Search, UserPlus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { RFQ, RFQStatus, Profile } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS, RFQ_PRIORITY_LABELS } from '@/lib/types'

export default function AdminRFQsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [staff, setStaff] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<RFQStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      let query = supabase
        .from('rfqs')
        .select('*, user:profiles!rfqs_user_id_fkey(id, company_name, email), staff:profiles!rfqs_assigned_to_fkey(id, company_name)')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const [rfqsRes, staffRes] = await Promise.all([
        query,
        supabase.from('profiles').select('*').in('role', ['staff', 'admin']),
      ])

      if (rfqsRes.data) setRfqs(rfqsRes.data as unknown as RFQ[])
      if (staffRes.data) setStaff(staffRes.data as Profile[])
      setLoading(false)
    }

    fetchData()
  }, [user, statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const deleteRfq = async (rfqId: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف طلب "${title}"؟ سيتم الحذف نهائياً.`)) return
    // Delete related data first
    await Promise.all([
      supabase.from('chat_messages').delete().eq('rfq_id', rfqId),
      supabase.from('notifications').delete().match({ link: `/staff/rfqs/${rfqId}` }),
      supabase.from('notifications').delete().match({ link: `/dashboard/rfqs/${rfqId}` }),
    ])
    const { error } = await supabase.from('rfqs').delete().eq('id', rfqId)
    if (error) {
      toast.error('خطأ في الحذف: ' + error.message)
    } else {
      setRfqs((prev) => prev.filter((r) => r.id !== rfqId))
      toast.success('تم حذف الطلب')
    }
  }

  const assignToStaff = async (rfqId: string, staffId: string) => {
    const { error } = await supabase
      .from('rfqs')
      .update({ assigned_to: staffId, status: 'assigned' })
      .eq('id', rfqId)

    if (error) {
      toast.error('حدث خطأ')
    } else {
      toast.success('تم التعيين بنجاح')
      // Refresh
      const { data } = await supabase
        .from('rfqs')
        .select('*, user:profiles!rfqs_user_id_fkey(id, company_name, email), staff:profiles!rfqs_assigned_to_fkey(id, company_name)')
        .order('created_at', { ascending: false })
      if (data) setRfqs(data as unknown as RFQ[])
    }
  }

  const filteredRfqs = rfqs.filter(
    (rfq) =>
      rfq.title.toLowerCase().includes(search.toLowerCase()) ||
      (rfq.user as any)?.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  const statuses: (RFQStatus | 'all')[] = [
    'all', 'new', 'assigned', 'in_progress', 'quoted', 'negotiation', 'closed',
  ]

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">إدارة جميع الطلبات</h1>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-[#DCBE81]"
            placeholder="بحث..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={16} className="text-gray-400 shrink-0" />
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'gold-gradient text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#DCBE81]'
              }`}
            >
              {status === 'all' ? 'الكل' : RFQ_STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">الطلب</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">العميل</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">الحالة</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">المعين إليه</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">تعيين</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">التاريخ</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/staff/rfqs/${rfq.id}`}
                          className="font-medium text-[#1A1A1A] hover:text-[#DCBE81]"
                        >
                          {rfq.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {(rfq.user as any)?.company_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${RFQ_STATUS_COLORS[rfq.status]}`}>
                          {RFQ_STATUS_LABELS[rfq.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {(rfq.staff as any)?.company_name || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={rfq.assigned_to || ''}
                          onChange={(e) => assignToStaff(rfq.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#DCBE81]"
                        >
                          <option value="">اختر موظف</option>
                          {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.company_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(rfq.created_at).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteRfq(rfq.id, rfq.title)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                          title="حذف الطلب"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
