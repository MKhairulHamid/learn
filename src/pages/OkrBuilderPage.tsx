import { useState } from 'react'
import { Plus, Trash2, Target, RefreshCw } from 'lucide-react'
import { Badge } from '../components/ui/Badge'

// ── Types ─────────────────────────────────────────────────────────────
interface KeyResult {
  id: string
  description: string
  target: number | ''
  actual: number | ''
  unit: string
}

interface Objective {
  id: string
  title: string
  keyResults: KeyResult[]
}

let _uid = 0
const uid = () => String(++_uid)

const mkKR = (): KeyResult => ({
  id: uid(), description: '', target: '', actual: '', unit: '%',
})

const mkObjective = (): Objective => ({
  id: uid(),
  title: '',
  keyResults: [mkKR()],
})

const DEFAULT_OBJECTIVES: Objective[] = [
  {
    id: uid(),
    title: 'Meningkatkan Retensi Karyawan',
    keyResults: [
      { id: uid(), description: 'Turunkan turnover rate', target: 10, actual: 7, unit: '%' },
      { id: uid(), description: 'Tingkatkan skor eNPS', target: 40, actual: 35, unit: 'poin' },
    ],
  },
  {
    id: uid(),
    title: 'Percepat Proses Rekrutmen',
    keyResults: [
      { id: uid(), description: 'Kurangi time-to-hire', target: 30, actual: 22, unit: 'hari' },
      { id: uid(), description: 'Kandidat qualified per posisi', target: 5, actual: 4, unit: 'orang' },
      { id: uid(), description: 'Offer acceptance rate', target: 85, actual: 90, unit: '%' },
    ],
  },
]

// ── Scoring helpers ───────────────────────────────────────────────────
function krScore(kr: KeyResult): number | null {
  const t = Number(kr.target)
  const a = Number(kr.actual)
  if (!kr.target || !kr.description || isNaN(t) || t === 0) return null
  return Math.min(a / t, 1)
}

