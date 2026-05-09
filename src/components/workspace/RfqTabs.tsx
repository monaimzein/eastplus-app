'use client'

import { useState } from 'react'
import FileList, { type WorkspaceFile } from './FileList'
import ChatPanel, { type WorkspaceMessage } from './ChatPanel'

export type TimelineItem = {
  id: string
  message: string
  status: string | null
  created_at: string
}

export default function RfqTabs({ rfqId, files, messages, timeline }: {
  rfqId: string
  files: WorkspaceFile[]
  messages: WorkspaceMessage[]
  timeline: TimelineItem[]
}) {
  const [tab, setTab] = useState<'files' | 'chat' | 'updates'>('files')
  const tabs = [
    { id: 'files' as const, label: 'الملفات' },
    { id: 'chat' as const, label: 'المحادثة' },
    { id: 'updates' as const, label: 'التحديثات' },
  ]

  return (
    <div className="surface-card p-4 md:p-6">
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3 mb-5">
        {tabs.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === item.id ? 'bg-[var(--gold)] text-[var(--primary-fg)]' : 'bg-[var(--surface-2)] text-[var(--fg-muted)] hover:text-[var(--fg)]'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'files' && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold mb-3">ملفات العميل</h3>
            <FileList files={files} owner="customer" />
          </div>
          <div>
            <h3 className="font-semibold mb-3">ملفات الشركة</h3>
            <FileList files={files} owner="company" />
          </div>
        </div>
      )}
      {tab === 'chat' && <ChatPanel rfqId={rfqId} messages={messages} />}
      {tab === 'updates' && (
        <div className="space-y-3">
          {timeline.length === 0 ? <p className="text-sm text-[var(--fg-muted)]">لا توجد تحديثات بعد.</p> : timeline.map((item) => (
            <div key={item.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
              <p className="text-sm">{item.message}</p>
              <p className="text-xs text-[var(--fg-muted)] mt-1">{new Date(item.created_at).toLocaleString('ar-SA')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}