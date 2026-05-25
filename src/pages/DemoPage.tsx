import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Code2, Play, CheckCircle2, MessageSquare, Bell, ShieldCheck,
  GraduationCap, Users, Activity, TrendingUp, Radio, Globe, Zap, Database,
  CalendarClock, ArrowRight, MousePointer2, BarChart3, Lock,
} from 'lucide-react'

/* ───────────────────────────────────────────────────────────────────────────
   Demo page — NOT linked from navigation. Reachable only via direct URL #/demo.
   Auto-playing product tour: mock screens animate themselves while a fake
   cursor glides across the UI and clicks. All copy in Bahasa Indonesia.
─────────────────────────────────────────────────────────────────────────── */

type SceneId = 'learn' | 'sql' | 'progress' | 'admin'

interface Beat {
  scene: SceneId
  phase: string
  cursor: { x: number; y: number } // percentages within the viewport
  click?: boolean
  caption: string
  duration: number
}

const SCENES: { id: SceneId; label: string; url: string }[] = [
  { id: 'learn',    label: 'Materi & Kurikulum', url: 'datalearn.app/curriculum' },
  { id: 'sql',      label: 'Latihan SQL',         url: 'datalearn.app/exercise/04-1' },
  { id: 'progress', label: 'Progres & Diskusi',   url: 'datalearn.app/dashboard' },
  { id: 'admin',    label: 'Admin & Cohort',      url: 'datalearn.app/admin' },
]

const BEATS: Beat[] = [
  // Scene A — learning flow
  { scene: 'learn', phase: 'browse', cursor: { x: 28, y: 52 }, caption: 'Jelajahi kurikulum — 12 sesi tersusun dalam 4 fase', duration: 2600 },
  { scene: 'learn', phase: 'browse', cursor: { x: 52, y: 46 }, click: true, caption: 'Pilih satu sesi untuk mulai belajar', duration: 1500 },
  { scene: 'learn', phase: 'open',   cursor: { x: 48, y: 50 }, caption: 'Materi dwibahasa (ID/EN): teori, contoh, dan video', duration: 2800 },
  { scene: 'learn', phase: 'open',   cursor: { x: 79, y: 84 }, click: true, caption: 'Tandai selesai, lalu lanjut ke latihan', duration: 1700 },

  // Scene B — SQL exercise
  { scene: 'sql', phase: 'editor', cursor: { x: 38, y: 46 }, caption: 'Latihan SQL langsung di browser — tanpa instalasi apa pun', duration: 1800 },
  { scene: 'sql', phase: 'typing', cursor: { x: 44, y: 40 }, caption: 'Tulis query-mu sendiri di editor', duration: 2600 },
  { scene: 'sql', phase: 'run',    cursor: { x: 85, y: 17 }, click: true, caption: 'Jalankan query', duration: 1400 },
  { scene: 'sql', phase: 'passed', cursor: { x: 58, y: 78 }, caption: 'Penilaian otomatis — 3 dari 3 test lulus', duration: 2900 },

  // Scene C — progress + discussion
  { scene: 'progress', phase: 'progress', cursor: { x: 50, y: 38 }, caption: 'Pantau progres belajarmu secara real-time', duration: 2900 },
  { scene: 'progress', phase: 'discuss',  cursor: { x: 56, y: 70 }, caption: 'Diskusi & tanya-jawab — sebut @mentor untuk kirim notifikasi', duration: 3100 },

  // Scene D — admin + cohort
  { scene: 'admin', phase: 'stats',    cursor: { x: 44, y: 34 }, caption: 'Dashboard admin — pantau aktivitas seluruh siswa', duration: 2800 },
  { scene: 'admin', phase: 'cohort',   cursor: { x: 48, y: 52 }, caption: 'Kelola cohort: jadwal, link Zoom & rekaman', duration: 2500 },
  { scene: 'admin', phase: 'cohort',   cursor: { x: 81, y: 63 }, click: true, caption: 'Setujui pendaftaran siswa baru', duration: 1500 },
  { scene: 'admin', phase: 'approved', cursor: { x: 81, y: 63 }, caption: 'Siswa langsung aktif di cohort-nya', duration: 2400 },
]

