'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function NewRfqForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch('/api/account/rfqs', {
      method: 'POST',
      body: new FormData(event.currentTarget),
    })
    const body = await response.json().catch(() => ({}))
    setLoading(false)
    if (!response.ok) {
      setError(body.error || 'تعذر إرسال الطلب')
      return
    }
    router.replace(`/account/rfqs/${body.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="surface-card p-5 md:p-7 space-y-5">
      <label className="block text-sm space-y-2">
        <span>عنوان الطلب</span>
        <input name="title" required minLength={3} className="w-full" placeholder="مثال: توريد مواد سباكة لمشروع جديد" />
      </label>
      <label className="block text-sm space-y-2">
        <span>تفاصيل الطلب</span>
        <textarea name="description" className="w-full min-h-40" placeholder="اكتب الكميات، الموقع، المدة، وأي تفاصيل مهمة." />
      </label>
      <label className="block text-sm space-y-2">
        <span>الملفات</span>
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-6 text-center">
          <UploadCloud className="mx-auto mb-3 text-[var(--gold)]" size={28} />
          <input name="files" type="file" multiple className="w-full" />
          <p className="text-xs text-[var(--fg-muted)] mt-2">يمكن رفع PDF أو صور أو ملفات Office.</p>
        </div>
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        إرسال طلب عرض السعر
      </button>
    </form>
  )
}