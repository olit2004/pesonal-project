import * as AuthService from '../services/auth.service.js';
import { setToken, removeToken } from '../lib/token.js';

export const register = async (req, res) => {
    try {
        const newUser = await AuthService.registerUser(req.body);

        // 2. Set authentication cookies immediately after registration
        setToken(res, { id: newUser.id, role: newUser.role });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: newUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate credentials through service
        const user = await AuthService.loginUser(email, password);

        // 2. Use your utility to set 'token' and 'rft' cookies
        setToken(res, { id: user.id, role: user.role });

        // 3. Final response
        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.firstName}`,
            user,
        });
    } catch (error) {
        // 401 Unauthorized for login failures
        res.status(401).json({
            success: false,
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        // 1. Overwrite the 'token' and 'rft' cookies via your utility
        removeToken(res);

        // 2. Respond to the client
        res.status(200).json({
            success: true,
            message: 'Logged out successfully. See you soon!',
        });
    } catch (error) {
        // In the rare case of a server error during logout
        res.status(500).json({
            success: false,
            error: 'An error occurred during logout',
        });
    }
};

export const refresh = async (req, res) => {
    console.log('Inside refresh controller');
    try {
        // 1. Extract the 'rft' cookie
        const refreshToken = req.cookies.rft;

        // 2. Validate and get user info
        const user = await AuthService.refreshSession(refreshToken);


        setToken(res, { id: user.id, role: user.role });

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {

        removeToken(res);
        res.status(401).json({ success: false, error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        await AuthService.forgotPassword(email);

        res.status(200).json({
            success: true,
            message: 'A reset link has been sent to your email address.',
        });
    } catch (error) {
        // We log the real error for debugging but send a generic message for security
        console.error('Forgot Password Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res
                .status(400)
                .json({ success: false, message: 'Please provide a new password.' });
        }

        await AuthService.resetPassword(token, password);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully! You can now log in with your new credentials.',
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