export default function DemoPage() {
  const navigate = useNavigate()
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-primary-950 to-gray-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur bg-gray-950/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span>DataLearn</span>
            <span className="ml-2 text-[10px] uppercase tracking-widest text-primary-300 border border-primary-400/40 rounded-full px-2 py-0.5">
              Demo
            </span>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-400 text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            Coba Sekarang <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-14 pb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-primary-200 bg-primary-500/10 border border-primary-400/30 rounded-full px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400" />
          </span>
          Demo berjalan otomatis
        </div>
        <h1 className="mt-5 text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
          Platform belajar Data Analyst{' '}
          <span className="text-primary-400">dari nol sampai mahir</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Lihat sendiri cara kerjanya — layar di bawah bergerak otomatis menampilkan
          setiap fitur, mulai dari materi, latihan kode, sampai dashboard admin.
        </p>
      </section>

      {/* Auto-playing browser mock */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
        {/* Scene tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {SCENES.map(s => (
            <button
              key={s.id}
              onClick={() => jumpToScene(s.id)}
              className={`text-xs sm:text-sm font-medium rounded-full px-3.5 py-1.5 border transition-colors ${
                scene === s.id
                  ? 'bg-primary-500 border-primary-400 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Browser chrome */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-950/50 bg-white/[0.03]">
          {/* Chrome bar */}
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

          {/* Viewport */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-gray-50 overflow-hidden select-none">
            <div key={scene} className="absolute inset-0">
              {scene === 'learn' && <SceneLearn phase={current.phase} />}
              {scene === 'sql' && <SceneSql phase={current.phase} />}
              {scene === 'progress' && <SceneProgress phase={current.phase} />}
              {scene === 'admin' && <SceneAdmin phase={current.phase} />}
            </div>

            {/* Fake cursor */}
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
              {playing ? 'Jeda' : 'Putar'}
            </button>
          </div>
        </div>
      </section>

      {/* Roles */}
      <RolesSection />

      {/* Advantages */}
      <AdvantagesSection />

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Siap mulai perjalanan data-mu?</h2>
        <p className="mt-3 text-gray-300">
          Akses 12 sesi, puluhan latihan interaktif, dan bimbingan cohort dalam satu platform.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold px-7 py-3.5 transition-colors"
        >
          Daftar Sekarang <ArrowRight size={18} />
        </button>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-gray-500">
        DataLearn — Halaman demo. Tidak tertaut dari navigasi utama.
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
      {/* Click ripple — re-keyed per beat so it replays */}
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
  // browse
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
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 h-11 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Database size={15} className="text-primary-600" /> Latihan 04-1 · Agregasi
        </div>
        <button className={`inline-flex items-center gap-1.5 rounded-lg text-white text-xs font-medium px-3 py-1.5 ${
          phase === 'run' ? 'bg-primary-700' : 'bg-primary-600'
        }`}>
          <Play size={13} /> Jalankan
        </button>
      </div>

      <div className="flex-1 grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 min-h-0">
        {/* Editor */}
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

        {/* Output */}
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
                  <CheckCircle2 size={15} /> 3 / 3 test lulus
                </div>
                <ul className="mt-1.5 space-y-1 text-[11px] text-green-700/90">
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Kolom benar (category, orders, avg_value)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Urutan menurun sesuai jumlah pesanan</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Nilai rata-rata dibulatkan 2 desimal</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 text-xs gap-2">
              <Code2 size={28} />
              <span>Hasil query muncul di sini</span>
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
            <MessageSquare size={18} className="text-primary-600" /> Diskusi — Sesi 04
          </h2>
          <div className="relative">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">1</span>
          </div>
        </div>

        {/* Notification toast */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-200 px-3 py-2 text-xs text-primary-800">
          <Bell size={13} /> <span><b>@Andi</b> menyebut kamu dalam sebuah diskusi</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold">A</div>
              <span className="text-sm font-semibold text-gray-900">Andi</span>
              <span className="text-[11px] text-gray-400">2 jam lalu</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Kenapa hasil <code className="bg-gray-100 text-primary-700 px-1 rounded">GROUP BY</code> aku beda ya?
              <span className="text-primary-600 font-medium"> @mentor</span> bisa bantu cek?
            </p>
          </div>
          <div className="ml-6 rounded-2xl border border-primary-100 bg-primary-50/50 shadow-sm p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold">M</div>
              <span className="text-sm font-semibold text-gray-900">Mentor</span>
              <span className="text-[10px] bg-primary-100 text-primary-700 rounded-full px-1.5 py-0.5 font-medium">Mentor</span>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Coba pastikan semua kolom non-agregat masuk ke <code className="bg-gray-100 text-primary-700 px-1 rounded">GROUP BY</code> ya 👍
            </p>
          </div>
        </div>
      </div>
    )
  }

  // progress
  const bars = [
    { label: 'Fase 1 — Fondasi Data', pct: 100 },
    { label: 'Fase 2 — SQL & Database', pct: 66 },
    { label: 'Fase 3 — Visualisasi & BI', pct: 20 },
    { label: 'Fase 4 — Python & Portfolio', pct: 0 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden p-5 sm:p-7 text-gray-800">
      <p className="text-sm text-gray-500">Selamat datang kembali,</p>
      <h2 className="text-xl font-bold text-gray-900">Halo, Sari 👋</h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: <BookOpen size={16} className="text-primary-600" />, v: '7', t: '12', l: 'Sesi selesai', bg: 'bg-primary-50' },
          { icon: <Code2 size={16} className="text-violet-600" />, v: '23', t: '40+', l: 'Latihan lulus', bg: 'bg-violet-50' },
          { icon: <TrendingUp size={16} className="text-emerald-600" />, v: '2', t: '4', l: 'Fase aktif', bg: 'bg-emerald-50' },
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
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Progres keseluruhan</h3>
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
      {/* Header + tabs */}
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
                { l: 'Total Siswa', v: '128', icon: <Users size={14} />, c: 'text-sky-400' },
                { l: 'Aktif Hari Ini', v: '34', icon: <Activity size={14} />, c: 'text-green-400' },
                { l: 'Sesi Selesai', v: '892', icon: <BookOpen size={14} />, c: 'text-violet-400' },
                { l: 'Rata Penyelesaian', v: '71%', icon: <TrendingUp size={14} />, c: 'text-yellow-400' },
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
                <span className="text-sm font-semibold text-gray-200">Aktivitas Langsung</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  ['Sari', 'menyelesaikan Sesi 06', 'text-green-400'],
                  ['Andi', 'mengirim latihan 04-1', 'text-primary-400'],
                  ['Budi', 'masuk ke platform', 'text-gray-400'],
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
                  <div className="text-[11px] text-gray-500">Mulai 1 Jun 2026 · 13 sesi terjadwal</div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-primary-300 bg-primary-500/10 border border-primary-500/20 rounded-full px-2.5 py-1">
                  <CalendarClock size={12} /> Jadwal aktif
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#111827] border border-white/[0.06] p-4">
              <div className="text-sm font-semibold text-gray-200 mb-3">Pendaftaran</div>
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
                          Setujui
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">
                          {i === 2 && approved ? 'Baru aktif ✓' : 'Aktif'}
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

/* ── Roles section ────────────────────────────────────────────────────────── */

function RolesSection() {
  const roles = [
    {
      title: 'Siswa',
      icon: <GraduationCap size={22} />,
      accent: 'from-primary-600 to-cyan-500',
      points: [
        'Akses 12 sesi materi dwibahasa (Indonesia & Inggris)',
        'Latihan SQL & Python langsung di browser, tanpa instalasi',
        'Penilaian otomatis dengan umpan balik per test case',
        'Pantau progres belajar & riwayat penyelesaian',
        'Diskusi dan tanya-jawab, sebut @mentor untuk notifikasi',
        'Ikuti jadwal cohort: link Zoom & rekaman tiap sesi',
      ],
    },
    {
      title: 'Admin / Mentor',
      icon: <ShieldCheck size={22} />,
      accent: 'from-violet-600 to-purple-500',
      points: [
        'Dashboard pemantauan: total siswa, aktivitas, & penyelesaian',
        'Umpan aktivitas langsung dari seluruh siswa',
        'Kelola pengguna & lihat detail progres tiap siswa',
        'Analitik latihan: soal tersulit & tingkat kelulusan',
        'Buat & atur cohort: jadwal, link Zoom, rekaman',
        'Setujui / tolak pendaftaran & kelola masa akses',
      ],
    },
  ]
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold">Apa yang bisa dilakukan tiap peran?</h2>
        <p className="mt-3 text-gray-400">Dua peran, satu platform terintegrasi</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {roles.map(r => (
          <div key={r.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.accent} flex items-center justify-center text-white`}>
              {r.icon}
            </div>
            <h3 className="mt-4 text-xl font-bold">{r.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {r.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-primary-400 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Advantages section ───────────────────────────────────────────────────── */

function AdvantagesSection() {
  const items = [
    { icon: <Zap size={20} />, title: 'Belajar di browser', desc: 'SQL & Python jalan langsung di browser — tanpa setup, tanpa instalasi.' },
    { icon: <Globe size={20} />, title: 'Dwibahasa', desc: 'Seluruh materi tersedia dalam Bahasa Indonesia & Inggris.' },
    { icon: <CheckCircle2 size={20} />, title: 'Penilaian otomatis', desc: 'Setiap latihan diuji dengan test case deterministik, umpan balik instan.' },
    { icon: <GraduationCap size={20} />, title: 'Sistem cohort', desc: 'Belajar berkelompok dengan jadwal, Zoom, dan rekaman terstruktur.' },
    { icon: <MessageSquare size={20} />, title: 'Diskusi terintegrasi', desc: 'Tanya-jawab dengan mention & notifikasi, langsung di tiap sesi.' },
    { icon: <TrendingUp size={20} />, title: 'Pantau progres', desc: 'Dashboard real-time untuk siswa maupun admin.' },
  ]
  return (
    <section className="bg-white/[0.02] border-y border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Kenapa DataLearn?</h2>
          <p className="mt-3 text-gray-400">Semua yang kamu butuhkan untuk jadi Data Analyst, dalam satu tempat</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(it => (
            <div key={it.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-400/20 text-primary-300 flex items-center justify-center">
                {it.icon}
              </div>
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
