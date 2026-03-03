import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../lib/auth.js';

/**
 * Fetch all users (Admin only)
 * Optional: can still filter by role (STUDENT or ADMIN)
 */
export const fetchUsers = async (roleFilter) => {
    const query = {};
    if (roleFilter) {
        query.role = roleFilter.toUpperCase();
    }

    return await prisma.user.findMany({
        where: query,
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

/**
 * Fetch a single user by ID with their course enrollments
 */
export const fetchUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            enrollments: {
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            thumbnailUrl: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

/**
 * Update user profile or password
 */
export const updateUser = async (userId, updateData) => {
    if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
    }

    return await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    });
};

/**
 * Delete a user account (Self-delete or Admin-delete)
 */
export const deleteUserAccount = async (userId) => {
    return await prisma.user.delete({
        where: { id: userId },
    });
};
