import { createContext, useCallback, useContext, useRef } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver } from 'driver.js'
import type { Driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { buildTourSteps, type TourStep } from '../lib/onboardingSteps'

interface OnboardingContextValue {
  /** Launch the role-based, multi-page product tour immediately. */
  startTour: () => void
  /** True once the user has finished or skipped the tour before. */
  hasCompletedOnboarding: boolean
  /** Auto-run the tour once for a first-time user (no-op if already seen). */
  maybeAutoStart: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

const lsKey = (userId: string) => `onboarding_done_${userId}`

// Current router path under HashRouter, e.g. "#/curriculum" → "/curriculum".
function currentPath(): string {
  const raw = window.location.hash.replace(/^#/, '').split('?')[0]
  return raw || '/'
}

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// Resolve once the selector is in the DOM (or after `timeout` as a safety net,
// so a missing anchor degrades to a centered popover instead of hanging).
function waitForElement(selector: string, timeout = 5000): Promise<void> {
  return new Promise<void>(resolve => {
    const start = performance.now()
    const tick = () => {
      if (document.querySelector(selector)) return resolve()
      if (performance.now() - start > timeout) return resolve()
      requestAnimationFrame(tick)
    }
    tick()
  })
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('onboarding')
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const autoStartedRef = useRef(false)

  const hasCompletedOnboarding = Boolean(
    profile?.onboarding_completed_at ||
    (user && localStorage.getItem(lsKey(user.id))),
  )

  // Persist completion so the tour auto-runs only once. localStorage gives an
  // instant, offline-safe signal; the DB column syncs it across devices.
  const markComplete = useCallback(async () => {
    if (!user) return
    localStorage.setItem(lsKey(user.id), new Date().toISOString())
    if (profile && !profile.onboarding_completed_at) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq('id', user.id)
      await refreshProfile()
    }
  }, [user, profile, refreshProfile])

  const startTour = useCallback(() => {
    const steps = buildTourSteps(profile?.role, t)

    // Navigate to a step's route (if different) and wait for its anchor.
    const gotoStep = async (step: TourStep) => {
      if (step.route && currentPath() !== step.route) {
        navigate(step.route)
      }
      if (step.element) await waitForElement(step.element)
      else await delay(200)
    }

    const drv: Driver = driver({
      showProgress: true,
      allowClose: true,
      overlayColor: 'rgba(15, 23, 42, 0.6)',
      disableActiveInteraction: true,
      nextBtnText: t('tour.next'),
      prevBtnText: t('tour.prev'),
      doneBtnText: t('tour.done'),
      progressText: `{{current}} ${t('tour.progress_of')} {{total}}`,
      steps: steps.map(s => ({ element: s.element, popover: s.popover })),
      // We drive navigation manually so each stop lands on the right page.
      onNextClick: async () => {
        const idx = drv.getActiveIndex() ?? 0
        const target = steps[idx + 1]
        if (!target) { drv.destroy(); return }
        await gotoStep(target)
        drv.moveNext()
      },
      onPrevClick: async () => {
        const idx = drv.getActiveIndex() ?? 0
        const target = steps[idx - 1]
        if (!target) return
        await gotoStep(target)
        drv.movePrevious()
      },
      onCloseClick: () => drv.destroy(),
      onDestroyed: () => { void markComplete() },
    })

    // Make sure the first stop's page/anchor is ready before highlighting.
    void gotoStep(steps[0]).then(() => drv.drive())
  }, [profile?.role, t, navigate, markComplete])

  const maybeAutoStart = useCallback(() => {
    if (autoStartedRef.current) return
    if (!user || !profile) return
    if (hasCompletedOnboarding) return
    autoStartedRef.current = true
    // Let the current page (tour anchors) finish mounting before highlighting.
    setTimeout(startTour, 700)
  }, [user, profile, hasCompletedOnboarding, startTour])

  return (
    <OnboardingContext.Provider value={{ startTour, hasCompletedOnboarding, maybeAutoStart }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
