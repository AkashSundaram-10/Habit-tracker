import { useState, useEffect } from 'react';
import { habitsAPI } from '../services/api';
import { Plus, Trash2, Edit3, Save, X, Settings as SettingsIcon, Sparkles } from 'lucide-react';

const ICONS = [
  { id: 'Code', name: 'Coding', img: 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png' },
  { id: 'BookOpen', name: 'Reading', img: 'https://cdn-icons-png.flaticon.com/128/2702/2702134.png' },
  { id: 'Activity', name: 'Exercise', img: 'https://cdn-icons-png.flaticon.com/128/3048/3048366.png' },
  { id: 'Apple', name: 'Food', img: 'https://cdn-icons-png.flaticon.com/128/415/415682.png' },
  { id: 'Brain', name: 'Learn', img: 'https://cdn-icons-png.flaticon.com/128/3829/3829933.png' },
  { id: 'Droplets', name: 'Water', img: 'https://cdn-icons-png.flaticon.com/128/824/824239.png' },
];

const COLORS = [
  { value: '#8B5CF6', name: 'Violet' },
  { value: '#EC4899', name: 'Pink' },
  { value: '#3B82F6', name: 'Blue' },
  { value: '#10B981', name: 'Emerald' },
  { value: '#F59E0B', name: 'Amber' },
  { value: '#EF4444', name: 'Red' },
];

export default function Settings() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'Code', color: '#8B5CF6', target_value: 1, target_unit: 'boolean' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try { setHabits((await habitsAPI.getAll()).data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) await habitsAPI.update(editId, form);
      else await habitsAPI.create(form);
      await load();
      reset();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this habit? This action cannot be undone.')) return;
    try { await habitsAPI.delete(id); await load(); }
    catch (e) { console.error(e); }
  };

  const edit = (h) => {
    setForm({ name: h.name, description: h.description || '', icon: h.icon || 'Code', color: h.color || '#8B5CF6', target_value: h.target_value || 1, target_unit: h.target_unit || 'boolean' });
    setEditId(h.id);
    setShowForm(true);
  };

  const reset = () => {
    setForm({ name: '', description: '', icon: 'Code', color: '#8B5CF6', target_value: 1, target_unit: 'boolean' });
    setEditId(null);
    setShowForm(false);
  };

  const getImg = (icon) => ICONS.find(i => i.id === icon)?.img || ICONS[0].img;

  return (
    <div className="min-h-screen bg-black text-white pb-28">

      {/* ============ HEADER ============ */}
      <section className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500 text-sm">Manage your habits</p>
          </div>
        </div>
      </section>

      {/* ============ ADD BUTTON ============ */}
      {!showForm && (
        <section className="px-6 pb-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl p-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98]"
          >
            <Plus size={20} /> Create New Habit
          </button>
        </section>
      )}

      {/* ============ ADD/EDIT FORM ============ */}
      {showForm && (
        <section className="px-6 pb-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" />
                <h2 className="font-bold text-lg">{editId ? 'Edit Habit' : 'New Habit'}</h2>
              </div>
              <button
                onClick={reset}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={save} className="space-y-6">
              {/* Name */}
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Habit Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-violet-500 outline-none transition-all duration-200 placeholder:text-gray-600"
                  placeholder="e.g., Morning Exercise"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Tracking Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'boolean', label: 'Yes / No', desc: 'Simple check' },
                    { value: 'minutes', label: 'Minutes', desc: 'Time based' },
                    { value: 'count', label: 'Count', desc: 'Number based' },
                  ].map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, target_unit: t.value })}
                      className={`p-3 rounded-xl text-left transition-all duration-200 ${
                        form.target_unit === t.value
                          ? 'bg-violet-600/20 border-2 border-violet-500'
                          : 'bg-black/30 border-2 border-transparent hover:border-white/10'
                      }`}
                    >
                      <p className="font-medium text-sm">{t.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {form.target_unit !== 'boolean' && (
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-2">
                    Daily Target ({form.target_unit === 'minutes' ? 'minutes' : 'times'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.target_value}
                    onChange={e => setForm({ ...form, target_value: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 focus:border-violet-500 outline-none transition-all duration-200"
                  />
                </div>
              )}

              {/* Icon */}
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-3">Icon</label>
                <div className="grid grid-cols-6 gap-3">
                  {ICONS.map(({ id, name, img }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setForm({ ...form, icon: id })}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                        form.icon === id
                          ? 'bg-violet-600 scale-105 shadow-lg shadow-violet-500/30'
                          : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                    >
                      <img src={img} alt={name} className="w-7 h-7" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-3">Color</label>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, color: c.value })}
                      className={`w-11 h-11 rounded-xl transition-all duration-200 ${
                        form.color === c.value
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !form.name}
                className={`w-full rounded-xl p-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  saving || !form.name
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]'
                }`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> {editId ? 'Update Habit' : 'Create Habit'}
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ============ HABITS LIST ============ */}
      <section className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Your Habits
          </h2>
          <span className="text-sm text-gray-600">{habits.length} total</span>
        </div>

        {loading ? (
          <div className="bg-gray-900/50 rounded-2xl p-10 text-center border border-gray-800/50">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 mt-4">Loading habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="bg-gray-900/50 rounded-2xl p-10 text-center border border-gray-800/50">
            <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No habits yet</p>
            <p className="text-gray-600 text-sm mt-1">Create your first habit to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map(h => (
              <div
                key={h.id}
                className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-4 border border-white/5 flex items-center gap-4 transition-all duration-300 hover:border-white/10"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: h.color + '20' }}
                >
                  <img src={getImg(h.icon)} alt="" className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{h.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {h.target_unit === 'boolean' ? 'Daily check-in' : `${h.target_value} ${h.target_unit}/day`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => edit(h)}
                    className="p-2.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => remove(h.id)}
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

      {/* ============ ABOUT ============ */}
      <section className="px-6 pb-6">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-2xl p-5 border border-white/5 text-center">
          <p className="text-gray-400 font-medium">Daily Growth</p>
          <p className="text-gray-600 text-sm mt-1">Version 1.0 • Built by Akash Kumar</p>
        </div>
      </section>

    </div>
  );
}
