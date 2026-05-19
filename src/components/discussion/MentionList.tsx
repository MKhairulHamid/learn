import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

interface MentionItem { id: string; label: string }

interface Props {
  items: MentionItem[]
  command: (item: MentionItem) => void
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export const MentionList = forwardRef<MentionListRef, Props>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        setSelectedIndex(i => (i + items.length - 1) % items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex(i => (i + 1) % items.length)
        return true
      }
      if (event.key === 'Enter') {
        if (items[selectedIndex]) command(items[selectedIndex])
        return true
      }
      return false
    },
  }))

  if (!items.length) return null

  return (
    <div className="z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-52">
      {items.map((item, i) => (
        <button
          key={item.id}
          onClick={() => command(item)}
          className={`cursor-pointer flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left transition-colors ${
            i === selectedIndex ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
            {item.label[0]?.toUpperCase()}
          </span>
          {item.label}
        </button>
      ))}
    </div>
  )
})

MentionList.displayName = 'MentionList'
