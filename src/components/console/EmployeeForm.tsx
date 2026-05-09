'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EmployeeForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())
    const response = await fetch('/api/admin/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const body = await response.json().catch(() => ({}))
    setLoading(false)
    if (!response.ok) {
      setError(body.error || 'تعذر إنشاء الموظف')
      return
    }
    event.currentTarget.reset()
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="surface-card p-5 space-y-4">
      <h2 className="text-xl font-semibold">إضافة موظف</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <input name="full_name" placeholder="اسم الموظف" required />
        <input name="job_title" placeholder="التايتل الوظيفي" required />
        <input name="email" type="email" placeholder="البريد الإلكتروني" required />
        <input name="password" type="password" placeholder="كلمة السر" minLength={8} required />
        <select name="role" defaultValue="staff">
          <option value="staff">موظف</option>
          <option value="admin">مدير</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={loading} className="btn-primary disabled:opacity-50">إنشاء الموظف</button>
    </form>
  )
}