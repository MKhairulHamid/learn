import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import type { Exercise } from '../../types'

interface Props {
  exercise: Exercise
  onSaved: (updated: Exercise) => void
  onCancel: () => void
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-1">
      {label}
    </label>
    {children}
  </div>
)

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500'
const monoCls =
  'w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 font-mono text-[13px] text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-primary-500'

export function ExerciseEditor({ exercise, onSaved, onCancel }: Props) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title_id: exercise.title_id,
    title_en: exercise.title_en,
    description_id: exercise.description_id,
    description_en: exercise.description_en,
    difficulty: exercise.difficulty,
    starter_code: exercise.starter_code,
    solution_code: exercise.solution_code,
    hints_id: (exercise.hints_id ?? []).join('\n'),
    hints_en: (exercise.hints_en ?? []).join('\n'),
    test_cases: JSON.stringify(exercise.test_cases ?? [], null, 2),
  })

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    setError(null)
    let testCases: unknown
    try {
      testCases = JSON.parse(form.test_cases)
      if (!Array.isArray(testCases)) throw new Error('Test cases must be a JSON array')
    } catch (e) {
      setError(`Invalid test cases JSON: ${(e as Error).message}`)
      return
    }
    setSaving(true)
    const payload = {
      title_id: form.title_id,
      title_en: form.title_en,
      description_id: form.description_id,
      description_en: form.description_en,
      difficulty: form.difficulty,
      starter_code: form.starter_code,
      solution_code: form.solution_code,
      hints_id: form.hints_id.split('\n').map(s => s.trim()).filter(Boolean),
      hints_en: form.hints_en.split('\n').map(s => s.trim()).filter(Boolean),
      test_cases: testCases,
    }
    const { data, error } = await supabase
      .from('exercises')
      .update(payload)
      .eq('id', exercise.id)
      .select()
      .single()
    setSaving(false)
    if (error) { setError(error.message); return }
    onSaved(data as Exercise)
  }

  return (
    <div className="bg-gray-900 border border-primary-700/50 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-200">Edit exercise</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
            <X size={15} /> Cancel
          </Button>
          <Button size="sm" onClick={save} loading={saving}>
            <Save size={15} /> Save
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title (Indonesian)">
          <input value={form.title_id} onChange={e => set('title_id', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Title (English)">
          <input value={form.title_en} onChange={e => set('title_en', e.target.value)} className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Description (Indonesian)">
          <textarea value={form.description_id} onChange={e => set('description_id', e.target.value)} rows={3} className={monoCls} />
        </Field>
        <Field label="Description (English)">
          <textarea value={form.description_en} onChange={e => set('description_en', e.target.value)} rows={3} className={monoCls} />
        </Field>
      </div>

      <Field label="Difficulty">
        <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </Field>

      <Field label="Starter code">
        <textarea value={form.starter_code} onChange={e => set('starter_code', e.target.value)} rows={4} spellCheck={false} className={monoCls} />
      </Field>
      <Field label="Solution code">
        <textarea value={form.solution_code} onChange={e => set('solution_code', e.target.value)} rows={4} spellCheck={false} className={monoCls} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Hints — Indonesian (one per line)">
          <textarea value={form.hints_id} onChange={e => set('hints_id', e.target.value)} rows={3} className={monoCls} />
        </Field>
        <Field label="Hints — English (one per line)">
          <textarea value={form.hints_en} onChange={e => set('hints_en', e.target.value)} rows={3} className={monoCls} />
        </Field>
      </div>

      <Field label="Test cases (JSON array)">
        <textarea value={form.test_cases} onChange={e => set('test_cases', e.target.value)} rows={10} spellCheck={false} className={monoCls} />
      </Field>
    </div>
  )
}
