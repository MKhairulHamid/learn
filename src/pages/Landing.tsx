import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, Play, CheckCircle2, BookOpen, Gamepad2, Video, Award,
  Users, Calendar, Mic2, FileText, ClipboardList, BarChart3,
  MessageSquare, Smartphone, Sparkles, Globe2, Clock, Star,
  ChevronRight, Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

// ── Data ──────────────────────────────────────────────────────────────────

const PROGRAMS = [
  {
    slug: 'data-analyst',
    icon: '📊',
    gradient: 'from-primary-600 to-cyan-500',
    lightBg: 'bg-primary-50',
    accentText: 'text-primary-700',
    accentBorder: 'border-primary-200',
    name_en: 'Data Analyst Career Intelligence',
    name_id: 'Data Analyst Career Intelligence',
    tagline_en: '12-session structured path — from Excel foundations to SQL, Python & BNSP certification.',
    tagline_id: 'Jalur belajar 12 sesi — dari Excel dasar sampai SQL, Python & sertifikasi BNSP.',
    badge: 'Data Analytics',
    stats: [
      { value: '12', label: 'Sessions' },
      { value: '40+', label: 'Exercises' },
      { value: '4', label: 'Phases' },
      { value: 'BNSP', label: 'Certified' },
    ],
    modules: [
      'Data Foundations & Excel',
      'SQL for Business Analysis',
      'Visualization & Storytelling',
      'Python + Final Project',
    ],
    tools: ['Excel', 'SQL', 'Python', 'Looker Studio', 'Power BI', 'Google Sheets'],
  },
  {
    slug: 'hr-fast-track',
    icon: '👥',
    gradient: 'from-rose-500 to-pink-600',
    lightBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    accentBorder: 'border-rose-200',
    name_en: 'HR Fast Track Bootcamp',
    name_id: 'Bootcamp HR Fast Track',
    tagline_en: '3-month live bootcamp — HR fundamentals, BNSP certification, and career preparation.',
    tagline_id: 'Bootcamp live 3 bulan — dasar HR, sertifikasi BNSP, dan persiapan karir.',
    badge: 'Human Resources',
    stats: [
      { value: '25+', label: 'Sessions' },
      { value: '3', label: 'Modules' },
      { value: 'Live', label: 'Online' },
      { value: 'BNSP', label: 'Certified' },
    ],
    modules: [
      'Bootcamp Fast Track',
      'Certification (BNSP)',
      'Career Preparation',
    ],
    tools: ['Excel', 'Looker Studio', 'Mekari Talenta', 'HRIS', 'PPh 21', 'BPJS'],
  },
]

const LIFECYCLE_STEPS = [
  {
    step: '01',
    icon: Calendar,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    title: 'See the Schedule',
    desc: 'View upcoming live sessions in your cohort calendar. Get reminders before each class starts.',
    tag: 'Current',
    tagVariant: 'success' as const,
  },
  {
    step: '02',
    icon: Mic2,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    title: 'Join Live via Zoom',
    desc: 'One-click Zoom link from the platform. Real-time instruction, Q&A, and peer interaction.',
    tag: 'Current',
    tagVariant: 'success' as const,
  },
  {
    step: '03',
    icon: FileText,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    title: 'Read & Practice',
    desc: 'Every session unlocks bilingual materials and hands-on exercises — study at your own pace.',
    tag: 'Current',
    tagVariant: 'success' as const,
  },
  {
    step: '04',
    icon: Video,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    title: 'Rewatch the Recording',
    desc: 'Missed something? Full session recordings are permanently available in your dashboard.',
    tag: 'Current',
    tagVariant: 'success' as const,
  },
  {
    step: '05',
    icon: Gamepad2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    title: 'Use the Playground',
    desc: 'Run SQL queries, write Python code, or practice HR calculations — directly in the browser.',
    tag: 'Current',
    tagVariant: 'success' as const,
  },
  {
    step: '06',
    icon: ClipboardList,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    title: 'Fill Post-Session Survey',
    desc: 'Rate each session, share feedback, and help improve the program as you go.',
    tag: 'Current',
    tagVariant: 'success' as const,
  },
]

