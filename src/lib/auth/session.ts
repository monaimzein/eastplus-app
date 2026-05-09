import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, UserRole } from '@/lib/types'

export type AuthProfile = Profile & { role: UserRole; is_active: boolean }

export async function getCurrentProfile(): Promise<AuthProfile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.is_active === false) return null
  return profile as AuthProfile
}

export async function requireRole(allowed: UserRole[], redirectTo: string) {
  const profile = await getCurrentProfile()
  if (!profile) redirect(redirectTo)
  if (!allowed.includes(profile.role)) {
    if (profile.role === 'admin') redirect('/console/admin')
    if (profile.role === 'staff') redirect('/console/staff')
    redirect('/account')
  }
  return profile
}