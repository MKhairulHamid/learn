import { useEffect, useState } from 'react'
import {
  BookOpen, Code2, Play, CheckCircle2, MessageSquare, Bell, ShieldCheck,
  GraduationCap, Users, Activity, TrendingUp, Radio, Globe, Zap, Database,
  ArrowRight, MousePointer2, BarChart3, Lock, ChevronDown,
  Video, Layers, Target, Award, ChevronLeft, ChevronRight, Maximize2,
  Minimize2, Terminal, BarChart2, CalendarDays, Calculator, Mic2,
  Gamepad2, Star, FileText,
} from 'lucide-react'

/* ───────────────────────────────────────────────────────────────────────────
   Demo page — NOT linked from navigation. Reachable only via direct URL #/demo.
   Scroll-through platform overview for Talentiv.
─────────────────────────────────────────────────────────────────────────── */

type SceneId = 'programs' | 'session' | 'sql' | 'python' | 'hr' | 'progress' | 'admin'

interface Slide {
  scene: SceneId
  phase: string
  caption: string
  detail: string
}

const SCENES: { id: SceneId; label: string; url: string }[] = [
  { id: 'programs', label: 'Programs',          url: 'learnsync.app/curriculum' },
  { id: 'session',  label: 'Session View',      url: 'learnsync.app/session/05' },
  { id: 'sql',      label: 'SQL Playground',    url: 'learnsync.app/playground' },
  { id: 'python',   label: 'Python Playground', url: 'learnsync.app/playground' },
  { id: 'hr',       label: 'HR Playground',     url: 'learnsync.app/playground/hr' },
  { id: 'progress', label: 'Dashboard',         url: 'learnsync.app/dashboard' },
  { id: 'admin',    label: 'Admin Panel',       url: 'learnsync.app/admin' },
]

