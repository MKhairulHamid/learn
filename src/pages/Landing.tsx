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
      { value: '12', label_en: 'Sessions', label_id: 'Sesi' },
      { value: '40+', label_en: 'Exercises', label_id: 'Latihan' },
      { value: '4', label_en: 'Phases', label_id: 'Fase' },
      { value: 'BNSP', label_en: 'Certified', label_id: 'Bersertifikat' },
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
      { value: '25+', label_en: 'Sessions', label_id: 'Sesi' },
      { value: '3', label_en: 'Modules', label_id: 'Modul' },
      { value: 'Live', label_en: 'Online', label_id: 'Online' },
      { value: 'BNSP', label_en: 'Certified', label_id: 'Bersertifikat' },
    ],
    modules_en: [
      'Bootcamp Fast Track',
      'Certification (BNSP)',
      'Career Preparation',
    ],
    modules_id: [
      'Bootcamp Fast Track',
      'Sertifikasi (BNSP)',
      'Persiapan Karir',
    ],
    tools: ['Excel', 'Looker Studio', 'Mekari Talenta', 'HRIS', 'PPh 21', 'BPJS'],
  },
  {
    slug: 'data-analyst-fast-track',
    icon: '⚡',
    gradient: 'from-cyan-500 to-blue-600',
    lightBg: 'bg-cyan-50',
    accentText: 'text-cyan-700',
    accentBorder: 'border-cyan-200',
    name_en: 'Data Analyst Fast Track',
    name_id: 'Data Analyst Fast Track',
    tagline_en: '3-week intensive — spreadsheets, EDA, dashboards, Power BI, SQL & BNSP prep.',
    tagline_id: 'Intensif 3 pekan — spreadsheet, EDA, dashboard, Power BI, SQL & persiapan BNSP.',
    badge: 'Data Analytics',
    stats: [
      { value: '11', label_en: 'Sessions', label_id: 'Sesi' },
      { value: '3', label_en: 'Weeks', label_id: 'Pekan' },
      { value: 'Live', label_en: 'Online', label_id: 'Online' },
      { value: 'BNSP', label_en: 'Prep', label_id: 'Persiapan' },
    ],
    modules_en: [
      'Data Foundations & Core Formulas',
      'Advanced Analysis & Visualization',
      'SQL, Portfolio & BNSP Prep',
    ],
    modules_id: [
      'Fondasi Data & Formula Dasar',
      'Analisis & Visualisasi Lanjutan',
      'SQL, Portofolio & Persiapan BNSP',
    ],
    tools: ['Excel', 'Pivot Table', 'XLOOKUP', 'Power BI', 'SQL', 'Looker Studio'],
  },
]

// Only surface these programs on the landing page for now. Others stay defined
// above (just hidden) so they're easy to re-enable later.
const VISIBLE_PROGRAMS = PROGRAMS.filter((p) => p.slug === 'data-analyst-fast-track')

