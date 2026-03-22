import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Flame } from 'lucide-react';

export default function HabitCard({ habit, onToggle }) {
  const [isLoading, setIsLoading] = useState(false);

  const IconComponent = Icons[habit.icon] || Icons.Circle;

  const handleToggle = async () => {
    setIsLoading(true);
    await onToggle(habit.habit_id);
    setIsLoading(false);
  };

  const getProgressPercentage = () => {
    if (habit.target_unit === 'boolean') {
      return habit.completed ? 100 : 0;
    }
    return Math.min((habit.value / habit.target_value) * 100, 100);
  };

  const getProgressText = () => {
    if (habit.target_unit === 'minutes') {
      return `${habit.value} / ${habit.target_value} minutes`;
    }
    if (habit.target_unit === 'count') {
      return `${habit.value} / ${habit.target_value}`;
    }
    return habit.completed ? 'Completed' : 'Not completed';
  };

  const progress = getProgressPercentage();

  return (
    <div
      className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
      style={{ borderLeft: `4px solid ${habit.color}` }}
      onClick={handleToggle}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <IconComponent size={24} style={{ color: habit.color }} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        {/* Streak Display */}
        {habit.streak > 0 && (
          <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900 px-3 py-1 rounded-full">
            <Flame size={16} className="text-orange-500" />
            <span className="font-bold text-orange-600 dark:text-orange-400">
              {habit.streak}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getProgressText()}
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: habit.color,
            }}
          />
        </div>
      </div>

      {/* Completion Checkbox */}
      <div className="flex items-center justify-between">
        <button
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            habit.completed
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
        >
          {habit.completed ? '✓ Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
}
