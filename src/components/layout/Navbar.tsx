import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Menu, X, Globe, BookOpen, LogOut,
  LayoutDashboard, Code2, ShieldCheck,
  User, ChevronDown, Terminal,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

export function Navbar() {
  const { t, i18n } = useTranslation('common')
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const currentLang = i18n.resolvedLanguage === 'id' ? 'id' : 'en'

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === 'en' ? 'id' : 'en')
  }

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await signOut()
    navigate('/')
  }

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? 'text-primary-600 font-semibold'
      : 'text-gray-600 hover:text-primary-600'

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  const isAdmin = profile?.role === 'admin'

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-700 font-bold text-lg shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span>DataLearn</span>
          </Link>

          {/* Desktop nav links */}
          {user && (
            <div className="hidden md:flex items-center gap-5">
              <Link to="/dashboard" className={`text-sm transition-colors ${isActive('/dashboard')}`}>
                {t('nav.dashboard')}
              </Link>
              <Link to="/curriculum" className={`text-sm transition-colors ${isActive('/curriculum')}`}>
                {t('nav.curriculum')}
              </Link>
              <Link to="/playground" className={`text-sm transition-colors ${isActive('/playground')}`}>
                SQL
              </Link>
              <Link to="/python" className={`text-sm transition-colors ${isActive('/python')}`}>
                Python
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-sm transition-colors flex items-center gap-1 ${isActive('/admin')}`}
                >
                  <ShieldCheck size={14} />
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-100"
            >
              <Globe size={15} />
              <span className="text-xs font-medium">
                {currentLang === 'id' ? 'IND' : 'ENG'}
              </span>
            </button>

            {user ? (
              /* ── User avatar + dropdown ── */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="hidden md:flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm text-gray-700 max-w-[100px] truncate">
                    {profile?.full_name ?? user.email}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-lg py-1.5 z-50">
                    {/* User info header */}
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {profile?.full_name ?? 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={15} className="text-gray-400" />
                      Profile & Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ShieldCheck size={15} className="text-yellow-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{profile?.full_name ?? 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="h-px bg-gray-100 mb-1" />

              <MobileLink to="/dashboard"  icon={<LayoutDashboard size={16} />} label={t('nav.dashboard')}   onClick={() => setMobileOpen(false)} />
              <MobileLink to="/curriculum" icon={<BookOpen size={16} />}        label={t('nav.curriculum')}  onClick={() => setMobileOpen(false)} />
              <MobileLink to="/playground" icon={<Code2 size={16} />}           label="SQL Playground"       onClick={() => setMobileOpen(false)} />
              <MobileLink to="/python"     icon={<Terminal size={16} />}        label="Python Playground"    onClick={() => setMobileOpen(false)} />
              <MobileLink to="/profile"    icon={<User size={16} />}            label="Profile & Settings"   onClick={() => setMobileOpen(false)} />

              {isAdmin && (
                <MobileLink to="/admin" icon={<ShieldCheck size={16} className="text-yellow-500" />} label="Admin Dashboard" onClick={() => setMobileOpen(false)} />
              )}

              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false) }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} />
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setMobileOpen(false) }}
                className="block w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                {t('nav.login')}
              </button>
              <button onClick={() => { navigate('/register'); setMobileOpen(false) }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg">
                {t('nav.register')}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

function MobileLink({ to, icon, label, onClick }: {
  to: string; icon: React.ReactNode; label: string; onClick: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
