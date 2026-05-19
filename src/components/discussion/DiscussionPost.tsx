import { useState } from 'react'
import { generateHTML } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Mention from '@tiptap/extension-mention'
import { ChevronDown, ChevronUp, CornerDownRight, EyeOff, Eye, ArrowUp, MoreHorizontal } from 'lucide-react'
import type { DiscussionPost as Post } from '../../hooks/useDiscussion'
import { DiscussionEditor } from './DiscussionEditor'
import { useAuth } from '../../context/AuthContext'

interface Props {
  post: Post
  onVote: (postId: string, hasVoted: boolean) => void
  onReply: (body: object, parentId: string) => Promise<{ error?: string } | void>
  onHide: (postId: string, hide: boolean) => void
  isAdmin: boolean
}

const TIPTAP_EXTENSIONS = [
  StarterKit.configure({ heading: false }),
  Underline,
  Mention.configure({ HTMLAttributes: { class: 'mention' } }),
]

function renderBody(body: object): string {
  try {
    return generateHTML(body as Parameters<typeof generateHTML>[0], TIPTAP_EXTENSIONS)
  } catch {
    return '<p><em>Could not render message.</em></p>'
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function initials(author: Post['author']): string {
  const name = author.full_name ?? author.email ?? '?'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const DEPTH_COLORS = [
  'border-l-transparent',
  'border-l-primary-200',
  'border-l-violet-200',
]

export function DiscussionPost({ post, onVote, onReply, onHide, isAdmin }: Props) {
  const { user, profile } = useAuth()
  const [replying, setReplying] = useState(false)
  const [repliesOpen, setRepliesOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const html = renderBody(post.body)
  const hasReplies = (post.replies?.length ?? 0) > 0
  const canReply = post.depth < 2   // max 3 levels: 0, 1, 2
  const isOwn = user?.id === post.user_id
  const _isAdmin = isAdmin || profile?.role === 'admin'

  async function handleReply(body: object) {
    setSubmitError(null)
    const result = await onReply(body, post.id)
    const error = result && 'error' in result ? result.error : undefined
    if (error) { setSubmitError(error); return }
    setReplying(false)
  }

  return (
    <div
      id={`post-${post.id}`}
      className={`${post.depth > 0 ? `ml-6 pl-3 border-l-2 ${DEPTH_COLORS[post.depth] ?? 'border-l-gray-100'}` : ''}`}
    >
      <div className={`group rounded-xl p-3.5 transition-colors ${post.is_hidden ? 'opacity-50' : ''} ${post.depth === 0 ? 'bg-gray-50 border border-gray-100' : 'bg-white'}`}>

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials(post.author)}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-gray-900">
                {post.author.full_name ?? 'User'}
              </span>
              <span className="text-xs text-gray-400 ml-2">{timeAgo(post.created_at)}</span>
              {post.is_hidden && (
                <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">Hidden</span>
              )}
            </div>
          </div>

          {/* Menu (admin / own) */}
          {(_isAdmin || isOwn) && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="cursor-pointer p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreHorizontal size={15} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20">
                  {_isAdmin && (
                    <button
                      onClick={() => { onHide(post.id, !post.is_hidden); setMenuOpen(false) }}
                      className="cursor-pointer flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {post.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                      {post.is_hidden ? 'Unhide' : 'Hide post'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div
          className="prose prose-sm max-w-none text-gray-700 [&_.mention]:text-primary-600 [&_.mention]:font-medium [&_.mention]:bg-primary-50 [&_.mention]:px-1 [&_.mention]:rounded mb-2.5"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Action row */}
        <div className="flex items-center gap-3 mt-1">
          {/* Vote */}
          <button
            onClick={() => onVote(post.id, post.has_voted)}
            className={`cursor-pointer flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
              post.has_voted
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <ArrowUp size={13} />
            {post.vote_count > 0 && <span>{post.vote_count}</span>}
            <span>{post.has_voted ? 'Voted' : 'Upvote'}</span>
          </button>

          {/* Reply */}
          {canReply && user && (
            <button
              onClick={() => setReplying(r => !r)}
              className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <CornerDownRight size={13} />
              Reply
            </button>
          )}

          {/* Toggle replies */}
          {hasReplies && (
            <button
              onClick={() => setRepliesOpen(o => !o)}
              className="cursor-pointer flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 ml-auto transition-colors"
            >
              {repliesOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {post.replies!.length} {post.replies!.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {/* Reply editor */}
        {replying && (
          <div className="mt-3">
            <DiscussionEditor
              placeholder={`Reply to ${post.author.full_name ?? 'this post'}…`}
              onSubmit={handleReply}
              onCancel={() => { setReplying(false); setSubmitError(null) }}
              submitLabel="Reply"
              autoFocus
            />
            {submitError && <p className="text-xs text-red-500 mt-1.5">{submitError}</p>}
          </div>
        )}
      </div>

      {/* Nested replies */}
      {hasReplies && repliesOpen && (
        <div className="mt-2 space-y-2">
          {post.replies!.map(reply => (
            <DiscussionPost
              key={reply.id}
              post={reply}
              onVote={onVote}
              onReply={onReply}
              onHide={onHide}
              isAdmin={_isAdmin}
              />
          ))}
        </div>
      )}
    </div>
  )
}
