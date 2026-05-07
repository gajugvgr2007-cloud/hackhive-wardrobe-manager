'use client';

import { motion } from 'framer-motion';
import { Heart, Cloud } from 'lucide-react';

interface OutfitSuggestionProps {
  title: string;
  description: string;
  items: string[];
  weather: string;
}

export default function OutfitSuggestion({
  title,
  description,
  items,
  weather,
}: OutfitSuggestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <Heart className="w-5 h-5 text-slate-400 hover:text-red-400 transition-colors" />
        </motion.button>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
            <span className="text-sm text-slate-300">{item}</span>
          </motion.div>
        ))}
      </div>

      {/* Weather */}
      <div className="flex items-center gap-2 text-sm text-slate-400 border-t border-white/10 pt-4">
        <Cloud className="w-4 h-4 text-cyan-400" />
        <span>{weather}</span>
      </div>
    </motion.div>
  );
}
