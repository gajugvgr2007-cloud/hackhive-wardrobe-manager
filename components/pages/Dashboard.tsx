'use client';

import { motion } from 'framer-motion';
import { Plus, Zap, Cloud, TrendingUp, Thermometer, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import StatsCard from '@/components/cards/StatsCard';
import OutfitSuggestion from '@/components/cards/OutfitSuggestion';
import { fetchWeather, type WeatherData } from '@/lib/services/weatherService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchWeather();
        setWeather(data);
      } catch {
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
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const weatherLabel = weather
    ? `${weather.temp}°C, ${weather.description}`
    : 'Loading...';

  const outfitSuggestions = weather
    ? weather.temp > 25
      ? [
          { title: 'Summer Casual', desc: 'Beat the heat in Belagavi', items: ['Linen Shirt', 'Shorts', 'Sandals'], weather: weatherLabel },
          { title: 'Light & Breezy', desc: 'Stay cool all day', items: ['Cotton Tee', 'Chinos', 'Sneakers'], weather: weatherLabel },
          { title: 'Evening Out', desc: 'Dinner-ready looks', items: ['Polo Shirt', 'Light Pants', 'Loafers'], weather: weatherLabel },
          { title: 'Gym Ready', desc: 'Workout in comfort', items: ['Athletic Tank', 'Shorts', 'Running Shoes'], weather: weatherLabel },
        ]
      : weather.temp <= 15
      ? [
          { title: 'Winter Warm', desc: 'Stay warm in Belagavi', items: ['Winter Coat', 'Thermals', 'Boots'], weather: weatherLabel },
          { title: 'Layered Look', desc: 'Smart and cozy', items: ['Sweater', 'Blazer', 'Jeans'], weather: weatherLabel },
          { title: 'Evening Elegant', desc: 'Cold night style', items: ['Wool Coat', 'Scarf', 'Boots'], weather: weatherLabel },
          { title: 'Casual Cozy', desc: 'Weekend comfort', items: ['Hoodie', 'Joggers', 'Sneakers'], weather: weatherLabel },
        ]
      : [
          { title: 'Casual Vibes', desc: 'Perfect for a relaxed day out', items: ['Black T-Shirt', 'Blue Denim', 'White Sneakers'], weather: weatherLabel },
          { title: 'Business Casual', desc: 'Great for meetings and work', items: ['Cream Blazer', 'Navy Pants', 'Loafers'], weather: weatherLabel },
          { title: 'Evening Out', desc: 'Ready for dinner and drinks', items: ['Black Dress', 'Silver Heels', 'Clutch'], weather: weatherLabel },
          { title: 'Gym Ready', desc: 'Comfortable and stylish workout', items: ['Athletic Tank', 'Leggings', 'Sneakers'], weather: weatherLabel },
        ]
    : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Welcome back!</h1>
        <p className="text-slate-400">Manage your wardrobe and get smart outfit suggestions</p>
      </motion.div>

      {/* Live Weather Banner */}
      {weather && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5 flex items-center gap-4"
        >
          <div className="p-3 bg-cyan-500/20 rounded-xl">
            <Thermometer className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">{weather.location}, {weather.country}</span>
            </div>
            <p className="text-white font-semibold mt-1">
              {weather.temp}°C -- {weather.description}
            </p>
            <p className="text-slate-400 text-sm">Feels like {weather.feels_like}°C | Humidity {weather.humidity}% | Wind {weather.wind_speed} m/s</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Live Weather</span>
            <p className="text-cyan-400 text-sm font-medium">Updated now</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <StatsCard
          icon={<Zap className="w-6 h-6" />}
          label="Items in Wardrobe"
          value="24"
          trend="+3 this week"
          color="cyan"
        />
        <StatsCard
          icon={<Thermometer className="w-6 h-6" />}
          label="Temperature"
          value={weather ? `${weather.temp}°C` : '--'}
          trend={weather ? weather.description : 'Loading...'}
          color="yellow"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Most Worn"
          value="Denim Jacket"
          trend="8 times"
          color="blue"
        />
        <StatsCard
          icon={<Plus className="w-6 h-6" />}
          label="Outfits Created"
          value="12"
          trend="4 this month"
          color="emerald"
        />
      </motion.div>

      {/* Outfit Suggestions */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Today's Outfit Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {outfitSuggestions.map((suggestion) => (
            <OutfitSuggestion
              key={suggestion.title}
              title={suggestion.title}
              description={suggestion.desc}
              items={suggestion.items}
              weather={suggestion.weather}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
