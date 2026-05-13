import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface AdminStats {
  totalUsers: number
  activeToday: number
  totalSessions: number
  avgCompletionRate: number
}

export interface UserRow {
  id: string
  full_name: string | null
  email: string | null
  role: string
  created_at: string
  sessionsCompleted: number
  exercisesPassed: number
  lastActive: string | null
}

export interface ActivityEntry {
  id: string
  user_id: string
  action_type: string
  metadata: Record<string, unknown>
  created_at: string
  profiles?: { full_name: string | null; email: string | null }
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().slice(0, 10)

      const [
        { count: totalUsers },
        { count: activeToday },
        { count: totalSessions },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_activity_logs').select('user_id', { count: 'exact', head: true })
          .gte('created_at', today),
        supabase.from('user_progress').select('*', { count: 'exact', head: true })
          .eq('completed', true),
      ])

      // avg completion: completed sessions / (total users * 12 sessions)
      const maxPossible = (totalUsers ?? 0) * 12
      const avgCompletionRate = maxPossible > 0
        ? Math.round(((totalSessions ?? 0) / maxPossible) * 100)
        : 0

      setStats({
        totalUsers: totalUsers ?? 0,
        activeToday: activeToday ?? 0,
        totalSessions: totalSessions ?? 0,
        avgCompletionRate,
      })
      setLoading(false)
    }
    load()
  }, [])

  return { stats, loading }
}

export function useUserList() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false })

      if (!profiles) { setLoading(false); return }

      const enriched = await Promise.all(profiles.map(async p => {
        const [
          { count: sessionsCompleted },
          { count: exercisesPassed },
          { data: lastLog },
        ] = await Promise.all([
          supabase.from('user_progress').select('*', { count: 'exact', head: true })
            .eq('user_id', p.id).eq('completed', true),
          supabase.from('exercise_submissions').select('*', { count: 'exact', head: true })
            .eq('user_id', p.id).eq('passed', true),
          supabase.from('user_activity_logs').select('created_at')
            .eq('user_id', p.id).order('created_at', { ascending: false }).limit(1),
        ])

        return {
          ...p,
          sessionsCompleted: sessionsCompleted ?? 0,
          exercisesPassed: exercisesPassed ?? 0,
          lastActive: lastLog?.[0]?.created_at ?? null,
        } as UserRow
      }))

      setUsers(enriched)
      setLoading(false)
    }
    load()
  }, [])

  return { users, loading }
}

export function useActivityFeed() {
  const [feed, setFeed] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFeed = useCallback(async () => {
    const { data } = await supabase
      .from('user_activity_logs')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50)

    setFeed((data ?? []) as ActivityEntry[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchFeed()

    // Realtime subscription for live updates
    const channel = supabase
      .channel('activity_feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_activity_logs',
      }, () => { fetchFeed() })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchFeed])

  return { feed, loading }
}

export function useUserDetail(userId: string) {
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [progress, setProgress] = useState<{ session_id: string; completed: boolean; completed_at: string | null }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    async function load() {
      const [{ data: logs }, { data: prog }] = await Promise.all([
        supabase.from('user_activity_logs').select('*')
          .eq('user_id', userId).order('created_at', { ascending: false }).limit(100),
        supabase.from('user_progress').select('session_id, completed, completed_at')
          .eq('user_id', userId),
      ])
      setActivity((logs ?? []) as ActivityEntry[])
      setProgress(prog ?? [])
      setLoading(false)
    }
    load()
  }, [userId])

  return { activity, progress, loading }
}
