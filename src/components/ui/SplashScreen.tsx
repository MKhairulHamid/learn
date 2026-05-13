import { BookOpen } from 'lucide-react'

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/40">
          <BookOpen size={24} className="text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">DataLearn</span>
      </div>

      {/* Indeterminate progress bar */}
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full animate-slide-progress" />
      </div>
    </div>
  )
}
