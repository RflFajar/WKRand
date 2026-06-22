import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  Gamepad2, 
  Sun,
  Moon,
  Activity
} from 'lucide-react';
import WeeklySchedule from './components/WeeklySchedule';
import GameSpinner from './components/GameSpinner';
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
  const [activeTab, setActiveTab] = useState<'schedule' | 'game'>('schedule');
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900/50 pb-16">
        {/* Central Brand Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl shadow-md shadow-indigo-100 dark:shadow-none">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50">Multi-Spinner Hub</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">Semua keputusan seru ada disini!</p>
              </div>
            </div>

            {/* Navigation Tabs bar & Theme Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <div className="bg-slate-150 dark:bg-slate-800 p-1 rounded-2xl flex items-center relative gap-1 border border-slate-200/50 dark:border-slate-700/50">
                {/* Tab: Schedule */}
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`relative px-4 py-2 rounded-xl font-extrabold text-xs md:text-sm transition-all flex items-center gap-2 z-10 cursor-pointer ${
                    activeTab === 'schedule' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {activeTab === 'schedule' && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-705/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Calendar className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Jadwal Mingguan</span>
                </button>

                {/* Tab: Game Spinner */}
                <button
                  onClick={() => setActiveTab('game')}
                  className={`relative px-4 py-2 rounded-xl font-extrabold text-xs md:text-sm transition-all flex items-center gap-2 z-10 cursor-pointer ${
                    activeTab === 'game' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {activeTab === 'game' && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/20 dark:border-slate-705/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Gamepad2 className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Game Spinner (Bertingkat)</span>
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-slate-200/40 dark:border-slate-700/40 cursor-pointer flex items-center justify-center self-stretch md:self-auto"
                aria-label="Toggle Theme"
                title="Ganti Tema"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="max-w-6xl mx-auto px-4 mt-8">
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
              ) : (
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
