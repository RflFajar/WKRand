import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, History, Calendar, Gamepad2, Layers } from 'lucide-react';
import { SpinResult } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface SpinHistoryProps {
  history: SpinResult[];
  onClearHistory: () => void;
}

export default function SpinHistory({ history, onClearHistory }: SpinHistoryProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const formatIndonesianDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4c9a8]/30 dark:border-[#4b463e]/30 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f2ede3] dark:bg-[#3d3527] text-[#a23b2c] dark:text-[#ff816c] border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 rounded-[4px]">
            <History className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">Riwayat Hasil Spin</h3>
            <p className="text-[10px] text-stone-500 font-medium">
              Menampilkan hingga 50 hasil putaran spinner game terakhir
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-650/30 rounded-[4px] text-[10px] font-display font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus Riwayat
          </button>
        )}
      </div>

      {/* Table / List Container */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-center">
          <div className="p-3 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-stone-500 mb-4">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">Belum Ada Riwayat</h4>
          <p className="text-[11px] text-stone-500 mt-1 max-w-sm">
            Putarlah spinner game di atas untuk melihat riwayat keputusan game yang pernah terpilih di sini.
          </p>
        </div>
      ) : (
        <div className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] overflow-hidden shadow-tactile">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2ede3] dark:bg-[#3d3527] border-b border-[#d4c9a8]/50 dark:border-[#4b463e]/50 text-[10px] font-display font-bold text-stone-550 dark:text-stone-350 uppercase tracking-wider">
                  <th className="py-3 px-6">Waktu Spin</th>
                  <th className="py-3 px-6">Kategori</th>
                  <th className="py-3 px-6">Game Terpilih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4c9a8]/30 dark:divide-[#4b463e]/30">
                {history.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-[#f2ede3]/30 dark:hover:bg-[#32302a]/30 transition-colors text-stone-700 dark:text-stone-300 text-xs font-bold"
                  >
                    <td className="py-3 px-6 font-medium text-stone-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#d4c9a8] dark:text-[#4b463e]" />
                        {formatIndonesianDate(item.timestamp)}
                      </div>
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#a23b2c] dark:text-[#ff816c]" />
                        {item.categoryName}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-[#a23b2c] dark:text-[#ff816c] font-display font-bold">
                        <Gamepad2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        {item.gameName}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card / List View */}
          <div className="block md:hidden divide-y divide-[#d4c9a8]/30 dark:divide-[#4b463e]/30 text-stone-700 dark:text-stone-300 text-xs">
            {history.map((item) => (
              <div key={item.id} className="p-4 space-y-2 bg-[#fdfaf2] dark:bg-[#2d2820] hover:bg-[#f2ede3]/30 dark:hover:bg-[#32302a]/30">
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatIndonesianDate(item.timestamp)}
                  </span>
                  <span className="bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8]/50 dark:border-[#4b463e]/50 px-1.5 py-0.5 rounded-[2px] text-[9px] font-display font-bold uppercase text-stone-550 dark:text-stone-350">
                    {item.categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#a23b2c] dark:text-[#ff816c] font-display font-bold">
                  <Gamepad2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{item.gameName}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#f2ede3]/50 dark:bg-[#3d3527]/50 border-t border-[#d4c9a8]/40 dark:border-[#4b463e]/40 px-6 py-2.5 text-[9px] font-display font-bold uppercase tracking-wider text-stone-500 text-right">
            Menampilkan {history.length} entri terbaru
          </div>
        </div>
      )}

      {/* Confirmation Dialog to Clear History */}
      <ConfirmDialog
        isOpen={showConfirmClear}
        title="Hapus Semua Riwayat"
        message="Apakah kamu yakin ingin menghapus seluruh riwayat hasil spin? Aksi ini tidak dapat dibatalkan."
        onConfirm={() => {
          onClearHistory();
          setShowConfirmClear(false);
        }}
        onCancel={() => setShowConfirmClear(false)}
      />
    </div>
  );
}
