-- Habits Table
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  target_value INTEGER,
  target_unit TEXT,
  icon TEXT,
  color TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1
);

-- Habit Logs Table
CREATE TABLE IF NOT EXISTS habit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT 0,
  value INTEGER DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
  UNIQUE(habit_id, date)
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert default habits for Akash
INSERT INTO habits (name, description, target_value, target_unit, icon, color) VALUES
('Coding Practice', 'Practice coding for 2 hours daily', 120, 'minutes', 'Code', '#4f46e5'),
('Jogging / Exercise', 'Daily physical exercise', 1, 'boolean', 'Activity', '#10b981'),
('Eating 2 Amla', 'Eat 2 Amla fruits for health', 2, 'count', 'Apple', '#f59e0b'),
('Course Progress', 'Learn new skills and complete courses', 1, 'boolean', 'BookOpen', '#8b5cf6');
