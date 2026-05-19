import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  MessageSquare, Loader2, AlertCircle, Lock,
  ArrowUpDown, ArrowUp, ArrowDown, Clock,
  ChevronDown, ChevronUp, UserCheck,
} from 'lucide-react'
import { useDiscussion } from '../../hooks/useDiscussion'
import type { DiscussionPost as Post } from '../../hooks/useDiscussion'
import { useAuth } from '../../context/AuthContext'
import { DiscussionPost } from './DiscussionPost'
import { DiscussionEditor } from './DiscussionEditor'

// ── Types ─────────────────────────────────────────────────────────
type SortKey = 'votes_desc' | 'votes_asc' | 'date_desc' | 'date_asc'

interface SortOption {
  key: SortKey
  label: string
  shortLabel: string
  icon: React.ReactNode
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'votes_desc', label: 'Most voted',   shortLabel: 'Top', icon: <ArrowUp size={13} /> },
  { key: 'votes_asc',  label: 'Least voted',  shortLabel: 'Low', icon: <ArrowDown size={13} /> },
  { key: 'date_desc',  label: 'Latest first', shortLabel: 'New', icon: <Clock size={13} /> },
  { key: 'date_asc',   label: 'Oldest first', shortLabel: 'Old', icon: <ArrowUpDown size={13} /> },
]

