import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    try {
        // 1. Grab the access token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in.',
            });
        }

        // 2. Verify using the CAPITALIZED secret
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 3. Attach payload to request
        // Decoded usually contains { id, role, iat, exp }
        req.user = decoded;

        next();
    } catch (error) {
        // If token is expired or invalid
        return res.status(401).json({
            success: false,
            message: 'Session expired or invalid token',
            error: error.message,
        });
    }
};

/**
 * Middleware that allows request to proceed even if token is missing or invalid.
 * If a valid token is present, req.user is populated.
 */
export const optionalProtect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
        }
    } catch (error) {
        // Ignore errors for optional authentication
    }
    next();
};

/**
 * Middleware to restrict access based on user roles
 * Usage: authorize('INSTRUCTOR', 'ADMIN')
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Role '${req.user.role}' is not authorized.`,
            });
        }
        next();
    };
};
