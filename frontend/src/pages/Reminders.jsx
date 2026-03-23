import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, BellRing, Info } from 'lucide-react';
import { habitsAPI } from '../services/api';
import { EmptyReminders } from '../components/EmptyState';

const HABIT_ICONS = {
  'Code': 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png',
  'BookOpen': 'https://cdn-icons-png.flaticon.com/128/2702/2702134.png',
  'Activity': 'https://cdn-icons-png.flaticon.com/128/3048/3048366.png',
  'Apple': 'https://cdn-icons-png.flaticon.com/128/415/415682.png',
  'Brain': 'https://cdn-icons-png.flaticon.com/128/3829/3829933.png',
  'Droplets': 'https://cdn-icons-png.flaticon.com/128/824/824239.png',
  'default': 'https://cdn-icons-png.flaticon.com/128/1828/1828961.png',
};

export default function Reminders() {
  const [habits, setHabits] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [habitId, setHabitId] = useState('');
  const [time, setTime] = useState('09:00');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadHabits();
    const saved = localStorage.getItem('habitReminders');
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  const loadHabits = async () => {
    try { setHabits((await habitsAPI.getAll()).data); }
    catch (e) { console.error(e); }
  };

  const add = () => {
    if (!habitId) return;
    const habit = habits.find(h => h.id === Number(habitId));
    if (!habit) return;

    const updated = [...reminders, { id: Date.now(), habitId: habit.id, name: habit.name, icon: habit.icon, time, on: true }];
    setReminders(updated);
    localStorage.setItem('habitReminders', JSON.stringify(updated));
    setHabitId('');
    setShowForm(false);
  };

  const toggle = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, on: !r.on } : r);
    setReminders(updated);
    localStorage.setItem('habitReminders', JSON.stringify(updated));
  };

  const remove = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('habitReminders', JSON.stringify(updated));
  };

  const formatTime = (t) => {
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Reminders</h1>
        <p className="text-text-secondary mt-1">Stay on track with alerts</p>
      </header>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full btn-primary py-4 rounded-xl font-semibold animate-fade-in-up stagger-1"
        >
          <Plus size={20} /> Add Reminder
        </button>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="card p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BellRing size={18} className="text-accent" />
              <h2 className="font-semibold text-lg text-text-primary">New Reminder</h2>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-text-secondary text-sm font-medium block mb-2">Select Habit</label>
              <select
                value={habitId}
                onChange={e => setHabitId(e.target.value)}
                className="w-full rounded-xl p-4 appearance-none cursor-pointer"
              >
                <option value="">Choose a habit...</option>
                {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-text-secondary text-sm font-medium block mb-2">Reminder Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full rounded-xl p-4"
              />
            </div>

            <button
              onClick={add}
              disabled={!habitId}
              className={`w-full rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                habitId
                  ? 'btn-primary tap-scale'
                  : 'bg-border text-text-muted cursor-not-allowed'
              }`}
            >
              <Bell size={18} /> Set Reminder
            </button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <section className="animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Your Reminders</h2>
          <span className="text-sm text-text-muted">{reminders.filter(r => r.on).length} active</span>
        </div>

        {reminders.length === 0 ? (
          <EmptyReminders onAddReminder={() => setShowForm(true)} />
        ) : (
          <div className="space-y-3">
            {reminders.map((r, i) => (
              <div
                key={r.id}
                className={`card p-4 transition-all duration-200 hover-lift ${!r.on ? 'opacity-60' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    r.on ? 'bg-accent-light' : 'bg-surface-hover'
                  }`}>
                    <img src={HABIT_ICONS[r.icon] || HABIT_ICONS['default']} alt="" className="w-7 h-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary truncate">{r.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={14} className={r.on ? 'text-accent' : 'text-text-muted'} />
                      <span className={`text-sm ${r.on ? 'text-accent' : 'text-text-muted'}`}>
                        {formatTime(r.time)}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggle(r.id)}
                    className={`w-12 h-7 rounded-full relative transition-all duration-300 ${
                      r.on ? 'bg-accent' : 'bg-border'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        r.on ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => remove(r.id)}
                    className="p-2.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info Note */}
      <section className="animate-fade-in-up stagger-3">
        <div className="card p-4 bg-accent-light dark:bg-accent/10 border-accent/20">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-accent text-sm font-medium">Note</p>
              <p className="text-text-secondary text-sm mt-1">
                Reminders are stored locally on this device. Browser notifications may require permissions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
