'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { MessageSquare, Clock } from 'lucide-react'
import type { RFQ } from '@/lib/types'
import { RFQ_STATUS_LABELS, RFQ_STATUS_COLORS } from '@/lib/types'

export default function AdminChatPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchRFQs = async () => {
      const { data } = await supabase
        .from('rfqs')
        .select('*, user:profiles!rfqs_user_id_fkey(company_name), staff:profiles!rfqs_assigned_to_fkey(company_name)')
        .order('updated_at', { ascending: false })

      if (data) setRfqs(data as unknown as RFQ[])
      setLoading(false)
    }
    fetchRFQs()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">المحادثات</h1>
        <p className="text-gray-500">جميع المحادثات النشطة في النظام</p>

        <div className="bg-white rounded-2xl border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : rfqs.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد محادثات حالياً</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rfqs.map((rfq) => (
                <Link
                  key={rfq.id}
                  href={`/staff/rfqs/${rfq.id}?tab=chat`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#DCBE81]/10 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} className="text-[#DCBE81]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1A1A] truncate">{rfq.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        العميل: {(rfq.user as any)?.company_name}
                      </span>
                      {(rfq as any).staff?.company_name && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            الموظف: {(rfq as any).staff?.company_name}
                          </span>
                        </>
                      )}
                    </div>
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
