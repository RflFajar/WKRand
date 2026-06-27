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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#221e18]/70 backdrop-blur-xs">
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-default" onClick={onCancel} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] shadow-tactile p-6 md:p-8 z-10 overflow-hidden rounded-[4px]"
          >
            {/* Top Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 bg-[#f2ede3] dark:bg-[#3d3527] hover:bg-[#d4c9a8]/30 border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] rounded-[4px] transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-[#f2ede3] dark:bg-[#3d3527] text-[#a23b2c] dark:text-[#ff816c] rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-stone-450">
                  {message}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-[#f2ede3] dark:bg-[#32302a] border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] rounded-[4px] text-xs font-display font-bold cursor-pointer hover:bg-[#d4c9a8]/20 transition-all"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-[#a23b2c] dark:bg-[#ff816c] hover:bg-opacity-90 text-white dark:text-[#221e18] rounded-[4px] border border-[#a23b2c] dark:border-[#ff816c] text-xs font-display font-bold cursor-pointer transition-all"
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
