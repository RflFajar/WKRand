import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  Cloud, 
  CloudCheck, 
  RefreshCw, 
  LogOut, 
  ChevronDown, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export const UserAccountButton: React.FC = () => {
  const { user, loading, syncStatus, lastSyncedAt, logout, saveDataToCloud, fetchDataFromCloud } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    try {
      setIsManualSyncing(true);
      setSyncFeedback(null);
      await saveDataToCloud();
      setSyncFeedback('Data berhasil disinkronkan ke Cloud!');
      setTimeout(() => setSyncFeedback(null), 3000);
    } catch (err) {
      setSyncFeedback('Gagal menyinkronkan data.');
    } finally {
      setIsManualSyncing(false);
    }
  };

  const handlePullCloud = async () => {
    try {
      setIsManualSyncing(true);
      setSyncFeedback(null);
      await fetchDataFromCloud();
      setSyncFeedback('Data dari Cloud berhasil ditarik!');
      setTimeout(() => setSyncFeedback(null), 3000);
    } catch (err) {
      setSyncFeedback('Gagal menarik data cloud.');
    } finally {
      setIsManualSyncing(false);
    }
  };

  const formatSyncTime = (timestamp: number | null) => {
    if (!timestamp) return 'Belum pernah';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' +
           date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="h-8 w-24 bg-stone-200/50 dark:bg-stone-800/50 animate-pulse rounded-[4px]" />
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {user ? (
        // Logged in User Button
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] shadow-tactile text-[#3d3527] dark:text-[#e8dcc4] hover:border-[#a23b2c] dark:hover:border-[#ff816c] transition cursor-pointer text-xs group"
          title="Pengaturan Akun & Sinkronisasi"
        >
          {/* Avatar or Initial */}
          <div className="w-5 h-5 rounded-full bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] flex items-center justify-center font-display font-bold text-[10px] overflow-hidden shrink-0">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()
            )}
          </div>

          <span className="font-display font-bold uppercase tracking-wider text-[11px] max-w-[100px] truncate hidden sm:inline-block">
            {user.displayName || user.email?.split('@')[0] || 'Akun'}
          </span>

          {/* Sync Status Icon */}
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            {syncStatus === 'syncing' || isManualSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
            ) : syncStatus === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Cloud className="w-3.5 h-3.5" />
            )}
          </div>

          <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition" />
        </button>
      ) : (
        // Guest / Not Logged In Button
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] rounded-[4px] shadow-tactile hover:opacity-90 transition cursor-pointer text-xs font-display font-bold uppercase tracking-wider"
          title="Masuk untuk menyimpan data ke akun Anda"
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Simpan ke Akun</span>
        </button>
      )}

      {/* Dropdown Menu for Logged In User */}
      {user && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#fdfaf2] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] shadow-2xl p-4 z-50 text-xs text-[#3d3527] dark:text-[#e8dcc4] animate-in fade-in zoom-in-95 duration-100">
          {/* Top Library card accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#a23b2c] dark:bg-[#ff816c] rounded-t-[3px]" />

          {/* User Info Header */}
          <div className="pb-3 border-b border-[#d4c9a8]/40 dark:border-[#4b463e]/40 mt-1">
            <p className="font-display font-bold uppercase tracking-wide text-xs text-[#a23b2c] dark:text-[#ff816c] truncate">
              {user.displayName || 'Pengguna Terdaftar'}
            </p>
            <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
              {user.email}
            </p>
          </div>

          {/* Sync Status Box */}
          <div className="py-3 border-b border-[#d4c9a8]/40 dark:border-[#4b463e]/40 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-stone-500 dark:text-stone-400">Status Cloud:</span>
              <span className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                Aktif & Terhubung
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
              <span>Sinkron terakhir:</span>
              <span>{formatSyncTime(lastSyncedAt)}</span>
            </div>

            {syncFeedback && (
              <div className="text-[10px] font-mono p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-[2px] text-center border border-emerald-200 dark:border-emerald-800">
                {syncFeedback}
              </div>
            )}

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isManualSyncing}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-[#f5efe3] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] hover:bg-[#ede4d4] dark:hover:bg-[#383227] rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isManualSyncing ? 'animate-spin' : ''}`} />
                <span>Unggah</span>
              </button>

              <button
                type="button"
                onClick={handlePullCloud}
                disabled={isManualSyncing}
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-[#f5efe3] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] hover:bg-[#ede4d4] dark:hover:bg-[#383227] rounded-[3px] font-mono text-[10px] font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
              >
                <Cloud className="w-3 h-3" />
                <span>Tarik Data</span>
              </button>
            </div>
          </div>

          {/* Logout Action */}
          <div className="pt-3">
            <button
              type="button"
              onClick={async () => {
                setIsDropdownOpen(false);
                await logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-[3px] text-xs font-display font-bold uppercase tracking-wider transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UserAccountButton;
