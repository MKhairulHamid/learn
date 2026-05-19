import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowLeft, Clock, CheckCircle2, BookOpen, ChevronRight,
  Lock, Video, CalendarDays, PlayCircle,
} from 'lucide-react'
import { useSession } from '../hooks/usePhases'
import { useProgress } from '../hooks/useProgress'
import { useCohort } from '../hooks/useCohort'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { SessionPlayground } from '../components/exercises/SessionPlayground'
import { SessionExercises } from '../components/exercises/SessionExercises'
import { DiscussionPanel } from '../components/discussion/DiscussionPanel'
import { CohortNotice } from '../components/cohort/CohortNotice'

// Long date label for a live session day, e.g. "Saturday, 14 June 2026"
const fmtLong = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

export default function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation('common')
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const exercisesRef = useRef<HTMLDivElement>(null)
  const { session, loading } = useSession(id)
  const { isCompleted, markComplete } = useProgress()
  const cohort = useCohort()
  const lang = i18n.language === 'id' ? 'id' : 'en'

  // Passthrough pre — let CodeBlock handle block rendering entirely
  function PreBlock({ children }: ComponentPropsWithoutRef<'pre'>) {
    return <>{children}</>
  }

  // Copy button with transient "Copied!" feedback
  function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    function copy() {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
    }
    return (
      <button
        onClick={copy}
        className="text-xs text-gray-500 hover:text-gray-200 transition-colors px-2 py-0.5 rounded hover:bg-white/10"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    )
  }

  // Custom renderer: flow diagrams → pills, fenced code → modern block, inline → badge
  function CodeBlock({ children, className }: ComponentPropsWithoutRef<'code'>) {
    const text = String(children).trim()
    const lang = className?.replace('language-', '') ?? ''
    const isBlock = !!lang || text.includes('\n')
    const isFlow = text.includes('→') && !className

    if (isFlow) {
      const steps = text.split('→').map(s => s.trim()).filter(Boolean)
      return (
        <div className="my-4 flex flex-wrap items-center gap-2">
          {steps.map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="bg-primary-50 border border-primary-200 text-primary-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                {step}
              </span>
              {i < steps.length - 1 && (
                <span className="text-primary-400 font-bold text-sm">→</span>
              )}
            </span>
          ))}
        </div>
      )
    }

    if (isBlock) {
      const langLabel: Record<string, string> = {
        sql: 'SQL', python: 'Python', js: 'JavaScript', ts: 'TypeScript',
        bash: 'Shell', sh: 'Shell', json: 'JSON', csv: 'CSV',
      }
      const displayLang = langLabel[lang.toLowerCase()] ?? lang.toUpperCase()

      return (
        <div className="not-prose my-5 rounded-xl overflow-hidden border border-gray-800/60 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between pl-4 pr-3 py-2.5 bg-[#161b22] border-b border-gray-700/60">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            {displayLang && (
              <span className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">
                {displayLang}
              </span>
            )}
            <CopyButton text={text} />
          </div>
          {/* Code body */}
          <div className="bg-[#0d1117] overflow-x-auto">
            <code className="block px-5 py-4 text-[13px] font-mono text-[#c9d1d9] leading-[1.75] whitespace-pre">
              {children}
            </code>
          </div>
        </div>
      )
    }

    // Inline code
    return (
      <code className="bg-primary-50 border border-primary-100 px-1.5 py-0.5 rounded-md text-[0.82em] font-mono text-primary-700 not-italic">
        {children}
      </code>
    )
  }

  const done = id ? isCompleted(id) : false
  const title = session ? (lang === 'id' ? session.title_id : session.title_en) : ''
  const content = session ? (lang === 'id' ? session.content_id : session.content_en) : ''

  // Determine embedded playground type from session number
  const sqlSessions = ['04', '05', '06']
  const pythonSessions = ['10']
  const playgroundType = session
    ? sqlSessions.includes(session.session_number) ? 'sql'
      : pythonSessions.includes(session.session_number) ? 'python'
      : null
    : null

  const learningOutput = session
    ? (lang === 'id' ? session.learning_output_id : session.learning_output_en)
    : ''

  // Log session view
  useEffect(() => {
    if (user && id) {
      supabase.from('user_activity_logs').insert({
        user_id: user.id,
        action_type: 'session_view',
        metadata: { session_id: id },
      })
    }
  }, [user, id])

  // Scroll to exercises section when coming back from an exercise page
  useEffect(() => {
    if (location.state?.scrollTo === 'exercises' && exercisesRef.current) {
      setTimeout(() => {
        exercisesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [location.state])

  if (loading || cohort.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Session not found.</p>
        <Button className="mt-4" onClick={() => navigate('/curriculum')}>
          {t('common.back')}
        </Button>
      </div>
    )
  }

  const sched = cohort.getScheduleFor(session.id)
  const accessible = cohort.isSessionAccessible(session)

  // ── Locked lesson — show why instead of the content ──────────────
  if (!accessible) {
    const cohortLevelIssue =
      cohort.status === 'none' || cohort.status === 'rejected' ||
      cohort.status === 'removed' || cohort.status === 'expired'
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
        <button
          onClick={() => navigate('/curriculum')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('common.back')} to Curriculum
        </button>

        {cohortLevelIssue ? (
          <CohortNotice status={cohort.status} cohort={cohort.cohort} courseStarted={cohort.courseStarted} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={26} className="text-gray-400" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              {sched
                ? `This lesson unlocks on ${fmtLong(sched.scheduled_date)}. It pairs with the live session held that day.`
                : 'This lesson opens once your course is underway. For now, start with the orientation lesson.'}
            </p>
            <Button className="mt-5" onClick={() => navigate('/curriculum')}>
              Back to Curriculum
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
      {/* Back nav */}
      <button
        onClick={() => navigate('/curriculum')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('common.back')} to Curriculum
      </button>

      {/* Session header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" size="sm">Session {session.session_number}</Badge>
              <Badge variant="gray" size="sm">{session.unit_skkni}</Badge>
              {done && <Badge variant="success" size="sm">✓ {t('common.completed')}</Badge>}
            </div>
            <h1 className="mt-3 text-xl font-bold text-gray-900 leading-snug">{title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {session.estimated_duration_minutes} {t('common.minutes')}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {session.session_number === '11' ? '1 project' : 'Lesson + exercises'}
              </span>
            </div>
          </div>
          {done && (
            <CheckCircle2 size={40} className="text-green-500 shrink-0" />
          )}
        </div>

        {/* Learning outcome */}
        {learningOutput && (
          <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
              What you'll learn
            </p>
            <p className="text-sm text-primary-800">{learningOutput}</p>
          </div>
        )}
      </div>

      {/* Live session — date + Zoom / recording links */}
      {sched && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <CalendarDays size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Live session</p>
                <p className="text-sm font-semibold text-gray-800">
                  {fmtLong(sched.scheduled_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {sched.zoom_link && (
                <a
                  href={sched.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                >
                  <Video size={15} /> Join Live
                </a>
              )}
              {sched.recording_url && (
                <a
                  href={sched.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PlayCircle size={15} /> Recording
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lesson content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="prose prose-sm sm:prose max-w-none
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:first:mt-0
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-code:before:content-none prose-code:after:content-none
          prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold
          prose-td:py-2 prose-td:px-3
          prose-blockquote:border-primary-300 prose-blockquote:bg-primary-50
          prose-blockquote:rounded-r-xl prose-blockquote:py-2
          prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
          prose-li:text-gray-700
          prose-strong:text-gray-900
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock, pre: PreBlock }}
          >
            {content || '*Content coming soon.*'}
          </ReactMarkdown>
        </div>
      </div>

      {/* Embedded playground for SQL / Python sessions */}
      {playgroundType && (
        <div className="mb-8">
          <SessionPlayground type={playgroundType} lang={lang} />
        </div>
      )}

      {/* Exercises for this session */}
      <div ref={exercisesRef} className="mb-8">
        {id && <SessionExercises sessionId={id} lang={lang} />}
      </div>

      {/* ── Session completion CTA ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-2 flex items-center justify-between gap-4 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => navigate('/curriculum')}>
          <ArrowLeft size={15} />
          {t('common.back')}
        </Button>

        <div className="flex items-center gap-3">
          {!done ? (
            <Button
              size="lg"
              onClick={() => id && markComplete(id)}
              className="gap-2"
            >
              <CheckCircle2 size={18} />
              {t('common.complete')}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 size={16} /> {t('common.completed')}
              </span>
              <Button
                variant="secondary"
                onClick={() => navigate('/curriculum')}
              >
                Next Session <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Discussion — sits below the completion CTA as a bonus section */}
      {id && <DiscussionPanel sessionId={id} />}
    </div>
  )
}
