'use client';

import { motion } from 'framer-motion';
import { Heart, Star, Tag } from 'lucide-react';
import { useState } from 'react';

interface OutfitCardProps {
  outfit: {
    id: number;
    name: string;
    items: string[];
    rating: number;
    occasions: string[];
  };
}

export default function OutfitCard({ outfit }: OutfitCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
          {outfit.name}
        </h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              liked ? 'fill-red-400 text-red-400' : 'text-slate-400'
            }`}
          />
        </motion.button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Star
              className={`w-4 h-4 ${
                i < outfit.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-600'
              }`}
            />
          </motion.div>
        ))}
        <span className="ml-2 text-sm text-slate-400">{outfit.rating}/5</span>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {outfit.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
            <span className="text-sm text-slate-300">{item}</span>
          </motion.div>
        ))}
      </div>

      {/* Occasions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
        {outfit.occasions.map((occasion) => (
          <motion.span
            key={occasion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg"
          >
            <Tag className="w-3 h-3" />
            {occasion}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
