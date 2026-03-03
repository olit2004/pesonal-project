import * as EnrollmentService from '../services/enrollment.service.js';

export const handleEnrollment = async (req, res) => {
    try {
        const { courseId } = req.body;
        const enrollment = await EnrollmentService.enrollStudent(req.user.id, courseId);

        res.status(201).json({
            success: true,
            message: 'Enrollment successful',
            data: enrollment,
        });
    } catch (error) {
        // Handle unique constraint error (P2002) if student tries to buy twice
        if (error.code === 'P2002') {
            return res.status(400).json({ success: false, message: 'Already enrolled.' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getMyEnrollments = async (req, res) => {
    try {
        const data = await EnrollmentService.fetchMyEnrollments(req.user.id);
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
