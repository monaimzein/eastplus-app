import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut({ scope: 'local' })

  const formData = await request.formData().catch(() => null)
  const referer = request.headers.get('referer') || ''
  const defaultNext = referer.includes('/console') ? '/console/login' : '/account/login'
  const next = formData?.get('next')?.toString() || defaultNext

  return NextResponse.redirect(new URL(next, request.url), { status: 303 })
}