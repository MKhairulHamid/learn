import { useEffect, useRef, useState } from 'react'
import {
  BookOpen, Code2, Play, CheckCircle2, MessageSquare, Bell, ShieldCheck,
  GraduationCap, Users, Activity, TrendingUp, Radio, Globe, Zap, Database,
  CalendarClock, ArrowRight, MousePointer2, BarChart3, Lock, ChevronDown,
  Video, Layers, Target, Award, ChevronLeft, ChevronRight, Maximize2,
  Minimize2, Terminal, BarChart2, CalendarDays,
} from 'lucide-react'

/* ───────────────────────────────────────────────────────────────────────────
   Demo page — NOT linked from navigation. Reachable only via direct URL #/demo.
   Scroll-through partnership overview for Talentiv.
─────────────────────────────────────────────────────────────────────────── */

type SceneId = 'curriculum' | 'session' | 'sql' | 'python' | 'progress' | 'admin'

interface Slide {
  scene: SceneId
  phase: string
  caption: string
  detail: string
}

const SCENES: { id: SceneId; label: string; url: string }[] = [
  { id: 'curriculum', label: 'Curriculum',         url: 'datalearn.app/curriculum' },
  { id: 'session',    label: 'Session View',        url: 'datalearn.app/session/04' },
  { id: 'sql',        label: 'SQL Exercises',       url: 'datalearn.app/exercise/04-1' },
  { id: 'python',     label: 'Python Playground',   url: 'datalearn.app/playground' },
  { id: 'progress',   label: 'Dashboard',           url: 'datalearn.app/dashboard' },
  { id: 'admin',      label: 'Admin Panel',         url: 'datalearn.app/admin' },
]

const SLIDES: Slide[] = [
  // Curriculum
  {
    scene: 'curriculum', phase: 'phases',
    caption: 'Structured curriculum — 4 learning phases, 12 sessions',
    detail: 'From data fundamentals to Python for analytics. Each phase builds directly on the last, designed to pair with Talentiv\'s live expert sessions.',
  },
  // Session — sidebar nav
  {
    scene: 'session', phase: 'sidebar',
    caption: 'Session view with left-sidebar navigation across all lessons',
    detail: 'Learners see every session and their progress without leaving the page. The active session is always in context.',
  },
  // Session — live card
  {
    scene: 'session', phase: 'live',
    caption: 'Live session card: scheduled date, Zoom link, and recording',
    detail: 'Talentiv\'s expert sessions link directly into the platform. Recordings are embedded immediately after each live class.',
  },
  // SQL
  {
    scene: 'sql', phase: 'editor',
    caption: 'In-browser SQL environment — zero installation required',
    detail: 'Real e-commerce dataset. Learners write and run queries without installing anything — they\'re coding on day one.',
  },
  {
    scene: 'sql', phase: 'passed',
    caption: 'Auto-graded: 3 / 3 test cases passed with instant feedback',
    detail: 'Every exercise validated against deterministic test cases. No manual grading, no waiting — results are immediate.',
  },
  // Python
  {
    scene: 'python', phase: 'code',
    caption: 'Python + pandas + matplotlib — runs entirely in the browser',
    detail: 'Full scientific Python stack via Pyodide. Learners write real data analysis code — no Jupyter, no setup.',
  },
  {
    scene: 'python', phase: 'result',
    caption: 'Live chart output and DataFrame results, side by side',
    detail: 'Visualizations render directly in the platform. Code → output in seconds.',
  },
  // Dashboard
  {
    scene: 'progress', phase: 'programs',
    caption: 'Learner dashboard — enrolled programs with real-time progress',
    detail: 'Each learner sees their programs, phase completion, and next session. Clear, motivating, and actionable.',
  },
  {
    scene: 'progress', phase: 'discuss',
    caption: 'Per-session discussions with @mentor notifications',
    detail: 'Questions stay in context. Mentors are pinged instantly. Nothing falls through the cracks.',
  },
  // Admin
  {
    scene: 'admin', phase: 'stats',
    caption: 'Admin overview — all learners, completions, live activity feed',
    detail: 'Real-time view of what\'s happening across every cohort. Who\'s active, who finished, who needs a nudge.',
  },
  {
    scene: 'admin', phase: 'cohort',
    caption: 'Cohort management: schedule, Zoom links, enrollment approvals',
    detail: 'Create cohorts, set session dates, approve learners — the full back-office in one dashboard.',
  },
]

function ScrollHint() {
  return (
    <div className="flex flex-col items-center gap-1 animate-bounce text-white/25 mt-10">
      <span className="text-[10px] tracking-widest uppercase">Scroll</span>
      <ChevronDown size={16} />
    </div>
  )
}

