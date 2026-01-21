import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../lib/email.js';
import { hashPassword } from '../lib/auth.js';

export const registerUser = async (userData) => {
    const { email, password, firstName, lastName, role } = userData;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'STUDENT',
        },

        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    });
};

export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const refreshSession = async (refreshToken) => {
    console.log('Inside refresh service.');
    if (!refreshToken) throw new Error('Refresh token missing');

    try {
        // 1. Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // 2. Fetch user from DB to ensure they still exist/aren't banned
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, role: true, firstName: true },
        });

        if (!user) throw new Error('User no longer exists');

        return user;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

export const forgotPassword = async (email) => {
    // 1. Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('If a user with that email exists, a reset link has been sent.');

    // 2. Create a random reset token (to send in email)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Hash the token (to store in DB) and set expiry (15 mins)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // 4. Save to Database
    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: hashedToken,
            passwordResetExpires: tokenExpiry,
        },
    });

    // 5. Construct Email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const htmlMessage = `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Please click the link below to reset your password. This link is valid for 15 minutes.</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message: `Reset your password here: ${resetUrl}`,
            html: htmlMessage,
        });
    } catch (error) {
        // If email fails, clear the DB fields so token isn't sitting there
        await prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken: null, passwordResetExpires: null },
        });
        throw new Error('Email could not be sent. Please try again later.');
    }
};

export const resetPassword = async (token, newPassword) => {
    // 1. Hash the token from the URL (to compare it with the DB version)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Find the user with the matching token AND ensure it hasn't expired
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: hashedToken,
            passwordResetExpires: { gt: new Date() }, // gt = Greater Than (Current Time)
        },
    });

    if (!user) {
        throw new Error('Token is invalid or has expired');
    }

    // 3. Hash the new password

    const passwordHash = await hashPassword(newPassword);

    // 4. Update the user and CLEAR the reset fields
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: passwordHash,
            resetPasswordToken: null,
            passwordResetExpires: null,
        },
    });

    return user;
};
