import { Router } from 'express';
import {
    register,
    login,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refresh);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
export default router;
