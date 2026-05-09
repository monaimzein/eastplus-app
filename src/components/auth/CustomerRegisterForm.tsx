'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type FormState = {
  company_name: string
  commercial_registration: string
  vat_number: string
  whatsapp_number: string
  email: string
  national_address: string
  password: string
}

const initialState: FormState = {
  company_name: '',
  commercial_registration: '',
  vat_number: '',
  whatsapp_number: '',
  email: '',
  national_address: '',
  password: '',
}

export default function CustomerRegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialState)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setNotice('')

    if (!/^05\d{8}$/.test(form.whatsapp_number)) {
      setLoading(false)
      setError('رقم الواتساب يجب أن يكون بصيغة 05XXXXXXXX')
      return
    }

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          role: 'user',
          company_name: form.company_name,
          commercial_registration: form.commercial_registration,
          vat_number: form.vat_number,
          whatsapp_number: form.whatsapp_number,
          national_address: form.national_address,
        },
      },
    })

    setLoading(false)
    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      router.replace('/account')
      router.refresh()
      return
    }

    setNotice('تم إنشاء الحساب. تحقق من بريدك الإلكتروني إذا كان تأكيد البريد مفعلاً في Supabase.')
  }

  const setField = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }))

  return (
    <form onSubmit={submit} className="surface-card p-6 md:p-8 space-y-4 w-full max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-2">إنشاء حساب عميل</h1>
        <p className="text-sm text-[var(--fg-muted)]">بيانات الحساب ستستخدم لطلبات عروض الأسعار والملفات والمراسلات.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block text-sm space-y-2">
          <span>اسم الشركة</span>
          <input value={form.company_name} onChange={(event) => setField('company_name', event.target.value)} required className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>السجل التجاري</span>
          <input value={form.commercial_registration} onChange={(event) => setField('commercial_registration', event.target.value)} required className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>الرقم الضريبي</span>
          <input value={form.vat_number} onChange={(event) => setField('vat_number', event.target.value)} required className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>واتساب</span>
          <input value={form.whatsapp_number} onChange={(event) => setField('whatsapp_number', event.target.value)} placeholder="05XXXXXXXX" required className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>البريد الإلكتروني</span>
          <input type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} required className="w-full" />
        </label>
        <label className="block text-sm space-y-2">
          <span>كلمة السر</span>
          <input type="password" value={form.password} onChange={(event) => setField('password', event.target.value)} minLength={8} required className="w-full" />
        </label>
      </div>
      <label className="block text-sm space-y-2">
        <span>العنوان الوطني</span>
        <input value={form.national_address} onChange={(event) => setField('national_address', event.target.value)} required className="w-full" />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {notice && <p className="text-sm text-emerald-400">{notice}</p>}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        <UserPlus size={16} />
        إنشاء الحساب
      </button>
      <p className="text-sm text-[var(--fg-muted)]">
        لديك حساب؟ <Link href="/account/login" className="text-[var(--gold)]">تسجيل الدخول</Link>
      </p>
    </form>
  )
}