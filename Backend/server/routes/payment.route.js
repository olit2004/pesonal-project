import express from 'express';
import { createCheckoutSession, verifyPaymentSession } from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Only keep the standard JSON routes here
router.post('/create-checkout', protect, createCheckoutSession);
router.post('/verify-session', protect, verifyPaymentSession);

export default router;