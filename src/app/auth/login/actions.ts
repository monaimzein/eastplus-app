'use server'

import { createClient } from '@/lib/supabase/server'

export type LoginResult =
  | { error: string }
  | { redirectTo: string }

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResult> {
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

  return { redirectTo }
}
