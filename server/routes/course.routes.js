import express from 'express';
import {
    createCourseWithSyllabus,
    getCourses,
    getCourseById,
    changeCourseStatus,
    removeCourse,
} from '../controllers/course.controller.js';
import { protect, optionalProtect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ADMIN ONLY: Create a course and its full syllabus
router.post('/', protect, authorize('ADMIN'), createCourseWithSyllabus);

// PUBLIC/STUDENT: View published courses (Admin can view archived via query)
router.get('/', optionalProtect, getCourses);

// PUBLIC/STUDENT: View specific course details
router.get('/:id', optionalProtect, getCourseById);

// ADMIN ONLY: Change status (e.g., ARCHIVED)
router.patch('/:id/status', protect, authorize('ADMIN'), changeCourseStatus);

// ADMIN ONLY: Delete course
router.delete('/:id', protect, authorize('ADMIN'), removeCourse);

export default router;
