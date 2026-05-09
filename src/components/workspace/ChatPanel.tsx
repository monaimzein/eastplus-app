'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export type WorkspaceMessage = {
  id: string
  content: string
  created_at: string
  sender?: { company_name?: string | null; full_name?: string | null; role?: string | null } | null
}

export default function ChatPanel({ rfqId, messages }: { rfqId: string; messages: WorkspaceMessage[] }) {
  const [items, setItems] = useState(messages)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError('')
    const response = await fetch(`/api/rfqs/${rfqId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    setLoading(false)
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      setError(body.error || 'تعذر إرسال الرسالة')
      return
    }
    setItems((prev) => [...prev, { id: crypto.randomUUID(), content, created_at: new Date().toISOString() }])
    setContent('')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[420px] overflow-y-auto pe-1">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--fg-muted)]">لا توجد محادثات بعد.</p>
        ) : items.map((message) => (
          <div key={message.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <div className="text-xs text-[var(--fg-muted)] mb-1">
              {message.sender?.company_name || message.sender?.full_name || 'مستخدم'} · {new Date(message.created_at).toLocaleString('ar-SA')}
            </div>
            <p className="text-sm leading-7 whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input value={content} onChange={(event) => setContent(event.target.value)} className="flex-1" placeholder="اكتب رسالة..." />
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          <Send size={15} />
          إرسال
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}