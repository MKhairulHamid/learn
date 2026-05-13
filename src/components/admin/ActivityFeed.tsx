import { LogIn, BookOpen, Code2, CheckCircle2, Eye } from 'lucide-react'
import type { ActivityEntry } from '../../hooks/useAdminStats'

const ACTION_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  login:            { label: 'Logged in',          icon: <LogIn size={13} />,       color: 'text-blue-400' },
  session_view:     { label: 'Viewed session',      icon: <Eye size={13} />,         color: 'text-purple-400' },
  session_complete: { label: 'Completed session',   icon: <BookOpen size={13} />,    color: 'text-green-400' },
  exercise_start:   { label: 'Started exercise',    icon: <Code2 size={13} />,       color: 'text-yellow-400' },
  exercise_complete:{ label: 'Passed exercise',     icon: <CheckCircle2 size={13} />,color: 'text-green-400' },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface Props {
  feed: ActivityEntry[]
  loading: boolean
}

export function ActivityFeed({ feed, loading }: Props) {
  if (loading) {
    return <div className="text-gray-500 text-sm py-6 text-center">Loading activity…</div>
  }

  if (feed.length === 0) {
    return <div className="text-gray-500 text-sm py-6 text-center">No activity yet.</div>
  }

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
      {feed.map(entry => {
        const meta = ACTION_META[entry.action_type] ?? { label: entry.action_type, icon: null, color: 'text-gray-400' }
        const name = (entry.profiles as { full_name?: string | null } | undefined)?.full_name ?? 'Unknown user'

        return (
          <div key={entry.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800/40 transition-colors">
            <span className={`shrink-0 mt-0.5 ${meta.color}`}>{meta.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate">
                <span className="font-medium">{name}</span>
                {' '}
                <span className="text-gray-400">{meta.label}</span>
              </p>
            </div>
            <span className="shrink-0 text-xs text-gray-600 whitespace-nowrap">
              {timeAgo(entry.created_at)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
