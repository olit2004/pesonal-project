import { stripe } from '../lib/stripe.js';
import * as PaymentService from '../services/payment.service.js';


export const createCheckoutSession = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id; // From protect middleware

        console.log(`[Controller] Initiating checkout session for courseId: ${courseId}, userId: ${userId}`);
        const session = await PaymentService.createCheckoutSession(courseId, userId);

        res.status(200).json({
            success: true,
            url: session.url, 
        });
    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyPaymentSession = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const result = await PaymentService.verifyAndFulfill(userId, courseId);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
