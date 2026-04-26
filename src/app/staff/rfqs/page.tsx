'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FileText, Filter, Search } from 'lucide-react'
import type { RFQ, RFQStatus } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS, RFQ_PRIORITY_LABELS } from '@/lib/types'

export default function StaffRFQsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<RFQStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchRFQs = async () => {
      let query = supabase
        .from('rfqs')
        .select('*, user:profiles!rfqs_user_id_fkey(id, company_name, email, whatsapp_number)')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data } = await query
      if (data) setRfqs(data as unknown as RFQ[])
      setLoading(false)
    }

    fetchRFQs()
  }, [user, statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredRfqs = rfqs.filter(
    (rfq) =>
      rfq.title.toLowerCase().includes(search.toLowerCase()) ||
      (rfq.user as any)?.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  const statuses: (RFQStatus | 'all')[] = [
    'all', 'new', 'assigned', 'in_progress', 'quoted', 'negotiation', 'closed',
  ]

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">إدارة الطلبات</h1>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pr-11 pl-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors"
            placeholder="بحث بعنوان الطلب أو اسم الشركة..."
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

        {/* RFQ List */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredRfqs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد طلبات</p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50">
                {filteredRfqs.map((rfq) => (
                  <Link
                    key={rfq.id}
                    href={`/staff/rfqs/${rfq.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-medium text-[#1A1A1A] flex-1 min-w-0 break-words">
                        {rfq.title}
                      </p>
                      <span className={`status-badge shrink-0 ${RFQ_STATUS_COLORS[rfq.status]}`}>
                        {RFQ_STATUS_LABELS[rfq.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {(rfq.user as any)?.company_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {RFQ_PRIORITY_LABELS[rfq.priority]} •{' '}
                      {new Date(rfq.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">الطلب</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">العميل</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">النوع</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">الحالة</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRfqs.map((rfq) => (
                      <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
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
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {RFQ_PRIORITY_LABELS[rfq.priority]}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`status-badge ${RFQ_STATUS_COLORS[rfq.status]}`}>
                            {RFQ_STATUS_LABELS[rfq.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(rfq.created_at).toLocaleDateString('ar-SA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