// ── Helpers ───────────────────────────────────────────────────────
function sortPosts(posts: Post[], key: SortKey): Post[] {
  return [...posts].sort((a, b) => {
    switch (key) {
      case 'votes_desc': return b.vote_count - a.vote_count || new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'votes_asc':  return a.vote_count - b.vote_count || new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'date_desc':  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'date_asc':   return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
  })
}

/** Returns true if the user authored or replied anywhere in this thread */
function userParticipated(post: Post, userId: string): boolean {
  if (post.user_id === userId) return true
  return (post.replies ?? []).some(r => userParticipated(r, userId))
}

function countTree(posts: { replies?: typeof posts }[]): number {
  return posts.reduce((sum, p) => sum + 1 + countTree(p.replies ?? []), 0)
}

// ── Component ─────────────────────────────────────────────────────
interface Props { sessionId: string }

export function DiscussionPanel({ sessionId }: Props) {
  const { user, profile } = useAuth()
  const { posts, loading, error, submitting, submitPost, toggleVote, hidePost } = useDiscussion(sessionId)

  const [submitError, setSubmitError]   = useState<string | null>(null)
  const [sort, setSort]                 = useState<SortKey>('votes_desc')
  const [collapsed, setCollapsed]       = useState(false)
  const [myPostsOnly, setMyPostsOnly]   = useState(false)

  const scrolledRef = useRef(false)
  const location    = useLocation()
  const isAdmin     = profile?.role === 'admin'
  const totalCount  = countTree(posts)

  // Posts the current user participated in
  const myPostsCount = useMemo(
    () => user ? posts.filter(p => userParticipated(p, user.id)).length : 0,
    [posts, user]
  )

  // Pipeline: filter → sort
  const visiblePosts = useMemo(() => {
    const filtered = (myPostsOnly && user)
      ? posts.filter(p => userParticipated(p, user.id))
      : posts
    return sortPosts(filtered, sort)
  }, [posts, sort, myPostsOnly, user])

  // Hash-based deep-link scroll + highlight
  const targetPostId = useMemo(() => {
    const match = location.hash.match(/^#post-([0-9a-f-]{36})$/)
    return match ? match[1] : null
  }, [location.hash])

  useEffect(() => {
    if (!targetPostId || loading || scrolledRef.current) return
    // Auto-expand if collapsed so the post is visible
    setCollapsed(false)
    const wrapper = document.getElementById(`post-${targetPostId}`)
    if (!wrapper) return
    scrolledRef.current = true
    setTimeout(() => {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const card = wrapper.querySelector('.group') as HTMLElement | null
      if (card) {
        card.classList.add('post-highlight')
        setTimeout(() => card.classList.remove('post-highlight'), 2200)
      }
    }, 350)
  }, [targetPostId, loading, posts])

  async function handlePost(body: object) {
    setSubmitError(null)
    const result = await submitPost(body)
    if (result.error) setSubmitError(result.error)
  }

  async function handleReply(body: object, parentId: string) {
    return submitPost(body, parentId)
  }

  return (
    <section id="discussion" className="mt-10 border-t border-gray-100 pt-8">

      {/* ── Header row ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">

        {/* Left: title + count + minimize */}
        <div className="flex items-center gap-2.5">
          <MessageSquare size={18} className="text-primary-600" />
          <h2 className="text-lg font-bold text-gray-900">Discussion</h2>
          {totalCount > 0 && (
            <span className="text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          )}
          {/* Minimize / expand */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors ml-1"
            aria-label={collapsed ? 'Expand discussion' : 'Minimize discussion'}
          >
            {collapsed
              ? <><ChevronDown size={14} /><span className="hidden sm:inline">Show</span></>
              : <><ChevronUp size={14} /><span className="hidden sm:inline">Hide</span></>
            }
          </button>
        </div>

        {/* Right: filters + sort — hidden while collapsed */}
        {!collapsed && !loading && user && posts.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">

            {/* My posts filter */}
            {myPostsCount > 0 && (
              <button
                onClick={() => setMyPostsOnly(v => !v)}
                className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  myPostsOnly
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                <UserCheck size={13} />
                <span>My posts</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  myPostsOnly ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {myPostsCount}
                </span>
              </button>
            )}

            {/* Sort controls */}
            {posts.length > 1 && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSort(opt.key)}
                    title={opt.label}
                    className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sort === opt.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {opt.icon}
                    <span className="hidden sm:inline">{opt.label}</span>
                    <span className="sm:hidden">{opt.shortLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Collapsed summary bar ──────────────────────────────── */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ChevronDown size={15} />
          {totalCount > 0
            ? `Show ${totalCount} discussion ${totalCount === 1 ? 'post' : 'posts'}`
            : 'Show discussion'}
        </button>
      )}

      {/* ── Body (hidden when collapsed) ─────────────────────── */}
      {!collapsed && (
        <>
          {/* Not logged in */}
          {!user && (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <Lock size={28} className="text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Sign in to join the discussion</p>
              <p className="text-xs text-gray-400">Ask questions and help other learners in this session.</p>
            </div>
          )}

          {/* Logged in */}
          {user && (
            <>
              {/* Editor */}
              <div className="mb-6">
                <DiscussionEditor
                  placeholder="Ask a question, share an insight, or help a fellow learner…"
                  onSubmit={handlePost}
                  submitLabel={submitting ? 'Posting…' : 'Post Question'}
                />
                {submitError && (
                  <p className="flex items-center gap-1.5 text-xs text-red-500 mt-2">
                    <AlertCircle size={12} />
                    {submitError}
                  </p>
                )}
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center py-10 text-gray-400">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  <span className="text-sm">Loading discussion…</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-500 py-4">
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}

              {/* Empty — no posts at all */}
              {!loading && !error && posts.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No questions yet — be the first to ask!</p>
                </div>
              )}

              {/* Empty — my posts filter active but nothing matches */}
              {!loading && posts.length > 0 && visiblePosts.length === 0 && myPostsOnly && (
                <div className="text-center py-10 text-gray-400">
                  <UserCheck size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">You haven't posted in this session yet.</p>
                  <button
                    onClick={() => setMyPostsOnly(false)}
                    className="cursor-pointer text-xs text-primary-600 hover:underline mt-1"
                  >
                    Show all posts
                  </button>
                </div>
              )}

              {/* Posts */}
              {!loading && visiblePosts.length > 0 && (
                <div className="space-y-3">
                  {visiblePosts.map(post => (
                    <DiscussionPost
                      key={post.id}
                      post={post}
                      onVote={toggleVote}
                      onReply={handleReply}
                      onHide={hidePost}
                      isAdmin={isAdmin}
                    />
                  ))}
                  {myPostsOnly && myPostsCount < totalCount && (
                    <p className="text-center text-xs text-gray-400 pt-1">
                      Showing {myPostsCount} of {totalCount} posts · <button onClick={() => setMyPostsOnly(false)} className="cursor-pointer text-primary-600 hover:underline">show all</button>
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
