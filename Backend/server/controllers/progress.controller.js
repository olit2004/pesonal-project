import * as ProgressService from '../services/progress.service.js';

export const toggleLessonProgress = async (req, res) => {
    try {
        // Now extracting everything from the body as requested
        const { courseId, lessonId, isCompleted } = req.body;
        const userId = req.user.id;

        // Simple validation to ensure all fields are present
        if (!courseId || !lessonId || isCompleted === undefined) {
            return res.status(400).json({
                success: false,
                message: 'courseId, lessonId, and isCompleted are required in the body.',
            });
        }

        const progressStats = await ProgressService.updateAndGetProgress(
            userId,
            courseId,
            lessonId,
            isCompleted,
        );

        res.status(200).json({
            success: true,
            message: 'Progress updated successfully',
            data: progressStats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
