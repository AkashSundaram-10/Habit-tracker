import { useState, useEffect } from 'react';
import { trackingAPI, habitsAPI } from '../services/api';
import { Loader, ChevronLeft, ChevronRight, TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subWeeks, addWeeks, subMonths, addMonths, isSameMonth, isSameWeek } from 'date-fns';
import { formatDate } from '../utils/dateHelpers';

const IMGS = {
  'Code': 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png',
  'BookOpen': 'https://cdn-icons-png.flaticon.com/128/2702/2702134.png',
  'Activity': 'https://cdn-icons-png.flaticon.com/128/3048/3048366.png',
  'Apple': 'https://cdn-icons-png.flaticon.com/128/415/415682.png',
  'Brain': 'https://cdn-icons-png.flaticon.com/128/3829/3829933.png',
  'Droplets': 'https://cdn-icons-png.flaticon.com/128/824/824239.png',
  'default': 'https://cdn-icons-png.flaticon.com/128/1828/1828961.png',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-violet-500" size={32} />
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-28">

      {/* ============ HEADER ============ */}
      <section className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-gray-500 text-sm">Track your performance</p>
          </div>
        </div>
      </section>

      {habits.length === 0 ? (
        <section className="px-6">
          <div className="bg-gray-900/50 rounded-2xl p-10 text-center border border-gray-800/50">
            <Target size={40} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 font-medium">No habits to track</p>
            <p className="text-gray-600 text-sm mt-1">Add habits in Settings to see your progress</p>
          </div>
        </section>
      ) : (
        <>
          {/* ============ TOGGLE & NAV ============ */}
          <section className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 bg-gray-900/50 p-1 rounded-xl">
                {['week', 'month'].map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      type === t
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t === 'week' ? 'Weekly' : 'Monthly'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="p-2.5 bg-gray-900/50 hover:bg-gray-800 rounded-xl border border-white/5 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  disabled={isCurrent()}
                  className={`p-2.5 rounded-xl border transition-all duration-200 ${
                    isCurrent()
                      ? 'bg-gray-900/30 text-gray-700 border-transparent cursor-not-allowed'
                      : 'bg-gray-900/50 hover:bg-gray-800 border-white/5 hover:scale-105 active:scale-95'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* ============ PERIOD ============ */}
          <section className="px-6 pb-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-4 border border-white/5 text-center">
              <div className="flex items-center justify-center gap-2">
                <Calendar size={16} className="text-violet-400" />
                <p className="text-gray-300 font-medium">
                  {type === 'week'
                    ? `${format(startOfWeek(date, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(date, { weekStartsOn: 0 }), 'MMM d, yyyy')}`
                    : format(date, 'MMMM yyyy')}
                </p>
              </div>
            </div>
          </section>

          {report && (
            <>
              {/* ============ SCORE CARDS ============ */}
              <section className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-violet-950/80 to-violet-900/40 rounded-2xl p-5 border border-violet-500/20">
                    <Award size={20} className="text-violet-400 mb-3" />
                    <p className="text-4xl font-bold">
                      {report.max > 0 ? Math.round((report.total / report.max) * 100) : 0}%
                    </p>
                    <p className="text-violet-400/70 text-sm mt-1">Completion Score</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-950/80 to-emerald-900/40 rounded-2xl p-5 border border-emerald-500/20">
                    <Target size={20} className="text-emerald-400 mb-3" />
                    <p className="text-4xl font-bold">{report.total}</p>
                    <p className="text-emerald-400/70 text-sm mt-1">of {report.max} completed</p>
                  </div>
                </div>
              </section>

              {/* ============ CHART ============ */}
              <section className="px-6 pb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  {type === 'week' ? 'Daily' : 'Weekly'} Overview
                </h2>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-5 border border-white/5">
                  <div className="flex items-end justify-between h-32 gap-3">
                    {(type === 'week' ? report.daily : report.weeks).map((d, i) => {
                      const pct = report.max > 0 ? (d.count / (habits.length * (type === 'week' ? 1 : 7))) * 100 : 0;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full h-24 flex items-end">
                            <div
                              className={`w-full rounded-lg transition-all duration-500 ${
                                pct > 0
                                  ? 'bg-gradient-to-t from-violet-600 via-purple-500 to-fuchsia-400'
                                  : 'bg-gray-800/50'
                              }`}
                              style={{ height: `${Math.max(pct, 6)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 font-medium">{d.day || d.week}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ============ HABIT BREAKDOWN ============ */}
              <section className="px-6 pb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">By Habit</h2>
                <div className="space-y-3">
                  {report.habitStats.map((h, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-4 border border-white/5 transition-all duration-300 hover:border-white/10"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: (h.color || '#8B5CF6') + '20' }}
                        >
                          <img src={IMGS[h.icon] || IMGS['default']} alt="" className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{h.name}</p>
                          <p className="text-xs text-gray-500">{h.done} of {h.total} days</p>
                        </div>
                        <span className={`text-lg font-bold ${
                          h.pct >= 70 ? 'text-emerald-400' : h.pct >= 40 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {h.pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            h.pct >= 70
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : h.pct >= 40
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-gradient-to-r from-red-500 to-rose-400'
                          }`}
                          style={{ width: `${h.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}

    </div>
  );
}
