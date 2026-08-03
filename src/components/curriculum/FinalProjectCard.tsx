import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FolderKanban, FileSpreadsheet, Check, ChevronDown, ChevronUp, Sparkles,
  Download, SkipForward,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import {
  FINAL_PROJECT_FILE, FINAL_PROJECT_STEPS, FINAL_PROJECT_TOTAL,
  continuationFiles, stepsUnlockedThrough,
} from '../../data/finalProject'

interface Props {
  sessionNumber: string
  lang?: 'en' | 'id'
}

/**
 * Tells the learner which part of the Seduh Coffee final project they can now do
 * with the material they just covered, and lets them download the workbook.
 *
 * Renders only for sessions that have a project step (X01–X12); every other
 * program falls through the null guard below.
 */
export function FinalProjectCard({ sessionNumber, lang = 'en' }: Props) {
  const { t } = useTranslation('common')
  const [historyOpen, setHistoryOpen] = useState(false)

  const step = FINAL_PROJECT_STEPS[sessionNumber]
  if (!step) return null

  const unlocked = stepsUnlockedThrough(sessionNumber)
  const previous = unlocked.filter(s => s.step < step.step)
  const pct = (step.step / FINAL_PROJECT_TOTAL) * 100

  const title = lang === 'id' ? step.title_id : step.title_en
  const summary = lang === 'id' ? step.summary_id : step.summary_en
  const canDo = lang === 'id' ? step.can_do_id : step.can_do_en
  const gain = lang === 'id' ? step.gain_id : step.gain_en
  const starters = continuationFiles(step)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-start gap-3 flex-wrap">
        <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
          <FolderKanban size={16} className="text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{t('final_project.title')}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t('final_project.subtitle')}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="primary" size="sm">
            {t('final_project.step_of', { step: step.step, total: FINAL_PROJECT_TOTAL })}
          </Badge>
          {step.optional && (
            <Badge variant="warning" size="sm">{t('final_project.optional')}</Badge>
          )}
        </div>
      </div>

      {/* Progress across the 12-step arc */}
      <div className="px-5 pt-4">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${step.optional ? 'bg-amber-400' : 'bg-primary-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Optional steps are worth doing, but nobody should think they are behind */}
      {step.optional && (
        <div className="mx-5 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2.5">
          <SkipForward size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">{t('final_project.optional_title')}</span>{' '}
            {t('final_project.optional_body')}
            {gain && <> {t('final_project.optional_gain', { gain })}</>}
          </p>
        </div>
      )}

      {/* What this session unlocked */}
      <div className="px-5 pt-4 pb-5">
        <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles size={13} /> {t('final_project.new_this_session')}
        </p>

        <div className="flex items-baseline gap-2 flex-wrap mt-2">
          <h3 className="text-base font-bold text-gray-900 leading-snug">{title}</h3>
          {step.questions.length > 0 && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-2 py-0.5">
              {t('final_project.answers_questions', { questions: step.questions.join(', ') })}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mt-2">{summary}</p>

        <ul className="mt-4 space-y-2">
          {canDo.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                <Check size={10} className="text-green-600" />
              </span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Everything unlocked so far — the portfolio checklist, building up */}
      {previous.length > 0 && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setHistoryOpen(o => !o)}
            className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('final_project.unlocked_so_far')}
            </span>
            <span className="text-xs text-gray-400">
              {t('final_project.unlocked_count', { count: unlocked.length })}
            </span>
            <span className="ml-auto text-gray-400">
              {historyOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          </button>

          {historyOpen && (
            <ol className="px-5 pb-4 space-y-1.5">
              {previous.map(s => (
                <li key={s.step} className="flex items-start gap-2.5 text-sm text-gray-500">
                  <span className={`mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold shrink-0 ${
                    s.optional ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {s.step}
                  </span>
                  <span className="leading-snug">
                    {lang === 'id' ? s.title_id : s.title_en}
                    {s.optional && (
                      <span className="ml-1.5 text-[10px] font-semibold text-amber-600 uppercase tracking-wide">
                        {t('final_project.optional')}
                      </span>
                    )}
                  </span>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm font-medium text-gray-800">
                <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary-500 text-[10px] font-bold text-white shrink-0">
                  {step.step}
                </span>
                <span className="leading-snug">{title}</span>
              </li>
            </ol>
          )}
        </div>
      )}

      {/* Joined the program late? Start from the state this session assumes. */}
      {starters.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {t('final_project.continue_title')}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-1">
            {t('final_project.continue_hint', { step: step.step - 1 })}
          </p>

          <ul className="mt-3 space-y-2">
            {starters.map(file => (
              <li key={file.path}>
                <a
                  href={file.path}
                  download={file.downloadName}
                  className="group flex items-start gap-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/40 px-3.5 py-3 transition-colors"
                >
                  <span className="mt-0.5 w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <Download size={13} className="text-gray-400 group-hover:text-primary-600" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">
                        {lang === 'id' ? file.name_id : file.name_en}
                      </span>
                      <span className="text-xs text-gray-400">{file.sizeLabel}</span>
                    </span>
                    <span className="block text-xs text-gray-500 leading-relaxed mt-1">
                      {lang === 'id' ? file.hint_id : file.hint_en}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Download */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{t('final_project.workbook_title')}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t('final_project.workbook_hint')}</p>
        </div>
        <a
          href={FINAL_PROJECT_FILE.path}
          download={FINAL_PROJECT_FILE.downloadName}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
        >
          <FileSpreadsheet size={15} />
          {t('final_project.download')}
          <span className="text-xs font-normal text-primary-100">{FINAL_PROJECT_FILE.sizeLabel}</span>
        </a>
      </div>
    </div>
  )
}
