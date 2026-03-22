import { useState, useEffect } from 'react';
import { trackingAPI } from '../services/api';
import { formatDate, getWeekDates } from '../utils/dateHelpers';
import { format } from 'date-fns';
import { Check, RefreshCw, Quote, Flame } from 'lucide-react';

const QUOTES = [
  { text: "Excellence is not a destination but a continuous journey.", author: "Brian Tracy" },
  { text: "Small daily improvements lead to staggering long-term results.", author: "Robin Sharma" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
];

const HABIT_CONFIG = {
  'Code': {
    image: 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png',
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    check: 'bg-blue-500'
  },
  'BookOpen': {
    image: 'https://cdn-icons-png.flaticon.com/128/2702/2702134.png',
    gradient: 'from-purple-500 to-pink-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    check: 'bg-purple-500'
  },
  'Activity': {
    image: 'https://cdn-icons-png.flaticon.com/128/3048/3048366.png',
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    check: 'bg-emerald-500'
  },
  'Apple': {
    image: 'https://cdn-icons-png.flaticon.com/128/415/415682.png',
    gradient: 'from-rose-500 to-pink-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    check: 'bg-rose-500'
  },
  'Brain': {
    image: 'https://cdn-icons-png.flaticon.com/128/3829/3829933.png',
    gradient: 'from-pink-500 to-rose-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    check: 'bg-pink-500'
  },
  'Droplets': {
    image: 'https://cdn-icons-png.flaticon.com/128/824/824239.png',
    gradient: 'from-sky-500 to-blue-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    check: 'bg-sky-500'
  },
  'default': {
    image: 'https://cdn-icons-png.flaticon.com/128/1828/1828961.png',
    gradient: 'from-gray-500 to-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    check: 'bg-gray-500'
  }
};

export default function Home() {
  const [habits, setHabits] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await trackingAPI.getToday();
      setHabits(res.data);

      const weekDates = getWeekDates();
      const weekData = {};
      for (const date of weekDates) {
        try {
          const r = await trackingAPI.getByDate(formatDate(date));
          weekData[formatDate(date)] = r.data;
        } catch { weekData[formatDate(date)] = []; }
      }
      setWeeklyData(weekData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (habitId) => {
    setCompletingId(habitId);
    try {
      const res = await trackingAPI.toggle({ habit_id: habitId, date: formatDate(new Date()) });
      setHabits(prev => prev.map(h => h.habit_id === habitId ? { ...h, completed: res.data.completed, streak: res.data.streak } : h));
    } catch (err) { console.error(err); }
    finally { setTimeout(() => setCompletingId(null), 300); }
  };

  const handleRefresh = () => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    fetchData();
  };

  const getConfig = (icon) => HABIT_CONFIG[icon] || HABIT_CONFIG['default'];
  const weekDates = getWeekDates();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-base">Loading habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-32">

      {/* ============ HEADER ============ */}
      <section className="px-5 pt-8 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-violet-500/30">
              A
            </div>
            <div>
              <p className="text-gray-500 text-sm">Welcome back</p>
              <h1 className="text-2xl font-bold">Akash Kumar</h1>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:rotate-180 active:scale-90 transition-all duration-500"
          >
            <RefreshCw size={20} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* ============ DATE & TIME ============ */}
      <section className="px-5 pb-6">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-6 shadow-xl shadow-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Today</p>
              <p className="text-3xl font-bold">{format(currentTime, 'EEEE')}</p>
              <p className="text-white/70 text-lg mt-1">{format(currentTime, 'MMMM d, yyyy')}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold font-mono">{format(currentTime, 'hh:mm')}</p>
              <p className="text-white/60 text-lg">{format(currentTime, 'a')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HABITS ============ */}
      <section className="px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">My Habits</h2>
          <span className="text-sm text-gray-500">{habits.filter(h => h.completed).length}/{habits.length} done</span>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => {
            const config = getConfig(habit.icon);
            const isCompleting = completingId === habit.habit_id;

            return (
              <div
                key={habit.habit_id}
                onClick={() => handleToggle(habit.habit_id)}
                className={`${config.bg} rounded-2xl p-4 border ${config.border} cursor-pointer
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                  ${isCompleting ? 'scale-[0.98]' : ''}
                  ${habit.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} p-0.5 flex-shrink-0 shadow-lg`}>
                    <div className="w-full h-full rounded-[10px] bg-black/30 flex items-center justify-center">
                      <img src={config.image} alt="" className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${habit.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      {habit.target_unit !== 'boolean' && (
                        <span className={`text-sm ${config.text}`}>
                          {habit.target_value} {habit.target_unit === 'minutes' ? 'min' : 'times'}/day
                        </span>
                      )}
                      {habit.streak > 0 && (
                        <span className="text-sm text-orange-400 flex items-center gap-1">
                          <Flame size={14} /> {habit.streak} days
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      habit.completed
                        ? `${config.check} shadow-lg`
                        : 'border-2 border-gray-600 bg-black/20'
                    }`}
                  >
                    {habit.completed && <Check size={24} strokeWidth={3} className="text-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {habits.length === 0 && (
          <div className="bg-gray-900/50 rounded-2xl p-10 border border-gray-800 text-center">
            <p className="text-gray-400 text-lg">No habits yet</p>
            <p className="text-gray-600 mt-1">Add habits in Settings</p>
          </div>
        )}
      </section>

      {/* ============ WEEKLY PROGRESS ============ */}
      <section className="px-5 pb-6">
        <h2 className="text-lg font-bold text-white mb-4">This Week</h2>

        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 rounded-2xl p-5 border border-emerald-500/20">
          <div className="flex items-end justify-between h-28 gap-3">
            {weekDates.map((date, i) => {
              const dateStr = formatDate(date);
              const dayData = weeklyData[dateStr] || [];
              const completed = dayData.filter(h => h.completed).length;
              const pct = habits.length > 0 ? (completed / habits.length) * 100 : 0;
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-20 flex items-end">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ${
                        pct > 0
                          ? isToday
                            ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30'
                            : 'bg-gradient-to-t from-gray-600 to-gray-500'
                          : 'bg-gray-800'
                      }`}
                      style={{ height: `${Math.max(pct, 10)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${isToday ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {format(date, 'EEE')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ QUOTE ============ */}
      <section className="px-5 pb-6">
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 rounded-2xl p-5 border border-amber-500/20">
          <div className="flex gap-4">
            <Quote size={24} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-gray-200 text-base leading-relaxed">"{quote.text}"</p>
              <p className="text-amber-400/70 text-sm mt-3 font-medium">— {quote.author}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
