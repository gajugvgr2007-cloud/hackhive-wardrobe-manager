'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Clock, Bell, BellRing, Trash2, X, ChevronLeft, ChevronRight, Shirt, Sparkles, Loader as Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';
import { getDailyPlans, addDailyPlan, deleteDailyPlan, addReminder, deleteReminder } from '@/lib/services/wardrobeService';

interface PlanEvent {
  id: string;
  date: string;
  time: string;
  eventName: string;
  outfitName: string;
  outfitItems: string[];
  occasion: string;
  reminder: boolean;
  reminderMinutes: number;
}

const SAMPLE_OUTFITS = [
  { name: 'Business Professional', items: ['Navy Blazer', 'White Shirt', 'Dress Pants', 'Loafers'], occasion: 'Formal' },
  { name: 'Casual Chic', items: ['Denim Jacket', 'White Tee', 'Jeans', 'Sneakers'], occasion: 'Casual' },
  { name: 'Evening Elegant', items: ['Black Dress', 'Heels', 'Clutch'], occasion: 'Formal' },
  { name: 'Athletic Wear', items: ['Tank Top', 'Leggings', 'Running Shoes'], occasion: 'Workout' },
  { name: 'Weekend Cozy', items: ['Oversized Sweater', 'Joggers', 'Boots'], occasion: 'Casual' },
  { name: 'Summer Vibes', items: ['Linen Shirt', 'Shorts', 'Sandals'], occasion: 'Casual' },
];

const OCCASIONS = ['Casual', 'Formal', 'Workout'];
const TIME_SLOTS = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

