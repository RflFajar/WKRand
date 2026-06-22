import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Settings, 
  Plus, 
  X, 
  Check, 
  Gamepad2, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ChevronRight, 
  Dice5,
  Volume2,
  VolumeX,
  PlusCircle,
  HelpCircle,
  AlertOctagon,
  AlertTriangle,
  History,
  Download,
  Upload
} from 'lucide-react';
import { GameCategory, GameItem, SpinResult } from '../types';
import ConfirmDialog from './ConfirmDialog';
import SpinHistory from './SpinHistory';
import SpinStats from './SpinStats';
import { BarChart3 } from 'lucide-react';

// Default categories and games
const DEFAULT_CATEGORIES: GameCategory[] = [
  {
    id: '1',
    name: 'Game Shooter / Aksi',
    color: '#f43f5e',
    textColor: '#f43f5e',
    borderColor: '#fecdd3',
    games: [
      { id: 'g-1-1', name: 'Valorant' },
      { id: 'g-1-2', name: 'Apex Legends' },
      { id: 'g-1-3', name: 'PUBG Mobile' },
      { id: 'g-1-4', name: 'CS2' },
      { id: 'g-1-5', name: 'Call of Duty: Warzone' },
      { id: 'g-1-6', name: 'GTA V' }
    ]
  },
  {
    id: '2',
    name: 'RPG / Petualangan',
    color: '#6366f1',
    textColor: '#6366f1',
    borderColor: '#c7d2fe',
    games: [
      { id: 'g-2-1', name: 'Genshin Impact' },
      { id: 'g-2-2', name: 'Elden Ring' },
      { id: 'g-2-3', name: 'Zelda: TotK' },
      { id: 'g-2-4', name: 'Cyberpunk 2077' },
      { id: 'g-2-5', name: 'The Witcher 3' },
      { id: 'g-2-6', name: 'Minecraft' }
    ]
  },
  {
    id: '3',
    name: 'Game Casual / Santai',
    color: '#10b981',
    textColor: '#10b981',
    borderColor: '#a7f3d0',
    games: [
      { id: 'g-3-1', name: 'Stardew Valley' },
      { id: 'g-3-2', name: 'Fall Guys' },
      { id: 'g-3-3', name: 'Roblox' },
      { id: 'g-3-4', name: 'Among Us' },
      { id: 'g-3-5', name: 'Overcooked! 2' },
      { id: 'g-3-6', name: 'Animal Crossing' }
    ]
  },
  {
    id: '4',
    name: 'MOBA / Strategi',
    color: '#f59e0b',
    textColor: '#f59e0b',
    borderColor: '#fde68a',
    games: [
      { id: 'g-4-1', name: 'Mobile Legends' },
      { id: 'g-4-2', name: 'Dota 2' },
      { id: 'g-4-3', name: 'League of Legends' },
      { id: 'g-4-4', name: 'Clash Royale' },
      { id: 'g-4-5', name: 'Chess.com' },
      { id: 'g-4-6', name: 'Clash of Clans' }
    ]
  }
];

