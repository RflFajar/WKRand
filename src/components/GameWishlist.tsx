import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Gamepad2, 
  X, 
  Check, 
  Clock, 
  ArrowUpDown,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { WishlistGame } from '../types';

interface GameWishlistProps {
}

const PRESETS_GENRES = [
  'Action / Adventure',
  'RPG / JRPG',
  'Shooter / FPS',
  'Casual / Simulation',
  'Strategy / MOBA',
  'Horror / Thriller',
  'Sports / Racing'
];

const formatRupiah = (value?: number) => {
  if (value === undefined || value === null) return 'Rp 0';
  if (value === 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function GameWishlist({}: GameWishlistProps) {
  const [wishlist, setWishlist] = useState<WishlistGame[]>(() => {
    const saved = localStorage.getItem('game_wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map old data to new schema if necessary
        return parsed.map((item: any) => ({
          id: item.id,
          name: item.name,
          genre: item.genre || '',
          price: typeof item.price === 'number' ? item.price : 0,
          addedAt: item.addedAt || Date.now()
        }));
      } catch (e) {
        console.error('Gagal memuat game wishlist', e);
        return [];
      }
    }
    // Pre-populate some aesthetic retro wishlist items with realistic Indonesian prices
    return [
      {
        id: 'w-1',
        name: 'Zelda: Tears of the Kingdom',
        genre: 'RPG / JRPG',
        price: 799000,
        addedAt: Date.now() - 10000000
      },
      {
        id: 'w-2',
        name: 'Hades II',
        genre: 'Action / Adventure',
        price: 359999,
        addedAt: Date.now() - 5000000
      },
      {
        id: 'w-3',
        name: 'Stardew Valley',
        genre: 'Casual / Simulation',
        price: 115999,
        addedAt: Date.now() - 2000000
      }
    ];
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem('game_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState<string>('');

  // Search & Sort States
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, sortOrder]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = price.trim() === '' ? 0 : parseFloat(price);
    const validPrice = isNaN(parsedPrice) || parsedPrice < 0 ? 0 : parsedPrice;

    if (editingId) {
      // Edit
      setWishlist(prev => prev.map(item => item.id === editingId ? {
        ...item,
        name: name.trim(),
        genre: genre.trim(),
        price: validPrice,
      } : item));
      setEditingId(null);
    } else {
      // Add
      const newItem: WishlistGame = {
        id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        genre: genre.trim(),
        price: validPrice,
        addedAt: Date.now()
      };
      setWishlist(prev => [newItem, ...prev]);
    }

    // Reset Form
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setGenre('');
    setPrice('');
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleEdit = (item: WishlistGame) => {
    setEditingId(item.id);
    setName(item.name);
    setGenre(item.genre);
    setPrice(item.price !== undefined ? item.price.toString() : '');
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  // Filtered and Sorted Wishlist
  const processedWishlist = wishlist
    .filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.genre.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.addedAt - b.addedAt;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = (a.price || 0) - (b.price || 0);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const totalPages = Math.ceil(processedWishlist.length / ITEMS_PER_PAGE);
  const paginatedWishlist = processedWishlist.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Sub-Header / Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#fdfaf2] dark:bg-[#2d2820] p-4 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#a23b2c] dark:text-[#ff816c]" />
            <span className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wider">
              Sistem Arsip Wishlist Game ({wishlist.length})
            </span>
          </div>
          {wishlist.length > 0 && (
            <div className="text-[11px] font-mono font-bold text-stone-500 dark:text-stone-400 bg-[#f2ede3] dark:bg-[#3d3527] px-2.5 py-1 rounded-[3px] border border-[#d4c9a8]/30 dark:border-[#4b463e]/30">
              Total Anggaran: <span className="text-[#a23b2c] dark:text-[#ff816c]">{formatRupiah(wishlist.reduce((acc, curr) => acc + (curr.price || 0), 0))}</span>
            </div>
          )}
        </div>
        <button
          id="add-wishlist-btn"
          onClick={() => {
            if (isFormOpen) {
              resetForm();
            } else {
              setIsFormOpen(true);
            }
          }}
          className="w-full sm:w-auto px-4 py-2 bg-[#a23b2c] hover:bg-[#8f3224] dark:bg-[#ff816c] dark:hover:bg-[#f8654d] text-white dark:text-[#221e18] font-display font-bold text-xs uppercase tracking-widest rounded-[4px] border border-[#a23b2c] dark:border-[#ff816c] shadow-sm transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isFormOpen ? <X size={14} /> : <Plus size={14} />}
          <span>{isFormOpen ? 'Tutup Formulir' : 'Tambah Wishlist'}</span>
        </button>
      </div>

      {/* Add / Edit Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-[#fdfaf2] dark:bg-[#2d2820] p-6 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] shadow-tactile space-y-4">
              <div className="flex justify-between items-center border-b border-[#d4c9a8]/40 dark:border-[#4b463e]/40 pb-3">
                <h3 className="font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] text-xs uppercase tracking-wider flex items-center gap-2">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#a23b2c] dark:text-[#ff816c]" />
                  {editingId ? 'Edit Catatan Wishlist' : 'Registrasi Wishlist Game Baru'}
                </h3>
                <button type="button" onClick={resetForm} className="text-stone-400 hover:text-stone-600 transition cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Game Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Nama Game *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Black Myth: Wukong"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fdfaf2] dark:bg-[#221e18] text-[#3d3527] dark:text-[#e8dcc4] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                  />
                </div>

                {/* Harga */}
                <div className="space-y-1">
                  <label className="text-[10px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Harga (Rupiah)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-stone-400 dark:text-stone-500 text-xs font-mono">Rp</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Contoh: 150000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-[#fdfaf2] dark:bg-[#221e18] text-[#3d3527] dark:text-[#e8dcc4] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                    />
                  </div>
                </div>

                {/* Genre */}
                <div className="space-y-1">
                  <label className="text-[10px] font-display font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">Genre / Kategori</label>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      placeholder="Ketik genre atau pilih preset..."
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3 py-2 bg-[#fdfaf2] dark:bg-[#221e18] text-[#3d3527] dark:text-[#e8dcc4] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-xs focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {PRESETS_GENRES.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGenre(g)}
                          className={`text-[9px] px-2 py-0.5 rounded-[2px] border transition cursor-pointer ${genre === g ? 'bg-[#3d3527] dark:bg-[#e8dcc4] text-white dark:text-[#221e18] border-[#3d3527] dark:border-[#e8dcc4]' : 'bg-transparent text-stone-500 border-[#d4c9a8] dark:border-[#4b463e] hover:bg-[#f2ede3] dark:hover:bg-[#3d3527]'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-transparent text-stone-500 hover:text-stone-700 font-display font-bold text-xs uppercase tracking-widest rounded-[4px] transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] font-display font-bold text-xs uppercase tracking-widest rounded-[4px] border border-[#a23b2c] dark:border-[#ff816c] transition cursor-pointer flex items-center gap-2"
                >
                  <Check size={14} />
                  <span>{editingId ? 'Simpan Perubahan' : 'Daftarkan Wishlist'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Sorting Control Desk */}
      <div className="bg-[#fdfaf2] dark:bg-[#2d2820] p-4 rounded-[4px] border border-[#d4c9a8] dark:border-[#4b463e] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Cari game wishlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#fdfaf2] dark:bg-[#221e18] text-[#3d3527] dark:text-[#e8dcc4] border border-[#d4c9a8]/80 dark:border-[#4b463e]/80 rounded-[4px] text-xs focus:outline-none focus:border-[#a23b2c] dark:focus:border-[#ff816c]"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={12} className="text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 bg-transparent border-b border-[#d4c9a8] dark:border-[#4b463e] text-xs font-bold text-stone-600 dark:text-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="date">Tanggal Ditambah</option>
              <option value="name">Nama Game</option>
              <option value="price">Harga Game</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1 hover:bg-[#f2ede3] dark:hover:bg-[#3d3527] rounded transition cursor-pointer"
              title="Ubah Arah Urutan"
            >
              <span className="text-[10px] font-bold">{sortOrder === 'asc' ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Index Card Grid */}
      {processedWishlist.length === 0 ? (
        <div className="bg-[#fdfaf2] dark:bg-[#2d2820] p-12 text-center rounded-[4px] border border-dashed border-[#d4c9a8] dark:border-[#4b463e] shadow-sm">
          <Gamepad2 className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
          <h4 className="text-sm font-display font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">Tidak ada data wishlist</h4>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Mulailah menulis game-game impian yang ingin Anda simpan dengan menekan tombol Tambah Wishlist di atas.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedWishlist.map(item => {
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] p-5 shadow-tactile relative overflow-hidden flex flex-col justify-between group card-margin-line"
                >
                  {/* Red Library Card Header Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[#a23b2c] dark:bg-[#ff816c]" />

                  {deletingId === item.id ? (
                    <div className="absolute inset-0 bg-[#fdfaf2] dark:bg-[#2d2820] flex flex-col justify-center items-center p-4 z-10 text-center">
                      <p className="text-xs font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wider mb-3">
                        Hapus game ini dari wishlist?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setWishlist(prev => prev.filter(x => x.id !== item.id));
                            setDeletingId(null);
                          }}
                          className="px-3 py-1.5 bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] text-xs font-display font-bold uppercase tracking-wider rounded-[3px] cursor-pointer hover:opacity-90"
                        >
                          Ya, Hapus
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1.5 bg-stone-200 dark:bg-[#3d3527] text-stone-600 dark:text-stone-300 text-xs font-display font-bold uppercase tracking-wider rounded-[3px] cursor-pointer hover:bg-stone-300 dark:hover:bg-[#4b463e]"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    {/* Metadata */}
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500">
                      <Clock size={10} />
                      <span>{new Date(item.addedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {item.genre && (
                        <>
                          <span>•</span>
                          <span className="uppercase tracking-wider text-[#a23b2c] dark:text-[#ff816c]">{item.genre}</span>
                        </>
                      )}
                    </div>

                    {/* Game Name */}
                    <h3 className="text-sm font-display font-bold text-[#3d3527] dark:text-[#e8dcc4] uppercase tracking-wide group-hover:text-[#a23b2c] dark:group-hover:text-[#ff816c] transition-colors mb-2">
                      {item.name}
                    </h3>
                  </div>

                  {/* Card Footer: Action Bar */}
                  <div className="border-t border-[#d4c9a8]/35 dark:border-[#4b463e]/30 pt-3 mt-4 flex items-center justify-between">
                    {/* Price Badge */}
                    <div className="text-xs font-mono font-bold text-[#a23b2c] dark:text-[#ff816c] bg-[#a23b2c]/10 dark:bg-[#ff816c]/10 px-2 py-0.5 rounded-[2px] border border-[#a23b2c]/20 dark:border-[#ff816c]/20">
                      {formatRupiah(item.price)}
                    </div>

                    {/* Edit & Delete Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-stone-500 hover:text-[#a23b2c] dark:hover:text-[#ff816c] transition cursor-pointer"
                        title="Edit Wishlist"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                        title="Hapus dari Wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#d4c9a8]/35 dark:border-[#4b463e]/30 pt-4 mt-6">
              <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                Menampilkan <span className="font-bold text-[#a23b2c] dark:text-[#ff816c]">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, processedWishlist.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, processedWishlist.length)}</span> dari <span className="font-bold">{processedWishlist.length}</span> Game
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-stone-500 hover:text-[#a23b2c] dark:hover:text-[#ff816c] disabled:opacity-30 disabled:hover:text-stone-500 transition cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold font-mono rounded-[4px] border cursor-pointer transition ${
                        currentPage === pageNum
                          ? 'bg-[#a23b2c] dark:bg-[#ff816c] text-white dark:text-[#221e18] border-[#a23b2c] dark:border-[#ff816c]'
                          : 'bg-[#fdfaf2] dark:bg-[#2d2820] text-stone-600 dark:text-stone-400 border-[#d4c9a8] dark:border-[#4b463e] hover:bg-[#f2ede3] dark:hover:bg-[#3d3527]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 bg-[#fdfaf2] dark:bg-[#2d2820] border border-[#d4c9a8] dark:border-[#4b463e] rounded-[4px] text-stone-500 hover:text-[#a23b2c] dark:hover:text-[#ff816c] disabled:opacity-30 disabled:hover:text-stone-500 transition cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
