import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';
import { AppError } from '../utils/errorHandler.js';

/**
 * Protect routes - Authentication required
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check for token in cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwtSecret);

            // Get user from token
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(new AppError('User not found', 401));
            }

            if (!user.isActive) {
                return next(new AppError('User account is deactivated', 401));
            }

            req.user = user;
            next();
        } catch (err) {
            return next(new AppError('Not authorized to access this route', 401));
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, config.jwtSecret);
                const user = await User.findById(decoded.id);
                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (err) {
                // Token invalid, but continue without user
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Role-based authorization
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError(`User role '${req.user.role}' is not authorized`, 403));
        }

        next();
    };
};

/**
 * Check resource ownership
 */
export const checkOwnership = (model, paramName = 'id', ownerField = 'user') => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[paramName];
            const resource = await model.findById(resourceId);

            if (!resource) {
                return next(new AppError('Resource not found', 404));
            }

            // Admin can access everything
            if (req.user.role === 'admin') {
                req.resource = resource;
                return next();
            }

            // Check ownership
            if (resource[ownerField].toString() !== req.user._id.toString()) {
                return next(new AppError('Not authorized to access this resource', 403));
            }

            req.resource = resource;
            next();
        } catch (error) {
            next(error);
        }
    };
};
