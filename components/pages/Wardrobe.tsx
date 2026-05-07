'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, X, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import WardrobeItem from '@/components/cards/WardrobeItem';
import { getWardrobeItems, addWardrobeItem, deleteWardrobeItem } from '@/lib/services/wardrobeService';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  occasions: string[];
  weather_types: string[];
  created_at?: string;
}

interface FormData {
  name: string;
  category: string;
  occasions: string[];
  weather_types: string[];
  image: File | null;
}

const OCCASIONS = ['Formal', 'Casual', 'Workout'];
const WEATHER_TYPES = ['Hot', 'Cold', 'Rainy'];
const CATEGORIES = ['Tops', 'Bottoms', 'Footwear', 'Outerwear', 'Accessories', 'Dresses'];

export default function Wardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: CATEGORIES[0],
    occasions: [],
    weather_types: [],
    image: null,
  });

  // Load items from Supabase on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        setDataLoading(true);
        const dbItems = await getWardrobeItems();
        const mapped: ClothingItem[] = (dbItems || []).map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          image_url: item.image_url || '',
          occasions: item.occasions || [],
          weather_types: item.weather_types || [],
          created_at: item.created_at,
        }));
        setItems(mapped);
      } catch (err) {
        console.error('Failed to load from Supabase:', err);
      } finally {
        setDataLoading(false);
      }
    };

    loadItems();
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const toggleTag = (tag: string, type: 'occasion' | 'weather') => {
    setFormData(prev => {
      const key = type === 'occasion' ? 'occasions' : 'weather_types';
      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: current.includes(tag)
          ? current.filter(t => t !== tag)
          : [...current, tag]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name || !formData.image || formData.occasions.length === 0 || formData.weather_types.length === 0) {
        setMessage({ type: 'error', text: 'Please fill all fields and select tags' });
        setLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;

        const dbItem = await addWardrobeItem({
          name: formData.name,
          category: formData.category,
          image_url: imageUrl,
          occasions: formData.occasions,
          weather_types: formData.weather_types,
        });

        const newItem: ClothingItem = {
          id: dbItem?.id || Date.now().toString(),
          name: formData.name,
          category: formData.category,
          image_url: imageUrl,
          occasions: formData.occasions,
          weather_types: formData.weather_types,
          created_at: new Date().toISOString(),
        };

        setItems(prev => [newItem, ...prev]);
        setMessage({ type: 'success', text: dbItem ? 'Item saved to wardrobe!' : 'Item added locally' });

        setTimeout(() => {
          setShowModal(false);
          setFormData({ name: '', category: CATEGORIES[0], occasions: [], weather_types: [], image: null });
          setImagePreview(null);
          setMessage(null);
        }, 1500);
      };
      reader.readAsDataURL(formData.image);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add item' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteWardrobeItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
    setMessage({ type: 'success', text: 'Item removed' });
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 space-y-8 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Digital Wardrobe</h1>
          <p className="text-slate-400 mt-2">Upload and organize your clothing collection</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
        >
          <Upload className="w-5 h-5" />
          Upload Item
        </motion.button>
      </div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide"
      >
        {['all', ...CATEGORIES].map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCategory(cat.toLowerCase())}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-300 ${
              selectedCategory === cat.toLowerCase()
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Loading State */}
      {dataLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="ml-3 text-slate-400">Loading wardrobe...</span>
        </div>
      )}

      {/* Items Masonry Grid */}
      {!dataLoading && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
        >
          {/* Add Item Card */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="col-span-1 aspect-square bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center hover:border-cyan-500/50 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-3">
              <Plus className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <span className="text-sm font-medium text-slate-500 group-hover:text-cyan-400">Add Item</span>
            </div>
          </motion.button>

          {/* Clothing Items */}
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <WardrobeItem
                  item={item}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!dataLoading && filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-slate-400 text-lg">No items in this category yet</p>
        </motion.div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Item</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Item Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-square rounded-xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="flex items-center justify-center h-full flex-col gap-2">
                        <Upload className="w-8 h-8 text-slate-500" />
                        <span className="text-sm text-slate-500">Click to upload</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Name Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Item Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Black T-Shirt"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                {/* Category Select */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Occasions */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Occasions (select at least 1)</label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map(occasion => (
                      <motion.button
                        key={occasion}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTag(occasion, 'occasion')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          formData.occasions.includes(occasion)
                            ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {occasion}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Weather Types */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Weather Types (select at least 1)</label>
                  <div className="flex flex-wrap gap-2">
                    {WEATHER_TYPES.map(weather => (
                      <motion.button
                        key={weather}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTag(weather, 'weather')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          formData.weather_types.includes(weather)
                            ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {weather}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        message.type === 'success'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {message.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add to Wardrobe'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
