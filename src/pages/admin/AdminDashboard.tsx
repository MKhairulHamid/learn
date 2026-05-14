import { useState } from 'react'
import { Users, Activity, BookOpen, TrendingUp, Radio, BarChart2, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatsCard } from '../../components/admin/StatsCard'
import { ActivityFeed } from '../../components/admin/ActivityFeed'
import { UserTable } from '../../components/admin/UserTable'
import { ExerciseAnalyticsPanel } from '../../components/admin/ExerciseAnalyticsPanel'
import { useAdminStats, useActivityFeed, useUserList } from '../../hooks/useAdminStats'

type Tab = 'overview' | 'analytics'

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useAdminStats()
  const { feed, loading: feedLoading } = useActivityFeed()
  const { users, loading: usersLoading } = useUserList()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className="min-h-screen bg-[#0a0e1a]">

      {/* ── Page header ── */}
      <div className="border-b border-white/[0.06] bg-[#0d1221]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-primary-400" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Admin Dashboard</span>
              <span className="ml-2 text-xs text-gray-500">Monitor learner activity and platform health</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <LayoutDashboard size={14} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <BarChart2 size={14} />
              Exercise Analytics
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {activeTab === 'overview' && (
          <div className="space-y-8">
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
              <div className="lg:col-span-2 bg-[#111827] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Radio size={14} className="text-green-400 animate-pulse" />
                  <h2 className="text-sm font-semibold text-gray-200">Live Activity</h2>
                </div>
                <ActivityFeed feed={feed} loading={feedLoading} />
              </div>

              {/* User table */}
              <div className="lg:col-span-3 bg-[#111827] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-200">All Users</h2>
                  <Link
                    to="/admin/users"
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    View all →
                  </Link>
                </div>
                <UserTable users={users} loading={usersLoading} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <ExerciseAnalyticsPanel />
        )}

      </div>
    </div>
  )
}
