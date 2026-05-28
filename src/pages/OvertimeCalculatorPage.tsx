import { useState, useMemo } from 'react'
import { Clock, RefreshCw, Info } from 'lucide-react'
import { Badge } from '../components/ui/Badge'

// ── Constants ─────────────────────────────────────────────────────────
// PP No. 35 Tahun 2021 (UU Cipta Kerja implementation)
const HOURS_DIVISOR = 173 // standard monthly hours divisor

type OvertimeType = 'weekday' | 'weekend-5day' | 'weekend-6day'

interface HourBreakdown {
  hour: number
  multiplier: number
  hourlyBase: number
  amount: number
}

function calcWeekdayOvertime(hourlyBase: number, hours: number): HourBreakdown[] {
  return Array.from({ length: hours }, (_, i) => {
    const multiplier = i === 0 ? 1.5 : 2
    return { hour: i + 1, multiplier, hourlyBase, amount: multiplier * hourlyBase }
  })
}

function calcWeekendOvertime(
  hourlyBase: number,
  hours: number,
  workWeek: 5 | 6,
): HourBreakdown[] {
  // 5-day work week: hours 1-8 @ 2x, hour 9 @ 3x, hour 10+ @ 4x
  // 6-day work week: hours 1-7 @ 2x, hour 8 @ 3x, hour 9+  @ 4x
  const tier2Start = workWeek === 5 ? 9 : 8
  const tier3Start = workWeek === 5 ? 10 : 9

  return Array.from({ length: hours }, (_, i) => {
    const h = i + 1
    const multiplier = h >= tier3Start ? 4 : h >= tier2Start ? 3 : 2
    return { hour: h, multiplier, hourlyBase, amount: multiplier * hourlyBase }
  })
}

const fmt = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID')

const OVERTIME_TYPES: { id: OvertimeType; label: string; desc: string }[] = [
  {
    id: 'weekday',
    label: 'Hari Kerja',
    desc: 'Jam pertama 1.5×, jam berikutnya 2×',
  },
  {
    id: 'weekend-5day',
    label: 'Libur / Hari Minggu (5 hari kerja)',
    desc: 'Jam 1–8 @ 2×, jam 9 @ 3×, jam 10+ @ 4×',
  },
  {
    id: 'weekend-6day',
    label: 'Libur / Hari Minggu (6 hari kerja)',
    desc: 'Jam 1–7 @ 2×, jam 8 @ 3×, jam 9+ @ 4×',
  },
]

const MULTIPLIER_COLORS: Record<number, string> = {
  1.5: 'bg-blue-50 text-blue-700 border-blue-100',
  2:   'bg-violet-50 text-violet-700 border-violet-100',
  3:   'bg-amber-50 text-amber-700 border-amber-100',
  4:   'bg-rose-50 text-rose-700 border-rose-100',
}

