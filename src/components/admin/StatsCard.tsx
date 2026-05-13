import type { ReactNode } from 'react'

interface StatsCardProps {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'purple'
}

const colors = {
  blue:   'bg-blue-950/40 border-blue-900 text-blue-400',
  green:  'bg-green-950/40 border-green-900 text-green-400',
  yellow: 'bg-yellow-950/40 border-yellow-900 text-yellow-400',
  purple: 'bg-purple-950/40 border-purple-900 text-purple-400',
}

export function StatsCard({ label, value, sub, icon, color = 'blue' }: StatsCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
