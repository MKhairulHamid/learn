import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Maximize, Minimize, X,
  StickyNote, MonitorPlay, Keyboard,
} from 'lucide-react'
import { getPresentation } from '../presentations/registry'

/* ─────────────────────────────────────────────────────────────────────────────
   Presentation viewer — direct link only: #/present/:id  (no login, not in nav)

   Instructor talking points are delivered through TWO secret channels:
   • Press N → inline notes overlay on the instructor's own screen.
   • Press P → opens a separate "Presenter" window (window.open) that syncs via
     BroadcastChannel. When the instructor shares ONLY the slides tab/window in
     Zoom/Meet, that presenter window is never captured → learners never see it.
     (Native screen-share is OS-level and cannot be detected from the page, so a
     separate unshared window is the only reliable way to keep notes private.)
───────────────────────────────────────────────────────────────────────────── */

function buildPresenterHtml(deckTitle: string, channel: string) {
  return `<!doctype html>
<html lang="id"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Presenter · ${deckTitle.replace(/</g, '&lt;')}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: 'Inter', system-ui, sans-serif; background:#0a0e14; color:#e5e7eb; padding:20px; }
  .bar { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
  .badge { font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:#6DC4AA; font-weight:600; }
  .pos { font-size:13px; color:#9ca3af; font-variant-numeric:tabular-nums; }
  .clock { font-size:13px; color:#6b7280; font-variant-numeric:tabular-nums; }
  h1 { font-size:22px; margin:0 0 4px; color:#fff; }
  .next { font-size:12px; color:#6b7280; margin-bottom:18px; }
  .next b { color:#9ca3af; font-weight:600; }
  .notes { background:#10151f; border:1px solid rgba(31,167,155,.25); border-radius:14px; padding:18px 20px; font-size:16px; line-height:1.7; white-space:pre-wrap; }
  .hint { margin-top:16px; font-size:11px; color:#4b5563; }
  kbd { background:rgba(255,255,255,.08); border-radius:4px; padding:1px 5px; font-family:monospace; }
</style></head>
<body>
  <div class="bar">
    <span class="badge">Presenter View · tidak dibagikan</span>
    <span class="clock" id="clock"></span>
  </div>
  <div class="pos" id="pos">—</div>
  <h1 id="label">Menunggu slide…</h1>
  <div class="next" id="next"></div>
  <div class="notes" id="notes">Jaga jendela ini di layar yang TIDAK kamu bagikan. Navigasikan slide di jendela utama — catatan akan ikut berpindah.</div>
  <div class="hint">Navigasi tetap di jendela presentasi utama. Tutup jendela ini kapan saja.</div>
<script>
  var ch = new BroadcastChannel(${JSON.stringify(channel)});
  function pad(n){return (n<10?'0':'')+n;}
  function tick(){ var d=new Date(); document.getElementById('clock').textContent = pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds()); }
  setInterval(tick, 1000); tick();
  ch.onmessage = function(e){
    var m = e.data; if(!m || m.type!=='state') return;
    document.getElementById('pos').textContent = 'Slide ' + (m.index+1) + ' / ' + m.total;
    document.getElementById('label').textContent = m.label || '';
    document.getElementById('next').innerHTML = m.nextLabel ? 'Berikutnya: <b>'+m.nextLabel+'</b>' : 'Slide terakhir';
    document.getElementById('notes').textContent = m.notes || '(tidak ada catatan)';
    document.title = 'Presenter · ' + (m.index+1) + '. ' + (m.label||'');
  };
  ch.postMessage({ type:'ready' });
  window.addEventListener('beforeunload', function(){ ch.postMessage({ type:'presenter-closed' }); });
</script>
</body></html>`
}

