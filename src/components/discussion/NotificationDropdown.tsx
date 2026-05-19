import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, MessageSquare, AtSign, Loader2 } from 'lucide-react'
import type { AppNotification } from '../../hooks/useNotifications'

interface Props {
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  open: boolean
  onToggle: () => void
  onClose: () => void
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
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

export function NotificationDropdown({
  notifications, unreadCount, loading, open, onToggle, onClose, onMarkRead, onMarkAllRead,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleNotificationClick(n: AppNotification) {
    onMarkRead(n.id)
    onClose()
    navigate(`/session/${n.session_id}#discussion`)
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={onToggle}
        className="cursor-pointer relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none pointer-events-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel
          - right-0 keeps it flush with the bell on all screen sizes
          - w-[min(320px,calc(100vw-1rem))] prevents overflow on small phones
          - z-[999] ensures it renders above sticky navbar siblings        */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-1rem))] bg-white border border-gray-200 rounded-2xl shadow-xl z-[999] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="cursor-pointer flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium shrink-0"
              >
                <CheckCheck size={13} />
                <span className="hidden sm:inline">Mark all read</span>
                <span className="sm:hidden">All read</span>
              </button>
            )}
          </div>

          {/* List — capped at 60vh so it never runs off the screen */}
          <div className="overflow-y-auto max-h-[60vh]">
            {loading && (
              <div className="flex items-center justify-center py-10 text-gray-400">
                <Loader2 size={18} className="animate-spin mr-2" />
                <span className="text-sm">Loading…</span>
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="text-center py-10 px-4">
                <Bell size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
                <p className="text-xs text-gray-300 mt-1">Replies and @mentions will appear here</p>
              </div>
            )}

            {!loading && notifications.map(n => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`cursor-pointer w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50 last:border-0 ${
                  !n.is_read ? 'bg-primary-50/60' : ''
                }`}
              >
                {/* Type icon */}
                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  n.type === 'mention' ? 'bg-violet-100' : 'bg-primary-100'
                }`}>
                  {n.type === 'mention'
                    ? <AtSign size={14} className="text-violet-600" />
                    : <MessageSquare size={14} className="text-primary-600" />
                  }
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-snug">
                    <span className="font-semibold">{n.actor.full_name ?? 'Someone'}</span>
                    {n.type === 'mention' ? ' mentioned you' : ' replied to your post'}
                  </p>
                  {n.session_title && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.session_title}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
                </div>

                {/* Unread dot */}
                {!n.is_read && (
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Footer — tap to go to first session with unread */}
          {!loading && notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
              <p className="text-[11px] text-gray-400 text-center">
                Tap a notification to jump to the discussion
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
