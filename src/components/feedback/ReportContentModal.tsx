import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Flag, CheckCircle2, Loader2 } from 'lucide-react'
import { useSubmitReport, type ReportReason } from '../../hooks/useContentReport'

interface Props {
  sessionId: string
  sessionTitle: string
  onClose: () => void
}

export function ReportContentModal({ sessionId, sessionTitle, onClose }: Props) {
  const { t } = useTranslation('common')
  const { submit, submitting, error, submitted } = useSubmitReport(sessionId)
  const [reason, setReason] = useState<ReportReason>('incorrect_content')
  const [details, setDetails] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const reasons: { value: ReportReason; label: string }[] = [
    { value: 'incorrect_content',  label: t('report.reason_incorrect') },
    { value: 'outdated',           label: t('report.reason_outdated') },
    { value: 'broken_exercise',    label: t('report.reason_broken_exercise') },
    { value: 'missing_content',    label: t('report.reason_missing') },
    { value: 'other',              label: t('report.reason_other') },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await submit(reason, details.trim())
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Flag size={15} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{t('report.modal_title')}</h2>
              <p className="text-xs text-gray-500 truncate max-w-[260px]">{sessionTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-500" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{t('report.submitted_title')}</p>
              <p className="text-xs text-gray-500 max-w-xs">{t('report.submitted_desc')}</p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
              >
                {t('common.close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('report.reason_label')}
                </label>
                <div className="space-y-2">
                  {reasons.map(r => (
                    <label key={r.value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="accent-red-500 w-3.5 h-3.5 shrink-0"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {r.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t('report.details_label')}
                </label>
                <textarea
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder={t('report.details_placeholder')}
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 placeholder:text-gray-400"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {submitting
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Flag size={14} />}
                  {t('report.submit')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
