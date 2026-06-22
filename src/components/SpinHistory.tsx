import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, History, Calendar, Gamepad2, Layers, AlertCircle } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <History className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Riwayat Hasil Spin</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
              Menampilkan hingga 50 hasil putaran spinner game terakhir
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-xl text-xs font-bold transition hover:shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Riwayat
          </button>
        )}
      </div>

      {/* Table / List Container */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-900/10 text-center">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-4 text-slate-400 dark:text-slate-550">
            <History className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Riwayat</h4>
          <p className="text-xs text-slate-400 dark:text-slate-550 mt-1 max-w-sm">
            Putarlah spinner game di atas untuk melihat riwayat keputusan game yang pernah terpilih di sini.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <th className="py-4 px-6">Waktu Spin</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Game Terpilih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    <td className="py-3.5 px-6 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {formatIndonesianDate(item.timestamp)}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-400" />
                        {item.categoryName}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-extrabold font-sans">
                        <Gamepad2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        {item.gameName}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card / List View */}
          <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-xs">
            {history.map((item) => (
              <div key={item.id} className="p-4 space-y-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850">
                <div className="flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatIndonesianDate(item.timestamp)}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                    {item.categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-extrabold">
                  <Gamepad2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>{item.gameName}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 text-[10px] font-semibold text-slate-405 dark:text-slate-500 text-right">
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
