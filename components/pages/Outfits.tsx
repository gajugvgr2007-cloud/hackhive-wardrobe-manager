'use client';

import { motion } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';
import OutfitCard from '@/components/cards/OutfitCard';

const mockOutfits = [
  {
    id: 1,
    name: 'Summer Casual',
    items: ['White T-Shirt', 'Denim Shorts', 'White Sneakers'],
    rating: 9,
    occasions: ['Casual', 'Summer'],
  },
  {
    id: 2,
    name: 'Office Professional',
    items: ['Navy Blazer', 'White Shirt', 'Dress Pants', 'Loafers'],
    rating: 8,
    occasions: ['Work', 'Business'],
  },
  {
    id: 3,
    name: 'Night Out',
    items: ['Black Dress', 'Silver Heels', 'Clutch'],
    rating: 9,
    occasions: ['Evening', 'Party'],
  },
  {
    id: 4,
    name: 'Weekend Vibes',
    items: ['Oversized Sweater', 'Jeans', 'Boots'],
    rating: 8,
    occasions: ['Casual', 'Comfort'],
  },
];

export default function Outfits() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">My Outfits</h1>
          <p className="text-slate-400 mt-2">Create and manage your outfit combinations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Create Outfit
        </motion.button>
      </div>

      {/* Outfits Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {mockOutfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} />
        ))}

        {/* Create New Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/50 transition-all duration-300 group min-h-80"
        >
          <Plus className="w-12 h-12 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          <span className="text-lg font-semibold text-slate-500 group-hover:text-white">
            Create New Outfit
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
