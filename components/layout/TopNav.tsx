'use client';

import { motion } from 'framer-motion';
import { Bell, User, Search } from 'lucide-react';
import WeatherWidget from '@/components/widgets/WeatherWidget';

export default function TopNav() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-20 bg-gradient-to-r from-slate-900/40 to-slate-950/40 backdrop-blur-2xl border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-40"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 max-w-md relative group"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <input
            type="text"
            placeholder="Search your wardrobe..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 hover:bg-white/10"
          />
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Weather Widget */}
        <WeatherWidget />

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
        >
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </motion.button>

        {/* Profile */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
