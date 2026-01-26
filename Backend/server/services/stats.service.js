import { prisma } from '../lib/prisma.js';




export const getAdminStats = async () => {
    // 1. Calculate Total Revenue and Total Enrollments
    const enrollmentStats = await prisma.enrollment.aggregate({
        _sum: { amountPaid: true },
        _count: { id: true },
    });

    // 2. Count Users by Role and Total Courses
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalCourses = await prisma.course.count();

    // 3. Top Selling Courses (Popularity)
    // We fetch courses and include a count of their enrollments
    const topCourses = await prisma.course.findMany({
        take: 5,
        select: {
            id: true,
            title: true,
            price: true,
            _count: { select: { enrollments: true } },
        },
        orderBy: {
            enrollments: { _count: 'desc' },
        },
    });

    // 4. Recent Sales (Feed)
    const recentSales = await prisma.enrollment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            course: { select: { title: true } },
        },
    });

    return {
        totalRevenue: enrollmentStats._sum.amountPaid || 0,
        totalSales: enrollmentStats._count.id,
        totalStudents,
        totalCourses,
        topCourses: topCourses.map((c) => ({
            id: c.id,
            title: c.title,
            salesCount: c._count.enrollments,
            revenue: c._count.enrollments * c.price,
        })),
        recentSales,
    };
};



export const getStudentStats = async (userId) => {
    // 1. Fetch all enrollments with their nested lessons
    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                select: {
                    id: true,
                    title: true,
                    thumbnailUrl: true,
                    modules: {
                        include: {
                            lessons: { select: { id: true } },
                        },
                    },
                },
            },
        },
    });

    // 2. Fetch all completed lessons for this user
    const completedLessons = await prisma.lessonProgress.findMany({
        where: { userId, isCompleted: true },
        select: { lessonId: true },
    });

    const completedIds = new Set(completedLessons.map((lp) => lp.lessonId));

    // 3. Process each course to calculate individual progress
    const courseStats = enrollments.map((en) => {
        const allLessons = en.course.modules.flatMap((m) => m.lessons);
        const totalLessons = allLessons.length;
        const finishedCount = allLessons.filter((l) => completedIds.has(l.id)).length;

        return {
            courseId: en.course.id,
            title: en.course.title,
            thumbnailUrl: en.course.thumbnailUrl,
            completedLessons: finishedCount,
            totalLessons: totalLessons,
            percentage: totalLessons === 0 ? 0 : Math.round((finishedCount / totalLessons) * 100),
        };
    });

    // 4. Aggregate Global Stats
    const totalCourses = courseStats.length;
    const overallCompletion =
        totalCourses === 0
            ? 0
            : Math.round(courseStats.reduce((acc, c) => acc + c.percentage, 0) / totalCourses);

    return {
        overallCompletion, // Average progress across all courses
        activeCourses: totalCourses,
        completedCourses: courseStats.filter((c) => c.percentage === 100).length,
        courses: courseStats, // Detailed list for the dashboard cards
    };
};
