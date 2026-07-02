import { useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function TableWrapper({ children }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto -mx-1 my-5">
      <table className="min-w-full">{children}</table>
    </div>
  )
}

// Passthrough pre — CodeBlock handles block rendering entirely.
function PreBlock({ children }: ComponentPropsWithoutRef<'pre'>) {
  return <>{children}</>
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      onClick={copy}
      className="text-xs text-gray-500 hover:text-gray-200 transition-colors px-2 py-0.5 rounded hover:bg-white/10"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// Flow diagrams → pills, fenced code → modern block, inline → badge.
function CodeBlock({ children, className }: ComponentPropsWithoutRef<'code'>) {
  const text = String(children).trim()
  const lang = className?.replace('language-', '') ?? ''
  const isBlock = !!lang || text.includes('\n')
  const isInlineFlow = text.includes('→') && !className
  // Vertical step diagrams: fenced block with no language that uses ↓ between steps
  const isVerticalFlow = !lang && text.includes('↓')

  if (isInlineFlow) {
    const steps = text.split('→').map(s => s.trim()).filter(Boolean)
    return (
      <div className="my-4 flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="bg-primary-50 border border-primary-200 text-primary-800 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span className="text-primary-400 font-bold text-sm">→</span>
            )}
          </span>
        ))}
      </div>
    )
  }

  if (isVerticalFlow) {
    // Split on lines that are only "↓" (with optional surrounding whitespace)
    const steps: string[] = []
    let current = ''
    for (const line of text.split('\n')) {
      if (line.trim() === '↓') {
        if (current.trim()) { steps.push(current.trim()); current = '' }
      } else {
        current += (current ? '\n' : '') + line
      }
    }
    if (current.trim()) steps.push(current.trim())

    return (
      <div className="my-5 not-prose flex flex-col">
        {steps.map((step, i) => {
          const arrowIdx = step.indexOf('→')
          const label = arrowIdx > -1 ? step.slice(0, arrowIdx).trim() : null
          const desc  = arrowIdx > -1 ? step.slice(arrowIdx + 1).trim() : step
          return (
            <div key={i}>
              <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
                {label ? (
                  <div className="flex flex-wrap gap-x-2 gap-y-1 items-baseline">
                    <span className="font-bold text-primary-700 text-sm shrink-0">{label}</span>
                    <span className="text-primary-400 shrink-0">→</span>
                    <span className="text-gray-700 text-sm">{desc}</span>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm m-0 whitespace-pre-wrap">{step}</p>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1.5">
                  <span className="text-primary-400 text-xl leading-none font-bold">↓</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (isBlock) {
    const langLabel: Record<string, string> = {
      sql: 'SQL', python: 'Python', js: 'JavaScript', ts: 'TypeScript',
      bash: 'Shell', sh: 'Shell', json: 'JSON', csv: 'CSV',
    }
    const displayLang = langLabel[lang.toLowerCase()] ?? lang.toUpperCase()

    return (
      <div className="not-prose my-5 rounded-xl overflow-hidden border border-gray-800/60 shadow-xl">
        <div className="flex items-center justify-between pl-4 pr-3 py-2.5 bg-[#161b22] border-b border-gray-700/60">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {displayLang && (
            <span className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">
              {displayLang}
            </span>
          )}
          <CopyButton text={text} />
        </div>
        <div className="bg-[#0d1117] overflow-x-auto">
          <code className="block px-5 py-4 text-[13px] font-mono text-[#c9d1d9] leading-[1.75] whitespace-pre">
            {children}
          </code>
        </div>
      </div>
    )
  }

  return (
    <code className="bg-primary-50 border border-primary-100 px-1.5 py-0.5 rounded-md text-[0.82em] font-mono text-primary-700 not-italic">
      {children}
    </code>
  )
}

const PROSE = `prose prose-sm sm:prose-base max-w-none
  prose-headings:text-gray-900 prose-headings:font-bold
  prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:first:mt-0
  prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
  prose-p:text-gray-700 prose-p:leading-relaxed
  prose-code:before:content-none prose-code:after:content-none
  prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold
  prose-td:py-2 prose-td:px-3
  prose-blockquote:border-primary-300 prose-blockquote:bg-primary-50
  prose-blockquote:rounded-r-xl prose-blockquote:py-2
  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
  prose-li:text-gray-700
  prose-strong:text-gray-900`

export function LessonMarkdown({ children }: { children: string }) {
  return (
    <div className={PROSE}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          pre: PreBlock,
          table: TableWrapper,
          img: ({ alt, src }) => (
            <img src={src} alt={alt ?? ''} className="max-w-full h-auto rounded-lg" />
          ),
        }}
      >
        {children || '*Content coming soon.*'}
      </ReactMarkdown>
    </div>
  )
}
