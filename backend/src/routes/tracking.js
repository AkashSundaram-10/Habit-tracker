import express from 'express';
import {
  getTodayHabits,
  getHabitsByDate,
  completeHabit,
  toggleHabit,
  getStreak,
  getHabitStats,
  getOverview,
  getCalendarData
} from '../controllers/trackingController.js';

const router = express.Router();

// Tracking routes
router.get('/today', getTodayHabits);
router.get('/date/:date', getHabitsByDate);
router.post('/complete', completeHabit);
router.post('/toggle', toggleHabit);
router.get('/streak/:habit_id', getStreak);
router.get('/stats/:habit_id', getHabitStats);

// Analytics routes
router.get('/analytics/overview', getOverview);
router.get('/analytics/calendar/:month', getCalendarData);

export default router;
