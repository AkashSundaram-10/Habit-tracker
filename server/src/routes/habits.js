import express from 'express';
import {
  getAllHabits,
  getHabitById,
  createHabit,
  updateHabit,
  deleteHabit
} from '../controllers/habitController.js';

const router = express.Router();

router.get('/', getAllHabits);
router.get('/:id', getHabitById);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);

export default router;
