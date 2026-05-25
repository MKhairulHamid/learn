import { useState, useMemo } from 'react'
import { Calculator, Info, RefreshCw } from 'lucide-react'
import { Badge } from '../components/ui/Badge'

// ── Indonesia Statutory Constants (2024) ─────────────────────────────

const PTKP: Record<string, number> = {
  'TK/0': 54_000_000,
  'TK/1': 58_500_000,
  'TK/2': 63_000_000,
  'TK/3': 67_500_000,
  'K/0':  58_500_000,
  'K/1':  63_000_000,
  'K/2':  67_500_000,
  'K/3':  72_000_000,
}

// PPh 21 progressive brackets (annual)
const TAX_BRACKETS = [
  { limit:    60_000_000, rate: 0.05 },
  { limit:   250_000_000, rate: 0.15 },
  { limit:   500_000_000, rate: 0.25 },
  { limit: 5_000_000_000, rate: 0.30 },
  { limit: Infinity,      rate: 0.35 },
]

// BPJS Kesehatan salary cap
const BPJS_KES_CAP = 12_000_000
// BPJS JP salary cap (2024)
const BPJS_JP_CAP  =  9_559_600

function calcProgressiveTax(pkp: number): number {
  if (pkp <= 0) return 0
  let tax = 0
  let prev = 0
  for (const { limit, rate } of TAX_BRACKETS) {
    if (pkp <= prev) break
    const slice = Math.min(pkp, limit) - prev
    tax += slice * rate
    prev = limit
  }
  return tax
}

const fmt = (n: number) =>
  'Rp ' + Math.round(n).toLocaleString('id-ID')

const pct = (n: number) =>
  (n * 100).toFixed(1) + '%'

// ── Component ─────────────────────────────────────────────────────────

interface Inputs {
  grossMonthly: string
  ptkpStatus: string
  hasNpwp: boolean
  bonusMonthly: string
  overtimeMonthly: string
}

const DEFAULT: Inputs = {
  grossMonthly: '8000000',
  ptkpStatus: 'TK/0',
  hasNpwp: true,
  bonusMonthly: '0',
  overtimeMonthly: '0',
}