export default function DailyPlanner() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [events, setEvents] = useState<PlanEvent[]>([
    {
      id: '1', date: format(new Date(), 'yyyy-MM-dd'), time: '9:00 AM',
      eventName: 'Office Meeting', outfitName: 'Business Professional',
      outfitItems: ['Navy Blazer', 'White Shirt', 'Dress Pants', 'Loafers'],
      occasion: 'Formal', reminder: true, reminderMinutes: 30,
    },
    {
      id: '2', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), time: '12:30 PM',
      eventName: 'Lunch with Friends', outfitName: 'Casual Chic',
      outfitItems: ['Denim Jacket', 'White Tee', 'Jeans', 'Sneakers'],
      occasion: 'Casual', reminder: false, reminderMinutes: 15,
    },
    {
      id: '3', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), time: '7:00 PM',
      eventName: 'Dinner Date', outfitName: 'Evening Elegant',
      outfitItems: ['Black Dress', 'Heels', 'Clutch'],
      occasion: 'Formal', reminder: true, reminderMinutes: 60,
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    eventName: '',
    time: '9:00 AM',
    outfitName: '',
    outfitItems: [] as string[],
    occasion: 'Casual',
    reminder: true,
    reminderMinutes: 30,
  });

  // Load events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setDataLoading(true);
        const dbPlans = await getDailyPlans();
        if (dbPlans && dbPlans.length > 0) {
          const mapped: PlanEvent[] = dbPlans.map(plan => ({
            id: plan.id,
            date: plan.event_date,
            time: plan.event_time || '9:00 AM',
            eventName: plan.event_name,
            outfitName: plan.weather_condition || 'Casual Outfit',
            outfitItems: [],
            occasion: 'Casual',
            reminder: false,
            reminderMinutes: 30,
          }));
          setEvents(mapped);
        }
      } catch (err) {
        console.error('Failed to load plans from Supabase, using fallback:', err);
      } finally {
        setDataLoading(false);
      }
    };

    loadEvents();
  }, []);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const selectedDateEvents = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
  }, [events, selectedDate]);

  const handlePrevWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setSelectedDate(new Date());
  };

  const selectOutfit = (outfit: typeof SAMPLE_OUTFITS[0]) => {
    setFormData(prev => ({
      ...prev,
      outfitName: outfit.name,
      outfitItems: outfit.items,
      occasion: outfit.occasion,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventName || !formData.outfitName) return;

    // Save to Supabase
    const dbPlan = await addDailyPlan({
      event_name: formData.eventName,
      event_date: format(selectedDate, 'yyyy-MM-dd'),
      event_time: formData.time,
      weather_condition: formData.outfitName,
    });

    const newEvent: PlanEvent = {
      id: dbPlan?.id || Date.now().toString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: formData.time,
      eventName: formData.eventName,
      outfitName: formData.outfitName,
      outfitItems: formData.outfitItems,
      occasion: formData.occasion,
      reminder: formData.reminder,
      reminderMinutes: formData.reminderMinutes,
    };

    setEvents(prev => [...prev, newEvent]);

    // Add reminder to Supabase if enabled
    if (formData.reminder && dbPlan) {
      const eventDate = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${formData.time}`);
      const remindAt = new Date(eventDate.getTime() - formData.reminderMinutes * 60000);
      await addReminder({
        daily_plan_id: dbPlan.id,
        remind_at: remindAt.toISOString(),
        message: `Reminder: ${formData.eventName} - ${formData.outfitName} in ${formData.reminderMinutes} minutes`,
      });
    }

    setShowModal(false);
    setFormData({ eventName: '', time: '9:00 AM', outfitName: '', outfitItems: [], occasion: 'Casual', reminder: true, reminderMinutes: 30 });
  };

  const handleDelete = async (id: string) => {
    await deleteDailyPlan(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const toggleReminder = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, reminder: !e.reminder } : e));
  };

  const getOccasionColor = (occasion: string) => {
    switch (occasion) {
      case 'Formal': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300';
      case 'Casual': return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300';
      case 'Workout': return 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-300';
      default: return 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-300';
    }
  };

  const hasEventsOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.some(e => e.date === dateStr);
  };

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
          <h1 className="text-4xl font-bold text-white">Daily Planner</h1>
          <p className="text-slate-400 mt-2">Plan your outfits for the week ahead</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Plan Outfit
        </motion.button>
      </div>

      {/* Calendar Week View */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevWeek}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </motion.button>
            <h2 className="text-lg font-semibold text-white min-w-[200px] text-center">
              {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextWeek}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToday}
            className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 transition-all"
          >
            Today
          </motion.button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const hasEvents = hasEventsOnDate(day);

            return (
              <motion.button
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/20'
                    : isToday
                    ? 'bg-white/5 border border-white/20'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={`text-xs font-medium ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {format(day, 'EEE')}
                </span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : isToday ? 'text-cyan-400' : 'text-slate-300'}`}>
                  {format(day, 'd')}
                </span>
                {hasEvents && (
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-500'}`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Loading State */}
      {dataLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="ml-3 text-slate-400">Loading plans...</span>
        </div>
      )}

      {/* Selected Date Events */}
      {!dataLoading && (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            {format(selectedDate, 'EEEE, MMMM d')}
          </h2>
          <span className="text-sm text-slate-400">{selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}</span>
        </div>

        <AnimatePresence mode="popLayout">
          {selectedDateEvents.length > 0 ? (
            <motion.div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ x: 5 }}
                  className="bg-slate-800/30 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-cyan-500/30 transition-all duration-300 group backdrop-blur-sm"
                >
                  <div className="flex items-center gap-5 flex-1">
                    {/* Time */}
                    <div className="flex flex-col items-center min-w-[70px]">
                      <Clock className="w-4 h-4 text-slate-500 mb-1" />
                      <span className="text-sm font-semibold text-white">{event.time}</span>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{event.eventName}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 bg-gradient-to-r rounded-lg border ${getOccasionColor(event.occasion)}`}>
                          <Shirt className="w-3 h-3" />
                          {event.occasion}
                        </span>
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          {event.outfitName}
                        </span>
                      </div>
                      {/* Outfit items */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.outfitItems.map((item, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-white/5 text-slate-400 rounded border border-white/10">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Reminder Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleReminder(event.id)}
                      className={`p-2 rounded-lg transition-all ${
                        event.reminder
                          ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                          : 'bg-white/5 text-slate-600 hover:bg-white/10'
                      }`}
                      title={event.reminder ? `Reminder: ${event.reminderMinutes}min before` : 'No reminder set'}
                    >
                      {event.reminder ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </motion.button>
                  </div>

                  {/* Delete */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(event.id)}
                    className="ml-3 p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-slate-800/20 border border-dashed border-white/10 rounded-2xl"
            >
              <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No outfits planned for this day</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 text-sm font-medium hover:bg-cyan-500/20 transition-all"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Plan an outfit
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}

      {/* Add Event Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Plan Outfit</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Display */}
                <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 rounded-lg p-3 border border-white/10">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>

                {/* Event Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Event Name</label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                    placeholder="e.g., Team Meeting"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    required
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Time</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                {/* Outfit Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Select Outfit</label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {SAMPLE_OUTFITS.map((outfit) => (
                      <motion.button
                        key={outfit.name}
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => selectOutfit(outfit)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          formData.outfitName === outfit.name
                            ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/40'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white text-sm">{outfit.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            outfit.occasion === 'Formal' ? 'bg-purple-500/20 text-purple-300' :
                            outfit.occasion === 'Workout' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {outfit.occasion}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {outfit.items.map((item, i) => (
                            <span key={i} className="text-xs text-slate-400">{item}{i < outfit.items.length - 1 ? ',' : ''}</span>
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Reminder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      Reminder
                    </label>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData(prev => ({ ...prev, reminder: !prev.reminder }))}
                      className={`w-10 h-6 rounded-full transition-all duration-300 ${
                        formData.reminder ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                    >
                      <motion.div
                        animate={{ x: formData.reminder ? 16 : 2 }}
                        transition={{ duration: 0.2 }}
                        className="w-4 h-4 bg-white rounded-full mt-1"
                      />
                    </motion.button>
                  </div>
                  {formData.reminder && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <select
                        value={formData.reminderMinutes}
                        onChange={(e) => setFormData(prev => ({ ...prev, reminderMinutes: parseInt(e.target.value) }))}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      >
                        <option value={5}>5 minutes before</option>
                        <option value={10}>10 minutes before</option>
                        <option value={15}>15 minutes before</option>
                        <option value={30}>30 minutes before</option>
                        <option value={60}>1 hour before</option>
                        <option value={120}>2 hours before</option>
                      </select>
                    </motion.div>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!formData.eventName || !formData.outfitName}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                >
                  Save Plan
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
