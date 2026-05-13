import { Users, Activity, BookOpen, TrendingUp, Radio } from 'lucide-react'
import { StatsCard } from '../../components/admin/StatsCard'
import { ActivityFeed } from '../../components/admin/ActivityFeed'
import { UserTable } from '../../components/admin/UserTable'
import { useAdminStats, useActivityFeed, useUserList } from '../../hooks/useAdminStats'

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useAdminStats()
  const { feed, loading: feedLoading } = useActivityFeed()
  const { users, loading: usersLoading } = useUserList()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor learner activity and platform health.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Users"
          value={statsLoading ? '—' : stats?.totalUsers ?? 0}
          icon={<Users size={16} />}
          color="blue"
        />
        <StatsCard
          label="Active Today"
          value={statsLoading ? '—' : stats?.activeToday ?? 0}
          sub="unique sessions"
          icon={<Activity size={16} />}
          color="green"
        />
        <StatsCard
          label="Sessions Completed"
          value={statsLoading ? '—' : stats?.totalSessions ?? 0}
          sub="across all users"
          icon={<BookOpen size={16} />}
          color="purple"
        />
        <StatsCard
          label="Avg Completion"
          value={statsLoading ? '—' : `${stats?.avgCompletionRate ?? 0}%`}
          sub="of 12-session curriculum"
          icon={<TrendingUp size={16} />}
          color="yellow"
        />
      </div>

      {/* Feed + Users */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Live activity feed */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Radio size={14} className="text-green-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-gray-200">Live Activity</h2>
          </div>
          <ActivityFeed feed={feed} loading={feedLoading} />
        </div>

        {/* User table */}
        <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-gray-200 mb-4">All Users</h2>
          <UserTable users={users} loading={usersLoading} />
        </div>
      </div>
    </div>
  )
}
