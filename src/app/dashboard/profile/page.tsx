'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    company_name: user?.company_name || '',
    commercial_registration: user?.commercial_registration || '',
    vat_number: user?.vat_number || '',
    whatsapp_number: user?.whatsapp_number || '',
    national_address: user?.national_address || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', user.id)

    if (error) {
      toast.error('حدث خطأ أثناء الحفظ')
    } else {
      toast.success('تم تحديث الملف الشخصي بنجاح')
    }
    setSaving(false)
  }

  const fields = [
    { name: 'company_name', label: 'اسم الشركة' },
    { name: 'commercial_registration', label: 'السجل التجاري', dir: 'ltr' },
    { name: 'vat_number', label: 'الرقم الضريبي', dir: 'ltr' },
    { name: 'whatsapp_number', label: 'رقم الواتساب', dir: 'ltr' },
    { name: 'national_address', label: 'العنوان الوطني' },
  ]

  return (
    <DashboardLayout role="user">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">الملف الشخصي</h1>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5"
        >
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-400"
              dir="ltr"
            />
          </div>

          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm text-gray-500 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors"
                dir={field.dir || 'rtl'}
              />
            </div>
          ))}

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
