import { Mail, Phone, Trash2 } from 'lucide-react'
import { requireStaff } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StaffContactMessagesPage() {
  const profile = await requireStaff()
  const supabase = await createClient()
  const { data: messageRows } = await supabase
    .from('contact_messages')
    .select('id,name,company,email,phone,message,is_read,created_at')
    .order('created_at', { ascending: false })
  const messages = messageRows ?? []

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">رسائل تواصل معنا</h1>
      <div className="grid lg:grid-cols-2 gap-4">
        {messages.length === 0 ? <p className="text-sm text-[var(--fg-muted)]">لا توجد رسائل.</p> : messages.map((item) => {
          const localPhone = item.phone?.replace(/\D/g, '') || ''
          const whatsappNumber = localPhone.startsWith('05') ? `966${localPhone.slice(1)}` : localPhone.startsWith('966') ? localPhone : ''
          const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null

          return (
            <article key={item.id} className="surface-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-[var(--fg-muted)]">{item.company || 'بدون شركة'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!item.is_read && <span className="rounded-full bg-[var(--gold)] px-2 py-1 text-[10px] text-[var(--primary-fg)]">جديد</span>}
                  {profile.role === 'admin' && (
                    <form action={`/api/contact-messages/${item.id}/delete`} method="post">
                      <input type="hidden" name="next" value="/console/staff/contact-messages" />
                      <button type="submit" className="btn-outline !py-2 !px-3 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10">
                        <Trash2 size={13} />
                        حذف
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap">{item.message}</p>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--fg-muted)]">
                <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-colors">
                  <Mail size={13} />
                  {item.email}
                </a>
                {item.phone && (
                  <a href={whatsappHref || `tel:${item.phone}`} target={whatsappHref ? '_blank' : undefined} rel={whatsappHref ? 'noreferrer' : undefined} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-colors" dir="ltr">
                    <Phone size={13} />
                    {item.phone}
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}