export default function OvertimeCalculatorPage() {
  const [wage, setWage] = useState('8000000')
  const [overtimeType, setOvertimeType] = useState<OvertimeType>('weekday')
  const [hours, setHours] = useState(3)

  const reset = () => {
    setWage('8000000')
    setOvertimeType('weekday')
    setHours(3)
  }

  const result = useMemo(() => {
    const monthly = parseFloat(wage.replace(/[^0-9.]/g, '')) || 0
    const hourlyBase = monthly / HOURS_DIVISOR

    let breakdown: HourBreakdown[]
    if (overtimeType === 'weekday') {
      breakdown = calcWeekdayOvertime(hourlyBase, hours)
    } else {
      const workWeek = overtimeType === 'weekend-5day' ? 5 : 6
      breakdown = calcWeekendOvertime(hourlyBase, hours, workWeek)
    }

    const total = breakdown.reduce((s, r) => s + r.amount, 0)
    return { hourlyBase, breakdown, total }
  }, [wage, overtimeType, hours])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Overtime Calculator</h1>
            <p className="text-xs text-gray-500">PP No. 35 Tahun 2021 — UU Cipta Kerja</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Badge variant="primary" size="sm">UU Cipta Kerja</Badge>
          <Badge variant="gray" size="sm">Hari Kerja · Hari Libur</Badge>
          <Badge variant="gray" size="sm">5 & 6 Hari Kerja/Minggu</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Inputs ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">Input Data</h2>
              <button onClick={reset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-4">
              {/* Monthly wage */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Gaji Pokok Bulanan (Gross)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={wage}
                    onChange={e => setWage(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upah per jam = Rp {Math.round((parseFloat(wage) || 0) / HOURS_DIVISOR).toLocaleString('id-ID')} (÷ 173)
                </p>
              </div>

              {/* Overtime type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Jenis Lembur
                </label>
                <div className="space-y-2">
                  {OVERTIME_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setOvertimeType(t.id)}
                      className={`w-full text-left rounded-xl border px-3 py-2.5 transition-colors ${
                        overtimeType === t.id
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className={`text-sm font-medium ${overtimeType === t.id ? 'text-orange-700' : 'text-gray-700'}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Jumlah Jam Lembur: <span className="text-orange-600 font-bold">{hours} jam</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={overtimeType === 'weekday' ? 4 : 12}
                  value={hours}
                  onChange={e => setHours(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1 jam</span>
                  <span>{overtimeType === 'weekday' ? '4' : '12'} jam</span>
                </div>
                {overtimeType === 'weekday' && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                    Maksimum lembur hari kerja: 4 jam/hari (Pasal 78 UU Ketenagakerjaan)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reference */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <Info size={14} className="text-orange-500" /> Rumus Dasar
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <div className="bg-gray-50 rounded-xl p-3 font-mono">
                <p className="text-gray-500 mb-1">// Upah per jam</p>
                <p>= <span className="text-orange-600">1/173</span> × Gaji Bulanan</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 font-mono">
                <p className="text-gray-500 mb-1">// Upah lembur per jam</p>
                <p>= <span className="text-orange-600">Multiplier</span> × Upah per jam</p>
              </div>
              <p className="text-gray-400 pt-1">
                Sumber: PP No. 35/2021 Pasal 31
              </p>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Total card */}
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm opacity-80">Total Upah Lembur</p>
            <div className="text-4xl font-bold mt-1">{fmt(result.total)}</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/15 rounded-xl p-3">
                <div className="text-xs opacity-80">Upah Per Jam</div>
                <div className="font-semibold">{fmt(result.hourlyBase)}</div>
              </div>
              <div className="bg-white/15 rounded-xl p-3">
                <div className="text-xs opacity-80">Durasi Lembur</div>
                <div className="font-semibold">{hours} jam</div>
              </div>
            </div>
          </div>

          {/* Hour-by-hour breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Rincian Per Jam</h2>
            <div className="space-y-2">
              {result.breakdown.map(row => (
                <div
                  key={row.hour}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {row.hour}
                    </span>
                    <div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${MULTIPLIER_COLORS[row.multiplier]}`}>
                        {row.multiplier}× upah/jam
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">{fmt(row.amount)}</div>
                    <div className="text-xs text-gray-400">
                      {row.multiplier} × {fmt(row.hourlyBase)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-800">Total</span>
                <span className="text-base font-bold text-orange-600">{fmt(result.total)}</span>
              </div>
            </div>
          </div>

          {/* Multiplier legend */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h2 className="font-semibold text-amber-800 text-sm mb-3">
              📋 Tarif Multiplier — PP No. 35/2021
            </h2>
            <div className="text-xs text-amber-700 space-y-2">
              <div className="grid grid-cols-3 gap-2 font-medium text-amber-900 pb-1 border-b border-amber-200">
                <span>Jenis</span>
                <span className="text-center">Jam ke-</span>
                <span className="text-center">Multiplier</span>
              </div>
              {[
                ['Hari Kerja', '1', '1.5×'],
                ['Hari Kerja', '2–4', '2×'],
                ['Libur (5 hari kerja)', '1–8', '2×'],
                ['Libur (5 hari kerja)', '9', '3×'],
                ['Libur (5 hari kerja)', '10+', '4×'],
                ['Libur (6 hari kerja)', '1–7', '2×'],
                ['Libur (6 hari kerja)', '8', '3×'],
                ['Libur (6 hari kerja)', '9+', '4×'],
              ].map(([type, jam, mult], i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <span>{type}</span>
                  <span className="text-center">{jam}</span>
                  <span className="text-center font-semibold">{mult}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
