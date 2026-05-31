/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { domToPng } from 'modern-screenshot';
import { 
  BookOpen, 
  Gamepad2, 
  Youtube, 
  Theater, 
  RotateCcw, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Download,
  Loader2
} from 'lucide-react';

// Activities definition
const ACTIVITIES = [
  { 
    id: 'webtoon', 
    name: 'Baca Webtoon', 
    icon: BookOpen, 
    color: 'bg-emerald-500', 
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-200',
    shadow: 'shadow-emerald-200'
  },
  { 
    id: 'game', 
    name: 'Main Game', 
    icon: Gamepad2, 
    color: 'bg-indigo-500', 
    textColor: 'text-indigo-500',
    borderColor: 'border-indigo-200',
    shadow: 'shadow-indigo-200'
  },
  { 
    id: 'youtube', 
    name: 'Nonton Youtube', 
    icon: Youtube, 
    color: 'bg-rose-500', 
    textColor: 'text-rose-500',
    borderColor: 'border-rose-200',
    shadow: 'shadow-rose-200'
  },
  { 
    id: 'film', 
    name: 'Film/Buku', 
    icon: Theater, 
    color: 'bg-amber-500', 
    textColor: 'text-amber-500',
    borderColor: 'border-amber-200',
    shadow: 'shadow-amber-200'
  },
];

const DAYS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu'
];

export default function App() {
  const [schedule, setSchedule] = useState<(any | null)[]>(new Array(7).fill(null));
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSpinningIndex, setCurrentSpinningIndex] = useState(-1);
  const [spinningActivity, setSpinningActivity] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

  const generateSchedule = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    // 1. Pre-generate final results
    const finalResults = Array.from({ length: 7 }, () => 
      ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]
    );
    
    // 2. Pre-generate placeholders so no day is empty from the start
    const placeholders = Array.from({ length: 7 }, () => 
      ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]
    );
    
    setSchedule(placeholders);
    setSpinningActivity(null);
    
    let dayIndex = 0;

    const animateDay = () => {
      if (dayIndex >= 7) {
        setIsSpinning(false);
        setCurrentSpinningIndex(-1);
        setSpinningActivity(null);
        return;
      }

      setCurrentSpinningIndex(dayIndex);
      
      const spinDuration = 600;
      const startTime = Date.now();
      
      const updateSpin = () => {
        const now = Date.now();
        if (now - startTime < spinDuration) {
          // Visual spinning effect for the active day
          setSpinningActivity(ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)]);
          requestAnimationFrame(updateSpin);
        } else {
          // Settle the day with the final pre-generated activity
          setSchedule(prev => {
            const next = [...prev];
            next[dayIndex] = finalResults[dayIndex];
            return next;
          });
          
          dayIndex++;
          setTimeout(animateDay, 50);
        }
      };
      
      updateSpin();
    };

    animateDay();
  }, [isSpinning]);

  const downloadSchedule = async () => {
    if (!scheduleRef.current) return;
    
    setIsDownloading(true);
    try {
      // Ensure all images are loaded and animations are done
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await domToPng(scheduleRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        quality: 1,
      });
      
      const link = document.createElement('a');
      link.download = `jadwal-mingguan-${new Date().toLocaleDateString('id-ID')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Gagal mengunduh jadwal:', error);
      alert('Maaf, terjadi kesalahan saat mengunduh jadwal. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const isInitialState = schedule.every(s => s === null) && !isSpinning;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Weekly Activity Spinner</h1>
              <p className="text-sm text-slate-500 font-medium">Tentukan jadwal hiburanmu secara otomatis!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isInitialState && !isSpinning && (
              <button
                onClick={downloadSchedule}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                Unduh Gambar
              </button>
            )}
            
            <button
              onClick={generateSchedule}
              disabled={isSpinning}
              className={`
                flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-lg transition-all
                ${isSpinning 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200'}
              `}
            >
              {isSpinning ? (
                <RotateCcw className="w-5 h-5 animate-spin" />
              ) : (
                <RotateCcw className="w-5 h-5" />
              )}
              {!isInitialState ? 'Spin Ulang' : 'Mulai Spin'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Empty State */}
        {isInitialState && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-indigo-300" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Belum ada jadwal</h2>
            <p className="text-slate-500 max-w-md">
              Tekan tombol "Mulai Spin" di atas untuk membuatkanmu jadwal kegiatan hiburan selama seminggu penuh.
            </p>
          </motion.div>
        )}

        {/* Schedule Container for Download */}
        <div ref={scheduleRef} className="p-4 rounded-[3rem]">
          {/* Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DAYS.map((day, index) => {
              const activity = schedule[index];
              const isCurrentlySpinning = index === currentSpinningIndex;
              const displayActivity = isCurrentlySpinning ? spinningActivity : activity;
              const isSettled = !!activity && !isCurrentlySpinning;
              const isWaiting = !isInitialState && !displayActivity && !isCurrentlySpinning;

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative group overflow-hidden rounded-3xl border-2 transition-all duration-500 min-h-[260px] flex flex-col
                    ${isSettled 
                      ? `${displayActivity.borderColor} bg-white shadow-xl ${displayActivity.shadow}` 
                      : 'border-slate-200 bg-slate-50'}
                    ${isCurrentlySpinning ? 'border-indigo-400 ring-4 ring-indigo-100 bg-white' : ''}
                    ${isWaiting ? 'opacity-40' : 'opacity-100'}
                  `}
                >
                  {/* Day Label */}
                  <div className={`
                    px-6 py-4 border-b font-bold tracking-wider text-xs uppercase
                    ${isSettled ? 'border-slate-100 text-slate-400' : 'border-slate-200 text-slate-400'}
                  `}>
                    {day}
                  </div>

                  <div className="flex-1 p-8 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      {displayActivity ? (
                        <motion.div
                          key={displayActivity.id + (isCurrentlySpinning ? '-spin' : '-settled')}
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.8 }}
                          className="flex flex-col items-center text-center"
                        >
                          <div className={`
                            p-5 rounded-2xl mb-4 transition-colors duration-300
                            ${displayActivity.color} text-white shadow-lg
                          `}>
                            <displayActivity.icon className="w-10 h-10" />
                          </div>
                          <h3 className={`text-lg font-bold ${displayActivity.textColor}`}>
                            {displayActivity.name}
                          </h3>
                          
                          {isSettled && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              SETTLED
                            </motion.div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center opacity-10">
                          <div className="w-16 h-16 bg-slate-300 rounded-2xl mb-4" />
                          <div className="h-4 w-24 bg-slate-300 rounded-full" />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Decorative background element */}
                  {isSettled && (
                    <div className={`
                      absolute -bottom-6 -right-6 w-24 h-24 opacity-5 pointer-events-none
                      ${displayActivity.textColor}
                    `}>
                      <displayActivity.icon className="w-full h-full" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Summary / Stats in Download */}
          {!isInitialState && !isSpinning && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Ringkasan Mingguan
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ACTIVITIES.map(activity => {
                  const count = schedule.filter(s => s && s.id === activity.id).length;
                  if (count === 0) return null;
                  return (
                    <div key={activity.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${activity.color} text-white`}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900 leading-none">{count}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Hari</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400 text-sm font-medium">
        <p>© 2026 Weekly Activity Spinner • Dibuat untuk kesenanganmu</p>
      </footer>
    </div>
  );
}
