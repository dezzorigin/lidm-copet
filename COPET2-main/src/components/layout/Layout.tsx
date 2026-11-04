import { useGameEngine } from '../../hooks/useGameEngine';
import { useTheme } from '../../contexts/ThemeContext';
import { Shield, Trophy, Activity, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { userPoints, masteredCount, setMode } = useGameEngine();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/20 relative transition-colors duration-300">
      {/* Light/Dark Playful Dot-Matrix Background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(99,102,241,0.06)_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] bg-size-[24px_24px] transition-all"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/75 dark:bg-gray-800/80 backdrop-blur-md border-b border-indigo-100/80 dark:border-gray-700/80 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setMode('home')}
          >
            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors" />
            <h1 className="text-xl font-bold tracking-wider text-slate-800 dark:text-white" title="Counter Penipuan Terintegrasi">
              CO<span className="text-pink-500 font-black">PET</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4 font-bold">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700/60 text-slate-500 dark:text-slate-400 transition-all active:scale-90"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-900/50 shadow-sm transition-all">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{userPoints} PTS</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-900/50 shadow-sm transition-all">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span>{masteredCount} MASTERED</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
