import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export interface DiscussionAuthor {
  id: string
  full_name: string | null
  email: string
}

export interface DiscussionPost {
  id: string
  session_id: string
  user_id: string
  parent_id: string | null
  body: object          // Tiptap JSON doc
  is_hidden: boolean
  created_at: string
  updated_at: string
  author: DiscussionAuthor
  vote_count: number
  has_voted: boolean
  replies?: DiscussionPost[]
  depth: number
}

/**
 * Session discussion, isolated per cohort.
 *
 * `cohortId` scopes the thread to a single cohort so each batch has its own
 * discussion space. When it is `null` (e.g. an admin with no cohort) every
 * post for the session is shown.
 */
export function useDiscussion(sessionId: string | undefined, cohortId: string | null = null) {
  const { user } = useAuth()
  const [posts, setPosts] = useState<DiscussionPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchPosts = useCallback(async () => {
    if (!sessionId || !user) return
    setLoading(true)
    setError(null)

    try {
      // Fetch posts for this session, scoped to the cohort when known.
      // (RLS hides hidden ones for non-admins.)
      let query = supabase
        .from('discussion_posts')
        .select('*')
        .eq('session_id', sessionId)
      if (cohortId) query = query.eq('cohort_id', cohortId)
      const { data: rawPosts, error: fetchErr } = await query
        .order('created_at', { ascending: true })

      if (fetchErr) throw fetchErr

      // Fetch authors from profiles
      const userIds = [...new Set((rawPosts ?? []).map(p => p.user_id))]
      const { data: profiles } = userIds.length
        ? await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds)
        : { data: [] }

      const profileMap: Record<string, DiscussionAuthor> = {}
      for (const p of (profiles ?? [])) {
        profileMap[p.id] = {
          id: p.id,
          full_name: p.full_name,
          email: '',
        }
      }

      // Fetch votes
      const postIds = (rawPosts ?? []).map(p => p.id)
      const { data: votes } = postIds.length
        ? await supabase
            .from('discussion_votes')
            .select('post_id, user_id')
            .in('post_id', postIds)
        : { data: [] }

      const voteCountMap: Record<string, number> = {}
      const myVoteSet = new Set<string>()
      for (const v of (votes ?? [])) {
        voteCountMap[v.post_id] = (voteCountMap[v.post_id] ?? 0) + 1
        if (v.user_id === user.id) myVoteSet.add(v.post_id)
      }

      // Build flat list with author + vote data
      const enriched: DiscussionPost[] = (rawPosts ?? []).map(p => ({
        ...p,
        author: profileMap[p.user_id] ?? { id: p.user_id, full_name: null, email: '?' },
        vote_count: voteCountMap[p.id] ?? 0,
        has_voted: myVoteSet.has(p.id),
        depth: 0,
      }))

      // Build tree (max 3 levels)
      const byId = Object.fromEntries(enriched.map(p => [p.id, { ...p, replies: [] as DiscussionPost[] }]))
      const roots: DiscussionPost[] = []

      for (const post of Object.values(byId)) {
        if (!post.parent_id) {
          post.depth = 0
          roots.push(post)
        } else if (byId[post.parent_id]) {
          const parent = byId[post.parent_id]
          post.depth = (parent.depth ?? 0) + 1
          if (!parent.replies) parent.replies = []
          parent.replies.push(post)
        }
      }

      setPosts(roots)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load discussion')
    } finally {
      setLoading(false)
    }
  }, [sessionId, user, cohortId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Realtime: refresh on new posts in this session
  useEffect(() => {
    if (!sessionId) return
    const channel = supabase
      .channel(`discussion:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'discussion_posts',
        filter: `session_id=eq.${sessionId}`,
      }, () => fetchPosts())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'discussion_posts',
        filter: `session_id=eq.${sessionId}`,
      }, () => fetchPosts())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sessionId, fetchPosts])

  const submitPost = useCallback(async (
    body: object,
    parentId?: string
  ): Promise<{ error?: string }> => {
    if (!user || !sessionId) return { error: 'Not logged in' }
    setSubmitting(true)
    const { error } = await supabase.from('discussion_posts').insert({
      session_id: sessionId,
      user_id: user.id,
      parent_id: parentId ?? null,
      cohort_id: cohortId,
      body,
    })
    setSubmitting(false)
    if (error) {
      if (error.code === '42501') return { error: 'Posting too fast — wait a moment and try again.' }
      return { error: error.message }
    }
    return {}
  }, [user, sessionId, cohortId])

  const toggleVote = useCallback(async (postId: string, hasVoted: boolean) => {
    if (!user) return
    if (hasVoted) {
      await supabase.from('discussion_votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
    } else {
      await supabase.from('discussion_votes').insert({ post_id: postId, user_id: user.id })
    }
    // Optimistic local update
    setPosts(prev => updateVoteInTree(prev, postId, !hasVoted, user.id))
  }, [user])

  const hidePost = useCallback(async (postId: string, hide: boolean) => {
    await supabase.from('discussion_posts').update({ is_hidden: hide }).eq('id', postId)
    await fetchPosts()
  }, [fetchPosts])

  return { posts, loading, error, submitting, submitPost, toggleVote, hidePost, refetch: fetchPosts }
}

// ── Helpers ──────────────────────────────────────────────────────

function updateVoteInTree(
  posts: DiscussionPost[],
  postId: string,
  nowVoted: boolean,
  _userId: string
): DiscussionPost[] {
  return posts.map(p => {
    if (p.id === postId) {
      return {
        ...p,
        has_voted: nowVoted,
        vote_count: nowVoted ? p.vote_count + 1 : Math.max(0, p.vote_count - 1),
      }
    }
    if (p.replies?.length) {
      return { ...p, replies: updateVoteInTree(p.replies, postId, nowVoted, _userId) }
    }
    return p
  })
}

// ── Fetch users list for @mention suggestions ─────────────────────
export async function fetchMentionUsers(query: string): Promise<{ id: string; label: string }[]> {
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name')
    .ilike('full_name', `%${query}%`)
    .limit(8)
  return (data ?? []).map(p => ({
    id: p.id,
    label: p.full_name ?? p.id,
  }))
}
