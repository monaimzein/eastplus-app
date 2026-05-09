'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function QuotationUploadForm({ rfqId }: { rfqId: string }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch(`/api/console/rfqs/${rfqId}/quotation`, {
      method: 'POST',
      body: new FormData(event.currentTarget),
    })
    const body = await response.json().catch(() => ({}))
    setLoading(false)
    if (!response.ok) {
      setError(body.error || 'تعذر رفع عرض السعر')
      return
    }
    event.currentTarget.reset()
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="surface-card p-4 space-y-3">
      <h3 className="font-semibold">رفع عرض السعر</h3>
      <label className="block text-sm space-y-2">
        <span>ملف PDF</span>
        <input name="file" type="file" accept="application/pdf" required className="w-full" />
      </label>
      <label className="block text-sm space-y-2">
        <span>ملاحظات داخلية أو للعميل</span>
        <textarea name="notes" className="w-full min-h-20" />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        <UploadCloud size={15} />
        رفع العرض
      </button>
    </form>
  )
}