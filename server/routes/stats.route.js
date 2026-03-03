import express from 'express';
import { getStudentDashboardStats, getAdminDashboardStats } from '../controllers/stats.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// We use 'protect' to ensure we have a valid userId in req.user
router.get('/student', protect, getStudentDashboardStats);
router.get('/admin', protect, authorize('ADMIN'), getAdminDashboardStats);
export default router;
