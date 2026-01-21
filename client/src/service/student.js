import api from "./api";

export const getStudentStats = async () => {
    try {
        const response = await api.get("/stats/student");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getExploreCourses = async () => {
    try {
        const response = await api.get("/courses");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createCheckoutSession = async (courseId) => {
    try {
        const response = await api.post("/payment/create-checkout", { courseId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const verifyPaymentSession = async (courseId) => {
    try {
        const response = await api.post("/payment/verify-session", { courseId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateLessonProgress = async (courseId, lessonId, isCompleted) => {
    try {
        const response = await api.patch("/progress", {
            courseId,
            lessonId,
            isCompleted
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
