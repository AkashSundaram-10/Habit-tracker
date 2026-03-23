import { query, queryOne, execute, getLastInsertId } from '../database/db.js';

// Get all active habits
export function getAllHabits(req, res) {
  try {
    const habits = query(
      'SELECT id, name, description, target_value, target_unit, icon, color, created_at FROM habits WHERE is_active = 1 ORDER BY created_at'
    );
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
}

// Get single habit by ID
export function getHabitById(req, res) {
  try {
    const { id } = req.params;
    const habit = queryOne(
      'SELECT id, name, description, target_value, target_unit, icon, color, created_at FROM habits WHERE id = ? AND is_active = 1',
      [id]
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    console.error('Error fetching habit:', error);
    res.status(500).json({ error: 'Failed to fetch habit' });
  }
}

// Create new habit
export function createHabit(req, res) {
  try {
    const { name, description, target_value, target_unit, icon, color } = req.body;

    // Validation
    if (!name || !target_unit) {
      return res.status(400).json({ error: 'Name and target_unit are required' });
    }

    execute(
      'INSERT INTO habits (name, description, target_value, target_unit, icon, color) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || '', target_value || 1, target_unit, icon || 'Circle', color || '#6366f1']
    );

    const id = getLastInsertId();
    const newHabit = queryOne('SELECT * FROM habits WHERE id = ?', [id]);

    res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
}

// Update habit
export function updateHabit(req, res) {
  try {
    const { id } = req.params;
    const { name, description, target_value, target_unit, icon, color } = req.body;

    // Check if habit exists
    const existing = queryOne('SELECT id FROM habits WHERE id = ? AND is_active = 1', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    execute(
      'UPDATE habits SET name = ?, description = ?, target_value = ?, target_unit = ?, icon = ?, color = ? WHERE id = ?',
      [name, description, target_value, target_unit, icon, color, id]
    );

    const updated = queryOne('SELECT * FROM habits WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
}

// Delete habit (soft delete)
export function deleteHabit(req, res) {
  try {
    const { id } = req.params;

    const existing = queryOne('SELECT id FROM habits WHERE id = ? AND is_active = 1', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    execute('UPDATE habits SET is_active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
}
