'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend: string;
  color: 'cyan' | 'yellow' | 'blue' | 'emerald';
}

const colorMap = {
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
};

const iconColorMap = {
  cyan: 'text-cyan-400',
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
};

export default function StatsCard({ icon, label, value, trend, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-6 hover:shadow-xl hover:shadow-${color}-500/20 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-white/10 rounded-lg ${iconColorMap[color]}`}>
          {icon}
        </div>
      </div>

      <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <p className={`text-sm font-medium ${color === 'cyan' ? 'text-cyan-300' : color === 'yellow' ? 'text-yellow-300' : color === 'blue' ? 'text-blue-300' : 'text-emerald-300'}`}>
        {trend}
      </p>
    </motion.div>
  );
}