const CURRENT_FEATURES = [
  {
    icon: Video,
    title: 'Live Expert Sessions',
    desc: 'Weekly live classes with industry practitioners. Real-time screen sharing, Q&A, and peer exercises.',
    gradient: 'from-primary-500 to-cyan-500',
  },
  {
    icon: Calendar,
    title: 'Session Schedule',
    desc: 'See all upcoming and past sessions in your cohort timeline. Never miss a class with built-in reminders.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: BookOpen,
    title: 'Structured Materials',
    desc: 'Bilingual (EN/ID) written content for every session — readable anytime, searchable.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Gamepad2,
    title: 'SQL, Python & HR Playground',
    desc: 'Three separate in-browser sandboxes: run SQL queries, write Python with Pandas, or calculate PPh 21 & BPJS.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Video,
    title: 'Session Recordings',
    desc: 'Every live session is recorded and stored. Rewatch at 1x, 1.5x, or 2x — forever.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: MessageSquare,
    title: 'Discussion & Q&A',
    desc: 'Per-session threaded discussions with @mention support, voting, replies, and instant notifications.',
    gradient: 'from-fuchsia-500 to-violet-600',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    desc: 'Visual progress bars, session completion status, and exercise scores — see your growth at a glance.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: ClipboardList,
    title: 'Post-Session Surveys',
    desc: 'Structured feedback forms after each session. Rate your experience and help improve the program.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Award,
    title: 'BNSP Certification',
    desc: 'Both programs lead to nationally recognized BNSP certification — the professional competency standard.',
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    icon: Users,
    title: 'Small Cohort Groups',
    desc: 'Learn alongside a small, focused cohort — not an anonymous mass enrollment. Real accountability.',
    gradient: 'from-indigo-500 to-blue-600',
  },
]

const FUTURE_FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Learning Assistant',
    desc: 'Ask questions about any session content, get personalized explanations, and generate practice questions on demand.',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    desc: 'Track your attendance, exercise scores, session engagement, and skill growth over the full program.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    desc: 'Learn on the go. Access materials, watch recordings, and complete exercises from your phone.',
  },
  {
    icon: Globe2,
    title: 'LinkedIn Certificate Sharing',
    desc: 'One-click share your BNSP certification and program badges directly to your LinkedIn profile.',
  },
  {
    icon: Star,
    title: 'Mentor 1:1 Booking',
    desc: 'Book private sessions with your program mentor for personalized career guidance and code review.',
  },
]

const STATS = [
  { value: '2', label: 'Active Programs' },
  { value: '37+', label: 'Live Sessions' },
  { value: '40+', label: 'Exercises' },
  { value: 'BNSP', label: 'Certified' },
]

