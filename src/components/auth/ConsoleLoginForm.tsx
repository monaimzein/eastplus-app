'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ConsoleLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/console/staff'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(searchParams.get('disabled') ? 'تم تعطيل هذا الحساب.' : '')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError || !data.user) {
      setLoading(false)
      setError('بيانات الدخول غير صحيحة')
      return
    }
    const { data: profile } = await supabase.from('profiles').select('role,is_active').eq('id', data.user.id).maybeSingle()
    if (!profile || !['staff', 'admin'].includes(profile.role) || profile.is_active === false) {
      await supabase.auth.signOut()
      setLoading(false)
      setError('هذا الدخول مخصص للموظفين والإدارة فقط')
      return
    }
    const fallback = profile.role === 'admin' ? '/console/admin' : '/console/staff'
    router.replace(next.startsWith('/console') ? next : fallback)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="surface-card p-6 md:p-8 space-y-4 w-full max-w-md">
      <div>
        <h1 className="text-2xl font-semibold mb-2">دخول الكونسول</h1>
        <p className="text-sm text-[var(--fg-muted)]">للموظفين والإدارة فقط.</p>
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
        <Shield size={16} />
        دخول الكونسول
      </button>
    </form>
  )
}