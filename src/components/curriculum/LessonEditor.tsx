import { useState } from 'react'
import { Save, X, Eye, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { LessonMarkdown } from './LessonMarkdown'
import type { Session } from '../../types'

interface Props {
  session: Session
  onSaved: (updated: Session) => void
  onCancel: () => void
}

type Lang = 'id' | 'en'

export function LessonEditor({ session, onSaved, onCancel }: Props) {
  const [tab, setTab] = useState<Lang>('id')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title_id: session.title_id,
    title_en: session.title_en,
    learning_output_id: session.learning_output_id,
    learning_output_en: session.learning_output_en,
    content_id: session.content_id,
    content_en: session.content_en,
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  async function save() {
    setSaving(true)
    setError(null)
    const { data, error } = await supabase
      .from('sessions')
      .update(form)
      .eq('id', session.id)
      .select()
      .single()
    setSaving(false)
    if (error) { setError(error.message); return }
    onSaved(data as Session)
  }

  const titleKey = `title_${tab}` as const
  const outputKey = `learning_output_${tab}` as const
  const contentKey = `content_${tab}` as const

  return (
    <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-6 mb-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['id', 'en'] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setTab(l)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === l ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {l === 'id' ? 'Indonesian' : 'English'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setPreview(p => !p)}>
            {preview ? <Pencil size={15} /> : <Eye size={15} />}
            {preview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
            <X size={15} /> Cancel
          </Button>
          <Button size="sm" onClick={save} loading={saving}>
            <Save size={15} /> Save
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Title ({tab === 'id' ? 'Indonesian' : 'English'})
      </label>
      <input
        value={form[titleKey]}
        onChange={e => set(titleKey, e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
      />

      {/* Learning output */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Learning outcome ({tab === 'id' ? 'Indonesian' : 'English'})
      </label>
      <textarea
        value={form[outputKey]}
        onChange={e => set(outputKey, e.target.value)}
        rows={2}
        className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-200 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary-400"
      />

      {/* Content — markdown */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Lesson content — Markdown ({tab === 'id' ? 'Indonesian' : 'English'})
      </label>
      {preview ? (
        <div className="border border-gray-200 rounded-lg p-4 min-h-[300px]">
          <LessonMarkdown>{form[contentKey]}</LessonMarkdown>
        </div>
      ) : (
        <textarea
          value={form[contentKey]}
          onChange={e => set(contentKey, e.target.value)}
          rows={22}
          spellCheck={false}
          className="w-full px-3 py-3 rounded-lg border border-gray-200 font-mono text-[13px] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      )}
    </div>
  )
}
