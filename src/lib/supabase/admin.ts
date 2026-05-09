import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase admin client (service role).
 *
 * Used for privileged operations that bypass RLS:
 *   - Creating staff/admin user accounts (auth.admin API)
 *   - Hard-deleting users
 *
 * NEVER import from a Client Component.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    )
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