// ── Component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const { i18n } = useTranslation(['common', 'curriculum'])
  const navigate = useNavigate()
  const lang = i18n.language === 'id' ? 'id' : 'en'
  const [activeProg, setActiveProg] = useState(0)
  const prog = PROGRAMS[activeProg]

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900 text-white">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" size="md">
              <Zap size={12} className="mr-1" /> Learning Platform — Live & Self Learning
            </Badge>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              One platform for{' '}
              <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                live classes
              </span>{' '}
              and{' '}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                self learning
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Join live sessions with expert mentors, rewatch recordings anytime, practice in interactive playgrounds,
              and track your growth — all in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto">
                <Play size={18} />
                Start Learning Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/curriculum')}
                className="w-full sm:w-auto border-white/25 text-white hover:bg-white/10">
                Explore Programs
                <ArrowRight size={18} />
              </Button>
            </div>

            {/* Stats strip */}
            <div className="mt-14 grid grid-cols-4 gap-3 max-w-xl mx-auto">
              {STATS.map(({ value, label }) => (
                <div key={label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Program switcher + preview */}
          <div className="mt-14">
            <div className="flex justify-center gap-3 flex-wrap mb-5">
              {PROGRAMS.map((p, i) => (
                <button key={p.slug} onClick={() => setActiveProg(i)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
                    activeProg === i
                      ? 'bg-white text-gray-900 border-white shadow-lg scale-[1.03]'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}>
                  <span>{p.icon}</span>
                  {lang === 'id' ? p.name_id : p.name_en}
                </button>
              ))}
            </div>

            <div className="max-w-3xl mx-auto bg-white/8 backdrop-blur border border-white/12 rounded-2xl p-6">
              <div className="flex items-start gap-4 flex-wrap">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prog.gradient} flex items-center justify-center text-2xl shrink-0`}>
                  {prog.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="primary" size="sm">{prog.badge}</Badge>
                    <Badge variant="gray" size="sm">BNSP Certified</Badge>
                  </div>
                  <h3 className="mt-1 font-bold text-white text-lg">
                    {lang === 'id' ? prog.name_id : prog.name_en}
                  </h3>
                  <p className="text-gray-300 text-sm mt-0.5">
                    {lang === 'id' ? prog.tagline_id : prog.tagline_en}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {prog.stats.map(({ value, label }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — Session Lifecycle ──────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="primary" size="md">How It Works</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              Your complete learning journey in 6 steps
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              From scheduling to certification — every part of the learning cycle is managed inside Learning Platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LIFECYCLE_STEPS.map(({ step, icon: Icon, color, bg, border, title, desc, tag, tagVariant }) => (
              <div key={step}
                className={`relative bg-white rounded-2xl border ${border} p-6 hover:shadow-md transition-shadow`}>
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-gray-300">{step}</span>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                <div className="mt-4">
                  <Badge variant={tagVariant} size="sm">{tag}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Features — Current ───────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="success" size="md">Available Now</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need, already here
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Learning Platform isn't just a video platform. It's a complete learning environment built around live instruction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CURRENT_FEATURES.map(({ icon: Icon, title, desc, gradient }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live vs. Self-Learning split ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="primary" size="md">The Hybrid Advantage</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              Live guidance + always-on access
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Most platforms give you one or the other. Learning Platform combines both — scheduled live sessions and on-demand self-study in a single workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live column */}
            <div className="rounded-2xl border border-primary-200 overflow-hidden">
              <div className="bg-gradient-to-br from-primary-600 to-cyan-500 p-7 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Mic2 size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold opacity-70 uppercase tracking-wider">Live Learning</div>
                    <h3 className="font-bold text-xl">Expert-led sessions</h3>
                  </div>
                </div>
                <p className="text-sm opacity-85 leading-relaxed">
                  Weekly live classes with screen-sharing, real-time Q&A, and interactive exercises.
                  Your mentor guides you through real-world problems — not just theory.
                </p>
              </div>
              <div className="bg-primary-50 p-6 space-y-3">
                {[
                  { icon: '📅', text: 'Scheduled sessions visible in cohort calendar' },
                  { icon: '🔗', text: 'One-click Zoom link directly from the platform' },
                  { icon: '🎤', text: 'Live Q&A, polls, and collaborative exercises' },
                  { icon: '👥', text: 'Small cohort — your mentor knows your name' },
                  { icon: '🔔', text: 'Session reminders so you never miss a class' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm text-gray-700 leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-learning column */}
            <div className="rounded-2xl border border-violet-200 overflow-hidden">
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-7 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold opacity-70 uppercase tracking-wider">Self Learning</div>
                    <h3 className="font-bold text-xl">Study at your pace</h3>
                  </div>
                </div>
                <p className="text-sm opacity-85 leading-relaxed">
                  Every session unlocks structured materials, exercises, and tools. Rewatch recordings,
                  re-read content, and practice until concepts click — on your schedule.
                </p>
              </div>
              <div className="bg-violet-50 p-6 space-y-3">
                {[
                  { icon: '📖', text: 'Bilingual (EN/ID) written materials per session' },
                  { icon: '🎥', text: 'Permanent session recording — rewatch anytime' },
                  { icon: '💻', text: 'In-browser SQL, Python & HR tool practice' },
                  { icon: '✏️', text: 'Exercises with guided feedback' },
                  { icon: '📋', text: 'Post-session survey to track your progress' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm text-gray-700 leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="gray" size="md">Programs</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">Choose your career path</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Two structured programs — both with live sessions, structured materials, hands-on practice, and BNSP certification.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PROGRAMS.map((p) => (
              <div key={p.slug}
                className={`rounded-2xl border ${p.accentBorder} overflow-hidden shadow-sm hover:shadow-lg transition-shadow`}>
                <div className={`bg-gradient-to-r ${p.gradient} p-7 text-white`}>
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{p.icon}</span>
                    <Badge variant="gray" size="sm">{p.badge}</Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{lang === 'id' ? p.name_id : p.name_en}</h3>
                  <p className="mt-1 text-sm opacity-80">{lang === 'id' ? p.tagline_id : p.tagline_en}</p>
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {p.stats.map(({ value, label }) => (
                      <div key={label} className="bg-white/15 rounded-xl p-2.5 text-center">
                        <div className="text-lg font-bold">{value}</div>
                        <div className="text-xs opacity-70">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${p.lightBg} p-6`}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Modules</p>
                  <div className="space-y-2 mb-5">
                    {p.modules.map(label => (
                      <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={15} className={p.accentText} />
                        {label}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tools &amp; Skills</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tools.map(tool => (
                      <span key={tool}
                        className={`text-xs px-2.5 py-1 rounded-full ${p.lightBg} border ${p.accentBorder} ${p.accentText} font-medium`}>
                        {tool}
                      </span>
                    ))}
                  </div>
                  <Button size="sm" onClick={() => navigate('/register')}
                    className={`w-full bg-gradient-to-r ${p.gradient} text-white border-0 hover:opacity-90`}>
                    Enroll Now <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo UI mockup ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="primary" size="md">Inside the Platform</Badge>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 leading-snug">
                Your whole learning life,<br />
                <span className="text-primary-600">in one dashboard</span>
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                No more switching between email, Zoom, Google Drive, and Notion. Learning Platform puts your
                schedule, Zoom links, recordings, materials, exercises, and survey forms in a single
                interface your cohort shares together.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: Calendar, text: 'Upcoming session dates and Zoom links at a glance' },
                  { icon: Video, text: 'Past recording library, searchable by session topic' },
                  { icon: Gamepad2, text: 'Playground pre-loaded with session datasets' },
                  { icon: ClipboardList, text: 'Post-session survey linked directly from each class' },
                  { icon: Clock, text: 'Scheduled unlock keeps cohort learning in sync' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                      <Icon size={13} className="text-primary-600" />
                    </div>
                    <span className="text-gray-600 text-sm leading-snug">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock UI */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-cyan-50 border border-primary-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-gray-400 font-mono">session-07 · SQL JOINs Deep Dive</span>
                </div>

                {/* Session row */}
                <div className="bg-white rounded-xl border border-gray-100 p-3.5 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Mic2 size={15} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-900">Session 07 · Live in 2h</div>
                        <div className="text-xs text-gray-400">Mon, 26 May · 19:00 WIB</div>
                      </div>
                    </div>
                    <span className="text-xs bg-primary-600 text-white px-3 py-1 rounded-full font-medium">Join Zoom</span>
                  </div>
                </div>

                {/* Playground snippet */}
                <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs">
                  <div className="text-gray-500 mb-2">-- SQL Playground · Session 07</div>
                  <div className="text-blue-400">SELECT</div>
                  <div className="text-white pl-4">e.name, d.dept_name</div>
                  <div className="text-blue-400">FROM</div>
                  <div className="text-white pl-4">employees e</div>
                  <div className="text-cyan-400 pl-4">LEFT JOIN departments d</div>
                  <div className="text-cyan-400 pl-8">ON e.dept_id = d.id;</div>
                  <div className="mt-3 flex gap-2">
                    <span className="bg-green-900 text-green-400 px-2 py-0.5 rounded-full">3 rows returned</span>
                    <span className="bg-primary-900 text-primary-400 px-2 py-0.5 rounded-full">Exercise unlocked</span>
                  </div>
                </div>
              </div>

              {/* Floating cohort card */}
              <div className="absolute -bottom-5 -right-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Cohort Batch 1 · 2026</div>
                    <div className="text-xs text-gray-400">4 active learners online</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools banner ──────────────────────────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Tools &amp; technologies across all programs
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['Excel', 'SQL', 'Python', 'Looker Studio', 'Power BI', 'Mekari Talenta',
              'HRIS', 'PPh 21', 'BPJS', 'Google Sheets', 'Pandas', 'BNSP'].map(tool => (
              <div key={tool}
                className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming Soon ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="warning" size="md">
              <Sparkles size={12} className="mr-1" /> Coming Soon
            </Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">What's on the roadmap</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              We're continuously building. Here's what's coming to make your learning experience even richer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FUTURE_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 border-dashed p-6 hover:border-primary-200 transition-colors group">
                <div className="w-11 h-11 bg-gray-100 group-hover:bg-primary-50 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Icon size={20} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{title}</h3>
                  <Badge variant="warning" size="sm">Soon</Badge>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof placeholder ──────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Learners from Indonesia's top companies</h2>
            <p className="mt-3 text-gray-500">
              Our graduates work at leading companies across data and HR — earning BNSP-recognized certifications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { quote: 'The live sessions are exactly what I needed — real examples, real Q&A. The playground made SQL click for me.', name: 'Cohort Batch 1 · Data Analyst Track' },
              { quote: 'I could rewatch recordings when I missed a session. Having exercises right after class made all the difference.', name: 'Cohort Batch 1 · Data Analyst Track' },
              { quote: 'The mix of live instruction and self-paced materials fits perfectly around my work schedule.', name: 'Cohort Batch 1 · HR Fast Track' },
            ].map(({ quote, name }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic mb-4">"{quote}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-primary-600" />
                  </div>
                  <span className="text-xs text-gray-400">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <Badge variant="primary" size="md">
            <Zap size={12} className="mr-1" /> Learning Platform
          </Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight">
            Ready to learn live<br />
            <span className="text-primary-400">and on your own terms?</span>
          </h2>
          <p className="mt-5 text-gray-300 leading-relaxed max-w-lg mx-auto">
            Join a cohort, get instant access to materials and playgrounds, join live sessions with your mentor,
            and earn a BNSP-recognized certification — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="w-full sm:w-auto">
              Create free account <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/curriculum')}
              className="w-full sm:w-auto border-white/25 text-white hover:bg-white/10">
              Browse curriculum <ChevronRight size={18} />
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500">No credit card required · Free to explore</p>
        </div>
      </section>

    </div>
  )
}
