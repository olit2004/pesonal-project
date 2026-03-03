import { prisma } from '../lib/prisma.js';

export const createFullCourse = async (courseData, adminId) => {
    const { title, description, price, thumbnailUrl, modules } = courseData;

    return await prisma.course.create({
        data: {
            title,
            description,
            price: parseFloat(price) || 0,
            thumbnailUrl,
            adminId,
            status: 'PUBLISHED',
            // NESTED TRANSACTION STARTS HERE
            modules: {
                create: modules.map((module) => ({
                    title: module.title,
                    order: module.order,
                    lessons: {
                        create: module.lessons.map((lesson) => ({
                            title: lesson.title,
                            videoUrl: lesson.videoUrl,
                            content: lesson.content,
                            order: lesson.order,
                            isFree: lesson.isFree || false,
                        })),
                    },
                })),
            },
        },
        include: {
            modules: {
                include: { lessons: true },
            },
        },
    });
};

export const fetchCourses = async (filters) => {
    const { status, search } = filters || {};

    // 1. Construct the 'where' clause dynamically
    const where = {};

    // 2. Status filtering (Marketplace usually shows PUBLISHED, but Admin can see others)
    if (status) {
        where.status = status;
    } else {
        where.status = 'PUBLISHED';
    }

    // 3. Add Search functionality (Title search)
    if (search) {
        where.title = {
            contains: search,
            mode: 'insensitive', // Search is not case-sensitive
        };
    }

    return await prisma.course.findMany({
        where: where,
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true,
            thumbnailUrl: true,
            createdAt: true,
            createdBy: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            _count: {
                select: {
                    modules: true,
                    enrollments: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const deleteCourse = async (courseId) => {
    return await prisma.course.delete({
        where: { id: courseId },
    });
};

export const updateCourseStatus = async (courseId, status) => {
    return await prisma.course.update({
        where: { id: courseId },
        data: { status },
        select: {
            id: true,
            title: true,
            status: true,
            updatedAt: true,
        },
    });
};

export const fetchCourseById = async (courseId, userId, userRole) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            createdBy: {
                // Changed from instructor to match your schema
                select: { firstName: true, lastName: true },
            },
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: {
                        orderBy: { order: 'asc' },
                        include: {
                            // FETCH PROGRESS: Only for this specific student if logged in
                            lessonProgress: userId ? {
                                where: { userId: userId },
                                select: { isCompleted: true },
                            } : false,
                        },
                    },
                },
            },
            enrollments: userId ? {
                where: { userId: userId },
                select: { id: true },
            } : false,
        },
    });

    if (!course) return null;

    const isEnrolled = course.enrollments ? course.enrollments.length > 0 : false;
    const isAdmin = userRole === 'ADMIN';

    // Process Modules and Lessons
    course.modules = course.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => {
            // 1. Extract completion status (if logged in)
            const completed =
                lesson.lessonProgress && lesson.lessonProgress.length > 0 ? lesson.lessonProgress[0].isCompleted : false;

            // 2. Clean up the lesson object by removing the raw array
            const { lessonProgress, ...lessonData } = lesson;

            // 3. If the user is authorized (Enrolled or Admin), show everything + progress
            if (isEnrolled || isAdmin) {
                return {
                    ...lessonData,
                    isCompleted: completed,
                };
            }

            // 4. If NOT enrolled, handle the "Gate" (Free vs Locked)
            if (lesson.isFree) {
                return { ...lessonData, isCompleted: completed };
            }

            return {
                id: lesson.id,
                title: lesson.title,
                order: lesson.order,
                isFree: false,
                isCompleted: false,
                videoUrl: null,
                content: 'Locked Content',
            };
        }),
    }));

    delete course.enrollments;
    course.isUserEnrolled = isEnrolled;

    return course;
};
