import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, BellRing, BellOff } from 'lucide-react';
import { habitsAPI } from '../services/api';

const IMGS = {
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
    <div className="min-h-screen bg-black text-white pb-28">

      {/* ============ HEADER ============ */}
      <section className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reminders</h1>
            <p className="text-gray-500 text-sm">Stay on track with alerts</p>
          </div>
        </div>
      </section>

      {/* ============ ADD BUTTON ============ */}
      {!showForm && (
        <section className="px-6 pb-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl p-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
          >
            <Plus size={20} /> Add Reminder
          </button>
        </section>
      )}

      {/* ============ ADD FORM ============ */}
      {showForm && (
        <section className="px-6 pb-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BellRing size={18} className="text-cyan-400" />
                <h2 className="font-bold text-lg">New Reminder</h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Select Habit</label>
                <select
                  value={habitId}
                  onChange={e => setHabitId(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Choose a habit...</option>
                  {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Reminder Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-500 transition-all duration-200"
                />
              </div>

              <button
                onClick={add}
                disabled={!habitId}
                className={`w-full rounded-xl p-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  habitId
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Bell size={18} /> Set Reminder
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============ REMINDERS LIST ============ */}
      <section className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Your Reminders
          </h2>
          <span className="text-sm text-gray-600">{reminders.filter(r => r.on).length} active</span>
        </div>

        {reminders.length === 0 ? (
          <div className="bg-gray-900/50 rounded-2xl p-10 text-center border border-gray-800/50">
            <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <BellOff size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No reminders set</p>
            <p className="text-gray-600 text-sm mt-1">Add a reminder to stay on track</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(r => (
              <div
                key={r.id}
                className={`bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-4 border transition-all duration-300 ${
                  r.on ? 'border-cyan-500/20' : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    r.on ? 'bg-cyan-500/20' : 'bg-gray-800/50'
                  }`}>
                    <img src={IMGS[r.icon] || IMGS['default']} alt="" className="w-7 h-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{r.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={14} className={r.on ? 'text-cyan-400' : 'text-gray-500'} />
                      <span className={`text-sm ${r.on ? 'text-cyan-400' : 'text-gray-500'}`}>
                        {formatTime(r.time)}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggle(r.id)}
                    className={`w-12 h-7 rounded-full relative transition-all duration-300 ${
                      r.on
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${
                        r.on ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => remove(r.id)}
                    className="p-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============ INFO NOTE ============ */}
      <section className="px-6 pb-6">
        <div className="bg-gradient-to-br from-cyan-950/50 to-cyan-900/30 rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Bell size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-cyan-400 text-sm font-medium">Note</p>
              <p className="text-gray-400 text-sm mt-1">
                Reminders are stored locally on this device. Browser notifications may require permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
