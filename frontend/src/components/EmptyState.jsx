import React from 'react';
import { Plus, Target, TrendingUp, Bell, Settings as SettingsIcon } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Target,
  title = 'No data yet',
  description = 'Get started by adding your first item',
  actionLabel,
  onAction,
  iconColor = 'var(--color-accent)',
  animate = true,
}) => {
  return (
    <div
      className={`card p-12 text-center ${animate ? 'animate-fade-in-up' : ''}`}
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div
          className="p-6 rounded-2xl"
          style={{
            background: `${iconColor}15`,
            border: `2px dashed ${iconColor}40`,
          }}
        >
          <Icon size={48} style={{ color: iconColor }} className="opacity-70" />
        </div>
      </div>

      {/* Text content */}
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">{description}</p>

      {/* Action button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary py-3 px-6 rounded-xl font-semibold inline-flex items-center gap-2 tap-scale"
        >
          <Plus size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Preset empty states for different pages
export const EmptyHabits = ({ onCreateHabit }) => (
  <EmptyState
    icon={Target}
    title="No habits yet"
    description="Start building better habits today! Create your first habit to begin tracking your progress."
    actionLabel="Create Your First Habit"
    onAction={onCreateHabit}
    iconColor="var(--color-accent)"
  />
);

export const EmptyProgress = () => (
  <EmptyState
    icon={TrendingUp}
    title="No progress data"
    description="Start tracking your habits to see your progress and analytics here."
    iconColor="var(--color-success)"
  />
);

export const EmptyReminders = ({ onAddReminder }) => (
  <EmptyState
    icon={Bell}
    title="No reminders set"
    description="Set reminders to stay on track with your habits. Never miss a day again!"
    actionLabel="Add Reminder"
    onAction={onAddReminder}
    iconColor="var(--color-accent)"
  />
);

export const EmptySettings = () => (
  <EmptyState
    icon={SettingsIcon}
    title="No habits to manage"
    description="Create habits from the home page, then come back here to customize them."
    iconColor="var(--color-warning)"
  />
);

// Loading empty state with shimmer
export const LoadingEmptyState = () => (
  <div className="card p-12 text-center animate-fade-in-up">
    <div className="flex justify-center mb-6">
      <div className="w-24 h-24 rounded-2xl bg-surface-hover shimmer" />
    </div>
    <div className="h-6 w-48 bg-surface-hover rounded mx-auto mb-3 shimmer" />
    <div className="h-4 w-64 bg-surface-hover rounded mx-auto shimmer" />
  </div>
);

export default EmptyState;
