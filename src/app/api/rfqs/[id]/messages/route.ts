import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { chatMessageSchema } from '@/lib/validators/rfq'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const payload = await request.json().catch(() => null)
  const parsed = chatMessageSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'رسالة غير صحيحة' }, { status: 400 })
  }

  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .select('id,user_id,assigned_to,title')
    .eq('id', id)
    .single()

  if (rfqError || !rfq) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })

  const { error } = await supabase.from('chat_messages').insert({
    rfq_id: id,
    sender_id: user.id,
    content: parsed.data.content,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    const admin = createAdminClient()
    const { data: sender } = await admin.from('profiles').select('role,company_name,full_name').eq('id', user.id).maybeSingle()
    const recipients = sender?.role === 'user'
      ? [rfq.assigned_to].filter(Boolean)
      : [rfq.user_id]
    if (recipients.length) {
      await admin.from('notifications').insert(
        recipients.map((userId) => ({
          user_id: userId,
          title: 'رسالة جديدة',
          message: `رسالة على الطلب: ${rfq.title}`,
          type: 'new_message',
          link: sender?.role === 'user' ? `/console/staff/rfqs/${id}` : `/account/rfqs/${id}`,
        })),
      )
    }
  } catch {}

  return NextResponse.json({ ok: true })
}