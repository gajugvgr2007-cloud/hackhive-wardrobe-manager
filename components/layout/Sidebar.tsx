'use client';

import { motion } from 'framer-motion';
import { Sparkles, Shirt, LayoutGrid as Layout, Calendar, Settings, Wand as Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Layout },
  { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  { id: 'outfit-planner', label: 'Smart Planner', icon: Wand2 },
  { id: 'outfits', label: 'Outfits', icon: Sparkles },
  { id: 'planner', label: 'Daily Planner', icon: Calendar },
];

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col p-6 sticky top-0 z-30"
    >
      {/* Logo */}
      <div className="mb-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Crypto Fashion</h1>
            <p className="text-xs text-slate-400">Wardrobe</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                'w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1 text-left">{item.label}</span>

              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Settings */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
      >
        <Settings className="w-5 h-5 flex-shrink-0 group-hover:rotate-90 transition-transform duration-500" />
        <span className="font-medium flex-1 text-left">Settings</span>
      </motion.button>
    </motion.div>
  );
}
