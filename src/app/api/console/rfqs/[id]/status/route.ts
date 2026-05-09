import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const STATUSES = new Set(['new', 'in_progress', 'quote_sent', 'closed'])

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role,is_active').eq('id', user.id).maybeSingle()
  if (!profile || profile.is_active === false || !['staff', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const status = String(body.status || '')
  const message = String(body.message || '').trim()
  if (!STATUSES.has(status)) {
    return NextResponse.json({ error: 'حالة غير صحيحة' }, { status: 400 })
  }

  const updatePayload: Record<string, string | null> = { status }
  if (status === 'closed') updatePayload.closed_at = new Date().toISOString()

  const { data: rfq, error } = await supabase
    .from('rfqs')
    .update(updatePayload)
    .eq('id', id)
    .select('id,user_id,title')
    .single()

  if (error || !rfq) return NextResponse.json({ error: error?.message ?? 'تعذر تحديث الطلب' }, { status: 500 })

  await supabase.from('rfq_timeline').insert({
    rfq_id: id,
    created_by: user.id,
    status,
    message: message || `تم تحديث الحالة إلى ${status}`,
  })

  try {
    const admin = createAdminClient()
    await admin.from('notifications').insert({
      user_id: rfq.user_id,
      title: 'تحديث على طلبك',
      message: message || `تم تحديث حالة الطلب: ${rfq.title}`,
      type: 'rfq_update',
      link: `/account/rfqs/${id}`,
    })
  } catch {}

  return NextResponse.json({ ok: true })
}