'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store'
import type { Profile } from '@/lib/types'

// Single shared client instance - module level to avoid re-creation on renders
const supabase = createClient()

// Prevent multiple auth listeners across component mounts (e.g. DashboardLayout + page both using useAuth)
let listenerAttached = false

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data as Profile | null
}

export function useAuth() {
  const { user, isLoading } = useAuthStore()

  useEffect(() => {
    // If already initialized (multiple components using useAuth), skip
    if (listenerAttached) return
    listenerAttached = true

    // Use onAuthStateChange as single source of truth.
    // INITIAL_SESSION fires immediately with the current session from cache -
    // no extra network call needed, and no race condition with a separate getUser().
    supabase.auth.onAuthStateChange(async (event, session) => {
      // Access store setters fresh - they are stable Zustand functions
      const { setUser, setLoading } = useAuthStore.getState()

      if (event === 'INITIAL_SESSION') {
        try {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            useAuthStore.getState().setUser(profile)
          } else {
            setUser(null)
          }
        } catch {
          setUser(null)
        } finally {
          useAuthStore.getState().setLoading(false)
        }
        return
      }

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          if (session?.user) {
            const profile = await fetchProfile(session.user.id)
            useAuthStore.getState().setUser(profile)
          }
        } catch {
          // keep existing user state
        } finally {
          useAuthStore.getState().setLoading(false)
        }
      }
    })

    // Intentionally no cleanup: we keep the single global listener alive.
    // It will be garbage-collected when the browser tab closes.
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
