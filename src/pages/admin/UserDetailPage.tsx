import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, LogIn, BookOpen, Code2, CheckCircle2, Eye, Circle } from 'lucide-react'
import { useUserDetail } from '../../hooks/useAdminStats'

const ACTION_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  login:             { label: 'Logged in',         icon: <LogIn size={13} />,        color: 'text-blue-400' },
  session_view:      { label: 'Viewed session',     icon: <Eye size={13} />,          color: 'text-purple-400' },
  session_complete:  { label: 'Completed session',  icon: <BookOpen size={13} />,     color: 'text-green-400' },
  exercise_start:    { label: 'Started exercise',   icon: <Code2 size={13} />,        color: 'text-yellow-400' },
  exercise_complete: { label: 'Passed exercise',    icon: <CheckCircle2 size={13} />, color: 'text-green-400' },
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const { activity, progress, loading } = useUserDetail(userId ?? '')

  const completedCount = progress.filter(p => p.completed).length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin" className="text-gray-400 hover:text-gray-200 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">User Detail</h1>
          <p className="text-xs text-gray-500 font-mono">{userId}</p>
        </div>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sessions done', value: `${completedCount}/12` },
          { label: 'Activity events', value: activity.length },
          { label: 'Progress', value: `${Math.round((completedCount / 12) * 100)}%` },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Session progress heatmap */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">Session Progress</h2>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const n = String(i + 1).padStart(2, '0')
            const sessionDone = i < completedCount
            return (
              <div
                key={n}
                title={`Session ${n}`}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                  sessionDone
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 text-gray-600'
                }`}
              >
                {n}
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity timeline */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">Activity Timeline</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : activity.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity recorded yet.</p>
        ) : (
          <div className="relative space-y-0">
            {/* vertical line */}
            <div className="absolute left-[17px] top-2 bottom-2 w-px bg-gray-800" />
            {activity.map(entry => {
              const meta = ACTION_META[entry.action_type] ?? {
                label: entry.action_type, icon: <Circle size={13} />, color: 'text-gray-400',
              }
              return (
                <div key={entry.id} className="flex items-start gap-4 py-2.5 relative">
                  <div className={`shrink-0 w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center z-10 ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5">
                    <p className="text-sm text-gray-200">{meta.label}</p>
                    {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                      <p className="text-xs text-gray-600 font-mono mt-0.5 truncate">
                        {JSON.stringify(entry.metadata)}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-600 pt-1.5">{fmt(entry.created_at)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
