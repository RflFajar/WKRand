import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Gamepad2, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  Trash2, 
  XCircle, 
  AlertCircle,
  HelpCircle,
  CalendarDays
} from 'lucide-react';
import { SpinResult, GameCategory } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface SpinStatsProps {
  history: SpinResult[];
  categories: GameCategory[];
  onClearHistory: () => void;
}

export default function SpinStats({ history, categories, onClearHistory }: SpinStatsProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // 1. Total Spin
  const totalSpins = history.length;

  if (totalSpins === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-4 text-slate-400 dark:text-slate-550">
          <BarChart3 className="w-8 h-8 text-indigo-500" />
        </div>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Data Statistik</h4>
        <p className="text-xs text-slate-400 dark:text-slate-550 mt-1 max-w-sm">
          Putarlah spinner game untuk mulai merekam data dan melihat analisis dari pilihan game kamu di sini.
        </p>
      </div>
    );
  }

  // 2. Top 5 games
  const gameCounts: Record<string, { count: number; category: string }> = {};
  history.forEach(item => {
    if (!gameCounts[item.gameName]) {
      gameCounts[item.gameName] = { count: 0, category: item.categoryName };
    }
    gameCounts[item.gameName].count += 1;
  });

  const topGames = Object.entries(gameCounts)
    .map(([name, info]) => ({ name, count: info.count, category: info.category }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxGameCount = topGames.length > 0 ? topGames[0].count : 1;

  // 3. Top 3 categories
  const categoryCounts: Record<string, number> = {};
  history.forEach(item => {
    categoryCounts[item.categoryName] = (categoryCounts[item.categoryName] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const maxCategoryCount = topCategories.length > 0 ? topCategories[0].count : 1;

  // 4. Never selected games
  const allGames = categories.flatMap(cat => 
    cat.games.map(g => ({ gameName: g.name, categoryName: cat.name, categoryColor: cat.color }))
  );
  const selectedGameNames = new Set(history.map(item => item.gameName));
  const neverSelected = allGames.filter(g => !selectedGameNames.has(g.gameName));

  // 5. Average spins per day over the last 7 calendar days (including today)
  const now = new Date();
  const midnightToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Calculate boundary for 7 calendar days ago (start of 6 days before today)
  const sevenDaysAgoStart = new Date(midnightToday);
  sevenDaysAgoStart.setDate(midnightToday.getDate() - 6);

  const last7DaysSpins = history.filter(item => item.timestamp >= sevenDaysAgoStart.getTime());
  const avgSpinsPerDay = (last7DaysSpins.length / 7).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-2xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Statistik Penggunaan</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
              Analisis preferensi kategori dan game yang paling sering kamu putar
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-xl text-xs font-bold transition hover:shadow-sm cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Reset Statistik
        </button>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Spin */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
              Total Putaran
            </span>
            <span className="text-2xl font-black text-slate-850 dark:text-slate-100 leading-none">
              {totalSpins} <span className="text-xs font-medium text-slate-400 dark:text-slate-500">kali</span>
            </span>
          </div>
        </div>

        {/* Rata-Rata per Hari */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
              Rata-Rata (7 Hari)
            </span>
            <span className="text-2xl font-black text-slate-850 dark:text-slate-100 leading-none">
              {avgSpinsPerDay} <span className="text-xs font-medium text-slate-400 dark:text-slate-500">spin / hari</span>
            </span>
          </div>
        </div>

        {/* Belum Terpilih */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
              Game Belum Terpilih
            </span>
            <span className="text-2xl font-black text-slate-850 dark:text-slate-100 leading-none">
              {neverSelected.length} <span className="text-xs font-medium text-slate-400 dark:text-slate-500">game</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Game */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-500" />
            Top 5 Game Paling Sering Terpilih
          </h4>
          <div className="space-y-4">
            {topGames.map((game, index) => {
              const pct = (game.count / maxGameCount) * 105; // Relative percentage normalized to highest count
              return (
                <div key={game.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">#{index + 1}</span>
                      <span>{game.name}</span>
                    </div>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{game.count} kali</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-550 dark:bg-indigo-550 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">
                    Kategori: {game.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 3 Kategori */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            Top 3 Kategori Terfavorit
          </h4>
          <div className="space-y-5">
            {topCategories.map((cat, index) => {
              const pct = (cat.count / maxCategoryCount) * 100;
              return (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">#{index + 1}</span>
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{cat.count} kali</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-550"
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Never Selected Games Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-violet-500" />
          Game yang Belum Pernah Terpilih
        </h4>

        {neverSelected.length === 0 ? (
          <div className="flex items-center gap-3 py-4 px-5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-955 rounded-2xl text-xs text-indigo-700 dark:text-indigo-400 font-bold">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
            <span>Semua game di dalam daftar sudah pernah terpilih di spinner! Prestasi luar biasa! 🎉</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Berikut adalah daftar game yang didaftarkan di kategori kustom atau bawaan kamu yang belum beruntung terpilih oleh jarum spinner:
            </p>
            {/* Badges Container */}
            <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1 pb-1">
              {neverSelected.map((game, idx) => (
                <div 
                  key={`${game.gameName}-${idx}`}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 border border-slate-150 dark:border-slate-800 flex items-center gap-2 transition"
                >
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: game.categoryColor }} 
                  />
                  <span>{game.gameName}</span>
                  <span className="text-[9px] font-black uppercase text-slate-400 px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-900 max-w-[120px] truncate">
                    {game.categoryName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmReset}
        title="Reset Semua Statistik"
        message="Aksi ini akan menghapus seluruh data statistik dan riwayat hasil putaran spinner game. Aksi ini tidak dapat dibatalkan. Apakah kamu yakin?"
        onConfirm={() => {
          onClearHistory();
          setShowConfirmReset(false);
        }}
        onCancel={() => setShowConfirmReset(false)}
      />
    </div>
  );
}
