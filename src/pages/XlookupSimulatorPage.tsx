import { useState, useMemo } from 'react'
import { Search, RefreshCw, ChevronDown } from 'lucide-react'
import { Badge } from '../components/ui/Badge'

// ── HR Employee Dataset ───────────────────────────────────────────────
const EMPLOYEES = [
  { emp_id: 'E001', name: 'Budi Santoso',    department: 'Engineering',  position: 'Software Engineer',    grade: 'L3', salary: 15_000_000, performance: 4.2 },
  { emp_id: 'E002', name: 'Siti Rahayu',     department: 'HR',           position: 'HR Specialist',        grade: 'L2', salary: 9_500_000,  performance: 4.5 },
  { emp_id: 'E003', name: 'Ahmad Fauzi',     department: 'Finance',      position: 'Financial Analyst',    grade: 'L3', salary: 12_000_000, performance: 3.8 },
  { emp_id: 'E004', name: 'Dewi Lestari',    department: 'Marketing',    position: 'Marketing Manager',    grade: 'L4', salary: 18_000_000, performance: 4.7 },
  { emp_id: 'E005', name: 'Rizky Pratama',   department: 'Operations',   position: 'Ops Coordinator',      grade: 'L2', salary: 8_500_000,  performance: 3.5 },
  { emp_id: 'E006', name: 'Nur Hidayah',     department: 'HR',           position: 'HR Manager',           grade: 'L4', salary: 17_500_000, performance: 4.4 },
  { emp_id: 'E007', name: 'Wahyu Setiawan',  department: 'Engineering',  position: 'Senior Engineer',      grade: 'L4', salary: 20_000_000, performance: 4.6 },
  { emp_id: 'E008', name: 'Fitri Handayani', department: 'Finance',      position: 'Finance Manager',      grade: 'L4', salary: 19_000_000, performance: 4.1 },
  { emp_id: 'E009', name: 'Eko Prasetyo',    department: 'Operations',   position: 'Operations Manager',   grade: 'L4', salary: 16_500_000, performance: 3.9 },
  { emp_id: 'E010', name: 'Maya Indrawati',  department: 'Marketing',    position: 'Digital Marketing',    grade: 'L3', salary: 13_000_000, performance: 4.3 },
  { emp_id: 'E011', name: 'Andi Kurniawan',  department: 'Engineering',  position: 'Junior Engineer',      grade: 'L1', salary: 7_500_000,  performance: 3.2 },
  { emp_id: 'E012', name: 'Rini Susanti',    department: 'HR',           position: 'Recruitment Specialist', grade: 'L2', salary: 9_000_000, performance: 4.0 },
  { emp_id: 'E013', name: 'Hendra Wijaya',   department: 'Finance',      position: 'Accounting Staff',     grade: 'L1', salary: 7_000_000,  performance: 3.6 },
  { emp_id: 'E014', name: 'Lina Mulyati',    department: 'Operations',   position: 'Logistics Staff',      grade: 'L1', salary: 6_500_000,  performance: 3.3 },
  { emp_id: 'E015', name: 'Fajar Nugroho',   department: 'Engineering',  position: 'Tech Lead',            grade: 'L5', salary: 28_000_000, performance: 4.9 },
]

type Column = keyof typeof EMPLOYEES[0]
type LookupFn = 'XLOOKUP' | 'VLOOKUP'

const COLUMNS: { key: Column; label: string; colLetter: string; colIndex: number }[] = [
  { key: 'emp_id',     label: 'emp_id',     colLetter: 'A', colIndex: 1 },
  { key: 'name',       label: 'name',       colLetter: 'B', colIndex: 2 },
  { key: 'department', label: 'department', colLetter: 'C', colIndex: 3 },
  { key: 'position',   label: 'position',   colLetter: 'D', colIndex: 4 },
  { key: 'grade',      label: 'grade',      colLetter: 'E', colIndex: 5 },
  { key: 'salary',     label: 'salary',     colLetter: 'F', colIndex: 6 },
  { key: 'performance',label: 'performance',colLetter: 'G', colIndex: 7 },
]

