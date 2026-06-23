import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  Gamepad2, 
  Sun,
  Moon,
  Activity,
  Clapperboard
} from 'lucide-react';
import WeeklySchedule from './components/WeeklySchedule';
import GameSpinner from './components/GameSpinner';
import MovieTracker from './components/MovieTracker';
import { ErrorBoundary } from './components/ErrorBoundary';

export const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {}
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'game' | 'movies'>('schedule');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-[#f8f7fc] dark:bg-[#0c0a14] font-sans text-slate-900 dark:text-slate-100 selection:bg-violet-500/10 dark:selection:bg-violet-500/30 pb-16 relative overflow-hidden">
        {/* Background Decorative Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[65%] bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Central Brand Header */}
        <header className="bg-white/85 dark:bg-[#151221]/85 backdrop-blur-md border-b border-rose-100/30 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-505 rounded-2xl shadow-md shadow-violet-100 dark:shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-violet-400/20">
                <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-slate-900 dark:text-[#f0ecf9] flex items-center gap-1.5">
                  Multi-Spinner <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-extrabold">Hub</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-[#7a6f94] font-medium leading-none mt-1">Semua keputusan seru ada disini!</p>
              </div>
            </div>

            {/* Navigation Tabs bar & Theme Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <div className="bg-slate-100 dark:bg-[#1e1a2e] p-1 rounded-2xl flex items-center relative gap-1 border border-slate-200/50 dark:border-slate-800 shadow-inner">
                {/* Tab: Schedule */}
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`relative px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 z-10 cursor-pointer ${
                    activeTab === 'schedule' ? 'text-violet-600 dark:text-[#f0ecf9]' : 'text-slate-500 dark:text-[#7a6f94] hover:text-slate-800 dark:hover:text-[#b8b0cb]'
                  }`}
                >
                  {activeTab === 'schedule' && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-white dark:bg-[#151221] rounded-xl shadow-sm border border-slate-200/20 dark:border-slate-700/50 dark:shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Calendar className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 font-display">Jadwal Mingguan</span>
                </button>

                {/* Tab: Game Spinner */}
                <button
                  onClick={() => setActiveTab('game')}
                  className={`relative px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 z-10 cursor-pointer ${
                    activeTab === 'game' ? 'text-violet-600 dark:text-[#f0ecf9]' : 'text-slate-500 dark:text-[#7a6f94] hover:text-slate-800 dark:hover:text-[#b8b0cb]'
                  }`}
                >
                  {activeTab === 'game' && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-white dark:bg-[#151221] rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-750/20 dark:shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Gamepad2 className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 font-display">Game Spinner</span>
                </button>

                {/* Tab: Movie Tracker */}
                <button
                  onClick={() => setActiveTab('movies')}
                  className={`relative px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-2 z-10 cursor-pointer ${
                    activeTab === 'movies' ? 'text-violet-600 dark:text-[#f0ecf9]' : 'text-slate-500 dark:text-[#7a6f94] hover:text-slate-800 dark:hover:text-[#b8b0cb]'
                  }`}
                >
                  {activeTab === 'movies' && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-white dark:bg-[#151221] rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-750/20 dark:shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Clapperboard className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 font-display">Daftar Film</span>
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-white dark:bg-[#1e1a2e] hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-[#f0ecf9] transition-all border border-slate-200/50 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-500/50 cursor-pointer flex items-center justify-center self-stretch md:self-auto shadow-xs"
                aria-label="Toggle Theme"
                title="Ganti Tema"
              >
                {theme === 'light' ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="max-w-6xl mx-auto px-4 mt-8 relative z-10">
          <ErrorBoundary errorMessage="Gagal memuat konten utama aplikasi Multi-Spinner Hub. Silakan reload atau bersihkan sisa cache data lokal Anda.">
            <AnimatePresence mode="wait">
              {activeTab === 'schedule' ? (
                <motion.div
                  key="schedule-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <ErrorBoundary errorMessage="Terjadi kesalahan saat memuat modul Jadwal Mingguan kegiatan. Silakan muat ulang halaman.">
                    <WeeklySchedule />
                  </ErrorBoundary>
                </motion.div>
              ) : activeTab === 'game' ? (
                <motion.div
                  key="game-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <ErrorBoundary errorMessage="Terjadi kesalahan saat memuat modul Game Spinner Bertingkat. Silakan muat ulang halaman atau kosongkan data lokal.">
                    <GameSpinner />
                  </ErrorBoundary>
                </motion.div>
              ) : (
                <motion.div
                  key="movies-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <ErrorBoundary errorMessage="Terjadi kesalahan saat memuat modul Buku Sinema Pribadi. Silakan muat ulang halaman atau kosongkan data lokal.">
                    <MovieTracker />
                  </ErrorBoundary>
                </motion.div>
              )}
            </AnimatePresence>
          </ErrorBoundary>
        </main>

        <footer className="max-w-6xl mx-auto px-4 mt-16 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold">
          <div className="h-px bg-slate-200 dark:bg-slate-800 mb-6" />
          <p>© {new Date().getFullYear()} Multi-Spinner Hub • Dibuat dengan presisi untuk kenyamanan bermainmu</p>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}
