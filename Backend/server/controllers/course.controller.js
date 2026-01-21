import * as CourseService from '../services/course.service.js';

export const createCourseWithSyllabus = async (req, res) => {
    try {
        const fullCourse = await CourseService.createFullCourse(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: 'Course created and published by Admin.',
            data: fullCourse,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        // 1. Extract query parameters
        const { status, search } = req.query;

        // 2. Security Logic: Determine the "Visible" status
        // Students/Guests can ONLY see Published. Admins can see anything they request.
        let targetStatus = 'PUBLISHED';
        if (req.user && req.user.role === 'ADMIN' && status) {
            targetStatus = status;
        }

        // 3. Combine filters into a single object for the service
        const filters = {
            status: targetStatus,
            search: search || '', // Pass empty string if no search term
        };

        const courses = await CourseService.fetchCourses(filters);

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving courses',
            error: error.message,
        });
    }
};

export const changeCourseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PUBLISHED', 'ARCHIVED']; // Removed PENDING_REVIEW
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status required: PUBLISHED or ARCHIVED',
            });
        }

        const updatedCourse = await CourseService.updateCourseStatus(id, status);
        res.status(200).json({
            success: true,
            message: `Course status updated to ${status}`,
            data: updatedCourse,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const userRole = req.user ? req.user.role : 'GUEST';

        const course = await CourseService.fetchCourseById(req.params.id, userId, userRole);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeCourse = async (req, res) => {
    try {
        await CourseService.deleteCourse(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