const SLIDES: Slide[] = [
  {
    scene: 'programs', phase: 'cards',
    caption: 'Two career programs — Data Analyst and HR Fast Track, both BNSP certified',
    detail: 'Each program runs as a live cohort with structured self-paced materials. Talentiv\'s expert sessions slot directly into each track.',
  },
  {
    scene: 'programs', phase: 'phases',
    caption: 'Data Analyst track: 12 sessions across 4 phases — Excel → SQL → Visualization → Python',
    detail: 'Structured learning path with each phase building on the last. Sessions unlock in sync with live class schedule.',
  },
  {
    scene: 'session', phase: 'sidebar',
    caption: 'Session page with left-sidebar navigation across all lessons and phases',
    detail: 'Learners see every session and their progress without leaving the page. Current session is always in context.',
  },
  {
    scene: 'session', phase: 'live',
    caption: 'Live session card: scheduled date, Zoom link, and embedded recording',
    detail: 'Talentiv\'s expert sessions link directly into the platform. Recordings are embedded immediately after each live class.',
  },
  {
    scene: 'sql', phase: 'editor',
    caption: 'In-browser SQL playground — real e-commerce dataset, zero installation',
    detail: 'Learners write and run queries against a real dataset. No local setup, no delays — they\'re coding on day one.',
  },
  {
    scene: 'sql', phase: 'passed',
    caption: 'Auto-graded: 3 / 3 test cases passed with deterministic feedback',
    detail: 'Every exercise validated instantly. No manual grading, no waiting — results are immediate and objective.',
  },
  {
    scene: 'python', phase: 'code',
    caption: 'Python + pandas + matplotlib — full scientific stack in the browser',
    detail: 'Powered by Pyodide. Learners write real data analysis code with pre-loaded CSV datasets — no Jupyter needed.',
  },
  {
    scene: 'python', phase: 'result',
    caption: 'Terminal output and live chart rendered side by side',
    detail: 'Visualizations render directly in the platform. Code → chart in seconds.',
  },
  {
    scene: 'hr', phase: 'calculator',
    caption: 'HR Playground: PPh 21 tax calculator with BPJS breakdown — built for the HR Fast Track',
    detail: 'Indonesian statutory payroll calculations in the browser. Learners practice real HR computations with 2024 tax brackets.',
  },
  {
    scene: 'progress', phase: 'programs',
    caption: 'Learner dashboard — enrolled programs with phase-by-phase progress',
    detail: 'Learners see both their programs, completion per phase, next session, and cohort status at a glance.',
  },
  {
    scene: 'progress', phase: 'discuss',
    caption: 'Per-session Q&A discussions with @mentor notifications',
    detail: 'Questions stay in context. Mentors are pinged instantly. Nothing falls through the cracks.',
  },
  {
    scene: 'admin', phase: 'stats',
    caption: 'Admin overview — multi-program learner activity and completions',
    detail: 'Real-time view of what\'s happening across every cohort and program. Who\'s active, who finished, who needs a nudge.',
  },
  {
    scene: 'admin', phase: 'cohort',
    caption: 'Cohort management: session schedule, Zoom links, enrollment approvals',
    detail: 'Create cohorts per program, set session dates, approve learners — the full back-office in one dashboard.',
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

  const current = SLIDES[slide]
  const scene = current.scene
  const activeSceneMeta = SCENES.find(s => s.id === scene)!

  const goNext = () => setSlide(s => Math.min(s + 1, SLIDES.length - 1))
  const goPrev = () => setSlide(s => Math.max(s - 1, 0))

  const jumpToScene = (id: SceneId) => {
    const idx = SLIDES.findIndex(s => s.scene === id)
    if (idx >= 0) setSlide(idx)
  }

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
            {scene === 'programs' && <ScenePrograms phase={current.phase} />}
            {scene === 'session'  && <SceneSession  phase={current.phase} />}
            {scene === 'sql'      && <SceneSql      phase={current.phase} />}
            {scene === 'python'   && <ScenePython   phase={current.phase} />}
            {scene === 'hr'       && <SceneHR       phase={current.phase} />}
            {scene === 'progress' && <SceneProgress phase={current.phase} />}
            {scene === 'admin'    && <SceneAdmin    phase={current.phase} />}
          </div>
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
              <Zap size={16} className="text-white" />
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
        <div className="fixed inset-0 z-[200] bg-gray-950 flex flex-col">
          <DemoContent />
        </div>
      )}

      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
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
            Live expert sessions meet{' '}
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              a complete learning platform.
            </span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Talentiv delivers expert-led live classes. Learning Platform delivers the structured curriculum,
            interactive playgrounds, cohort tools, and analytics. Together — an end-to-end professional
            skills ecosystem across Data and HR.
          </p>

          <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            {[
              { icon: '📊', prog: 'Data Analyst', desc: '12 sessions · Excel, SQL, Python, BI', color: 'border-cyan-500/30 bg-cyan-500/5' },
              { icon: '👥', prog: 'HR Fast Track', desc: '25+ sessions · HR ops, payroll, BPJS', color: 'border-rose-500/30 bg-rose-500/5' },
              { icon: '🏆', prog: 'BNSP Certified', desc: 'Both programs — nationally recognized', color: 'border-amber-500/30 bg-amber-500/5' },
            ].map(item => (
              <div key={item.prog} className={`rounded-xl border ${item.color} px-4 py-3.5`}>
                <div className="text-xl mb-1.5">{item.icon}</div>
                <div className="text-sm font-semibold text-white">{item.prog}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            ))}
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
              Expert sessions spark motivation. Turning that into lasting, certified skill requires
              structured practice, repetition, and visibility — between every session.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Mic2 size={22} />,
                color: 'from-violet-600 to-purple-500',
                label: 'What Talentiv has',
                title: 'Expert-led live sessions',
                points: [
                  'Industry practitioners as instructors',
                  'Real-world case studies & live Q&A',
                  'Strong brand & learner community',
                  'Data, HR, and professional skills focus',
                ],
              },
              {
                icon: <Target size={22} />,
                color: 'from-gray-600 to-gray-500',
                label: 'What learners need between sessions',
                title: 'Structured continuity',
                points: [
                  'Guided curriculum to follow daily',
                  'Hands-on tools to practice real skills',
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
                  '2 programs · 37+ sessions · 40+ exercises',
                  'SQL, Python & HR in-browser playgrounds',
                  'Auto-graded tests + real-time analytics',
                  'Cohort tools wired to live schedule',
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
              Not a vision deck — a working platform with two live programs running today.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <BookOpen size={20} />,
                title: 'Multi-Program Curriculum',
                desc: 'Data Analyst (12 sessions, 4 phases) and HR Fast Track (25+ sessions, 3 modules). Each modular and paired with live class schedule.',
              },
              {
                icon: <Gamepad2 size={20} />,
                title: 'Three In-Browser Playgrounds',
                desc: 'SQL (e-commerce dataset), Python with pandas & matplotlib, and HR payroll calculator (PPh 21, BPJS). Zero installation for any of them.',
              },
              {
                icon: <CheckCircle2 size={20} />,
                title: 'Auto-Graded Exercises',
                desc: 'Every exercise tested against deterministic test cases. Instant pass/fail feedback per criterion — no manual grading ever.',
              },
              {
                icon: <GraduationCap size={20} />,
                title: 'Cohort Management',
                desc: 'Create cohorts per program with schedules, Zoom links, and session recordings. Approve enrollments and manage access — one dashboard.',
              },
              {
                icon: <BarChart3 size={20} />,
                title: 'Learner & Admin Analytics',
                desc: 'Real-time dashboards for learners (their own progress) and admins (completion rates, active users, hardest exercises per program).',
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
                icon: <Video size={20} />,
                title: 'Recording Integration',
                desc: 'Link Talentiv live session recordings into each session page. Learners review expert content right alongside the curriculum.',
              },
              {
                icon: <Award size={20} />,
                title: 'BNSP Certification Pathway',
                desc: 'Both programs are structured to lead to nationally recognized BNSP certification — the professional competency standard in Indonesia.',
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
              for every learner across Data, HR, or any future career track.
            </p>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute top-10 left-[calc(10%+24px)] right-[calc(10%+24px)] h-0.5 bg-gradient-to-r from-violet-500/30 via-primary-500/50 to-cyan-500/30" />
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { color: 'from-violet-600 to-purple-500', icon: <Users size={18} />, brand: 'Talentiv', title: 'Enroll & Onboard', desc: 'Learner joins a Talentiv cohort. Instantly provisioned on Learning Platform.' },
                { color: 'from-primary-600 to-cyan-500',  icon: <BookOpen size={18} />, brand: 'Learning Platform', title: 'Self-Paced Prep', desc: 'Works through curriculum and exercises between live sessions.' },
                { color: 'from-violet-600 to-purple-500', icon: <Mic2 size={18} />, brand: 'Talentiv', title: 'Live Expert Session', desc: 'Instructor dives deeper, Q&A, real-world case studies.' },
                { color: 'from-primary-600 to-cyan-500',  icon: <TrendingUp size={18} />, brand: 'Learning Platform', title: 'Reinforce & Certify', desc: 'Exercises, recording review, progress toward BNSP certification.' },
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
              <br className="hidden sm:block" /> and leave with <span className="text-cyan-400">BNSP-certified, trackable skills</span>.
            </h3>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Higher completion rates. Better learner outcomes. A platform that validates the value
              of every Talentiv expert session with measurable data — across any career track.
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
              { v: '2',    unit: 'programs',  label: 'Data Analyst + HR Fast Track — both BNSP certified', icon: <Star size={20} />, c: 'text-amber-400' },
              { v: '37+',  unit: 'sessions',  label: 'Live sessions across both programs with cohort scheduling', icon: <Mic2 size={20} />, c: 'text-violet-400' },
              { v: '40+',  unit: 'exercises', label: 'In-browser SQL, Python & HR exercises with auto-grading', icon: <Code2 size={20} />, c: 'text-primary-400' },
              { v: '3',    unit: 'playgrounds', label: 'SQL · Python · HR — all zero-install, all in the browser', icon: <Gamepad2 size={20} />, c: 'text-cyan-400' },
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
                  'Enroll in Data Analyst or HR Fast Track (or both)',
                  'Bilingual materials (ID/EN) for every session',
                  'In-browser SQL, Python & HR payroll practice',
                  'Left-sidebar navigation across all sessions and phases',
                  'Embedded Zoom links + permanent session recordings',
                  'Discussion Q&A with @mentor notifications',
                ],
              },
              {
                title: 'Admin & mentor experience',
                icon: <ShieldCheck size={22} />,
                accent: 'from-violet-600 to-purple-500',
                points: [
                  'Multi-program overview: active learners, completions per track',
                  'Real-time live activity feed across all cohorts',
                  'Per-learner progress detail and exercise history',
                  'Create cohorts with schedules, Zoom links, recordings',
                  'Approve/revoke enrollments and manage access periods',
                  'Built to expand: add new programs as Talentiv scales',
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
              professional education in Indonesia.
            </span>
          </h2>
          <p className="mt-7 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Talentiv has the experts, the brand, and the learner community.
            Learning Platform has the curriculum infrastructure, multi-program playgrounds, and analytics.
            Combining both creates something neither can build alone — fast.
          </p>

          <div className="mt-12 grid sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: <Zap size={18} />, title: 'Production-ready', desc: 'Two live programs running today — not a prototype or mockup.' },
              { icon: <Target size={18} />, title: 'Aligned audience', desc: 'Same learners, same career goals — zero audience mismatch.' },
              { icon: <Award size={18} />, title: 'Day-one integration', desc: 'Talentiv recordings and sessions plug in immediately.' },
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

/* ═══════════════════════════════════════════════════════════════════════════
   SCENES
═══════════════════════════════════════════════════════════════════════════ */

/* ── Scene: Programs overview ─────────────────────────────────────────────── */

function ScenePrograms({ phase }: { phase: string }) {
  const showPhases = phase === 'phases'
  return (
    <div className="absolute inset-0 overflow-hidden p-5 sm:p-6 bg-gray-50">
      <h2 className="text-base sm:text-lg font-bold text-gray-900">Choose your career path</h2>
      <p className="text-xs text-gray-500 mt-0.5 mb-4">Two programs — both live + self-paced, both BNSP certified</p>

      {!showPhases ? (
        /* Program cards */
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: '📊', gradient: 'from-primary-600 to-cyan-500', light: 'bg-primary-50', accent: 'text-primary-700', border: 'border-primary-200',
              name: 'Data Analyst Career Intelligence',
              tagline: '12-session path — Excel, SQL, Python & BNSP certification',
              stats: [{ v: '12', l: 'Sessions' }, { v: '40+', l: 'Exercises' }, { v: '4', l: 'Phases' }, { v: 'BNSP', l: 'Certified' }],
              tools: ['Excel', 'SQL', 'Python', 'Looker Studio'],
            },
            {
              icon: '👥', gradient: 'from-rose-500 to-pink-600', light: 'bg-rose-50', accent: 'text-rose-700', border: 'border-rose-200',
              name: 'HR Fast Track Bootcamp',
              tagline: '3-month live bootcamp — HR fundamentals, payroll & BNSP',
              stats: [{ v: '25+', l: 'Sessions' }, { v: '3', l: 'Modules' }, { v: 'Live', l: 'Online' }, { v: 'BNSP', l: 'Certified' }],
              tools: ['Mekari Talenta', 'HRIS', 'PPh 21', 'BPJS'],
            },
          ].map(p => (
            <div key={p.name} className={`rounded-2xl border ${p.border} overflow-hidden shadow-sm`}>
              <div className={`bg-gradient-to-r ${p.gradient} p-4 text-white`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{p.icon}</span>
                  <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">BNSP Certified</span>
                </div>
                <div className="text-sm font-bold leading-snug">{p.name}</div>
                <p className="text-[11px] opacity-80 mt-1">{p.tagline}</p>
                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {p.stats.map(s => (
                    <div key={s.l} className="bg-white/15 rounded-lg p-1.5 text-center">
                      <div className="text-sm font-bold">{s.v}</div>
                      <div className="text-[9px] opacity-70">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${p.light} p-3`}>
                <div className="flex flex-wrap gap-1">
                  {p.tools.map(t => (
                    <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${p.border} ${p.accent} font-medium bg-white`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Data Analyst phases */
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📊</span>
            <span className="text-sm font-bold text-gray-900">Data Analyst Career Intelligence</span>
            <span className="text-[10px] bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 font-medium">Active program</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { icon: '📊', name: 'Data Foundations & Excel', color: 'from-blue-500 to-cyan-500', status: 'done' },
              { icon: '🗄️', name: 'SQL & Database', color: 'from-violet-500 to-purple-600', status: 'active' },
              { icon: '📈', name: 'Visualization & BI', color: 'from-orange-500 to-amber-500', status: 'locked' },
              { icon: '🐍', name: 'Python & Portfolio', color: 'from-emerald-500 to-teal-600', status: 'locked' },
            ].map((p, i) => (
              <div key={i} className={`rounded-xl border bg-white p-3 shadow-sm ${p.status === 'active' ? 'border-primary-400 ring-2 ring-primary-200' : 'border-gray-100'}`}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-lg mb-2`}>{p.icon}</div>
                <div className="text-[9px] font-medium text-gray-400 uppercase">Phase {i + 1}</div>
                <div className="text-xs font-semibold text-gray-900 leading-snug">{p.name}</div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${p.color}`}
                    style={{ width: p.status === 'done' ? '100%' : p.status === 'active' ? '33%' : '0%' }} />
                </div>
                <div className="mt-1 text-[9px] text-gray-400">
                  {p.status === 'done' ? '3/3 ✓' : p.status === 'active' ? '1/3' : 'Locked'}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-3">
            <div className="text-xs font-semibold text-gray-700 mb-2">Phase 2 sessions</div>
            {[
              { num: '04', name: 'SELECT & GROUP BY', done: true },
              { num: '05', name: 'JOINs & Subqueries', active: true },
              { num: '06', name: 'Window Functions', locked: true },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 mb-1 ${s.active ? 'bg-primary-50' : ''}`}>
                {s.done ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                  : s.locked ? <Lock size={11} className="text-gray-300 shrink-0" />
                  : <div className="w-3 h-3 rounded-full border-2 border-primary-400 shrink-0" />}
                <span className="text-[10px] text-gray-400">Sess. {s.num}</span>
                <span className={`text-xs ${s.active ? 'font-semibold text-primary-700' : s.done ? 'text-gray-700' : 'text-gray-400'}`}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
              { num: '07', name: 'Intro to BI Tools',  done: false, active: false, locked: true  },
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 font-semibold">Session 05</span>
            <span className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">45 min · Lesson + exercises</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">JOINs & Subqueries</h2>
          <div className="mt-2.5 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <p className="text-[10px] font-semibold text-primary-700 uppercase tracking-wide mb-0.5">What you'll learn</p>
            <p className="text-xs text-primary-800">Combine data from multiple tables using INNER, LEFT, and RIGHT JOINs. Write subqueries to filter and aggregate complex datasets.</p>
          </div>
        </div>

        {showLive ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <CalendarDays size={15} className="text-primary-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Live session — expert instructor</p>
                <p className="text-xs font-semibold text-gray-800">Saturday, 14 June 2026</p>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] bg-primary-500 text-white rounded-full px-2.5 py-1 font-medium">Join Zoom</span>
              </div>
            </div>
            <div className="rounded-lg bg-gray-900 aspect-video flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 opacity-80" />
              <div className="relative flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Play size={18} className="text-white ml-0.5" />
                </div>
                <span className="text-[10px] text-gray-300">Recording available · rewatch anytime</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              A <code className="bg-gray-100 text-primary-700 px-1 rounded text-[10px]">JOIN</code> combines rows from two or more tables based on a related column.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-[10px] leading-relaxed">
              <span className="text-sky-400">SELECT</span> <span className="text-gray-200">c.name, o.total_amount</span><br />
              <span className="text-sky-400">FROM</span> <span className="text-gray-200">customers c</span><br />
              <span className="text-sky-400">INNER JOIN</span> <span className="text-gray-200">orders o </span><span className="text-sky-400">ON</span><span className="text-gray-200"> o.customer_id = c.id</span><br />
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

/* ── Scene: SQL playground ────────────────────────────────────────────────── */

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
          <Database size={15} className="text-primary-600" /> SQL Playground · Data Analyst Track
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
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Correct columns returned</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Descending order by count</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Average rounded to 2 decimals</li>
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
          <Terminal size={15} className="text-violet-600" /> Python Playground · Data Analyst Track
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-2 py-0.5">transactions.csv</span>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 text-white text-xs font-medium px-3 py-1.5">
            <Play size={13} /> Run
          </button>
        </div>
      </div>
      <div className="flex-1 grid sm:grid-cols-2 min-h-0">
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
        <div className="bg-white border-t sm:border-t-0 sm:border-l border-gray-200 overflow-auto">
          {showResult ? (
            <div className="p-3 space-y-3">
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-[11px] text-green-400 leading-relaxed">
                <div className="text-gray-500 mb-1">$ python script.py</div>
                <div>Transactions: 2 400 rows</div>
                <div className="mt-1 text-gray-300">Revenue by Category (IDR):</div>
                <div className="text-green-300">  Electronics    Rp  842 300 000</div>
                <div className="text-green-300">  Fashion        Rp  534 100 000</div>
                <div className="text-green-300">  Home & Living  Rp  318 750 000</div>
                <div className="text-green-300">  Books          Rp   97 200 000</div>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="text-[10px] font-medium text-gray-500 mb-2">Revenue by Category · 2024</p>
                {[
                  { label: 'Electronics', pct: 100, color: 'bg-cyan-500', val: '842M' },
                  { label: 'Fashion', pct: 63, color: 'bg-indigo-500', val: '534M' },
                  { label: 'Home & Living', pct: 38, color: 'bg-emerald-500', val: '319M' },
                  { label: 'Books', pct: 12, color: 'bg-amber-500', val: '97M' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] text-gray-500 w-20 shrink-0 truncate">{b.label}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                      <div className={`h-full ${b.color} rounded`} style={{ width: `${b.pct}%` }} />
                    </div>
                    <span className="text-[9px] text-gray-500 w-8 text-right shrink-0">{b.val}</span>
                  </div>
                ))}
                <p className="text-[9px] text-gray-400 mt-1">Revenue in IDR millions</p>
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

/* ── Scene: HR Playground ────────────────────────────────────────────────── */

function SceneHR({ phase: _phase }: { phase: string }) {
  // Mock calculated values for a Rp 10,000,000 gross salary, TK/0, has NPWP
  const gross = 10_000_000
  const bpjsKes  = Math.min(gross, 12_000_000) * 0.01     // employee 1%
  const bpjsJkk  = gross * 0.0024
  const bpjsJht  = gross * 0.02
  const bpjsJp   = Math.min(gross, 9_559_600) * 0.01
  const totalDed = bpjsKes + bpjsJkk + bpjsJht + bpjsJp
  const annualPkp = (gross - totalDed) * 12 - 54_000_000
  const pph21Monthly = Math.max(0, annualPkp * 0.05) / 12
  const netSalary = gross - totalDed - pph21Monthly

  const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

  return (
    <div className="absolute inset-0 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-11 border-b border-gray-200 bg-gray-50 shrink-0">
        <Calculator size={15} className="text-rose-600" />
        <span className="text-sm font-medium text-gray-700">HR Playground · PPh 21 & BPJS Calculator</span>
        <span className="ml-auto text-[10px] bg-rose-100 text-rose-700 rounded-full px-2 py-0.5 font-medium">HR Fast Track</span>
      </div>

      <div className="flex-1 grid sm:grid-cols-2 min-h-0 overflow-hidden">
        {/* Inputs */}
        <div className="p-4 border-r border-gray-100 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Employee Details</p>
          <div className="space-y-3">
            {[
              { label: 'Gross Monthly Salary', value: 'Rp 10,000,000', type: 'currency' },
              { label: 'PTKP Status', value: 'TK/0 (Single, no dependants)', type: 'select' },
              { label: 'NPWP', value: 'Has NPWP', type: 'select' },
              { label: 'Bonus (monthly)', value: 'Rp 0', type: 'currency' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">{f.label}</label>
                <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${f.type === 'currency' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-primary-50 text-primary-700 border-primary-200'}`}>
                  {f.value}
                </div>
              </div>
            ))}
            <button className="w-full mt-1 rounded-lg bg-rose-600 text-white text-xs font-medium py-2.5">
              Calculate
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 overflow-y-auto bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
              <span className="text-xs text-gray-600">Gross Salary</span>
              <span className="text-xs font-semibold text-gray-900">{fmt(gross)}</span>
            </div>
            {[
              { label: 'BPJS Kesehatan (1%)', val: -bpjsKes, color: 'text-rose-600' },
              { label: 'BPJS JKK (0.24%)', val: -bpjsJkk, color: 'text-rose-600' },
              { label: 'BPJS JHT (2%)', val: -bpjsJht, color: 'text-rose-600' },
              { label: 'BPJS JP (1%)', val: -bpjsJp, color: 'text-rose-600' },
              { label: 'PPh 21 (monthly est.)', val: -pph21Monthly, color: 'text-orange-600' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-1">
                <span className="text-[11px] text-gray-500">{row.label}</span>
                <span className={`text-[11px] font-medium ${row.color}`}>−{fmt(Math.abs(row.val))}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-t-2 border-gray-900 mt-2">
              <span className="text-sm font-bold text-gray-900">Net Take-Home</span>
              <span className="text-sm font-bold text-green-600">{fmt(netSalary)}</span>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-rose-50 border border-rose-100 p-2.5 text-[10px] text-rose-700">
            <FileText size={11} className="inline mr-1" />
            Based on 2024 Indonesian tax brackets & BPJS regulations. PTKP TK/0 = Rp 54,000,000/year.
          </div>
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
              Use <code className="bg-gray-100 text-primary-700 px-1 rounded">LEFT JOIN</code> when you want all rows from the left table even with no match. <code className="bg-gray-100 text-primary-700 px-1 rounded">INNER JOIN</code> only returns matched rows 👍
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden p-5 sm:p-6 bg-gray-50">
      <p className="text-sm text-gray-500">Good morning,</p>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Hi, Sari 👋</h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
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

      {/* Data Analyst program card */}
      <div className="rounded-2xl border border-primary-200 bg-white shadow-sm p-4 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-xl shrink-0">📊</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">Data Analyst Career Intelligence</div>
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
          <div className="ml-3 flex gap-1.5">
            <span className="text-[10px] bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-full px-2 py-0.5">Data Analyst</span>
            <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-full px-2 py-0.5">HR Fast Track</span>
          </div>
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
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { l: 'Total Learners', v: '164', icon: <Users size={14} />, c: 'text-sky-400' },
                { l: 'Active Today',   v: '51',  icon: <Activity size={14} />, c: 'text-green-400' },
                { l: 'Sessions Done',  v: '1.2k', icon: <BookOpen size={14} />, c: 'text-violet-400' },
                { l: 'Avg Completion', v: '68%', icon: <TrendingUp size={14} />, c: 'text-yellow-400' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl bg-[#111827] border border-white/[0.06] p-3">
                  <div className={`flex items-center gap-1.5 ${s.c} text-[11px]`}>{s.icon}<span className="text-gray-400">{s.l}</span></div>
                  <div className="mt-1.5 text-xl font-bold text-white">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-[#111827] border border-white/[0.06] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Radio size={13} className="text-green-400 animate-pulse" />
                <span className="text-sm font-semibold text-gray-200">Live Activity — All Programs</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  ['Sari', 'completed Session 06 — SQL Window Functions', 'Data Analyst', 'bg-green-400'],
                  ['Budi', 'passed HR exercise: PPh 21 calculation', 'HR Fast Track', 'bg-rose-400'],
                  ['Andi', 'submitted SQL exercise 05-2', 'Data Analyst', 'bg-primary-400'],
                  ['Rina', 'joined platform — started orientation', 'HR Fast Track', 'bg-gray-500'],
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a[3]}`} />
                    <b className="text-gray-200">{a[0]}</b>
                    <span className="flex-1 truncate">{a[1]}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${a[2] === 'Data Analyst' ? 'bg-primary-900 text-primary-400' : 'bg-rose-900 text-rose-400'}`}>{a[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { name: 'Data Analyst · Batch 1', start: 'Jun 1, 2026', sessions: 12, active: 128, color: 'border-primary-500/30 bg-primary-500/5 text-primary-300' },
                { name: 'HR Fast Track · Batch 1', start: 'Jun 15, 2026', sessions: 25, active: 36, color: 'border-rose-500/30 bg-rose-500/5 text-rose-300' },
              ].map(c => (
                <div key={c.name} className={`rounded-xl bg-[#111827] border ${c.color.split(' ')[0]} p-3`}>
                  <div className={`text-xs font-semibold mb-1 ${c.color.split(' ')[2]}`}>{c.name}</div>
                  <div className="text-[10px] text-gray-400">Starts {c.start}</div>
                  <div className="mt-2 flex gap-3 text-[10px]">
                    <span className="text-gray-300"><b className="text-white">{c.sessions}</b> sessions</span>
                    <span className="text-gray-300"><b className="text-white">{c.active}</b> enrolled</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-[#111827] border border-white/[0.06] p-4">
              <div className="text-sm font-semibold text-gray-200 mb-3">Recent enrollments</div>
              <div className="space-y-2">
                {[
                  ['Sari Putri', 'Data Analyst', 'active', '7/12'],
                  ['Budi Santoso', 'HR Fast Track', 'active', '3/25'],
                  ['Rina Lestari', 'Data Analyst', 'active', '4/12'],
                  ['Ahmad Fauzi', 'HR Fast Track', 'pending', '—'],
                ].map((u, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-600/80 text-white text-[11px] flex items-center justify-center font-bold">
                        {u[0].split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-xs text-gray-200 block">{u[0]}</span>
                        <span className={`text-[9px] ${u[1] === 'Data Analyst' ? 'text-primary-400' : 'text-rose-400'}`}>{u[1]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{u[3]}</span>
                      {u[2] === 'pending'
                        ? <span className="text-[11px] font-medium text-white bg-primary-600 rounded-md px-2.5 py-1">Approve</span>
                        : <span className="text-[11px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">Active</span>}
                    </div>
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
