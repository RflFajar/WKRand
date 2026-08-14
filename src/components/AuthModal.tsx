import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Jendela login ditutup sebelum selesai.');
      } else {
        setErrorMsg('Gagal masuk dengan Google: ' + (err.message || 'Terjadi kesalahan.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Harap isi semua kolom.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);

      if (tab === 'login') {
        await signInWithEmail(email.trim(), password);
        onClose();
      } else {
        if (password.length < 6) {
          setErrorMsg('Kata sandi minimal 6 karakter.');
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, displayName.trim());
        setSuccessMsg('Akun berhasil dibuat dan data telah disinkronkan!');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Email atau kata sandi tidak cocok.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Email ini sudah terdaftar. Silakan masuk.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Format alamat email tidak valid.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Kata sandi terlalu lemah (minimal 6 karakter).');
      } else {
        setErrorMsg(err.message || 'Terjadi kesalahan saat memproses akun.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="auth-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-[#fdfaf2] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] shadow-2xl relative overflow-hidden flex flex-col"
        >
          {/* Top Library Card Accent Bar */}
          <div className="h-1.5 bg-[#a23b2c] dark:bg-[#ff816c] w-full" />

          {/* Modal Header */}
          <div className="p-6 pb-4 flex items-start justify-between border-b border-[#d4c9a8]/35 dark:border-[#4b463e]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[3px] bg-[#a23b2c]/10 dark:bg-[#ff816c]/10 border border-[#a23b2c]/20 dark:border-[#ff816c]/20 flex items-center justify-center text-[#a23b2c] dark:text-[#ff816c]">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold uppercase tracking-wider text-[#3d3527] dark:text-[#e8dcc4]">
                  Sinkronisasi Akun Cloud
                </h3>
                <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  Data tersimpan permanen di akun Anda
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition p-1 rounded-sm cursor-pointer disabled:opacity-30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Quick Benefits Banner */}
            <div className="bg-[#f5efe3] dark:bg-[#2d2820] border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 rounded-[3px] p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-[#3d3527] dark:text-[#e8dcc4]/90 font-mono">
                Masuk untuk menyimpan Jadwal Mingguan, Game Spinner, Wishlist, dan Daftar Film Anda secara otomatis lintas perangkat atau browser.
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] hover:bg-stone-50 dark:hover:bg-[#383227] text-[#3d3527] dark:text-[#e8dcc4] rounded-[3px] shadow-xs text-xs font-display font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#d4c9a8]/50 dark:border-[#4b463e]/50 w-full" />
              <span className="bg-[#fdfaf2] dark:bg-[#221e18] px-2 text-[10px] font-mono text-stone-400 uppercase tracking-widest absolute">
                atau gunakan email
              </span>
            </div>

            {/* Tabs: Masuk / Daftar */}
            <div className="flex border-b border-[#d4c9a8]/40 dark:border-[#4b463e]/40">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 pb-2 text-xs font-display font-bold uppercase tracking-wider text-center cursor-pointer transition border-b-2 -mb-[1px] ${
                  tab === 'login'
                    ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
                    : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 pb-2 text-xs font-display font-bold uppercase tracking-wider text-center cursor-pointer transition border-b-2 -mb-[1px] ${
                  tab === 'register'
                    ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
                    : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                Daftar Akun
              </button>
            </div>

            {/* Error or Success Alert */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-[3px] flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[3px] flex items-start gap-2 text-emerald-700 dark:text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {tab === 'register' && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                    Nama / Panggilan
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Contoh: Rafli"
                      className="w-full pl-9 pr-3 py-2 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[3px] text-xs text-[#3d3527] dark:text-[#e8dcc4] focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[3px] text-xs text-[#3d3527] dark:text-[#e8dcc4] focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tab === 'register' ? 'Minimal 6 karakter' : 'Kata sandi Anda'}
                    className="w-full pl-9 pr-3 py-2 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[3px] text-xs text-[#3d3527] dark:text-[#e8dcc4] focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] rounded-[3px] text-xs font-display font-bold uppercase tracking-wider shadow-xs hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>{tab === 'login' ? 'Masuk ke Akun' : 'Daftar & Sinkron Data'}</span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default AuthModal;
