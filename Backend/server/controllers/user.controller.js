import * as UserService from '../services/user.service.js';

// GET all users (Admin only)
export const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const users = await UserService.fetchUsers(role);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
};

// GET single user by ID (Admin only)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.fetchUserById(id);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

// GET current logged-in user profile
export const getMe = async (req, res) => {
    try {
        const user = await UserService.fetchUserById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: 'Could not retrieve profile.',
        });
    }
};

// ADMIN: Update any field for any user
export const adminUpdateUser = async (req, res) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// USER: Update own safe fields (Role is protected)
export const updateMe = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        // REMOVED: instructorBio from safeData to match new schema
        const safeData = { firstName, lastName, password };

        const user = await UserService.updateUser(req.user.id, safeData);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ADMIN: Delete any user
export const adminDeleteUser = async (req, res) => {
    try {
        await UserService.deleteUserAccount(req.params.id);
        res.status(200).json({ success: true, message: 'User deleted by admin' });
    } catch (error) {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

// USER: Delete own account
export const deleteMe = async (req, res) => {
    try {
        await UserService.deleteUserAccount(req.user.id);
        res.clearCookie('token'); // Logout user after deletion
        res.status(200).json({ success: true, message: 'Your account has been deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
