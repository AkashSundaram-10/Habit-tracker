import { useState, useEffect } from 'react';
import { habitsAPI } from '../services/api';
import { Plus, Trash2, Edit3, Save, X, Sparkles } from 'lucide-react';
import { EmptySettings } from '../components/EmptyState';

const ICONS = [
  { id: 'Code', name: 'Coding', img: 'https://cdn-icons-png.flaticon.com/128/6062/6062646.png' },
  { id: 'BookOpen', name: 'Reading', img: 'https://cdn-icons-png.flaticon.com/128/2702/2702134.png' },
  { id: 'Activity', name: 'Exercise', img: 'https://cdn-icons-png.flaticon.com/128/3048/3048366.png' },
  { id: 'Apple', name: 'Food', img: 'https://cdn-icons-png.flaticon.com/128/415/415682.png' },
  { id: 'Brain', name: 'Learn', img: 'https://cdn-icons-png.flaticon.com/128/3829/3829933.png' },
  { id: 'Droplets', name: 'Water', img: 'https://cdn-icons-png.flaticon.com/128/824/824239.png' },
];

const COLORS = [
  { value: 'violet', hex: '#8B5CF6', name: 'Violet' },
  { value: 'pink', hex: '#EC4899', name: 'Pink' },
  { value: 'blue', hex: '#3B82F6', name: 'Blue' },
  { value: 'emerald', hex: '#10B981', name: 'Emerald' },
  { value: 'amber', hex: '#F59E0B', name: 'Amber' },
  { value: 'red', hex: '#EF4444', name: 'Red' },
];

export default function Settings() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'Code', color: 'violet', target_value: 1, target_unit: 'boolean' });
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
    setForm({ name: h.name, description: h.description || '', icon: h.icon || 'Code', color: h.color || 'violet', target_value: h.target_value || 1, target_unit: h.target_unit || 'boolean' });
    setEditId(h.id);
    setShowForm(true);
  };

  const reset = () => {
    setForm({ name: '', description: '', icon: 'Code', color: 'violet', target_value: 1, target_unit: 'boolean' });
    setEditId(null);
    setShowForm(false);
  };

  const getImg = (icon) => ICONS.find(i => i.id === icon)?.img || ICONS[0].img;
  const getColorHex = (color) => COLORS.find(c => c.value === color)?.hex || COLORS[0].hex;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-surface rounded-2xl w-48" />
        <div className="h-14 bg-surface rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-surface rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your habits</p>
      </header>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full btn-primary py-4 rounded-xl font-semibold animate-fade-in-up stagger-1"
        >
          <Plus size={20} /> Create New Habit
        </button>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6 animate-scale-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h2 className="font-semibold text-lg text-text-primary">{editId ? 'Edit Habit' : 'New Habit'}</h2>
            </div>
            <button
              onClick={reset}
              className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={save} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-text-secondary text-sm font-medium block mb-2">Habit Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl p-4"
                placeholder="e.g., Morning Exercise"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="text-text-secondary text-sm font-medium block mb-2">Tracking Type</label>
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
                    className={`p-3 rounded-xl text-left transition-all duration-200 border-2 ${
                      form.target_unit === t.value
                        ? 'bg-accent-light border-accent'
                        : 'bg-surface border-transparent hover:border-border'
                    }`}
                  >
                    <p className={`font-medium text-sm ${form.target_unit === t.value ? 'text-accent' : 'text-text-primary'}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {form.target_unit !== 'boolean' && (
              <div>
                <label className="text-text-secondary text-sm font-medium block mb-2">
                  Daily Target ({form.target_unit === 'minutes' ? 'minutes' : 'times'})
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.target_value}
                  onChange={e => setForm({ ...form, target_value: Number(e.target.value) })}
                  className="w-full rounded-xl p-4"
                />
              </div>
            )}

            {/* Icon */}
            <div>
              <label className="text-text-secondary text-sm font-medium block mb-3">Icon</label>
              <div className="grid grid-cols-6 gap-3">
                {ICONS.map(({ id, name, img }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm({ ...form, icon: id })}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                      form.icon === id
                        ? 'bg-accent scale-105 shadow-md'
                        : 'bg-surface-hover hover:bg-border'
                    }`}
                  >
                    <img src={img} alt={name} className="w-7 h-7" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="text-text-secondary text-sm font-medium block mb-3">Color</label>
              <div className="flex gap-3">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, color: c.value })}
                    className={`w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 ${
                      form.color === c.value ? 'ring-2 ring-offset-2 ring-offset-surface ring-text-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !form.name}
              className={`w-full rounded-xl py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                saving || !form.name
                  ? 'bg-border text-text-muted cursor-not-allowed'
                  : 'bg-success text-white hover:opacity-90 tap-scale'
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
      )}

      {/* Habits List */}
      <section className="animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Your Habits</h2>
          <span className="text-sm text-text-muted">{habits.length} total</span>
        </div>

        {habits.length === 0 ? (
          <EmptySettings />
        ) : (
          <div className="space-y-3">
            {habits.map((h, i) => (
              <div
                key={h.id}
                className="card p-4 flex items-center gap-4 transition-all duration-200 hover-lift"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: getColorHex(h.color) + '20' }}
                >
                  <img src={getImg(h.icon)} alt="" className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-primary truncate">{h.name}</h3>
                  <p className="text-text-muted text-sm">
                    {h.target_unit === 'boolean' ? 'Daily check-in' : `${h.target_value} ${h.target_unit}/day`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => edit(h)}
                    className="p-2.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-light transition-all duration-200"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => remove(h.id)}
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

      {/* About */}
      <section className="animate-fade-in-up stagger-3">
        <div className="card p-5 text-center">
          <p className="text-text-secondary font-medium">Productive</p>
          <p className="text-text-muted text-sm mt-1">Version 1.0 • Built with care</p>
        </div>
      </section>
    </div>
  );
}
