import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, Play, CheckCircle2,
  BookOpen, Gamepad2, Video, Award, Users,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

// ── Static program catalogue ─────────────────────────────────────────

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
      { label: 'Data Foundations & Excel' },
      { label: 'SQL for Business Analysis' },
      { label: 'Visualization & Storytelling' },
      { label: 'Python + Final Project' },
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
      { label: 'Bootcamp Fast Track' },
      { label: 'Certification (BNSP)' },
      { label: 'Career Preparation' },
    ],
    tools: ['Excel', 'Looker Studio', 'Mekari Talenta', 'HRIS', 'PPh 21', 'BPJS'],
  },
]

const PLATFORM_FEATURES = [
  {
    icon: Video,
    title: 'Live Classes',
    desc: 'Weekly live sessions with expert mentors. Real-time Q&A, interactive exercises, and peer learning — not just recorded video.',
    gradient: 'from-primary-500 to-cyan-500',
  },
  {
    icon: BookOpen,
    title: 'Structured Materials',
    desc: 'Every session has bilingual written content (EN/ID), learning outcomes, and exercises — readable anytime, anywhere.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Gamepad2,
    title: 'Interactive Playground',
    desc: 'Practice in-browser SQL, Python, and HR tools. Run real queries, test your code, calculate payroll — no setup needed.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Award,
    title: 'BNSP Certification',
    desc: 'Both programs lead to BNSP professional certification — the nationally recognized competency standard in Indonesia.',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

export default function Landing() {
  const { i18n } = useTranslation(['common', 'curriculum'])
  const navigate = useNavigate()
  const lang = i18n.language === 'id' ? 'id' : 'en'
  const [activeProg, setActiveProg] = useState(0)
  const prog = PROGRAMS[activeProg]

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/3 w-48 h-48 bg-rose-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" size="md">
              <span className="mr-1">🎓</span> Talentiv Learning Platform
            </Badge>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Learn Live.{' '}
              <span className="text-primary-400">Practice Deep.</span>{' '}
              Get Certified.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              A hybrid learning platform combining <strong className="text-white">live online classes</strong> with
              structured materials, interactive playgrounds, and hands-on exercises — all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto">
                <Play size={18} />
                Start Learning Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/curriculum')}
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                Explore Curriculum
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          {/* Program switcher */}
          <div className="mt-14 flex justify-center gap-3 flex-wrap">
            {PROGRAMS.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => setActiveProg(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
                  activeProg === i
                    ? 'bg-white text-gray-900 border-white shadow-lg scale-[1.03]'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <span>{p.icon}</span>
                {lang === 'id' ? p.name_id : p.name_en}
              </button>
            ))}
          </div>

          {/* Active program preview */}
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-6">
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
                  <p className="text-gray-300 text-sm mt-1">
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

      {/* ── Platform features ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">More than just recorded video</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              We blend live instruction with a full learning platform — the guidance of a classroom with the flexibility of self-paced study.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORM_FEATURES.map(({ icon: Icon, title, desc, gradient }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs section ──────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose your career path</h2>
            <p className="mt-3 text-gray-500">Two structured programs — both with live sessions, materials, practice tools, and BNSP certification.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PROGRAMS.map((p) => (
              <div key={p.slug}
                className={`rounded-2xl border ${p.accentBorder} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                <div className={`bg-gradient-to-r ${p.gradient} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{p.icon}</div>
                    <Badge variant="gray" size="sm">
                      {p.badge}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">
                    {lang === 'id' ? p.name_id : p.name_en}
                  </h3>
                  <p className="mt-1 text-sm opacity-80">
                    {lang === 'id' ? p.tagline_id : p.tagline_en}
                  </p>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {p.stats.map(({ value, label }) => (
                      <div key={label} className="bg-white/15 rounded-xl p-2 text-center">
                        <div className="text-lg font-bold">{value}</div>
                        <div className="text-xs opacity-70">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${p.lightBg} p-6`}>
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Modules</p>
                    <div className="space-y-2">
                      {p.modules.map(({ label }) => (
                        <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={15} className={p.accentText} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tools &amp; Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tools.map(tool => (
                        <span key={tool}
                          className={`text-xs px-2.5 py-1 rounded-full ${p.lightBg} border ${p.accentBorder} ${p.accentText} font-medium`}>
                          {tool}
                        </span>
                      ))}
                    </div>
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

      {/* ── Live + Platform feature detail ───────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="primary" size="md">The Hybrid Advantage</Badge>
              <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                Live instruction meets<br />
                <span className="text-primary-600">always-on platform</span>
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Traditional courses give you a mentor <em>or</em> a platform. We give you both.
                Join live sessions with industry practitioners, then reinforce your learning through
                structured materials, interactive exercises, and real-tool playgrounds — accessible 24/7.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: '🎥', text: 'Weekly live sessions with screen-sharing and Q&A' },
                  { icon: '📖', text: 'Bilingual written content for every session (EN/ID)' },
                  { icon: '💻', text: 'In-browser SQL, Python, and HR tool practice' },
                  { icon: '🏆', text: 'BNSP-recognized certification on completion' },
                  { icon: '👥', text: 'Small cohort groups — not anonymous mass enrollments' },
                  { icon: '🔒', text: 'Scheduled unlock keeps you on track with your cohort' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="text-gray-600 text-sm leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock UI snippet */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-cyan-50 border border-primary-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-gray-400 font-mono">session-07-sql.md</span>
                </div>
                <div className="font-mono text-xs space-y-1.5 text-gray-700">
                  <div><span className="text-primary-600">##</span> SQL JOINs Deep Dive</div>
                  <div className="text-gray-400">Learning outcomes: INNER, LEFT, RIGHT, FULL</div>
                  <div className="mt-3 bg-gray-900 rounded-lg p-3 text-green-400">
                    <div>SELECT e.name, d.dept_name</div>
                    <div>FROM employees e</div>
                    <div className="text-cyan-400">LEFT JOIN departments d</div>
                    <div className="text-cyan-400">{'  '}ON e.dept_id = d.id;</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✓ 3 rows returned</span>
                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">Exercise unlocked</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Cohort: Batch 1 · 2026</div>
                    <div className="text-xs text-gray-400">4 active learners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools banner ─────────────────────────────────────────────── */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Tools &amp; technologies across all programs
          </p>
          <div className="flex flex-wrap justify-center gap-3">
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

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-600 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to build your career?</h2>
          <p className="mt-4 text-primary-200">
            Join a cohort, get instant access to materials and the playground, and learn alongside a mentor — not just a screen recording.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="w-full sm:w-auto">
              Create free account <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/curriculum')}
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
              Browse curriculum
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
