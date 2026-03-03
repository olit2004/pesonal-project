import { prisma } from '../lib/prisma.js';

/**
 * Toggles lesson completion and returns updated course progress.
 */
export const updateAndGetProgress = async (userId, courseId, lessonId, isCompleted) => {
    // 1. Update or Create the progress record for THIS specific user and lesson
    await prisma.lessonProgress.upsert({
        where: {
            userId_lessonId: { userId, lessonId },
        },
        update: { isCompleted },
        create: { userId, lessonId, isCompleted },
    });

    // 2. Fetch all lesson IDs belonging to this course to calculate the total
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                include: { lessons: { select: { id: true } } },
            },
        },
    });

    if (!course) throw new Error('Course not found');

    // Flatten the modules to get a list of all lesson IDs in the course
    const allCourseLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const totalLessons = allCourseLessonIds.length;

    // 3. Count how many of those lessons THIS user has completed
    const completedCount = await prisma.lessonProgress.count({
        where: {
            userId,
            isCompleted: true,
            lessonId: { in: allCourseLessonIds },
        },
    });

    // 4. Calculate Percentage
    const percentage = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

    return {
        percentage,
        completedCount,
        totalLessons,
    };
};
