import { getWeekDates, formatDate } from '../utils/dateHelpers';
import { format, isToday, isFuture } from 'date-fns';
import { Check, X, Flame } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function WeeklyTracker({ habits, weeklyData, onToggle }) {
  const weekDates = getWeekDates();

  const getHabitStatus = (habitId, dateStr) => {
    const dayData = weeklyData[dateStr] || [];
    const habitData = dayData.find(h => h.habit_id === habitId);
    return habitData ? habitData.completed : false;
  };

  const getWeeklyStats = (habitId) => {
    let completed = 0;
    let total = 0;

    weekDates.forEach(date => {
      if (!isFuture(date)) {
        total++;
        const dateStr = formatDate(date);
        if (getHabitStatus(habitId, dateStr)) {
          completed++;
        }
      }
    });

    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const handleToggle = (habitId, date) => {
    if (isFuture(date)) return;
    const dateStr = formatDate(date);
    onToggle(habitId, dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div className="card overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          This Week's Progress
        </h2>

        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium w-48">
                Habit
              </th>
              {weekDates.map(date => (
                <th
                  key={date.toISOString()}
                  className={`py-3 px-2 text-center ${
                    isToday(date)
                      ? 'bg-indigo-100 dark:bg-indigo-900 rounded-t-lg'
                      : ''
                  }`}
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-sm font-semibold ${
                    isToday(date)
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {format(date, 'd')}
                  </div>
                </th>
              ))}
              <th className="py-3 px-4 text-center text-gray-600 dark:text-gray-400 font-medium">
                Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map(habit => {
              const IconComponent = Icons[habit.icon] || Icons.Circle;
              const weekStats = getWeeklyStats(habit.habit_id);

              return (
                <tr key={habit.habit_id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: habit.color + '20' }}
                      >
                        <IconComponent size={20} style={{ color: habit.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {habit.name}
                        </p>
                        {habit.streak > 0 && (
                          <div className="flex items-center gap-1 text-xs text-orange-500">
                            <Flame size={12} />
                            <span>{habit.streak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {weekDates.map(date => {
                    const dateStr = formatDate(date);
                    const isCompleted = getHabitStatus(habit.habit_id, dateStr);
                    const isFutureDate = isFuture(date);
                    const isTodayDate = isToday(date);

                    return (
                      <td
                        key={date.toISOString()}
                        className={`py-4 px-2 text-center ${
                          isTodayDate ? 'bg-indigo-100 dark:bg-indigo-900' : ''
                        }`}
                      >
                        <button
                          onClick={() => handleToggle(habit.habit_id, date)}
                          disabled={isFutureDate}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all ${
                            isFutureDate
                              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                              : isCompleted
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                          title={isFutureDate ? 'Future date' : isCompleted ? 'Completed' : 'Mark complete'}
                        >
                          {isFutureDate ? (
                            <span className="text-gray-400">-</span>
                          ) : isCompleted ? (
                            <Check size={20} />
                          ) : (
                            <X size={20} className="text-gray-400" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-20">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${weekStats.percentage}%`,
                            backgroundColor: habit.color,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                        {weekStats.completed}/{weekStats.total}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {habits.map(habit => {
          const weekStats = getWeeklyStats(habit.habit_id);
          const IconComponent = Icons[habit.icon] || Icons.Circle;

          return (
            <div key={habit.habit_id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  <IconComponent size={20} style={{ color: habit.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {habit.name}
                </h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold" style={{ color: habit.color }}>
                    {weekStats.percentage}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {weekStats.completed} of {weekStats.total} days
                  </p>
                </div>
                <div className="text-right">
                  {weekStats.percentage >= 80 ? (
                    <span className="text-green-500 text-sm font-medium">Excellent!</span>
                  ) : weekStats.percentage >= 50 ? (
                    <span className="text-yellow-500 text-sm font-medium">Good progress</span>
                  ) : (
                    <span className="text-red-500 text-sm font-medium">Keep going!</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
