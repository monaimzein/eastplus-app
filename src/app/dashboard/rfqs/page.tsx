'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FileText, Filter } from 'lucide-react'
import type { RFQ, RFQStatus } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS, RFQ_PRIORITY_LABELS } from '@/lib/types'

export default function UserRFQsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<RFQStatus | 'all'>('all')

  useEffect(() => {
    if (!user) return

    const fetchRFQs = async () => {
      let query = supabase
        .from('rfqs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data } = await query
      if (data) setRfqs(data as RFQ[])
      setLoading(false)
    }

    fetchRFQs()
  }, [user, statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const statuses: (RFQStatus | 'all')[] = [
    'all',
    'new',
    'assigned',
    'in_progress',
    'quoted',
    'negotiation',
    'closed',
  ]

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">
          طلبات عروض الأسعار
        </h1>

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
        <div className="bg-white rounded-2xl border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : rfqs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد طلبات</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rfqs.map((rfq) => (
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
