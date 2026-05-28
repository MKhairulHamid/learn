import { useEffect, useState } from 'react'
import {
  ChevronLeft, ChevronRight, Zap, FileText, BookOpen, AlertTriangle,
  BarChart3, Users, GraduationCap, CheckCircle2, Star, Target,
  MessageSquare, TrendingUp, Layers, CalendarDays, ShieldCheck,
  Activity, XCircle, ArrowRight, Database, ShieldAlert,
  LayoutDashboard, Lock,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   Pitch deck — tidak muncul di navigasi. Akses via URL: #/pitch
───────────────────────────────────────────────────────────────────────────── */

const TOTAL = 12

function Glow({ className }: { className: string }) {
  return <div className={`absolute pointer-events-none rounded-full blur-[130px] ${className}`} />
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 sm:px-10 lg:px-16 py-6 sm:py-16 pb-20 sm:pb-16 relative overflow-hidden">
      {children}
    </div>
  )
}

function Tag({ color, label }: { color: string; label: string }) {
  return (
    <p className={`${color} text-xs font-semibold uppercase tracking-widest mb-3 text-center`}>
      {label}
    </p>
  )
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-gray-300">
      <CheckCircle2 size={14} className="text-primary-400 mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  )
}

// ── Slide 01 ──────────────────────────────────────────────────────────────────

