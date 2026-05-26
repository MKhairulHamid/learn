import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft, Clock, CheckCircle2, BookOpen, ChevronRight, ChevronDown, ChevronUp,
  Lock, Video, CalendarDays, PlayCircle, Pencil, Copy, Check, Info, ListOrdered,
} from 'lucide-react'
import { useSession, usePhases } from '../hooks/usePhases'
import { useProgress } from '../hooks/useProgress'
import { useCohort } from '../hooks/useCohort'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useEffect, useRef, useState } from 'react'
import type { Session } from '../types'
import { SessionPlayground } from '../components/exercises/SessionPlayground'
import { SessionExercises } from '../components/exercises/SessionExercises'
import { DiscussionPanel } from '../components/discussion/DiscussionPanel'
import { FeedbackPanel } from '../components/feedback/FeedbackPanel'
import { CohortNotice } from '../components/cohort/CohortNotice'
import { LessonMarkdown } from '../components/curriculum/LessonMarkdown'
import { LessonEditor } from '../components/curriculum/LessonEditor'

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
  const { session: fetched, programId, loading } = useSession(id)
  const { isCompleted, markComplete } = useProgress()
  const cohort = useCohort()
  const { setActiveProgram } = cohort
  const lang = i18n.language === 'id' ? 'id' : 'en'

  // Resolve cohort/progress against the program this lesson belongs to, so a
  // learner enrolled in multiple programs sees the right schedule and progress.
  // Orientation (programId null) is shared and keeps the current program.
  useEffect(() => {
    if (programId) setActiveProgram(programId)
  }, [programId, setActiveProgram])

  // Back/next return to this lesson's program curriculum (orientation has none).
  const curriculumPath = programId ? `/curriculum/${programId}` : '/curriculum'

  // Local draft holds saved edits so the page reflects them without a refetch.
  const { phases } = usePhases(programId ?? undefined)

  const [draft, setDraft] = useState<Session | null>(null)
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const copyLiveLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  useEffect(() => { setDraft(null); setEditing(false) }, [fetched?.id])
  const session = draft ?? fetched

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

  // Wait until the cohort context has switched to this lesson's program,
  // otherwise gating would briefly use the previously active program's cohort.
  const programResolving = !!programId && cohort.activeProgramId !== programId

  if (loading || cohort.loading || programResolving) {
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
        <Button className="mt-4" onClick={() => navigate(curriculumPath)}>
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
          onClick={() => navigate(curriculumPath)}
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
            <Button className="mt-5" onClick={() => navigate(curriculumPath)}>
              Back to Curriculum
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Flat list of all sessions across phases for prev/next navigation
  const allSessions = phases.flatMap(p => p.sessions ?? [])
  const currentIdx = allSessions.findIndex(s => s.id === id)
  const prevSession = currentIdx > 0 ? allSessions[currentIdx - 1] : null
  const nextSession = currentIdx >= 0 && currentIdx < allSessions.length - 1 ? allSessions[currentIdx + 1] : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-8">
      {/* Back nav */}
      <button
        onClick={() => navigate(curriculumPath)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('common.back')} to Curriculum
      </button>

      {/* Mobile sessions toggle */}
      {phases.length > 0 && (
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="lg:hidden flex items-center gap-2 w-full mb-4 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ListOrdered size={16} className="text-primary-600" />
          All Sessions
          <span className="ml-auto text-xs text-gray-400">
            {allSessions.filter(s => isCompleted(s.id)).length}/{allSessions.length} done
          </span>
          {sidebarOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      )}

      {/* Mobile sidebar (collapsible) */}
      {sidebarOpen && phases.length > 0 && (
        <div className="lg:hidden bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
          <SessionSidebar
            phases={phases}
            currentSessionId={id}
            isCompleted={isCompleted}
            isAccessible={s => cohort.isSessionAccessible(s)}
            lang={lang}
            onNavigate={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex gap-6 items-start">
        {/* Desktop sidebar */}
        {phases.length > 0 && (
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-6 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
            <SessionSidebar
              phases={phases}
              currentSessionId={id}
              isCompleted={isCompleted}
              isAccessible={s => cohort.isSessionAccessible(s)}
              lang={lang}
            />
          </aside>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">

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

      {/* Live session — date + Zoom / recording */}
      {sched && (() => {
        const sessionDate = new Date(sched.scheduled_date + 'T00:00:00')
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const isPast = sessionDate < today

        // Extract YouTube embed URL from a watch or shortened URL
        const getYouTubeEmbedUrl = (url: string) => {
          const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
          return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : null
        }
        const embedUrl = sched.recording_url ? getYouTubeEmbedUrl(sched.recording_url) : null

        return (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              {/* Date row */}
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

                {/* Join Live + Copy */}
                {sched.zoom_link && (
                  <div className="flex items-center gap-2">
                    <a
                      href={sched.zoom_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                    >
                      <Video size={15} /> Join Live
                    </a>
                    <button
                      onClick={() => copyLiveLink(sched.zoom_link!)}
                      title="Copy live link"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </button>
                  </div>
                )}
              </div>

              {/* Reminder note */}
              {sched.zoom_link && (
                <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <Info size={13} className="shrink-0 mt-0.5 text-gray-400" />
                  <span>The live link is also available in your cohort's schedule. Share it only with enrolled learners.</span>
                </div>
              )}

              {/* Recording section */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <PlayCircle size={13} /> Session Recording
                </p>
                {embedUrl ? (
                  <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={embedUrl}
                      title="Session recording"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : sched.recording_url ? (
                  <a
                    href={sched.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors w-fit"
                  >
                    <PlayCircle size={15} /> Watch Recording
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5">
                    <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <PlayCircle size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {isPast ? 'Recording coming soon' : 'Recording not yet available'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {isPast
                          ? 'The recording will be posted here shortly after the session.'
                          : 'After the live session, the recording will appear here.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      })()}

      {/* Lesson content */}
      {editing ? (
        <LessonEditor
          session={session}
          onSaved={updated => { setDraft(updated); setEditing(false) }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          {cohort.isEditor && (
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil size={14} /> Edit lesson
              </Button>
            </div>
          )}
          <LessonMarkdown>{content || ''}</LessonMarkdown>
        </div>
      )}

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
        <div className="flex items-center gap-2">
          {prevSession ? (
            <Button variant="outline" size="sm" onClick={() => navigate(`/session/${prevSession.id}`)}>
              <ArrowLeft size={15} />
              Prev
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate(curriculumPath)}>
              <ArrowLeft size={15} />
              {t('common.back')}
            </Button>
          )}
        </div>

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
              {nextSession ? (
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/session/${nextSession.id}`)}
                >
                  Next Session <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => navigate(curriculumPath)}
                >
                  Back to Curriculum <ChevronRight size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feedback — only visible when admin has opened the window */}
      {id && <FeedbackPanel sessionId={id} />}

      {/* Discussion — sits below the completion CTA as a bonus section */}
      {id && <DiscussionPanel sessionId={id} />}

        </div>{/* end main content */}
      </div>{/* end flex layout */}
    </div>
  )
}

// ── Sidebar component ─────────────────────────────────────────────────────────

interface SessionSidebarProps {
  phases: import('../types').Phase[]
  currentSessionId: string | undefined
  isCompleted: (sessionId: string) => boolean
  isAccessible: (s: Pick<import('../types').Session, 'id' | 'session_number'>) => boolean
  lang: string
  onNavigate?: () => void
}

function SessionSidebar({ phases, currentSessionId, isCompleted, isAccessible, lang, onNavigate }: SessionSidebarProps) {
  const navigate = useNavigate()
  const totalSessions = phases.reduce((n, p) => n + (p.sessions?.length ?? 0), 0)
  const completedCount = phases.reduce(
    (n, p) => n + (p.sessions?.filter(s => isCompleted(s.id)).length ?? 0),
    0,
  )

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sessions</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: totalSessions > 0 ? `${(completedCount / totalSessions) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-xs text-gray-400 shrink-0">{completedCount}/{totalSessions}</span>
        </div>
      </div>

      {/* Phase groups */}
      <div className="py-2">
        {phases.map(phase => {
          const phaseName = lang === 'id' ? phase.name_id : phase.name_en
          const sessions = phase.sessions ?? []
          return (
            <div key={phase.id}>
              <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {phaseName}
              </p>
              {sessions.map(s => {
                const isCurrent = s.id === currentSessionId
                const done = isCompleted(s.id)
                const accessible = isAccessible(s)
                const sTitle = lang === 'id' ? s.title_id : s.title_en

                return (
                  <button
                    key={s.id}
                    disabled={!accessible}
                    onClick={() => {
                      if (accessible) {
                        navigate(`/session/${s.id}`)
                        onNavigate?.()
                      }
                    }}
                    className={[
                      'w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors',
                      isCurrent
                        ? 'bg-primary-50 border-r-2 border-primary-500'
                        : accessible
                        ? 'hover:bg-gray-50'
                        : 'opacity-40 cursor-not-allowed',
                    ].join(' ')}
                  >
                    {/* Status icon */}
                    <span className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckCircle2 size={15} className="text-green-500" />
                      ) : !accessible ? (
                        <Lock size={14} className="text-gray-400" />
                      ) : (
                        <span className={[
                          'inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold',
                          isCurrent ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500',
                        ].join(' ')}>
                          {s.session_number}
                        </span>
                      )}
                    </span>
                    {/* Title */}
                    <span className={[
                      'text-xs leading-snug line-clamp-2',
                      isCurrent ? 'font-semibold text-primary-700' : done ? 'text-gray-500' : 'text-gray-700',
                    ].join(' ')}>
                      {sTitle}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
