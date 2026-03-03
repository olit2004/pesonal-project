import { prisma } from '../lib/prisma.js';

// Create a new enrollment
export const enrollStudent = async (userId, courseId) => {
    // 1. Business Rule: Ensure the course is actually PUBLISHED
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course || course.status !== 'PUBLISHED') {
        throw new Error('This course is not available for enrollment.');
    }

    // 2. Create record (@@unique in schema handles duplicate prevention)
    return await prisma.enrollment.create({
        data: { userId, courseId },
        include: {
            course: {
                select: { title: true, thumbnailUrl: true },
            },
        },
    });
};

// Fetch all courses a student is enrolled in
export const fetchMyEnrollments = async (userId) => {
    return await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    instructor: { select: { firstName: true, lastName: true } },
                    _count: { select: { modules: true } },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};
