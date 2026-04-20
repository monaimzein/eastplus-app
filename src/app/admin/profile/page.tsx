'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/lib/store'

export default function AdminProfilePage() {
  const { user } = useAuth()
  const supabase = createClient()
  const profile = useAuthStore((s) => s.user)
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    whatsapp: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        email: profile.email || '',
        whatsapp: profile.whatsapp_number || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        company_name: formData.company_name,
        whatsapp_number: formData.whatsapp,
      })
      .eq('id', user.id)

    if (error) {
      toast.error('حدث خطأ أثناء الحفظ')
    } else {
      toast.success('تم تحديث الملف الشخصي')
    }
    setSaving(false)
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">الملف الشخصي</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData((p) => ({ ...p, company_name: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">واتساب</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData((p) => ({ ...p, whatsapp: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81]"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
