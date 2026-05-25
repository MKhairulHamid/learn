import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft, Clock, CheckCircle2, BookOpen, ChevronRight,
  Lock, Video, CalendarDays, PlayCircle, Pencil,
} from 'lucide-react'
import { useSession } from '../hooks/usePhases'
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
  const { session: fetched, loading } = useSession(id)
  const { isCompleted, markComplete } = useProgress()
  const cohort = useCohort()
  const lang = i18n.language === 'id' ? 'id' : 'en'

  // Local draft holds saved edits so the page reflects them without a refetch.
  const [draft, setDraft] = useState<Session | null>(null)
  const [editing, setEditing] = useState(false)
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