function Slide01() {
  return (
    <Shell>
      <Glow className="top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary-600/12" />
      <Glow className="bottom-0 right-0 w-[500px] h-[400px] bg-violet-600/8" />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2.5 mb-10 border border-white/10 bg-white/[0.04] rounded-full px-5 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-200">Learning Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          Satu sistem untuk semua<br />
          <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-300 bg-clip-text text-transparent">
            yang perlu dikelola.
          </span>
        </h1>
        <p className="mt-5 sm:mt-8 text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Manajemen batch, kurikulum, feedback peserta, dan analytics —
          semuanya terhubung dalam satu platform.
        </p>
        <div className="mt-6 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
          {[
            { dot: 'bg-green-400', label: 'Sudah berjalan' },
            { dot: 'bg-primary-400', label: 'Dirancang untuk live cohort' },
            { dot: 'bg-cyan-400', label: 'Multi-program · Role-based' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 02 ──────────────────────────────────────────────────────────────────

function Slide02() {
  return (
    <Shell>
      <Glow className="top-0 left-1/4 w-[500px] h-[300px] bg-amber-600/8" />
      <Glow className="bottom-0 right-1/4 w-[500px] h-[300px] bg-red-600/8" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-primary-400" label="Dua hambatan yang paling sering muncul" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-14">
          Yang membuat program edukasi<br />
          <span className="text-gray-400">sulit dikelola dengan baik.</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-7">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold mb-1">Feedback pasca-sesi</div>
                <h3 className="text-lg font-bold">Google Form tidak cukup untuk memonitor kualitas program</h3>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                'Respons tersebar di spreadsheet, tidak pernah benar-benar dianalisis',
                'Tidak ada breakdown per mentor atau per sesi',
                'Tidak tahu apakah kualitas program meningkat atau menurun dari batch ke batch',
                'Peserta mengisi sekali, sisanya tidak ada tindak lanjut',
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <XCircle size={14} className="text-amber-500/70 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-7">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
                <BookOpen size={20} className="text-red-400" />
              </div>
              <div>
                <div className="text-[10px] text-red-400 uppercase tracking-widest font-semibold mb-1">Manajemen kurikulum</div>
                <h3 className="text-lg font-bold">Kurikulum di Google Docs sulit dijaga tetap relevan</h3>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                'Materi tersebar di berbagai file, tidak ada learning path yang terstruktur',
                'Memperbarui satu konten harus melalui koordinasi panjang via WA terlebih dahulu',
                'Tidak tahu modul mana yang paling sering membuat peserta berhenti',
                'Peserta menemukan konten yang salah, tapi tidak ada cara untuk melapor',
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <XCircle size={14} className="text-red-500/70 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 03 ──────────────────────────────────────────────────────────────────

function Slide03() {
  return (
    <Shell>
      <Glow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary-700/10" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-primary-400" label="Akar masalahnya" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
          Google Form, Docs, dan spreadsheet<br />
          <span className="text-gray-400">punya fungsinya masing-masing.</span>
        </h2>
        <p className="text-center text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          Ketiganya memang tidak dirancang untuk menjalankan program edukasi.
          Yang perlu ada adalah satu platform yang dirancang khusus untuk itu.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: <FileText size={18} />,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20',
              title: 'Feedback',
              desc: 'Google Form — untuk survei umum, tidak untuk memonitor kualitas program',
            },
            {
              icon: <BookOpen size={18} />,
              color: 'text-red-400',
              bg: 'bg-red-500/10 border-red-500/20',
              title: 'Kurikulum',
              desc: 'Google Docs — untuk dokumen, tidak untuk mengelola learning path',
            },
            {
              icon: <CalendarDays size={18} />,
              color: 'text-orange-400',
              bg: 'bg-orange-500/10 border-orange-500/20',
              title: 'Operasional',
              desc: 'Spreadsheet + WA — untuk data umum, tidak untuk manajemen batch',
            },
          ].map(item => (
            <div key={item.title} className={`rounded-2xl border ${item.bg} p-5`}>
              <div className={`${item.color} mb-3`}>{item.icon}</div>
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-primary-600/15 via-primary-500/10 to-cyan-600/15 border border-primary-500/20 p-7 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Yang dibutuhkan adalah platform yang memang{' '}
            <span className="text-primary-400">dirancang untuk ini.</span>
          </h3>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm">
            Infrastruktur yang dibangun dari awal, khusus untuk kebutuhan program edukasi — bukan workaround dari tools yang sudah ada.
          </p>
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 04 ──────────────────────────────────────────────────────────────────

function Slide04() {
  return (
    <Shell>
      <Glow className="top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/10" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-primary-400" label="Platformnya" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
          Tiga hal yang platform ini selesaikan.
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-lg mb-6 sm:mb-14 max-w-2xl mx-auto">
          Dari pendaftaran peserta sampai laporan akhir — semuanya ada.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              gradient: 'from-primary-600 to-cyan-500',
              icon: <Layers size={22} />,
              title: 'Operasional',
              subtitle: 'Semua urusan ops',
              points: [
                'Buat dan jadwalkan batch',
                'Kalender sesi dengan link Zoom',
                'Approval pendaftaran peserta',
                'Penugasan mentor per sesi',
                'Manajemen masa akses peserta',
              ],
            },
            {
              gradient: 'from-violet-600 to-purple-500',
              icon: <GraduationCap size={22} />,
              title: 'Pengalaman Belajar',
              subtitle: 'Dirancang untuk engagement',
              points: [
                'Kurikulum terstruktur: fase → sesi',
                'Latihan dengan auto-grading',
                'Tools praktik langsung di browser',
                'Diskusi Q&A dengan notifikasi mentor',
                'Konten dwibahasa (Indonesia & Inggris)',
              ],
            },
            {
              gradient: 'from-emerald-600 to-teal-500',
              icon: <BarChart3 size={22} />,
              title: 'Quality Loop',
              subtitle: 'Tahu apa yang berhasil',
              points: [
                'Feedback pasca-sesi sudah built-in',
                'Skor performa mentor per dimensi',
                'Analytics latihan dan tingkat kesulitan',
                'Laporan konten langsung dari peserta',
                'Dashboard penyelesaian real-time',
              ],
            },
          ].map(pillar => (
            <div key={pillar.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center text-white mb-4`}>
                {pillar.icon}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{pillar.subtitle}</div>
              <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
              <ul className="space-y-2">
                {pillar.points.map((p, i) => <Check key={i}>{p}</Check>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 05 ──────────────────────────────────────────────────────────────────

function Slide05() {
  return (
    <Shell>
      <Glow className="top-0 right-0 w-[600px] h-[400px] bg-emerald-600/8" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-emerald-400" label="Fitur: Feedback" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
          Feedback yang terukur<br />
          <span className="text-gray-400">setelah setiap sesi.</span>
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mb-5 sm:mb-12 max-w-2xl mx-auto">
          Terbuka otomatis, dinilai dari 6 dimensi, dan terangkum per mentor —
          tanpa harus dikirim manual.
        </p>
        <div className="grid sm:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5">
              <XCircle size={13} className="text-red-400" /> Dengan Google Form
            </div>
            {[
              'Kirim link form secara manual setelah setiap sesi',
              'Respons tersebar, tidak ada yang menganalisis',
              'Tidak ada breakdown per sesi atau per mentor',
              'Tidak ada tren kualitas dari batch ke batch',
              'Completion rate rendah karena tidak ada reminder',
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-3 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 shrink-0" />
                {p}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-5">
              <CheckCircle2 size={13} /> Dengan platform ini
            </div>
            <ul className="space-y-3 mb-5">
              {[
                'Terbuka otomatis setelah setiap sesi — tidak perlu kirim manual',
                '6 dimensi penilaian: kualitas materi, kejelasan mentor, engagement, manajemen kelas, dan lainnya',
                'Dashboard performa mentor dengan skor agregat per program',
                'Tren kualitas lintas batch — terlihat jelas naik atau turunnya',
                'Feedback window dikendalikan penuh oleh tim ops',
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-200">
                  <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-300 font-medium">
              Setiap sesi dinilai. Setiap mentor terukur. Otomatis.
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 06 ──────────────────────────────────────────────────────────────────

function Slide06() {
  return (
    <Shell>
      <Glow className="top-0 left-0 w-[600px] h-[400px] bg-violet-600/8" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-violet-400" label="Fitur: Kurikulum" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
          Kurikulum yang mudah diperbarui<br />
          <span className="text-gray-400">dan mudah diikuti.</span>
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mb-5 sm:mb-12 max-w-2xl mx-auto">
          Dari struktur pembelajaran sampai update konten — semua ada sistemnya.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Layers size={16} className="text-violet-400" />
                </div>
                <h3 className="font-semibold text-white">Struktur yang jelas</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Program → Fase → Sesi → Latihan. Peserta tahu posisi mereka dan tahu harus melakukan apa selanjutnya — tanpa harus bertanya.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                {['Program', 'Fase', 'Sesi', 'Latihan'].map((s, i, arr) => (
                  <>
                    <span key={s} className="bg-white/[0.05] border border-white/[0.08] rounded px-2 py-1">{s}</span>
                    {i < arr.length - 1 && <ArrowRight key={`a${i}`} size={11} className="text-gray-600" />}
                  </>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary-500/15 border border-primary-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-primary-400" />
                </div>
                <h3 className="font-semibold text-white">Update langsung, tanpa koordinasi</h3>
              </div>
              <p className="text-sm text-gray-400">
                Mentor dan admin bisa langsung mengedit konten dari platform. Tidak perlu mengirim file atau koordinasi via WA terlebih dahulu.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <BarChart3 size={16} className="text-amber-400" />
                </div>
                <h3 className="font-semibold text-white">Tahu mana yang perlu diperbaiki</h3>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Analytics latihan menunjukkan pass rate dan tingkat kesulitan per modul. Tahu mana yang harus direvisi sebelum peserta menyerah.
              </p>
              <div className="space-y-2">
                {[
                  { label: 'SQL Window Functions', rate: 42, color: 'bg-red-500' },
                  { label: 'Python Pandas Dasar', rate: 71, color: 'bg-amber-500' },
                  { label: 'Latihan VLOOKUP', rate: 88, color: 'bg-emerald-500' },
                ].map(ex => (
                  <div key={ex.label} className="flex items-center gap-2.5">
                    <span className="text-[10px] text-gray-500 w-36 truncate">{ex.label}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className={`h-full ${ex.color} rounded-full`} style={{ width: `${ex.rate}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 w-7 text-right">{ex.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-red-400" />
                </div>
                <h3 className="font-semibold text-white">Peserta bisa lapor langsung</h3>
              </div>
              <p className="text-sm text-gray-400">
                Konten yang salah atau sudah tidak relevan bisa dilaporkan langsung oleh peserta. Tim ops tinggal review dan selesaikan dari satu dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 07 ──────────────────────────────────────────────────────────────────

function Slide07() {
  return (
    <Shell>
      <Glow className="bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/8" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-primary-400" label="Fitur: Operasional" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
          Semua operasional batch<br />
          <span className="text-gray-400">dari satu dashboard.</span>
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mb-5 sm:mb-12 max-w-2xl mx-auto">
          Jadwal, pendaftaran, dan monitoring peserta — tidak perlu lagi spreadsheet dan grup WA yang terpencar.
        </p>
        <div className="grid sm:grid-cols-3 gap-5 mb-5">
          {[
            {
              icon: <CalendarDays size={19} />,
              color: 'from-primary-600 to-cyan-500',
              title: 'Jadwal Sesi',
              points: [
                'Set tanggal sesi per batch',
                'Link Zoom tersimpan di tiap sesi',
                'Recording tertaut otomatis setelah kelas',
                'Unlock akses otomatis atau manual',
              ],
            },
            {
              icon: <Users size={19} />,
              color: 'from-violet-600 to-purple-500',
              title: 'Pendaftaran Peserta',
              points: [
                'Peserta mendaftar, tim ops approve',
                'Tracking status: pending → aktif',
                'Atur durasi akses per batch',
                'Perpanjang atau cabut akses kapan saja',
              ],
            },
            {
              icon: <Activity size={19} />,
              color: 'from-emerald-600 to-teal-500',
              title: 'Pantau Secara Real-time',
              points: [
                'Live activity feed seluruh peserta',
                'Progress dan riwayat latihan per orang',
                'Completion rate per program',
                'Penugasan mentor per sesi',
              ],
            },
          ].map(card => (
            <div key={card.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-white mb-3">{card.title}</h3>
              <ul className="space-y-2">
                {card.points.map((p, i) => <Check key={i}>{p}</Check>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] px-6 py-4 flex items-center gap-4">
          <ShieldAlert size={20} className="text-primary-400 shrink-0" />
          <p className="text-sm text-gray-300">
            <span className="text-white font-medium">Role-based access:</span>{' '}
            Peserta, Mentor, Program Manager, dan Admin masing-masing punya akses yang sesuai perannya. Tidak lebih, tidak kurang.
          </p>
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 08 ──────────────────────────────────────────────────────────────────

function Slide08() {
  return (
    <Shell>
      <Glow className="top-0 right-0 w-[600px] h-[400px] bg-cyan-600/8" />
      <Glow className="bottom-0 left-0 w-[400px] h-[300px] bg-violet-600/6" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-cyan-400" label="Fitur: Pengalaman Peserta" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4">
          Peserta yang tahu<br />
          <span className="text-gray-400">ke mana harus melangkah.</span>
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mb-5 sm:mb-12 max-w-2xl mx-auto">
          Fitur yang mendorong peserta untuk terus aktif dan menyelesaikan program.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: <Database size={18} />,
              color: 'from-primary-600 to-cyan-500',
              title: 'Praktik langsung di browser',
              desc: 'SQL, Python, dan kalkulator HR — semuanya berjalan di browser. Peserta langsung praktik dari hari pertama tanpa perlu install apa-apa.',
            },
            {
              icon: <CheckCircle2 size={18} />,
              color: 'from-violet-600 to-purple-500',
              title: 'Feedback latihan instan',
              desc: 'Setiap latihan dinilai otomatis. Peserta langsung tahu hasilnya. Tim tidak perlu mengoreksi satu per satu.',
            },
            {
              icon: <MessageSquare size={18} />,
              color: 'from-emerald-600 to-teal-500',
              title: 'Diskusi per sesi',
              desc: 'Tanya jawab di setiap sesi, lengkap dengan notifikasi untuk mentor. Pertanyaan tidak hilang di chat group.',
            },
            {
              icon: <TrendingUp size={18} />,
              color: 'from-amber-500 to-orange-500',
              title: 'Progress yang terlihat',
              desc: 'Peserta bisa melihat progres per fase. Tahu persis sudah sampai mana dan harus melakukan apa selanjutnya.',
            },
          ].map(card => (
            <div key={card.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{card.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { v: '40+', label: 'Latihan dengan grading otomatis', color: 'text-primary-400' },
            { v: '3', label: 'Tools interaktif — SQL, Python, HR', color: 'text-cyan-400' },
            { v: 'BNSP', label: 'Jalur sertifikasi nasional terintegrasi', color: 'text-violet-400' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.v}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

// ── Slide 09 ──────────────────────────────────────────────────────────────────

function Slide09() {
  return (
    <Shell>
      <Glow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary-600/10" />
      <Glow className="bottom-0 right-0 w-[500px] h-[400px] bg-cyan-600/6" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 mb-10 border border-white/10 bg-white/[0.04] rounded-full px-5 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-200">Learning Platform</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6">
          Platform ini siap.{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-primary-400 bg-clip-text text-transparent">
            Tinggal disesuaikan.
          </span>
        </h2>
        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-14">
          Konfigurasi kurikulum, jadwal, dan tim yang sudah ada —
          platform langsung bisa dipakai.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: <Star size={16} />,
              title: 'Siap digunakan',
              desc: 'Program live dengan batch, latihan, dan analytics yang sudah berjalan.',
            },
            {
              icon: <Target size={16} />,
              title: 'Menyesuaikan kebutuhan',
              desc: 'Program, sesi, dan mentor disesuaikan. Platform mengikuti kurikulum yang sudah ada, bukan sebaliknya.',
            },
            {
              icon: <TrendingUp size={16} />,
              title: 'Tumbuh seiring bisnis',
              desc: 'Tambah program, batch, dan peserta kapan saja. Tidak ada hambatan teknis ketika bisnis berkembang.',
            },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-primary-400 mb-2">
                {item.icon}
                <span className="font-semibold text-white text-sm">{item.title}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

// ── shared browser chrome wrapper ─────────────────────────────────────────────

function BrowserFrame({ url, badge, children }: { url: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60">
      <div className="bg-[#1c1c1e] border-b border-white/[0.06] px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex-1 bg-[#2c2c2e] rounded-md px-3 py-0.5 text-[11px] text-gray-500 font-mono">{url}</div>
        {badge && <div className="text-[10px] text-gray-500 border border-white/[0.06] rounded px-2 py-0.5 shrink-0">{badge}</div>}
      </div>
      {children}
    </div>
  )
}

// ── Slide 10 — UI: Learner Dashboard ─────────────────────────────────────────

function Slide10() {
  return (
    <Shell>
      <Glow className="top-0 right-1/4 w-[600px] h-[300px] bg-primary-600/8" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-primary-400" label="Tampilan Platform — Peserta" />
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
          Dashboard peserta — progress terlihat jelas.
        </h2>
        <BrowserFrame url="app.learningplatform.id/dashboard">
          {/* Light-theme app UI — exact same classes as Dashboard.tsx */}
          <div className="bg-gray-50 px-5 py-4 space-y-4">
            {/* Header */}
            <div>
              <p className="text-xs text-gray-500">Selamat pagi,</p>
              <h1 className="text-lg font-bold text-gray-900">Arif Santoso 👋</h1>
            </div>
            {/* My Programs label */}
            <p className="text-sm font-semibold text-gray-800">Program Saya</p>
            {/* Enrolled card — exact pattern from EnrolledCard */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-xl shrink-0">📊</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">Data Analyst Program</span>
                    <span className="inline-flex items-center rounded-full font-medium px-2.5 py-0.5 text-xs bg-green-100 text-green-700">Aktif</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Batch 4 · 2025</p>
                </div>
              </div>
              {/* ProgressBar — exact same as ProgressBar.tsx */}
              <div className="mt-3 w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Phase 3 — Python & Pandas</span>
                  <span className="text-sm font-medium text-gray-700">17/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full overflow-hidden h-2.5">
                  <div className="bg-primary-600 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              {/* Continue learning button — bg-primary-50 pattern */}
              <div className="mt-3 w-full flex items-center justify-between bg-primary-50 rounded-xl px-4 py-2.5 text-sm">
                <span className="font-medium text-primary-800">Lanjutkan: Sesi 18 · SQL Window Functions</span>
                <ArrowRight size={15} className="text-primary-600 shrink-0" />
              </div>
              {/* Recent activity */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Aktivitas Terakhir</p>
                <div className="space-y-1.5">
                  {[
                    { title: 'Sesi 17 · Pandas GroupBy & Aggregation', date: '22 Mei 2025' },
                    { title: 'Sesi 16 · Pandas DataFrame Dasar', date: '15 Mei 2025' },
                  ].map(r => (
                    <div key={r.title} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      <span className="text-xs text-gray-700 truncate flex-1">{r.title}</span>
                      <span className="text-xs text-gray-400 shrink-0">{r.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </Shell>
  )
}

// ── Slide 11 — UI: Session Page ────────────────────────────────────────────────

function Slide11() {
  return (
    <Shell>
      <Glow className="top-0 left-1/4 w-[600px] h-[300px] bg-violet-600/6" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-violet-400" label="Tampilan Platform — Halaman Sesi" />
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
          Konten, latihan, dan diskusi — dalam satu halaman.
        </h2>
        <BrowserFrame url="app.learningplatform.id/session/sql-window-functions">
          <div className="bg-gray-50 flex divide-x divide-gray-100">
            {/* Sidebar — exact pattern from SessionSidebar */}
            <aside className="w-44 shrink-0 bg-white">
              <div className="p-3 border-b border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Data Analyst Program</p>
              </div>
              <div className="p-2 space-y-0.5">
                {[
                  { phase: 'Phase 1 — SQL Dasar', sessions: ['Sesi 1 · SELECT & WHERE', 'Sesi 2 · JOIN', 'Sesi 3 · Agregasi'], done: [true, true, true] },
                  { phase: 'Phase 2 — SQL Lanjutan', sessions: ['Sesi 4 · Subquery', 'Sesi 5 · Window Functions', 'Sesi 6 · CTE'], done: [true, false, false] },
                ].map(ph => (
                  <div key={ph.phase}>
                    <div className="px-2 py-1.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wider">{ph.phase}</div>
                    {ph.sessions.map((s, i) => (
                      <div
                        key={s}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] ${
                          s.includes('Window') ? 'bg-primary-50 text-primary-700 font-medium' :
                          ph.done[i] ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {ph.done[i]
                          ? <CheckCircle2 size={10} className="text-green-500 shrink-0" />
                          : s.includes('Window')
                            ? <div className="w-2.5 h-2.5 rounded-full border-2 border-primary-500 shrink-0" />
                            : <Lock size={9} className="text-gray-300 shrink-0" />
                        }
                        <span className="truncate">{s.replace(/Sesi \d+ · /, '')}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </aside>
            {/* Main content */}
            <div className="flex-1 min-w-0 p-4 space-y-3">
              {/* Session header card — exact from SessionPage */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full font-medium px-2.5 py-0.5 text-xs bg-primary-100 text-primary-700">Session 05</span>
                      <span className="inline-flex items-center rounded-full font-medium px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600">SKKNI Unit 3.2</span>
                    </div>
                    <h1 className="mt-2 text-base font-bold text-gray-900">SQL Window Functions</h1>
                    <p className="text-xs text-gray-500 mt-1">Memahami RANK, DENSE_RANK, ROW_NUMBER, dan LAG/LEAD untuk analisis data time-series dan ranking.</p>
                  </div>
                  <div className="bg-primary-600 text-white text-xs font-semibold rounded-xl px-3 py-2 shrink-0">Tandai Selesai</div>
                </div>
              </div>
              {/* Content preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Materi Sesi</p>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p className="font-medium text-gray-700">Apa itu Window Function?</p>
                  <p>Window function melakukan perhitungan pada sekumpulan baris yang berhubungan dengan baris saat ini, tanpa mengubah jumlah baris hasil query.</p>
                  <div className="bg-gray-900 rounded-lg p-2.5 font-mono text-[10px] text-gray-300 mt-2">
                    <span className="text-violet-400">SELECT</span> name, salary,<br />
                    {'  '}<span className="text-cyan-400">RANK</span>() <span className="text-violet-400">OVER</span> (<span className="text-violet-400">ORDER BY</span> salary <span className="text-violet-400">DESC</span>) AS rank<br />
                    <span className="text-violet-400">FROM</span> <span className="text-emerald-400">employees</span>;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </Shell>
  )
}

// ── Slide 12 — UI: Admin Dashboard ───────────────────────────────────────────

function Slide12() {
  return (
    <Shell>
      <Glow className="top-0 right-0 w-[600px] h-[300px] bg-emerald-600/6" />
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <Tag color="text-emerald-400" label="Tampilan Platform — Admin Dashboard" />
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
          Semua data program dari satu dashboard.
        </h2>
        <BrowserFrame url="app.learningplatform.id/admin" badge="Admin">
          {/* Dark theme — exact same as AdminDashboard.tsx */}
          <div className="bg-[#0a0e1a]">
            {/* Header + tabs */}
            <div className="border-b border-white/[0.06] bg-[#0d1221]/80 px-4">
              <div className="h-10 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                  <LayoutDashboard size={11} className="text-primary-400" />
                </div>
                <span className="text-xs font-semibold text-white">Admin Dashboard</span>
                <span className="text-[10px] text-gray-500 ml-1">Monitor learner activity and platform health</span>
              </div>
              <div className="flex gap-0.5 -mb-px">
                {[
                  { label: 'Overview', active: true },
                  { label: 'Cohorts', active: false },
                  { label: 'Exercise Analytics', active: false },
                  { label: 'Feedback', active: false },
                  { label: 'Reports', active: false },
                ].map(tab => (
                  <div
                    key={tab.label}
                    className={`px-3 py-2 text-[10px] font-medium border-b-2 ${
                      tab.active
                        ? 'border-primary-500 text-primary-400'
                        : 'border-transparent text-gray-500'
                    }`}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Stats grid — StatsCard pattern */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Users', value: '127', icon: <Users size={13} />, color: 'bg-blue-950/40 border-blue-900 text-blue-400' },
                  { label: 'Active Today', value: '43', icon: <Activity size={13} />, color: 'bg-green-950/40 border-green-900 text-green-400' },
                  { label: 'Avg Feedback', value: '4.6', icon: <Star size={13} />, color: 'bg-yellow-950/40 border-yellow-900 text-yellow-400' },
                  { label: 'Completion', value: '91%', icon: <TrendingUp size={13} />, color: 'bg-purple-950/40 border-purple-900 text-purple-400' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">{s.label}</p>
                        <p className="text-xl font-bold text-white">{s.value}</p>
                      </div>
                      <div className={`w-7 h-7 rounded-xl border flex items-center justify-center ${s.color}`}>
                        {s.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Feedback panel — FeedbackAnalyticsPanel stats grid pattern */}
              <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={12} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-300">84 responses · Batch 4 DA Program</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { label: 'Materi', value: 4.5 },
                    { label: 'Latihan', value: 4.3 },
                    { label: 'Kejelasan', value: 4.7 },
                    { label: 'Manajemen', value: 4.4 },
                    { label: 'Engagement', value: 4.6 },
                    { label: 'Overall', value: 4.6 },
                  ].map(dim => (
                    <div key={dim.label} className="text-center">
                      <div className="text-sm font-bold text-white mb-0.5">{dim.value}</div>
                      <div className="w-full bg-white/[0.05] rounded-full h-1 mb-1">
                        <div className="bg-primary-500 h-full rounded-full" style={{ width: `${(dim.value / 5) * 100}%` }} />
                      </div>
                      <div className="text-[9px] text-gray-500">{dim.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </Shell>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function PitchPage() {
  const [current, setCurrent] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        setCurrent(s => Math.min(TOTAL - 1, s + 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        setCurrent(s => Math.max(0, s - 1))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const dx = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) {
      if (dx > 0) setCurrent(s => Math.min(TOTAL - 1, s + 1))
      else setCurrent(s => Math.max(0, s - 1))
    }
    setTouchStartX(null)
  }

  const slides = [
    <Slide01 />, <Slide02 />, <Slide03 />, <Slide04 />, <Slide05 />,
    <Slide06 />, <Slide07 />, <Slide08 />, <Slide09 />,
    <Slide10 />, <Slide11 />, <Slide12 />,
  ]

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-gray-950 text-white relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.45s ease',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          {slide}
        </div>
      ))}
      <button
        onClick={() => setCurrent(s => Math.max(0, s - 1))}
        disabled={current === 0}
        className="fixed left-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm hidden sm:flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 disabled:opacity-0 disabled:pointer-events-none transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrent(s => Math.min(TOTAL - 1, s + 1))}
        disabled={current === TOTAL - 1}
        className="fixed right-5 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm hidden sm:flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 disabled:opacity-0 disabled:pointer-events-none transition-all"
      >
        <ChevronRight size={20} />
      </button>
      <div className="fixed bottom-6 inset-x-0 flex justify-center gap-1.5 z-50">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-1.5 bg-primary-400'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
      <div className="fixed bottom-5 right-6 text-[11px] text-gray-600 font-mono z-50">
        {current + 1} / {TOTAL}
      </div>
    </div>
  )
}
