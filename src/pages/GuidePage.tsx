import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, BookOpen, PencilRuler, Gamepad2, MessageSquare,
  Star, Award, User, Edit3, Briefcase, ClipboardCheck, ShieldCheck,
  Users, MapPin, PlayCircle, type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'
import { useOnboarding } from '../hooks/useOnboarding'

// Which feature sections each role should see, in display order.
const SECTIONS_BY_ROLE: Record<UserRole, string[]> = {
  student: [
    'dashboard', 'curriculum', 'exercises', 'playground',
    'discussion', 'feedback', 'certificates', 'profile',
  ],
  mentor: [
    'dashboard', 'curriculum', 'exercises', 'content_editing',
    'playground', 'discussion', 'feedback', 'profile',
  ],
  program_manager: [
    'program_management', 'student_review', 'dashboard', 'curriculum',
    'playground', 'discussion', 'profile',
  ],
  admin: [
    'admin_console', 'user_management', 'program_management', 'student_review',
    'dashboard', 'curriculum', 'exercises', 'content_editing',
    'playground', 'discussion', 'feedback', 'profile',
  ],
}

const SECTION_ICON: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  curriculum: BookOpen,
  exercises: PencilRuler,
  playground: Gamepad2,
  discussion: MessageSquare,
  feedback: Star,
  certificates: Award,
  profile: User,
  content_editing: Edit3,
  program_management: Briefcase,
  student_review: ClipboardCheck,
  admin_console: ShieldCheck,
  user_management: Users,
}

export default function GuidePage() {
  const { t } = useTranslation('onboarding')
  const { profile } = useAuth()
  const { startTour } = useOnboarding()

  const role: UserRole = profile?.role ?? 'student'
  const sections = SECTIONS_BY_ROLE[role] ?? SECTIONS_BY_ROLE.student

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('guide.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('guide.subtitle')}</p>
          <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
            {t('guide.role_label')}: {t(`guide.roles.${role}`)}
          </span>
        </div>
        <button
          onClick={startTour}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors shrink-0"
        >
          <PlayCircle size={16} />
          {t('guide.replay_tour')}
        </button>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(key => {
          const Icon = SECTION_ICON[key] ?? BookOpen
          return (
            <div
              key={key}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <h2 className="font-semibold text-gray-900 text-sm">
                  {t(`guide.sections.${key}.title`)}
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                {t(`guide.sections.${key}.desc`)}
              </p>
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                <MapPin size={12} className="shrink-0" />
                <span>{t(`guide.sections.${key}.where`)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
