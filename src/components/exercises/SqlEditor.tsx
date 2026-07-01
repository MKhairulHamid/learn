import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
  // Invoked on Cmd/Ctrl+Enter, so learners can run without reaching for the button.
  onRun?: () => void
}

export function SqlEditor({ value, onChange, height = '180px', readOnly = false, onRun }: SqlEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  // Keep the latest onRun so the bound Monaco command never goes stale.
  const onRunRef = useRef(onRun)
  useEffect(() => { onRunRef.current = onRun }, [onRun])

  const isMobile = window.innerWidth < 768

  if (isMobile) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); onRunRef.current?.() }
        }}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full font-mono text-sm bg-transparent text-green-400 p-4 resize-none focus:outline-none"
        style={{ height, minHeight: '120px' }}
        placeholder="Write your SQL query here..."
      />
    )
  }

  return (
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
        padding: { top: 14, bottom: 14 },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        folding: false,
        lineDecorationsWidth: 0,
        renderLineHighlight: 'all',
        scrollbar: { vertical: 'auto', horizontal: 'hidden' },
      }}
      onMount={(ed, monaco) => {
        editorRef.current = ed
        ed.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.())
      }}
    />
  )
}
