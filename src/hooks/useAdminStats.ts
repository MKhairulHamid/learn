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
  profiles?: { full_name: string | null; username: string | null }
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().slice(0, 10)

      const [
        { count: totalUsers },
        { count: totalSessions },
        { data: loginRows },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('cohort_session_progress').select('*', { count: 'exact', head: true })
          .eq('completed', true),
        supabase.from('user_activity_logs').select('user_id')
          .eq('action_type', 'login')
          .gte('created_at', today),
      ])

      const activeToday = new Set(loginRows?.map(r => r.user_id)).size

      // avg completion: completed sessions across all cohorts / total users
      // A rough platform-wide health metric — not per-cohort.
      const avgCompletionRate = (totalUsers ?? 0) > 0 && (totalSessions ?? 0) > 0
        ? Math.min(100, Math.round(((totalSessions ?? 0) / (totalUsers ?? 1)) * 10))
        : 0

      setStats({
        totalUsers: totalUsers ?? 0,
        activeToday,
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
      // Three bulk queries instead of 3×N per-user queries.
      const [
        { data: profiles },
        { data: progressRows },
        { data: exerciseRows },
        { data: logRows },
      ] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role, created_at')
          .order('created_at', { ascending: false }),
        supabase.from('cohort_session_progress').select('user_id')
          .eq('completed', true),
        supabase.from('exercise_submissions').select('user_id')
          .eq('passed', true),
        // Ordered desc — first occurrence per user_id is their most recent log.
        supabase.from('user_activity_logs').select('user_id, created_at')
          .order('created_at', { ascending: false }).limit(2000),
      ])

      if (!profiles) { setLoading(false); return }

      // Aggregate in JS — O(n) maps.
      const sessionsByUser = new Map<string, number>()
      for (const r of progressRows ?? [])
        sessionsByUser.set(r.user_id, (sessionsByUser.get(r.user_id) ?? 0) + 1)

      const exercisesByUser = new Map<string, number>()
      for (const r of exerciseRows ?? [])
        exercisesByUser.set(r.user_id, (exercisesByUser.get(r.user_id) ?? 0) + 1)

      const lastActiveByUser = new Map<string, string>()
      for (const r of logRows ?? []) {
        if (!lastActiveByUser.has(r.user_id)) lastActiveByUser.set(r.user_id, r.created_at)
      }

      setUsers(profiles.map(p => ({
        ...p,
        email: null,   // email lives in auth.users, not profiles
        sessionsCompleted: sessionsByUser.get(p.id) ?? 0,
        exercisesPassed: exercisesByUser.get(p.id) ?? 0,
        lastActive: lastActiveByUser.get(p.id) ?? null,
      })))
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
    const { data: logs } = await supabase
      .from('user_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    const rows = (logs ?? []) as Omit<ActivityEntry, 'profiles'>[]
    const userIds = [...new Set(rows.map(r => r.user_id))]
    const { data: profileData } = userIds.length > 0
      ? await supabase.from('profiles').select('id, full_name, username').in('id', userIds)
      : { data: [] }

    const profileById = new Map(
      ((profileData ?? []) as { id: string; full_name: string | null; username: string | null }[])
        .map(p => [p.id, p])
    )

    setFeed(rows.map(r => ({ ...r, profiles: profileById.get(r.user_id) ?? undefined })))
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
        supabase.from('cohort_session_progress')
          .select('session_id, completed, completed_at')
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
