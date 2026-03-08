import { prisma } from '../lib/prisma.js';
import { stripe } from '../lib/stripe.js';

export const createCheckoutSession = async (courseId, userId) => {
    // 1. Fetch data
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!course) throw new Error('Course not found');

    // 2. Upsert Stripe Customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            metadata: { userId: user.id },
        });

        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customer.id },
        });
        customerId = customer.id;
    }

    // 3. Generate Session
    console.log(`[Stripe] Creating session for Course: ${course.title} ($${course.price})`);

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: course.title,
                        images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
                        metadata: { courseId: course.id }
                    },
                    unit_amount: Math.round(course.price * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/dashboard/course/${courseId}?success=true`,
        cancel_url: `${process.env.CLIENT_URL}/dashboard/course/${courseId}`,
        metadata: {
            userId: String(userId),
            courseId: String(courseId)
        },
    });

    console.log(`[Stripe] Created session: ${session.id}. Success URL: ${process.env.CLIENT_URL}/dashboard/course/${courseId}?success=true`);
    return session;
};

export const fulfillEnrollment = async (session) => {
    const { userId, courseId } = session.metadata;
    console.log(`[Fulfillment] Attempting to enroll User: ${userId} in Course: ${courseId}`);

    if (!userId || !courseId) {
        throw new Error('Missing metadata in successful session');
    }

    return await prisma.enrollment.create({
        data: {
            userId,
            courseId,
            stripeSessionId: session.id,
            amountPaid: session.amount_total / 100,
            paymentStatus: 'COMPLETED',
        },
    });
};

export const verifyAndFulfill = async (userId, courseId) => {
    console.log(`[Verification] Checking Payment for User: ${userId}, Course: ${courseId}`);

    // 1. Check if enrollment already exists
    const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
        console.log('[Verification] Enrollment already exists.');
        return existing;
    }

    // 2. Fetch user to get Customer ID
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) {
        console.error('[Verification] User has no Stripe Customer ID.');
        throw new Error('No checkout session found for this user.');
    }

    // 3. List recent sessions for this customer
    console.log(`[Verification] Listing sessions for Customer: ${user.stripeCustomerId}`);
    const sessions = await stripe.checkout.sessions.list({
        customer: user.stripeCustomerId,
        limit: 15,
    });

    console.log(`[Verification] Found ${sessions.data.length} sessions for customer.`);

    // 4. Find a paid session for this specific course
    const successfulSession = sessions.data.find(
        (s) => {
            // Ensure we are comparing strings and handling potential undefineds
            const sessionCourseId = String(s.metadata?.courseId || '');
            const targetCourseId = String(courseId || '');

            const isMatch = sessionCourseId === targetCourseId && s.payment_status === 'paid';

            if (s.payment_status === 'paid') {
                console.log(`[Verification] Checked paid session ${s.id}: Metadata CourseID(${sessionCourseId}) vs Requested(${targetCourseId}) -> Match: ${isMatch}`);
            }
            return isMatch;
        }
    );

    if (!successfulSession) {
        console.error(`[Verification] No successful session matched for Course: ${courseId}`);
        throw new Error('Payment not yet verified by Stripe. If you were charged, please wait a moment and refresh.');
    }

    // 5. Success! Manually trigger fulfillment
    console.log(`[Verification] Successful session found: ${successfulSession.id}! Triggering fulfillment...`);
    return await fulfillEnrollment(successfulSession);
};

