import { useState, useEffect } from 'react';
import { trackingAPI } from '../services/api';
import { formatDate, getWeekDates } from '../utils/dateHelpers';
import { format } from 'date-fns';
import { Check, Flame, TrendingUp, Target, Zap, Clock, Calendar, Sparkles, Trophy } from 'lucide-react';
import { ConfettiTrigger } from '../components/Confetti';
import CelebrationModal from '../components/CelebrationModal';
import { checkNewAchievements, ACHIEVEMENTS } from '../components/AchievementBadge';
import { EmptyHabits } from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

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

const HABIT_COLORS = {
  violet: { bg: 'bg-violet-100 dark:bg-violet-500/20', text: 'text-violet-600 dark:text-violet-400', check: 'bg-gradient-to-br from-violet-500 to-purple-600' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400', check: 'bg-gradient-to-br from-pink-500 to-rose-600' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', check: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', check: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', check: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  red: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400', check: 'bg-gradient-to-br from-red-500 to-rose-600' },
};

const HABIT_ICONS = {
  'Code': 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png',
  'BookOpen': 'https://cdn-icons-png.flaticon.com/128/2702/2702134.png',
  'Activity': 'https://cdn-icons-png.flaticon.com/128/3048/3048366.png',
  'Apple': 'https://cdn-icons-png.flaticon.com/128/415/415682.png',
  'Brain': 'https://cdn-icons-png.flaticon.com/128/3829/3829933.png',
  'Droplets': 'https://cdn-icons-png.flaticon.com/128/824/824239.png',
  'default': 'https://cdn-icons-png.flaticon.com/128/1828/1828961.png',
};

export default function Home() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [completingId, setCompletingId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationAchievement, setCelebrationAchievement] = useState(null);
  const [confettiColor, setConfettiColor] = useState('#F97316');

  // Live clock
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
      const habit = habits.find(h => h.habit_id === habitId);
      const previousStreak = habit?.streak || 0;

      const res = await trackingAPI.toggle({ habit_id: habitId, date: formatDate(new Date()) });

      setHabits(prev => prev.map(h =>
        h.habit_id === habitId
          ? { ...h, completed: res.data.completed, streak: res.data.streak }
          : h
      ));

      if (res.data.completed) {
        setConfettiColor('#F97316');
        setShowConfetti(true);

        const newAchievements = checkNewAchievements(previousStreak, res.data.streak, 'streak');
        if (newAchievements.length > 0) {
          setTimeout(() => {
            setCelebrationAchievement(newAchievements[newAchievements.length - 1]);
          }, 500);
        }

        setTimeout(() => {
          const updatedHabits = habits.map(h =>
            h.habit_id === habitId ? { ...h, completed: true } : h
          );
          const completedCount = updatedHabits.filter(h => h.completed).length;
          const completionPct = (completedCount / habits.length) * 100;

          if (completionPct === 100 && !celebrationAchievement) {
            setCelebrationAchievement(ACHIEVEMENTS.COMPLETION_100);
          }
        }, 800);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setCompletingId(null);
        setShowConfetti(false);
      }, 300);
    }
  };

  const getColorStyle = (color) => HABIT_COLORS[color] || HABIT_COLORS.amber;
  const getIconImage = (icon) => HABIT_ICONS[icon] || HABIT_ICONS.default;

  const weekDates = getWeekDates();
  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0);
  const totalStreaks = habits.reduce((sum, h) => sum + (h.streak || 0), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-6 animate-pulse">
          <div className="h-20 bg-surface rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-surface rounded-2xl" />)}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-surface rounded-2xl" />)}
          </div>
        </div>
        <div className="space-y-6 lg:pl-4 animate-pulse">
          <div className="h-48 bg-surface rounded-2xl" />
          <div className="h-32 bg-surface rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <ConfettiTrigger trigger={showConfetti} color={confettiColor}>
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Celebration Modal */}
        {celebrationAchievement && (
          <CelebrationModal
            achievement={celebrationAchievement}
            onClose={() => setCelebrationAchievement(null)}
          />
        )}

        {/* ========== LEFT COLUMN - Main Content ========== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header with Greeting */}
          <header className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <div className="live-indicator" />
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Live</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              {getGreeting()}, <span className="gradient-text">Akash</span>
            </h1>
            <p className="text-text-secondary mt-2 text-lg">
              Let's make today count. You've got this!
            </p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 animate-fade-in-up stagger-1">
            {/* Today's Progress */}
            <div className="card p-5 hover-lift group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target size={20} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-text-muted uppercase">Today</span>
              </div>
              <p className="text-3xl font-bold text-text-primary">{completionRate}%</p>
              <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full progress-animate"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mt-2">{completedToday} of {totalHabits} completed</p>
            </div>

            {/* Best Streak */}
            <div className="card p-5 hover-lift group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame size={20} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-text-muted uppercase">Streak</span>
              </div>
              <p className="text-3xl font-bold text-text-primary">{maxStreak}</p>
              <p className="text-xs text-text-muted mt-2">days best streak</p>
            </div>

            {/* Total Points */}
            <div className="card p-5 hover-lift group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy size={20} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-text-muted uppercase">Points</span>
              </div>
              <p className="text-3xl font-bold text-text-primary">{totalStreaks * 10}</p>
              <p className="text-xs text-text-muted mt-2">total earned</p>
            </div>
          </div>

          {/* Today's Habits */}
          <section className="animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-text-primary">Today's Habits</h2>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-light text-accent">
                  {completedToday}/{totalHabits}
                </span>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Manage
              </button>
            </div>

            {habits.length > 0 ? (
              <div className="space-y-3">
                {habits.map((habit, index) => {
                  const colorStyle = getColorStyle(habit.color || 'amber');
                  const isCompleting = completingId === habit.habit_id;

                  return (
                    <div
                      key={habit.habit_id}
                      onClick={() => handleToggle(habit.habit_id)}
                      className={`card p-5 cursor-pointer transition-all duration-300 hover-lift tap-scale
                        ${habit.completed ? 'opacity-60' : ''}
                        ${isCompleting ? 'scale-[0.98]' : ''}
                        stagger-${Math.min(index + 1, 8)}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl ${colorStyle.bg} flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105`}>
                          <img src={getIconImage(habit.icon)} alt="" className="w-8 h-8" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-lg text-text-primary transition-all duration-200 ${habit.completed ? 'line-through opacity-60' : ''}`}>
                            {habit.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            {habit.target_unit !== 'boolean' && (
                              <span className={`text-sm font-medium ${colorStyle.text}`}>
                                {habit.target_value} {habit.target_unit === 'minutes' ? 'min' : 'times'}/day
                              </span>
                            )}
                            {habit.streak > 0 && (
                              <span className="text-sm font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1">
                                <Flame size={14} className={habit.streak >= 7 ? 'animate-wiggle' : ''} />
                                {habit.streak} day streak
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Checkbox */}
                        <button
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            habit.completed
                              ? `${colorStyle.check} shadow-lg`
                              : 'border-2 border-border hover:border-accent'
                          }`}
                        >
                          {habit.completed && (
                            <Check size={24} strokeWidth={3} className="text-white animate-checkmark" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyHabits onCreateHabit={() => navigate('/settings')} />
            )}
          </section>
        </div>

        {/* ========== RIGHT COLUMN - Sidebar ========== */}
        <div className="space-y-6 lg:pl-4">
          {/* Profile & Time Card */}
          <div className="card-gradient p-6 text-white animate-fade-in-up animate-glow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shadow-lg">
                A
              </div>
              <div>
                <h3 className="text-xl font-bold">Akash Kumar</h3>
                <p className="text-white/70 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Premium Member
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Live Time */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-white/60" />
                  <span className="text-xs text-white/60 uppercase tracking-wider">Current Time</span>
                </div>
                <p className="text-3xl font-bold font-mono tracking-wider">
                  {format(currentTime, 'HH:mm')}
                  <span className="text-lg text-white/50">:{format(currentTime, 'ss')}</span>
                </p>
              </div>

              {/* Date */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-white/60" />
                  <span className="text-xs text-white/60 uppercase tracking-wider">Today's Date</span>
                </div>
                <p className="text-lg font-bold">{format(currentTime, 'EEEE')}</p>
                <p className="text-white/70 text-sm">{format(currentTime, 'MMMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="card p-5 animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary">This Week</h3>
              <TrendingUp size={18} className="text-accent" />
            </div>
            <div className="flex items-end justify-between h-24 gap-2">
              {weekDates.map((date, i) => {
                const dateStr = formatDate(date);
                const dayData = weeklyData[dateStr] || [];
                const completed = dayData.filter(h => h.completed).length;
                const pct = totalHabits > 0 ? (completed / totalHabits) * 100 : 0;
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-16 flex items-end">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ${
                          pct > 0
                            ? isToday
                              ? 'bg-gradient-to-t from-orange-500 to-amber-400'
                              : 'bg-text-muted/20'
                            : 'bg-border'
                        }`}
                        style={{ height: `${Math.max(pct, 12)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${isToday ? 'text-accent' : 'text-text-muted'}`}>
                      {format(date, 'EEE')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quote Card */}
          <div className="card p-5 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-teal-500/20 animate-fade-in-up stagger-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-text-primary leading-relaxed font-medium">"{quote.text}"</p>
                <p className="text-teal-600 dark:text-teal-400 text-sm mt-3 font-semibold">— {quote.author}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-5 animate-fade-in-up stagger-4">
            <h3 className="font-bold text-text-primary mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Active Habits</span>
                <span className="font-bold text-text-primary">{totalHabits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Completed Today</span>
                <span className="font-bold text-success">{completedToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Best Streak</span>
                <span className="font-bold text-rose-500">{maxStreak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Weekly Average</span>
                <span className="font-bold text-accent">
                  {(() => {
                    const weeklyCompleted = Object.values(weeklyData).reduce((sum, day) =>
                      sum + (day.filter(h => h.completed).length), 0
                    );
                    const weeklyTotal = Object.values(weeklyData).reduce((sum, day) =>
                      sum + day.length, 0
                    );
                    return weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;
                  })()}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfettiTrigger>
  );
}
