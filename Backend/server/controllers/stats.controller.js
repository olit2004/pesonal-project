import * as StatsService from '../services/stats.service.js';

export const getAdminDashboardStats = async (req, res) => {
    try {
        // Double check role even if middleware handles it
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const stats = await StatsService.getAdminStats();

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all stats for the student dashboard
 * @route   GET /api/stats/student
 * @access  Private (Student/Admin)
 */
export const getStudentDashboardStats = async (req, res) => {
    try {
        // req.user is populated by your 'protect' middleware
        const userId = req.user.id;

        const stats = await StatsService.getStudentStats(userId);

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve student statistics',
            error: error.message,
        });
    }
};
