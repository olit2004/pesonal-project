import express from 'express';
const router = express.Router();
import { toggleLessonProgress } from '../controllers/progress.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

/**
 * @route   PATCH /api/progress
 * @desc    Toggle lesson completion via body data
 * @access  Private
 */
router.patch('/', protect, toggleLessonProgress);

export default router;
