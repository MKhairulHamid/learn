import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, BookOpen, Code2, Terminal, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function MobileNav() {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const tabs = [
    { to: '/dashboard',  icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/curriculum', icon: BookOpen,         label: t('nav.curriculum') },
    { to: '/playground', icon: Code2,            label: 'SQL' },
    { to: '/python',     icon: Terminal,         label: 'Python' },
    { to: '/profile',    icon: User,             label: 'Profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="grid grid-cols-5">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                active ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
