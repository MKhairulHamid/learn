import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { X, ArrowRight } from 'lucide-react'
import { useLiveCheckpointAlert } from '../../hooks/useLiveCheckpointAlert'
import type { Language } from '../../types'

/**
 * Floating "a checkpoint is live" prompt, mounted app-wide.
 *
 * Hidden on the session it belongs to, where the learner already has the
 * full overlay.
 */
export function LiveCheckpointBanner() {
  const { t, i18n } = useTranslation('common')
  const navigate = useNavigate()
  const location = useLocation()
  const alert = useLiveCheckpointAlert()
  const [dismissed, setDismissed] = useState<string | null>(null)

  if (!alert) return null
  if (dismissed === alert.activation.id) return null
  if (location.pathname.startsWith(`/session/${alert.sessionId}`)) return null

  const lang = (i18n.language?.startsWith('id') ? 'id' : 'en') as Language
  const title = lang === 'id' ? alert.titleId : alert.titleEn

  return (
    <div className="fixed inset-x-0 bottom-20 sm:bottom-6 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 max-w-lg w-full sm:w-auto rounded-2xl bg-primary-600 text-white shadow-xl px-4 py-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{t('checkpoint.live_now')}</p>
          <p className="text-xs text-primary-100 truncate">
            {alert.sessionNumber} · {title}
          </p>
        </div>
        <button
          onClick={() => navigate(`/session/${alert.sessionId}`)}
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl bg-white text-primary-700 hover:bg-primary-50 cursor-pointer"
        >
          {t('checkpoint.join')} <ArrowRight size={15} />
        </button>
        <button
          onClick={() => setDismissed(alert.activation.id)}
          title={t('checkpoint.dismiss')}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/15 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
