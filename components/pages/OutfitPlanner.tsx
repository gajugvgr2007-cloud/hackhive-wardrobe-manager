'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudRain, Sun, Filter, CircleAlert as AlertCircle, Zap, Lock, Trash2, Shuffle, Repeat, Calendar, Loader as Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ClothingItem, Occasion, CanvasSlot, SavedOutfit } from '@/lib/types/clothing';
import { isValidForSlot } from '@/lib/types/clothing';
import { getWardrobeItems, addOutfit, getOutfitWearLog, logOutfitWear } from '@/lib/services/wardrobeService';
import { fetchWeather, type WeatherData } from '@/lib/services/weatherService';

type WeatherType = 'Hot' | 'Cold' | 'Rainy';

export default function OutfitPlanner() {
  const [weather, setWeather] = useState<{ temp: number; description: string; humidity: number; wind_speed: number; location: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('Casual');
  const [draggedItem, setDraggedItem] = useState<ClothingItem | null>(null);
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);

  // Outfit canvas state
  const [canvasTop, setCanvasTop] = useState<ClothingItem | null>(null);
  const [canvasBottom, setCanvasBottom] = useState<ClothingItem | null>(null);
  const [canvasFootwear, setCanvasFootwear] = useState<ClothingItem | null>(null);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [outfitName, setOutfitName] = useState('');

  // Repeat tracking
  const [outfitWearCount, setOutfitWearCount] = useState<Record<string, number>>({});
  const [showRepeatWarning, setShowRepeatWarning] = useState(false);

  // Fetch weather on mount (Belagavi, Karnataka)
  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeather();
        setWeather({
          temp: data.temp,
          description: data.main,
          humidity: data.humidity,
          wind_speed: data.wind_speed,
          location: `${data.location}, ${data.country}`,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get weather');
        setWeather({ temp: 28, description: 'Clouds', humidity: 65, wind_speed: 12, location: 'Belagavi, IN' });
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  // Load wardrobe items and wear log from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        const dbItems = await getWardrobeItems();
        const mapped: ClothingItem[] = (dbItems || []).map(item => ({
          id: item.id,
          name: item.name,
          category: item.category as ClothingItem['category'],
          subType: item.sub_type as ClothingItem['subType'],
          image_url: item.image_url || '',
          occasions: (item.occasions || []) as Occasion[],
          weather_types: (item.weather_types || []) as WeatherType[],
          color: item.color || '',
        }));
        setWardrobeItems(mapped);

        const wearLog = await getOutfitWearLog();
        if (wearLog && wearLog.length > 0) {
          const counts: Record<string, number> = {};
          wearLog.forEach(entry => {
            counts[entry.outfit_id] = (counts[entry.outfit_id] || 0) + 1;
          });
          setOutfitWearCount(counts);
        }
      } catch (err) {
        console.error('Failed to load from Supabase, using fallback data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

  // Deterministic filtering logic
  const filteredItems = useMemo(() => {
    if (!weather) return [];

    return wardrobeItems.filter(item => {
      if (!item.occasions.includes(selectedOccasion)) return false;
      if (weather.temp > 25 && !item.weather_types.includes('Hot')) return false;
      if (weather.temp <= 15 && !item.weather_types.includes('Cold')) return false;
      if (weather.description.toLowerCase().includes('rain') && !item.weather_types.includes('Rainy')) return false;
      return true;
    });
  }, [weather, selectedOccasion, wardrobeItems]);

  const handleDragStart = (item: ClothingItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-cyan-500');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-cyan-500');
  };

  const handleDropOnSlot = (slot: CanvasSlot, e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-cyan-500');
    if (!draggedItem || !isValidForSlot(draggedItem, slot)) return;
    if (slot === 'top') setCanvasTop(draggedItem);
    else if (slot === 'bottom') setCanvasBottom(draggedItem);
    else if (slot === 'footwear') setCanvasFootwear(draggedItem);
    setDraggedItem(null);
  };

  const clearSlot = (slot: CanvasSlot) => {
    if (slot === 'top') setCanvasTop(null);
    else if (slot === 'bottom') setCanvasBottom(null);
    else if (slot === 'footwear') setCanvasFootwear(null);
  };

  const isOutfitComplete = canvasTop && canvasBottom && canvasFootwear;

  // Shuffle: randomly pick items from filtered list for each slot
  const handleShuffle = useCallback(() => {
    const tops = filteredItems.filter(i => isValidForSlot(i, 'top'));
    const bottoms = filteredItems.filter(i => isValidForSlot(i, 'bottom'));
    const footwear = filteredItems.filter(i => isValidForSlot(i, 'footwear'));

    if (tops.length > 0) setCanvasTop(tops[Math.floor(Math.random() * tops.length)]);
    if (bottoms.length > 0) setCanvasBottom(bottoms[Math.floor(Math.random() * bottoms.length)]);
    if (footwear.length > 0) setCanvasFootwear(footwear[Math.floor(Math.random() * footwear.length)]);
  }, [filteredItems]);

  // Check for outfit repeat
  const getOutfitKey = (top: ClothingItem, bottom: ClothingItem, foot: ClothingItem) =>
    `${top.id}-${bottom.id}-${foot.id}`;

  const handleLockOutfit = async () => {
    if (!isOutfitComplete) return;

    const key = getOutfitKey(canvasTop!, canvasBottom!, canvasFootwear!);
    const currentCount = outfitWearCount[key] || 0;

    if (currentCount > 0) {
      setShowRepeatWarning(true);
    }

    // Save outfit to Supabase
    const dbOutfit = await addOutfit({
      name: outfitName || `${selectedOccasion} Outfit`,
      description: `${canvasTop!.name}, ${canvasBottom!.name}, ${canvasFootwear!.name}`,
      rating: 5,
      occasions: [selectedOccasion],
    });

    // Log the wear
    if (dbOutfit) {
      await logOutfitWear(dbOutfit.id);
    }

    const newOutfit: SavedOutfit = {
      id: dbOutfit?.id || Date.now().toString(),
      name: outfitName || `${selectedOccasion} Outfit`,
      top: canvasTop,
      bottom: canvasBottom,
      footwear: canvasFootwear,
      occasion: selectedOccasion,
      created_at: new Date().toISOString(),
      locked: true,
    };

    setSavedOutfits([newOutfit, ...savedOutfits]);
    setOutfitWearCount(prev => ({ ...prev, [key]: currentCount + 1 }));
    setOutfitName('');

    setTimeout(() => setShowRepeatWarning(false), 3000);
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (desc.includes('clear') || desc.includes('sunny')) return <Sun className="w-8 h-8 text-yellow-400" />;
    return <Cloud className="w-8 h-8 text-slate-400" />;
  };

  const getFilteringRules = () => {
    if (!weather) return [];
    const rules = [];
    if (weather.temp > 25) {
      rules.push({ icon: <Sun className="w-4 h-4 text-yellow-400" />, text: `Hot weather (${weather.temp}°C) -> Showing "Hot" items` });
    } else if (weather.temp <= 15) {
      rules.push({ icon: <CloudRain className="w-4 h-4 text-blue-400" />, text: `Cold weather (${weather.temp}°C) -> Showing "Cold" items` });
    } else {
      rules.push({ icon: <Cloud className="w-4 h-4 text-slate-400" />, text: `Mild weather (${weather.temp}°C) -> Showing flexible items` });
    }
    if (weather.description.toLowerCase().includes('rain')) {
      rules.push({ icon: <CloudRain className="w-4 h-4 text-blue-400" />, text: `Rainy conditions -> Showing "Rainy" items` });
    }
    rules.push({ icon: <Filter className="w-4 h-4 text-cyan-400" />, text: `Occasion: ${selectedOccasion}` });
    return rules;
  };

  const renderSlot = (slot: CanvasSlot, label: string, hint: string, item: ClothingItem | null, setItem: (item: ClothingItem | null) => void) => (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDropOnSlot(slot, e)}
      className="relative aspect-square bg-slate-800/50 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group hover:border-cyan-500/50"
    >
      {item ? (
        <>
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={() => setItem(null)}
            className="absolute top-2 right-2 p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-sm font-semibold text-white">{item.name}</p>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-slate-400 font-semibold">{label}</p>
          <p className="text-xs text-slate-500 mt-1">{hint}</p>
        </div>
      )}
    </motion.div>
  );

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
          <h1 className="text-4xl font-bold text-white">Smart Outfit Builder</h1>
          <p className="text-slate-400 mt-2">Drag items to create your perfect outfit</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShuffle}
          disabled={filteredItems.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
        >
          <Shuffle className="w-5 h-5" />
          Shuffle
        </motion.button>
      </div>

      {/* Repeat Warning */}
      <AnimatePresence>
        {showRepeatWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300"
          >
            <Repeat className="w-5 h-5" />
            <span className="text-sm font-medium">You've worn this outfit combination before! Consider mixing it up.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Loading */}
      {dataLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          <span className="ml-3 text-slate-400">Loading wardrobe data...</span>
        </div>
      )}

      {/* Two Column Layout */}
      {!dataLoading && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Weather & Rules */}
        <div className="lg:col-span-1 space-y-6">
          {/* Weather Card */}
          {weather && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                {getWeatherIcon(weather.description)}
                <div>
                  <p className="text-slate-400 text-sm">{weather.location}</p>
                  <p className="text-3xl font-bold text-white">{weather.temp}°C</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm border-t border-white/10 pt-4">
                <div>
                  <span className="text-slate-400">Humidity</span>
                  <p className="font-semibold text-white">{weather.humidity}%</p>
                </div>
                <div>
                  <span className="text-slate-400">Wind</span>
                  <p className="font-semibold text-white">{weather.wind_speed}m/s</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Occasion Control */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <p className="text-sm font-semibold text-slate-300">Occasion</p>
            <div className="inline-flex gap-2 bg-slate-800/40 border border-white/10 rounded-xl p-1">
              {(['Casual', 'Formal', 'Workout'] as const).map((occasion) => (
                <motion.button
                  key={occasion}
                  onClick={() => setSelectedOccasion(occasion)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedOccasion === occasion
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {occasion}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Filtering Rules */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> Active Rules
            </p>
            {getFilteringRules().map((rule, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/40 rounded-lg p-3 border border-white/10"
              >
                {rule.icon}
                <span>{rule.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Middle: Outfit Canvas */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/30 border border-white/10 rounded-2xl p-8 space-y-6 h-full backdrop-blur-sm"
          >
            <h2 className="text-xl font-bold text-white">Your Outfit</h2>

            {renderSlot('top', 'Top', 'Drag a shirt here', canvasTop, setCanvasTop)}
            {renderSlot('bottom', 'Bottom', 'Drag pants here', canvasBottom, setCanvasBottom)}
            {renderSlot('footwear', 'Footwear', 'Drag shoes here', canvasFootwear, setCanvasFootwear)}

            {/* Lock Outfit Section */}
            {isOutfitComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-4 border-t border-white/10"
              >
                {/* Repeat indicator */}
                {outfitWearCount[getOutfitKey(canvasTop!, canvasBottom!, canvasFootwear!)] > 0 && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                    <Repeat className="w-3 h-3" />
                    Worn {outfitWearCount[getOutfitKey(canvasTop!, canvasBottom!, canvasFootwear!)]}x before
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Name your outfit..."
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <motion.button
                  onClick={handleLockOutfit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glow-button w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Lock className="w-4 h-4" />
                  Lock Outfit for Today
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right: Filtered Items */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Available Items</h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm font-semibold"
            >
              {filteredItems.length}
            </motion.div>
          </div>

          {/* Draggable Items Grid */}
          <motion.div layout className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.02 }}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className="bg-slate-800/40 border border-white/10 rounded-lg p-3 cursor-move hover:border-cyan-500/30 transition-all group backdrop-blur-sm"
                  >
                    <div className="flex gap-3">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-slate-400">{item.subType}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {item.weather_types.map((wt) => (
                            <span key={wt} className="text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20">
                              {wt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No items match your filters</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      )}

      {/* Saved Outfits Section */}
      {savedOutfits.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Locked Outfits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOutfits.map((outfit) => {
              const key = outfit.top && outfit.bottom && outfit.footwear
                ? getOutfitKey(outfit.top, outfit.bottom, outfit.footwear) : '';
              const wearCount = outfitWearCount[key] || 0;

              return (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">{outfit.name}</h3>
                    <div className="flex items-center gap-2">
                      {wearCount > 1 && (
                        <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20 flex items-center gap-1">
                          <Repeat className="w-3 h-3" /> {wearCount}x
                        </span>
                      )}
                      <Lock className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Top:</span>
                      <span className="text-white font-medium">{outfit.top?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Bottom:</span>
                      <span className="text-white font-medium">{outfit.bottom?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Footwear:</span>
                      <span className="text-white font-medium">{outfit.footwear?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <span className="text-slate-400">Occasion:</span>
                      <span className="text-cyan-300 font-medium">{outfit.occasion}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