export default function PresentationViewer() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const deck = getPresentation(id)

  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const presenterRef = useRef<Window | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = deck?.slides.length ?? 0

  const go = useCallback(
    (dir: number) => setCurrent(s => Math.max(0, Math.min(total - 1, s + dir))),
    [total],
  )

  // ── BroadcastChannel for the presenter window ──────────────────────────────
  useEffect(() => {
    if (!deck) return
    const ch = new BroadcastChannel(`pres:${deck.id}`)
    channelRef.current = ch
    ch.onmessage = e => {
      if (e.data?.type === 'ready') broadcast(current)
      if (e.data?.type === 'presenter-closed') presenterRef.current = null
    }
    return () => ch.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck])

  const broadcast = useCallback(
    (index: number) => {
      if (!deck || !channelRef.current) return
      channelRef.current.postMessage({
        type: 'state',
        index,
        total: deck.slides.length,
        label: deck.slides[index]?.label,
        notes: deck.slides[index]?.notes,
        nextLabel: deck.slides[index + 1]?.label ?? '',
      })
    },
    [deck],
  )

  useEffect(() => {
    broadcast(current)
  }, [current, broadcast])

  // ── Fullscreen ─────────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
    else document.exitFullscreen?.()
  }, [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // ── Presenter window ─────────────────────────────────────────────────────────
  const openPresenter = useCallback(() => {
    if (!deck) return
    if (presenterRef.current && !presenterRef.current.closed) {
      presenterRef.current.focus()
      return
    }
    const w = window.open('', `presenter-${deck.id}`, 'width=560,height=720')
    if (!w) {
      alert('Jendela presenter diblokir. Izinkan pop-up untuk situs ini.')
      return
    }
    w.document.open()
    w.document.write(buildPresenterHtml(deck.title, `pres:${deck.id}`))
    w.document.close()
    presenterRef.current = w
    // give the new window a tick to subscribe, then push current state
    setTimeout(() => broadcast(current), 300)
  }, [deck, broadcast, current])

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case ' ': go(1); break
        case 'ArrowLeft': case 'ArrowUp': go(-1); break
        case 'Home': setCurrent(0); break
        case 'End': setCurrent(total - 1); break
        case 'f': case 'F': toggleFullscreen(); break
        case 'n': case 'N': setShowNotes(s => !s); break
        case 'p': case 'P': openPresenter(); break
        case '?': setShowHelp(s => !s); break
        case 'Escape': if (showHelp) setShowHelp(false); break
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [go, total, toggleFullscreen, openPresenter, showHelp])

  // ── Auto-hide controls ───────────────────────────────────────────────────────
  const nudgeControls = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setControlsVisible(false), 2800)
  }, [])
  useEffect(() => {
    nudgeControls()
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current) }
  }, [nudgeControls])

  if (!deck) {
    return (
      <div className="min-h-screen bg-[#06302c] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Presentasi tidak ditemukan.</p>
        <button onClick={() => navigate('/present')} className="text-[#6DC4AA] underline">Kembali ke daftar</button>
      </div>
    )
  }

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 45) go(dx > 0 ? 1 : -1)
    touchStartX.current = null
  }

  const slide = deck.slides[current]

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-[#06302c] text-white relative"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseMove={nudgeControls}
    >
      {/* Slides (crossfade) */}
      {deck.slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 overflow-y-auto"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
          aria-hidden={i !== current}
        >
          {s.render}
        </div>
      ))}

      {/* Edge nav arrows */}
      <button
        onClick={() => go(-1)}
        disabled={current === 0}
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm hidden sm:flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-0 transition-all ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        disabled={current === total - 1}
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm hidden sm:flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-0 transition-all ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronRight size={20} />
      </button>

      {/* Bottom control bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 transition-all duration-300 ${controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-t from-black/60 to-transparent">
          <button
            onClick={() => navigate('/present')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <X size={15} /> <span className="hidden sm:inline">Keluar</span>
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {deck.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                title={deck.slides[i].label}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-1.5 bg-[#6DC4AA]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500 font-mono mr-2 tabular-nums">{current + 1}/{total}</span>
            <CtrlBtn active={showNotes} onClick={() => setShowNotes(s => !s)} title="Catatan (N)"><StickyNote size={16} /></CtrlBtn>
            <CtrlBtn onClick={openPresenter} title="Jendela presenter (P)"><MonitorPlay size={16} /></CtrlBtn>
            <CtrlBtn onClick={() => setShowHelp(true)} title="Bantuan (?)"><Keyboard size={16} /></CtrlBtn>
            <CtrlBtn onClick={toggleFullscreen} title="Layar penuh (F)">
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </CtrlBtn>
          </div>
        </div>
      </div>

      {/* Inline notes overlay (instructor's local screen) */}
      {showNotes && (
        <div className="fixed bottom-16 inset-x-0 z-30 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto rounded-2xl border border-[#1FA79B]/30 bg-[#0a0e14]/95 backdrop-blur-md shadow-2xl shadow-black/60 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#6DC4AA] text-xs font-semibold uppercase tracking-widest">
                <StickyNote size={13} /> Catatan instruktur · {slide.label}
              </div>
              <span className="text-[10px] text-amber-400/80">⚠ terlihat jika kamu share seluruh layar</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap max-h-[34vh] overflow-y-auto">{slide.notes}</p>
          </div>
        </div>
      )}

      {/* Help overlay */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowHelp(false)}
        >
          <div className="rounded-2xl border border-white/10 bg-[#0d1119] p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Pintasan keyboard</h3>
            <div className="space-y-2 text-sm">
              {[
                ['→ / Spasi', 'Slide berikutnya'],
                ['←', 'Slide sebelumnya'],
                ['F', 'Layar penuh'],
                ['N', 'Catatan instruktur (di layar ini)'],
                ['P', 'Buka jendela presenter (aman, tidak ikut dibagikan)'],
                ['? ', 'Bantuan ini'],
              ].map(([k, d]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-xs shrink-0">{k}</kbd>
                  <span className="text-gray-400 text-right">{d}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-[#1FA79B]/20 bg-[#1FA79B]/[0.07] p-3 text-xs text-gray-300">
              💡 Untuk menyembunyikan catatan dari peserta saat share screen: tekan <kbd className="px-1 rounded bg-white/10 font-mono">P</kbd>, lalu di Zoom/Meet pilih <b>Share Window</b> dan bagikan <b>hanya jendela presentasi ini</b> — bukan seluruh layar. Jendela presenter tetap di layarmu.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CtrlBtn({ children, onClick, title, active }: { children: React.ReactNode; onClick: () => void; title: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${active ? 'text-[#6DC4AA] bg-[#1FA79B]/15' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
    >
      {children}
    </button>
  )
}
