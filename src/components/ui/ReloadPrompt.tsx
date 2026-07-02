import { useRegisterSW } from 'virtual:pwa-register/react'
import { useTranslation } from 'react-i18next'
import { RefreshCw, X } from 'lucide-react'
import { Button } from './Button'

// How often to check the server for a newer build while the app stays open.
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000 // 1 hour

/**
 * Shows a toast when a new service-worker build is waiting, letting the user
 * reload on demand. Replaces the old `autoUpdate` behaviour where new deploys
 * only appeared after several manual refreshes.
 */
export function ReloadPrompt() {
  const { t } = useTranslation()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update()
        }, UPDATE_CHECK_INTERVAL)
      }
    },
  })

  if (!needRefresh) return null

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2
                 rounded-xl border border-gray-200 bg-white p-4 shadow-lg
                 md:left-auto md:right-4 md:translate-x-0"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
          <RefreshCw className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{t('update.title')}</p>
          <p className="mt-0.5 text-sm text-gray-600">{t('update.desc')}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => updateServiceWorker(true)}>
              {t('update.reload')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setNeedRefresh(false)}>
              {t('update.dismiss')}
            </Button>
          </div>
        </div>
        <button
          type="button"
          aria-label={t('update.dismiss')}
          onClick={() => setNeedRefresh(false)}
          className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
