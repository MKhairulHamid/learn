import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gray'
  size?: 'sm' | 'md'
}

const variants = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-600',
}

export function Badge({ children, variant = 'gray', size = 'sm' }: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      ${variants[variant]}
    `}>
      {children}
    </span>
  )
}
