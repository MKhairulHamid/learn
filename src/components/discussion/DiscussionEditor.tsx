import { useState } from 'react'
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import tippy from 'tippy.js'
import { MentionList } from './MentionList'
import type { MentionListRef } from './MentionList'
import { fetchMentionUsers } from '../../hooks/useDiscussion'
import {
  Bold, Italic, Underline as UnderlineIcon,
  Code, List, ListOrdered, SquareCode, Send, X,
} from 'lucide-react'

interface Props {
  placeholder?: string
  onSubmit: (body: object) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
  autoFocus?: boolean
}

export function DiscussionEditor({
  placeholder = 'Ask a question or share a thought…',
  onSubmit,
  onCancel,
  submitLabel = 'Post',
  autoFocus = false,
}: Props) {
  const [isEmpty, setIsEmpty] = useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable h1-h6 — not needed in discussion
        heading: false,
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: {
          items: async ({ query }: { query: string }) =>
            query.length < 3 ? [] : fetchMentionUsers(query),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (): any => {
            let component: ReactRenderer<MentionListRef>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let popup: any[]

            return {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onStart(props: any) {
                component = new ReactRenderer(MentionList, { props, editor: props.editor })
                if (!props.clientRect) return
                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                })
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onUpdate(props: any) {
                component.updateProps(props)
                if (!props.clientRect) return
                popup[0]?.setProps({ getReferenceClientRect: props.clientRect })
              },
              onKeyDown(props: { event: KeyboardEvent }) {
                if (props.event.key === 'Escape') { popup[0]?.hide(); return true }
                return component.ref?.onKeyDown(props) ?? false
              },
              onExit() {
                popup[0]?.destroy()
                component.destroy()
              },
            }
          },
        },
      }),
    ],
    onCreate({ editor }) { setIsEmpty(editor.isEmpty) },
    onUpdate({ editor }) { setIsEmpty(editor.isEmpty) },
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2.5 text-gray-800',
      },
    },
  })

  async function handleSubmit() {
    if (!editor || isEmpty) return
    const json = editor.getJSON()
    await onSubmit(json)
    editor.commands.clearContent()
  }

  if (!editor) return null

  const ToolBtn = ({
    active, onClick, children, title,
  }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`cursor-pointer p-1.5 rounded-md transition-colors ${
        active
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
        <ToolBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={14} />
        </ToolBtn>
        <span className="w-px h-4 bg-gray-200 mx-1" />
        <ToolBtn title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={14} />
        </ToolBtn>
        <ToolBtn title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <SquareCode size={14} />
        </ToolBtn>
        <span className="w-px h-4 bg-gray-200 mx-1" />
        <ToolBtn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={14} />
        </ToolBtn>
        <ToolBtn title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={14} />
        </ToolBtn>
        <span className="text-xs text-gray-400 ml-auto pr-1 hidden sm:block">Type @ to mention</span>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Action row */}
      <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={13} />
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isEmpty}
          className="cursor-pointer flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={13} />
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
