import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/guards'
import { employeeSchema } from '@/lib/validators/auth'

export async function POST(request: Request) {
  const actor = await requireAdmin()
  const body = await request.json().catch(() => ({}))
  const parsed = employeeSchema.required({ password: true }).safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.full_name,
      job_title: parsed.data.job_title,
      role: parsed.data.role,
    },
  })

  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message ?? 'تعذر إنشاء الموظف' }, { status: 500 })
  }

  await admin.from('profiles').upsert({
    id: created.user.id,
    email: parsed.data.email,
    full_name: parsed.data.full_name,
    company_name: parsed.data.full_name,
    job_title: parsed.data.job_title,
    role: parsed.data.role,
    is_active: true,
  })

  await admin.from('audit_logs').insert({
    actor_id: actor.id,
    action: 'employee_created',
    target_type: 'profile',
    target_id: created.user.id,
    metadata: { role: parsed.data.role },
  })

  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const actor = await requireAdmin()
  const body = await request.json().catch(() => ({}))
  const id = String(body.id || '')
  if (!id) return NextResponse.json({ error: 'معرف الموظف مطلوب' }, { status: 400 })

  const parsed = employeeSchema.partial({ password: true }).safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }, { status: 400 })
  }

  const admin = createAdminClient()
  const updates: Record<string, unknown> = {}
  if (parsed.data.full_name) updates.full_name = parsed.data.full_name
  if (parsed.data.job_title) updates.job_title = parsed.data.job_title
  if (parsed.data.role) updates.role = parsed.data.role
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active

  const { error } = await admin.from('profiles').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (parsed.data.email || parsed.data.password) {
    const authUpdates: { email?: string; password?: string; user_metadata?: Record<string, unknown> } = {}
    if (parsed.data.email) authUpdates.email = parsed.data.email
    if (parsed.data.password) authUpdates.password = parsed.data.password
    authUpdates.user_metadata = {
      full_name: parsed.data.full_name,
      job_title: parsed.data.job_title,
      role: parsed.data.role,
    }
    await admin.auth.admin.updateUserById(id, authUpdates)
  }

  await admin.from('audit_logs').insert({
    actor_id: actor.id,
    action: 'employee_updated',
    target_type: 'profile',
    target_id: id,
    metadata: updates,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const actor = await requireAdmin()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'معرف الموظف مطلوب' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({ is_active: false }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from('audit_logs').insert({
    actor_id: actor.id,
    action: 'employee_disabled',
    target_type: 'profile',
    target_id: id,
    metadata: {},
  })

  return NextResponse.json({ ok: true })
}