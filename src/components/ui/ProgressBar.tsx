interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showText?: boolean
  size?: 'sm' | 'md'
}

export function ProgressBar({ value, max, label, showText = true, size = 'md' }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0

  return (
    <div className="w-full">
      {(label || showText) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showText && <span className="text-sm font-medium text-gray-700">{value}/{max}</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className="bg-primary-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
