import type { DriveStep } from 'driver.js'
import type { TFunction } from 'i18next'
import type { UserRole } from '../types'

// Builds the role-specific product-tour steps.
//
// Steps anchor to `data-tour="…"` attributes on the (always-mounted) navbar so
// the tour works from any page. Steps without an `element` render as a centered
// popover — used for the welcome / finish cards.
//
// The desktop nav links are hidden below the `md` breakpoint, so on small
// screens those anchored steps fall back to centered popovers automatically
// (driver.js centers when the target isn't visible).
export function buildTourSteps(role: UserRole | null | undefined, t: TFunction): DriveStep[] {
  const isProgramManager = role === 'admin' || role === 'program_manager'
  const isAdmin = role === 'admin'

  const step = (key: string, element?: string): DriveStep => ({
    ...(element ? { element } : {}),
    popover: {
      title: t(`tour.${key}.title`),
      description: t(`tour.${key}.body`),
    },
  })

  const steps: DriveStep[] = [
    step('welcome'),
    step('dashboard', '[data-tour="nav-dashboard"]'),
    step('curriculum', '[data-tour="nav-curriculum"]'),
    step('playground', '[data-tour="nav-playground"]'),
  ]

  if (isProgramManager) steps.push(step('programs', '[data-tour="nav-programs"]'))
  if (isAdmin) steps.push(step('admin', '[data-tour="nav-admin"]'))

  steps.push(
    step('notifications', '[data-tour="nav-notifications"]'),
    step('user', '[data-tour="nav-user"]'),
    step('finish'),
  )

  return steps
}