const LIFECYCLE_STEPS = [
  {
    step: '01',
    icon: Calendar,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    title_en: 'See the Schedule',
    title_id: 'Lihat Jadwal',
    desc_en: 'View upcoming live sessions in your cohort calendar. Get reminders before each class starts.',
    desc_id: 'Pantau jadwal sesi live di kalender cohort-mu. Dapatkan pengingat sebelum setiap kelas dimulai.',
    tag_en: 'Current',
    tag_id: 'Aktif',
    tagVariant: 'success' as const,
  },
  {
    step: '02',
    icon: Mic2,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    title_en: 'Join Live via Zoom',
    title_id: 'Ikuti Live via Zoom',
    desc_en: 'One-click Zoom link from the platform. Real-time instruction, Q&A, and peer interaction.',
    desc_id: 'Satu klik untuk masuk Zoom dari platform. Instruksi langsung, tanya jawab, dan interaksi sesama peserta.',
    tag_en: 'Current',
    tag_id: 'Aktif',
    tagVariant: 'success' as const,
  },
  {
    step: '03',
    icon: FileText,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    title_en: 'Read & Practice',
    title_id: 'Baca & Berlatih',
    desc_en: 'Every session unlocks bilingual materials and hands-on exercises — study at your own pace.',
    desc_id: 'Setiap sesi membuka materi bilingual dan latihan langsung — belajar kapan saja sesuai ritmu.',
    tag_en: 'Current',
    tag_id: 'Aktif',
    tagVariant: 'success' as const,
  },
  {
    step: '04',
    icon: Video,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    title_en: 'Rewatch the Recording',
    title_id: 'Tonton Ulang Rekaman',
    desc_en: 'Missed something? Full session recordings are permanently available in your dashboard.',
    desc_id: 'Ketinggalan sesuatu? Rekaman lengkap sesi tersimpan permanen di dashboard-mu.',
    tag_en: 'Current',
    tag_id: 'Aktif',
    tagVariant: 'success' as const,
  },
  {
    step: '05',
    icon: Gamepad2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    title_en: 'Use the Playground',
    title_id: 'Gunakan Playground',
    desc_en: 'Run SQL queries, write Python code, or practice HR calculations — directly in the browser.',
    desc_id: 'Jalankan query SQL, tulis kode Python, atau latihan perhitungan HR — langsung di browser.',
    tag_en: 'Current',
    tag_id: 'Aktif',
    tagVariant: 'success' as const,
  },
  {
    step: '06',
    icon: ClipboardList,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    title_en: 'Fill Post-Session Survey',
    title_id: 'Isi Survei Pasca-Sesi',
    desc_en: 'Rate each session, share feedback, and help improve the program as you go.',
    desc_id: 'Nilai setiap sesi, bagikan masukan, dan bantu tingkatkan program bersama.',
    tag_en: 'Current',
    tag_id: 'Aktif',
    tagVariant: 'success' as const,
  },
]

const CURRENT_FEATURES = [
  {
    icon: Video,
    title_en: 'Live Expert Sessions',
    title_id: 'Sesi Live dengan Pakar',
    desc_en: 'Weekly live classes with industry practitioners. Real-time screen sharing, Q&A, and peer exercises.',
    desc_id: 'Kelas live mingguan bersama praktisi industri. Screen sharing, tanya jawab, dan latihan bersama secara real-time.',
    gradient: 'from-primary-500 to-cyan-500',
  },
  {
    icon: Calendar,
    title_en: 'Session Schedule',
    title_id: 'Jadwal Sesi',
    desc_en: 'See all upcoming and past sessions in your cohort timeline. Never miss a class with built-in reminders.',
    desc_id: 'Lihat semua sesi mendatang dan yang sudah berlalu di timeline cohort-mu. Jangan ketinggalan kelas dengan pengingat otomatis.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: BookOpen,
    title_en: 'Structured Materials',
    title_id: 'Materi Terstruktur',
    desc_en: 'Bilingual (EN/ID) written content for every session — readable anytime, searchable.',
    desc_id: 'Konten tertulis bilingual (EN/ID) untuk setiap sesi — bisa dibaca kapan saja dan mudah dicari.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Gamepad2,
    title_en: 'SQL, Python & HR Playground',
    title_id: 'Playground SQL, Python & HR',
    desc_en: 'Three separate in-browser sandboxes: run SQL queries, write Python with Pandas, or calculate PPh 21 & BPJS.',
    desc_id: 'Tiga sandbox di browser: jalankan query SQL, tulis Python dengan Pandas, atau hitung PPh 21 & BPJS.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Video,
    title_en: 'Session Recordings',
    title_id: 'Rekaman Sesi',
    desc_en: 'Every live session is recorded and stored. Rewatch at 1x, 1.5x, or 2x — forever.',
    desc_id: 'Setiap sesi live direkam dan disimpan. Tonton ulang dengan kecepatan 1x, 1.5x, atau 2x — selamanya.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: MessageSquare,
    title_en: 'Discussion & Q&A',
    title_id: 'Diskusi & Tanya Jawab',
    desc_en: 'Per-session threaded discussions with @mention support, voting, replies, and instant notifications.',
    desc_id: 'Diskusi berthread per sesi dengan dukungan @mention, voting, balasan, dan notifikasi instan.',
    gradient: 'from-fuchsia-500 to-violet-600',
  },
  {
    icon: BarChart3,
    title_en: 'Progress Tracking',
    title_id: 'Pantau Progres',
    desc_en: 'Visual progress bars, session completion status, and exercise scores — see your growth at a glance.',
    desc_id: 'Progress bar visual, status penyelesaian sesi, dan skor latihan — lihat perkembanganmu sekilas pandang.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: ClipboardList,
    title_en: 'Post-Session Surveys',
    title_id: 'Survei Pasca-Sesi',
    desc_en: 'Structured feedback forms after each session. Rate your experience and help improve the program.',
    desc_id: 'Formulir feedback terstruktur setelah setiap sesi. Nilai pengalamanmu dan bantu tingkatkan program.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: Award,
    title_en: 'BNSP Certification',
    title_id: 'Sertifikasi BNSP',
    desc_en: 'The program leads to nationally recognized BNSP certification — the professional competency standard.',
    desc_id: 'Program ini mengantarmu ke sertifikasi BNSP yang diakui secara nasional — standar kompetensi profesional.',
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    icon: Users,
    title_en: 'Small Cohort Groups',
    title_id: 'Kelompok Cohort Kecil',
    desc_en: 'Learn alongside a small, focused cohort — not an anonymous mass enrollment. Real accountability.',
    desc_id: 'Belajar bersama cohort kecil yang fokus — bukan pendaftaran massal tanpa nama. Akuntabilitas nyata.',
    gradient: 'from-indigo-500 to-blue-600',
  },
]

