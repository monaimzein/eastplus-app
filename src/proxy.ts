import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const ACCOUNT_AUTH = /^\/account\/(login|register)(\/|$)/
const ACCOUNT_PROTECTED = /^\/account(?!\/(login|register)(\/|$))(\/|$)/
const CONSOLE_LOGIN = /^\/console\/login(\/|$)/
const CONSOLE_STAFF = /^\/console\/staff(\/|$)/
const CONSOLE_ADMIN = /^\/console\/admin(\/|$)/

function roleHome(role?: string | null) {
  if (role === 'admin') return '/console/admin'
  if (role === 'staff') return '/console/staff'
  return '/account'
}

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const needsAccount = ACCOUNT_PROTECTED.test(pathname)
  const needsStaff = CONSOLE_STAFF.test(pathname)
  const needsAdmin = CONSOLE_ADMIN.test(pathname)
  const isAuthPage = ACCOUNT_AUTH.test(pathname) || CONSOLE_LOGIN.test(pathname)

  if (!needsAccount && !needsStaff && !needsAdmin && !isAuthPage) {
    return supabaseResponse
  }

  if (!user) {
    if (needsAccount) {
      const url = request.nextUrl.clone()
      url.pathname = '/account/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    if (needsStaff || needsAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/console/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,is_active')
    .eq('id', user.id)
    .maybeSingle()

  const role = profile?.role ?? 'user'
  const isActive = profile?.is_active !== false

  if (!isActive) {
    const url = request.nextUrl.clone()
    url.pathname = CONSOLE_LOGIN.test(pathname) || needsStaff || needsAdmin ? '/console/login' : '/account/login'
    url.searchParams.set('disabled', '1')
    return NextResponse.redirect(url)
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL(roleHome(role), request.url))
  }

  if (needsAccount && role !== 'user') {
    return NextResponse.redirect(new URL(roleHome(role), request.url))
  }

  if (needsStaff && role !== 'staff' && role !== 'admin') {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  if (needsAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL(role === 'staff' ? '/console/staff' : '/account', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)$).*)',
  ],
}
