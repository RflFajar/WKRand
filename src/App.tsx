import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  Sun, 
  Moon, 
  HelpCircle,
  Archive,
  FileText,
  ListTodo
} from 'lucide-react';
import WeeklySchedule from './components/WeeklySchedule';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HelpModal, LicenseModal, ArchiveModal } from './components/FooterModals';

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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  const [rackCode, setRackCode] = useState(() => {
    const now = new Date();
    const months = ['JA', 'FE', 'MR', 'AP', 'MY', 'JN', 'JL', 'AU', 'SE', 'OC', 'NO', 'DE'];
    const monthStr = months[now.getMonth()];
    const dateStr = String(now.getDate()).padStart(2, '0');
    return `${monthStr}-${dateStr}`;
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

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

  useEffect(() => {
    const updateRackCode = () => {
      const now = new Date();
      const months = ['JA', 'FE', 'MR', 'AP', 'MY', 'JN', 'JL', 'AU', 'SE', 'OC', 'NO', 'DE'];
      const monthStr = months[now.getMonth()];
      const dateStr = String(now.getDate()).padStart(2, '0');
      setRackCode(`${monthStr}-${dateStr}`);
    };
    const interval = setInterval(updateRackCode, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-[#f5f0e6] dark:bg-[#221e18] font-sans text-[#3d3527] dark:text-[#e8dcc4] transition-colors duration-300 relative flex flex-col md:flex-row">
        
        {/* Left Sidebar - Tactile Drawer Cabinet */}
        <aside className="w-full md:w-64 bg-[#fdfaf2] dark:bg-[#2d2820] border-b md:border-b-0 md:border-r border-[#d4c9a8] dark:border-[#4b463e] flex flex-col p-5 shrink-0 relative z-20 md:h-screen md:sticky md:top-0 justify-between">
          <div>
            {/* Cabinet Label */}
            <div className="border-b-2 border-dashed border-[#d4c9a8] dark:border-[#4b463e] pb-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-display font-bold bg-[#a23b2c] text-white dark:bg-[#ff816c] dark:text-[#221e18] px-1.5 py-0.5 tracking-wider rounded-[2px] uppercase">
                  Rak {rackCode}
                </span>
                <span className="text-[9px] font-display text-slate-400 dark:text-stone-500 font-bold tracking-widest">
                  AKTIVITAS HARIAN
                </span>
              </div>
              <h2 className="text-md font-display font-bold tracking-tight text-[#3d3527] dark:text-[#e8dcc4] mt-2 uppercase">
                Perencana Aktivitas
              </h2>
              <p className="text-[10px] font-display text-slate-400 dark:text-stone-500 leading-tight">
                Jadwal & Pengacak Rutinitas Harian • 2026
              </p>
            </div>

            {/* Sidebar Quick Navigation & Actions */}
            <nav className="flex flex-col gap-2 w-full mt-5">
              <div className="px-3.5 py-2.5 rounded-[4px] font-display font-bold text-xs uppercase tracking-wider bg-[#3d3527] dark:bg-[#e8dcc4] text-[#fdfaf2] dark:text-[#221e18] border-[#3d3527] dark:border-[#e8dcc4] border-l-[4px] border-l-[#a23b2c] dark:border-l-[#ff816c] shadow-xs flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#ff816c] dark:text-[#a23b2c]" />
                <span>Jadwal Aktivitas</span>
              </div>

              <button
                onClick={() => {
                  const targetEl = document.getElementById('manage-activities-btn');
                  if (targetEl) {
                    targetEl.click();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="text-left px-3.5 py-2.5 rounded-[4px] font-display font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-stone-400 hover:bg-[#f2ede3]/60 dark:hover:bg-[#32302a]/60 border border-transparent transition cursor-pointer flex items-center gap-2.5"
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Kelola Aktivitas</span>
              </button>

              <button
                onClick={() => setIsArchiveOpen(true)}
                className="text-left px-3.5 py-2.5 rounded-[4px] font-display font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-stone-400 hover:bg-[#f2ede3]/60 dark:hover:bg-[#32302a]/60 border border-transparent transition cursor-pointer flex items-center gap-2.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Pusat Cadangan</span>
              </button>

              <button
                onClick={() => setIsHelpOpen(true)}
                className="text-left px-3.5 py-2.5 rounded-[4px] font-display font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-stone-400 hover:bg-[#f2ede3]/60 dark:hover:bg-[#32302a]/60 border border-transparent transition cursor-pointer flex items-center gap-2.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Buku Panduan</span>
              </button>
            </nav>
          </div>

          {/* Footer Controls & Quick Actions */}
          <div className="mt-6 md:mt-auto pt-4 border-t border-[#d4c9a8] dark:border-[#4b463e] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-display text-slate-400 dark:text-stone-500 font-bold uppercase tracking-wider">
                PENERANGAN:
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 bg-[#f2ede3] dark:bg-[#32302a] hover:bg-[#ede8de] dark:hover:bg-[#3d3527] rounded-[4px] text-[#3d3527] dark:text-[#e8dcc4] border border-[#d4c9a8] dark:border-[#4b463e] cursor-pointer"
                title="Ganti Penerangan (Tema)"
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-[#a23b2c]" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>

            {/* Vintage Rubber Stamp Button */}
            <button
              onClick={() => {
                const targetEl = document.getElementById('manage-activities-btn');
                if (targetEl) {
                  targetEl.click();
                  targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="w-full py-2.5 bg-[#a23b2c] hover:bg-[#8f3224] dark:bg-[#ff816c] dark:hover:bg-[#f8654d] text-white dark:text-[#221e18] font-display font-bold text-xs uppercase tracking-widest rounded-[4px] border border-[#a23b2c] dark:border-[#ff816c] shadow-[2px_2px_0px_#3d3527] dark:shadow-[2px_2px_0px_#11100d] transition duration-200 hover:translate-y-0.5 active:translate-y-1 active:shadow-none cursor-pointer"
            >
              KELOLA AKTIVITAS
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative dotted-bg">
          
          {/* Subtle Ledger Top Divider Bar */}
          <header className="border-b border-[#d4c9a8] dark:border-[#4b463e] py-2.5 px-4 md:px-6 bg-[#fdfaf2] dark:bg-[#2d2820] flex items-center justify-between text-xs font-display shrink-0 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="tracking-widest uppercase font-bold text-[#3d3527]/80 dark:text-[#e8dcc4]/80">
                Jadwal & Pengacak Aktivitas Harian
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 dark:text-stone-500 font-bold">
                SENIN — MINGGU
              </span>
            </div>
          </header>

          {/* Main Content Window */}
          <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto relative z-10">
            <ErrorBoundary errorMessage="Terjadi kesalahan saat memuat modul Jadwal Aktivitas Harian. Silakan muat ulang halaman.">
              <WeeklySchedule />
            </ErrorBoundary>
          </main>

          {/* Retro Ledger Footer */}
          <footer className="max-w-6xl w-full mx-auto px-6 py-8 mt-auto text-center text-slate-400 dark:text-stone-500 text-[10px] font-display">
            <div className="h-px bg-dashed border-t border-[#d4c9a8] dark:border-[#4b463e] mb-5" />
            <p className="uppercase tracking-widest">
              Dikatalogkan: 2026 • No. Rak: {rackCode} • Perencana Aktivitas Harian
            </p>
            <div className="flex justify-center gap-4 mt-2 font-bold text-slate-400/80 dark:text-stone-500/80 uppercase tracking-widest text-[9px]">
              <a href="#" onClick={(e) => { e.preventDefault(); setIsHelpOpen(true); }} className="hover:text-[#a23b2c] dark:hover:text-[#ff816c] transition">Bantuan</a>
              <span>•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLicenseOpen(true); }} className="hover:text-[#a23b2c] dark:hover:text-[#ff816c] transition">Lisensi</a>
              <span>•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsArchiveOpen(true); }} className="hover:text-[#a23b2c] dark:hover:text-[#ff816c] transition">Arsip Cadangan</a>
            </div>
          </footer>
        </div>
      </div>

      {/* Retro Document Dialogs */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <LicenseModal isOpen={isLicenseOpen} onClose={() => setIsLicenseOpen(false)} />
      <ArchiveModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />
    </ThemeContext.Provider>
  );
}