const fmtValue = (key: Column, val: string | number) => {
  if (key === 'salary') return 'Rp ' + Number(val).toLocaleString('id-ID')
  return String(val)
}

export default function XlookupSimulatorPage() {
  const [lookupFn, setLookupFn] = useState<LookupFn>('XLOOKUP')
  const [lookupValue, setLookupValue] = useState('Nur Hidayah')
  const [lookupCol, setLookupCol] = useState<Column>('name')
  const [returnCol, setReturnCol] = useState<Column>('salary')

  const reset = () => {
    setLookupFn('XLOOKUP')
    setLookupValue('Nur Hidayah')
    setLookupCol('name')
    setReturnCol('salary')
  }

  const result = useMemo(() => {
    const val = lookupValue.trim().toLowerCase()
    if (!val) return null
    const match = EMPLOYEES.find(e =>
      String(e[lookupCol]).toLowerCase() === val
    )
    return match ?? null
  }, [lookupValue, lookupCol])

  const allMatches = useMemo(() => {
    const val = lookupValue.trim().toLowerCase()
    if (!val) return []
    return EMPLOYEES.filter(e =>
      String(e[lookupCol]).toLowerCase().includes(val)
    )
  }, [lookupValue, lookupCol])

  const lookupColInfo = COLUMNS.find(c => c.key === lookupCol)!
  const returnColInfo = COLUMNS.find(c => c.key === returnCol)!

  const formula = lookupFn === 'XLOOKUP'
    ? `=XLOOKUP("${lookupValue}", ${lookupColInfo.colLetter}:${lookupColInfo.colLetter}, ${returnColInfo.colLetter}:${returnColInfo.colLetter})`
    : `=VLOOKUP("${lookupValue}", A:G, ${returnColInfo.colIndex}, 0)`

  const altFormula = lookupFn === 'XLOOKUP'
    ? `=VLOOKUP("${lookupValue}", A:G, ${returnColInfo.colIndex}, 0)`
    : `=XLOOKUP("${lookupValue}", ${lookupColInfo.colLetter}:${lookupColInfo.colLetter}, ${returnColInfo.colLetter}:${returnColInfo.colLetter})`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Search size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">XLOOKUP / VLOOKUP Simulator</h1>
            <p className="text-xs text-gray-500">Praktik lookup functions pada data karyawan HR</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Badge variant="primary" size="sm">XLOOKUP</Badge>
          <Badge variant="gray" size="sm">VLOOKUP</Badge>
          <Badge variant="gray" size="sm">15 data karyawan</Badge>
          <Badge variant="gray" size="sm">HR Dataset</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Formula Panel ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">Formula Builder</h2>
              <button onClick={reset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-4">
              {/* Function selector */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Fungsi Lookup</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['XLOOKUP', 'VLOOKUP'] as LookupFn[]).map(fn => (
                    <button
                      key={fn}
                      onClick={() => setLookupFn(fn)}
                      className={`py-2 rounded-xl text-sm font-semibold border transition-colors ${
                        lookupFn === fn
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lookup column */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Kolom Pencarian <span className="text-gray-400">(lookup_array)</span>
                </label>
                <SelectField
                  value={lookupCol}
                  onChange={v => setLookupCol(v as Column)}
                  options={COLUMNS.map(c => ({ value: c.key, label: `Kol ${c.colLetter} — ${c.label}` }))}
                />
              </div>

              {/* Lookup value */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nilai yang Dicari <span className="text-gray-400">(lookup_value)</span>
                </label>
                <input
                  type="text"
                  value={lookupValue}
                  onChange={e => setLookupValue(e.target.value)}
                  placeholder="Ketik nilai pencarian…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {lookupValue && allMatches.length > 0 && allMatches.length < EMPLOYEES.length && (
                  <p className="text-xs text-emerald-600 mt-0.5">{allMatches.length} baris cocok</p>
                )}
              </div>

              {/* Return column */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Kolom Hasil <span className="text-gray-400">(return_array)</span>
                </label>
                <SelectField
                  value={returnCol}
                  onChange={v => setReturnCol(v as Column)}
                  options={COLUMNS.map(c => ({ value: c.key, label: `Kol ${c.colLetter} — ${c.label}` }))}
                />
              </div>
            </div>
          </div>

          {/* Formula output */}
          <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] p-4 space-y-3">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Formula</p>
            <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-3">
              <p className="text-[10px] text-emerald-400/60 mb-1">{lookupFn}</p>
              <code className="text-xs text-emerald-300 break-all leading-relaxed">{formula}</code>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
              <p className="text-[10px] text-gray-600 mb-1">Alternatif ({lookupFn === 'XLOOKUP' ? 'VLOOKUP' : 'XLOOKUP'})</p>
              <code className="text-xs text-gray-500 break-all leading-relaxed">{altFormula}</code>
            </div>
          </div>

          {/* Result card */}
          <div className={`rounded-2xl p-5 border ${
            result
              ? 'bg-emerald-500 text-white border-emerald-500'
              : lookupValue
              ? 'bg-red-50 border-red-100'
              : 'bg-gray-50 border-gray-100'
          }`}>
            {result ? (
              <>
                <p className="text-sm opacity-80">Hasil Ditemukan</p>
                <p className="text-3xl font-bold mt-1">{fmtValue(returnCol, result[returnCol])}</p>
                <p className="text-sm opacity-70 mt-1">
                  {returnColInfo.colLetter}:{EMPLOYEES.indexOf(result) + 2} — {result.name}
                </p>
              </>
            ) : lookupValue ? (
              <>
                <p className="text-sm text-red-600 font-semibold">#N/A</p>
                <p className="text-xs text-red-500 mt-1">Nilai tidak ditemukan di kolom {lookupColInfo.label}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Masukkan nilai pencarian untuk melihat hasil</p>
            )}
          </div>
        </div>

        {/* ── Data Table ── */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <h2 className="font-semibold text-gray-800 text-sm">Tabel Data Karyawan</h2>
              <span className="text-xs text-gray-400">{EMPLOYEES.length} baris · 7 kolom (A–G)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-400">#</th>
                    {COLUMNS.map(col => (
                      <th
                        key={col.key}
                        className={`px-3 py-2 text-left font-medium whitespace-nowrap ${
                          col.key === lookupCol
                            ? 'text-blue-600 bg-blue-50'
                            : col.key === returnCol
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="text-gray-400 mr-1">{col.colLetter}</span>
                        {col.label}
                        {col.key === lookupCol && <span className="ml-1 text-[9px] bg-blue-100 text-blue-600 px-1 rounded">lookup</span>}
                        {col.key === returnCol && col.key !== lookupCol && <span className="ml-1 text-[9px] bg-emerald-100 text-emerald-600 px-1 rounded">return</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map((emp, i) => {
                    const isExact = result?.emp_id === emp.emp_id
                    const isPartial = !isExact && allMatches.some(m => m.emp_id === emp.emp_id)
                    return (
                      <tr
                        key={emp.emp_id}
                        className={`border-t border-gray-50 transition-colors ${
                          isExact
                            ? 'bg-emerald-50'
                            : isPartial
                            ? 'bg-blue-50/50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-400">{i + 2}</td>
                        {COLUMNS.map(col => (
                          <td
                            key={col.key}
                            className={`px-3 py-2 whitespace-nowrap ${
                              col.key === lookupCol && isExact
                                ? 'font-semibold text-blue-700'
                                : col.key === returnCol && isExact
                                ? 'font-bold text-emerald-700'
                                : 'text-gray-700'
                            }`}
                          >
                            {col.key === 'salary'
                              ? 'Rp ' + Number(emp[col.key]).toLocaleString('id-ID')
                              : String(emp[col.key])}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-2 border-t border-gray-100 flex gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-200 inline-block" /> kolom pencarian</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-200 inline-block" /> kolom hasil</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-100 inline-block border border-emerald-300" /> baris cocok</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectField({
  value, onChange, options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none text-sm border border-gray-200 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}
