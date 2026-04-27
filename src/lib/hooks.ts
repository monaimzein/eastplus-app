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

    // getSession() reads directly from cookie/localStorage storage - reliable in production.
    // INITIAL_SESSION event is NOT used because @supabase/ssr can silently skip it in
    // server-rendered environments (Netlify / Vercel), causing infinite loading.
    //
    // Hard 8s safety timeout: if any Supabase call hangs (Edge cold start, websocket
    // stalled, network blip), we still resolve isLoading so the UI never freezes.
    const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
      Promise.race([
        p,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), ms)
        ),
      ])

    const initSession = async () => {
      try {
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          8000
        )
        if (session?.user) {
          const profile = await withTimeout(fetchProfile(session.user.id), 8000)
          useAuthStore.getState().setUser(profile)
        } else {
          useAuthStore.getState().setUser(null)
        }
      } catch {
        useAuthStore.getState().setUser(null)
      } finally {
        useAuthStore.getState().setLoading(false)
      }
    }

    initSession()

    // Listen for subsequent auth changes (login/logout/token refresh).
    // Skip INITIAL_SESSION — already handled by initSession() above.
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return

      const { setUser, setLoading } = useAuthStore.getState()

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
