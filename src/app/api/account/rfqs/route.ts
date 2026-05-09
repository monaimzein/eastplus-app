import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rfqSchema } from '@/lib/validators/rfq'

const MAX_FILES = 8

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })

  const formData = await request.formData()
  const parsed = rfqSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,is_active,company_name')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'user' || profile?.is_active === false) {
    return NextResponse.json({ error: 'هذا المسار مخصص للعملاء فقط' }, { status: 403 })
  }

  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: 'new',
    })
    .select('id,title')
    .single()

  if (rfqError || !rfq) {
    return NextResponse.json({ error: rfqError?.message ?? 'تعذر إنشاء الطلب' }, { status: 500 })
  }

  const files = formData
    .getAll('files')
    .filter((file): file is File => file instanceof File && file.size > 0)
    .slice(0, MAX_FILES)

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${rfq.id}/${crypto.randomUUID()}-${safeName}`
    const { error: uploadError } = await supabase.storage
      .from('rfq-files')
      .upload(path, file, { contentType: file.type || undefined })

    if (uploadError) continue

    await supabase.from('rfq_files').insert({
      rfq_id: rfq.id,
      uploaded_by: user.id,
      owner_type: 'customer',
      bucket: 'rfq-files',
      path,
      file_name: file.name,
      mime_type: file.type || null,
      file_size: file.size,
    })
  }

  await supabase.from('rfq_timeline').insert({
    rfq_id: rfq.id,
    created_by: user.id,
    status: 'new',
    message: 'تم إرسال طلب عرض السعر',
  })

  try {
    const admin = createAdminClient()
    const { data: staff } = await admin
      .from('profiles')
      .select('id')
      .in('role', ['staff', 'admin'])
      .eq('is_active', true)

    if (staff?.length) {
      await admin.from('notifications').insert(
        staff.map((member) => ({
          user_id: member.id,
          title: 'طلب عرض سعر جديد',
          message: `${profile?.company_name || 'عميل'} أرسل طلباً جديداً: ${rfq.title}`,
          type: 'rfq_update',
          priority: 'normal',
          link: `/console/staff/rfqs/${rfq.id}`,
        })),
      )
    }
  } catch {
    // Notifications should not block RFQ creation.
  }

  return NextResponse.json({ ok: true, id: rfq.id })
}