import { useState } from 'react';
import { 
  BarChart3, 
  Gamepad2, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  Trash2, 
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
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-center">
        <div className="p-3 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-stone-550 mb-4">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">Belum Ada Data Statistik</h4>
        <p className="text-[11px] text-stone-500 mt-1 max-w-sm">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4c9a8]/30 dark:border-[#4b463e]/30 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f2ede3] dark:bg-[#3d3527] text-[#a23b2c] dark:text-[#ff816c] border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 rounded-[4px]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">Statistik Penggunaan</h3>
            <p className="text-[10px] text-stone-500 font-medium">
              Analisis preferensi kategori dan game yang paling sering kamu putar
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-650/30 rounded-[4px] text-[10px] font-display font-bold uppercase tracking-wider transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Reset Statistik
        </button>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Spin */}
        <div className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-4 flex items-center gap-4 shadow-tactile">
          <div className="p-2.5 bg-[#f2ede3] dark:bg-[#3d3527] text-[#a23b2c] dark:text-[#ff816c] border border-[#d4c9a8]/50 dark:border-[#4b463e]/50 rounded-[4px]">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Total Putaran
            </span>
            <span className="text-xl font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] leading-none">
              {totalSpins} <span className="text-xs font-medium text-stone-500">kali</span>
            </span>
          </div>
        </div>

        {/* Rata-Rata per Hari */}
        <div className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-4 flex items-center gap-4 shadow-tactile">
          <div className="p-2.5 bg-[#f2ede3] dark:bg-[#3d3527] text-emerald-600 dark:text-emerald-400 border border-[#d4c9a8]/50 dark:border-[#4b463e]/50 rounded-[4px]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Rata-Rata (7 Hari)
            </span>
            <span className="text-xl font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] leading-none">
              {avgSpinsPerDay} <span className="text-xs font-medium text-stone-500">spin / hari</span>
            </span>
          </div>
        </div>

        {/* Belum Terpilih */}
        <div className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-4 flex items-center gap-4 shadow-tactile">
          <div className="p-2.5 bg-[#f2ede3] dark:bg-[#3d3527] text-[#a23b2c] dark:text-[#ff816c] border border-[#d4c9a8]/50 dark:border-[#4b463e]/50 rounded-[4px]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[9px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Game Belum Terpilih
            </span>
            <span className="text-xl font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] leading-none">
              {neverSelected.length} <span className="text-xs font-medium text-stone-500">game</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Game */}
        <div className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-5 shadow-tactile">
          <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] mb-5 flex items-center gap-2 uppercase tracking-wide">
            <Gamepad2 className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
            Top 5 Game Paling Sering Terpilih
          </h4>
          <div className="space-y-4">
            {topGames.map((game, index) => {
              const pct = (game.count / maxGameCount) * 105; // Relative percentage normalized to highest count
              return (
                <div key={game.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
                      <span className="text-stone-400 font-mono text-xs">#{index + 1}</span>
                      <span>{game.name}</span>
                    </div>
                    <span className="font-display font-bold text-[#a23b2c] dark:text-[#ff816c]">{game.count} kali</span>
                  </div>
                  <div className="w-full bg-[#f2ede3] dark:bg-[#3d3527] h-2 rounded-[2px] overflow-hidden border border-[#d4c9a8]/35 dark:border-[#4b463e]/35">
                    <div 
                      className="bg-[#a23b2c] dark:bg-[#ff816c] h-full rounded-none transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-stone-500 font-display font-bold uppercase tracking-wider">
                    Kategori: {game.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 3 Kategori */}
        <div className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-5 shadow-tactile">
          <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] mb-5 flex items-center gap-2 uppercase tracking-wide">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Top 3 Kategori Terfavorit
          </h4>
          <div className="space-y-5">
            {topCategories.map((cat, index) => {
              const pct = (cat.count / maxCategoryCount) * 100;
              return (
                <div key={cat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-stone-700 dark:text-stone-300">
                      <span className="text-stone-400 font-mono text-xs">#{index + 1}</span>
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-display font-bold text-[#a23b2c] dark:text-[#ff816c]">{cat.count} kali</span>
                  </div>
                  <div className="w-full bg-[#f2ede3] dark:bg-[#3d3527] h-2.5 rounded-[2px] overflow-hidden border border-[#d4c9a8]/35 dark:border-[#4b463e]/35">
                    <div 
                      className="bg-[#a23b2c] dark:bg-[#ff816c] h-full rounded-none transition-all duration-550"
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
      <div className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-5 shadow-tactile">
        <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] mb-4 flex items-center gap-2 uppercase tracking-wide">
          <CalendarDays className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
          Game yang Belum Pernah Terpilih
        </h4>

        {neverSelected.length === 0 ? (
          <div className="flex items-center gap-3 py-3 px-4 bg-emerald-500/10 border border-emerald-600/30 rounded-[4px] text-xs text-emerald-800 dark:text-emerald-350">
            <Sparkles className="w-4 h-4 text-emerald-650 dark:text-emerald-400 shrink-0" />
            <span className="font-display font-bold uppercase tracking-wide text-[10px]">Semua game di dalam daftar sudah pernah terpilih di spinner! Prestasi luar biasa! 🎉</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] text-stone-550 dark:text-stone-400 font-medium">
              Berikut adalah daftar game yang didaftarkan di kategori kustom atau bawaan kamu yang belum beruntung terpilih oleh jarum spinner:
            </p>
            {/* Badges Container */}
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 pb-1">
              {neverSelected.map((game, idx) => (
                <div 
                  key={`${game.gameName}-${idx}`}
                  className="px-2.5 py-1 bg-[#fdfaf2] dark:bg-[#2d2820] hover:bg-[#f2ede3]/30 dark:hover:bg-[#32302a]/30 text-xs font-bold rounded-[4px] text-stone-700 dark:text-stone-300 border border-[#d4c9a8]/70 dark:border-[#4b463e]/70 flex items-center gap-2 transition"
                >
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: game.categoryColor }} 
                  />
                  <span>{game.gameName}</span>
                  <span className="text-[9px] font-display font-bold uppercase text-stone-500 px-1.5 py-0.5 rounded-[2px] bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8]/30 dark:border-[#4b463e]/30 max-w-[120px] truncate">
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
