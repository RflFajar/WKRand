import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { domToPng } from 'modern-screenshot';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  BookOpen, 
  Gamepad2, 
  Youtube, 
  Theater, 
  RotateCcw, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Download,
  Loader2,
  Settings,
  Plus,
  Trash2,
  X,
  Trophy,
  Music,
  Tv,
  Heart,
  Smile,
  Code,
  Coffee,
  Palette,
  Camera,
  Compass,
  Zap,
  ChevronDown,
  FileText,
  Copy,
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Activity } from '../types';
import ConfirmDialog from './ConfirmDialog';

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Gamepad2,
  Youtube,
  Theater,
  Sparkles,
  Trophy,
  Music,
  Tv,
  Heart,
  Smile,
  Code,
  Coffee,
  Palette,
  Camera,
  Compass,
  Zap
};

const getIconByName = (name: string) => {
  return ICON_MAP[name] || Sparkles;
};

const COLOR_PRESETS = [
  {
    name: 'Emerald Green',
    color: 'bg-emerald-500', 
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-200',
    shadow: 'shadow-emerald-200 shadow-sm'
  },
  { 
    name: 'Indigo Blue',
    color: 'bg-indigo-500', 
    textColor: 'text-indigo-500',
    borderColor: 'border-indigo-200',
    shadow: 'shadow-indigo-200 shadow-sm'
  },
  { 
    name: 'Rose Pink',
    color: 'bg-rose-500', 
    textColor: 'text-rose-500',
    borderColor: 'border-rose-200',
    shadow: 'shadow-rose-200 shadow-sm'
  },
  { 
    name: 'Amber Orange',
    color: 'bg-amber-500', 
    textColor: 'text-amber-500',
    borderColor: 'border-amber-200',
    shadow: 'shadow-amber-200 shadow-sm'
  },
  {
    name: 'Sky Blue',
    color: 'bg-sky-500',
    textColor: 'text-sky-500',
    borderColor: 'border-sky-200',
    shadow: 'shadow-sky-200 shadow-sm'
  },
  {
    name: 'Fuchsia Pink',
    color: 'bg-fuchsia-500',
    textColor: 'text-fuchsia-500',
    borderColor: 'border-fuchsia-200',
    shadow: 'shadow-fuchsia-200 shadow-sm'
  },
  {
    name: 'Violet Purple',
    color: 'bg-violet-500',
    textColor: 'text-violet-500',
    borderColor: 'border-violet-200',
    shadow: 'shadow-violet-200/50 shadow-sm'
  },
  {
    name: 'Cyan Teal',
    color: 'bg-cyan-500',
    textColor: 'text-cyan-500',
    borderColor: 'border-cyan-200',
    shadow: 'shadow-cyan-200 shadow-sm'
  }
];

const DEFAULT_ACTIVITIES_RAW = [
  { 
    id: 'webtoon', 
    name: 'Baca Webtoon', 
    iconName: 'BookOpen', 
    color: 'bg-emerald-500', 
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-200',
    shadow: 'shadow-emerald-200 shadow-sm'
  },
  { 
    id: 'game', 
    name: 'Main Game', 
    iconName: 'Gamepad2', 
    color: 'bg-indigo-500', 
    textColor: 'text-indigo-500',
    borderColor: 'border-indigo-200',
    shadow: 'shadow-indigo-200 shadow-sm'
  },
  { 
    id: 'youtube', 
    name: 'Nonton Youtube', 
    iconName: 'Youtube', 
    color: 'bg-rose-500', 
    textColor: 'text-rose-500',
    borderColor: 'border-rose-200',
    shadow: 'shadow-rose-200 shadow-sm'
  },
  { 
    id: 'film', 
    name: 'Film/Buku', 
    iconName: 'Theater', 
    color: 'bg-amber-500', 
    textColor: 'text-amber-500',
    borderColor: 'border-amber-200',
    shadow: 'shadow-amber-200 shadow-sm'
  },
];