export default function HrPlaygroundPage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT)

  const set = (k: keyof Inputs) => (v: string | boolean) =>
    setInputs(prev => ({ ...prev, [k]: v }))

  const result = useMemo(() => {
    const gross = parseFloat(inputs.grossMonthly.replace(/[^0-9.]/g, '')) || 0
    const bonus = parseFloat(inputs.bonusMonthly.replace(/[^0-9.]/g, '')) || 0
    const ot    = parseFloat(inputs.overtimeMonthly.replace(/[^0-9.]/g, '')) || 0
    const totalGross = gross + bonus + ot

    // ── BPJS Kesehatan ────────────────────────────────────────────────
    const bpjsKesBase      = Math.min(totalGross, BPJS_KES_CAP)
    const bpjsKesEmployee  = bpjsKesBase * 0.01   // 1%
    const bpjsKesEmployer  = bpjsKesBase * 0.04   // 4%

    // ── BPJS Ketenagakerjaan ─────────────────────────────────────────
    // JHT
    const jhtEmployee = totalGross * 0.02    // 2%
    const jhtEmployer = totalGross * 0.037   // 3.7%

    // JP (capped)
    const jpBase      = Math.min(totalGross, BPJS_JP_CAP)
    const jpEmployee  = jpBase * 0.01        // 1%
    const jpEmployer  = jpBase * 0.02        // 2%

    // JKK (employer only, standard rate 0.24%)
    const jkk = totalGross * 0.0024

    // JKM (employer only, 0.3%)
    const jkm = totalGross * 0.003

    // ── PPh 21 ────────────────────────────────────────────────────────
    const grossAnnual   = totalGross * 12
    // Biaya Jabatan: 5% of gross, max Rp 6M/year
    const biayaJabatan  = Math.min(grossAnnual * 0.05, 6_000_000)
    // Employee BPJS deductions (annual)
    const bpjsAnnual    = (bpjsKesEmployee + jhtEmployee + jpEmployee) * 12
    // Net Income = gross - biaya jabatan - bpjs
    const netIncome     = grossAnnual - biayaJabatan - bpjsAnnual
    // PKP = Net - PTKP
    const ptkpAmt       = PTKP[inputs.ptkpStatus] ?? 54_000_000
    const pkp           = Math.max(netIncome - ptkpAmt, 0)
    // Annual tax
    let annualTax = calcProgressiveTax(pkp)
    // Non-NPWP surcharge 20%
    if (!inputs.hasNpwp) annualTax *= 1.2
    const monthlyTax = annualTax / 12

    // ── Take-home ─────────────────────────────────────────────────────
    const totalDeductions = bpjsKesEmployee + jhtEmployee + jpEmployee + monthlyTax
    const takeHome        = totalGross - totalDeductions

    // Employer cost
    const employerCost = totalGross + bpjsKesEmployer + jhtEmployer + jpEmployer + jkk + jkm

    return {
      totalGross, takeHome, totalDeductions,
      bpjsKesEmployee, bpjsKesEmployer,
      jhtEmployee, jhtEmployer,
      jpEmployee, jpEmployer,
      jkk, jkm,
      monthlyTax, annualTax, pkp, ptkpAmt,
      biayaJabatan, bpjsAnnual, netIncome, grossAnnual,
      employerCost,
      effectiveRate: gross > 0 ? monthlyTax / totalGross : 0,
    }
  }, [inputs])

  const reset = () => setInputs(DEFAULT)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Calculator size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Net Salary Calculator</h1>
            <p className="text-xs text-gray-500">Indonesia Statutory — PPh 21, BPJS Kesehatan &amp; Ketenagakerjaan</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Badge variant="primary" size="sm">PPh 21 Progressive</Badge>
          <Badge variant="gray" size="sm">BPJS Kesehatan</Badge>
          <Badge variant="gray" size="sm">JHT · JP · JKK · JKM</Badge>
          <Badge variant="gray" size="sm">Peraturan 2024</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Inputs ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-sm">Input Data Karyawan</h2>
              <button onClick={reset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-4">
              <NumberField
                label="Gaji Pokok (Gross)"
                value={inputs.grossMonthly}
                onChange={set('grossMonthly')}
                hint="Sebelum potongan apapun"
              />
              <NumberField
                label="Bonus / Tunjangan Bulanan"
                value={inputs.bonusMonthly}
                onChange={set('bonusMonthly')}
                hint="Opsional"
              />
              <NumberField
                label="Lembur Bulanan"
                value={inputs.overtimeMonthly}
                onChange={set('overtimeMonthly')}
                hint="Opsional"
              />

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Status PTKP
                </label>
                <select
                  value={inputs.ptkpStatus}
                  onChange={e => set('ptkpStatus')(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  {Object.entries(PTKP).map(([k, v]) => (
                    <option key={k} value={k}>
                      {k} — {fmt(v / 12)}/bulan
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  TK = Tidak Kawin · K = Kawin · /n = tanggungan
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="npwp"
                  checked={inputs.hasNpwp}
                  onChange={e => set('hasNpwp')(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary-600"
                />
                <label htmlFor="npwp" className="text-sm text-gray-700">
                  Memiliki NPWP
                </label>
              </div>
              {!inputs.hasNpwp && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  Tanpa NPWP: PPh 21 dikenakan tarif 20% lebih tinggi.
                </p>
              )}
            </div>
          </div>

          {/* PPh 21 breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <Info size={14} className="text-primary-500" /> Detail PPh 21
            </h2>
            <div className="space-y-1.5 text-xs">
              <Row label="Penghasilan Bruto / tahun" value={fmt(result.grossAnnual)} />
              <Row label="Biaya Jabatan (5%, max Rp 6 jt)" value={`- ${fmt(result.biayaJabatan)}`} dim />
              <Row label="BPJS Employee / tahun" value={`- ${fmt(result.bpjsAnnual)}`} dim />
              <div className="border-t border-dashed border-gray-100 my-1" />
              <Row label="Penghasilan Neto" value={fmt(result.netIncome)} />
              <Row label={`PTKP (${inputs.ptkpStatus})`} value={`- ${fmt(result.ptkpAmt)}`} dim />
              <div className="border-t border-dashed border-gray-100 my-1" />
              <Row label="PKP (Penghasilan Kena Pajak)" value={fmt(result.pkp)} bold />
              <Row label="PPh 21 / tahun" value={fmt(result.annualTax)} />
              <Row label="PPh 21 / bulan" value={fmt(result.monthlyTax)} bold />
              <Row label={`Tarif Efektif`} value={pct(result.effectiveRate)} />
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Take-home card */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm opacity-80">Gaji Bersih (Take-home Pay)</p>
            <div className="text-4xl font-bold mt-1">{fmt(result.takeHome)}</div>
            <p className="text-sm opacity-70 mt-1">per bulan</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/15 rounded-xl p-3">
                <div className="text-xs opacity-80">Total Gaji Kotor</div>
                <div className="font-semibold">{fmt(result.totalGross)}</div>
              </div>
              <div className="bg-white/15 rounded-xl p-3">
                <div className="text-xs opacity-80">Total Potongan</div>
                <div className="font-semibold">- {fmt(result.totalDeductions)}</div>
              </div>
            </div>
          </div>

          {/* Employee deductions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">Potongan Karyawan / Bulan</h2>
            <div className="space-y-2">
              <DeductionRow
                label="PPh 21"
                sublabel="Progresif sesuai PKP"
                employee={result.monthlyTax}
                employer={0}
                showEmployer={false}
              />
              <DeductionRow
                label="BPJS Kesehatan"
                sublabel={`1% karyawan · 4% perusahaan (cap ${fmt(Math.min(result.totalGross, 12_000_000))})`}
                employee={result.bpjsKesEmployee}
                employer={result.bpjsKesEmployer}
              />
              <DeductionRow
                label="JHT (Jaminan Hari Tua)"
                sublabel="2% karyawan · 3.7% perusahaan"
                employee={result.jhtEmployee}
                employer={result.jhtEmployer}
              />
              <DeductionRow
                label="JP (Jaminan Pensiun)"
                sublabel={`1% karyawan · 2% perusahaan (cap ${fmt(BPJS_JP_CAP)})`}
                employee={result.jpEmployee}
                employer={result.jpEmployer}
              />
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex justify-between text-sm font-semibold text-gray-800">
                  <span>Total Potongan Karyawan</span>
                  <span className="text-red-600">- {fmt(result.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employer cost */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">Biaya Perusahaan / Bulan</h2>
            <div className="space-y-2 text-xs">
              <Row label="Gaji Kotor Karyawan" value={fmt(result.totalGross)} />
              <Row label="BPJS Kes (4%)" value={`+ ${fmt(result.bpjsKesEmployer)}`} dim />
              <Row label="JHT (3.7%)" value={`+ ${fmt(result.jhtEmployer)}`} dim />
              <Row label="JP (2%)" value={`+ ${fmt(result.jpEmployer)}`} dim />
              <Row label="JKK (0.24%)" value={`+ ${fmt(result.jkk)}`} dim />
              <Row label="JKM (0.3%)" value={`+ ${fmt(result.jkm)}`} dim />
              <div className="border-t border-gray-100 pt-2 mt-1">
                <div className="flex justify-between text-sm font-semibold text-gray-800">
                  <span>Total Cost to Company</span>
                  <span>{fmt(result.employerCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reference table */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <h2 className="font-semibold text-amber-800 text-sm mb-3">📋 Referensi Tarif BPJS 2024</h2>
            <div className="text-xs text-amber-700 space-y-1.5">
              <div className="grid grid-cols-3 gap-2 font-medium text-amber-900 pb-1 border-b border-amber-200">
                <span>Komponen</span><span className="text-center">Karyawan</span><span className="text-center">Perusahaan</span>
              </div>
              {[
                ['BPJS Kesehatan', '1%', '4%'],
                ['JHT', '2%', '3.7%'],
                ['JP', '1%', '2%'],
                ['JKK', '—', '0.24%'],
                ['JKM', '—', '0.3%'],
              ].map(([label, emp, er]) => (
                <div key={label} className="grid grid-cols-3 gap-2">
                  <span>{label}</span><span className="text-center">{emp}</span><span className="text-center">{er}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────

function NumberField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}

function Row({ label, value, dim, bold }: {
  label: string; value: string; dim?: boolean; bold?: boolean
}) {
  return (
    <div className={`flex justify-between ${dim ? 'text-gray-400' : bold ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  )
}

function DeductionRow({ label, sublabel, employee, employer, showEmployer = true }: {
  label: string; sublabel: string; employee: number; employer: number; showEmployer?: boolean
}) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
      <div className="text-right shrink-0 ml-4">
        <div className="text-sm font-medium text-red-600">- {fmt(employee)}</div>
        {showEmployer && (
          <div className="text-xs text-gray-400">+ {fmt(employer)} (perusahaan)</div>
        )}
      </div>
    </div>
  )
}
