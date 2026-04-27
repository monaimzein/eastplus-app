'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Returns { error } only on failure. On success the action throws via
// redirect() — Next.js sends Set-Cookie + Location in a single 303 response,
// so the browser commits the auth cookies before following the redirect.
// This eliminates the client-side cookie/navigation race that caused the
// "stay on /auth/login" bounce on Netlify and locally.
export async function loginAction(
  email: string,
  password: string
): Promise<{ error: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { error: 'خطأ في البريد الإلكتروني أو كلمة المرور' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  const role = profile?.role
  const redirectTo =
    role === 'admin' ? '/admin' : role === 'staff' ? '/staff' : '/dashboard'

  // Drop any cached RSC payloads that were rendered for the anonymous user.
  revalidatePath('/', 'layout')
  redirect(redirectTo)
}