const FUTURE_FEATURES = [
  {
    icon: Sparkles,
    title_en: 'AI Learning Assistant',
    title_id: 'Asisten Belajar AI',
    desc_en: 'Ask questions about any session content, get personalized explanations, and generate practice questions on demand.',
    desc_id: 'Tanyakan apa saja tentang materi sesi, dapatkan penjelasan personal, dan buat soal latihan sesuai permintaan.',
  },
  {
    icon: BarChart3,
    title_en: 'Progress Analytics',
    title_id: 'Analitik Progres',
    desc_en: 'Track your attendance, exercise scores, session engagement, and skill growth over the full program.',
    desc_id: 'Pantau kehadiran, skor latihan, keterlibatan di sesi, dan pertumbuhan skillmu sepanjang program.',
  },
  {
    icon: Smartphone,
    title_en: 'Mobile App',
    title_id: 'Aplikasi Mobile',
    desc_en: 'Learn on the go. Access materials, watch recordings, and complete exercises from your phone.',
    desc_id: 'Belajar di mana saja. Akses materi, tonton rekaman, dan kerjakan latihan dari ponselmu.',
  },
  {
    icon: Globe2,
    title_en: 'LinkedIn Certificate Sharing',
    title_id: 'Bagikan Sertifikat ke LinkedIn',
    desc_en: 'One-click share your BNSP certification and program badges directly to your LinkedIn profile.',
    desc_id: 'Satu klik untuk bagikan sertifikasi BNSP dan badge program-mu langsung ke profil LinkedIn.',
  },
  {
    icon: Star,
    title_en: 'Mentor 1:1 Booking',
    title_id: 'Booking Sesi 1:1 dengan Mentor',
    desc_en: 'Book private sessions with your program mentor for personalized career guidance and code review.',
    desc_id: 'Jadwalkan sesi privat dengan mentor program untuk panduan karir personal dan review kode.',
  },
]

const STATS = [
  { value: '11', label_en: 'Live Sessions', label_id: 'Sesi Live' },
  { value: '3', label_en: 'Weeks', label_id: 'Pekan' },
  { value: '40+', label_en: 'Exercises', label_id: 'Latihan' },
  { value: 'BNSP', label_en: 'Certified', label_id: 'Bersertifikat' },
]

