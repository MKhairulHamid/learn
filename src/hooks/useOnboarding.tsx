import { createContext, useCallback, useContext, useRef } from 'react'
import type { ReactNode } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { buildTourSteps } from '../lib/onboardingSteps'

interface OnboardingContextValue {
  /** Launch the role-based product tour immediately. */
  startTour: () => void
  /** True once the user has finished or skipped the tour before. */
  hasCompletedOnboarding: boolean
  /** Auto-run the tour once for a first-time user (no-op if already seen). */
  maybeAutoStart: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

const lsKey = (userId: string) => `onboarding_done_${userId}`

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('onboarding')
  const { user, profile, refreshProfile } = useAuth()
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
    const drv = driver({
      showProgress: true,
      allowClose: true,
      overlayColor: 'rgba(15, 23, 42, 0.6)',
      nextBtnText: t('tour.next'),
      prevBtnText: t('tour.prev'),
      doneBtnText: t('tour.done'),
      progressText: `{{current}} ${t('tour.progress_of')} {{total}}`,
      steps,
      onDestroyed: () => { void markComplete() },
    })
    drv.drive()
  }, [profile?.role, t, markComplete])

  const maybeAutoStart = useCallback(() => {
    if (autoStartedRef.current) return
    if (!user || !profile) return
    if (hasCompletedOnboarding) return
    autoStartedRef.current = true
    // Let the navbar (tour anchors) finish mounting before highlighting.
    setTimeout(startTour, 600)
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
