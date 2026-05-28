import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Clock, CheckCircle2, CalendarDays, Lock, XCircle, UserX, GraduationCap,
} from 'lucide-react'
import { LESSON_ZERO_ID } from '../../lib/constants'
import type { CohortStatus } from '../../hooks/useCohort'
import type { Cohort } from '../../types'

interface Props {
  status: CohortStatus
  cohort: Cohort | null
  courseStarted: boolean
}

function fmtDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function CohortNotice({ status, cohort, courseStarted }: Props) {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language === 'id' ? 'id' : 'en'

  // ── Active member ────────────────────────────────────────────────
  if (status === 'active' && cohort) {
    return (
      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-900">{cohort.name}</span>
              <span className="text-[11px] font-semibold bg-primary-600 text-white px-2 py-0.5 rounded-full">
                {t('cohort.enrolled')}
              </span>
            </div>
            {courseStarted ? (
              <p className="text-xs text-gray-600 mt-1">
                {t('cohort.course_running_ends', { date: fmtDate(cohort.course_close_at, locale) })}
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <CalendarDays size={12} />
                {t('cohort.course_starts_on', { date: fmtDate(cohort.course_start_at, locale) })}
                {' '}{t('cohort.orientation_only')}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Pending approval ─────────────────────────────────────────────
  if (status === 'pending') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
            <Clock size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">{t('cohort.pending_title')}</p>
            <p className="text-xs text-gray-600 mt-1">
              {cohort
                ? t('cohort.pending_body_with_cohort', { name: cohort.name })
                : t('cohort.pending_body')}
            </p>
            <button
              onClick={() => navigate(`/session/${LESSON_ZERO_ID}`)}
              className="cursor-pointer mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              <CheckCircle2 size={13} /> {t('cohort.open_orientation')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Expired ──────────────────────────────────────────────────────
  if (status === 'expired') {
    return (
      <NoticeShell
        icon={<Lock size={20} className="text-white" />}
        iconBg="bg-gray-400"
        border="border-gray-200 bg-gray-50"
        title={t('cohort.expired_title')}
        body={cohort
          ? t('cohort.expired_body_with_cohort', { name: cohort.name })
          : t('cohort.expired_body')}
      />
    )
  }

  // ── Rejected ─────────────────────────────────────────────────────
  if (status === 'rejected') {
    return (
      <NoticeShell
        icon={<XCircle size={20} className="text-white" />}
        iconBg="bg-red-500"
        border="border-red-200 bg-red-50"
        title={t('cohort.rejected_title')}
        body={t('cohort.rejected_body')}
      />
    )
  }

  // ── Removed ──────────────────────────────────────────────────────
  if (status === 'removed') {
    return (
      <NoticeShell
        icon={<UserX size={20} className="text-white" />}
        iconBg="bg-gray-400"
        border="border-gray-200 bg-gray-50"
        title={t('cohort.removed_title')}
        body={t('cohort.removed_body')}
      />
    )
  }

  // ── No enrollment ────────────────────────────────────────────────
  return (
    <NoticeShell
      icon={<CalendarDays size={20} className="text-white" />}
      iconBg="bg-gray-400"
      border="border-gray-200 bg-gray-50"
      title={t('cohort.none_title')}
      body={t('cohort.none_body')}
    />
  )
}

function NoticeShell({ icon, iconBg, border, title, body }: {
  icon: React.ReactNode; iconBg: string; border: string; title: string; body: string
}) {
  return (
    <div className={`rounded-2xl border p-5 ${border}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-600 mt-1">{body}</p>
        </div>
      </div>
    </div>
  )
}