// ── Component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const { i18n } = useTranslation(['common', 'curriculum'])
  const navigate = useNavigate()
  const lang = i18n.language === 'id' ? 'id' : 'en'
  const [activeProg, setActiveProg] = useState(0)
  const prog = VISIBLE_PROGRAMS[activeProg]

  const s = <T extends string>(en: T, id: T) => lang === 'id' ? id : en

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
              <Zap size={12} className="mr-1" /> {s('Talentiv Learning — Live & Self Learning', 'Platform Belajar — Live & Mandiri')}
            </Badge>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              {lang === 'id' ? (
                <>Satu platform untuk{' '}<span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">kelas live</span>{' '}dan{' '}<span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">belajar mandiri</span></>
              ) : (
                <>One platform for{' '}<span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">live classes</span>{' '}and{' '}<span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">self learning</span></>
              )}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {s(
                'Join live sessions with expert mentors, rewatch recordings anytime, practice in interactive playgrounds, and track your growth — all in one place.',
                'Ikuti sesi live bersama mentor ahli, tonton rekaman kapan saja, latihan di playground interaktif, dan pantau perkembanganmu — semuanya dalam satu tempat.'
              )}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto">
                <Play size={18} />
                {s('Start Learning Free', 'Mulai Belajar Gratis')}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/curriculum')}
                className="w-full sm:w-auto border-white/25 text-white hover:bg-white/10">
                {s('Explore Programs', 'Jelajahi Program')}
                <ArrowRight size={18} />
              </Button>
            </div>

            {/* Stats strip */}
            <div className="mt-14 grid grid-cols-4 gap-3 max-w-xl mx-auto">
              {STATS.map((stat) => (
                <div key={stat.label_en} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{lang === 'id' ? stat.label_id : stat.label_en}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Program switcher + preview */}
          <div className="mt-14">
            {VISIBLE_PROGRAMS.length > 1 && (
              <div className="flex justify-center gap-3 flex-wrap mb-5">
                {VISIBLE_PROGRAMS.map((p, i) => (
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
            )}

            <div className="max-w-3xl mx-auto bg-white/8 backdrop-blur border border-white/12 rounded-2xl p-6">
              <div className="flex items-start gap-4 flex-wrap">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prog.gradient} flex items-center justify-center text-2xl shrink-0`}>
                  {prog.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="primary" size="sm">{prog.badge}</Badge>
                    <Badge variant="gray" size="sm">{s('BNSP Certified', 'Bersertifikat BNSP')}</Badge>
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
                {prog.stats.map((stat) => (
                  <div key={stat.label_en} className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{lang === 'id' ? stat.label_id : stat.label_en}</div>
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
            <Badge variant="primary" size="md">{s('How It Works', 'Cara Kerjanya')}</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              {s('Your complete learning journey in 6 steps', 'Perjalanan belajar lengkapmu dalam 6 langkah')}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {s(
                'From scheduling to certification — every part of the learning cycle is managed inside Talentiv Learning.',
                'Dari penjadwalan hingga sertifikasi — setiap bagian siklus belajar dikelola di dalam Talentiv Learning.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LIFECYCLE_STEPS.map(({ step, icon: Icon, color, bg, border, title_en, title_id, desc_en, desc_id, tag_en, tag_id, tagVariant }) => (
              <div key={step}
                className={`relative bg-white rounded-2xl border ${border} p-6 hover:shadow-md transition-shadow`}>
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-gray-300">{step}</span>
                  <h3 className="font-semibold text-gray-900">{lang === 'id' ? title_id : title_en}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{lang === 'id' ? desc_id : desc_en}</p>
                <div className="mt-4">
                  <Badge variant={tagVariant} size="sm">{lang === 'id' ? tag_id : tag_en}</Badge>
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
            <Badge variant="success" size="md">{s('Available Now', 'Tersedia Sekarang')}</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              {s('Everything you need, already here', 'Semua yang kamu butuhkan, sudah ada di sini')}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {s(
                "Talentiv Learning isn't just a video platform. It's a complete learning environment built around live instruction.",
                'Talentiv Learning bukan sekadar platform video. Ini adalah lingkungan belajar lengkap yang dibangun di sekitar instruksi live.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CURRENT_FEATURES.map(({ icon: Icon, title_en, title_id, desc_en, desc_id, gradient }) => (
              <div key={title_en} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{lang === 'id' ? title_id : title_en}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{lang === 'id' ? desc_id : desc_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live vs. Self-Learning split ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="primary" size="md">{s('The Hybrid Advantage', 'Keunggulan Hybrid')}</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              {s('Live guidance + always-on access', 'Bimbingan live + akses kapan saja')}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {s(
                'Most platforms give you one or the other. Talentiv Learning combines both — scheduled live sessions and on-demand self-study in a single workspace.',
                'Kebanyakan platform hanya menawarkan satu. Talentiv Learning menggabungkan keduanya — sesi live terjadwal dan belajar mandiri on-demand dalam satu ruang kerja.'
              )}
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
                    <h3 className="font-bold text-xl">{s('Expert-led sessions', 'Sesi dipandu pakar')}</h3>
                  </div>
                </div>
                <p className="text-sm opacity-85 leading-relaxed">
                  {s(
                    'Weekly live classes with screen-sharing, real-time Q&A, and interactive exercises. Your mentor guides you through real-world problems — not just theory.',
                    'Kelas live mingguan dengan screen-sharing, tanya jawab real-time, dan latihan interaktif. Mentormu membimbingmu melalui masalah nyata — bukan sekadar teori.'
                  )}
                </p>
              </div>
              <div className="bg-primary-50 p-6 space-y-3">
                {[
                  {
                    icon: '📅',
                    text_en: 'Scheduled sessions visible in cohort calendar',
                    text_id: 'Jadwal sesi terlihat di kalender cohort',
                  },
                  {
                    icon: '🔗',
                    text_en: 'One-click Zoom link directly from the platform',
                    text_id: 'Tautan Zoom satu klik langsung dari platform',
                  },
                  {
                    icon: '🎤',
                    text_en: 'Live Q&A, polls, and collaborative exercises',
                    text_id: 'Tanya jawab live, polling, dan latihan kolaboratif',
                  },
                  {
                    icon: '👥',
                    text_en: "Small cohort — your mentor knows your name",
                    text_id: 'Cohort kecil — mentormu tahu namamu',
                  },
                  {
                    icon: '🔔',
                    text_en: "Session reminders so you never miss a class",
                    text_id: 'Pengingat sesi agar kamu tidak pernah ketinggalan kelas',
                  },
                ].map(({ icon, text_en, text_id }) => (
                  <div key={text_en} className="flex items-start gap-3">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm text-gray-700 leading-snug">{lang === 'id' ? text_id : text_en}</span>
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
                    <div className="text-xs font-semibold opacity-70 uppercase tracking-wider">{s('Self Learning', 'Belajar Mandiri')}</div>
                    <h3 className="font-bold text-xl">{s('Study at your pace', 'Belajar sesuai ritmu')}</h3>
                  </div>
                </div>
                <p className="text-sm opacity-85 leading-relaxed">
                  {s(
                    'Every session unlocks structured materials, exercises, and tools. Rewatch recordings, re-read content, and practice until concepts click — on your schedule.',
                    'Setiap sesi membuka materi terstruktur, latihan, dan tools. Tonton rekaman, baca ulang konten, dan berlatih sampai paham — sesuai jadwalmu.'
                  )}
                </p>
              </div>
              <div className="bg-violet-50 p-6 space-y-3">
                {[
                  {
                    icon: '📖',
                    text_en: 'Bilingual (EN/ID) written materials per session',
                    text_id: 'Materi tertulis bilingual (EN/ID) per sesi',
                  },
                  {
                    icon: '🎥',
                    text_en: 'Permanent session recording — rewatch anytime',
                    text_id: 'Rekaman sesi permanen — tonton ulang kapan saja',
                  },
                  {
                    icon: '💻',
                    text_en: 'In-browser SQL, Python & HR tool practice',
                    text_id: 'Latihan SQL, Python & HR langsung di browser',
                  },
                  {
                    icon: '✏️',
                    text_en: 'Exercises with guided feedback',
                    text_id: 'Latihan dengan panduan feedback',
                  },
                  {
                    icon: '📋',
                    text_en: "Post-session survey to track your progress",
                    text_id: 'Survei pasca-sesi untuk memantau progresmu',
                  },
                ].map(({ icon, text_en, text_id }) => (
                  <div key={text_en} className="flex items-start gap-3">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm text-gray-700 leading-snug">{lang === 'id' ? text_id : text_en}</span>
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
            <Badge variant="gray" size="md">{s('Program', 'Program')}</Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              {s('Our flagship program', 'Program unggulan kami')}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {s(
                'A structured program with live sessions, structured materials, hands-on practice, and BNSP certification.',
                'Program terstruktur dengan sesi live, materi terstruktur, latihan langsung, dan sertifikasi BNSP.'
              )}
            </p>
          </div>

          <div className={`grid gap-8 ${VISIBLE_PROGRAMS.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-xl mx-auto'}`}>
            {VISIBLE_PROGRAMS.map((p) => {
              const modules = lang === 'id' && 'modules_id' in p ? p.modules_id! : p.modules ?? (p as { modules_en?: string[] }).modules_en ?? []
              return (
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
                      {p.stats.map((stat) => (
                        <div key={stat.label_en} className="bg-white/15 rounded-xl p-2.5 text-center">
                          <div className="text-lg font-bold">{stat.value}</div>
                          <div className="text-xs opacity-70">{lang === 'id' ? stat.label_id : stat.label_en}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`${p.lightBg} p-6`}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      {s('Modules', 'Modul')}
                    </p>
                    <div className="space-y-2 mb-5">
                      {modules.map(label => (
                        <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={15} className={p.accentText} />
                          {label}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      {s('Tools & Skills', 'Tools & Skill')}
                    </p>
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
                      {s('Enroll Now', 'Daftar Sekarang')} <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Demo UI mockup ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="primary" size="md">{s('Inside the Platform', 'Di Dalam Platform')}</Badge>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 leading-snug">
                {lang === 'id' ? (
                  <>Seluruh perjalanan belajarmu,<br /><span className="text-primary-600">dalam satu dashboard</span></>
                ) : (
                  <>Your whole learning life,<br /><span className="text-primary-600">in one dashboard</span></>
                )}
              </h2>
              <p className="mt-4 text-gray-500 leading-relaxed">
                {s(
                  'No more switching between email, Zoom, Google Drive, and Notion. Talentiv Learning puts your schedule, Zoom links, recordings, materials, exercises, and survey forms in a single interface your cohort shares together.',
                  'Tidak perlu lagi berpindah antara email, Zoom, Google Drive, dan Notion. Talentiv Learning menyatukan jadwal, tautan Zoom, rekaman, materi, latihan, dan formulir survei dalam satu antarmuka yang digunakan cohort-mu bersama.'
                )}
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  {
                    icon: Calendar,
                    text_en: 'Upcoming session dates and Zoom links at a glance',
                    text_id: 'Tanggal sesi mendatang dan tautan Zoom dalam sekali lihat',
                  },
                  {
                    icon: Video,
                    text_en: 'Past recording library, searchable by session topic',
                    text_id: 'Perpustakaan rekaman lama, bisa dicari berdasarkan topik sesi',
                  },
                  {
                    icon: Gamepad2,
                    text_en: 'Playground pre-loaded with session datasets',
                    text_id: 'Playground sudah berisi dataset sesi',
                  },
                  {
                    icon: ClipboardList,
                    text_en: 'Post-session survey linked directly from each class',
                    text_id: 'Survei pasca-sesi tertaut langsung dari setiap kelas',
                  },
                  {
                    icon: Clock,
                    text_en: 'Scheduled unlock keeps cohort learning in sync',
                    text_id: 'Pembukaan terjadwal menjaga cohort belajar bersama',
                  },
                ].map(({ icon: Icon, text_en, text_id }) => (
                  <li key={text_en} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                      <Icon size={13} className="text-primary-600" />
                    </div>
                    <span className="text-gray-600 text-sm leading-snug">{lang === 'id' ? text_id : text_en}</span>
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
                    <div className="text-xs text-gray-400">
                      {s('4 active learners online', '4 peserta aktif sedang online')}
                    </div>
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
            {s('Tools & technologies across all programs', 'Tools & teknologi di semua program')}
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
              <Sparkles size={12} className="mr-1" /> {s('Coming Soon', 'Segera Hadir')}
            </Badge>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
              {s("What's on the roadmap", 'Apa yang sedang dikembangkan')}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {s(
                "We're continuously building. Here's what's coming to make your learning experience even richer.",
                'Kami terus berkembang. Ini yang akan hadir untuk memperkaya pengalaman belajarmu.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FUTURE_FEATURES.map(({ icon: Icon, title_en, title_id, desc_en, desc_id }) => (
              <div key={title_en}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 border-dashed p-6 hover:border-primary-200 transition-colors group">
                <div className="w-11 h-11 bg-gray-100 group-hover:bg-primary-50 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Icon size={20} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{lang === 'id' ? title_id : title_en}</h3>
                  <Badge variant="warning" size="sm">{s('Soon', 'Segera')}</Badge>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{lang === 'id' ? desc_id : desc_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof placeholder ──────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {s("Learners from Indonesia's top companies", 'Peserta dari perusahaan-perusahaan terkemuka Indonesia')}
            </h2>
            <p className="mt-3 text-gray-500">
              {s(
                'Our graduates work at leading companies across data and HR — earning BNSP-recognized certifications.',
                'Alumni kami bekerja di perusahaan terkemuka di bidang data dan HR — meraih sertifikasi yang diakui BNSP.'
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                quote_en: 'The live sessions are exactly what I needed — real examples, real Q&A. The playground made SQL click for me.',
                quote_id: 'Sesi live persis yang saya butuhkan — contoh nyata, tanya jawab langsung. Playground membuat SQL jadi mudah dipahami.',
                name: 'Cohort Batch 1 · Data Analyst Track',
              },
              {
                quote_en: 'I could rewatch recordings when I missed a session. Having exercises right after class made all the difference.',
                quote_id: 'Saya bisa menonton ulang rekaman saat ketinggalan sesi. Latihan langsung setelah kelas sangat membantu.',
                name: 'Cohort Batch 1 · Data Analyst Track',
              },
              {
                quote_en: 'The mix of live instruction and self-paced materials fits perfectly around my work schedule.',
                quote_id: 'Kombinasi instruksi live dan materi mandiri sangat cocok dengan jadwal kerja saya.',
                name: 'Cohort Batch 1 · Data Analyst Fast Track',
              },
            ].map(({ quote_en, quote_id, name }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic mb-4">"{lang === 'id' ? quote_id : quote_en}"</p>
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
            <Zap size={12} className="mr-1" /> Talentiv Learning
          </Badge>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold leading-tight">
            {lang === 'id' ? (
              <>Siap belajar live<br /><span className="text-primary-400">sesuai caramu?</span></>
            ) : (
              <>Ready to learn live<br /><span className="text-primary-400">and on your own terms?</span></>
            )}
          </h2>
          <p className="mt-5 text-gray-300 leading-relaxed max-w-lg mx-auto">
            {s(
              'Join a cohort, get instant access to materials and playgrounds, join live sessions with your mentor, and earn a BNSP-recognized certification — all in one place.',
              'Bergabunglah dengan cohort, dapatkan akses langsung ke materi dan playground, ikuti sesi live bersama mentor, dan raih sertifikasi yang diakui BNSP — semuanya dalam satu tempat.'
            )}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="w-full sm:w-auto">
              {s('Create free account', 'Buat akun gratis')} <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/curriculum')}
              className="w-full sm:w-auto border-white/25 text-white hover:bg-white/10">
              {s('Browse curriculum', 'Jelajahi kurikulum')} <ChevronRight size={18} />
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            {s('No credit card required · Free to explore', 'Tanpa kartu kredit · Gratis untuk dijelajahi')}
          </p>
        </div>
      </section>

    </div>
  )
}
