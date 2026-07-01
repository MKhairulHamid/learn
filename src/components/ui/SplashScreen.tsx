export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-8">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center h-12 px-3 bg-primary-600 rounded-2xl shadow-lg shadow-primary-900/40">
          <img
            src={`${import.meta.env.BASE_URL}brand/talentiv-logo-white.webp`}
            alt="Talentiv"
            className="h-6 w-auto"
          />
        </span>
        <span className="text-2xl font-bold text-white tracking-tight">Learning</span>
      </div>

      {/* Indeterminate progress bar */}
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full animate-slide-progress" />
      </div>
    </div>
  )
}