const PRESET_COLORS = [
  { name: 'Rose', bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-200', hex: '#f43f5e', textHex: '#f43f5e', borderHex: '#fecdd3' },
  { name: 'Indigo', bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-200', hex: '#6366f1', textHex: '#6366f1', borderHex: '#c7d2fe' },
  { name: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-200', hex: '#10b981', textHex: '#10b981', borderHex: '#a7f3d0' },
  { name: 'Amber', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-200', hex: '#f59e0b', textHex: '#f59e0b', borderHex: '#fde68a' },
  { name: 'Violet', bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-200', hex: '#8b5cf6', textHex: '#8b5cf6', borderHex: '#ddd6fe' },
  { name: 'Cyan', bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-200', hex: '#06b6d4', textHex: '#06b6d4', borderHex: '#a5f3fc' },
  { name: 'Fuchsia', bg: 'bg-fuchsia-500', text: 'text-fuchsia-500', border: 'border-fuchsia-200', hex: '#d946ef', textHex: '#d946ef', borderHex: '#f5d0fe' },
  { name: 'Orange', bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-200', hex: '#f97316', textHex: '#f97316', borderHex: '#fed7aa' },
  { name: 'Pink', bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-200', hex: '#ec4899', textHex: '#ec4899', borderHex: '#fbcfe8' },
  { name: 'Teal', bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-200', hex: '#14b8a6', textHex: '#14b8a6', borderHex: '#99f6e4' },
  { name: 'Sky', bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-200', hex: '#0ea5e9', textHex: '#0ea5e9', borderHex: '#bae6fd' },
  { name: 'Lime', bg: 'bg-lime-500', text: 'text-lime-500', border: 'border-lime-200', hex: '#84cc16', textHex: '#84cc16', borderHex: '#d9f99d' },
  { name: 'Yellow', bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-200', hex: '#eab308', textHex: '#eab308', borderHex: '#fef08a' },
  { name: 'Purple', bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-200', hex: '#a855f7', textHex: '#a855f7', borderHex: '#e9d5ff' },
  { name: 'Red', bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-200', hex: '#ef4444', textHex: '#ef4444', borderHex: '#fecaca' },
  { name: 'Slate', bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-300', hex: '#475569', textHex: '#475569', borderHex: '#cbd5e1' }
];

function getCategoryStyle(cat: GameCategory | null | undefined) {
  if (!cat) return {};
  return {
    backgroundColor: cat.color,
    color: '#ffffff'
  };
}

function convertCategoryToHex(cat: GameCategory): GameCategory {
  if (cat.color && cat.color.startsWith('#')) {
    const textColor = (cat.textColor && cat.textColor.startsWith('#')) ? cat.textColor : cat.color;
    const borderColor = (cat.borderColor && cat.borderColor.startsWith('#')) ? cat.borderColor : '#cbd5e1';
    return {
      ...cat,
      color: cat.color,
      textColor,
      borderColor,
    };
  }
  
  const preset = PRESET_COLORS.find(p => p.bg === cat.color || p.text === cat.textColor || p.border === cat.borderColor);
  if (preset) {
    return {
      ...cat,
      color: preset.hex,
      textColor: preset.textHex,
      borderColor: preset.borderHex,
    };
  }
  
  return {
    ...cat,
    color: '#6366f1',
    textColor: '#6366f1',
    borderColor: '#c7d2fe',
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValidGameItem(item: any): item is GameItem {
  return !!(
    item &&
    typeof item.id === 'string' && item.id.trim() !== '' &&
    typeof item.name === 'string' && item.name.trim() !== ''
  );
}

function isValidGameCategory(item: any): item is GameCategory {
  return !!(
    item &&
    typeof item.id === 'string' && item.id.trim() !== '' &&
    typeof item.name === 'string' && item.name.trim() !== '' &&
    typeof item.color === 'string' && item.color.trim() !== '' &&
    Array.isArray(item.games) &&
    item.games.every((g: any) => typeof g === 'string' || isValidGameItem(g))
  );
}

function sanitizeAndMigrateImportedCategories(parsed: any): GameCategory[] | null {
  let rawList: any[] = [];
  
  if (Array.isArray(parsed)) {
    rawList = parsed;
  } else if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.categories)) {
      rawList = parsed.categories;
    } else if (Array.isArray(parsed.data)) {
      rawList = parsed.data;
    } else if (Array.isArray(parsed.list)) {
      rawList = parsed.list;
    }
  }

  if (rawList.length === 0) return null;

  const sanitized: GameCategory[] = [];

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item || typeof item !== 'object') continue;

    const id = typeof item.id === 'string' && item.id.trim() !== '' ? item.id : `cat-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
    const name = typeof item.name === 'string' && item.name.trim() !== '' ? item.name : `Kategori ${i + 1}`;
    const color = typeof item.color === 'string' && item.color.trim() !== '' ? item.color : '#6366f1';

    // Handle games array
    const rawGames = Array.isArray(item.games) ? item.games : [];
    const migratedGames: GameItem[] = rawGames.map((g: any, gIdx: number) => {
      if (typeof g === 'string') {
        return {
          id: `migrated-${id}-${gIdx}-${Math.random().toString(36).substring(2, 6)}`,
          name: g
        };
      }
      if (g && typeof g === 'object') {
        const gId = typeof g.id === 'string' && g.id.trim() !== '' ? g.id : `game-${Date.now()}-${gIdx}-${Math.random().toString(36).substring(2, 6)}`;
        const gName = typeof g.name === 'string' && g.name.trim() !== '' ? g.name : `Game ${gIdx + 1}`;
        return { id: gId, name: gName };
      }
      return {
        id: `migrated-${id}-${gIdx}-${Math.random().toString(36).substring(2, 6)}`,
        name: String(g)
      };
    });

    const textColor = typeof item.textColor === 'string' && item.textColor.trim() !== '' ? item.textColor : color;
    const borderColor = typeof item.borderColor === 'string' && item.borderColor.trim() !== '' ? item.borderColor : '#cbd5e1';

    sanitized.push({
      id,
      name,
      color,
      textColor,
      borderColor,
      games: migratedGames
    });
  }

  return sanitized.length > 0 ? sanitized : null;
}

const SPIN_ANIMATION_MS = 5000;
const SPIN_TICK_FACTOR = 5000;

export default function GameSpinner() {
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Load initial data from local storage or defaults
  const [categories, setCategories] = useState<GameCategory[]>(() => {
    const saved = localStorage.getItem('game_spinner_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(isValidGameCategory)) {
          // Perform migration of games from string[] to GameItem[] if encountered
          const migrated: GameCategory[] = parsed.map(cat => {
            const migratedGames: GameItem[] = cat.games.map((g: any, idx: number) => {
              if (typeof g === 'string') {
                return {
                  id: `migrated-${cat.id}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
                  name: g
                };
              }
              return g;
            });
            return {
              ...cat,
              games: migratedGames
            };
          });
          return migrated.map(convertCategoryToHex);
        } else {
          console.warn('Data localStorage game_spinner_categories tidak valid.');
        }
      } catch (e) {
        console.error('Failed to parse categories, using defaults', e);
      }
    }
    return DEFAULT_CATEGORIES.map(convertCategoryToHex);
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Persist to local storage with debounce and error handling
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem('game_spinner_categories', JSON.stringify(categories));
      } catch (e) {
        console.error('Gagal menulis ke localStorage:', e);
        setToast({
          message: 'Gagal menduplikat data ke local storage. Kapasitas penyimpanan penuh!',
          type: 'error'
        });
      }
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [categories]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'game_spinner_categories' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.every(isValidGameCategory)) {
            setCategories(parsed.map(convertCategoryToHex));
          }
        } catch (error) {
          console.error('Gagal memperbarui kategori dari tab lain:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // States for spinner logic
  const [stage, setStage] = useState<'category' | 'game' | 'result'>('category');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [shuffledGames, setShuffledGames] = useState<GameItem[]>([]);
  const [shuffledCategories, setShuffledCategories] = useState<GameCategory[]>([]);
  
  // Shuffle categories once on load, and keep in sync keeping original shuffled order on minor edits
  useEffect(() => {
    setShuffledCategories(prev => {
      if (prev.length !== categories.length) {
        return shuffleArray(categories);
      }
      return prev.map(p => {
        const found = categories.find(c => c.id === p.id);
        return found ? { ...found } : p;
      });
    });
  }, [categories]);
  
  // Shuffle games whenever the selected category changes or is modified
  useEffect(() => {
    if (selectedCategory) {
      const latestCategory = categories.find(c => c.id === selectedCategory.id) || selectedCategory;
      setShuffledGames(shuffleArray(latestCategory.games));
    } else {
      setShuffledGames([]);
    }
  }, [selectedCategory, categories]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('game_spinner_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('game_spinner_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'game_spinner_sound_enabled' && e.newValue !== null) {
        setSoundEnabled(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Rotation angles for visual feedback (wheels)
  const [categoryRotation, setCategoryRotation] = useState(0);
  const [gameRotation, setGameRotation] = useState(0);

  // Management panel state
  const [showManager, setShowManager] = useState(false);
  const [editCategoryIdx, setEditCategoryIdx] = useState<number | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColorIdx, setNewCatColorIdx] = useState(0);
  const [customHexColor, setCustomHexColor] = useState('#8b5cf6');
  const [newGameInput, setNewGameInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportCategories, setPendingImportCategories] = useState<GameCategory[] | null>(null);
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>(() => {
    try {
      const saved = localStorage.getItem('spin_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse spin history:', e);
      return [];
    }
  });
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState<'history' | 'stats'>('history');

  const [showNewBadge, setShowNewBadge] = useState(() => {
    const dismissed = localStorage.getItem('game_spinner_badge_dismissed');
    if (dismissed) return false;
    const firstVisit = localStorage.getItem('game_spinner_first_visit');
    if (!firstVisit) {
      localStorage.setItem('game_spinner_first_visit', Date.now().toString());
      return true;
    }
    return (Date.now() - parseInt(firstVisit)) < 7 * 24 * 60 * 60 * 1000; // 7 hari
  });

  const gameInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus game input automatically when editCategoryIdx changes to a valid number
  useEffect(() => {
    if (editCategoryIdx !== null && gameInputRef.current) {
      gameInputRef.current.focus();
    }
  }, [editCategoryIdx]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportConfig = () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${date}`;
      
      const fileName = `multi-spinner-config-${formattedDate}.json`;
      const jsonString = JSON.stringify(categories, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setToast({
        message: 'Konfigurasi berhasil diekspor!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error exporting config:', error);
      setToast({
        message: 'Gagal mengekspor konfigurasi!',
        type: 'error'
      });
    }
  };

  const handleImportTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset to allow importing same file again
      fileInputRef.current.click();
    }
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Gagal membaca file');
        }

        const parsed = JSON.parse(text);
        const validatedCategories = sanitizeAndMigrateImportedCategories(parsed);

        if (!validatedCategories || validatedCategories.length === 0) {
          setToast({
            message: 'Format file tidak valid atau daftar kategori kosong',
            type: 'error'
          });
          return;
        }

        // Store categories and trigger safe ConfirmDialog modal
        setPendingImportCategories(validatedCategories);
        setShowImportConfirm(true);
      } catch (err) {
        console.error('Error parsing imported file:', err);
        setToast({
          message: 'Format file tidak valid atau file JSON korup',
          type: 'error'
        });
      }
    };

    reader.onerror = () => {
      setToast({
        message: 'Gagal membaca file konfigurasi',
        type: 'error'
      });
    };

    reader.readAsText(file);
  };

  // Trigger confetti on result
  useEffect(() => {
    if (stage === 'result' && selectedGame) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        // First wave: celebratory, central
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#5B8DEF', '#FFD93D', '#6BCB77', '#FF6B6B']
        });

        // Second wave: from left side, after 300ms delay
        const timer = setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
        }, 300);

        return () => clearTimeout(timer);
      }
    }
  }, [stage, selectedGame]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on user interaction to bypass browser restrictions
  const initAudio = useCallback(() => {
    if (!soundEnabled) return null;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      // Play a tiny silent note synchronous to user click to unlock AudioContext
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.01);
      
      return ctx;
    } catch (e) {
      console.warn('Failed to initialize AudioContext', e);
      return null;
    }
  }, [soundEnabled]);

  // Audio trigger for start-spinning whoosh
  const playStartSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // ignore
    }
  }, [soundEnabled]);

  // Audio trigger for tick (clicking wheel)
  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine'; // crisp mechanical click
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      // ignore
    }
  }, [soundEnabled]);

  // Audio trigger for winning (upbeat chime arpeggio)
  const playWinChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      
      const playChimeNode = (freq: number, delay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + delay + duration);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      // Play an elegant major chord arpeggio
      playChimeNode(523.25, 0, 0.45);      // C5
      playChimeNode(659.25, 0.1, 0.45);    // E5
      playChimeNode(783.99, 0.2, 0.55);    // G5
      playChimeNode(1046.50, 0.3, 0.65);   // C6
    } catch (e) {
      // ignore
    }
  }, [soundEnabled]);

  // Function to spin a wheel
  const handleSpinCategory = () => {
    const listToFilter = shuffledCategories.length > 0 ? shuffledCategories : categories;
    const activeCategories = listToFilter.filter(c => c.games.length > 0);
    const skippedCount = listToFilter.length - activeCategories.length;
    
    if (activeCategories.length === 0) {
      setToast({
        message: 'Tidak ada kategori aktif yang memiliki minimal 1 game! Silakan tambahkan game terlebih dahulu.',
        type: 'error'
      });
      return;
    }

    if (isSpinning) return;

    if (skippedCount > 0) {
      setToast({
        message: `${skippedCount} kategori tanpa game otomatis dilewati dari putaran.`,
        type: 'success'
      });
    }
    
    // Resume and initialize audio context synchronously under direct user gesture
    initAudio();
    setIsSpinning(true);
    
    // Play start click sweep sound synchronously
    setTimeout(() => {
      playStartSound();
    }, 50);

    // Determine winner
    const winnerIdx = Math.floor(Math.random() * activeCategories.length);
    const winner = activeCategories[winnerIdx];
    
    // Rotation calculations
    const sliceAngle = 360 / activeCategories.length;
    const extraRotations = 6 + Math.floor(Math.random() * 3);
    const desiredModulo = (360 - (winnerIdx * sliceAngle) - (sliceAngle / 2)) % 360;
    
    // Smooth cumulative rotation calculation (always rotates forward with high momentum)
    const currentOffset = categoryRotation % 360;
    const diffShortest = (desiredModulo - currentOffset + 360) % 360;
    const targetAngle = categoryRotation + (extraRotations * 360) + diffShortest;
    
    const diff = targetAngle - categoryRotation;
    const ticks = Math.floor(diff / 24);
    
    for (let i = 1; i <= ticks; i++) {
      const progress = i / ticks;
      const t = Math.pow(progress, 2.2) * SPIN_TICK_FACTOR; // decelerating perfectly
      setTimeout(() => {
        playTick();
      }, t);
    }

    setCategoryRotation(targetAngle);

    setTimeout(() => {
      setSelectedCategory(winner);
      setIsSpinning(false);
      playWinChime(); // Celebratory finished sound
      
      // Reshuffle categories for subsequent spin positions after completion
      setShuffledCategories(prev => shuffleArray(prev));
      
      setTimeout(() => {
        setStage('game');
      }, 1200);
    }, SPIN_ANIMATION_MS + 100);
  };

  const handleSpinGame = () => {
    if (isSpinning || shuffledGames.length === 0) return;
    
    // Resume and initialize audio context synchronously under direct user gesture
    initAudio();
    setIsSpinning(true);

    // Play start click sweep sound synchronously
    setTimeout(() => {
      playStartSound();
    }, 50);

    const winnerIdx = Math.floor(Math.random() * shuffledGames.length);
    const winner = shuffledGames[winnerIdx];
    
    const sliceAngle = 360 / shuffledGames.length;
    const extraRotations = 6 + Math.floor(Math.random() * 3);
    const desiredModulo = (360 - (winnerIdx * sliceAngle) - (sliceAngle / 2)) % 360;
    
    // Smooth cumulative rotation calculation (always rotates forward with high momentum)
    const currentOffset = gameRotation % 360;
    const diffShortest = (desiredModulo - currentOffset + 360) % 360;
    const targetAngle = gameRotation + (extraRotations * 360) + diffShortest;
    
    const diff = targetAngle - gameRotation;
    const ticks = Math.floor(diff / 24);
    
    for (let i = 1; i <= ticks; i++) {
      const progress = i / ticks;
      const t = Math.pow(progress, 2.2) * SPIN_TICK_FACTOR;
      setTimeout(() => {
        playTick();
      }, t);
    }

    setGameRotation(targetAngle);

    setTimeout(() => {
      setSelectedGame(winner.name);
      setIsSpinning(false);
      playWinChime(); // Celebratory finished sound
      setStage('result');
      
      // Reshuffle games for subsequent spin positions
      setShuffledGames(prev => shuffleArray(prev));

      // Save spin result to history
      if (selectedCategory) {
        const newResult: SpinResult = {
          id: `spin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          categoryName: selectedCategory.name,
          gameName: winner.name,
          timestamp: Date.now()
        };
        setSpinHistory(prev => {
          const updated = [newResult, ...prev].slice(0, 50);
          localStorage.setItem('spin_history', JSON.stringify(updated));
          return updated;
        });
      }
    }, SPIN_ANIMATION_MS + 100);
  };

  const resetAll = () => {
    if (isSpinning) return;
    setStage('category');
    setSelectedCategory(null);
    setSelectedGame(null);
    // Do not reset rotations, just let them start from current values to keep seamless
  };

  const handleClearSpinHistory = () => {
    setSpinHistory([]);
    localStorage.removeItem('spin_history');
  };

  // Category & Game Management Functions
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    
    let colorVal = '';
    let textVal = '';
    let borderVal = '';
    
    if (newCatColorIdx === -1) {
      colorVal = customHexColor;
      textVal = '#ffffff';
      borderVal = '#cbd5e1';
    } else {
      const preset = PRESET_COLORS[newCatColorIdx];
      colorVal = preset.hex;
      textVal = preset.textHex;
      borderVal = preset.borderHex;
    }

    const newCat: GameCategory = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      color: colorVal,
      textColor: textVal,
      borderColor: borderVal,
      games: []
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    // Focus or show the input for game directly
    setEditCategoryIdx(categories.length);
  };

  const handleUpdateCategoryName = (idx: number, name: string) => {
    const updated = [...categories];
    updated[idx].name = name;
    setCategories(updated);
  };

  const handleUpdateCategoryColor = (idx: number, colorIdx: number) => {
    const updated = [...categories];
    const preset = PRESET_COLORS[colorIdx];
    updated[idx].color = preset.hex;
    updated[idx].textColor = preset.textHex;
    updated[idx].borderColor = preset.borderHex;
    setCategories(updated);
  };

  const handleUpdateCategoryColorCustom = (idx: number, hex: string) => {
    const updated = [...categories];
    updated[idx].color = hex;
    updated[idx].textColor = '#ffffff';
    updated[idx].borderColor = '#cbd5e1';
    setCategories(updated);
  };

  const handleDeleteCategory = (idx: number) => {
    if (categories.length <= 1) {
      alert("Kamu harus menyisakan minimal 1 kategori!");
      return;
    }
    const catToDelete = categories[idx];
    const updated = categories.filter((_, i) => i !== idx);
    setCategories(updated);
    
    // Check if the deleted category is the current selectedCategory
    if (selectedCategory && selectedCategory.id === catToDelete.id) {
      setSelectedCategory(null);
      setSelectedGame(null);
      setStage('category');
    }

    if (editCategoryIdx === idx) {
      setEditCategoryIdx(null);
    } else if (editCategoryIdx !== null && editCategoryIdx > idx) {
      setEditCategoryIdx(editCategoryIdx - 1);
    }
  };

  const handleAddGameToCategory = (catIdx: number) => {
    if (!newGameInput.trim()) return;
    const lines = newGameInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) return;

    const gameItems: GameItem[] = lines.map((name, i) => ({
      id: `game-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      name
    }));

    const updated = [...categories];
    updated[catIdx].games.push(...gameItems);
    setCategories(updated);
    setNewGameInput('');
  };

  const handleDeleteGameFromCategory = (catIdx: number, gameIdx: number) => {
    const updated = [...categories];
    updated[catIdx].games = updated[catIdx].games.filter((_, i) => i !== gameIdx);
    setCategories(updated);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl shadow-xl flex items-start gap-3"
          >
            <div className="bg-rose-100 p-1.5 rounded-lg text-rose-600 mt-0.5" role="alert">
              <AlertOctagon size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-900 leading-tight">Penyimpanan Gagal</p>
              <p className="text-xs text-rose-700 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-rose-400 hover:text-rose-600 transition cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {showNewBadge && (
              <span
                onClick={() => {
                  setShowNewBadge(false);
                  localStorage.setItem('game_spinner_badge_dismissed', 'true');
                }}
                className="px-3 py-1 bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-violet-200 dark:hover:bg-violet-900/40 transition-all flex items-center gap-1.5 active:scale-95 select-none"
                title="Klik untuk menyembunyikan badge ini selamanya"
              >
                Fitur Baru
                <span className="text-[9px] font-normal lowercase opacity-85 hover:opacity-100 bg-violet-200/50 px-1 rounded">×</span>
              </span>
            )}
            <div className="p-1 bg-violet-600 rounded-lg text-white">
              <Dice5 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Game Category Spinner</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Spinner bertingkat: pilih Kategori, lalu pilih Game yang akan dimainkan!</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap justify-start sm:justify-end">
          {/* Sound toggle button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-11 h-11 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-355 hover:text-slate-900 dark:hover:text-slate-50 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-violet-350 dark:hover:border-violet-500 transition-all shadow-sm cursor-pointer flex items-center justify-center shrink-0"
            title={soundEnabled ? "Matikan Efek Suara" : "Aktifkan Efek Suara"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-violet-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Manage database button */}
          <button
            onClick={() => setShowManager(!showManager)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 h-11 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-550 hover:text-violet-600 dark:hover:text-violet-400 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            title="Kelola daftar kategori dan game"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Kelola Game & Kategori
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core Game Arena */}
        <div className="lg:col-span-12">
          <AnimatePresence mode="wait">
            {showManager ? (
              /* Database / Category manager screen */
              <motion.div
                key="manager"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Settings className="text-violet-500 w-5 h-5 animate-spin-once" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Database & Kategori Manager</h3>
                  </div>
                  <button 
                    onClick={() => setShowManager(false)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-full transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Categories List */}
                  <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-6">
                    <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">List Kategori ({categories.length})</h4>
                    
                    {/* Add Category Form */}
                    <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl mb-4 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Tambah Kategori Baru</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nama Kategori..."
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 font-medium text-slate-800 dark:text-slate-100"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                          onClick={handleAddCategory}
                          className="p-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl transition cursor-pointer"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Pick color for new Cat */}
                      <div className="mt-3">
                        <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                          <span>Pilih Warna Kategori:</span>
                          {newCatColorIdx === -1 && (
                            <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/45 px-1.5 py-0.5 rounded uppercase">{customHexColor}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 items-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                          {PRESET_COLORS.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setNewCatColorIdx(idx);
                                setCustomHexColor(preset.hex);
                              }}
                              className={`w-6 h-6 rounded-full flex-shrink-0 transition-all border-2 cursor-pointer ${newCatColorIdx === idx ? 'scale-110 border-slate-800 dark:border-slate-200 shadow-sm' : 'border-transparent'}`}
                              style={{ backgroundColor: preset.hex }}
                              title={preset.name}
                            />
                          ))}
                          
                          {/* Unlimited Color Picker */}
                          <div className="h-6 w-px bg-slate-200 dark:bg-slate-850 mx-1 flex-shrink-0" />
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-750 flex items-center justify-center cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 transition active:scale-95 flex-shrink-0" title="Pilih warna kustom tanpa batas">
                            <input
                              type="color"
                              value={customHexColor}
                              onChange={(e) => {
                                setCustomHexColor(e.target.value);
                                setNewCatColorIdx(-1);
                              }}
                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                            <div 
                              className="w-5 h-5 rounded-full shadow-inner" 
                              style={{ backgroundColor: customHexColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Categories item list */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {categories.map((cat, idx) => (
                        <div
                          key={cat.id}
                          onClick={() => setEditCategoryIdx(idx)}
                          className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${editCategoryIdx === idx ? 'bg-violet-50 dark:bg-violet-955/20 border-violet-200 dark:border-violet-850 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/60'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={getCategoryStyle(cat)}
                            />
                            <span className="font-extrabold text-slate-800 dark:text-slate-150 text-sm">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {cat.games.length === 0 ? (
                              <span className="text-[10px] font-black bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-lg flex items-center gap-1 animate-pulse" title="Kategori ini kosong!">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Butuh Game
                              </span>
                            ) : (
                              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{cat.games.length} Game</span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(idx);
                              }}
                              className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Game Titles of selected category */}
                  <div className="md:col-span-7">
                    {editCategoryIdx !== null && categories[editCategoryIdx] ? (
                      <div>
                        {/* Selected Cat Header */}
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 mb-6">
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.55">
                              <span className="text-xs font-black text-slate-400 dark:text-slate-505 uppercase tracking-widest">Detail & Warna Kategori</span>
                              <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded uppercase">{categories[editCategoryIdx].color}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                              {PRESET_COLORS.map((preset, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => handleUpdateCategoryColor(editCategoryIdx, pIdx)}
                                  className={`w-5 h-5 rounded-full transition-all border-2 cursor-pointer ${categories[editCategoryIdx].color === preset.hex ? 'scale-110 border-slate-800 dark:border-slate-200' : 'border-transparent'}`}
                                  style={{ backgroundColor: preset.hex }}
                                  title={preset.name}
                                />
                              ))}
                              
                              {/* Unlimited Color Picker */}
                              <div className="h-5 w-px bg-slate-200 dark:bg-slate-805 mx-1 flex-shrink-0" />
                              <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-705 flex items-center justify-center cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 transition" title="Ganti ke warna kustom">
                                <input
                                  type="color"
                                  value={categories[editCategoryIdx].color}
                                  onChange={(e) => handleUpdateCategoryColorCustom(editCategoryIdx, e.target.value)}
                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                                <div 
                                  className="w-4 h-4 rounded-full shadow-xs" 
                                  style={{ backgroundColor: categories[editCategoryIdx].color }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <input
                            type="text"
                            value={categories[editCategoryIdx].name}
                            onChange={(e) => handleUpdateCategoryName(editCategoryIdx, e.target.value)}
                            className="w-full text-lg font-black bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-slate-800 dark:text-slate-105 focus:ring-2 focus:ring-violet-400 focus:outline-none"
                          />
                        </div>

                        {/* List of Game Titles */}
                        <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Daftar Game ({categories[editCategoryIdx].games.length})</h4>
                        
                        {/* New Game Input with Multi-line Support */}
                        <div className="flex flex-col gap-2 mb-4 bg-slate-50/50 dark:bg-slate-950/30 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                          <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Masukkan Nama-nama Game (bisa sekaligus, pisahkan per baris):
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <textarea
                              ref={gameInputRef}
                              rows={3}
                              placeholder="Contoh:&#10;Danganronpa&#10;Mobile Legend&#10;Pou"
                              value={newGameInput}
                              onChange={(e) => setNewGameInput(e.target.value)}
                              className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 font-medium resize-none min-h-[80px] text-slate-800 dark:text-slate-100"
                            />
                            <button
                              onClick={() => handleAddGameToCategory(editCategoryIdx)}
                              className="sm:self-end px-5 py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Tambah ke List</span>
                            </button>
                          </div>
                        </div>

                        {/* Game Pills container */}
                        <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto p-1 bg-slate-50 dark:bg-slate-950/35 rounded-2xl border border-slate-100 dark:border-slate-850">
                          {categories[editCategoryIdx].games.length === 0 ? (
                            <div className="w-full text-center py-6 text-xs font-bold text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
                              <Gamepad2 className="w-8 h-8 text-slate-300 dark:text-slate-650" />
                              Kategori ini masih kosong! Tambahkan game di atas.
                            </div>
                          ) : (
                            categories[editCategoryIdx].games.map((g, gIdx) => (
                              <div
                                key={g.id}
                                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 text-sm shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition"
                              >
                                {g.name}
                                <button
                                  onClick={() => handleDeleteGameFromCategory(editCategoryIdx, gIdx)}
                                  className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400 dark:text-slate-500">
                        <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-705 mb-3" />
                        <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Kategori</h5>
                        <p className="text-xs font-medium max-w-[280px]">Pilih salah satu kategori di list kiri untuk mulai menambahkan atau merubah game!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={handleExportConfig}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                      title="Ekspor seluruh konfigurasi kategori dan daftar game ke file JSON"
                    >
                      <Download className="w-4 h-4 text-violet-500" />
                      <span>Export JSON</span>
                    </button>
                    <button
                      onClick={handleImportTrigger}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                      title="Impor konfigurasi dari file JSON"
                    >
                      <Upload className="w-4 h-4 text-violet-500" />
                      <span>Import JSON</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportConfig}
                      accept=".json"
                      className="hidden"
                    />
                  </div>
                  <button
                    onClick={() => setShowManager(false)}
                    className="w-full sm:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-2xl font-bold transition-all shadow-md cursor-pointer text-center"
                  >
                    Selesai & Simpan perubahan
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Core Spinner Screen */
              <motion.div
                key="arena"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >                 {/* Left Area: Status and current selected components */}
                <div className="md:col-span-4 flex flex-col justify-center h-full">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                    <div>
                      <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Langkah Proses</span>
                      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">Nested Spinner</h3>
                    </div>

                    {/* Step Visualizer */}
                    <div className="space-y-4">
                      {/* Step 1: Category */}
                      <div className={`p-4 rounded-2xl border transition-all ${stage === 'category' ? 'bg-violet-50/50 dark:bg-violet-955/10 border-violet-200 dark:border-violet-850' : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kategori Game</span>
                          {selectedCategory ? (
                            <span className="px-2 py-0.5 bg-emerald-105 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase">Selesai</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 rounded-full text-[10px] font-black uppercase">Aktif</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-3.5 h-3.5 rounded-full ${!selectedCategory ? 'bg-slate-300 dark:bg-slate-700 animate-pulse' : ''}`}
                            style={getCategoryStyle(selectedCategory)}
                          />
                          <span className="font-extrabold text-slate-700 dark:text-slate-200 text-base" role="status" aria-live="polite">
                            {selectedCategory ? selectedCategory.name : 'Memilih Kategori...'}
                          </span>
                        </div>
                      </div>

                      {/* Divider line */}
                      <div className="flex justify-center">
                        <ChevronRight className="w-5 h-5 text-slate-350 dark:text-slate-700 transform rotate-90" />
                      </div>

                      {/* Step 2: Game */}
                      <div className={`p-4 rounded-2xl border transition-all ${stage === 'game' ? 'bg-violet-50/50 dark:bg-violet-955/10 border-violet-200 dark:border-violet-855' : selectedGame ? 'bg-emerald-50/50 dark:bg-emerald-955/15 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-60'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Game Terpilih</span>
                          {selectedGame ? (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase">Selesai</span>
                          ) : stage === 'game' ? (
                            <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-955/40 text-violet-700 dark:text-violet-400 rounded-full text-[10px] font-black uppercase">Aktif</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full text-[10px] font-black uppercase">Menunggu</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Gamepad2 className={`w-5 h-5 ${selectedGame ? 'text-emerald-555 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`} />
                          <span className="font-extrabold text-slate-700 dark:text-slate-200 text-base" role="status" aria-live="polite">
                            {selectedGame ? selectedGame : stage === 'game' ? 'Menentukan Game...' : '---'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    {(selectedCategory || selectedGame) && (
                      <button
                        onClick={() => setConfirmReset(true)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 font-bold rounded-2xl transition cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Ulangi Dari Awal
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Area: Large dynamic Wheel visualizer */}
                <div className="md:col-span-8 flex justify-center py-6 relative">
                  <AnimatePresence mode="wait">
                    {stage === 'category' ? (
                      /* Spinner Wheel for Category selection */
                      <motion.div
                        key="category-wheel"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center"
                      >
                        <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">PUTAR UNTUK KATEGORI</h3>
                        
                        {/* The Circular SVG Spinner wheel */}
                        <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]">
                          {/* Inner circle with slices */}
                          <motion.div
                            className="w-full h-full rounded-full border-[10px] border-slate-800 dark:border-slate-850 shadow-2xl relative overflow-hidden"
                            initial={{ rotate: categoryRotation }}
                            animate={{ rotate: categoryRotation }}
                            transition={isSpinning ? { ease: [0.15, 0.85, 0.1, 1], duration: SPIN_ANIMATION_MS / 1000 } : { duration: 0 }}
                          >
                            {/* Create Slices dynamically using CSS/SVG patterns */}
                            <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 100 100">
                              {(() => {
                                const catsToRender = (shuffledCategories.length > 0 ? shuffledCategories : categories).filter(c => c.games.length > 0);
                                return catsToRender.map((cat, idx) => {
                                  const count = catsToRender.length;
                                  const sliceAngle = 360 / count;
                                  const startAngle = idx * sliceAngle;
                                  const endAngle = startAngle + sliceAngle;
                                  
                                  // SVG Arc calculations
                                  // To make slices visually pop and separate elegantly, we draw clean shapes
                                  const rad = Math.PI / 180;
                                  const x1 = 50 + 50 * Math.cos(startAngle * rad);
                                  const y1 = 50 + 50 * Math.sin(startAngle * rad);
                                  const x2 = 50 + 50 * Math.cos(endAngle * rad);
                                  const y2 = 50 + 50 * Math.sin(endAngle * rad);
                                  
                                  // Large-arc-flag is 0 for slice angles < 180
                                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                                  // Color representation
                                  const hexColor = cat.color || '#6366f1';

                                  return (
                                    <path
                                      key={cat.id}
                                      d={pathData}
                                      fill={hexColor}
                                      className="transition-colors hover:opacity-90"
                                      stroke="#1e293b"
                                      strokeWidth="0.4"
                                    />
                                  );
                                });
                              })()}
                            </svg>

                            {/* Label of Categories inside the Wheel's Slices */}
                            <div className="absolute inset-0 pointer-events-none">
                              {(() => {
                                const catsToRender = (shuffledCategories.length > 0 ? shuffledCategories : categories).filter(c => c.games.length > 0);
                                return catsToRender.map((cat, idx) => {
                                  const angle = (idx * (360 / catsToRender.length)) + (360 / catsToRender.length / 2);
                                  return (
                                    <div
                                      key={cat.id}
                                      className="absolute top-1/2 left-1/2 origin-left w-[47%] text-right pr-4 md:pr-6"
                                      style={{ transform: `translate(0, -50%) rotate(${angle - 90}deg)` }}
                                    >
                                      <span className="text-white font-black text-[9px] md:text-xs tracking-wider uppercase block truncate drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] font-sans">
                                        {cat.name}
                                      </span>
                                    </div>
                                  );
                                });
                              })()}
                            </div>

                            {/* Center Pin */}
                            <div className="absolute inset-x-0 inset-y-0 w-12 h-12 bg-slate-900 border-4 border-white dark:border-slate-800 rounded-full m-auto shadow-lg flex items-center justify-center">
                              <Dice5 className="w-5 h-5 text-white" />
                            </div>
                          </motion.div>

                          {/* Top Pointer Indicator */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10px] z-10">
                            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-slate-805 dark:border-t-slate-700 drop-shadow-md" />
                          </div>
                        </div>

                        {/* Fire Action Button */}
                        <button
                          onClick={handleSpinCategory}
                          disabled={isSpinning || categories.length === 0}
                          aria-label="Putar kategori game"
                          className="mt-8 px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-xl font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 cursor-pointer"
                        >
                          <Sparkles className="w-6 h-6 animate-spin-once" />
                          PUTAR KATEGORI
                        </button>
                      </motion.div>
                    ) : stage === 'game' && selectedCategory ? (
                      /* Second Spinner Wheel: Game Titles (styled by Category) */
                      <motion.div
                        key="game-wheel"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center"
                      >
                        <span 
                          className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white mb-2"
                          style={getCategoryStyle(selectedCategory)}
                        >
                          Kategori: {selectedCategory.name}
                        </span>
                        <h4 className="text-xl font-black text-slate-800 tracking-tight mb-6">KINI PUTAR UNTUK NAMA GAME</h4>
                        
                        {shuffledGames.length === 0 ? (
                          <div className="flex flex-col items-center justify-center text-center py-12 p-6 bg-white rounded-3xl border border-slate-200 max-w-[320px]">
                            <Gamepad2 className="w-12 h-12 text-slate-300 mb-3" />
                            <h5 className="font-bold text-slate-700">Daftar Game Kosong!</h5>
                            <p className="text-xs text-slate-500 font-medium mb-4">
                              Belum ada game yang dimasukkan ke kategori "{selectedCategory.name}". Tambah game terlebih dahulu.
                            </p>
                            <button
                              onClick={() => {
                                const idx = categories.findIndex(c => c.id === selectedCategory?.id);
                                if (idx !== -1) {
                                  setEditCategoryIdx(idx);
                                }
                                setShowManager(true);
                              }}
                              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
                            >
                              Tambah Game Sekarang
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Game Spinner visual wheels */}
                            <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]">
                              {/* Inner slices rotation */}
                              <motion.div
                                className="w-full h-full rounded-full border-[10px] border-slate-800 shadow-2xl relative overflow-hidden"
                                initial={{ rotate: gameRotation }}
                                animate={{ rotate: gameRotation }}
                                transition={isSpinning ? { ease: [0.15, 0.85, 0.1, 1], duration: SPIN_ANIMATION_MS / 1000 } : { duration: 0 }}
                              >
                                <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 100 100">
                                  {shuffledGames.map((game, idx) => {
                                    const games = shuffledGames;
                                    const sliceAngle = 360 / games.length;
                                    const startAngle = idx * sliceAngle;
                                    const endAngle = startAngle + sliceAngle;
                                    
                                    const rad = Math.PI / 180;
                                    const x1 = 50 + 50 * Math.cos(startAngle * rad);
                                    const y1 = 50 + 50 * Math.sin(startAngle * rad);
                                    const x2 = 50 + 50 * Math.cos(endAngle * rad);
                                    const y2 = 50 + 50 * Math.sin(endAngle * rad);
                                    
                                    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
 
                                    // Rotate between various opacity shades of category primary color
                                    const hexColor = selectedCategory.color || '#6366f1';
 
                                    return (
                                      <path
                                        key={game.id}
                                        d={pathData}
                                        fill={hexColor}
                                        opacity={idx % 2 === 0 ? 0.95 : 0.8}
                                        className="transition-all hover:opacity-95"
                                        stroke="#1e293b"
                                        strokeWidth="0.4"
                                      />
                                    );
                                  })}
                                </svg>
 
                                {/* Labels */}
                                <div className="absolute inset-0 pointer-events-none">
                                  {shuffledGames.map((game, idx) => {
                                    const count = shuffledGames.length;
                                    const angle = (idx * (360 / count)) + (360 / count / 2);
                                    return (
                                      <div
                                        key={game.id}
                                        className="absolute top-1/2 left-1/2 origin-left w-[47%] text-right pr-4 md:pr-6"
                                        style={{ transform: `translate(0, -50%) rotate(${angle - 90}deg)` }}
                                      >
                                        <span className="text-white font-black text-[9px] md:text-xs tracking-wider uppercase block truncate drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] font-sans">
                                          {game.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Center circle */}
                                <div className="absolute inset-x-0 inset-y-0 w-12 h-12 bg-slate-900 border-4 border-white rounded-full m-auto shadow-lg flex items-center justify-center">
                                  <Gamepad2 className="w-5 h-5 text-white" />
                                </div>
                              </motion.div>

                              {/* Pointer */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10px] z-10">
                                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-slate-800 drop-shadow-md" />
                              </div>
                            </div>

                            <button
                              onClick={handleSpinGame}
                              disabled={isSpinning}
                              aria-label="Putar game"
                              className={`mt-8 px-10 py-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full text-xl font-black shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50`}
                            >
                              <Sparkles className="w-6 h-6 animate-pulse" />
                              PUTAR GAME!
                            </button>
                          </>
                        )}
                      </motion.div>
                    ) : stage === 'result' && selectedCategory && selectedGame ? (
                      /* Final Result Screen with grand animation */
                      <motion.div
                        key="result"
                        role="status"
                        aria-live="polite"
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center max-w-md w-full bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden"
                      >
                        {/* Shimmer background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/20 via-pink-50/10 to-amber-50/20 pointer-events-none" />
                        
                        {/* Confetti element */}
                        <div className="w-20 h-20 bg-emerald-55 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white text-3xl">
                          <Gamepad2 className="w-10 h-10" />
                        </div>

                        <span className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">HASIL SPINNER</span>
                        <h4 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2 text-center">Waktunya Main!</h4>
                        
                        <div className="w-full flex flex-col items-center gap-4 my-6 py-5 px-6 bg-slate-50 border border-slate-100 rounded-3xl">
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center mb-1">Pilihan Game</span>
                            <div className="text-2xl font-black text-indigo-600 tracking-tight text-center">
                              {selectedGame}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">Kategori:</span>
                            <span 
                              className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase text-white"
                              style={getCategoryStyle(selectedCategory)}
                            >
                              {selectedCategory.name}
                            </span>
                          </div>
                        </div>

                        {/* Settled trigger */}
                        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-500 mb-6 bg-emerald-50 px-4 py-1.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4" />
                          GAME SELESAI DITENTUKAN
                        </div>

                        {/* Restart option */}
                        <button
                          onClick={resetAll}
                          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition shadow-md hover:scale-102"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Putar Ulang Cari Game Baru
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsible Spin History Panel */}
          {!showManager && (
            <div className="mt-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <button
                  onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                  className="w-full flex items-center justify-between text-slate-800 dark:text-slate-100 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors py-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50/75 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <History className="w-5.5 h-5.5" />
                    </div>
                    <div className="text-left">
                      <span className="text-base font-bold flex items-center gap-2">
                        Riwayat Hasil Spin 
                        {spinHistory.length > 0 && (
                          <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-black">
                            {spinHistory.length}
                          </span>
                        )}
                      </span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Klik untuk {showHistoryPanel ? 'menyembunyikan' : 'menampilkan'} daftar riwayat putaran game</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform ${showHistoryPanel ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {showHistoryPanel && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {/* Tab Buttons */}
                      <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
                        <button
                          onClick={() => setActivePanelTab('history')}
                          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                            activePanelTab === 'history'
                              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                          }`}
                        >
                          <History className="w-4 h-4" />
                          Riwayat Hasil
                        </button>
                        <button
                          onClick={() => setActivePanelTab('stats')}
                          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                            activePanelTab === 'stats'
                              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                          }`}
                        >
                          <BarChart3 className="w-4 h-4" />
                          Statistik Penggunaan
                        </button>
                      </div>

                      {activePanelTab === 'history' ? (
                        <SpinHistory 
                          history={spinHistory} 
                          onClearHistory={handleClearSpinHistory} 
                        />
                      ) : (
                        <SpinStats 
                          history={spinHistory}
                          categories={categories}
                          onClearHistory={handleClearSpinHistory}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmReset}
        title="Konfirmasi Reset"
        message="Apakah kamu yakin ingin mengulang dari awal? Hasil spin saat ini akan hilang."
        onConfirm={() => {
          resetAll();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />

      <ConfirmDialog
        isOpen={showImportConfirm}
        title="Impor Konfigurasi"
        message="Mengimpor konfigurasi baru akan menimpa seluruh kategori dan permainan yang ada saat ini. Apakah kamu yakin ingin melanjutkan?"
        onConfirm={() => {
          if (pendingImportCategories) {
            setCategories(pendingImportCategories.map(convertCategoryToHex));
            setToast({
              message: 'Konfigurasi berhasil diimpor!',
              type: 'success'
            });
            // Reset selected category to avoid reference to deleted category
            setSelectedCategory(null);
          }
          setShowImportConfirm(false);
          setPendingImportCategories(null);
        }}
        onCancel={() => {
          setShowImportConfirm(false);
          setPendingImportCategories(null);
        }}
      />
    </div>
  );
}
