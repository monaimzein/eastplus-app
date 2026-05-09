'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const statuses = [
  { value: 'new', label: 'جديد' },
  { value: 'in_progress', label: 'جار' },
  { value: 'quote_sent', label: 'تم إرسال عرض السعر' },
  { value: 'closed', label: 'مغلق' },
]

export default function StatusUpdateForm({ rfqId, currentStatus }: { rfqId: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch(`/api/console/rfqs/${rfqId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, message }),
    })
    const body = await response.json().catch(() => ({}))
    setLoading(false)
    if (!response.ok) {
      setError(body.error || 'تعذر تحديث الحالة')
      return
    }
    setMessage('')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="surface-card p-4 space-y-3">
      <h3 className="font-semibold">تحديث الحالة</h3>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full">
        {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="w-full min-h-24" placeholder="رسالة تظهر للعميل" />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">حفظ التحديث</button>
    </form>
  )
}