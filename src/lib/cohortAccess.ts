import type { CohortEnrollment, CohortLessonSchedule, EnrollmentTier, Session } from '../types'

// Derived, UI-facing status for a user's relationship to a cohort.
export type CohortStatus =
  | 'none'      // no enrollment record at all
  | 'pending'   // applied, awaiting admin approval
  | 'active'    // approved and within access window
  | 'expired'   // approved but access window has passed
  | 'rejected'  // application was rejected
  | 'removed'   // removed from the cohort by an admin

// Local date as yyyy-mm-dd (matches the schedule `date` column for lexical compare).
export const todayStr = () => new Date().toLocaleDateString('en-CA')

// Add `months` calendar months to an ISO timestamp.
export function addMonths(iso: string, months: number): string {
  const d = new Date(iso)
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
}

export function deriveStatus(e: Pick<CohortEnrollment, 'status' | 'access_expires_at'>): CohortStatus {
  if (e.status === 'active') {
    if (e.access_expires_at && new Date(e.access_expires_at) < new Date()) return 'expired'
    return 'active'
  }
  return e.status as CohortStatus
}

/**
 * Lesson access rule for one cohort:
 *   - Lesson 0 (orientation) is open to pending + active members
 *   - Upscale (is_extension) lessons additionally require the 'extended' tier
 *   - every other lesson needs an active (non-expired) enrollment AND the
 *     lesson unlocked — by admin override, else once its scheduled date arrives
 *
 * Editor bypass is applied by callers, not here.
 */
export function isSessionAccessibleFor(
  session: Pick<Session, 'id' | 'session_number'> & { is_extension?: boolean },
  status: CohortStatus,
  schedule: CohortLessonSchedule[],
  tier: EnrollmentTier = 'essential',
): boolean {
  if (session.session_number === '00') return status === 'pending' || status === 'active'
  if (status !== 'active') return false
  // Extended/Upscale sessions are only for the 'extended' tier.
  if (session.is_extension && tier !== 'extended') return false
  const sched = schedule.find(s => s.session_id === session.id)
  if (!sched) return false
  if (sched.unlock_override === true) return true
  if (sched.unlock_override === false) return false
  return sched.scheduled_date <= todayStr()
}
