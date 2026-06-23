import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Star, 
  Trash2, 
  Plus, 
  Calendar, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Download, 
  Upload, 
  Edit2, 
  Save, 
  X, 
  MessageSquare,
  Clapperboard,
  Tv,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface Movie {
  id: string;
  title: string;
  genre: string;
  watchDate: string;
  rating: number; // 1 to 5
  notes: string;
  platform: string; // Netflix, Disney+, Bioskop, etc.
}

const GENRES = [
  { value: 'Action', label: 'Aksi 💥', bg: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' },
  { value: 'Comedy', label: 'Komedi 🎭', bg: 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30' },
  { value: 'Drama', label: 'Drama 💡', bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' },
  { value: 'Horror', label: 'Horor 👻', bg: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' },
  { value: 'Romance', label: 'Romantis 💕', bg: 'bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-900/30' },
  { value: 'Sci-Fi', label: 'Fiksi Ilmiah 🚀', bg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' },
  { value: 'Thriller', label: 'Thriller 🔪', bg: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30' },
  { value: 'Anime', label: 'Anime / Animasi 🌸', bg: 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/30' },
  { value: 'Adventure', label: 'Petualangan 🎒', bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100' },
  { value: 'Fantasy', label: 'Fantasi 🔮', bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-100' },
  { value: 'Mystery', label: 'Misteri 🔍', bg: 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-650 dark:text-cyan-400 border-cyan-100' },
  { value: 'Documentary', label: 'Dokumenter 📹', bg: 'bg-teal-50 dark:bg-teal-950/20 text-teal-650 dark:text-teal-400 border-teal-100' },
  { value: 'Musical', label: 'Musikal 🎵', bg: 'bg-violet-50 dark:bg-violet-950/20 text-violet-650 dark:text-violet-400 border-violet-100' },
  { value: 'Family', label: 'Keluarga 👨‍👩‍👧‍👦', bg: 'bg-lime-50 dark:bg-lime-950/20 text-lime-650 dark:text-lime-405 border-lime-100' },
  { value: 'History', label: 'Sejarah 🏛️', bg: 'bg-stone-50 dark:bg-stone-900/20 text-stone-600 dark:text-stone-300 border-stone-200' },
  { value: 'Custom', label: '✍️ Kustom (Masukkan manual)', bg: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100' },
  { value: 'Other', label: 'Lainnya 📂', bg: 'bg-slate-50 dark:bg-slate-800/40 text-slate-655 dark:text-slate-300 border-slate-200' }
];

const PLATFORMS = [
  { value: 'Netflix', label: 'Netflix 🔴', color: 'text-red-500' },
  { value: 'Disney+', label: 'Disney+ 🔵', color: 'text-indigo-400' },
  { value: 'Bioskop', label: 'Bioskop 🍿', color: 'text-amber-500' },
  { value: 'YouTube', label: 'YouTube 📼', color: 'text-red-600' },
  { value: 'Prime Video', label: 'Prime Video 💎', color: 'text-blue-400' },
  { value: 'Lainnya', label: 'Lainnya 📺', color: 'text-slate-500' }
];

export default function MovieTracker() {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('watched_movies_hub');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
        return [];
      }
    }
    return [
      {
        id: '1',
        title: 'Spirited Away',
        genre: 'Anime',
        watchDate: '2026-06-20',
        rating: 5,
        notes: 'Salah satu film animasi terbaik sepanjang masa. Sangat emosional dan penuh imajinasi indah.',
        platform: 'Netflix'
      },
      {
        id: '2',
        title: 'Interstellar',
        genre: 'Sci-Fi',
        watchDate: '2026-06-18',
        rating: 5,
        notes: 'Musik Hans Zimmer luar biasa megah. Konsep relativitas waktu sangat menyentuh hati hubungan ayah-anak.',
        platform: 'Bioskop'
      },
      {
        id: '3',
        title: 'The Conjuring',
        genre: 'Horror',
        watchDate: '2026-05-12',
        rating: 4,
        notes: 'Suasananya sangat mengerikan, jumpscare diletakkan cerdas, bukan asal mengagetkan saja.',
        platform: 'Disney+'
      }
    ];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('watched_movies_hub', JSON.stringify(movies));
  }, [movies]);

  // Form states
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Action');
  const [customGenreText, setCustomGenreText] = useState('');
  const [watchDate, setWatchDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [platform, setPlatform] = useState('Netflix');
  const [errorText, setErrorText] = useState('');

  // Editing movie inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGenre, setEditGenre] = useState('Action');
  const [editCustomGenreText, setEditCustomGenreText] = useState('');
  const [editWatchDate, setEditWatchDate] = useState('');
  const [editRating, setEditRating] = useState<number>(5);
  const [editNotes, setEditNotes] = useState('');
  const [editPlatform, setEditPlatform] = useState('Netflix');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterGenre, setSelectedFilterGenre] = useState('All');
  const [selectedFilterRating, setSelectedFilterRating] = useState<number | 'All'>('All');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'alphabetical'>('newest');

  // Backup / Import file states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  // Delete Confirm Dialog state
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);

  // Form handler
  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorText('Judul film wajib diisi!');
      return;
    }

    const finalGenre = genre === 'Custom' ? (customGenreText.trim() || 'Kustom ✍️') : genre;

    const newMovie: Movie = {
      id: Date.now().toString(),
      title: title.trim(),
      genre: finalGenre,
      watchDate,
      rating,
      notes: notes.trim(),
      platform
    };

    setMovies(prev => [newMovie, ...prev]);
    // Reset fields
    setTitle('');
    setNotes('');
    setCustomGenreText('');
    setGenre('Action');
    setErrorText('');

    // Trigger visual feedback / mini sound if any simple sound module exists in window
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (err) {
      // Sound fails or permission not granted - ignore safely
    }
  };

  // Delete Action
  const handleDeleteMovie = (id: string) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    setMovieToDelete(null);
  };

  // Start inline editing
  const startEditing = (movie: Movie) => {
    setEditingId(movie.id);
    setEditTitle(movie.title);
    
    const isPreset = GENRES.some(g => g.value === movie.genre && g.value !== 'Custom');
    if (isPreset) {
      setEditGenre(movie.genre);
      setEditCustomGenreText('');
    } else {
      setEditGenre('Custom');
      setEditCustomGenreText(movie.genre);
    }

    setEditWatchDate(movie.watchDate);
    setEditRating(movie.rating);
    setEditNotes(movie.notes);
    setEditPlatform(movie.platform);
  };

  // Save inline editing
  const saveEditing = (id: string) => {
    if (!editTitle.trim()) return;

    const finalEditGenre = editGenre === 'Custom' ? (editCustomGenreText.trim() || 'Kustom ✍️') : editGenre;

    setMovies(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          title: editTitle.trim(),
          genre: finalEditGenre,
          watchDate: editWatchDate,
          rating: editRating,
          notes: editNotes.trim(),
          platform: editPlatform
        };
      }
      return m;
    }));
    setEditingId(null);
  };

  // Export movie database
  const exportData = () => {
    const dataStr = JSON.stringify(movies, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sinema-kamu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import movie database
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Validate fields roughly
          const isValid = parsed.every(item => 
            item && 
            typeof item.title === 'string' && 
            typeof item.genre === 'string' &&
            typeof item.rating === 'number'
          );

          if (isValid) {
            setMovies(parsed);
            setImportStatus('success');
            setImportMessage(`Berhasil mengimpor ${parsed.length} film ke database kamu!`);
            setTimeout(() => setImportStatus('idle'), 4000);
          } else {
            setImportStatus('error');
            setImportMessage('Format data tidak valid! Pastikan file backup berisi data film yang sah.');
            setTimeout(() => setImportStatus('idle'), 4000);
          }
        } else {
          setImportStatus('error');
          setImportMessage('Format file harus berupa array JSON.');
          setTimeout(() => setImportStatus('idle'), 4000);
        }
      } catch (err) {
        setImportStatus('error');
        setImportMessage('Gagal membaca file JSON. Pastikan file tidak rusak.');
        setTimeout(() => setImportStatus('idle'), 4000);
      }
    };
    reader.readAsText(file);
    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filter & Sort logic
  const filteredMovies = movies.filter(movie => {
    const matchSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        movie.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGenre = selectedFilterGenre === 'All' || movie.genre === selectedFilterGenre;
    const matchRating = selectedFilterRating === 'All' || movie.rating === selectedFilterRating;
    return matchSearch && matchGenre && matchRating;
  }).sort((a, b) => {
    if (selectedSort === 'newest') {
      return new Date(b.watchDate).getTime() - new Date(a.watchDate).getTime();
    }
    if (selectedSort === 'oldest') {
      return new Date(a.watchDate).getTime() - new Date(b.watchDate).getTime();
    }
    if (selectedSort === 'highest') {
      return b.rating - a.rating;
    }
    if (selectedSort === 'lowest') {
      return a.rating - b.rating;
    }
    if (selectedSort === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Calculate stats
  const totalWatched = movies.length;
  const avgRating = totalWatched > 0 
    ? (movies.reduce((sum, m) => sum + m.rating, 0) / totalWatched).toFixed(1) 
    : '0.0';

  // Find favorite genre
  const genreCounts = movies.reduce((acc, m) => {
    acc[m.genre] = (acc[m.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let favoriteGenre = '-';
  let maxGenreCount = 0;
  Object.entries(genreCounts).forEach(([g, count]) => {
    if (count > maxGenreCount) {
      maxGenreCount = count;
      favoriteGenre = g;
    }
  });

  // Find dynamic title critique level based on film count
  const getCritiqueLevel = (count: number) => {
    if (count === 0) return 'Belum Memulai';
    if (count < 5) return 'Penonton Kasual 🌱';
    if (count < 10) return 'Pecinta Film Santai 🍿';
    if (count < 20) return 'Kritikus Amatir 🎬';
    return 'Kritikus Legendaris / Cinephile 🏆';
  };

  const getGenreColor = (genreValue: string) => {
    const currentG = GENRES.find(g => g.value === genreValue);
    return currentG ? currentG.bg : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
  };

  return (
    <div id="movie-tracker-container" className="space-y-8">
      
      {/* Top Banner & Stats Overview */}
      <div className="bg-white dark:bg-[#151221] border border-slate-150 dark:border-[#2a2438] rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-2xl">
                <Clapperboard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-slate-800 dark:text-[#f0ecf9]">Buku Sinema Pribadi</h2>
                <p className="text-xs text-slate-500 dark:text-[#b8b0cb] font-medium">Catat dan simpan memori film-film favoritmu selamanya</p>
              </div>
            </div>
          </div>

          {/* Backup Action Bar */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button 
              onClick={exportData}
              title="Download cadangan data film dalam format JSON"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] hover:bg-slate-100 dark:hover:bg-[#2a2438] text-slate-700 dark:text-[#b8b0cb] border border-slate-205 dark:border-[#2a2438] rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor Cadangan
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Unggah berkas JSON cadangan untuk memulihkan"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] hover:bg-slate-100 dark:hover:bg-[#2a2438] text-slate-700 dark:text-[#b8b0cb] border border-slate-205 dark:border-[#2a2438] rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Impor Cadangan
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={importData} 
              accept=".json" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Dynamic Warning Notification */}
        {importStatus !== 'idle' && (
          <div className={`mt-4 p-3.5 rounded-2xl text-xs font-semibold border flex items-center justify-between animate-pulse ${
            importStatus === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-750 dark:text-emerald-450' 
              : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-750 dark:text-rose-450'
          }`}>
            <span>{importMessage}</span>
            <button onClick={() => setImportStatus('idle')} className="text-slate-400 hover:text-slate-600 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-slate-50/50 dark:bg-[#1c182a]/50 rounded-2xl border border-slate-100 dark:border-[#201b32]/60 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-[#7a6f94] uppercase tracking-wider">Total Ditonton</span>
              <span className="text-xl font-display font-bold text-slate-800 dark:text-[#f0ecf9]">{totalWatched} Film</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-[#1c182a]/50 rounded-2xl border border-slate-100 dark:border-[#201b32]/60 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-xl">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-[#7a6f94] uppercase tracking-wider">Rata-Rata Rating</span>
              <span className="text-xl font-display font-bold text-slate-800 dark:text-[#f0ecf9]">{avgRating} / 5.0</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-[#1c182a]/50 rounded-2xl border border-slate-100 dark:border-[#201b32]/60 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-[#7a6f94] uppercase tracking-wider">Genre Terfavorit</span>
              <span className="text-sm font-display font-bold text-slate-800 dark:text-[#f0ecf9] truncate max-w-[120px] block">
                {favoriteGenre !== '-' ? GENRES.find(g => g.value === favoriteGenre)?.label || favoriteGenre : '-'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-[#1c182a]/50 rounded-2xl border border-slate-100 dark:border-[#201b32]/60 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 text-purple-650 dark:text-purple-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-[#7a6f94] uppercase tracking-wider">Tingkat Kurasi</span>
              <span className="text-xs font-display font-bold text-slate-800 dark:text-[#f0ecf9]">{getCritiqueLevel(totalWatched)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Movie List & Filter Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Form Addition */}
        <div className="lg:col-span-4 bg-white dark:bg-[#151221] border border-slate-150 dark:border-[#2a2438] rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
          <h3 className="text-sm font-display font-bold text-slate-800 dark:text-[#f0ecf9] flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-[#2a2438]">
            <Plus className="w-4 h-4 text-indigo-505" />
            Catat Film yang Baru Ditonton
          </h3>

          <form onSubmit={handleAddMovie} className="space-y-4 text-xs font-semibold">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-slate-500 dark:text-[#b8b0cb] uppercase tracking-wider block text-[10px]">Judul Film / Serial</label>
              <input 
                type="text" 
                placeholder="cth. Interstellar, One Piece, Spirited Away" 
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (errorText) setErrorText('');
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl text-slate-850 dark:text-slate-150 border border-slate-200 dark:border-[#2d2740] focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
              />
              {errorText && (
                <p className="text-rose-500 text-[10px] font-bold mt-1">{errorText}</p>
              )}
            </div>

            {/* Genre & Platform */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-[#b8b0cb] uppercase tracking-wider block text-[10px]">Genre Film</label>
                <div className="relative">
                  <select 
                    value={genre} 
                    onChange={e => setGenre(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl text-slate-800 dark:text-slate-150 border border-slate-200 dark:border-[#2d2740] outline-none transition appearance-none cursor-pointer"
                  >
                    {GENRES.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 dark:text-[#b8b0cb] uppercase tracking-wider block text-[10px]">Layanan Media</label>
                <div className="relative">
                  <select 
                    value={platform} 
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl text-slate-800 dark:text-slate-150 border border-slate-200 dark:border-[#2d2740] outline-none transition appearance-none cursor-pointer"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Manual Custom Genre Input */}
            {genre === 'Custom' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1.5 p-3.5 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl"
              >
                <label className="text-indigo-650 dark:text-indigo-400 uppercase tracking-wider block text-[10px] font-bold">Masukkan Genre Secara Manual</label>
                <input 
                  type="text" 
                  placeholder="cth. Dokumenter Sejarah, Cyberpunk, Neo-Noir" 
                  value={customGenreText}
                  onChange={e => setCustomGenreText(e.target.value)}
                  className="w-full px-4.5 py-2.5 bg-white dark:bg-[#1c182a] rounded-xl text-slate-850 dark:text-slate-150 border border-indigo-200 dark:border-indigo-900 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition"
                />
              </motion.div>
            )}

            {/* Watch Date */}
            <div className="space-y-1.5">
              <label className="text-slate-500 dark:text-[#b8b0cb] uppercase tracking-wider block text-[10px]">Tanggal Menonton</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={watchDate}
                  onChange={e => setWatchDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl text-slate-850 dark:text-slate-150 border border-slate-200 dark:border-[#2d2740] focus:border-indigo-400 outline-none transition cursor-pointer"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-slate-500 dark:text-[#b8b0cb] uppercase tracking-wider block text-[10px] mb-1">Berikan Penilaian</label>
              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="p-1 hover:scale-120 active:scale-95 transition cursor-pointer"
                    title={`${starValue} Bintang`}
                  >
                    <Star 
                      className={`w-6 h-6 transition ${
                        starValue <= rating 
                          ? 'fill-amber-450 text-amber-450 dark:text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]' 
                          : 'text-slate-300 dark:text-slate-700'
                      }`} 
                    />
                  </button>
                ))}
                <span className="text-xs font-black text-amber-500 dark:text-amber-400 ml-2">{rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Notes / Review */}
            <div className="space-y-1.5">
              <label className="text-slate-500 dark:text-[#b8b0cb] uppercase tracking-wider block text-[10px]">Catatan / Ulasan Singkat</label>
              <textarea 
                placeholder="Bagikan opini kamu tentang alur cerita, akting, atau visual dalam film ini..."
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl text-slate-850 dark:text-slate-150 border border-slate-200 dark:border-[#2d2740] focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition resize-none"
              />
            </div>

            {/* Submit */}
            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 dark:shadow-none hover:brightness-110 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Simpan Ke Sinema Kamu
            </button>
          </form>
        </div>

        {/* Right Side: Filters, Search, and Archive List */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Header Controls for Search, Filtering & Sorting */}
          <div className="bg-white dark:bg-[#151221] border border-slate-150 dark:border-[#2a2438] rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari film berdasarkan judul atau ulasan..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl text-slate-850 dark:text-slate-150 border border-slate-205 dark:border-[#2d2740] text-xs font-semibold outline-none focus:border-indigo-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="relative w-full md:w-56">
                <select 
                  value={selectedSort}
                  onChange={e => setSelectedSort(e.target.value as any)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-[#1e1a2e] text-slate-800 dark:text-slate-200 border border-slate-205 dark:border-[#2d2740] rounded-xl text-xs font-semibold outline-none appearance-none cursor-pointer"
                >
                  <option value="newest">Terbaru Ditonton</option>
                  <option value="oldest">Terdahulu Ditonton</option>
                  <option value="highest">Rating Tertinggi</option>
                  <option value="lowest">Rating Terendah</option>
                  <option value="alphabetical">Nama A - Z</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#2a2438] text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 mr-1 text-[10px] uppercase tracking-wider text-slate-400">
                <Filter className="w-3 h-3" />
                Filter:
              </span>

              {/* Genre Filter Dropdown */}
              <div className="relative">
                <select 
                  value={selectedFilterGenre}
                  onChange={e => setSelectedFilterGenre(e.target.value)}
                  className="px-3 py-1.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#b8b0cb] rounded-lg text-[11px] font-bold outline-none appearance-none cursor-pointer pr-7 dark:bg-[#151221]"
                >
                  <option value="All">Semua Genre ({movies.length})</option>
                  {/* Preset list */}
                  {GENRES.filter(g => g.value !== 'Custom').map(g => {
                    const count = movies.filter(m => m.genre === g.value).length;
                    return (
                      <option key={g.value} value={g.value}>
                        {g.label} ({count})
                      </option>
                    );
                  })}
                  {/* Custom genres entered by user */}
                  {Array.from(new Set(movies.map(m => m.genre)))
                    .filter(genreName => !GENRES.some(g => g.value === genreName))
                    .map(customG => {
                      const count = movies.filter(m => m.genre === customG).length;
                      return (
                        <option key={customG} value={customG}>
                          ✍️ {customG} ({count})
                        </option>
                      );
                    })
                  }
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Rating Filter Dropdown */}
              <div className="relative">
                <select 
                  value={selectedFilterRating}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedFilterRating(val === 'All' ? 'All' : Number(val));
                  }}
                  className="px-3 py-1.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#b8b0cb] rounded-lg text-[11px] font-bold outline-none appearance-none cursor-pointer pr-7 dark:bg-[#151221]"
                >
                  <option value="All">Semua Rating</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                  <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                  <option value="3">⭐⭐⭐ (3 Bintang)</option>
                  <option value="2">⭐⭐ (2 Bintang)</option>
                  <option value="1">⭐ (1 Bintang)</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* List of movies */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredMovies.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-150 dark:border-[#2a2438] rounded-3xl bg-white dark:bg-[#151221]"
                >
                  <div className="p-3 bg-slate-50 dark:bg-[#1e1a2e] rounded-2xl mb-4 text-slate-400">
                    <Film className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-display font-bold text-slate-850 dark:text-[#f0ecf9]">Arsip Menonton Kosong</h4>
                  <p className="text-xs text-slate-500 dark:text-[#b8b0cb] mt-1 max-w-sm font-medium">
                    {movies.length === 0 
                      ? 'Kamu belum menambahkan film apa pun ke buku pribadi. Ayo masukkan judul pertamamu sekarang!' 
                      : 'Hasil pencarian atau filter kamu tidak menemukan kecocokan di arsip.'}
                  </p>
                </motion.div>
              ) : (
                filteredMovies.map((movie) => {
                  const isEditing = editingId === movie.id;
                  const genreDetails = GENRES.find(g => g.value === movie.genre);
                  
                  return (
                    <motion.div
                      key={movie.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`relative bg-white dark:bg-[#151221] border dark:border-[#2a2438] rounded-2xl p-5 shadow-xs transition-all ${
                        isEditing 
                          ? 'border-indigo-400 ring-1 ring-indigo-400 dark:border-indigo-550' 
                          : 'border-slate-150 hover:border-slate-300 dark:hover:border-[#38314a]'
                      }`}
                    >
                      {isEditing ? (
                        /* Editing form inline */
                        <div className="space-y-4 text-xs font-semibold">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-400">Judul Film</label>
                              <input 
                                type="text"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl border border-slate-200 dark:border-[#2d2740] outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-400">Tanggal Nonton</label>
                              <input 
                                type="date"
                                value={editWatchDate}
                                onChange={e => setEditWatchDate(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl border border-slate-200 dark:border-[#2d2740] outline-none cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-400">Genre</label>
                              <select 
                                value={editGenre}
                                onChange={e => setEditGenre(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl border border-slate-205 dark:border-[#2d2740] outline-none cursor-pointer"
                              >
                                {GENRES.map(g => (
                                  <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-400">Media Platform</label>
                              <select 
                                value={editPlatform}
                                onChange={e => setEditPlatform(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl border border-slate-205 dark:border-[#2d2740] outline-none cursor-pointer"
                              >
                                {PLATFORMS.map(p => (
                                  <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase text-slate-400">Rating</label>
                              <select 
                                value={editRating}
                                onChange={e => setEditRating(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl border border-slate-205 dark:border-[#2d2740] outline-none text-amber-500 cursor-pointer"
                              >
                                <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
                                <option value="4">⭐⭐⭐⭐ 4/5</option>
                                <option value="3">⭐⭐⭐ 3/5</option>
                                <option value="2">⭐⭐ 2/5</option>
                                <option value="1">⭐ 1/5</option>
                              </select>
                            </div>
                          </div>

                          {/* Inline Edit Manual Custom Genre Input */}
                          {editGenre === 'Custom' && (
                            <motion.div 
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 bg-indigo-50/20 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl space-y-1"
                            >
                              <label className="text-[10px] uppercase text-indigo-650 dark:text-indigo-400 font-bold">Masukkan Genre Secara Manual</label>
                              <input 
                                type="text"
                                value={editCustomGenreText}
                                onChange={e => setEditCustomGenreText(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-[#1e1a2e] rounded-xl border border-indigo-200 dark:border-indigo-900/30 outline-none text-xs"
                                placeholder="cth. Dokumenter Sejarah, Cyberpunk, Neo-Noir"
                              />
                            </motion.div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase text-slate-400">Ulasan</label>
                            <textarea 
                              value={editNotes}
                              onChange={e => setEditNotes(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1e1a2e] rounded-xl border border-slate-200 dark:border-[#2d2740] outline-none resize-none"
                            />
                          </div>

                          <div className="flex gap-2 justify-end pt-1">
                            <button 
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 bg-slate-50 dark:bg-[#1e1a2e] hover:bg-slate-100 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-[#b8b0cb] rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Batal
                            </button>
                            <button 
                              onClick={() => saveEditing(movie.id)}
                              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Simpan Perubahan
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Display movie card mode */
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          {/* Inner details container */}
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Title display */}
                              <h4 className="text-base font-display font-bold text-slate-800 dark:text-[#f0ecf9] leading-tight">
                                {movie.title}
                              </h4>
                              
                              {/* Genre Tag */}
                              <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold ${getGenreColor(movie.genre)}`}>
                                {genreDetails?.label || movie.genre}
                              </span>

                              {/* Media tag */}
                              <span className="px-2 py-0.5 bg-slate-50 dark:bg-[#1c172e] border border-slate-100 dark:border-slate-805 text-slate-500 dark:text-[#9381b8] rounded-lg text-[9px] font-bold flex items-center gap-1">
                                <Tv className="w-2.5 h-2.5" />
                                {movie.platform}
                              </span>
                            </div>

                            {/* Stars rating panel */}
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  className={`w-4 h-4 ${
                                    s <= movie.rating 
                                      ? 'fill-amber-400 text-amber-400' 
                                      : 'text-slate-200 dark:text-slate-800'
                                  }`} 
                                />
                              ))}
                              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1.5">
                                • Ditonton: {new Date(movie.watchDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>

                            {/* Review notes block */}
                            {movie.notes ? (
                              <p className="text-xs text-slate-600 dark:text-[#b8b0cb] font-medium leading-relaxed bg-slate-50/50 dark:bg-[#181526]/50 rounded-xl p-3 border border-slate-100/50 dark:border-[#2a2438]/20 flex items-start gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span>{movie.notes}</span>
                              </p>
                            ) : (
                              <p className="text-[11px] italic text-slate-400">Tidak ada catatan ulasan film ini.</p>
                            )}
                          </div>

                          {/* Control Action Tools */}
                          <div className="flex items-center sm:flex-col justify-end gap-1.5 border-t sm:border-t-0 border-slate-100 sm:pt-0 pt-3 shrink-0">
                            <button
                              onClick={() => startEditing(movie)}
                              className="p-2 bg-slate-50 dark:bg-[#1e1a2e] hover:bg-slate-100 dark:hover:bg-[#252038] text-slate-550 dark:text-[#a59aba] hover:text-indigo-650 dark:hover:text-[#8b5cf6] border border-slate-150 dark:border-[#2a2438] rounded-xl hover:shadow-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                              title="Sunting catatan film ini"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span className="sm:hidden">Edit</span>
                            </button>
                            <button
                              onClick={() => setMovieToDelete(movie.id)}
                              className="p-2 bg-slate-50 dark:bg-[#1e1a2e] hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-550 dark:text-[#a59aba] hover:text-rose-600 border border-slate-150 dark:border-[#2a2438] hover:border-rose-200 dark:hover:border-rose-900 rounded-xl hover:shadow-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                              title="Hapus film dari arsip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="sm:hidden">Hapus</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDialog 
        isOpen={movieToDelete !== null}
        title="Hapus Catatan Film"
        message="Apakah Anda yakin ingin menghapus film ini dari buku sinema Anda? Tindakan ini tidak dapat dibatalkan secara otomatis jika Anda belum mengekspor cadangan berkas."
        onConfirm={() => {
          if (movieToDelete) handleDeleteMovie(movieToDelete);
        }}
        onCancel={() => setMovieToDelete(null)}
      />

    </div>
  );
}
