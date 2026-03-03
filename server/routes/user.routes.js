import express from 'express';
import {
    getUsers,
    getMe,
    getUserById,
    adminUpdateUser,
    updateMe,
    deleteMe,
    adminDeleteUser,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (Filtered by role if query param provided)
 * @access  Private (Admin only)
 */
router.get('/', protect, authorize('ADMIN'), getUsers);

/**
 * @route   GET /api/users/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user's profile info or password
 * @access  Private
 */
router.patch('/me', protect, updateMe);

/**
 * @route   DELETE /api/users/me
 * @desc    Self-deletion of account
 * @access  Private
 */
router.delete('/me', protect, deleteMe);

/**
 * @route   GET /api/users/:id
 * @desc    Get a specific user's details and enrollments
 * @access  Private (Admin only)
 */
router.get('/:id', protect, authorize('ADMIN'), getUserById);

/**
 * @route   PATCH /api/users/:id
 * @desc    Update any user field (e.g., promote a student to ADMIN)
 * @access  Private (Admin only)
 */
router.patch('/:id', protect, authorize('ADMIN'), adminUpdateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a specific user account
 * @access  Private (Admin only)
 */
router.delete('/:id', protect, authorize('ADMIN'), adminDeleteUser);

export default router;
