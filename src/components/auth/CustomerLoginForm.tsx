'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { getAuthErrorMessage } from '@/lib/auth/error-message'
import { createClient } from '@/lib/supabase/client'

export default function CustomerLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError || !data.user) {
        setLoading(false)
        setError(getAuthErrorMessage(signInError))
        return
      }

      const { data: profile } = await supabase.from('profiles').select('role,is_active').eq('id', data.user.id).maybeSingle()
      if (!profile || profile.role !== 'user' || profile.is_active === false) {
        await supabase.auth.signOut()
        setLoading(false)
        setError('هذا الدخول مخصص لحسابات العملاء فقط')
        return
      }

      router.replace(next.startsWith('/account') ? next : '/account')
      router.refresh()
    } catch {
      setLoading(false)
      setError('تعذر الوصول إلى خدمة تسجيل الدخول. تحقق من إعدادات Supabase على الاستضافة.')
    }
  }

  return (
    <form onSubmit={submit} className="surface-card p-6 md:p-8 space-y-4 w-full max-w-md">
      <div>
        <h1 className="text-2xl font-semibold mb-2">دخول العملاء</h1>
        <p className="text-sm text-[var(--fg-muted)]">تابع طلباتك وملفاتك ورسائلك من مكان واحد.</p>
      </div>
      <label className="block text-sm space-y-2">
        <span>البريد الإلكتروني</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full" />
      </label>
      <label className="block text-sm space-y-2">
        <span>كلمة السر</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full" />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        <LogIn size={16} />
        دخول
      </button>
      <p className="text-sm text-[var(--fg-muted)]">
        ليس لديك حساب؟ <Link href="/account/register" className="text-[var(--gold)]">إنشاء حساب عميل</Link>
      </p>
    </form>
  )
}