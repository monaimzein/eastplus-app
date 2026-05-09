import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

  const formData = await request.formData()
  const file = formData.get('file')
  const notes = formData.get('notes')?.toString() || null
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'ملف عرض السعر مطلوب' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${id}/quotation-${crypto.randomUUID()}-${safeName}`
  const { error: uploadError } = await supabase.storage
    .from('quotations')
    .upload(path, file, { contentType: file.type || 'application/pdf' })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: fileRow, error: fileError } = await supabase
    .from('rfq_files')
    .insert({
      rfq_id: id,
      uploaded_by: user.id,
      owner_type: 'company',
      bucket: 'quotations',
      path,
      file_name: file.name,
      mime_type: file.type || 'application/pdf',
      file_size: file.size,
    })
    .select('id')
    .single()

  if (fileError || !fileRow) return NextResponse.json({ error: fileError?.message ?? 'تعذر حفظ الملف' }, { status: 500 })

  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .update({ status: 'quote_sent' })
    .eq('id', id)
    .select('id,user_id,title')
    .single()

  if (rfqError || !rfq) return NextResponse.json({ error: rfqError?.message ?? 'تعذر تحديث الطلب' }, { status: 500 })

  await supabase.from('quotations').insert({
    rfq_id: id,
    staff_id: user.id,
    file_id: fileRow.id,
    status: 'sent',
    notes,
  })

  await supabase.from('rfq_timeline').insert({
    rfq_id: id,
    created_by: user.id,
    status: 'quote_sent',
    message: 'تم إرسال عرض السعر',
  })

  try {
    const admin = createAdminClient()
    await admin.from('notifications').insert({
      user_id: rfq.user_id,
      title: 'تم إرسال عرض السعر',
      message: `تم رفع عرض السعر للطلب: ${rfq.title}`,
      type: 'quotation',
      link: `/account/rfqs/${id}`,
    })
  } catch {}

  return NextResponse.json({ ok: true })
}