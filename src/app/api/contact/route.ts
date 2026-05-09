import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactMessageSchema } from '@/lib/validators/rfq'

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  const parsed = contactMessageSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert(parsed.data)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}