const DEFAULT_ACTIVITIES: Activity[] = DEFAULT_ACTIVITIES_RAW.map(act => ({
  id: act.id,
  name: act.name,
  icon: getIconByName(act.iconName),
  color: act.color,
  textColor: act.textColor,
  borderColor: act.borderColor,
  shadow: act.shadow,
  iconName: act.iconName
} as any));

const ICON_OPTIONS = [
  { name: 'BookOpen', label: 'Buku', icon: BookOpen },
  { name: 'Gamepad2', label: 'Game', icon: Gamepad2 },
  { name: 'Youtube', label: 'Video', icon: Youtube },
  { name: 'Theater', label: 'Bioskop', icon: Theater },
  { name: 'Sparkles', label: 'Bintang', icon: Sparkles },
  { name: 'Music', label: 'Musik', icon: Music },
  { name: 'Tv', label: 'TV', icon: Tv },
  { name: 'Heart', label: 'Kesehatan/Cinta', icon: Heart },
  { name: 'Smile', label: 'Santai', icon: Smile },
  { name: 'Code', label: 'Coding', icon: Code },
  { name: 'Coffee', label: 'Kopi', icon: Coffee },
  { name: 'Palette', label: 'Seni', icon: Palette },
  { name: 'Camera', label: 'Foto', icon: Camera },
  { name: 'Compass', label: 'Petualangan', icon: Compass },
  { name: 'Zap', label: 'Energi', icon: Zap }
];

const DAYS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu'
];

const SPIN_DURATION_MS = 600;
const SPIN_SETTLE_DELAY_MS = 50;
const SCREENSHOT_WAIT_MS = 1000;

