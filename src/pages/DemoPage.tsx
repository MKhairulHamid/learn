import { useEffect, useState } from 'react'
import {
  BookOpen, Code2, Play, CheckCircle2, MessageSquare, Bell, ShieldCheck,
  GraduationCap, Users, Activity, TrendingUp, Radio, Globe, Zap, Database,
  CalendarClock, ArrowRight, MousePointer2, BarChart3, Lock, ChevronDown,
  Video, Layers, Target, Award,
} from 'lucide-react'

/* ───────────────────────────────────────────────────────────────────────────
   Demo page — NOT linked from navigation. Reachable only via direct URL #/demo.
   Acquisition pitch for Talentiv CEO. Scroll-through presentation.
─────────────────────────────────────────────────────────────────────────── */

type SceneId = 'learn' | 'sql' | 'progress' | 'admin'

interface Beat {
  scene: SceneId
  phase: string
  cursor: { x: number; y: number }
  click?: boolean
  caption: string
  duration: number
}

const SCENES: { id: SceneId; label: string; url: string }[] = [
  { id: 'learn',    label: 'Curriculum',      url: 'datalearn.app/curriculum' },
  { id: 'sql',      label: 'SQL Exercises',   url: 'datalearn.app/exercise/04-1' },
  { id: 'progress', label: 'Learner Dashboard', url: 'datalearn.app/dashboard' },
  { id: 'admin',    label: 'Admin & Cohort',  url: 'datalearn.app/admin' },
]

const BEATS: Beat[] = [
  { scene: 'learn', phase: 'browse', cursor: { x: 28, y: 52 }, caption: 'Structured curriculum — 12 sessions across 4 learning phases', duration: 2600 },
  { scene: 'learn', phase: 'browse', cursor: { x: 52, y: 46 }, click: true, caption: 'Learners click into a session to begin', duration: 1500 },
  { scene: 'learn', phase: 'open',   cursor: { x: 48, y: 50 }, caption: 'Bilingual materials (ID/EN): theory, examples, and video', duration: 2800 },
  { scene: 'learn', phase: 'open',   cursor: { x: 79, y: 84 }, click: true, caption: 'Mark complete, then move on to hands-on exercises', duration: 1700 },
  { scene: 'sql', phase: 'editor', cursor: { x: 38, y: 46 }, caption: 'In-browser SQL playground — zero installation required', duration: 1800 },
  { scene: 'sql', phase: 'typing', cursor: { x: 44, y: 40 }, caption: 'Learner writes their own query in the editor', duration: 2600 },
  { scene: 'sql', phase: 'run',    cursor: { x: 85, y: 17 }, click: true, caption: 'Run query against a real dataset', duration: 1400 },
  { scene: 'sql', phase: 'passed', cursor: { x: 58, y: 78 }, caption: 'Auto-graded — 3/3 test cases passed, instant feedback', duration: 2900 },
  { scene: 'progress', phase: 'progress', cursor: { x: 50, y: 38 }, caption: 'Learner dashboard — real-time progress across all phases', duration: 2900 },
  { scene: 'progress', phase: 'discuss',  cursor: { x: 56, y: 70 }, caption: 'Session discussion with @mentor mentions and notifications', duration: 3100 },
  { scene: 'admin', phase: 'stats',    cursor: { x: 44, y: 34 }, caption: 'Admin overview — all learner activity at a glance', duration: 2800 },
  { scene: 'admin', phase: 'cohort',   cursor: { x: 48, y: 52 }, caption: 'Cohort management: schedule, Zoom links & recordings', duration: 2500 },
  { scene: 'admin', phase: 'cohort',   cursor: { x: 81, y: 63 }, click: true, caption: 'Approve new learner enrollment', duration: 1500 },
  { scene: 'admin', phase: 'approved', cursor: { x: 81, y: 63 }, caption: 'Learner immediately active in their cohort', duration: 2400 },
]

function ScrollHint() {
  return (
    <div className="flex flex-col items-center gap-1 animate-bounce text-white/30 mt-10">
      <span className="text-xs tracking-widest uppercase">Scroll</span>
      <ChevronDown size={18} />
    </div>
  )
}

