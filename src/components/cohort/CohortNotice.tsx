import { useNavigate } from 'react-router-dom'
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

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/**
 * Informational card describing the user's cohort relationship.
 * Used as a banner on the Dashboard and as a full-width gate on the Curriculum.
 */
export function CohortNotice({ status, cohort, courseStarted }: Props) {
  const navigate = useNavigate()

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
                Enrolled
              </span>
            </div>
            {courseStarted ? (
              <p className="text-xs text-gray-600 mt-1">
                Course running · ends {fmtDate(cohort.course_close_at)}
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <CalendarDays size={12} />
                Course starts {fmtDate(cohort.course_start_at)} — only the orientation
                lesson is open until then.
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
            <p className="text-sm font-bold text-gray-900">Application under review</p>
            <p className="text-xs text-gray-600 mt-1">
              {cohort
                ? `You've applied to ${cohort.name}. An admin will review your enrollment soon.`
                : 'An admin will review your enrollment soon.'}
              {' '}You can explore the orientation lesson while you wait.
            </p>
            <button
              onClick={() => navigate(`/session/${LESSON_ZERO_ID}`)}
              className="cursor-pointer mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              <CheckCircle2 size={13} /> Open Lesson 0 — Orientation
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
        title="Course access has ended"
        body={cohort
          ? `Your access to ${cohort.name} has expired. Contact an admin if you need an extension.`
          : 'Your course access has expired.'}
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
        title="Application not approved"
        body="Your cohort application was not approved. Reach out to an admin if you think this is a mistake."
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
        title="No longer in this cohort"
        body="You have been removed from your cohort. Contact an admin for details."
      />
    )
  }

  // ── No enrollment ────────────────────────────────────────────────
  return (
    <NoticeShell
      icon={<CalendarDays size={20} className="text-white" />}
      iconBg="bg-gray-400"
      border="border-gray-200 bg-gray-50"
      title="You're not enrolled in a cohort yet"
      body="Lessons open once you're enrolled in a cohort. Enrollment is available during an admission period — check back when the next intake opens."
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
