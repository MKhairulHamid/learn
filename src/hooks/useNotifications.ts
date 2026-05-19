import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export interface AppNotification {
  id: string
  type: 'reply' | 'mention'
  post_id: string
  session_id: string
  is_read: boolean
  created_at: string
  actor: { id: string; full_name: string | null }
  session_title?: string
}

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const unreadCount = notifications.filter(n => !n.is_read).length

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) { setLoading(false); return }

    // Enrich with actor names
    const actorIds = [...new Set(data.map(n => n.actor_id))]
    const { data: profiles } = actorIds.length
      ? await supabase.from('profiles').select('id, full_name').in('id', actorIds)
      : { data: [] }

    const actorMap: Record<string, { id: string; full_name: string | null }> = {}
    for (const p of (profiles ?? [])) actorMap[p.id] = p

    // Enrich with session titles
    const sessionIds = [...new Set(data.map(n => n.session_id))]
    const { data: sessions } = sessionIds.length
      ? await supabase
          .from('sessions')
          .select('id, title_en, title_id')
          .in('id', sessionIds)
      : { data: [] }

    const sessionMap: Record<string, string> = {}
    for (const s of (sessions ?? [])) sessionMap[s.id] = s.title_en

    setNotifications(
      data.map(n => ({
        id: n.id,
        type: n.type,
        post_id: n.post_id,
        session_id: n.session_id,
        is_read: n.is_read,
        created_at: n.created_at,
        actor: actorMap[n.actor_id] ?? { id: n.actor_id, full_name: null },
        session_title: sessionMap[n.session_id],
      }))
    )
    setLoading(false)
  }, [user])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  // Realtime: new notification for this user
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => fetchNotifications())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, fetchNotifications])

  const markRead = useCallback(async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }, [])

  const markAllRead = useCallback(async () => {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }, [user])

  return { notifications, unreadCount, loading, markRead, markAllRead, refetch: fetchNotifications }
}
