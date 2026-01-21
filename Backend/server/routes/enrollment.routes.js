import express from 'express';
const router = express.Router();
import { handleEnrollment, getMyEnrollments } from '../controllers/enrollment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

// POST /api/enrollments - Join a course
router.post('/', protect, handleEnrollment);

// GET /api/enrollments/my-courses - Student dashboard
router.get('/my-courses', protect, getMyEnrollments);

export default router;
