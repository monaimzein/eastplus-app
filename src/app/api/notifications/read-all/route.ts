import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const formData = await request.formData().catch(() => null)
  const next = formData?.get('next')?.toString() || '/account/notifications'

  if (!user) {
    const loginPath = next.startsWith('/console') ? '/console/login' : '/account/login'
    return NextResponse.redirect(new URL(loginPath, request.url), { status: 303 })
  }

  await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return NextResponse.redirect(new URL(next, request.url), { status: 303 })
}