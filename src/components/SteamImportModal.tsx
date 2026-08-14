import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Check, 
  CheckSquare, 
  Square, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  FolderPlus, 
  Bookmark, 
  Clock, 
  Sparkles,
  Layers,
  FileText,
  Upload,
  Wand2,
  Key,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameCategory, GameItem, WishlistGame } from '../types';

// Custom SVG Steam Icon for high fidelity
function SteamIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.64 0 .463 4.908.032 11.144l6.095 2.515a3.46 3.46 0 0 1 1.954-.602c.18 0 .356.015.528.043l2.842-4.125a4.846 4.846 0 0 1-.072-.816C11.379 3.655 14.634.4 18.64.4c4.004 0 7.259 3.255 7.259 7.259 0 4.005-3.255 7.26-7.259 7.26-.067 0-.134-.002-.2-.005l-4.1 2.872a3.42 3.42 0 0 1 .059.615c0 1.916-1.554 3.47-3.47 3.47-1.748 0-3.192-1.29-3.434-2.977L1.68 16.48C3.42 20.916 7.733 24 12.78 24 18.977 24 24 18.977 24 12.78S18.977 0 11.979 0zm-3.81 18.94c0-.987.8-1.787 1.787-1.787.986 0 1.786.8 1.786 1.787 0 .986-.8 1.786-1.786 1.786-.987 0-1.787-.8-1.787-1.786zm10.471-13.88c-2.8 0-5.07 2.27-5.07 5.07 0 2.8 2.27 5.07 5.07 5.07 2.8 0 5.07-2.27 5.07-5.07 0-2.8-2.27-5.07-5.07-5.07zm0 1.902c1.75 0 3.169 1.418 3.169 3.168 0 1.75-1.419 3.168-3.169 3.168-1.75 0-3.168-1.418-3.168-3.168 0-1.75 1.418-3.168 3.168-3.168z" />
    </svg>
  );
}

export interface SteamGameFetched {
  appId: number;
  name: string;
  hoursOnRecord?: number;
  playtimeForever?: number;
  logoUrl?: string;
  headerUrl?: string;
}

interface SteamImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: GameCategory[];
  onImportToSpinnerCategory: (categoryId: string, games: string[], newCategoryMeta?: { name: string; color: string }) => void;
  onImportToWishlist?: (games: { name: string; genre?: string }[]) => void;
}

