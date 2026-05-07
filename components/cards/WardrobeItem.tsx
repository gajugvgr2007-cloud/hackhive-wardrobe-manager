'use client';

import { motion } from 'framer-motion';
import { Trash2, CreditCard as Edit2 } from 'lucide-react';

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  occasions: string[];
  weather_types: string[];
  created_at?: string;
}

interface WardrobeItemProps {
  item: ClothingItem;
  onDelete?: (id: string) => void;
  onEdit?: (item: ClothingItem) => void;
}

const occasionColors: { [key: string]: string } = {
  'Formal': 'from-purple-500 to-pink-500',
  'Casual': 'from-blue-500 to-cyan-500',
  'Workout': 'from-orange-500 to-red-500',
};

const weatherColors: { [key: string]: string } = {
  'Hot': 'from-yellow-500 to-orange-500',
  'Cold': 'from-cyan-500 to-blue-500',
  'Rainy': 'from-slate-500 to-blue-500',
};

export default function WardrobeItem({ item, onDelete, onEdit }: WardrobeItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      className="group relative cursor-pointer"
    >
      {/* Card Container */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 h-full flex flex-col shadow-lg hover:shadow-cyan-500/20">

        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-800">
          {item.image_url ? (
            <motion.img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <span className="text-slate-400 text-sm">No image</span>
            </div>
          )}

          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3"
          >
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(item)}
                className="p-3 bg-white/20 hover:bg-cyan-500/40 rounded-lg transition-all backdrop-blur-sm"
              >
                <Edit2 className="w-5 h-5 text-white" />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(item.id)}
                className="p-3 bg-white/20 hover:bg-red-500/40 rounded-lg transition-all backdrop-blur-sm"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </motion.div>

          {/* Tags Overlay at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-wrap gap-2"
          >
            {/* Occasion Tags */}
            {item.occasions && item.occasions.map((occasion) => (
              <motion.span
                key={`occasion-${occasion}`}
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ opacity: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${
                  occasionColors[occasion] || 'from-slate-500 to-slate-600'
                } shadow-lg shadow-black/50 border border-white/20`}
              >
                {occasion}
              </motion.span>
            ))}

            {/* Weather Tags */}
            {item.weather_types && item.weather_types.map((weather) => (
              <motion.span
                key={`weather-${weather}`}
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ opacity: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${
                  weatherColors[weather] || 'from-slate-500 to-slate-600'
                } shadow-lg shadow-black/50 border border-white/20`}
              >
                {weather}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Details Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {item.name}
            </h3>
            <p className="text-xs text-slate-400 capitalize">{item.category}</p>
          </div>

          {/* Meta Info */}
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-white/5">
            <p>Added {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'recently'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
