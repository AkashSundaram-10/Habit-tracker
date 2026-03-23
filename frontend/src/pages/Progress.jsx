import { useState, useEffect } from 'react';
import { trackingAPI, habitsAPI } from '../services/api';
import { ChevronLeft, ChevronRight, TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subWeeks, addWeeks, subMonths, addMonths, isSameMonth, isSameWeek } from 'date-fns';
import { formatDate } from '../utils/dateHelpers';
import { EmptyProgress } from '../components/EmptyState';
import { CompletionBarChart, HabitComparisonChart } from '../components/charts';

const HABIT_ICONS = {
  'Code': 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png',
  'BookOpen': 'https://cdn-icons-png.flaticon.com/128/2702/2702134.png',
  'Activity': 'https://cdn-icons-png.flaticon.com/128/3048/3048366.png',
  'Apple': 'https://cdn-icons-png.flaticon.com/128/415/415682.png',
  'Brain': 'https://cdn-icons-png.flaticon.com/128/3829/3829933.png',
  'Droplets': 'https://cdn-icons-png.flaticon.com/128/824/824239.png',
  'default': 'https://cdn-icons-png.flaticon.com/128/1828/1828961.png',
};

const HABIT_COLORS = {
  violet: '#8B5CF6',
  pink: '#EC4899',
  blue: '#3B82F6',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

export default function Progress() {
  const [habits, setHabits] = useState([]);
  const [report, setReport] = useState(null);
  const [type, setType] = useState('week');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadHabits(); }, []);
  useEffect(() => { if (habits.length) loadReport(); }, [habits, type, date]);

  const loadHabits = async () => {
    try { setHabits((await habitsAPI.getAll()).data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadReport = async () => {
    if (type === 'week') await loadWeekly();
    else await loadMonthly();
  };

  const loadWeekly = async () => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    const data = {};
    const daily = [];

    for (const d of days) {
      try {
        const res = await trackingAPI.getByDate(formatDate(d));
        data[formatDate(d)] = res.data;
        daily.push({ day: format(d, 'EEE')[0], count: res.data.filter(h => h.completed).length });
      } catch {
        daily.push({ day: format(d, 'EEE')[0], count: 0 });
      }
    }

    const habitStats = habits.map(h => {
      let done = 0;
      Object.values(data).forEach(d => { if (d.find(x => x.habit_id === h.id)?.completed) done++; });
      return { ...h, done, total: 7, pct: Math.round((done / 7) * 100) };
    });

    const total = daily.reduce((s, d) => s + d.count, 0);
    setReport({ start, end, daily, habitStats, total, max: habits.length * 7 });
  };

  const loadMonthly = async () => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });

    const data = {};
    for (const d of days) {
      try { data[formatDate(d)] = (await trackingAPI.getByDate(formatDate(d))).data; }
      catch { data[formatDate(d)] = []; }
    }

    const weeks = [];
    let week = [], wn = 1;
    for (const d of days) {
      week.push(formatDate(d));
      if (d.getDay() === 6 || d.getTime() === end.getTime()) {
        const count = week.reduce((s, dt) => s + (data[dt]?.filter(h => h.completed).length || 0), 0);
        weeks.push({ week: `W${wn}`, count });
        week = [];
        wn++;
      }
    }

    const habitStats = habits.map(h => {
      let done = 0;
      Object.values(data).forEach(d => { if (d.find(x => x.habit_id === h.id)?.completed) done++; });
      return { ...h, done, total: days.length, pct: Math.round((done / days.length) * 100) };
    });

    const total = Object.values(data).reduce((s, d) => s + d.filter(h => h.completed).length, 0);
    setReport({ weeks, habitStats, total, max: habits.length * days.length, days: days.length });
  };

  const prev = () => setDate(type === 'week' ? subWeeks(date, 1) : subMonths(date, 1));
  const next = () => setDate(type === 'week' ? addWeeks(date, 1) : addMonths(date, 1));
  const isCurrent = () => type === 'week' ? isSameWeek(date, new Date(), { weekStartsOn: 0 }) : isSameMonth(date, new Date());

  const getHabitColor = (color) => HABIT_COLORS[color] || HABIT_COLORS.violet;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-surface rounded-2xl w-48" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-surface rounded-2xl" />
          <div className="h-28 bg-surface rounded-2xl" />
        </div>
        <div className="h-64 bg-surface rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Progress</h1>
        <p className="text-text-secondary mt-1">Track your habit performance</p>
      </header>

      {habits.length === 0 ? (
        <EmptyProgress />
      ) : (
        <>
          {/* Period Toggle & Navigation */}
          <div className="flex items-center justify-between animate-fade-in-up stagger-1">
            <div className="flex gap-1 bg-surface p-1 rounded-xl border border-border">
              {['week', 'month'].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    type === t
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {t === 'week' ? 'Weekly' : 'Monthly'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="p-2 rounded-lg bg-surface border border-border hover:bg-surface-hover transition-all duration-200 tap-scale"
              >
                <ChevronLeft size={18} className="text-text-secondary" />
              </button>
              <button
                onClick={next}
                disabled={isCurrent()}
                className={`p-2 rounded-lg border transition-all duration-200 tap-scale ${
                  isCurrent()
                    ? 'bg-surface/50 text-text-muted border-transparent cursor-not-allowed'
                    : 'bg-surface border-border hover:bg-surface-hover'
                }`}
              >
                <ChevronRight size={18} className={isCurrent() ? 'text-text-muted' : 'text-text-secondary'} />
              </button>
            </div>
          </div>

          {/* Period Display */}
          <div className="card p-3 text-center animate-fade-in-up stagger-1">
            <div className="flex items-center justify-center gap-2">
              <Calendar size={16} className="text-accent" />
              <span className="text-text-primary font-medium">
                {type === 'week'
                  ? `${format(startOfWeek(date, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(date, { weekStartsOn: 0 }), 'MMM d, yyyy')}`
                  : format(date, 'MMMM yyyy')}
              </span>
            </div>
          </div>

          {report && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-2">
                <div className="card p-4 hover-lift">
                  <div className="flex items-center gap-2 text-text-secondary mb-2">
                    <Award size={16} className="text-accent" />
                    <span className="text-xs font-medium">Completion</span>
                  </div>
                  <p className="text-3xl font-bold text-text-primary">
                    {report.max > 0 ? Math.round((report.total / report.max) * 100) : 0}%
                  </p>
                  <p className="text-xs text-text-muted mt-1">overall score</p>
                </div>

                <div className="card p-4 hover-lift">
                  <div className="flex items-center gap-2 text-text-secondary mb-2">
                    <Target size={16} className="text-success" />
                    <span className="text-xs font-medium">Completed</span>
                  </div>
                  <p className="text-3xl font-bold text-text-primary">{report.total}</p>
                  <p className="text-xs text-text-muted mt-1">of {report.max} possible</p>
                </div>
              </div>

              {/* Overview Chart */}
              <section className="animate-fade-in-up stagger-3">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  {type === 'week' ? 'Daily' : 'Weekly'} Overview
                </h2>
                <div className="card p-5">
                  <CompletionBarChart
                    data={(type === 'week' ? report.daily : report.weeks).map((d) => {
                      const pct = report.max > 0 ? (d.count / (habits.length * (type === 'week' ? 1 : 7))) * 100 : 0;
                      return {
                        label: d.day || d.week,
                        value: Math.round(pct),
                      };
                    })}
                    height={180}
                    gradientColors={['var(--color-accent)', '#EC4899']}
                  />
                </div>
              </section>

              {/* Habit Comparison */}
              <section className="animate-fade-in-up stagger-4">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Habit Comparison
                </h2>
                <div className="card p-5">
                  <HabitComparisonChart
                    data={report.habitStats.map(h => ({
                      name: h.name.length > 10 ? h.name.substring(0, 10) + '...' : h.name,
                      completion: h.pct,
                      color: getHabitColor(h.color),
                    }))}
                    height={220}
                  />
                </div>
              </section>

              {/* Detailed Stats */}
              <section className="animate-fade-in-up stagger-5">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                  Detailed Stats
                </h2>
                <div className="space-y-3">
                  {report.habitStats.map((h, i) => {
                    const color = getHabitColor(h.color);
                    return (
                      <div
                        key={i}
                        className="card p-4 transition-all duration-200 hover-lift"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: color + '20' }}
                          >
                            <img src={HABIT_ICONS[h.icon] || HABIT_ICONS['default']} alt="" className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-primary truncate">{h.name}</p>
                            <p className="text-xs text-text-muted">{h.done} of {h.total} days</p>
                          </div>
                          <span
                            className="text-lg font-bold"
                            style={{
                              color: h.pct >= 70 ? 'var(--color-success)' :
                                     h.pct >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'
                            }}
                          >
                            {h.pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${h.pct}%`,
                              backgroundColor: h.pct >= 70 ? 'var(--color-success)' :
                                               h.pct >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
