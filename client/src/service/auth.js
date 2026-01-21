import api from "./api";

export const forgotPassword = async (email) => {
    try {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const resetPassword = async (token, password) => {
    try {
        const response = await api.patch(`/auth/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