function objScore(obj: Objective): number | null {
  const scores = obj.keyResults.map(krScore).filter((s): s is number => s !== null)
  if (scores.length === 0) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

function health(score: number | null): { label: string; labelId: string; color: string; bg: string; bar: string } {
  if (score === null) return { label: 'No data', labelId: 'Belum ada data', color: 'text-gray-400', bg: 'bg-gray-50', bar: 'bg-gray-300' }
  if (score >= 0.8)  return { label: 'On Track',   labelId: 'Sesuai Target', color: 'text-emerald-700', bg: 'bg-emerald-50', bar: 'bg-emerald-500' }
  if (score >= 0.6)  return { label: 'Progressing', labelId: 'Berkembang',   color: 'text-amber-700',   bg: 'bg-amber-50',   bar: 'bg-amber-400'  }
  return                    { label: 'At Risk',     labelId: 'Berisiko',     color: 'text-red-700',     bg: 'bg-red-50',     bar: 'bg-red-500'    }
}

// ── Component ─────────────────────────────────────────────────────────
export default function OkrBuilderPage() {
  const [objectives, setObjectives] = useState<Objective[]>(DEFAULT_OBJECTIVES)

  const reset = () => setObjectives(DEFAULT_OBJECTIVES.map(o => ({
    ...o,
    id: uid(),
    keyResults: o.keyResults.map(kr => ({ ...kr, id: uid() })),
  })))

  // ── Objective mutations ───────────────────────────────────────────
  const addObjective = () => {
    if (objectives.length >= 3) return
    setObjectives(prev => [...prev, mkObjective()])
  }

  const removeObjective = (oid: string) =>
    setObjectives(prev => prev.filter(o => o.id !== oid))

  const updateObjectiveTitle = (oid: string, title: string) =>
    setObjectives(prev => prev.map(o => o.id === oid ? { ...o, title } : o))

  // ── Key Result mutations ──────────────────────────────────────────
  const addKR = (oid: string) =>
    setObjectives(prev => prev.map(o =>
      o.id === oid && o.keyResults.length < 4
        ? { ...o, keyResults: [...o.keyResults, mkKR()] }
        : o,
    ))

  const removeKR = (oid: string, kid: string) =>
    setObjectives(prev => prev.map(o =>
      o.id === oid
        ? { ...o, keyResults: o.keyResults.filter(kr => kr.id !== kid) }
        : o,
    ))

  const updateKR = (oid: string, kid: string, patch: Partial<KeyResult>) =>
    setObjectives(prev => prev.map(o =>
      o.id === oid
        ? { ...o, keyResults: o.keyResults.map(kr => kr.id === kid ? { ...kr, ...patch } : kr) }
        : o,
    ))

  // ── Overall score ─────────────────────────────────────────────────
  const objectiveScores = objectives.map(objScore)
  const validScores = objectiveScores.filter((s): s is number => s !== null)
  const overallScore = validScores.length > 0
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length
    : null
  const overallHealth = health(overallScore)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">KPI / OKR Scorecard Builder</h1>
            <p className="text-xs text-gray-500">Susun Objectives & Key Results — skor Google-style (0.0–1.0)</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Badge variant="primary" size="sm">OKR Scoring</Badge>
          <Badge variant="gray" size="sm">Maks 3 Objectives</Badge>
          <Badge variant="gray" size="sm">Maks 4 Key Results</Badge>
        </div>
      </div>

      {/* Overall health card */}
      <div className={`rounded-2xl p-5 mb-6 border ${overallHealth.bg} border-current border-opacity-20`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Overall OKR Score</p>
            <div className="flex items-end gap-3">
              <span className={`text-5xl font-black ${overallHealth.color}`}>
                {overallScore !== null ? overallScore.toFixed(2) : '—'}
              </span>
              <span className={`text-sm font-semibold mb-1 ${overallHealth.color}`}>
                {overallHealth.labelId}
              </span>
            </div>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl bg-white/60 border border-gray-200 hover:bg-white transition-colors"
          >
            <RefreshCw size={12} /> Reset contoh
          </button>
        </div>
        {overallScore !== null && (
          <div className="mt-4 h-2 bg-black/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${overallHealth.bar}`}
              style={{ width: `${overallScore * 100}%` }}
            />
          </div>
        )}
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> &lt;0.6 Berisiko</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 0.6–0.8 Berkembang</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> &gt;0.8 Sesuai Target</span>
        </div>
      </div>

      {/* Objectives */}
      <div className="space-y-4">
        {objectives.map((obj, oi) => {
          const oScore = objScore(obj)
          const oHealth = health(oScore)
          return (
            <div key={obj.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Objective header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">
                  O{oi + 1}
                </span>
                <input
                  type="text"
                  placeholder="Tulis Objective di sini…"
                  value={obj.title}
                  onChange={e => updateObjectiveTitle(obj.id, e.target.value)}
                  className="flex-1 text-sm font-semibold text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-300"
                />
                <div className="flex items-center gap-2 shrink-0">
                  {oScore !== null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${oHealth.bg} ${oHealth.color}`}>
                      {oScore.toFixed(2)}
                    </span>
                  )}
                  {objectives.length > 1 && (
                    <button
                      onClick={() => removeObjective(obj.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Key Results */}
              <div className="px-5 py-3 space-y-3">
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1">
                  <span className="col-span-1">#</span>
                  <span className="col-span-4">Key Result</span>
                  <span className="col-span-2 text-center">Target</span>
                  <span className="col-span-2 text-center">Aktual</span>
                  <span className="col-span-1 text-center">Satuan</span>
                  <span className="col-span-2 text-center">Skor</span>
                </div>

                {obj.keyResults.map((kr, ki) => {
                  const s = krScore(kr)
                  const kHealth = health(s)
                  return (
                    <div key={kr.id} className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-1 text-xs text-gray-400 font-medium">KR{ki + 1}</span>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Deskripsi Key Result…"
                          value={kr.description}
                          onChange={e => updateKR(obj.id, kr.id, { description: e.target.value })}
                          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-gray-300"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Target"
                          value={kr.target}
                          onChange={e => updateKR(obj.id, kr.id, { target: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="w-full text-xs text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-gray-300"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Aktual"
                          value={kr.actual}
                          onChange={e => updateKR(obj.id, kr.id, { actual: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="w-full text-xs text-center border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-300 placeholder:text-gray-300"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="text"
                          value={kr.unit}
                          onChange={e => updateKR(obj.id, kr.id, { unit: e.target.value })}
                          className="w-full text-xs text-center border border-gray-200 rounded-lg px-1.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-300"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-between gap-1">
                        <div className="flex-1">
                          {s !== null ? (
                            <div>
                              <div className={`text-xs font-bold text-center ${kHealth.color}`}>
                                {s.toFixed(2)}
                              </div>
                              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-0.5">
                                <div
                                  className={`h-full rounded-full ${kHealth.bar}`}
                                  style={{ width: `${s * 100}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300 text-center block">—</span>
                          )}
                        </div>
                        {obj.keyResults.length > 1 && (
                          <button
                            onClick={() => removeKR(obj.id, kr.id)}
                            className="text-gray-200 hover:text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Objective progress bar */}
                {oScore !== null && (
                  <div className="pt-2 border-t border-gray-50 flex items-center gap-3">
                    <span className="text-xs text-gray-400 shrink-0">Skor Objective</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${oHealth.bar}`}
                        style={{ width: `${oScore * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${oHealth.color}`}>{oScore.toFixed(2)}</span>
                  </div>
                )}

                {/* Add KR button */}
                {obj.keyResults.length < 4 && (
                  <button
                    onClick={() => addKR(obj.id)}
                    className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 py-1 transition-colors"
                  >
                    <Plus size={12} /> Tambah Key Result
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* Add Objective */}
        {objectives.length < 3 && (
          <button
            onClick={addObjective}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Tambah Objective
          </button>
        )}
      </div>

      {/* Info box */}
      <div className="mt-6 bg-violet-50 border border-violet-100 rounded-2xl p-4">
        <p className="text-xs font-semibold text-violet-800 mb-2">📋 Cara Menghitung Skor OKR (Google Method)</p>
        <div className="text-xs text-violet-700 space-y-1">
          <p><span className="font-mono bg-violet-100 px-1 rounded">Skor KR = Aktual ÷ Target</span> (maks 1.0)</p>
          <p><span className="font-mono bg-violet-100 px-1 rounded">Skor Objective = rata-rata skor KR</span></p>
          <p><span className="font-mono bg-violet-100 px-1 rounded">Skor Keseluruhan = rata-rata skor Objective</span></p>
          <p className="text-violet-500 pt-1">Target ideal: skor 0.6–0.7. Skor 1.0 berarti target terlalu rendah.</p>
        </div>
      </div>
    </div>
  )
}
