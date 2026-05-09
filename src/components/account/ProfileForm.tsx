'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    company_name: profile.company_name || '',
    commercial_registration: profile.commercial_registration || '',
    vat_number: profile.vat_number || '',
    whatsapp_number: profile.whatsapp_number || '',
    national_address: profile.national_address || '',
  })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const setField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setNotice('')
    setError('')
    if (!/^05\d{8}$/.test(form.whatsapp_number)) {
      setError('رقم الواتساب يجب أن يكون بصيغة 05XXXXXXXX')
      return
    }
    const supabase = createClient()
    const { error: updateError } = await supabase.from('profiles').update(form).eq('id', profile.id)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setNotice('تم حفظ التغييرات')
  }

  return (
    <form onSubmit={submit} className="surface-card p-5 md:p-7 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block text-sm space-y-2">
          <span>اسم الشركة</span>
          <input value={form.company_name} onChange={(event) => setField('company_name', event.target.value)} className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>السجل التجاري</span>
          <input value={form.commercial_registration} onChange={(event) => setField('commercial_registration', event.target.value)} className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>الرقم الضريبي</span>
          <input value={form.vat_number} onChange={(event) => setField('vat_number', event.target.value)} className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>واتساب</span>
          <input value={form.whatsapp_number} onChange={(event) => setField('whatsapp_number', event.target.value)} className="w-full" />
        </label>
      </div>
      <label className="block text-sm space-y-2">
        <span>العنوان الوطني</span>
        <input value={form.national_address} onChange={(event) => setField('national_address', event.target.value)} className="w-full" />
      </label>
      {notice && <p className="text-sm text-emerald-400">{notice}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" className="btn-primary">حفظ الملف الشخصي</button>
    </form>
  )
}