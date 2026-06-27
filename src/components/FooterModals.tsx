import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  HelpCircle, 
  FileText, 
  Archive, 
  Download, 
  Upload, 
  Trash2, 
  Calendar, 
  Gamepad2, 
  Clapperboard, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

/* ==========================================================================
   COMMON RETRO MODAL CONTAINER
   ========================================================================== */
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

function BaseModal({ isOpen, onClose, title, icon, children, maxWidth = 'max-w-2xl' }: BaseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#221e18]/70 backdrop-blur-xs">
          {/* Backdrop click */}
          <div className="absolute inset-0 cursor-default" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${maxWidth} bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] shadow-tactile p-6 md:p-8 z-10 overflow-hidden rounded-[4px] card-margin-line max-h-[90vh] flex flex-col`}
          >
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-[#d4c9a8]/40 dark:border-[#4b463e]/40 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#f2ede3] dark:bg-[#3d3527] text-[#a23b2c] dark:text-[#ff816c] border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 rounded-[4px]">
                  {icon}
                </div>
                <h3 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wider">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 bg-[#f2ede3] dark:bg-[#3d3527] hover:bg-[#d4c9a8]/30 border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] rounded-[4px] transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inner scrollable area */}
            <div className="flex-1 overflow-y-auto pr-1 py-4 text-stone-700 dark:text-stone-300">
              {children}
            </div>

            {/* Footer stamp */}
            <div className="border-t border-[#d4c9a8]/30 dark:border-[#4b463e]/30 pt-3 text-right text-[8px] font-mono uppercase text-stone-400 dark:text-stone-500 tracking-widest shrink-0">
              Katalog Kehidupan • Arsip Resmi • 2026
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================================
   1. BANTUAN (HELP MODAL)
   ========================================================================== */
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeGuide, setActiveGuide] = useState<'harian' | 'game' | 'film' | 'fitur'>('harian');

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Buku Panduan Penggunaan" 
      icon={<HelpCircle className="w-5 h-5" />}
    >
      {/* Tabs */}
      <div className="flex border-b border-[#d4c9a8]/30 dark:border-[#4b463e]/30 mb-5 shrink-0 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveGuide('harian')}
          className={`py-2 px-3 text-[10px] font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeGuide === 'harian'
              ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
              : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-[#3d3527] dark:hover:text-[#e8dcc4]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Harian (Aktivitas)
        </button>
        <button
          onClick={() => setActiveGuide('game')}
          className={`py-2 px-3 text-[10px] font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeGuide === 'game'
              ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
              : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-[#3d3527] dark:hover:text-[#e8dcc4]'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          Game (Spinner)
        </button>
        <button
          onClick={() => setActiveGuide('film')}
          className={`py-2 px-3 text-[10px] font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeGuide === 'film'
              ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
              : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-[#3d3527] dark:hover:text-[#e8dcc4]'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5" />
          Film (Koleksi)
        </button>
        <button
          onClick={() => setActiveGuide('fitur')}
          className={`py-2 px-3 text-[10px] font-display font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeGuide === 'fitur'
              ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
              : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-[#3d3527] dark:hover:text-[#e8dcc4]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          Fitur Tambahan
        </button>
      </div>

      {/* Guide Content */}
      <div className="space-y-4 text-xs leading-relaxed">
        {activeGuide === 'harian' && (
          <div className="space-y-3">
            <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
              Panduan Weekly Activity Planner
            </h4>
            <p>
              Modul ini dirancang agar Anda dapat mengalokasikan aktivitas hiburan harian secara adil dan menyenangkan.
            </p>
            <div className="bg-[#f2ede3]/50 dark:bg-[#3d3527]/40 border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 p-4 rounded-[4px] space-y-2.5">
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">1.</span>
                <p><strong>Kelola Aktivitas:</strong> Klik tombol <span className="underline">Kelola Aktivitas</span> untuk menambah, mengedit, atau menghapus aktivitas kustom yang ingin dimainkan sepanjang minggu.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">2.</span>
                <p><strong>Isi Acak / Manual:</strong> Anda bisa memutar roda secara otomatis untuk memilih aktivitas di hari tertentu, atau memasukkannya secara manual ke slot jadwal.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">3.</span>
                <p><strong>Ekspor Jadwal:</strong> Simpan jadwal yang telah dibuat menjadi file teks ringkas, gambar <strong>PNG beresolusi tinggi</strong> untuk dipajang di media sosial, atau bagikan langsung!</p>
              </div>
            </div>
          </div>
        )}

        {activeGuide === 'game' && (
          <div className="space-y-3">
            <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
              Panduan Nested Spinner Game
            </h4>
            <p>
              Bingung mau main game apa? Gunakan sistem dua putaran (Nested Spinner) yang dinamis untuk menentukan game pilihan Anda secara adil.
            </p>
            <div className="bg-[#f2ede3]/50 dark:bg-[#3d3527]/40 border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 p-4 rounded-[4px] space-y-2.5">
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">1.</span>
                <p><strong>Putaran Pertama:</strong> Sistem akan mengacak kategori game (misalnya PC, Mobile, Retro, atau Konsol). Anda hanya perlu menekan tombol <span className="underline">PUTAR KATEGORI</span>.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">2.</span>
                <p><strong>Putaran Kedua:</strong> Setelah kategori terpilih, roda spinner otomatis berganti isi dengan daftar game yang terdaftar di dalam kategori tersebut. Tekan <span className="underline">PUTAR GAME!</span> untuk menentukan game akhir.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">3.</span>
                <p><strong>Kelola Kategori:</strong> Masuk ke panel pengelola untuk menambah kategori baru, menyusun game baru, dan menyesuaikan warna tema roda spinner sesuka hati.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">4.</span>
                <p><strong>Riwayat & Statistik:</strong> Gulir ke bawah roda spinner untuk melihat riwayat putaran sebelumnya dan analisis statistik kegemaran game Anda.</p>
              </div>
            </div>
          </div>
        )}

        {activeGuide === 'film' && (
          <div className="space-y-3">
            <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide flex items-center gap-1.5">
              <Clapperboard className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
              Panduan Buku Sinema Pribadi
            </h4>
            <p>
              Buat perpustakaan digital untuk film, serial, anime, atau dokumenter yang telah selesai Anda tonton sebagai kenang-kenangan.
            </p>
            <div className="bg-[#f2ede3]/50 dark:bg-[#3d3527]/40 border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 p-4 rounded-[4px] space-y-2.5">
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">1.</span>
                <p><strong>Catat Tontonan:</strong> Isi judul film, berikan rating bintang (1-5), tulis ulasan pribadi Anda yang jujur, pilih platform menonton (Netflix, Bioskop, Disney+, dll.), dan atur tanggal tonton.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">2.</span>
                <p><strong>Filter & Cari:</strong> Gunakan kotak pencarian judul, filter genre, atau urutan rating untuk menemukan catatan sinema Anda dengan sekejap.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">3.</span>
                <p><strong>Analisis Ringkas:</strong> Di bagian atas tab Film, sistem menyajikan statistik total tontonan, rata-rata rating, dan genre film yang paling sering Anda saksikan.</p>
              </div>
            </div>
          </div>
        )}

        {activeGuide === 'fitur' && (
          <div className="space-y-3">
            <h4 className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
              Panduan Audio & Kustomisasi Tema
            </h4>
            <p>
              Bentuk aplikasi yang nyaman di mata dan telinga demi menjaga estetika retro "katalog kartu perpustakaan" yang taktil.
            </p>
            <div className="bg-[#f2ede3]/50 dark:bg-[#3d3527]/40 border border-[#d4c9a8]/60 dark:border-[#4b463e]/60 p-4 rounded-[4px] space-y-2.5">
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">●</span>
                <p><strong>Pengendali Suara (Header):</strong> Tekan tombol speaker di bagian atas layar untuk mengaktifkan atau mematikan efek suara retro saat spinner berputar dan musik latar instrumen yang santai.</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">●</span>
                <p><strong>Tema Gelap & Terang:</strong> Klik tombol bulan/matahari di bagian atas untuk beralih antara tema "Kertas Tua Klasik" (terang) atau tema "Meja Kayu Redup" (gelap).</p>
              </div>
              <div className="flex gap-2">
                <span className="font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] shrink-0">●</span>
                <p><strong>Kode Rak Dinamis:</strong> Kode rak katalog perpustakaan di pojok kiri atas berganti secara dinamis menyesuaikan bulan dan tanggal hari ini (misalnya "JN-27") untuk menandai pencatatan arsip harian.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

/* ==========================================================================
   2. LISENSI (LICENSE MODAL)
   ========================================================================== */
interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LicenseModal({ isOpen, onClose }: LicenseModalProps) {
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Lisensi Penggunaan Digital" 
      icon={<FileText className="w-5 h-5" />}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5 text-xs text-center font-display leading-relaxed py-3">
        <div className="inline-block px-3 py-1 bg-[#a23b2c]/10 dark:bg-[#ff816c]/20 border border-[#a23b2c]/30 dark:border-[#ff816c]/30 text-[#a23b2c] dark:text-[#ff816c] text-[10px] font-bold uppercase tracking-widest rounded-[2px] mb-2">
          KATALOG KEHIDUPAN v2.0
        </div>
        
        <h4 className="text-sm font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">
          Lisensi Estetika & Kegunaan Mandiri
        </h4>

        <div className="h-px bg-dashed border-t border-[#d4c9a8] dark:border-[#4b463e] my-3" />

        <div className="text-left space-y-3 font-sans text-stone-600 dark:text-stone-300">
          <p>
            Aplikasi ini dilisensikan di bawah ketentuan <strong>Estetika Retro-Taktil Universal</strong>. Dengan mengakses dan memanfaatkan Katalog Kehidupan ini, Anda setuju dengan ketentuan berikut:
          </p>
          <ul className="space-y-2 list-disc list-inside pl-1 text-[11px]">
            <li><strong>Hak Privasi Penuh:</strong> Seluruh data disimpan secara lokal pada peramban Anda. Tidak ada data pribadi yang diunggah ke peladen luar demi menjaga privasi jurnal kehidupan Anda.</li>
            <li><strong>Kebebasan Personal:</strong> Anda bebas memanfaatkan katalog ini untuk mengatur aktivitas, mengacak keputusan game, serta mencatat daftar film favorit tanpa biaya apa pun (100% Gratis).</li>
            <li><strong>Modifikasi Terbuka:</strong> Anda diperbolehkan mengubah gaya desain, fontase, atau mekanika aplikasi untuk keperluan personal demi kenyamanan bersenang-senang di rumah.</li>
            <li><strong>Anti-Skeptis:</strong> Dilarang menggunakan sistem roda pengacak ini untuk memecah belah pertemanan. Hasil spinner bersifat mutlak, adil, dan wajib ditaati secara humoris!</li>
          </ul>
        </div>

        <div className="h-px bg-dashed border-t border-[#d4c9a8] dark:border-[#4b463e] my-3" />

        <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-relaxed">
          HAK CIPTA TERPELIHARA © 2026<br />
          DIBUAT DENGAN TINTA DIGITAL, KERTAS VIRTUAL, & LOGIKA MURNI.
        </div>
      </div>
    </BaseModal>
  );
}

/* ==========================================================================
   3. ARSIP DIGITAL (ARCHIVE/DATABASE MODAL)
   ========================================================================== */
interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchiveModal({ isOpen, onClose }: ArchiveModalProps) {
  const [importStatus, setImportStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gathers data from localStorage
  const getDatabaseBackup = () => {
    const backup: Record<string, string | null> = {};
    const keys = [
      'weekly_activities',
      'game_spinner_categories',
      'spin_history',
      'watched_movies_hub',
      'game_spinner_sound_enabled',
      'theme'
    ];
    
    keys.forEach(key => {
      backup[key] = localStorage.getItem(key);
    });

    return JSON.stringify(backup, null, 2);
  };

  // Handles Export Action
  const handleExport = () => {
    try {
      const dataStr = getDatabaseBackup();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `arsip-katalog-kehidupan-${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor data arsip.');
    }
  };

  // Handles Import Action
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string);
        
        if (typeof parsedData !== 'object' || parsedData === null) {
          throw new Error('Format arsip tidak valid.');
        }

        // Validate structure - check if at least one of our key stores is present (e.g. weekly_activities or watched_movies_hub)
        const validKeys = [
          'weekly_activities',
          'game_spinner_categories',
          'spin_history',
          'watched_movies_hub',
          'game_spinner_sound_enabled',
          'theme'
        ];

        let hasValidKey = false;
        validKeys.forEach(key => {
          if (key in parsedData) {
            hasValidKey = true;
          }
        });

        if (!hasValidKey) {
          throw new Error('Data di dalam file bukan arsip Katalog Kehidupan yang sah.');
        }

        // Write keys to localStorage
        validKeys.forEach(key => {
          if (parsedData[key] !== undefined && parsedData[key] !== null) {
            localStorage.setItem(key, parsedData[key]);
          }
        });

        setImportStatus({
          type: 'success',
          message: 'Arsip berhasil diimpor! Halaman akan segera dimuat ulang untuk memperbarui data...'
        });

        // Refresh page after a brief moment
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: err.message || 'Gagal memproses file arsip. Pastikan file berformat JSON asli hasil ekspor.'
        });
      }
    };

    fileReader.readAsText(file);
  };

  // Handles Complete Database Wipe
  const handleFullReset = () => {
    // Clear all our database keys
    const keys = [
      'weekly_activities',
      'game_spinner_categories',
      'spin_history',
      'watched_movies_hub',
      'game_spinner_sound_enabled'
    ];
    keys.forEach(key => localStorage.removeItem(key));
    
    setImportStatus({
      type: 'success',
      message: 'Seluruh database berhasil dibersihkan! Memuat ulang halaman...'
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Pusat Arsip Digital" 
      icon={<Archive className="w-5 h-5" />}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-xs font-sans">
        <p className="leading-relaxed">
          Katalog Kehidupan menyimpan seluruh aktivitas, tontonan film, dan riwayat putaran game Anda secara aman di dalam penyimpanan lokal peramban (browser). Di sini Anda dapat mencadangkan atau memulihkan data tersebut.
        </p>

        {/* Action Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Export Panel */}
          <div className="bg-[#fdfaf2] dark:bg-[#322c23]/40 border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-1.5 mb-4">
              <h4 className="text-[11px] font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Ekspor Cadangan
              </h4>
              <p className="text-[10px] text-stone-500 leading-normal">
                Unduh salinan data seluruh modul dalam bentuk berkas digital (.json) untuk disimpan sebagai arsip di komputer Anda.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-2 bg-[#f2ede3] dark:bg-[#3d3527] hover:bg-[#d4c9a8]/20 border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] font-display font-bold text-[10px] uppercase tracking-wider rounded-[4px] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh File JSON
            </button>
          </div>

          {/* Import Panel */}
          <div className="bg-[#fdfaf2] dark:bg-[#322c23]/40 border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-1.5 mb-4">
              <h4 className="text-[11px] font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#a23b2c] dark:text-[#ff816c]" />
                Pulihkan Arsip
              </h4>
              <p className="text-[10px] text-stone-500 leading-normal">
                Unggah kembali file cadangan JSON yang pernah Anda unduh untuk memulihkan seluruh aktivitas, statistik, dan film favorit Anda.
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-[#a23b2c] dark:bg-[#ff816c] hover:bg-opacity-95 border border-[#a23b2c] dark:border-[#ff816c] text-white dark:text-[#221e18] font-display font-bold text-[10px] uppercase tracking-wider rounded-[4px] transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Pilih Berkas JSON
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {importStatus.type !== 'idle' && (
          <div className={`p-3 border rounded-[4px] text-[11px] flex gap-2.5 items-start ${
            importStatus.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-600/30 text-emerald-850 dark:text-emerald-400' 
              : 'bg-rose-500/10 border-rose-600/30 text-rose-850 dark:text-rose-450'
          }`}>
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-650 dark:text-emerald-400 mt-0.5 animate-bounce" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-650 dark:text-rose-400 mt-0.5" />
            )}
            <div>
              <p className="font-bold uppercase tracking-wide text-[9px] mb-0.5">
                {importStatus.type === 'success' ? 'Berhasil' : 'Gagal Memulihkan'}
              </p>
              <p>{importStatus.message}</p>
            </div>
          </div>
        )}

        {/* Destructive Zone (Reset Database) */}
        <div className="border-t border-[#d4c9a8]/40 dark:border-[#4b463e]/40 pt-5 mt-3">
          {!showConfirmReset ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-500/5 dark:bg-rose-500/5 border border-rose-550/20 rounded-[4px]">
              <div>
                <h5 className="text-[10px] font-display font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                  Zona Destruktif: Reset Total
                </h5>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Menghapus seluruh catatan jadwal mingguan, seluruh database film, riwayat spin game, dan mengembalikan katalog ke bentuk kosong bawaan.
                </p>
              </div>
              <button
                onClick={() => setShowConfirmReset(true)}
                className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-650 dark:text-rose-400 border border-rose-650/30 rounded-[4px] text-[10px] font-display font-bold uppercase tracking-wider transition cursor-pointer shrink-0"
              >
                Kosongkan Data
              </button>
            </div>
          ) : (
            <div className="p-4 bg-rose-500/10 border border-rose-650/30 rounded-[4px] space-y-4">
              <div className="flex gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-650 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-display font-bold text-rose-750 dark:text-rose-400 uppercase tracking-wide">
                    Konfirmasi Penghapusan Permanen
                  </h5>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Aksi ini akan menghapus total seluruh data lokal Anda. Semua data yang belum dicadangkan akan hilang selamanya. Apakah Anda yakin ingin melanjutkan?
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 bg-[#f2ede3] dark:bg-[#32302a] border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] text-[10px] font-display font-bold uppercase tracking-wider rounded-[4px] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleFullReset}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white border border-rose-650 font-display font-bold text-[10px] uppercase tracking-wider rounded-[4px] cursor-pointer"
                >
                  Ya, Hapus Semua Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
