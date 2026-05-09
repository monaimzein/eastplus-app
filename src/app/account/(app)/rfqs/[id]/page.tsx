import { notFound } from 'next/navigation'
import RfqTabs, { type TimelineItem } from '@/components/workspace/RfqTabs'
import StatusBadge from '@/components/workspace/StatusBadge'
import { requireCustomer } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'
import type { WorkspaceFile } from '@/components/workspace/FileList'
import type { WorkspaceMessage } from '@/components/workspace/ChatPanel'

export const dynamic = 'force-dynamic'

export default async function AccountRfqDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireCustomer()
  const supabase = await createClient()
  const { data: rfq } = await supabase
    .from('rfqs')
    .select('id,title,description,status,created_at,updated_at')
    .eq('id', id)
    .single()
  if (!rfq) notFound()

  const [filesResult, messagesResult, timelineResult] = await Promise.all([
    supabase.from('rfq_files').select('id,file_name,owner_type,bucket,path,mime_type,created_at').eq('rfq_id', id).order('created_at', { ascending: false }),
    supabase.from('chat_messages').select('id,content,created_at,sender:profiles(company_name,full_name,role)').eq('rfq_id', id).order('created_at', { ascending: true }),
    supabase.from('rfq_timeline').select('id,message,status,created_at').eq('rfq_id', id).order('created_at', { ascending: false }),
  ])
  const rawFiles = filesResult.data ?? []
  const messages = messagesResult.data ?? []
  const timeline = timelineResult.data ?? []

  const files: WorkspaceFile[] = await Promise.all(rawFiles.map(async (file) => {
    const { data } = await supabase.storage.from(file.bucket).createSignedUrl(file.path, 600)
    return { ...file, signed_url: data?.signedUrl ?? null } as WorkspaceFile
  }))

  return (
    <div className="space-y-5">
      <div className="surface-card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{rfq.title}</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2">أُرسل في {new Date(rfq.created_at).toLocaleString('ar-SA')}</p>
          </div>
          <StatusBadge status={rfq.status} />
        </div>
        {rfq.description && <p className="mt-5 leading-8 text-[var(--fg-muted)] whitespace-pre-wrap">{rfq.description}</p>}
      </div>
      <RfqTabs rfqId={id} files={files} messages={messages as WorkspaceMessage[]} timeline={timeline as TimelineItem[]} />
    </div>
  )
}