import type { TFunction } from 'i18next'
import type { UserRole } from '../types'

// A single tour stop. Unlike a raw driver.js step, it also carries the route
// the tour should be on when this stop is shown — the controller navigates
// there (and waits for `element` to mount) before highlighting.
export interface TourStep {
  /** Route to navigate to before showing this step. Omit to stay put. */
  route?: string
  /** CSS selector to highlight. Omit for a centered, page-level popover. */
  element?: string
  popover: {
    title: string
    description: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
  }
}

// Builds a detailed, multi-page product tour tailored to the user's role.
//
// The tour walks the user *through the actual pages* — Dashboard, Lessons,
// Playground, plus role-specific consoles — highlighting a real element on
// each so the walkthrough is concrete rather than a list of nav links.
export function buildTourSteps(role: UserRole | null | undefined, t: TFunction): TourStep[] {
  const isProgramManager = role === 'admin' || role === 'program_manager'
  const isAdmin = role === 'admin'

  const step = (
    key: string,
    opts: { route?: string; element?: string; side?: TourStep['popover']['side']; align?: TourStep['popover']['align'] } = {},
  ): TourStep => ({
    route: opts.route,
    element: opts.element,
    popover: {
      title: t(`tour.${key}.title`),
      description: t(`tour.${key}.body`),
      side: opts.side,
      align: opts.align,
    },
  })

  const steps: TourStep[] = [
    // Centered welcome — shows on whatever page auto-start fired.
    step('welcome'),
  ]

  // Admins land on /admin (Dashboard redirects them), so skip the learner
  // dashboard stops for them.
  if (!isAdmin) {
    steps.push(
      step('dashboard', { route: '/dashboard', element: '[data-tour="dash-greeting"]', side: 'bottom', align: 'start' }),
      step('my_programs', { route: '/dashboard', element: '[data-tour="dash-programs"]', side: 'bottom', align: 'start' }),
    )
  }

  steps.push(
    step('curriculum', { route: '/curriculum', element: '[data-tour="curriculum-header"]', side: 'bottom', align: 'start' }),
    step('exercises', { route: '/curriculum' }),
    step('playground', { route: '/playground', element: '[data-tour="playground-tabs"]', side: 'bottom', align: 'start' }),
    step('notifications', { element: '[data-tour="nav-notifications"]', side: 'bottom', align: 'end' }),
  )

  if (isProgramManager) {
    steps.push(step('program_mgmt', { route: '/program-manager', element: '[data-tour="pm-header"]', side: 'bottom', align: 'start' }))
  }
  if (isAdmin) {
    steps.push(step('admin', { route: '/admin', element: '[data-tour="admin-header"]', side: 'bottom', align: 'start' }))
  }

  steps.push(
    step('profile', { route: '/profile', element: '[data-tour="profile-header"]', side: 'bottom', align: 'start' }),
    step('user', { element: '[data-tour="nav-user"]', side: 'bottom', align: 'end' }),
    step('finish'),
  )

  return steps
}
