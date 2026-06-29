import { Link } from 'react-router-dom'
import { Presentation as PresIcon, ArrowRight, Clock, Layers } from 'lucide-react'
import { PRESENTATIONS } from '../presentations/registry'
import { BRAND } from '../presentations/primitives'

/* ─────────────────────────────────────────────────────────────────────────────
   Presentation gallery — no login required, not in any nav. Direct link: #/present
───────────────────────────────────────────────────────────────────────────── */

export default function PresentationsIndex() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#1FA79B]/12 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-[#6DC4AA]/8 blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <img src={BRAND.logoWhite} alt="Talentiv" className="h-8 mb-10 object-contain" />

        <div className="inline-flex items-center gap-2 mb-5 border border-[#1FA79B]/30 bg-[#1FA79B]/10 rounded-full px-4 py-1.5">
          <PresIcon size={14} className="text-[#6DC4AA]" />
          <span className="text-xs font-semibold text-[#D1EDE5]">Materi Presentasi</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Slide Presentasi Kelas</h1>
        <p className="mt-4 text-gray-400 max-w-xl">
          Pilih presentasi untuk memulai. Tekan tombol layar penuh saat menyajikan.
        </p>

        <div className="mt-10 space-y-4">
          {PRESENTATIONS.map(p => (
            <Link
              key={p.id}
              to={`/present/${p.id}`}
              className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#1FA79B]/40 transition-all p-5 sm:p-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1FA79B] to-[#6DC4AA] flex items-center justify-center shrink-0">
                  <PresIcon size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6DC4AA]">{p.program}</span>
                    <span className="text-[10px] text-gray-500">· {p.session}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">{p.title}</h2>
                  <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{p.subtitle}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Layers size={12} /> {p.slides.length} slide</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> ±{p.durationMin} menit</span>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-600 group-hover:text-[#6DC4AA] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-gray-600">
          Tip instruktur: di dalam presentasi, tekan <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">N</kbd> untuk catatan, atau <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">P</kbd> untuk membuka jendela presenter yang tidak ikut terbagikan saat share screen.
        </p>
      </div>
    </div>
  )
}
