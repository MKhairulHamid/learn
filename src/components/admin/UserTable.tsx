import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { UserRow } from '../../hooks/useAdminStats'

function timeAgo(dateStr: string | null) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

interface Props {
  users: UserRow[]
  loading: boolean
}

export function UserTable({ users, loading }: Props) {
  if (loading) {
    return <div className="text-gray-500 text-sm py-8 text-center">Loading users…</div>
  }

  if (users.length === 0) {
    return <div className="text-gray-500 text-sm py-8 text-center">No users yet.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">User</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">Role</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">Sessions</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">Exercises</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">Last active</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-200 truncate max-w-[180px]">{u.full_name ?? '—'}</p>
                <p className="text-xs text-gray-500 truncate max-w-[180px]">{u.email ?? '—'}</p>
              </td>
              <td className="py-3 pr-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  u.role === 'admin'
                    ? 'text-yellow-400 bg-yellow-950/40 border-yellow-900'
                    : 'text-gray-400 bg-gray-800 border-gray-700'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${Math.min((u.sessionsCompleted / 12) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-300 text-xs">{u.sessionsCompleted}/12</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-gray-300">{u.exercisesPassed}</td>
              <td className="py-3 pr-4 text-gray-500 text-xs">{timeAgo(u.lastActive)}</td>
              <td className="py-3">
                <Link
                  to={`/admin/users/${u.id}`}
                  className="text-gray-600 hover:text-gray-300 transition-colors"
                >
                  <ChevronRight size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
