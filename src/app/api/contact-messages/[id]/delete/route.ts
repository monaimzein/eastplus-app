import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const formData = await request.formData().catch(() => null)
  const next = formData?.get('next')?.toString() || '/console/staff/contact-messages'

  if (!user) {
    return NextResponse.redirect(new URL('/console/login', request.url), { status: 303 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.is_active === false || profile.role !== 'admin') {
    return NextResponse.redirect(new URL(next, request.url), { status: 303 })
  }

  const admin = createAdminClient()
  await admin.from('contact_messages').delete().eq('id', id)

  return NextResponse.redirect(new URL(next, request.url), { status: 303 })
}