export default function SteamImportModal({
  isOpen,
  onClose,
  categories,
  onImportToSpinnerCategory,
  onImportToWishlist,
}: SteamImportModalProps) {
  const [activeTab, setActiveTab] = useState<'steam' | 'bulk' | 'presets'>('steam');
  
  // Steam Form States
  const [steamInput, setSteamInput] = useState(() => localStorage.getItem('last_steam_input') || '');
  const [steamApiKey, setSteamApiKey] = useState(() => localStorage.getItem('steam_web_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrivateError, setIsPrivateError] = useState(false);
  const [showPrivacyGuide, setShowPrivacyGuide] = useState(false);

  // Steam Result States
  const [fetchedUser, setFetchedUser] = useState<{
    displayName: string;
    avatarUrl?: string;
    gameCount: number;
    profileUrl?: string;
  } | null>(null);
  const [steamGames, setSteamGames] = useState<SteamGameFetched[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<Set<number>>(new Set());

  // Presets State
  const [selectedPresetGames, setSelectedPresetGames] = useState<Set<string>>(new Set());
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<string>('all');
  const [presetSearchTerm, setPresetSearchTerm] = useState('');

  // Filter & Search
  const [searchFilter, setSearchFilter] = useState('');
  const [playtimeFilter, setPlaytimeFilter] = useState<'all' | 'played' | 'unplayed' | 'frequent'>('all');

  // Destination Options
  const [importTarget, setImportTarget] = useState<'existing_cat' | 'new_cat' | 'wishlist'>('new_cat');
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');
  const [newCatName, setNewCatName] = useState('Koleksi Steam');
  const [newCatColor, setNewCatColor] = useState('#2a475e'); // Steam classic slate-blue

  // Bulk Text State
  const [bulkText, setBulkText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset Collections
  const PRESET_GROUPS = useMemo(() => [
    {
      id: 'aaa',
      name: '🔥 AAA & RPG Terlaris',
      games: [
        'Elden Ring', 'Baldur\'s Gate 3', 'Cyberpunk 2077', 'The Witcher 3: Wild Hunt',
        'Red Dead Redemption 2', 'God of War', 'Black Myth: Wukong', 'Hogwarts Legacy',
        'Monster Hunter: World', 'Grand Theft Auto V', 'Resident Evil 4', 'Sekiro: Shadows Die Twice',
        'Dark Souls III', 'Final Fantasy VII Remake', 'Horizon Zero Dawn', 'Persona 5 Royal'
      ]
    },
    {
      id: 'indie',
      name: '✨ Indie Masterpieces',
      games: [
        'Hades II', 'Hollow Knight', 'Balatro', 'Stardew Valley', 'Dead Cells',
        'Slay the Spire', 'Celeste', 'Dave the Diver', 'Sea of Stars', 'Outer Wilds',
        'Cult of the Lamb', 'Risk of Rain 2', 'Tunic', 'Ori and the Will of the Wisps',
        'Disco Elysium', 'Undertale'
      ]
    },
    {
      id: 'coop',
      name: '👥 Multiplayer & Co-op Seru',
      games: [
        'Helldivers 2', 'Palworld', 'Lethal Company', 'It Takes Two', 'Deep Rock Galactic',
        'Valheim', 'Overcooked! 2', 'Terraria', 'Phasmophobia', 'Monster Hunter Rise',
        'Left 4 Dead 2', 'Don\'t Starve Together', 'Raft', 'Peak', 'Content Warning'
      ]
    },
    {
      id: 'strategy',
      name: '♟️ Strategi, Simulasi & Santai',
      games: [
        'Civilization VI', 'Cities: Skylines', 'Factorio', 'RimWorld', 'Age of Empires IV',
        'Frostpunk', 'Manor Lords', 'Animal Crossing', 'Planet Zoo', 'The Sims 4',
        'Dorfromantik', 'Unpacking', 'Euro Truck Simulator 2'
      ]
    }
  ], []);

  // Fetch Steam Library from backend
  const handleFetchSteam = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = steamInput.trim();
    if (!cleanQuery) {
      setError('Harap masukkan Steam ID, URL profil Steam, atau Custom URL Anda.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsPrivateError(false);

    try {
      localStorage.setItem('last_steam_input', cleanQuery);
      if (steamApiKey.trim()) {
        localStorage.setItem('steam_web_api_key', steamApiKey.trim());
      }

      let url = `/api/steam/games?query=${encodeURIComponent(cleanQuery)}`;
      if (steamApiKey.trim()) {
        url += `&key=${encodeURIComponent(steamApiKey.trim())}`;
      }

      let res: Response;
      try {
        res = await fetch(url);
      } catch (fetchErr: any) {
        setError('Tidak dapat menghubungi server API. Silakan coba metode "Tempel Daftar (Teks / CSV)" atau gunakan "Katalog Rekomendasi Game".');
        setLoading(false);
        return;
      }

      const text = await res.text();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        setError('Server Steam atau jaringan sedang membatasi pengambilan otomatis (karena proteksi privasi Steam). Silakan gunakan tab "Tempel Daftar (Teks / CSV)" atau "Katalog Rekomendasi Game" di atas.');
        setIsPrivateError(true);
        setShowApiKeyInput(true);
        setLoading(false);
        return;
      }

      if (!res.ok || data.error) {
        setError(data.error || 'Gagal memuat profil Steam.');
        if (data.isPrivate || data.needApiKey) {
          setIsPrivateError(true);
          setShowPrivacyGuide(true);
          setShowApiKeyInput(true);
        }
        setFetchedUser(null);
        setSteamGames([]);
        return;
      }

      if (data.games && Array.isArray(data.games) && data.games.length > 0) {
        setFetchedUser({
          displayName: data.displayName || cleanQuery,
          avatarUrl: data.avatarUrl,
          gameCount: data.gameCount || data.games.length,
          profileUrl: data.profileUrl
        });
        setSteamGames(data.games);
        // Default select all games
        setSelectedAppIds(new Set(data.games.map((g: SteamGameFetched) => g.appId)));
      } else {
        setError('Tidak ditemukan daftar game pada profil Steam ini. Pastikan profil Steam dan detail game diatur ke PUBLIK di pengaturan privasi Steam, atau masukkan Steam Web API Key Anda.');
        setIsPrivateError(true);
        setShowApiKeyInput(true);
      }
    } catch (err: any) {
      setError('Terjadi kendala saat membaca data: Silakan gunakan tab "Tempel Daftar (Teks / CSV)" untuk mengimpor dengan 100% lancar.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered Game List
  const displayedGames = useMemo(() => {
    return steamGames.filter(game => {
      const matchSearch = game.name.toLowerCase().includes(searchFilter.toLowerCase());
      if (!matchSearch) return false;

      const hours = game.hoursOnRecord || 0;
      if (playtimeFilter === 'played') return hours > 0;
      if (playtimeFilter === 'unplayed') return hours === 0;
      if (playtimeFilter === 'frequent') return hours >= 20;
      return true;
    });
  }, [steamGames, searchFilter, playtimeFilter]);

  // Selection helpers
  const handleToggleSelectAll = () => {
    if (selectedAppIds.size === displayedGames.length && displayedGames.length > 0) {
      // Deselect displayed
      const next = new Set(selectedAppIds);
      displayedGames.forEach(g => next.delete(g.appId));
      setSelectedAppIds(next);
    } else {
      // Select all displayed
      const next = new Set(selectedAppIds);
      displayedGames.forEach(g => next.add(g.appId));
      setSelectedAppIds(next);
    }
  };

  const handleToggleSingle = (appId: number) => {
    const next = new Set(selectedAppIds);
    if (next.has(appId)) {
      next.delete(appId);
    } else {
      next.add(appId);
    }
    setSelectedAppIds(next);
  };

  // Execute Import
  const handleExecuteImport = () => {
    let gameNamesToImport: string[] = [];

    if (activeTab === 'steam') {
      const selected = steamGames.filter(g => selectedAppIds.has(g.appId));
      if (selected.length === 0) {
        setError('Pilih minimal 1 game dari daftar Steam untuk diimpor.');
        return;
      }
      gameNamesToImport = selected.map(g => g.name.trim()).filter(Boolean);
    } else if (activeTab === 'presets') {
      if (selectedPresetGames.size === 0) {
        setError('Pilih minimal 1 game dari katalog preset.');
        return;
      }
      gameNamesToImport = Array.from(selectedPresetGames);
    } else {
      // Bulk text import
      if (!bulkText.trim()) {
        setError('Harap masukkan atau tempel daftar judul game.');
        return;
      }
      // Split by newlines or commas and clean numbers/prefixes
      gameNamesToImport = bulkText
        .split(/\r?\n|,/)
        .map(s => s.replace(/^[-*•\d.)\s]+/, '').trim())
        .filter(s => s.length > 0);
    }

    if (gameNamesToImport.length === 0) {
      setError('Tidak ada judul game valid yang dapat diimpor.');
      return;
    }

    // Process Destination
    if (importTarget === 'wishlist') {
      if (onImportToWishlist) {
        onImportToWishlist(gameNamesToImport.map(name => ({ name })));
      } else {
        // Fallback to direct localStorage wishlist
        const saved = localStorage.getItem('game_wishlist');
        const existing: WishlistGame[] = saved ? JSON.parse(saved) : [];
        const existingNames = new Set(existing.map(w => w.name.toLowerCase().trim()));
        
        const newItems: WishlistGame[] = gameNamesToImport
          .filter(n => !existingNames.has(n.toLowerCase()))
          .map(n => ({
            id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: n,
            genre: 'Steam / Game Library',
            price: 0,
            addedAt: Date.now()
          }));
        
        localStorage.setItem('game_wishlist', JSON.stringify([...newItems, ...existing]));
        window.dispatchEvent(new Event('app_data_changed'));
      }
    } else if (importTarget === 'new_cat') {
      const catId = `cat-steam-${Date.now()}`;
      onImportToSpinnerCategory(catId, gameNamesToImport, {
        name: newCatName.trim() || 'Koleksi Game',
        color: newCatColor
      });
    } else {
      // Existing category
      const targetId = selectedCatId || categories[0]?.id;
      if (!targetId) {
        setError('Pilih kategori tujuan terlebih dahulu.');
        return;
      }
      onImportToSpinnerCategory(targetId, gameNamesToImport);
    }

    // Success confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    onClose();
  };

  // Helper for preset selection
  const allFilteredPresetGames = useMemo(() => {
    let list: string[] = [];
    if (selectedPresetCategory === 'all') {
      list = PRESET_GROUPS.flatMap(g => g.games);
    } else {
      const group = PRESET_GROUPS.find(g => g.id === selectedPresetCategory);
      list = group ? group.games : [];
    }

    if (presetSearchTerm.trim()) {
      const term = presetSearchTerm.toLowerCase().trim();
      list = list.filter(name => name.toLowerCase().includes(term));
    }
    return list;
  }, [PRESET_GROUPS, selectedPresetCategory, presetSearchTerm]);

  const handleTogglePresetGame = (gameName: string) => {
    const next = new Set(selectedPresetGames);
    if (next.has(gameName)) {
      next.delete(gameName);
    } else {
      next.add(gameName);
    }
    setSelectedPresetGames(next);
  };

  const handleSelectAllPresets = () => {
    if (selectedPresetGames.size === allFilteredPresetGames.length && allFilteredPresetGames.length > 0) {
      setSelectedPresetGames(new Set());
    } else {
      setSelectedPresetGames(new Set(allFilteredPresetGames));
    }
  };

  // Bulk cleaning & sample helpers
  const handleCleanBulkText = () => {
    if (!bulkText.trim()) return;
    const cleaned = bulkText
      .split(/\r?\n/)
      .map(line => {
        // Strip numbered list e.g. "1.", "1 -", "•", "-", etc.
        let s = line.replace(/^[-*•\d.)\s]+/, '').trim();
        // Strip trailing hours or status e.g. "(12.5 hrs)" or "[Installed]"
        s = s.replace(/\s*\(\d+(\.\d+)?\s*(hrs|jam|hours|minutes|min)?\)\s*$/i, '');
        s = s.replace(/\s*\[(installed|ready|terpasang)\]\s*$/i, '');
        return s.trim();
      })
      .filter(s => s.length > 0)
      .join('\n');

    setBulkText(cleaned);
  };

  const handleInsertSampleGames = () => {
    const samples = [
      'Elden Ring',
      'Cyberpunk 2077',
      'Baldur\'s Gate 3',
      'Hades II',
      'Hollow Knight',
      'Monster Hunter: World',
      'Balatro',
      'Grand Theft Auto V',
      'Persona 5 Royal',
      'The Witcher 3: Wild Hunt'
    ].join('\n');
    setBulkText(samples);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBulkText(content);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[6px] shadow-tactile-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-[#3d3527] dark:text-[#e8dcc4]"
      >
        {/* Header with Ledger Vintage Accent */}
        <div className="px-6 py-4 border-b border-[#d4c9a8] dark:border-[#4b463e] flex items-center justify-between bg-[#f5f0e6] dark:bg-[#252019] relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#1b2838] dark:bg-[#66c0f4]" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#171a21] text-[#66c0f4] flex items-center justify-center shadow-xs">
              <SteamIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-[#3d3527] dark:text-[#e8dcc4] flex items-center gap-2">
                Impor Library Game Otomatis
                <span className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#2a475e]/15 text-[#2a475e] dark:text-[#66c0f4] dark:bg-[#66c0f4]/15 font-mono">
                  Steam & Bulk Sync
                </span>
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Tarik seluruh koleksi game Anda langsung tanpa perlu mengetik satu-per-satu.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-[#d4c9a8]/30 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#d4c9a8]/50 dark:border-[#4b463e]/50 px-6 bg-[#fdfaf2] dark:bg-[#2d2820] text-xs font-display font-bold uppercase tracking-wider overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab('steam'); setError(null); }}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'steam'
                ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <SteamIcon className="w-3.5 h-3.5" />
            <span>Sambungkan Profil Steam</span>
          </button>
          <button
            onClick={() => { setActiveTab('bulk'); setError(null); }}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'bulk'
                ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <FileText size={14} />
            <span>Tempel Daftar (Teks / CSV)</span>
          </button>
          <button
            onClick={() => { setActiveTab('presets'); setError(null); }}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'presets'
                ? 'border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <Sparkles size={14} />
            <span>Katalog Rekomendasi Game</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold">{error}</span>
                  {isPrivateError && (
                    <div className="mt-1 text-[11px] text-rose-700/90 dark:text-rose-300/80">
                      Steam membutuhkan pengaturan profil & game publik atau pembatasan jaringan bot. Anda dapat menggunakan metode alternatif di bawah:
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tab Jump Buttons */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-800/60">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('bulk');
                    setError(null);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-[3px] font-display font-bold uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <FileText size={12} />
                  <span>Gunakan Tempel Daftar (100% Berhasil)</span>
                  <ArrowRight size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('presets');
                    setError(null);
                  }}
                  className="px-3 py-1.5 bg-stone-700 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 text-white rounded-[3px] font-display font-bold uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer transition shadow-xs"
                >
                  <Sparkles size={12} />
                  <span>Pilih dari Rekomendasi Game</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApiKeyInput(true);
                  }}
                  className="px-3 py-1.5 bg-transparent border border-rose-300 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-800 dark:text-rose-200 rounded-[3px] font-display font-bold uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer transition"
                >
                  <Key size={12} />
                  <span>Input Steam API Key</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'steam' ? (
            <div className="space-y-5">
              {/* Steam Input Form */}
              <form onSubmit={handleFetchSteam} className="space-y-3">
                <label className="text-[10px] font-display font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center justify-between">
                  <span>Steam ID / URL Profil / Custom Vanity Name</span>
                  <button
                    type="button"
                    onClick={() => setShowPrivacyGuide(!showPrivacyGuide)}
                    className="text-[#a23b2c] dark:text-[#ff816c] hover:underline flex items-center gap-1 font-normal lowercase"
                  >
                    <HelpCircle size={12} />
                    <span>panduan privasi steam</span>
                  </button>
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Contoh: 76561198072124567 atau https://steamcommunity.com/id/username"
                      value={steamInput}
                      onChange={(e) => {
                        setSteamInput(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#f5f0e6] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c] font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !steamInput.trim()}
                    className="px-5 py-2.5 bg-[#1b2838] hover:bg-[#2a475e] dark:bg-[#66c0f4] dark:hover:bg-[#85cdfa] text-white dark:text-[#171a21] font-display font-bold text-xs uppercase tracking-wider rounded-[4px] transition flex items-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white dark:border-[#171a21] border-t-transparent rounded-full animate-spin" />
                        <span>Mengambil Data...</span>
                      </>
                    ) : (
                      <>
                        <SteamIcon className="w-3.5 h-3.5" />
                        <span>Tarik Library</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Steam API Key Optional Collapsible */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="text-[11px] text-stone-500 dark:text-stone-400 hover:text-[#a23b2c] dark:hover:text-[#ff816c] flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <span>⚙️ Punya Steam Web API Key? (Opsional / 100% Akurat)</span>
                    <span className="text-[10px]">{showApiKeyInput ? '▲ Tutup' : '▼ Buka'}</span>
                  </button>

                  {showApiKeyInput && (
                    <div className="mt-2 p-3 bg-[#f5f0e6] dark:bg-[#221e18] rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] font-display uppercase tracking-wider text-stone-600 dark:text-stone-300">
                          Steam Web API Key
                        </span>
                        <a
                          href="https://steamcommunity.com/dev/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#a23b2c] dark:text-[#ff816c] hover:underline text-[10px] flex items-center gap-0.5"
                        >
                          Dapatkan Key Gratis di Steam &rarr;
                        </a>
                      </div>
                      <input
                        type="password"
                        placeholder="Tempel Steam Web API Key Anda di sini..."
                        value={steamApiKey}
                        onChange={(e) => setSteamApiKey(e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[3px] text-xs font-mono"
                      />
                      <p className="text-[10px] text-stone-400">
                        Steam Web API Key tersimpan aman di browser Anda dan memungkinkan penarikan data game tanpa batasan scraper Steam.
                      </p>
                    </div>
                  )}
                </div>
              </form>

              {/* Privacy Help Accordion */}
              <AnimatePresence>
                {showPrivacyGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#f5f0e6] dark:bg-[#221e18] p-4 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] text-xs space-y-2 text-stone-600 dark:text-stone-300 overflow-hidden"
                  >
                    <div className="font-display font-bold uppercase text-[10px] text-stone-500 tracking-wider">
                      Langkah Menjadikan Library Steam Terbaca (Publik):
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-[11px] leading-relaxed">
                      <li>Buka aplikasi Steam atau website <span className="font-mono">steamcommunity.com</span>.</li>
                      <li>Masuk ke profil Anda lalu klik tombol <strong>Edit Profile</strong>.</li>
                      <li>Pilih menu <strong>Privacy Settings</strong> di sebelah kiri.</li>
                      <li>Ubah status <strong>"My Profile"</strong> menjadi <strong>Public</strong>.</li>
                      <li>Ubah status <strong>"Game Details"</strong> menjadi <strong>Public</strong> (jangan centang opsi sembunyikan playtime).</li>
                      <li>Salin link profil Anda (misal: <span className="font-mono text-[#a23b2c] dark:text-[#ff816c]">https://steamcommunity.com/id/username</span>) dan tempel di kolom input di atas.</li>
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fetched Games Section */}
              {fetchedUser && steamGames.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-[#d4c9a8]/40 dark:border-[#4b463e]/40">
                  {/* User Profile Bar */}
                  <div className="flex items-center justify-between bg-[#f5f0e6] dark:bg-[#252019] p-3 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e]">
                    <div className="flex items-center gap-3">
                      {fetchedUser.avatarUrl ? (
                        <img 
                          src={fetchedUser.avatarUrl} 
                          alt={fetchedUser.displayName} 
                          className="w-9 h-9 rounded-[3px] border border-[#d4c9a8] object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-[3px] bg-[#171a21] text-[#66c0f4] flex items-center justify-center">
                          <SteamIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-display font-bold uppercase tracking-wider text-[#3d3527] dark:text-[#e8dcc4]">
                          {fetchedUser.displayName}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          {fetchedUser.gameCount} Total Game di Akun Steam
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold bg-[#a23b2c]/10 dark:bg-[#ff816c]/10 text-[#a23b2c] dark:text-[#ff816c] px-2.5 py-1 rounded-[2px] border border-[#a23b2c]/20 dark:border-[#ff816c]/20">
                        {selectedAppIds.size} Dipilih
                      </span>
                    </div>
                  </div>

                  {/* Filter & Selection Control Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                    <div className="relative w-full sm:w-60">
                      <Search size={13} className="absolute left-2.5 top-2.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Cari dalam daftar library..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-[#f5f0e6] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                      />
                    </div>

                    {/* Filter Badges & Select All */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setPlaytimeFilter('all')}
                        className={`text-[10px] font-mono px-2 py-1 rounded-[2px] border cursor-pointer ${
                          playtimeFilter === 'all'
                            ? 'bg-[#3d3527] dark:bg-[#e8dcc4] text-white dark:text-[#221e18] border-[#3d3527]'
                            : 'bg-transparent text-stone-500 border-[#d4c9a8] dark:border-[#4b463e]'
                        }`}
                      >
                        Semua ({steamGames.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlaytimeFilter('played')}
                        className={`text-[10px] font-mono px-2 py-1 rounded-[2px] border cursor-pointer ${
                          playtimeFilter === 'played'
                            ? 'bg-[#3d3527] dark:bg-[#e8dcc4] text-white dark:text-[#221e18] border-[#3d3527]'
                            : 'bg-transparent text-stone-500 border-[#d4c9a8] dark:border-[#4b463e]'
                        }`}
                      >
                        Pernah Main ({steamGames.filter(g => (g.hoursOnRecord || 0) > 0).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlaytimeFilter('unplayed')}
                        className={`text-[10px] font-mono px-2 py-1 rounded-[2px] border cursor-pointer ${
                          playtimeFilter === 'unplayed'
                            ? 'bg-[#3d3527] dark:bg-[#e8dcc4] text-white dark:text-[#221e18] border-[#3d3527]'
                            : 'bg-transparent text-stone-500 border-[#d4c9a8] dark:border-[#4b463e]'
                        }`}
                      >
                        Backlog (0 Jam) ({steamGames.filter(g => (g.hoursOnRecord || 0) === 0).length})
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="ml-auto text-[10px] font-display font-bold uppercase text-[#a23b2c] dark:text-[#ff816c] hover:underline cursor-pointer flex items-center gap-1 pl-2"
                      >
                        {selectedAppIds.size === displayedGames.length && displayedGames.length > 0 ? (
                          <>
                            <Square size={12} />
                            <span>Batal Semua</span>
                          </>
                        ) : (
                          <>
                            <CheckSquare size={12} />
                            <span>Pilih Semua</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Game Cards Grid */}
                  <div className="border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-2 bg-[#f5f0e6] dark:bg-[#221e18] max-h-64 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {displayedGames.map((game) => {
                      const isSelected = selectedAppIds.has(game.appId);
                      return (
                        <div
                          key={game.appId}
                          onClick={() => handleToggleSingle(game.appId)}
                          className={`p-2.5 rounded-[4px] border transition cursor-pointer flex items-center gap-3 select-none ${
                            isSelected
                              ? 'bg-[#fdfaf2] dark:bg-[#2d2820] border-[#a23b2c] dark:border-[#ff816c] shadow-xs'
                              : 'bg-[#fdfaf2]/60 dark:bg-[#2d2820]/40 border-transparent hover:border-[#d4c9a8] opacity-70'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-[2px] flex items-center justify-center shrink-0 border ${
                            isSelected 
                              ? 'bg-[#a23b2c] dark:bg-[#ff816c] border-[#a23b2c] text-white dark:text-[#221e18]' 
                              : 'border-stone-400 bg-transparent'
                          }`}>
                            {isSelected && <Check size={12} />}
                          </div>

                          {/* Game Cover thumbnail if available */}
                          <div className="w-12 h-6 bg-[#171a21] rounded-[2px] overflow-hidden shrink-0 border border-[#d4c9a8]/30 flex items-center justify-center">
                            <img
                              src={`https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.appId}/header.jpg`}
                              alt={game.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#3d3527] dark:text-[#e8dcc4] truncate" title={game.name}>
                              {game.name}
                            </div>
                            <div className="text-[10px] font-mono text-stone-400 dark:text-stone-500 flex items-center gap-1">
                              <Clock size={10} />
                              <span>{(game.hoursOnRecord || 0) > 0 ? `${game.hoursOnRecord} Jam` : 'Belum Dimainkan'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'presets' ? (
            /* Presets & Catalog Tab */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search in Presets */}
                <div className="relative flex-1 max-w-xs">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Cari judul game di katalog..."
                    value={presetSearchTerm}
                    onChange={(e) => setPresetSearchTerm(e.target.value)}
                    className="w-full pl-8.5 pr-3 py-1.5 bg-[#f5f0e6] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[3px] text-xs font-mono focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                  />
                  {presetSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setPresetSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSelectAllPresets}
                  className="text-[11px] font-display font-bold uppercase text-[#a23b2c] dark:text-[#ff816c] hover:underline cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
                >
                  {selectedPresetGames.size === allFilteredPresetGames.length && allFilteredPresetGames.length > 0 ? (
                    <>
                      <Square size={13} />
                      <span>Batal Semua</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare size={13} />
                      <span>Pilih Semua ({allFilteredPresetGames.length})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Category Badges */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedPresetCategory('all')}
                  className={`text-[11px] font-display font-bold uppercase tracking-wider px-3 py-1.5 rounded-[3px] border cursor-pointer transition ${
                    selectedPresetCategory === 'all'
                      ? 'bg-[#3d3527] dark:bg-[#e8dcc4] text-white dark:text-[#221e18] border-[#3d3527]'
                      : 'bg-transparent text-stone-600 dark:text-stone-400 border-[#d4c9a8] dark:border-[#4b463e] hover:bg-stone-200/50'
                  }`}
                >
                  Semua Kategori ({PRESET_GROUPS.flatMap(g => g.games).length})
                </button>
                {PRESET_GROUPS.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedPresetCategory(g.id)}
                    className={`text-[11px] font-display font-bold uppercase tracking-wider px-3 py-1.5 rounded-[3px] border cursor-pointer transition ${
                      selectedPresetCategory === g.id
                        ? 'bg-[#3d3527] dark:bg-[#e8dcc4] text-white dark:text-[#221e18] border-[#3d3527]'
                        : 'bg-transparent text-stone-600 dark:text-stone-400 border-[#d4c9a8] dark:border-[#4b463e] hover:bg-stone-200/50'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>

              {/* Preset Games Grid */}
              <div className="border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-2 bg-[#f5f0e6] dark:bg-[#221e18] max-h-72 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {allFilteredPresetGames.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-xs text-stone-400 font-mono">
                    Tidak ditemukan game yang cocok dengan "{presetSearchTerm}".
                  </div>
                ) : (
                  allFilteredPresetGames.map((gameName) => {
                    const isSelected = selectedPresetGames.has(gameName);
                    return (
                      <div
                        key={gameName}
                        onClick={() => handleTogglePresetGame(gameName)}
                        className={`p-2 rounded-[4px] border transition cursor-pointer flex items-center gap-2.5 select-none ${
                          isSelected
                            ? 'bg-[#fdfaf2] dark:bg-[#2d2820] border-[#a23b2c] dark:border-[#ff816c] shadow-xs'
                            : 'bg-[#fdfaf2]/60 dark:bg-[#2d2820]/40 border-transparent hover:border-[#d4c9a8] opacity-75'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-[2px] flex items-center justify-center shrink-0 border ${
                          isSelected 
                            ? 'bg-[#a23b2c] dark:bg-[#ff816c] border-[#a23b2c] text-white dark:text-[#221e18]' 
                            : 'border-stone-400 bg-transparent'
                        }`}>
                          {isSelected && <Check size={12} />}
                        </div>
                        <span className="text-xs font-bold text-[#3d3527] dark:text-[#e8dcc4] truncate" title={gameName}>
                          {gameName}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Bulk Text Import Tab */
            <div className="space-y-4">
              {/* Quick Steam Copy Guide */}
              <div className="bg-[#f5f0e6] dark:bg-[#221e18] p-3.5 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] text-xs space-y-1.5 text-stone-600 dark:text-stone-300">
                <div className="font-display font-bold uppercase text-[10px] text-stone-500 tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#a23b2c] dark:text-[#ff816c]" />
                  <span>Cara Salin Cepat Seluruh Library dari Aplikasi Steam di PC (100% Berhasil):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
                  <li>Buka aplikasi <strong>Steam di Komputer</strong> &rarr; buka tab <strong>Library</strong>.</li>
                  <li>Ubah tampilan library ke <strong>View as List</strong> (ikon baris daftar).</li>
                  <li>Tekan <span className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">Ctrl + A</span> lalu <span className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">Ctrl + C</span> untuk menyalin seluruh nama game.</li>
                  <li>Tempelkan (<span className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">Ctrl + V</span>) di bawah, lalu klik tombol <strong>"Bersihkan Format"</strong>!</li>
                </ol>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="text-[10px] font-display font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                    Tempel Daftar Judul Game (Satu baris per judul)
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleInsertSampleGames}
                      className="text-[10px] font-mono px-2 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-[2px] text-stone-700 dark:text-stone-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={10} />
                      <span>Isi Contoh Game</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCleanBulkText}
                      className="text-[10px] font-mono px-2 py-1 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 border border-amber-300 dark:border-amber-800 rounded-[2px] text-amber-800 dark:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 size={10} />
                      <span>Bersihkan Format & Nomor</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-mono px-2 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 rounded-[2px] text-stone-700 dark:text-stone-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Upload size={10} />
                      <span>Unggah File .txt/.csv</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={7}
                  placeholder={`Contoh:\nElden Ring\nCyberpunk 2077\nHades II\nHollow Knight\nBaldur's Gate 3\nPersona 5 Royal\nGrand Theft Auto V`}
                  value={bulkText}
                  onChange={(e) => {
                    setBulkText(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full p-3 bg-[#f5f0e6] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs font-mono focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                />
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mt-1">
                  <span>{bulkText.split(/\r?\n|,/).filter(s => s.trim()).length} game terdeteksi</span>
                  {bulkText && (
                    <button
                      type="button"
                      onClick={() => setBulkText('')}
                      className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      Hapus Teks
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Destination Target Configuration */}
          {(fetchedUser || activeTab === 'bulk' || activeTab === 'presets') && (
            <div className="bg-[#f5f0e6] dark:bg-[#252019] p-4 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] space-y-4">
              <div className="text-[10px] font-display font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <FolderPlus size={13} className="text-[#a23b2c] dark:text-[#ff816c]" />
                <span>Pilih Tujuan Impor Game:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Option 1: Create New Spinner Category */}
                <label
                  onClick={() => setImportTarget('new_cat')}
                  className={`p-3 rounded-[4px] border cursor-pointer transition flex flex-col justify-between ${
                    importTarget === 'new_cat'
                      ? 'bg-[#fdfaf2] dark:bg-[#2d2820] border-[#a23b2c] dark:border-[#ff816c] shadow-xs'
                      : 'border-transparent bg-stone-200/50 dark:bg-[#1f1b15]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-display font-bold uppercase text-[11px]">
                    <Layers size={14} className="text-[#a23b2c] dark:text-[#ff816c]" />
                    <span>Buat Kategori Baru</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                    Buat kategori Spinner baru khusus untuk game-game ini.
                  </p>
                </label>

                {/* Option 2: Add to Existing Category */}
                <label
                  onClick={() => setImportTarget('existing_cat')}
                  className={`p-3 rounded-[4px] border cursor-pointer transition flex flex-col justify-between ${
                    importTarget === 'existing_cat'
                      ? 'bg-[#fdfaf2] dark:bg-[#2d2820] border-[#a23b2c] dark:border-[#ff816c] shadow-xs'
                      : 'border-transparent bg-stone-200/50 dark:bg-[#1f1b15]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-display font-bold uppercase text-[11px]">
                    <FolderPlus size={14} className="text-[#a23b2c] dark:text-[#ff816c]" />
                    <span>Kategori yang Ada</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                    Masukkan game ke salah satu kategori Spinner yang sudah ada.
                  </p>
                </label>

                {/* Option 3: Add to Wishlist */}
                <label
                  onClick={() => setImportTarget('wishlist')}
                  className={`p-3 rounded-[4px] border cursor-pointer transition flex flex-col justify-between ${
                    importTarget === 'wishlist'
                      ? 'bg-[#fdfaf2] dark:bg-[#2d2820] border-[#a23b2c] dark:border-[#ff816c] shadow-xs'
                      : 'border-transparent bg-stone-200/50 dark:bg-[#1f1b15]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-display font-bold uppercase text-[11px]">
                    <Bookmark size={14} className="text-[#a23b2c] dark:text-[#ff816c]" />
                    <span>Wishlist Game</span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                    Simpan seluruh game ini ke daftar Arsip Wishlist Anda.
                  </p>
                </label>
              </div>

              {/* Sub-inputs for target */}
              {importTarget === 'new_cat' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#d4c9a8]/40 dark:border-[#4b463e]/40">
                  <div>
                    <label className="text-[10px] font-display font-bold uppercase text-stone-500 block mb-1">
                      Nama Kategori Baru
                    </label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#fdfaf2] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs focus:outline-none focus:border-[#a23b2c]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-display font-bold uppercase text-stone-500 block mb-1">
                      Warna Kategori
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newCatColor}
                        onChange={(e) => setNewCatColor(e.target.value)}
                        className="w-9 h-8 rounded border border-[#d4c9a8] cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold text-stone-500">{newCatColor}</span>
                    </div>
                  </div>
                </div>
              )}

              {importTarget === 'existing_cat' && (
                <div className="pt-2 border-t border-[#d4c9a8]/40 dark:border-[#4b463e]/40">
                  <label className="text-[10px] font-display font-bold uppercase text-stone-500 block mb-1">
                    Pilih Kategori Spinner Tujuan
                  </label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => setSelectedCatId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfaf2] dark:bg-[#221e18] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.games?.length || 0} game saat ini)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#d4c9a8] dark:border-[#4b463e] flex items-center justify-between bg-[#f5f0e6] dark:bg-[#252019]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={
              (activeTab === 'steam' && selectedAppIds.size === 0) ||
              (activeTab === 'presets' && selectedPresetGames.size === 0) ||
              (activeTab === 'bulk' && !bulkText.trim())
            }
            className="px-6 py-2.5 bg-[#a23b2c] hover:bg-[#8f3224] dark:bg-[#ff816c] dark:hover:bg-[#f8654d] text-white dark:text-[#171a21] font-display font-bold text-xs uppercase tracking-widest rounded-[4px] border border-[#a23b2c] dark:border-[#ff816c] shadow-sm transition disabled:opacity-40 cursor-pointer flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>
              {activeTab === 'steam'
                ? `Impor ${selectedAppIds.size} Game Terpilih`
                : activeTab === 'presets'
                ? `Impor ${selectedPresetGames.size} Game Rekomendasi`
                : 'Impor Daftar Game'}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
