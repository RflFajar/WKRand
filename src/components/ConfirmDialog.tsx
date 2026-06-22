import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-default" onClick={onCancel} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-[#151221] rounded-3xl border border-slate-150 dark:border-[#2a2438] shadow-2xl dark:shadow-[0_0_30px_rgba(0,0,0,0.6)] p-6 md:p-8 z-10 overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-[#1e1a2e] hover:bg-slate-100 dark:hover:bg-[#2a2438] text-slate-500 hover:text-slate-755 dark:text-[#b8b0cb] rounded-full transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 text-[#f59e0b] dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/40 animate-pulse dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-display font-bold text-slate-850 dark:text-[#f0ecf9]">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-[#b8b0cb] font-medium leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={onCancel}
                className="flex-1 px-5 py-3 bg-slate-50 dark:bg-[#1e1a2e] hover:bg-slate-100 dark:hover:bg-[#2a2438] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#b8b0cb] rounded-2xl text-xs font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-5 py-3 bg-[#f59e0b] hover:bg-amber-650 text-white rounded-2xl text-xs font-bold shadow-md shadow-amber-200/50 dark:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition cursor-pointer"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