export default function DemoPage() {
  const [slide, setSlide] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const demoRef = useRef<HTMLDivElement>(null)

  const current = SLIDES[slide]
  const scene = current.scene
  const activeSceneMeta = SCENES.find(s => s.id === scene)!

  const goNext = () => setSlide(s => Math.min(s + 1, SLIDES.length - 1))
  const goPrev = () => setSlide(s => Math.max(s - 1, 0))

  const jumpToScene = (id: SceneId) => {
    const idx = SLIDES.findIndex(s => s.scene === id)
    if (idx >= 0) setSlide(idx)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape' && fullscreen) setFullscreen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fullscreen])

  const DemoContent = () => (
    <div className={`${fullscreen ? 'flex flex-col h-full' : ''}`}>
      {/* Scene tabs */}
      <div className={`flex flex-wrap justify-center gap-2 ${fullscreen ? 'mb-3 pt-3 px-4' : 'mb-5'}`}>
        {SCENES.map(s => (
          <button
            key={s.id}
            onClick={() => jumpToScene(s.id)}
            className={`text-xs sm:text-sm font-medium rounded-full px-4 py-1.5 border transition-colors ${
              scene === s.id
                ? 'bg-primary-500 border-primary-400 text-white'
                : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:border-white/30'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Browser chrome */}
      <div className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-950/60 bg-white/[0.02] ${fullscreen ? 'flex flex-col flex-1 mx-4' : ''}`}>
        <div className="flex items-center gap-3 px-4 h-11 bg-gray-900/80 border-b border-white/10 shrink-0">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 flex items-center gap-2 mx-2 h-7 rounded-md bg-black/30 border border-white/5 px-3 text-xs text-gray-400">
            <Lock size={11} className="text-gray-500" />
            <span className="truncate">{activeSceneMeta.url}</span>
          </div>
          <button
            onClick={() => setFullscreen(f => !f)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded"
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        <div className={`relative bg-gray-50 overflow-hidden select-none ${fullscreen ? 'flex-1' : 'aspect-[16/10] sm:aspect-[16/9]'}`}>
          <div key={`${scene}-${current.phase}`} className="absolute inset-0">
            {scene === 'curriculum' && <SceneCurriculum phase={current.phase} />}
            {scene === 'session'    && <SceneSession    phase={current.phase} />}
            {scene === 'sql'        && <SceneSql        phase={current.phase} />}
            {scene === 'python'     && <ScenePython     phase={current.phase} />}
            {scene === 'progress'   && <SceneProgress   phase={current.phase} />}
            {scene === 'admin'      && <SceneAdmin      phase={current.phase} />}
          </div>

          {/* Slide index badge */}
          <div className="absolute top-3 right-3 bg-black/40 text-white text-[11px] rounded-full px-2.5 py-0.5 z-10">
            {slide + 1} / {SLIDES.length}
          </div>
        </div>
      </div>

      {/* Caption + navigation */}
      <div className={`${fullscreen ? 'px-4 pb-4' : ''} mt-4`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <MousePointer2 size={15} className="text-primary-400 shrink-0" />
              <span>{current.caption}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400 ml-[23px] leading-relaxed">{current.detail}</p>
          </div>

          {/* Nav buttons + dots */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={goPrev}
              disabled={slide === 0}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`rounded-full transition-all ${
                    i === slide ? 'w-5 h-1.5 bg-primary-400' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={slide === SLIDES.length - 1}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-gray-600 ml-[23px]">Use ← → arrow keys to navigate</p>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-950 text-white">

      {/* ── Sticky header ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur bg-gray-950/70 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span>Learning Platform</span>
          </div>
          <span className="text-xs text-gray-500 tracking-wider uppercase hidden sm:block">
            Platform Overview · Talentiv
          </span>
          <div className="w-8" />
        </div>
      </header>

      {/* ── Fullscreen overlay ───────────────────────────────────────────────── */}
      {fullscreen && (
        <div
          ref={demoRef}
          className="fixed inset-0 z-[200] bg-gray-950 flex flex-col"
        >
          <DemoContent />
        </div>
      )}

      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary-200 bg-primary-500/10 border border-primary-400/20 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
            </span>
            Learning Platform × Talentiv — Platform Overview
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Live instruction meets{' '}
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              structured learning.
            </span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Talentiv delivers world-class expert-led sessions. Learning Platform delivers the
            curriculum infrastructure, interactive practice, and learner analytics.
            Together — a complete data education ecosystem.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-5 py-3.5">
              <Video size={20} className="text-violet-400 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Talentiv</div>
                <div className="text-sm font-semibold text-white">Live Expert Classes</div>
              </div>
            </div>

            <div className="text-2xl font-bold text-primary-400">+</div>

            <div className="flex items-center gap-3 rounded-2xl bg-primary-500/10 border border-primary-400/20 px-5 py-3.5">
              <BookOpen size={20} className="text-primary-400 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-primary-300 uppercase tracking-wider">Learning Platform</div>
                <div className="text-sm font-semibold text-white">Learning Platform</div>
              </div>
            </div>

            <div className="text-2xl font-bold text-cyan-400">=</div>

            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500/20 to-cyan-500/20 border border-primary-400/30 px-5 py-3.5">
              <Award size={20} className="text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-cyan-300 uppercase tracking-wider">Combined</div>
                <div className="text-sm font-semibold text-white">Complete Ecosystem</div>
              </div>
            </div>
          </div>
        </div>

        <ScrollHint />
      </section>

      {/* ── Section 2: The opportunity ──────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">The Opportunity</p>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              Live classes are powerful.<br />
              <span className="text-gray-400">Learners need the full stack.</span>
            </h2>
            <p className="mt-5 text-gray-400 text-lg max-w-2xl mx-auto">
              Expert sessions spark motivation. Turning that into lasting skill requires
              structured practice, repetition, and visibility — between every session.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Video size={22} />,
                color: 'from-violet-600 to-purple-500',
                label: 'What Talentiv has',
                title: 'Expert-led live sessions',
                points: [
                  'Industry practitioners as instructors',
                  'Real-world case studies & live Q&A',
                  'High engagement, high motivation',
                  'Strong brand & learner community',
                ],
              },
              {
                icon: <Target size={22} />,
                color: 'from-gray-600 to-gray-500',
                label: 'What learners need between sessions',
                title: 'Structured continuity',
                points: [
                  'Guided curriculum to follow daily',
                  'Hands-on practice with real feedback',
                  'Progress they can see and measure',
                  'A place to ask questions anytime',
                ],
              },
              {
                icon: <Layers size={22} />,
                color: 'from-primary-600 to-cyan-500',
                label: 'What Learning Platform provides',
                title: 'The platform layer',
                points: [
                  '12-session curriculum, 4 learning phases',
                  'In-browser SQL & Python exercises',
                  'Auto-graded tests + real-time dashboard',
                  'Cohort tools integrated with live schedule',
                ],
              },
            ].map(card => (
              <div key={card.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4`}>
                  {card.icon}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{card.label}</div>
                <h3 className="text-lg font-bold mb-4">{card.title}</h3>
                <ul className="space-y-2.5">
                  {card.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle2 size={15} className="text-primary-400 mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-10 text-base">
            Learning Platform is not a replacement for live sessions —
            it's the <span className="text-white font-semibold">infrastructure that makes them 10× more effective.</span>
          </p>
        </div>
        <ScrollHint />
      </section>

      {/* ── Section 3: Platform demo ────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-10">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">Platform Walkthrough</p>
            <h2 className="text-3xl sm:text-4xl font-bold">See every feature in action</h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Click the tabs or use arrows to navigate. Hit <kbd className="text-xs border border-white/20 rounded px-1.5 py-0.5 font-mono">⤢</kbd> for fullscreen.
            </p>
          </div>

          {!fullscreen && <DemoContent />}
          {fullscreen && (
            <div className="rounded-2xl border border-white/10 p-6 text-center text-gray-500 bg-white/[0.02]">
              <Maximize2 size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Demo is open in fullscreen mode</p>
              <button
                onClick={() => setFullscreen(false)}
                className="mt-3 text-xs border border-white/10 rounded-full px-4 py-1.5 hover:text-white transition-colors"
              >
                Exit fullscreen
              </button>
            </div>
          )}
        </div>
        <ScrollHint />
      </section>

      {/* ── Section 4: Platform capabilities ───────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">Platform Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Everything Talentiv needs, already built</h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Not a vision deck — a working platform learners use every day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <BookOpen size={20} />,
                title: 'Structured Curriculum',
                desc: '12 sessions across 4 phases — Foundation, SQL, Visualization, and Python. Each session is modular and pairs naturally with a live class.',
              },
              {
                icon: <Code2 size={20} />,
                title: 'In-Browser SQL & Python',
                desc: 'Full SQL and Python environments run directly in the browser. Real datasets, real code, zero friction — learners start coding on day one.',
              },
              {
                icon: <CheckCircle2 size={20} />,
                title: 'Auto-Graded Exercises',
                desc: 'Every exercise is tested against deterministic test cases. Instant pass/fail feedback per criterion — no manual grading ever.',
              },
              {
                icon: <GraduationCap size={20} />,
                title: 'Cohort Management',
                desc: 'Create cohorts with schedules, Zoom links, and session recordings. Approve enrollments and manage access — all in one admin dashboard.',
              },
              {
                icon: <BarChart3 size={20} />,
                title: 'Learner & Admin Analytics',
                desc: 'Real-time dashboards for both learners (their own progress) and admins (completion rates, active users, hardest exercises).',
              },
              {
                icon: <MessageSquare size={20} />,
                title: 'Integrated Discussions',
                desc: 'Per-session Q&A with @mention notifications. Learners ask, mentors answer — all in context, no separate tool needed.',
              },
              {
                icon: <Globe size={20} />,
                title: 'Bilingual Content',
                desc: 'All materials in Bahasa Indonesia and English. Learners toggle language any time — same platform, same progress.',
              },
              {
                icon: <Radio size={20} />,
                title: 'Live Activity Feed',
                desc: 'Admins see real-time events across every cohort: who completed a session, who submitted an exercise, who just joined.',
              },
              {
                icon: <Video size={20} />,
                title: 'Recording Integration',
                desc: 'Link Talentiv live session recordings directly into each session page. Learners review expert content right alongside the curriculum.',
              },
            ].map(it => (
              <div key={it.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-400/20 text-primary-300 flex items-center justify-center mb-3">
                  {it.icon}
                </div>
                <h3 className="font-semibold text-white mb-1.5">{it.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <ScrollHint />
      </section>

      {/* ── Section 5: The combined journey ─────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">The Vision</p>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              One learning journey.<br />
              <span className="text-gray-400">Seamlessly connected.</span>
            </h2>
            <p className="mt-5 text-gray-400 text-base max-w-2xl mx-auto">
              Talentiv's live sessions and Learning Platform's platform become a single, coherent experience
              for every learner — from onboarding to portfolio-ready.
            </p>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute top-10 left-[calc(10%+24px)] right-[calc(10%+24px)] h-0.5 bg-gradient-to-r from-violet-500/30 via-primary-500/50 to-cyan-500/30" />

            <div className="grid sm:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  color: 'from-violet-600 to-purple-500',
                  icon: <Users size={18} />,
                  brand: 'Talentiv',
                  title: 'Enroll & Onboard',
                  desc: 'Learner joins a Talentiv cohort. Instantly provisioned on Learning Platform.',
                },
                {
                  step: '02',
                  color: 'from-primary-600 to-cyan-500',
                  icon: <BookOpen size={18} />,
                  brand: 'Learning Platform',
                  title: 'Self-Paced Prep',
                  desc: 'Learner works through curriculum and exercises at their own pace.',
                },
                {
                  step: '03',
                  color: 'from-violet-600 to-purple-500',
                  icon: <Video size={18} />,
                  brand: 'Talentiv',
                  title: 'Live Expert Session',
                  desc: 'Instructor goes deeper, answers questions, runs live case studies.',
                },
                {
                  step: '04',
                  color: 'from-primary-600 to-cyan-500',
                  icon: <TrendingUp size={18} />,
                  brand: 'Learning Platform',
                  title: 'Reinforce & Measure',
                  desc: 'Exercises, recording review, and progress tracked in the dashboard.',
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                    {item.icon}
                  </div>
                  <div className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${item.brand === 'Talentiv' ? 'text-violet-400' : 'text-primary-400'}`}>
                    {item.brand}
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-2xl bg-gradient-to-r from-primary-600/10 via-cyan-600/10 to-violet-600/10 border border-primary-400/20 p-8 text-center">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">The outcome</p>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Learners who arrive to live sessions <span className="text-primary-400">already prepared</span>,
              <br className="hidden sm:block" /> and leave with <span className="text-cyan-400">verified, trackable skills</span>.
            </h3>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Higher completion rates. Better learner outcomes. A platform that validates the value
              of every Talentiv expert session with measurable data.
            </p>
          </div>
        </div>
        <ScrollHint />
      </section>

      {/* ── Section 6: Numbers + roles ──────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-14">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold">A platform that's ready to scale</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { v: '12',   unit: 'sessions',  label: 'Structured sessions across 4 learning phases', icon: <BookOpen size={20} />, c: 'text-primary-400' },
              { v: '40+',  unit: 'exercises', label: 'In-browser SQL & Python exercises with auto-grading', icon: <Code2 size={20} />, c: 'text-violet-400' },
              { v: '4',    unit: 'phases',    label: 'Foundation → SQL → Visualization → Python & Portfolio', icon: <Layers size={20} />, c: 'text-cyan-400' },
              { v: '100%', unit: 'browser',   label: 'No installation. Every learner starts coding on day one.', icon: <Zap size={20} />, c: 'text-yellow-400' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
                <div className={`flex items-center justify-center mb-3 ${s.c}`}>{s.icon}</div>
                <div className={`text-4xl font-bold ${s.c}`}>{s.v}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{s.unit}</div>
                <p className="mt-3 text-xs text-gray-400 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Learner experience',
                icon: <GraduationCap size={22} />,
                accent: 'from-primary-600 to-cyan-500',
                points: [
                  'Access all sessions with bilingual materials (ID/EN)',
                  'In-browser SQL & Python practice — no setup required',
                  'Instant auto-graded feedback per test case',
                  'Left-sidebar navigation across all sessions and phases',
                  'Session discussions with @mentor notifications',
                  'Live cohort schedule, Zoom links, and embedded recordings',
                ],
              },
              {
                title: 'Admin & mentor experience',
                icon: <ShieldCheck size={22} />,
                accent: 'from-violet-600 to-purple-500',
                points: [
                  'Real-time overview: active learners, completions, activity feed',
                  'Per-learner progress detail and exercise history',
                  'Exercise analytics: hardest questions, pass rates',
                  'Create cohorts with schedule, Zoom links, and recordings',
                  'Approve/revoke enrollments and manage access periods',
                  'Foundation to add custom programs as Talentiv scales',
                ],
              },
            ].map(r => (
              <div key={r.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.accent} flex items-center justify-center text-white`}>
                  {r.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold">{r.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {r.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle2 size={15} className="text-primary-400 mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <ScrollHint />
      </section>

      {/* ── Section 7: Closing ───────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-[700px] h-[400px] bg-primary-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-6">Let's talk</p>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
            Build the future of<br />
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              data education in Indonesia.
            </span>
          </h2>
          <p className="mt-7 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Talentiv has the experts, the brand, and the learner community.
            Learning Platform has the curriculum infrastructure, interactive tooling, and analytics.
            Combining both creates something neither can build alone — fast.
          </p>

          <div className="mt-12 grid sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: <Zap size={18} />, title: 'Production-ready', desc: 'Platform is live and actively used — no prototype, no speculation.' },
              { icon: <Target size={18} />, title: 'Aligned audience', desc: 'Same learners, same skills — zero audience mismatch.' },
              { icon: <Award size={18} />, title: 'Immediate value', desc: 'Integrate Talentiv recordings and live sessions on day one.' },
            ].map(it => (
              <div key={it.title} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-primary-400 mb-2">{it.icon}<span className="font-semibold text-white text-sm">{it.title}</span></div>
                <p className="text-xs text-gray-400 leading-relaxed">{it.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 to-cyan-500 px-8 py-4 text-white font-semibold text-lg shadow-xl shadow-primary-900/40">
            <ArrowRight size={20} /> Start the conversation
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-gray-600">
        Learning Platform — Platform overview for Talentiv. Not linked from public navigation.
      </footer>
    </div>
  )
}

/* ── Scene: Curriculum overview ───────────────────────────────────────────── */

const PHASES_DATA = [
  { icon: '📊', name: 'Data Foundations & Excel', color: 'from-blue-500 to-cyan-500', count: 3, done: true },
  { icon: '🗄️', name: 'SQL & Database',           color: 'from-violet-500 to-purple-600', count: 3, done: false, active: true },
  { icon: '📈', name: 'Visualization & BI',       color: 'from-orange-500 to-amber-500', count: 3, done: false },
  { icon: '🐍', name: 'Python & Portfolio',       color: 'from-emerald-500 to-teal-600', count: 3, done: false },
]

function SceneCurriculum({ phase: _phase }: { phase: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden p-5 sm:p-7 bg-gray-50">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Programs</h2>
      <p className="text-sm text-gray-500 mt-0.5">Data Analyst Track — 12 sessions across 4 phases</p>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PHASES_DATA.map((p, i) => (
          <div key={i} className={`rounded-2xl border bg-white p-4 shadow-sm ${p.active ? 'border-primary-400 ring-2 ring-primary-200' : 'border-gray-100'}`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-xl`}>
              {p.icon}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[10px] font-medium text-primary-600 uppercase tracking-wide">Phase {i + 1}</span>
              {p.done && <CheckCircle2 size={11} className="text-green-500" />}
              {p.active && <span className="text-[9px] bg-primary-100 text-primary-700 rounded-full px-1.5 font-medium">Active</span>}
            </div>
            <div className="text-sm font-semibold text-gray-900 leading-snug">{p.name}</div>
            <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                style={{ width: p.done ? '100%' : p.active ? '33%' : '0%' }} />
            </div>
            <div className="mt-1 text-[10px] text-gray-400">{p.done ? '3/3' : p.active ? '1/3' : '0/3'} sessions</div>
          </div>
        ))}
      </div>

      {/* Session list preview */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
        <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-[10px] bg-violet-100 text-violet-700 rounded-full px-2 py-0.5 font-medium">Phase 2</span>
          SQL & Database
        </div>
        <div className="space-y-2">
          {[
            { num: '04', name: 'SELECT & GROUP BY', done: true },
            { num: '05', name: 'JOINs & Subqueries', done: false, active: true },
            { num: '06', name: 'Window Functions', done: false, locked: true },
          ].map((s, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${s.active ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'}`}>
              {s.done ? <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                : s.locked ? <Lock size={13} className="text-gray-300 shrink-0" />
                : <div className="w-4 h-4 rounded-full border-2 border-primary-400 shrink-0" />}
              <span className="text-xs font-medium text-gray-500">Sess. {s.num}</span>
              <span className={`text-sm ${s.active ? 'font-semibold text-primary-700' : s.done ? 'text-gray-700' : 'text-gray-400'}`}>{s.name}</span>
              {s.active && <span className="ml-auto text-[10px] bg-primary-500 text-white rounded-full px-1.5 py-0.5">In progress</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Scene: Session page with sidebar ────────────────────────────────────── */

function SceneSession({ phase }: { phase: string }) {
  const showLive = phase === 'live'
  return (
    <div className="absolute inset-0 flex bg-gray-50 overflow-hidden">
      {/* Left sidebar */}
      <aside className="w-44 shrink-0 bg-white border-r border-gray-100 overflow-y-auto">
        <div className="p-3 border-b border-gray-100">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sessions</div>
        </div>
        <div className="p-2">
          {[
            { phase: 'Phase 1', sessions: [
              { num: '01', name: 'Data Fundamentals', done: true,  active: false, locked: false },
              { num: '02', name: 'Excel Basics',       done: true,  active: false, locked: false },
              { num: '03', name: 'Data Cleaning',      done: true,  active: false, locked: false },
            ]},
            { phase: 'Phase 2', sessions: [
              { num: '04', name: 'SELECT & GROUP BY',  done: true,  active: false, locked: false },
              { num: '05', name: 'JOINs & Subqueries', done: false, active: true,  locked: false },
              { num: '06', name: 'Window Functions',   done: false, active: false, locked: true  },
            ]},
            { phase: 'Phase 3', sessions: [
              { num: '07', name: 'Intro to BI',        done: false, active: false, locked: true  },
            ]},
          ].map((group, gi) => (
            <div key={gi} className="mb-2">
              <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">{group.phase}</div>
              {group.sessions.map((s, si) => (
                <div key={si} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 mb-0.5 ${s.active ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                  {s.done ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                    : s.locked ? <Lock size={10} className="text-gray-300 shrink-0" />
                    : <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${s.active ? 'border-primary-500' : 'border-gray-300'}`} />}
                  <span className={`text-[10px] leading-tight truncate ${s.active ? 'font-semibold text-primary-700' : s.done ? 'text-gray-600' : 'text-gray-400'}`}>{s.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {/* Session header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 font-semibold">Session 05</span>
            <span className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">45 min</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">JOINs & Subqueries</h2>
          <div className="mt-2.5 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <p className="text-[10px] font-semibold text-primary-700 uppercase tracking-wide mb-0.5">What you'll learn</p>
            <p className="text-xs text-primary-800">Combine data from multiple tables using INNER, LEFT, and RIGHT JOINs. Write subqueries to filter and aggregate complex datasets.</p>
          </div>
        </div>

        {showLive ? (
          /* Live session card */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <CalendarDays size={15} className="text-primary-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Live session with expert</p>
                <p className="text-xs font-semibold text-gray-800">Saturday, 14 June 2026</p>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] bg-primary-500 text-white rounded-full px-2.5 py-1 font-medium">Join Zoom</span>
              </div>
            </div>
            {/* Recording */}
            <div className="rounded-lg bg-gray-900 aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 opacity-80" />
              <div className="relative flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Play size={18} className="text-white ml-0.5" />
                </div>
                <span className="text-[10px] text-gray-300">Recording available</span>
              </div>
            </div>
          </div>
        ) : (
          /* Content preview */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              A <code className="bg-gray-100 text-primary-700 px-1 rounded text-[10px]">JOIN</code> allows you to combine rows from two or more tables based on a related column. The most common type is the <code className="bg-gray-100 text-primary-700 px-1 rounded text-[10px]">INNER JOIN</code>, which returns rows with matching values in both tables.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-[10px] leading-relaxed">
              <span className="text-sky-400">SELECT</span> <span className="text-gray-200">c.name, o.total_amount</span><br />
              <span className="text-sky-400">FROM</span> <span className="text-gray-200">customers c</span><br />
              <span className="text-sky-400">INNER JOIN</span> <span className="text-gray-200">orders o</span> <span className="text-sky-400">ON</span> <span className="text-gray-200">o.customer_id = c.id</span><br />
              <span className="text-sky-400">WHERE</span> <span className="text-gray-200">o.status = </span><span className="text-amber-300">'completed'</span><span className="text-gray-200">;</span>
            </div>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-green-500 text-white text-[11px] font-medium px-3 py-1.5">
              <CheckCircle2 size={13} /> Mark Complete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Scene: SQL exercise ──────────────────────────────────────────────────── */

const FULL_QUERY = `SELECT category,
       COUNT(*)             AS orders,
       ROUND(AVG(total), 2) AS avg_value
FROM   orders
GROUP  BY category
ORDER  BY orders DESC;`

function SceneSql({ phase }: { phase: string }) {
  const [typed, setTyped] = useState('-- Write your query here')
  const showResult = phase === 'passed'

  useEffect(() => {
    if (phase === 'editor') setTyped('-- Write your query here')
    if (phase === 'passed') setTyped(FULL_QUERY)
  }, [phase])

  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 h-11 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Database size={15} className="text-primary-600" /> Exercise 04-1 · Aggregation
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium px-3 py-1.5">
          <Play size={13} /> Run
        </button>
      </div>

      <div className="flex-1 grid sm:grid-cols-2 min-h-0">
        <div className="bg-[#0d1117] p-4 font-mono text-[12px] leading-relaxed overflow-hidden">
          <pre className="text-gray-200 whitespace-pre-wrap">
            {typed.split(/\b(SELECT|FROM|GROUP|BY|ORDER|AS|COUNT|AVG|ROUND|DESC|WHERE|JOIN|ON)\b/).map((part, i) =>
              /^(SELECT|FROM|GROUP|BY|ORDER|AS|COUNT|AVG|ROUND|DESC|WHERE|JOIN|ON)$/.test(part)
                ? <span key={i} className="text-sky-400">{part}</span>
                : <span key={i} className="text-gray-200">{part}</span>
            )}
          </pre>
        </div>

        <div className="bg-white border-t sm:border-t-0 sm:border-l border-gray-200 p-3 overflow-auto">
          {showResult ? (
            <>
              <div className="overflow-hidden rounded-lg border border-gray-200 text-[11px]">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left px-2.5 py-1.5 font-medium">category</th>
                      <th className="text-right px-2.5 py-1.5 font-medium">orders</th>
                      <th className="text-right px-2.5 py-1.5 font-medium">avg_value</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {[['Electronics', 412, '318.40'], ['Fashion', 287, '94.10'], ['Home', 196, '142.75']].map((r, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-2.5 py-1.5">{r[0]}</td>
                        <td className="px-2.5 py-1.5 text-right">{r[1]}</td>
                        <td className="px-2.5 py-1.5 text-right">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 size={15} /> 3 / 3 tests passed
                </div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-green-700/90">
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Correct columns (category, orders, avg_value)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Descending order by order count</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Average rounded to 2 decimal places</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 text-xs gap-2">
              <Code2 size={28} />
              <span>Query results appear here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Scene: Python playground ────────────────────────────────────────────── */

const PYTHON_CODE = `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('transactions.csv')

by_cat = (df.groupby('category')['total_amount']
            .sum()
            .sort_values(ascending=False))

print(f"Transactions: {len(df)} rows")
print("\\nRevenue by Category (IDR):")
for cat, rev in by_cat.items():
    print(f"  {cat:<14}  Rp {rev:>12,.0f}")

fig, ax = plt.subplots(figsize=(6, 3))
ax.bar(by_cat.index, by_cat.values / 1e6,
       color=['#0891b2','#6366f1','#10b981','#f59e0b'])
ax.set_ylabel('Revenue (M IDR)')
ax.set_title('Revenue by Category · 2024')
plt.tight_layout()
plt.show()`

function ScenePython({ phase }: { phase: string }) {
  const showResult = phase === 'result'
  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 h-11 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Terminal size={15} className="text-violet-600" /> Python Playground
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-2 py-0.5">transactions.csv</span>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 text-white text-xs font-medium px-3 py-1.5">
            <Play size={13} /> Run
          </button>
        </div>
      </div>

      <div className="flex-1 grid sm:grid-cols-2 min-h-0">
        {/* Editor */}
        <div className="bg-[#0d1117] p-4 font-mono text-[11px] leading-relaxed overflow-y-auto">
          <pre className="whitespace-pre-wrap">
            {PYTHON_CODE.split(/\b(import|from|as|def|return|for|in|if|print|plt|pd|fig|ax)\b/).map((part, i) =>
              /^(import|from|as|def|return|for|in|if)$/.test(part)
                ? <span key={i} className="text-sky-400">{part}</span>
                : /^(print|plt|pd|fig|ax)$/.test(part)
                ? <span key={i} className="text-violet-300">{part}</span>
                : <span key={i} className="text-gray-200">{part}</span>
            )}
          </pre>
        </div>

        {/* Output */}
        <div className="bg-white border-t sm:border-t-0 sm:border-l border-gray-200 overflow-auto">
          {showResult ? (
            <div className="p-3 space-y-3">
              {/* Terminal output */}
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-[11px] text-green-400 leading-relaxed">
                <div className="text-gray-500 mb-1">$ python script.py</div>
                <div>Transactions: 2 400 rows</div>
                <div className="mt-1 text-gray-300">Revenue by Category (IDR):</div>
                <div className="text-green-300">  Electronics    Rp  842 300 000</div>
                <div className="text-green-300">  Fashion        Rp  534 100 000</div>
                <div className="text-green-300">  Home & Living  Rp  318 750 000</div>
                <div className="text-green-300">  Books          Rp   97 200 000</div>
              </div>
              {/* Mock chart */}
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-[10px] font-medium text-gray-500 mb-2">Revenue by Category · 2024</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Electronics', pct: 100, color: 'bg-cyan-500', val: '842M' },
                    { label: 'Fashion', pct: 63, color: 'bg-indigo-500', val: '534M' },
                    { label: 'Home & Living', pct: 38, color: 'bg-emerald-500', val: '319M' },
                    { label: 'Books', pct: 12, color: 'bg-amber-500', val: '97M' },
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-500 w-20 shrink-0 truncate">{b.label}</span>
                      <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                        <div className={`h-full ${b.color} rounded`} style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="text-[9px] text-gray-500 w-8 text-right shrink-0">{b.val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 mt-2">Revenue in IDR millions</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 text-xs gap-2">
              <BarChart2 size={28} />
              <span>Run code to see output & charts</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Scene: Learner dashboard ─────────────────────────────────────────────── */

function SceneProgress({ phase }: { phase: string }) {
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setGrown(true), 80)
    return () => clearTimeout(id)
  }, [])

  if (phase === 'discuss') {
    return (
      <div className="absolute inset-0 overflow-hidden p-5 sm:p-7 text-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary-600" /> Discussion — Session 05
          </h2>
          <div className="relative">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">2</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-200 px-3 py-2 text-xs text-primary-800 mb-4">
          <Bell size={13} /> <span><b>@Mentor</b> replied to your question about JOINs</span>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold">S</div>
              <span className="text-sm font-semibold text-gray-900">Sari</span>
              <span className="text-[11px] text-gray-400">1 hour ago</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              When should I use <code className="bg-gray-100 text-primary-700 px-1 rounded">LEFT JOIN</code> vs <code className="bg-gray-100 text-primary-700 px-1 rounded">INNER JOIN</code>?
              <span className="text-primary-600 font-medium"> @mentor</span> can you explain?
            </p>
          </div>
          <div className="ml-6 rounded-2xl border border-primary-100 bg-primary-50/50 shadow-sm p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">M</div>
              <span className="text-sm font-semibold text-gray-900">Mentor</span>
              <span className="text-[10px] bg-primary-100 text-primary-700 rounded-full px-1.5 py-0.5 font-medium">Mentor</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Use <code className="bg-gray-100 text-primary-700 px-1 rounded">LEFT JOIN</code> when you want all rows from the left table even if there's no match. <code className="bg-gray-100 text-primary-700 px-1 rounded">INNER JOIN</code> only returns matched rows 👍
            </p>
          </div>
        </div>
      </div>
    )
  }

  // programs dashboard
  return (
    <div className="absolute inset-0 overflow-hidden p-5 sm:p-7 bg-gray-50">
      <p className="text-sm text-gray-500">Good morning,</p>
      <h2 className="text-xl font-bold text-gray-900">Hi, Sari 👋</h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: <BookOpen size={15} className="text-primary-600" />, v: '7', t: '12', l: 'Sessions done', bg: 'bg-primary-50' },
          { icon: <Code2 size={15} className="text-violet-600" />, v: '23', t: '40+', l: 'Exercises passed', bg: 'bg-violet-50' },
          { icon: <TrendingUp size={15} className="text-emerald-600" />, v: '2', t: '4', l: 'Phases active', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <div className="text-base font-bold text-gray-900 leading-none">{s.v}<span className="text-xs font-normal text-gray-400">/{s.t}</span></div>
              <div className="text-[9px] text-gray-500 mt-0.5">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Program card */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-xl shrink-0">📊</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">Data Analyst Track</div>
            <div className="text-[11px] text-gray-500">Batch 1 · 2026 — Active cohort</div>
          </div>
          <span className="text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-full px-2.5 py-1">58%</span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Phase 1 — Data Foundations', pct: 100 },
            { label: 'Phase 2 — SQL & Database', pct: 66 },
            { label: 'Phase 3 — Visualization', pct: 0 },
          ].map((b, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>{b.label}</span><span>{b.pct}%</span></div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                  style={{ width: grown ? `${b.pct}%` : '0%', transition: 'width 1.1s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full rounded-xl bg-primary-600 text-white text-xs font-medium py-2">
          Continue → Session 05: JOINs & Subqueries
        </button>
      </div>
    </div>
  )
}

/* ── Scene: Admin dashboard ───────────────────────────────────────────────── */

function SceneAdmin({ phase }: { phase: string }) {
  const showCohort = phase === 'cohort'

  return (
    <div className="absolute inset-0 bg-[#0a0e1a] overflow-hidden">
      <div className="border-b border-white/[0.06] bg-[#0d1221]/80 px-5">
        <div className="h-12 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <ShieldCheck size={12} className="text-primary-400" />
          </div>
          <span className="text-sm font-semibold text-white">Admin Dashboard</span>
        </div>
        <div className="flex gap-1 -mb-px text-xs">
          <span className={`flex items-center gap-1.5 px-3 py-2 border-b-2 ${!showCohort ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-500'}`}>
            <BarChart3 size={13} /> Overview
          </span>
          <span className={`flex items-center gap-1.5 px-3 py-2 border-b-2 ${showCohort ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-500'}`}>
            <GraduationCap size={13} /> Cohorts
          </span>
        </div>
      </div>

      <div className="p-5">
        {!showCohort ? (
          <>
            <div className="grid grid-cols-4 gap-3">
              {[
                { l: 'Total Learners', v: '128', icon: <Users size={14} />, c: 'text-sky-400' },
                { l: 'Active Today',   v: '34',  icon: <Activity size={14} />, c: 'text-green-400' },
                { l: 'Sessions Done',  v: '892', icon: <BookOpen size={14} />, c: 'text-violet-400' },
                { l: 'Avg Completion', v: '71%', icon: <TrendingUp size={14} />, c: 'text-yellow-400' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-[#111827] border border-white/[0.06] p-3">
                  <div className={`flex items-center gap-1.5 ${s.c} text-[11px]`}>{s.icon}<span className="text-gray-400">{s.l}</span></div>
                  <div className="mt-1.5 text-xl font-bold text-white">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-[#111827] border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Radio size={13} className="text-green-400 animate-pulse" />
                <span className="text-sm font-semibold text-gray-200">Live Activity</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  ['Sari', 'completed Session 06 — Window Functions', 'bg-green-400'],
                  ['Andi', 'submitted exercise 05-2 (JOINs)', 'bg-primary-400'],
                  ['Rina', 'logged in — started Session 04', 'bg-gray-500'],
                  ['Budi', 'passed exercise 04-1 with 3/3 tests', 'bg-violet-400'],
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a[2]}`} />
                    <b className="text-gray-200">{a[0]}</b> {a[1]}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl bg-[#111827] border border-white/[0.06] p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Data Analyst · Batch 1 · 2026</div>
                  <div className="text-[11px] text-gray-500">Starts Jun 1, 2026 · 12 sessions scheduled</div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full px-2.5 py-1">
                  <CalendarClock size={12} /> Active
                </span>
              </div>
              {/* Next session */}
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-white/[0.03] rounded-lg px-3 py-2">
                <Video size={12} className="text-primary-400 shrink-0" />
                <span>Next live session: <b className="text-gray-200">Session 05 — Sat 14 Jun · zoom.us/j/xxx</b></span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#111827] border border-white/[0.06] p-4">
              <div className="text-sm font-semibold text-gray-200 mb-3">Enrollments</div>
              <div className="space-y-2">
                {[
                  ['Sari Putri', 'active', '7/12'],
                  ['Andi Wijaya', 'active', '5/12'],
                  ['Rina Lestari', 'active', '4/12'],
                  ['Budi Santoso', 'pending', '—'],
                ].map((u, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-600/80 text-white text-[11px] flex items-center justify-center font-bold">
                        {u[0].split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-xs text-gray-200 block">{u[0]}</span>
                        <span className="text-[10px] text-gray-500">{u[2]} sessions</span>
                      </div>
                    </div>
                    {u[1] === 'pending' ? (
                      <span className="text-[11px] font-medium text-white bg-primary-600 rounded-md px-2.5 py-1">Approve</span>
                    ) : (
                      <span className="text-[11px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">Active</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
