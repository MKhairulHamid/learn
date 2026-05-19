import { useState } from 'react'
import { MessageSquare, Loader2, AlertCircle, Lock } from 'lucide-react'
import { useDiscussion } from '../../hooks/useDiscussion'
import { useAuth } from '../../context/AuthContext'
import { DiscussionPost } from './DiscussionPost'
import { DiscussionEditor } from './DiscussionEditor'

interface Props {
  sessionId: string
}

export function DiscussionPanel({ sessionId }: Props) {
  const { user, profile } = useAuth()
  const { posts, loading, error, submitting, submitPost, toggleVote, hidePost } = useDiscussion(sessionId)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const isAdmin = profile?.role === 'admin'
  const totalCount = countTree(posts)

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
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <MessageSquare size={18} className="text-primary-600" />
        <h2 className="text-lg font-bold text-gray-900">Discussion</h2>
        {totalCount > 0 && (
          <span className="text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
            {totalCount}
          </span>
        )}
      </div>

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
          {/* New post editor */}
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

          {/* Empty */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No questions yet — be the first to ask!</p>
            </div>
          )}

          {/* Posts */}
          {!loading && posts.length > 0 && (
            <div className="space-y-3">
              {posts.map(post => (
                <DiscussionPost
                  key={post.id}
                  post={post}
                  onVote={toggleVote}
                  onReply={handleReply}
                  onHide={hidePost}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function countTree(posts: { replies?: typeof posts }[]): number {
  return posts.reduce((sum, p) => sum + 1 + countTree(p.replies ?? []), 0)
}
