import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
}

export function SqlEditor({ value, onChange, height = '180px', readOnly = false }: SqlEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const isMobile = window.innerWidth < 768

  if (isMobile) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-xl border border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
        style={{ height, minHeight: '120px' }}
        placeholder="Write your SQL query here..."
      />
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700" style={{ height }}>
      <Editor
        height={height}
        defaultLanguage="sql"
        value={value}
        onChange={v => onChange(v ?? '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          readOnly,
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: false,
          lineDecorationsWidth: 0,
          renderLineHighlight: 'all',
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
        }}
        onMount={editor => { editorRef.current = editor }}
      />
    </div>
  )
}
