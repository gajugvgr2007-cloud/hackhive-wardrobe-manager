'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind, Droplets, CircleAlert as AlertCircle } from 'lucide-react';
import { fetchWeather, type WeatherData } from '@/lib/services/weatherService';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeather();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get weather');
        setWeather({
          temp: 28,
          feels_like: 30,
          description: 'Partly Cloudy',
          main: 'Clouds',
          humidity: 65,
          wind_speed: 12,
          icon: '02d',
          location: 'Belagavi',
          country: 'IN',
        });
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'clear':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      default:
        return <Cloud className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => setExpanded(!expanded)}
      className="relative"
    >
      <motion.button
        layoutId="weather-widget"
        className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl flex items-center gap-3 hover:border-cyan-500/40 transition-all duration-300 group cursor-pointer"
      >
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {getWeatherIcon(weather?.main || 'clear')}
        </motion.div>

        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.span
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-white"
            >
              {loading ? 'Loading...' : `${weather?.temp}°C`}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-72 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {error && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {weather && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">{weather.location}, {weather.country}</p>
                    <p className="text-3xl font-bold text-white">{weather.temp}°C</p>
                    <p className="text-slate-300 capitalize">{weather.description}</p>
                  </div>
                  <div className="text-4xl">{getWeatherIcon(weather.main)}</div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Droplets className="w-4 h-4" /> Humidity
                    </span>
                    <span className="text-white font-medium">{weather.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Wind className="w-4 h-4" /> Wind Speed
                    </span>
                    <span className="text-white font-medium">{weather.wind_speed} m/s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Feels Like</span>
                    <span className="text-white font-medium">{weather.feels_like}°C</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