export default function DemoPage() {
  const [beat, setBeat] = useState(0)
  const [playing, setPlaying] = useState(true)
  const current = BEATS[beat]
  const scene = current.scene

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setBeat(b => (b + 1) % BEATS.length), current.duration)
    return () => clearTimeout(id)
  }, [beat, playing, current.duration])

  const activeSceneMeta = SCENES.find(s => s.id === scene)!

  const jumpToScene = (id: SceneId) => {
    const idx = BEATS.findIndex(b => b.scene === id)
    if (idx >= 0) setBeat(idx)
  }

  return (
    <div className="bg-gray-950 text-white">

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur bg-gray-950/70 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span>DataLearn</span>
          </div>
          <span className="text-xs text-gray-500 tracking-wider uppercase hidden sm:block">
            Acquisition Overview · Confidential
          </span>
          <div className="w-8 h-8" /> {/* spacer */}
        </div>
      </header>

      {/* ── Section 1: Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-primary-200 bg-primary-500/10 border border-primary-400/20 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
            </span>
            Strategic Acquisition Overview for Talentiv
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Live instruction meets{' '}
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              structured learning.
            </span>
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Talentiv delivers world-class expert-led sessions. DataLearn delivers the
            curriculum infrastructure, interactive practice, and learner analytics.
            Together — a complete data education ecosystem.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-5 py-3.5">
              <Video size={20} className="text-primary-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Talentiv</div>
                <div className="text-sm font-semibold text-white">Live Expert Classes</div>
              </div>
            </div>

            <div className="text-2xl font-bold text-primary-400">+</div>

            <div className="flex items-center gap-3 rounded-2xl bg-primary-500/10 border border-primary-400/20 px-5 py-3.5">
              <BookOpen size={20} className="text-primary-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-primary-300 uppercase tracking-wider">DataLearn</div>
                <div className="text-sm font-semibold text-white">Learning Platform</div>
              </div>
            </div>

            <div className="text-2xl font-bold text-cyan-400">=</div>

            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500/20 to-cyan-500/20 border border-primary-400/30 px-5 py-3.5">
              <Award size={20} className="text-cyan-400 shrink-0" />
              <div className="text-left">
                <div className="text-xs text-cyan-300 uppercase tracking-wider">Combined</div>
                <div className="text-sm font-semibold text-white">Complete Ecosystem</div>
              </div>
            </div>
          </div>
        </div>

        <ScrollHint />
      </section>

      {/* ── Section 2: The opportunity ─────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">The Opportunity</p>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              Live classes are powerful.<br />
              <span className="text-gray-400">Learners need the full stack.</span>
            </h2>
            <p className="mt-5 text-gray-400 text-lg max-w-2xl mx-auto">
              Expert sessions spark motivation. But turning that into lasting skill requires
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
                  'Real-world case studies & Q&A',
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
                label: 'What DataLearn provides',
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
                <div className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">{card.label}</div>
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
            DataLearn is not a replacement for live sessions —
            it's the <span className="text-white font-semibold">infrastructure that makes them 10× more effective.</span>
          </p>
        </div>
        <ScrollHint />
      </section>

      {/* ── Section 3: Platform demo ───────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-10">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">Platform Walkthrough</p>
            <h2 className="text-3xl sm:text-4xl font-bold">See the platform in action</h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Auto-playing tour of every core module — click any tab to jump to that screen.
            </p>
          </div>

          {/* Scene tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
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
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-950/60 bg-white/[0.02]">
            <div className="flex items-center gap-3 px-4 h-11 bg-gray-900/80 border-b border-white/10">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <span className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex items-center gap-2 mx-2 h-7 rounded-md bg-black/30 border border-white/5 px-3 text-xs text-gray-400">
                <Lock size={11} className="text-gray-500" />
                <span className="truncate">{activeSceneMeta.url}</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-gray-50 overflow-hidden select-none">
              <div key={scene} className="absolute inset-0">
                {scene === 'learn'    && <SceneLearn phase={current.phase} />}
                {scene === 'sql'      && <SceneSql phase={current.phase} />}
                {scene === 'progress' && <SceneProgress phase={current.phase} />}
                {scene === 'admin'    && <SceneAdmin phase={current.phase} />}
              </div>
              <Cursor x={current.cursor.x} y={current.cursor.y} click={current.click} beat={beat} />
            </div>
          </div>

          {/* Caption + controls */}
          <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-200 min-h-[1.5rem]">
              <MousePointer2 size={15} className="text-primary-400 shrink-0" />
              <span>{current.caption}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {BEATS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === beat ? 'w-6 bg-primary-400' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
              <button
                onClick={() => setPlaying(p => !p)}
                className="ml-2 text-xs text-gray-400 hover:text-white border border-white/10 rounded-full px-3 py-1 transition-colors"
              >
                {playing ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </div>
        <ScrollHint />
      </section>

      {/* ── Section 4: What DataLearn brings ──────────────────────────────── */}
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
                desc: '12 sessions across 4 phases — Foundation, SQL, Visualization, and Python. Each session is modular and independent from live class frequency.',
              },
              {
                icon: <Code2 size={20} />,
                title: 'In-Browser Code Exercises',
                desc: 'SQL and Python environments run directly in the browser. Learners practice with real datasets — no setup, no installs, no friction.',
              },
              {
                icon: <CheckCircle2 size={20} />,
                title: 'Auto-Graded Assessments',
                desc: 'Every exercise is tested against deterministic test cases. Learners get instant pass/fail feedback per criterion — not just a score.',
              },
              {
                icon: <GraduationCap size={20} />,
                title: 'Cohort Management',
                desc: 'Create cohorts with schedules, Zoom links, and session recordings. Approve enrollments and manage access — all from one dashboard.',
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
                desc: 'All materials available in Bahasa Indonesia and English — meeting learners where they are, without switching platforms.',
              },
              {
                icon: <Radio size={20} />,
                title: 'Live Activity Feed',
                desc: 'Admins see real-time events: who completed a session, who submitted an exercise, who just joined — full visibility.',
              },
              {
                icon: <CalendarClock size={20} />,
                title: 'Session Recording Links',
                desc: 'Link Talentiv live session recordings directly into the platform so learners review them alongside the curriculum materials.',
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

      {/* ── Section 5: The combined journey ───────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-4">The Vision</p>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              One learning journey.<br />
              <span className="text-gray-400">Seamlessly connected.</span>
            </h2>
            <p className="mt-5 text-gray-400 text-base max-w-2xl mx-auto">
              Talentiv's live sessions and DataLearn's platform become a single, coherent experience
              for every learner — from onboarding to portfolio-ready.
            </p>
          </div>

          {/* Journey flow */}
          <div className="relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-[calc(10%+24px)] right-[calc(10%+24px)] h-0.5 bg-gradient-to-r from-violet-500/30 via-primary-500/50 to-cyan-500/30" />

            <div className="grid sm:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  color: 'from-violet-600 to-purple-500',
                  icon: <Users size={18} />,
                  brand: 'Talentiv',
                  title: 'Enroll & Onboard',
                  desc: 'Learner joins a Talentiv cohort. Instantly provisioned on DataLearn.',
                },
                {
                  step: '02',
                  color: 'from-primary-600 to-cyan-500',
                  icon: <BookOpen size={18} />,
                  brand: 'DataLearn',
                  title: 'Self-Paced Prep',
                  desc: 'Learner works through curriculum materials and exercises at their own pace.',
                },
                {
                  step: '03',
                  color: 'from-violet-600 to-purple-500',
                  icon: <Video size={18} />,
                  brand: 'Talentiv',
                  title: 'Live Expert Session',
                  desc: 'Instructor dives deeper, answers questions, runs live case studies.',
                },
                {
                  step: '04',
                  color: 'from-primary-600 to-cyan-500',
                  icon: <TrendingUp size={18} />,
                  brand: 'DataLearn',
                  title: 'Reinforce & Measure',
                  desc: 'Practice exercises, session recording review, progress tracked in dashboard.',
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

          {/* Outcome callout */}
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

      {/* ── Section 6: Numbers ────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-white/[0.015] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-14">
            <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-4">By the Numbers</p>
            <h2 className="text-3xl sm:text-4xl font-bold">A platform that's ready to scale</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { v: '12',   unit: 'sessions',  label: 'Structured curriculum sessions across 4 learning phases', icon: <BookOpen size={20} />, c: 'text-primary-400' },
              { v: '40+',  unit: 'exercises', label: 'Interactive SQL and Python exercises with auto-grading', icon: <Code2 size={20} />, c: 'text-violet-400' },
              { v: '4',    unit: 'phases',    label: 'Foundation → SQL → Visualization → Python & Portfolio', icon: <Layers size={20} />, c: 'text-cyan-400' },
              { v: '100%', unit: 'browser',   label: 'No installation. Every learner starts on day one.', icon: <Zap size={20} />, c: 'text-yellow-400' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center">
                <div className={`flex items-center justify-center mb-3 ${s.c}`}>{s.icon}</div>
                <div className={`text-4xl font-bold ${s.c}`}>{s.v}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{s.unit}</div>
                <p className="mt-3 text-xs text-gray-400 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Two-column roles */}
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Learner experience',
                icon: <GraduationCap size={22} />,
                accent: 'from-primary-600 to-cyan-500',
                points: [
                  'Access all 12 sessions with bilingual materials (ID/EN)',
                  'In-browser SQL & Python practice — no setup required',
                  'Instant auto-graded feedback per test case',
                  'Personal progress dashboard across all phases',
                  'Session discussions with @mentor notifications',
                  'Live cohort schedule with Zoom links and recordings',
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
                  'Foundation to add custom content as Talentiv scales',
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

      {/* ── Section 7: Closing CTA ─────────────────────────────────────────── */}
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
            DataLearn has the curriculum infrastructure, interactive tooling, and analytics.
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
        DataLearn — Acquisition overview. Not linked from public navigation.
      </footer>
    </div>
  )
}

/* ── Fake cursor ──────────────────────────────────────────────────────────── */

function Cursor({ x, y, click, beat }: { x: number; y: number; click?: boolean; beat: number }) {
  return (
    <div
      className="absolute z-40 pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transition: 'left 0.85s cubic-bezier(0.22,1,0.36,1), top 0.85s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {click && (
        <span
          key={beat}
          className="absolute -left-3 -top-3 w-8 h-8 rounded-full border-2 border-primary-500 animate-ping"
          style={{ animationIterationCount: 2, animationDuration: '0.7s' }}
        />
      )}
      <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
        style={{ transform: click ? 'scale(0.85)' : 'scale(1)', transition: 'transform 0.15s' }}>
        <path d="M5 2.5 L5 19.5 L9.2 15.3 L12 21 L14.4 20 L11.6 14.4 L18 14.4 Z"
          fill="white" stroke="#0e7490" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ── Scene A: Curriculum → Session ────────────────────────────────────────── */

const PHASES = [
  { icon: '📊', name: 'Fondasi Data & Excel', color: 'from-blue-500 to-cyan-500', count: 3 },
  { icon: '🗄️', name: 'SQL & Database',        color: 'from-violet-500 to-purple-600', count: 3 },
  { icon: '📈', name: 'Visualisasi & BI',      color: 'from-orange-500 to-amber-500', count: 3 },
  { icon: '🐍', name: 'Python & Portfolio',    color: 'from-emerald-500 to-teal-600', count: 3 },
]

function SceneLearn({ phase }: { phase: string }) {
  if (phase === 'open') {
    return (
      <div className="absolute inset-0 overflow-y-auto p-5 sm:p-7 text-gray-800">
        <div className="text-xs font-medium text-primary-600 uppercase tracking-wide">Fase 2 · SQL</div>
        <h2 className="mt-1 text-lg sm:text-2xl font-bold text-gray-900">Sesi 04 — Dasar SQL: SELECT & GROUP BY</h2>
        <div className="mt-2 flex gap-2">
          <span className="text-[11px] bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 font-medium">SQL</span>
          <span className="text-[11px] bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 font-medium">SELECT</span>
          <span className="text-[11px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-medium">~45 menit</span>
        </div>
        <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-gray-600">
          <p>Pada sesi ini kamu belajar mengambil data dari tabel menggunakan perintah <code className="bg-gray-100 text-primary-700 px-1 rounded">SELECT</code> dan meringkasnya dengan <code className="bg-gray-100 text-primary-700 px-1 rounded">GROUP BY</code>.</p>
          <div className="aspect-video rounded-xl bg-gray-900 flex items-center justify-center max-w-md">
            <Play size={36} className="text-white/80" />
          </div>
          <p>Contoh: menghitung jumlah pesanan per kategori produk pada dataset e-commerce.</p>
        </div>
        <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-600 text-white text-sm font-medium px-4 py-2.5 shadow-sm">
          <CheckCircle2 size={16} /> Tandai Selesai
        </button>
      </div>
    )
  }
  return (
    <div className="absolute inset-0 overflow-hidden p-5 sm:p-7">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Kurikulum</h2>
      <p className="text-sm text-gray-500 mt-0.5">12 sesi terstruktur dalam 4 fase pembelajaran</p>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PHASES.map((p, i) => (
          <div key={i}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition-shadow ${
              i === 1 ? 'border-primary-400 ring-2 ring-primary-200' : 'border-gray-100'
            }`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-xl`}>
              {p.icon}
            </div>
            <div className="mt-2 text-[10px] font-medium text-primary-600 uppercase tracking-wide">Fase {i + 1}</div>
            <div className="text-sm font-semibold text-gray-900 leading-snug">{p.name}</div>
            <div className="mt-2 text-[11px] text-gray-400">{p.count} sesi</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Scene B: SQL exercise ────────────────────────────────────────────────── */

const FULL_QUERY = `SELECT category,
       COUNT(*)        AS orders,
       ROUND(AVG(total), 2) AS avg_value
FROM   orders
GROUP  BY category
ORDER  BY orders DESC;`

function SceneSql({ phase }: { phase: string }) {
  const [typed, setTyped] = useState('-- Tulis query-mu di sini')
  const showResult = phase === 'passed'

  useEffect(() => {
    if (phase === 'typing') {
      setTyped('')
      let i = 0
      const id = setInterval(() => {
        i += 2
        setTyped(FULL_QUERY.slice(0, i))
        if (i >= FULL_QUERY.length) clearInterval(id)
      }, 26)
      return () => clearInterval(id)
    }
    if (phase === 'run' || phase === 'passed') setTyped(FULL_QUERY)
    if (phase === 'editor') setTyped('-- Tulis query-mu di sini')
  }, [phase])

  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 h-11 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Database size={15} className="text-primary-600" /> Exercise 04-1 · Aggregation
        </div>
        <button className={`inline-flex items-center gap-1.5 rounded-lg text-white text-xs font-medium px-3 py-1.5 ${
          phase === 'run' ? 'bg-primary-700' : 'bg-primary-600'
        }`}>
          <Play size={13} /> Run
        </button>
      </div>

      <div className="flex-1 grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 min-h-0">
        <div className="bg-[#0d1117] p-4 font-mono text-[12px] leading-relaxed overflow-hidden">
          <pre className="text-gray-200 whitespace-pre-wrap">
            <span className="text-emerald-400">{typed.split(/\b(SELECT|FROM|GROUP|BY|ORDER|AS|COUNT|AVG|ROUND|DESC)\b/).map((part, i) =>
              /^(SELECT|FROM|GROUP|BY|ORDER|AS|COUNT|AVG|ROUND|DESC)$/.test(part)
                ? <span key={i} className="text-sky-400">{part}</span>
                : <span key={i} className="text-gray-200">{part}</span>
            )}</span>
            {(phase === 'typing' || phase === 'editor') && <span className="inline-block w-1.5 h-3.5 bg-primary-400 align-middle animate-pulse ml-0.5" />}
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

/* ── Scene C: Dashboard progress + discussion ────────────────────────────── */

function SceneProgress({ phase }: { phase: string }) {
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setGrown(true), 80)
    return () => clearTimeout(id)
  }, [])

  if (phase === 'discuss') {
    return (
      <div className="absolute inset-0 overflow-hidden p-5 sm:p-7 text-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary-600" /> Discussion — Session 04
          </h2>
          <div className="relative">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">1</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-200 px-3 py-2 text-xs text-primary-800">
          <Bell size={13} /> <span><b>@Andi</b> mentioned you in a discussion</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold">A</div>
              <span className="text-sm font-semibold text-gray-900">Andi</span>
              <span className="text-[11px] text-gray-400">2 hours ago</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Why does my <code className="bg-gray-100 text-primary-700 px-1 rounded">GROUP BY</code> give a different result?
              <span className="text-primary-600 font-medium"> @mentor</span> can you check?
            </p>
          </div>
          <div className="ml-6 rounded-2xl border border-primary-100 bg-primary-50/50 shadow-sm p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">M</div>
              <span className="text-sm font-semibold text-gray-900">Mentor</span>
              <span className="text-[10px] bg-primary-100 text-primary-700 rounded-full px-1.5 py-0.5 font-medium">Mentor</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Make sure all non-aggregate columns are in the <code className="bg-gray-100 text-primary-700 px-1 rounded">GROUP BY</code> 👍
            </p>
          </div>
        </div>
      </div>
    )
  }

  const bars = [
    { label: 'Phase 1 — Data Foundations', pct: 100 },
    { label: 'Phase 2 — SQL & Database', pct: 66 },
    { label: 'Phase 3 — Visualization & BI', pct: 20 },
    { label: 'Phase 4 — Python & Portfolio', pct: 0 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden p-5 sm:p-7 text-gray-800">
      <p className="text-sm text-gray-500">Welcome back,</p>
      <h2 className="text-xl font-bold text-gray-900">Hi, Sari 👋</h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: <BookOpen size={16} className="text-primary-600" />, v: '7', t: '12', l: 'Sessions done', bg: 'bg-primary-50' },
          { icon: <Code2 size={16} className="text-violet-600" />, v: '23', t: '40+', l: 'Exercises passed', bg: 'bg-violet-50' },
          { icon: <TrendingUp size={16} className="text-emerald-600" />, v: '2', t: '4', l: 'Phases active', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3.5 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <div className="text-lg font-bold text-gray-900 leading-none">{s.v}<span className="text-xs font-normal text-gray-400">/{s.t}</span></div>
              <div className="text-[10px] text-gray-500 mt-1">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Overall progress</h3>
        <div className="space-y-2.5">
          {bars.map((b, i) => (
            <div key={i}>
              <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                <span>{b.label}</span><span>{b.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400"
                  style={{ width: grown ? `${b.pct}%` : '0%', transition: 'width 1.1s cubic-bezier(0.22,1,0.36,1)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Scene D: Admin + cohort (dark) ──────────────────────────────────────── */

function SceneAdmin({ phase }: { phase: string }) {
  const showCohort = phase === 'cohort' || phase === 'approved'
  const approved = phase === 'approved'

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
                { l: 'Active Today', v: '34', icon: <Activity size={14} />, c: 'text-green-400' },
                { l: 'Sessions Done', v: '892', icon: <BookOpen size={14} />, c: 'text-violet-400' },
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
                  ['Sari', 'completed Session 06', 'text-green-400'],
                  ['Andi', 'submitted exercise 04-1', 'text-primary-400'],
                  ['Budi', 'logged in to the platform', 'text-gray-400'],
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-green-400' : i === 1 ? 'bg-primary-400' : 'bg-gray-500'}`} />
                    <b className="text-gray-200">{a[0]}</b> {a[1]}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl bg-[#111827] border border-white/[0.06] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Batch 1 · 2026</div>
                  <div className="text-[11px] text-gray-500">Starts Jun 1, 2026 · 13 sessions scheduled</div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full px-2.5 py-1">
                  <CalendarClock size={12} /> Active schedule
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#111827] border border-white/[0.06] p-4">
              <div className="text-sm font-semibold text-gray-200 mb-3">Enrollments</div>
              <div className="space-y-2">
                {[
                  ['Sari Putri', 'active'],
                  ['Andi Wijaya', 'active'],
                  ['Rina Lestari', approved ? 'active' : 'pending'],
                ].map((u, i) => {
                  const isPending = u[1] === 'pending'
                  return (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-600/80 text-white text-[11px] flex items-center justify-center font-bold">
                          {u[0].split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs text-gray-200">{u[0]}</span>
                      </div>
                      {isPending ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-primary-600 rounded-md px-2.5 py-1">
                          Approve
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">
                          {i === 2 && approved ? 'Just activated ✓' : 'Active'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
