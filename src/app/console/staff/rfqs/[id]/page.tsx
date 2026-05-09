import { notFound } from 'next/navigation'
import QuotationUploadForm from '@/components/console/QuotationUploadForm'
import StatusUpdateForm from '@/components/console/StatusUpdateForm'
import RfqTabs, { type TimelineItem } from '@/components/workspace/RfqTabs'
import StatusBadge from '@/components/workspace/StatusBadge'
import { requireStaff } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'
import type { WorkspaceFile } from '@/components/workspace/FileList'
import type { WorkspaceMessage } from '@/components/workspace/ChatPanel'

export const dynamic = 'force-dynamic'

export default async function StaffRfqDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireStaff()
  const supabase = await createClient()
  const { data: rfq } = await supabase
    .from('rfqs')
    .select('id,title,description,status,created_at,updated_at,customer:profiles!rfqs_user_id_fkey(company_name,commercial_registration,vat_number,whatsapp_number,email,national_address)')
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
  const customer = Array.isArray(rfq.customer) ? rfq.customer[0] : rfq.customer
  const whatsapp = customer?.whatsapp_number ? `https://wa.me/966${customer.whatsapp_number.slice(1)}` : null

  return (
    <div className="space-y-5">
      <div className="grid xl:grid-cols-[1fr_360px] gap-5">
        <section className="surface-card p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">{rfq.title}</h1>
              <p className="text-sm text-[var(--fg-muted)] mt-2">{new Date(rfq.created_at).toLocaleString('ar-SA')}</p>
            </div>
            <StatusBadge status={rfq.status} />
          </div>
          {rfq.description && <p className="mt-5 leading-8 text-[var(--fg-muted)] whitespace-pre-wrap">{rfq.description}</p>}
        </section>
        <aside className="surface-card p-5 space-y-3">
          <h2 className="text-xl font-semibold">بيانات العميل</h2>
          <p className="font-medium">{customer?.company_name}</p>
          <p className="text-sm text-[var(--fg-muted)]">{customer?.email}</p>
          <p className="text-sm text-[var(--fg-muted)]">سجل: {customer?.commercial_registration || '-'}</p>
          <p className="text-sm text-[var(--fg-muted)]">ضريبي: {customer?.vat_number || '-'}</p>
          <p className="text-sm text-[var(--fg-muted)]">العنوان: {customer?.national_address || '-'}</p>
          {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-outline w-full justify-center">فتح واتساب</a>}
        </aside>
      </div>
      <div className="grid xl:grid-cols-[1fr_360px] gap-5 items-start">
        <RfqTabs rfqId={id} files={files} messages={messages as WorkspaceMessage[]} timeline={timeline as TimelineItem[]} />
        <div className="space-y-4">
          <StatusUpdateForm rfqId={id} currentStatus={rfq.status} />
          <QuotationUploadForm rfqId={id} />
        </div>
      </div>
    </div>
  )
}