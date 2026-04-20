'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store'
import type { Profile } from '@/lib/types'

// Single shared client instance
const supabase = createClient()

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    let cancelled = false

    const fetchProfile = async (userId: string): Promise<Profile | null> => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return data as Profile | null
    }

    const initAuth = async () => {
      try {
        // getUser() validates the JWT server-side and auto-refreshes expired tokens
        // Unlike getSession() which only reads cached/cookie data without validation
        const { data: { user: authUser }, error } = await supabase.auth.getUser()

        if (cancelled) return

        if (error || !authUser) {
          // If there's an auth error (expired refresh token, invalid session),
          // clear the broken session so user can log in fresh without clearing cookies
          if (error) {
            await supabase.auth.signOut({ scope: 'local' })
          }
          setUser(null)
          setLoading(false)
          return
        }

        const profile = await fetchProfile(authUser.id)
        if (!cancelled) {
          setUser(profile)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
          return
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            if (!cancelled) {
              setUser(profile)
              setLoading(false)
            }
          }
        }
      }
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { user, isLoading }
}

export function useRealtime(table: string, filter?: string) {
  const [data, setData] = useState<unknown[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item: any) =>
                item.id === payload.new.id ? payload.new : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item: any) => item.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, setData }
}
