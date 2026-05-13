import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, Code2, TrendingUp, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { usePhases } from '../hooks/usePhases'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import type { ReactNode } from 'react'

function getGreeting(t: (key: string) => string) {
  const h = new Date().getHours()
  if (h < 12) return t('dashboard.greeting_morning')
  if (h < 17) return t('dashboard.greeting_afternoon')
  return t('dashboard.greeting_evening')
}

export default function Dashboard() {
  const { t, i18n } = useTranslation('common')
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const { completedCount, isCompleted, progress } = useProgress()
  const { phases } = usePhases()
  const lang = i18n.language === 'id' ? 'id' : 'en'

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Learner'
  const greeting = getGreeting(t)

  // Current phase: first phase with incomplete sessions
  const currentPhase = phases.find(p =>
    p.sessions?.some(s => !isCompleted(s.id))
  ) ?? phases[0]
  const currentPhaseNum = currentPhase?.phase_number ?? 1

  // Find next session to do
  const nextSession = phases
    .flatMap(p => p.sessions ?? [])
    .find(s => !isCompleted(s.id))

  // Recent completions
  const recentCompleted = [...progress]
    .filter(p => p.completed && p.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    .slice(0, 3)

  // Map session ids to titles
  const sessionMap = Object.fromEntries(
    phases.flatMap(p => p.sessions ?? []).map(s => [s.id, lang === 'id' ? s.title_id : s.title_en])
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-500">{greeting},</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{displayName} 👋</h1>
        </div>
        {profile?.role === 'admin' && (
          <Badge variant="primary" size="md">Admin</Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<BookOpen size={20} className="text-primary-600" />}
          label={t('dashboard.sessions_completed')}
          value={String(completedCount)}
          total="12"
          bg="bg-primary-50"
        />
        <StatCard
          icon={<Code2 size={20} className="text-violet-600" />}
          label={t('dashboard.exercises_passed')}
          value="0"
          total="40+"
          bg="bg-violet-50"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-emerald-600" />}
          label={t('dashboard.current_phase')}
          value={String(currentPhaseNum)}
          total="4"
          bg="bg-emerald-50"
        />
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">{t('dashboard.progress_title')}</h2>
        <ProgressBar
          value={completedCount}
          max={12}
          label={currentPhase
            ? `Phase ${currentPhaseNum} — ${lang === 'id' ? currentPhase.name_id : currentPhase.name_en}`
            : 'All sessions complete!'}
        />
        {nextSession && (
          <button
            onClick={() => navigate(`/session/${nextSession.id}`)}
            className="mt-4 w-full flex items-center justify-between bg-primary-50 hover:bg-primary-100 transition-colors rounded-xl px-4 py-3 text-sm"
          >
            <span className="font-medium text-primary-800">
              {t('dashboard.continue_learning')}: {lang === 'id' ? nextSession.title_id : nextSession.title_en}
            </span>
            <ArrowRight size={16} className="text-primary-600 shrink-0" />
          </button>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ActionCard
          icon={<BookOpen size={22} />}
          title={t('dashboard.go_to_curriculum')}
          description="Continue your structured learning path"
          color="from-primary-600 to-cyan-500"
          onClick={() => navigate('/curriculum')}
        />
        <ActionCard
          icon={<Zap size={22} />}
          title={t('dashboard.open_playground')}
          description="Practice SQL queries on real datasets"
          color="from-violet-600 to-purple-500"
          onClick={() => navigate('/playground')}
        />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">{t('dashboard.recent_activity')}</h2>
        {recentCompleted.length > 0 ? (
          <div className="space-y-3">
            {recentCompleted.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">
                    {sessionMap[p.session_id] ?? 'Session'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {p.completed_at
                      ? new Date(p.completed_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })
                      : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Clock size={36} className="mb-2 opacity-30" />
            <p className="text-sm">{t('dashboard.no_activity')}</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/curriculum')}>
              {t('dashboard.continue_learning')} <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, total, bg }: {
  icon: ReactNode; label: string; value: string; total: string; bg: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">
          {value}<span className="text-sm font-normal text-gray-400">/{total}</span>
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  )
}

function ActionCard({ icon, title, description, color, onClick }: {
  icon: ReactNode; title: string; description: string; color: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${color} text-white rounded-2xl p-6 text-left hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer w-full`}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">{icon}</div>
        <ArrowRight size={18} className="opacity-70 mt-1" />
      </div>
      <h3 className="mt-4 font-semibold text-base">{title}</h3>
      <p className="mt-1 text-sm opacity-80">{description}</p>
    </button>
  )
}
