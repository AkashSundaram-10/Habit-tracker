import { query, queryOne, execute, getLastInsertId } from '../database/db.js';

// Helper: Get today's date in YYYY-MM-DD format
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Helper: Calculate streak for a habit
function calculateStreak(habitId) {
  const logs = query(
    'SELECT date, completed FROM habit_logs WHERE habit_id = ? ORDER BY date DESC',
    [habitId]
  );

  if (logs.length === 0) return 0;

  let streak = 0;
  const today = getTodayDate();
  let currentDate = new Date(today);

  for (const log of logs) {
    const logDate = log.date;
    const expectedDate = currentDate.toISOString().split('T')[0];

    if (logDate === expectedDate && log.completed) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (logDate === expectedDate && !log.completed) {
      // Found incomplete day, break streak
      break;
    } else if (logDate < expectedDate) {
      // Gap in dates, break streak
      break;
    }
  }

  return streak;
}

// Get today's habits with completion status
export function getTodayHabits(req, res) {
  try {
    const today = getTodayDate();
    const habits = query('SELECT * FROM habits WHERE is_active = 1');

    const result = habits.map(habit => {
      const log = queryOne(
        'SELECT completed, value, notes FROM habit_logs WHERE habit_id = ? AND date = ?',
        [habit.id, today]
      );

      const streak = calculateStreak(habit.id);

      return {
        habit_id: habit.id,
        name: habit.name,
        description: habit.description,
        target_value: habit.target_value,
        target_unit: habit.target_unit,
        icon: habit.icon,
        color: habit.color,
        completed: log ? log.completed : 0,
        value: log ? log.value : 0,
        notes: log ? log.notes : '',
        streak
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching today habits:', error);
    res.status(500).json({ error: 'Failed to fetch today habits' });
  }
}

// Get habits for specific date
export function getHabitsByDate(req, res) {
  try {
    const { date } = req.params;
    const habits = query('SELECT * FROM habits WHERE is_active = 1');

    const result = habits.map(habit => {
      const log = queryOne(
        'SELECT completed, value, notes FROM habit_logs WHERE habit_id = ? AND date = ?',
        [habit.id, date]
      );

      return {
        habit_id: habit.id,
        name: habit.name,
        description: habit.description,
        target_value: habit.target_value,
        target_unit: habit.target_unit,
        icon: habit.icon,
        color: habit.color,
        completed: log ? log.completed : 0,
        value: log ? log.value : 0,
        notes: log ? log.notes : ''
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching habits by date:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
}

// Mark habit as complete
export function completeHabit(req, res) {
  try {
    const { habit_id, date, value, notes } = req.body;

    if (!habit_id || !date) {
      return res.status(400).json({ error: 'habit_id and date are required' });
    }

    // Check if log already exists
    const existing = queryOne(
      'SELECT id FROM habit_logs WHERE habit_id = ? AND date = ?',
      [habit_id, date]
    );

    if (existing) {
      // Update existing log
      execute(
        'UPDATE habit_logs SET completed = 1, value = ?, notes = ? WHERE id = ?',
        [value || 0, notes || '', existing.id]
      );
    } else {
      // Create new log
      execute(
        'INSERT INTO habit_logs (habit_id, date, completed, value, notes) VALUES (?, ?, 1, ?, ?)',
        [habit_id, date, value || 0, notes || '']
      );
    }

    const streak = calculateStreak(habit_id);
    res.json({ message: 'Habit marked as complete', streak });
  } catch (error) {
    console.error('Error completing habit:', error);
    res.status(500).json({ error: 'Failed to complete habit' });
  }
}

// Toggle habit completion
export function toggleHabit(req, res) {
  try {
    const { habit_id, date } = req.body;

    if (!habit_id || !date) {
      return res.status(400).json({ error: 'habit_id and date are required' });
    }

    const existing = queryOne(
      'SELECT id, completed FROM habit_logs WHERE habit_id = ? AND date = ?',
      [habit_id, date]
    );

    if (existing) {
      // Toggle completion
      const newCompleted = existing.completed ? 0 : 1;
      execute('UPDATE habit_logs SET completed = ? WHERE id = ?', [newCompleted, existing.id]);
    } else {
      // Create new log as completed
      execute(
        'INSERT INTO habit_logs (habit_id, date, completed, value) VALUES (?, ?, 1, 0)',
        [habit_id, date]
      );
    }

    const streak = calculateStreak(habit_id);
    const updatedLog = queryOne(
      'SELECT completed FROM habit_logs WHERE habit_id = ? AND date = ?',
      [habit_id, date]
    );

    res.json({
      message: 'Habit toggled',
      completed: updatedLog.completed,
      streak
    });
  } catch (error) {
    console.error('Error toggling habit:', error);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
}

// Get streak for a habit
export function getStreak(req, res) {
  try {
    const { habit_id } = req.params;

    const habit = queryOne('SELECT id FROM habits WHERE id = ? AND is_active = 1', [habit_id]);
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const streak = calculateStreak(habit_id);
    res.json({ habit_id, streak });
  } catch (error) {
    console.error('Error calculating streak:', error);
    res.status(500).json({ error: 'Failed to calculate streak' });
  }
}

// Get habit statistics
export function getHabitStats(req, res) {
  try {
    const { habit_id } = req.params;
    const { period = 'week' } = req.query;

    const habit = queryOne('SELECT id FROM habits WHERE id = ? AND is_active = 1', [habit_id]);
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    let daysBack = 7;
    if (period === 'month') daysBack = 30;
    if (period === 'year') daysBack = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startDateStr = startDate.toISOString().split('T')[0];

    const logs = query(
      'SELECT date, completed, value FROM habit_logs WHERE habit_id = ? AND date >= ?',
      [habit_id, startDateStr]
    );

    const totalDays = logs.length;
    const completedDays = logs.filter(log => log.completed).length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    const totalValue = logs.reduce((sum, log) => sum + log.value, 0);
    const averageValue = totalDays > 0 ? totalValue / totalDays : 0;

    res.json({
      habit_id,
      period,
      total_days: totalDays,
      completed_days: completedDays,
      completion_rate: completionRate.toFixed(2),
      total_value: totalValue,
      average_value: averageValue.toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}

// Get overall analytics
export function getOverview(req, res) {
  try {
    const today = getTodayDate();
    const habits = query('SELECT id FROM habits WHERE is_active = 1');
    const totalHabits = habits.length;

    // Today's completion
    const todayLogs = query(
      'SELECT completed FROM habit_logs WHERE date = ?',
      [today]
    );
    const todayCompleted = todayLogs.filter(log => log.completed).length;
    const todayCompletionRate = totalHabits > 0 ? (todayCompleted / totalHabits) * 100 : 0;

    // Week's completion
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const weekLogs = query(
      'SELECT completed FROM habit_logs WHERE date >= ?',
      [weekAgoStr]
    );
    const weekCompleted = weekLogs.filter(log => log.completed).length;
    const weekTotal = totalHabits * 7;
    const weekCompletionRate = weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0;

    // Total streaks
    let totalStreaks = 0;
    habits.forEach(habit => {
      totalStreaks += calculateStreak(habit.id);
    });

    res.json({
      total_habits: totalHabits,
      today_completion_rate: todayCompletionRate.toFixed(2),
      week_completion_rate: weekCompletionRate.toFixed(2),
      total_streaks: totalStreaks
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
}

// Get calendar data for a month
export function getCalendarData(req, res) {
  try {
    const { month } = req.params; // Format: YYYY-MM

    const startDate = `${month}-01`;
    const endDate = new Date(month + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    const endDateStr = endDate.toISOString().split('T')[0];

    const totalHabits = query('SELECT COUNT(*) as count FROM habits WHERE is_active = 1')[0].count;

    const logs = query(
      'SELECT date, COUNT(CASE WHEN completed = 1 THEN 1 END) as completed FROM habit_logs WHERE date >= ? AND date < ? GROUP BY date',
      [startDate, endDateStr]
    );

    const calendarData = logs.map(log => ({
      date: log.date,
      habits_completed: log.completed,
      total_habits: totalHabits
    }));

    res.json(calendarData);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
}
