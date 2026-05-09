import { Download, Eye, FileText } from 'lucide-react'

export type WorkspaceFile = {
  id: string
  file_name: string
  owner_type: 'customer' | 'company'
  mime_type?: string | null
  signed_url?: string | null
  created_at: string
}

export default function FileList({ files, owner }: { files: WorkspaceFile[]; owner: 'customer' | 'company' }) {
  const filtered = files.filter((file) => file.owner_type === owner)

  return (
    <div className="space-y-2">
      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--fg-muted)]">لا توجد ملفات.</p>
      ) : filtered.map((file) => {
        const mimeType = file.mime_type || ''
        const isImage = mimeType.startsWith('image/')
        const isPdf = mimeType === 'application/pdf'

        return (
          <article key={file.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 space-y-3">
            {file.signed_url && isImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={file.signed_url} alt={file.file_name} className="h-56 w-full rounded-lg border border-[var(--border)] object-cover" loading="lazy" />
            )}

            {file.signed_url && isPdf && (
              <iframe src={file.signed_url} title={file.file_name} className="h-72 w-full rounded-lg border border-[var(--border)] bg-white" />
            )}

            {(!file.signed_url || (!isImage && !isPdf)) && (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg)] text-[var(--fg-muted)]">
                <div className="text-center">
                  <FileText size={22} className="mx-auto mb-2 text-[var(--gold)]" />
                  <p className="text-sm">لا توجد معاينة مباشرة لهذا النوع.</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{file.file_name}</p>
                <p className="text-xs text-[var(--fg-muted)] mt-1">{new Date(file.created_at).toLocaleDateString('ar-SA')}</p>
              </div>
              {file.signed_url && (
                <div className="flex items-center gap-2">
                  <a href={file.signed_url} target="_blank" rel="noreferrer" className="btn-outline !py-2 !px-3 text-xs">
                    <Eye size={14} />
                    فتح
                  </a>
                  <a href={file.signed_url} download={file.file_name} className="btn-primary !py-2 !px-3 text-xs">
                    <Download size={14} />
                    تنزيل
                  </a>
                </div>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}