export default function WeeklySchedule() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('weekly_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((act: any) => ({
          ...act,
          icon: getIconByName(act.iconName || 'Sparkles')
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_ACTIVITIES;
  });

  // Debounced auto-save of activities to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const serialized = activities.map(act => ({
        id: act.id,
        name: act.name,
        iconName: (act as any).iconName || 'Sparkles',
        color: act.color,
        textColor: act.textColor,
        borderColor: act.borderColor,
        shadow: act.shadow
      }));
      localStorage.setItem('weekly_activities', JSON.stringify(serialized));
    }, 500);
    return () => clearTimeout(timer);
  }, [activities]);

  const [schedule, setSchedule] = useState<(Activity | null)[]>(new Array(7).fill(null));
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningSingleDay, setIsSpinningSingleDay] = useState(false);
  const [currentSpinningIndex, setCurrentSpinningIndex] = useState(-1);
  const [spinningActivity, setSpinningActivity] = useState<Activity | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDownloadDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Activities Manager States
  const [showManager, setShowManager] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [actInputName, setActInputName] = useState('');
  const [actInputColorPreset, setActInputColorPreset] = useState(COLOR_PRESETS[0]);
  const [actInputIconName, setActInputIconName] = useState('BookOpen');

  // Trigger modal form reset on edit cancel or load
  const handleSelectEditActivity = (act: Activity) => {
    setEditingActivityId(act.id);
    setActInputName(act.name);
    setActInputIconName((act as any).iconName || 'BookOpen');
    
    const matchingPreset = COLOR_PRESETS.find(p => p.color === act.color) || COLOR_PRESETS[0];
    setActInputColorPreset(matchingPreset);
  };

  const handleResetManagerForm = () => {
    setEditingActivityId(null);
    setActInputName('');
    setActInputIconName('BookOpen');
    setActInputColorPreset(COLOR_PRESETS[0]);
  };

  const handleSaveActivity = () => {
    if (!actInputName.trim()) {
      alert("Nama aktivitas tidak boleh kosong!");
      return;
    }

    if (editingActivityId) {
      // Edit mode
      setActivities(prev => prev.map(act => {
        if (act.id === editingActivityId) {
          return {
            ...act,
            name: actInputName,
            icon: getIconByName(actInputIconName),
            color: actInputColorPreset.color,
            textColor: actInputColorPreset.textColor,
            borderColor: actInputColorPreset.borderColor,
            shadow: actInputColorPreset.shadow,
            iconName: actInputIconName
          } as any;
        }
        return act;
      }));
      
      // Also update any day in current schedule that had this id so rename propagates immediately!
      setSchedule(prev => prev.map(s => {
        if (s && s.id === editingActivityId) {
          return {
            ...s,
            name: actInputName,
            icon: getIconByName(actInputIconName),
            color: actInputColorPreset.color,
            textColor: actInputColorPreset.textColor,
            borderColor: actInputColorPreset.borderColor,
            shadow: actInputColorPreset.shadow,
            iconName: actInputIconName
          } as any;
        }
        return s;
      }));

      setEditingActivityId(null);
    } else {
      // Add mode
      const newAct = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: actInputName,
        icon: getIconByName(actInputIconName),
        color: actInputColorPreset.color,
        textColor: actInputColorPreset.textColor,
        borderColor: actInputColorPreset.borderColor,
        shadow: actInputColorPreset.shadow,
        iconName: actInputIconName
      };
      setActivities(prev => [...prev, newAct]);
    }

    // Reset fields
    setActInputName('');
    setActInputIconName('BookOpen');
    setActInputColorPreset(COLOR_PRESETS[0]);
  };

  const handleDeleteActivity = (id: string) => {
    if (activities.length <= 1) {
      alert("Kamu harus menyisakan minimal 1 aktivitas!");
      return;
    }
    setActivities(prev => prev.filter(act => act.id !== id));
    // Replace references in current schedule with null
    setSchedule(prev => prev.map(s => (s && s.id === id) ? null : s));
    if (editingActivityId === id) {
      handleResetManagerForm();
    }
  };

  const generateSchedule = useCallback(() => {
    if (isSpinning || isSpinningSingleDay) return;
    if (activities.length === 0) return;

    // Initialize AudioContext under direct user gesture
    initAudio();

    setIsSpinning(true);
    playStartSound();

    // 1. Pre-generate final results
    const finalResults = Array.from({ length: 7 }, () => 
      activities[Math.floor(Math.random() * activities.length)]
    );
    
    // 2. Pre-generate placeholders so no day is empty from the start
    const placeholders = Array.from({ length: 7 }, () => 
      activities[Math.floor(Math.random() * activities.length)]
    );
    
    setSchedule(placeholders);
    setSpinningActivity(null);
    
    let dayIndex = 0;

    const animateDay = () => {
      if (dayIndex >= 7) {
        setIsSpinning(false);
        setCurrentSpinningIndex(-1);
        setSpinningActivity(null);

        playWinChime();

        // Trigger celebratory confetti for completing the whole schedule spin
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#a855f7', '#3b82f6', '#10b981', '#f59e0b']
          });
        }
        return;
      }

      setCurrentSpinningIndex(dayIndex);
      
      const spinDuration = SPIN_DURATION_MS;
      const startTime = Date.now();
      
      let lastTickTime = Date.now();
      const updateSpin = () => {
        const now = Date.now();
        if (now - startTime < spinDuration) {
          // Visual spinning effect for the active day
          setSpinningActivity(activities[Math.floor(Math.random() * activities.length)]);
          if (now - lastTickTime >= 90) {
            playTick();
            lastTickTime = now;
          }
          requestAnimationFrame(updateSpin);
        } else {
          // Settle the day with the final pre-generated activity
          setSchedule(prev => {
            const next = [...prev];
            next[dayIndex] = finalResults[dayIndex];
            return next;
          });
          
          dayIndex++;
          setTimeout(animateDay, SPIN_SETTLE_DELAY_MS);
        }
      };
      
      updateSpin();
    };

    animateDay();
  }, [isSpinning, isSpinningSingleDay, activities, initAudio, playStartSound, playTick, playWinChime]);

  const spinSingleDay = useCallback((dayIndex: number) => {
    if (isSpinning || isSpinningSingleDay) return;
    if (activities.length === 0) return;

    // Initialize AudioContext under direct user gesture
    initAudio();

    setIsSpinningSingleDay(true);
    setCurrentSpinningIndex(dayIndex);
    setSpinningActivity(null);
    playStartSound();

    const spinDuration = SPIN_DURATION_MS;
    const startTime = Date.now();

    const finalResult = activities[Math.floor(Math.random() * activities.length)];

    let lastTickTime = Date.now();
    const updateSpin = () => {
      const now = Date.now();
      if (now - startTime < spinDuration) {
        setSpinningActivity(activities[Math.floor(Math.random() * activities.length)]);
        if (now - lastTickTime >= 90) {
          playTick();
          lastTickTime = now;
        }
        requestAnimationFrame(updateSpin);
      } else {
        setSchedule(prev => {
          const next = [...prev];
          next[dayIndex] = finalResult;
          return next;
        });
        setCurrentSpinningIndex(-1);
        setSpinningActivity(null);
        setIsSpinningSingleDay(false);
        playWinChime();
      }
    };

    updateSpin();
  }, [isSpinning, isSpinningSingleDay, activities, initAudio, playStartSound, playTick, playWinChime]);

  const downloadPng = async () => {
    if (!scheduleRef.current) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, SCREENSHOT_WAIT_MS));
      
      const dataUrl = await domToPng(scheduleRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        quality: 1,
      });
      
      const link = document.createElement('a');
      link.download = `jadwal-mingguan-${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Jadwal berhasil diunduh sebagai PNG!');
    } catch (error) {
      console.error('Gagal mengunduh PNG:', error);
      showToast('Gagal mengunduh PNG. Silakan coba lagi.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPdf = async () => {
    if (!scheduleRef.current) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, SCREENSHOT_WAIT_MS));
      
      const canvas = await html2canvas(scheduleRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasRatio = canvas.height / canvas.width;
      let width = pdfWidth - 20; // 10mm margins
      let height = width * canvasRatio;
      
      if (height > pdfHeight - 20) {
        height = pdfHeight - 20;
        width = height / canvasRatio;
      }
      
      const x = (pdfWidth - width) / 2;
      const y = (pdfHeight - height) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, width, height);
      
      const dateString = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
      pdf.save(`jadwal-mingguan-${dateString}.pdf`);
      showToast('Jadwal berhasil diunduh sebagai PDF!');
    } catch (error) {
      console.error('Gagal mengunduh PDF:', error);
      showToast('Gagal mengunduh PDF. Silakan coba lagi.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!scheduleRef.current) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, SCREENSHOT_WAIT_MS));
      
      const dataUrl = await domToPng(scheduleRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        quality: 1,
      });
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      showToast('Gambar jadwal disalin ke clipboard!');
    } catch (error) {
      console.error('Gagal menyalin ke clipboard:', error);
      showToast('Gagal menyalin ke clipboard. Coba gunakan browser yang didukung.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const isInitialState = schedule.every(s => s === null) && !isSpinning;

  return (
    <div className="w-full">
      {/* Control and Actions Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-6 shadow-tactile relative overflow-hidden card-margin-line">
        <div>
          <h2 className="text-lg font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">Weekly Activity Planner</h2>
          <p className="text-xs text-slate-500 dark:text-stone-450 mt-1">Buat jadwal kegiatan hiburanmu per hari secara adil dan menyenangkan!</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Sound toggle button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 bg-[#f2ede3] dark:bg-[#3d3527] text-stone-500 dark:text-stone-300 hover:text-[#a23b2c] dark:hover:text-[#ff816c] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] transition-all shadow-sm cursor-pointer flex items-center justify-center shrink-0"
            title={soundEnabled ? "Matikan Efek Suara" : "Aktifkan Efek Suara"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          <button
            onClick={() => setShowManager(true)}
            disabled={isSpinning || isSpinningSingleDay}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 h-10 rounded-[4px] font-display font-bold text-xs text-[#3d3527] dark:text-[#e8dcc4] bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8] dark:border-[#4b463e] hover:bg-[#d4c9a8]/35 transition-all shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
            title="Kelola daftar pilihan aktivitas"
          >
            <Settings className="w-3.5 h-3.5 flex-shrink-0" />
            Kelola Aktivitas
          </button>

          {!isInitialState && !isSpinning && !isSpinningSingleDay && (
            <div className="relative flex-1 md:flex-none" ref={dropdownRef}>
              <button
                onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-1.5 px-4 h-10 rounded-[4px] font-display font-bold text-xs bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] hover:bg-[#d4c9a8]/35 transition-all shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#a23b2c] dark:text-[#ff816c]" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Ekspor Jadwal
                <ChevronDown className={`w-3 h-3 transition-transform ${showDownloadDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDownloadDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] shadow-tactile z-20 overflow-hidden py-1"
                  >
                    <button
                      onClick={async () => {
                        setShowDownloadDropdown(false);
                        await downloadPng();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] hover:bg-[#f2ede3] dark:hover:bg-[#3d3527] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-400" />
                      Unduh PNG
                    </button>
                    <button
                      onClick={async () => {
                        setShowDownloadDropdown(false);
                        await downloadPdf();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] hover:bg-[#f2ede3] dark:hover:bg-[#3d3527] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      Unduh PDF
                    </button>
                    <button
                      onClick={async () => {
                        setShowDownloadDropdown(false);
                        await copyToClipboard();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] hover:bg-[#f2ede3] dark:hover:bg-[#3d3527] transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-stone-400" />
                      Salin ke Clipboard
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <button
            onClick={() => !isInitialState ? setConfirmReset(true) : generateSchedule()}
            disabled={isSpinning || isSpinningSingleDay}
            aria-label={!isInitialState ? 'Putar Ulang' : 'Mulai Atur Jadwal'}
            className={`
              flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 h-10 rounded-[4px] font-display font-bold text-xs transition-all whitespace-nowrap cursor-pointer border
              ${isSpinning || isSpinningSingleDay 
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-stone-200' 
                : 'bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] border-[#a23b2c] dark:border-[#ff816c] hover:bg-[#a23b2c]/90 dark:hover:bg-[#ff816c]/90'}
            `}
          >
            {isSpinning || isSpinningSingleDay ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            {!isInitialState ? 'Putar Ulang' : 'Mulai Atur Jadwal'}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {isInitialState && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] bg-[#fdfaf2] dark:bg-[#2d2820] shadow-tactile"
        >
          <div className="p-3 bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] mb-4 text-[#a23b2c] dark:text-[#ff816c]">
            <Calendar className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">Jadwal masih kosong</h4>
          <p className="text-xs text-slate-500 dark:text-stone-450 mt-1 max-w-sm font-sans">
            Ketuk tombol "Mulai Atur Jadwal" untuk mengisi otomatis jadwalmu dengan putaran animasi interaktif.
          </p>
        </motion.div>
      )}

      {/* Schedule Container for Download */}
      {!isInitialState && (
        <div ref={scheduleRef} className="p-4 bg-[#f2ede3]/20 dark:bg-[#1f1b15]/20 rounded-[4px] border border-[#d4c9a8]/40 dark:border-[#4b463e]/40">
          {/* Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DAYS.map((day, index) => {
              const activity = schedule[index];
              const isCurrentlySpinning = index === currentSpinningIndex;
              const displayActivity = isCurrentlySpinning ? spinningActivity : activity;
              const isSettled = !!activity && !isCurrentlySpinning;
              const isWaiting = !isInitialState && !displayActivity && !isCurrentlySpinning;

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  aria-label={`Hari ${day}, Aktivitas: ${displayActivity ? displayActivity.name : "Belum ditentukan"}`}
                  className={`
                    relative group overflow-hidden bg-[#fdfaf2] dark:bg-[#2d2820] border rounded-[4px] transition-all min-h-[220px] flex flex-col shadow-tactile border-l-[4px] border-l-[#a23b2c] dark:border-l-[#ff816c]
                    ${isCurrentlySpinning ? 'border-[#3d3527] dark:border-[#e8dcc4] ring-1 ring-[#a23b2c] dark:ring-[#ff816c]' : 'border-[#d4c9a8] dark:border-[#4b463e]'}
                    ${isWaiting ? 'opacity-50' : 'opacity-100'}
                  `}
                >
                  {/* Hole punch circle */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#f2ede3] dark:bg-[#1f1b15] border border-[#d4c9a8] dark:border-[#4b463e] shadow-[inset_0_2px_3px_rgba(0,0,0,0.08)] pointer-events-none" />

                  {/* Single Day Spin Button */}
                  {isSettled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        spinSingleDay(index);
                      }}
                      disabled={isSpinning || isSpinningSingleDay}
                      className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-[4px] bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] hover:bg-[#d4c9a8]/30 transition-all opacity-100 cursor-pointer flex items-center justify-center"
                      title="Spin ulang hari ini"
                    >
                      <RotateCcw className={`w-3 h-3 ${(isSpinningSingleDay && currentSpinningIndex === index) ? 'animate-spin' : ''}`} />
                    </button>
                  )}

                  {/* Day Label */}
                  <div className={`
                    px-5 py-3 border-b font-display font-bold text-xs uppercase tracking-wider
                    ${isSettled ? 'border-[#d4c9a8]/35 dark:border-[#4b463e]/35 text-[#a23b2c] dark:text-[#ff816c] bg-[#f5f0e6]/40 dark:bg-[#221e18]/10' : 'border-[#d4c9a8]/35 dark:border-[#4b463e]/35 text-stone-400'}
                  `}>
                    {day}
                  </div>

                  <div className="flex-1 p-5 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      {displayActivity ? (
                        <motion.div
                          key={displayActivity.id + (isCurrentlySpinning ? '-spin' : '-settled')}
                          initial={{ opacity: 0, y: 10, scale: 0.85 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.85 }}
                          className="flex flex-col items-center text-center"
                        >
                          <div className={`
                            p-3 bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] mb-3 text-[#a23b2c] dark:text-[#ff816c] shadow-sm
                          `}>
                            <displayActivity.icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-sm font-display font-bold text-[#3d3527] dark:text-[#e8dcc4]">
                            {displayActivity.name}
                          </h3>
                          
                          {isSettled && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2.5 flex items-center gap-1 text-[9px] font-display font-bold text-stone-550 dark:text-stone-400"
                            >
                              <CheckCircle2 className="w-3 h-3 text-[#a23b2c] dark:text-[#ff816c]" />
                              SETTLED
                            </motion.div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center opacity-25">
                          <div className="w-10 h-10 bg-[#d4c9a8]/40 dark:bg-[#4b463e]/40 rounded-[4px] mb-2" />
                          <div className="h-3 w-16 bg-[#d4c9a8]/40 dark:bg-[#4b463e]/40 rounded-[2px]" />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Decorative background logo */}
                  {isSettled && displayActivity && (
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 opacity-[0.03] pointer-events-none text-[#a23b2c] dark:text-[#ff816c]">
                      <displayActivity.icon className="w-full h-full" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          {!isInitialState && !isSpinning && !isSpinningSingleDay && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] shadow-tactile"
            >
              <h3 className="text-sm font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
                Ringkasan Distribusi Kegiatan
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activities.map(activity => {
                  const count = schedule.filter(s => s && s.id === activity.id).length;
                  if (count === 0) return null;
                  return (
                    <div key={activity.id} className="p-3 bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8]/40 dark:border-[#4b463e]/40 rounded-[4px] flex items-center gap-3">
                      <div className="p-2 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8]/50 dark:border-[#4b463e]/50 rounded-[4px] text-[#a23b2c] dark:text-[#ff816c]">
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-lg font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] leading-none">{count}</div>
                        <div className="text-[9px] font-display font-bold uppercase tracking-wider text-stone-500 mt-1">Hari</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </div>
      )}

      {/* Modal / Overlay for Kelola Aktivitas */}
      <AnimatePresence>
        {showManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm shadow-inner">
            {/* Click backdrop to close */}
            <div 
              className="absolute inset-0 cursor-default" 
              onClick={() => {
                setShowManager(false);
                handleResetManagerForm();
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[#fdfaf2] dark:bg-[#2d2820] rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] shadow-tactile overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#d4c9a8]/50 dark:border-[#4b463e]/50 p-5 bg-[#f5f0e6] dark:bg-[#1f1b15]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] text-[#a23b2c] dark:text-[#ff816c] rounded-[4px]">
                    <Settings className="w-4 h-4 animate-spin-once" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide">Kelola Aktivitas Mingguan</h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans">Tambah, edit, atau hapus jenis aktivitas untuk jadwalmu</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowManager(false);
                    handleResetManagerForm();
                  }}
                  className="p-1.5 bg-[#f2ede3] dark:bg-[#3d3527] hover:bg-[#d4c9a8]/30 text-stone-500 dark:text-stone-300 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* 1. Form Section (Add or Edit) */}
                <div className="bg-[#fdfaf2]/50 dark:bg-[#2d2820]/50 border border-[#d4c9a8]/70 dark:border-[#4b463e]/70 rounded-[4px] p-5 space-y-4">
                  <h4 className="text-[11px] font-display font-bold text-[#a23b2c] dark:text-[#ff816c] uppercase tracking-wider flex items-center gap-1.5">
                    {editingActivityId ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#a23b2c] dark:text-[#ff816c] animate-pulse" />
                        Edit Aktivitas
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-stone-450" />
                        Tambah Aktivitas Baru
                      </>
                    )}
                  </h4>

                  {/* Name field */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Contoh: Belajar Coding, Olahraga, Menggambar..."
                      value={actInputName}
                      onChange={(e) => setActInputName(e.target.value)}
                      className="flex-1 bg-transparent text-[#3d3527] dark:text-[#e8dcc4] border-b border-[#d4c9a8] dark:border-[#4b463e] focus:border-[#3d3527] dark:focus:border-[#e8dcc4] rounded-none outline-none focus:ring-0 text-xs font-sans py-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveActivity();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveActivity}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] rounded-[4px] border border-[#a23b2c] dark:border-[#ff816c] text-xs font-display font-bold cursor-pointer transition-all hover:bg-opacity-90"
                      >
                        {editingActivityId ? 'Simpan' : 'Tambah'}
                      </button>
                      {editingActivityId && (
                        <button
                          onClick={handleResetManagerForm}
                          className="px-4 py-2 bg-[#f2ede3] dark:bg-[#3d3527] border border-[#d4c9a8] dark:border-[#4b463e] text-[#3d3527] dark:text-[#e8dcc4] rounded-[4px] text-xs font-display font-bold cursor-pointer hover:bg-[#d4c9a8]/20 transition-all"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Icon grid option */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Pilih Ikon Aktivitas:
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 bg-[#fdfaf2] dark:bg-[#2d2820] p-3 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e]">
                      {ICON_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = actInputIconName === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setActInputIconName(item.name)}
                            className={`p-2 rounded-[4px] flex flex-col items-center justify-center border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#f2ede3] dark:bg-[#3d3527] border-[#a23b2c] dark:border-[#ff816c] text-[#a23b2c] dark:text-[#ff816c]'
                                : 'border-[#d4c9a8]/30 dark:border-[#4b463e]/30 text-stone-400 dark:text-stone-500 hover:bg-[#f2ede3]/50 dark:hover:bg-[#3d3527]/50 hover:text-[#3d3527] dark:hover:text-[#e8dcc4]'
                            }`}
                            title={item.label}
                          >
                            <Icon className="w-4 h-4 animate-none" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preset styling option */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex justify-between items-center">
                      <span>Pilih Tema Warna:</span>
                      <span className="text-[10px] font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] bg-[#f2ede3] dark:bg-[#3d3527] px-2 py-0.5 rounded-[2px] uppercase">
                        {actInputColorPreset.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5 bg-[#fdfaf2] dark:bg-[#2d2820] p-3 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] items-center">
                      {COLOR_PRESETS.map((preset) => {
                        const isSelected = actInputColorPreset.color === preset.color;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setActInputColorPreset(preset)}
                            className={`w-7 h-7 rounded-full flex-shrink-0 transition-all cursor-pointer relative ${
                              preset.color
                            } ${
                              isSelected
                                ? 'ring-2 ring-[#a23b2c] dark:ring-[#ff816c] ring-offset-2 dark:ring-offset-[#2d2820] scale-105 shadow-sm'
                                : 'hover:scale-105'
                            }`}
                            title={preset.name}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center text-white">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                              </div>
                            )}
                          </button>
                        );
                       })}
                    </div>
                  </div>
                </div>

                {/* 2. Listed Items Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Daftar Pilihan Aktivitas ({activities.length})
                    </h4>
                    <span className="text-[9px] font-mono text-stone-400">
                      Klik salah satu untuk mengedit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {activities.map((act) => {
                      const Icon = act.icon || Sparkles;
                      const isEditingThis = editingActivityId === act.id;
                      return (
                        <div
                          key={act.id}
                          onClick={() => handleSelectEditActivity(act)}
                          className={`group flex items-center justify-between p-3 rounded-[4px] border transition-all cursor-pointer ${
                            isEditingThis
                              ? 'bg-[#f2ede3] dark:bg-[#32302a] border-[#a23b2c] dark:border-[#ff816c] shadow-xs ring-1 ring-[#a23b2c] dark:ring-[#ff816c]'
                              : 'bg-[#fdfaf2] dark:bg-[#2d2820] border-[#d4c9a8]/50 dark:border-[#4b463e]/50 hover:bg-[#f5f0e6] dark:hover:bg-[#221e18]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-[2px] ${act.color} text-white shadow-xs flex-shrink-0`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] text-xs truncate">
                              {act.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-100 sm:opacity-40 group-hover:opacity-100 transition-all flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectEditActivity(act);
                              }}
                              className="p-1 text-stone-400 dark:text-stone-500 hover:text-[#a23b2c] dark:hover:text-[#ff816c] rounded-[2px]"
                              title="Edit aktivitas"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteActivity(act.id);
                              }}
                              className="p-1 text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-[2px]"
                              title="Hapus aktivitas"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#d4c9a8]/50 dark:border-[#4b463e]/50 bg-[#f5f0e6] dark:bg-[#1f1b15] flex justify-end">
                <button
                  onClick={() => {
                    setShowManager(false);
                    handleResetManagerForm();
                  }}
                  className="px-5 py-2 bg-[#3d3527] dark:bg-[#e8dcc4] text-[#fdfaf2] dark:text-[#221e18] hover:bg-[#3d3527]/90 dark:hover:bg-[#e8dcc4]/90 rounded-[4px] text-xs font-display font-bold border border-[#3d3527] dark:border-[#e8dcc4] cursor-pointer"
                >
                  Selesai
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmReset}
        title="Putar Ulang Jadwal"
        message="Jadwal saat ini akan diganti dengan yang baru. Lanjutkan?"
        onConfirm={() => {
          generateSchedule();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-xl text-white text-xs font-bold ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
