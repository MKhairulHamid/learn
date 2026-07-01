import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, BookOpen, PencilRuler, Gamepad2, MessageSquare,
  Star, Award, User, Edit3, Briefcase, ClipboardCheck, ShieldCheck,
  Users, MapPin, PlayCircle, ArrowRight, Check, type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'
import { useOnboarding } from '../hooks/useOnboarding'

// Which feature sections each role sees, in reading order.
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

// Direct link target for each section — the page it's talking about.
const SECTION_LINK: Record<string, string> = {
  dashboard: '/dashboard',
  curriculum: '/curriculum',
  exercises: '/curriculum',
  playground: '/playground',
  discussion: '/curriculum',
  feedback: '/dashboard',
  certificates: '/profile',
  profile: '/profile',
  content_editing: '/curriculum',
  program_management: '/program-manager',
  student_review: '/program-manager',
  admin_console: '/admin',
  user_management: '/admin',
}

export default function GuidePage() {
  const { t } = useTranslation('onboarding')
  const { profile } = useAuth()
  const { startTour } = useOnboarding()

  const role: UserRole = profile?.role ?? 'student'
  const sections = SECTIONS_BY_ROLE[role] ?? SECTIONS_BY_ROLE.student

  const scrollTo = (key: string) => {
    document.getElementById(`guide-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="max-w-2xl">
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

      {/* Intro */}
      <p className="text-[15px] leading-relaxed text-gray-600 border-l-2 border-primary-200 pl-4 mb-8 max-w-3xl">
        {t('guide.intro')}
      </p>

      <div className="flex gap-8">
        {/* Table of contents */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {t('guide.toc_title')}
            </p>
            <nav className="space-y-0.5 border-l border-gray-200">
              {sections.map(key => {
                const Icon = SECTION_ICON[key] ?? BookOpen
                return (
                  <button
                    key={key}
                    onClick={() => scrollTo(key)}
                    className="flex items-center gap-2 w-full text-left -ml-px pl-4 pr-2 py-1.5 text-sm text-gray-600 hover:text-primary-700 border-l border-transparent hover:border-primary-500 transition-colors"
                  >
                    <Icon size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{t(`guide.sections.${key}.title`)}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Sections */}
        <div className="flex-1 min-w-0 space-y-10">
          {sections.map(key => {
            const Icon = SECTION_ICON[key] ?? BookOpen
            const points = t(`guide.sections.${key}.points`, { returnObjects: true }) as string[]
            const link = SECTION_LINK[key]
            return (
              <section key={key} id={`guide-${key}`} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {t(`guide.sections.${key}.title`)}
                  </h2>
                </div>

                <p className="text-[15px] leading-relaxed text-gray-600 mb-4 max-w-3xl">
                  {t(`guide.sections.${key}.body`)}
                </p>

                {Array.isArray(points) && points.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      {t('guide.capabilities_label')}
                    </p>
                    <ul className="space-y-1.5 max-w-3xl">
                      {points.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <Check size={16} className="text-primary-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center flex-wrap gap-x-5 gap-y-2 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin size={12} className="shrink-0" />
                    {t('guide.where_label')}: {t(`guide.sections.${key}.where`)}
                  </span>
                  {link && (
                    <Link
                      to={link}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      {t('guide.open_label')} {t(`guide.sections.${key}.title`)}
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
