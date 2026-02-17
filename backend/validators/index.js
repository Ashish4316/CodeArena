import { body, param, query, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler.js';

/**
 * Validation result handler
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(err => err.msg).join(', ');
        return next(new AppError(messages, 400));
    }
    next();
};

/**
 * User registration validation
 */
export const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    validate
];

/**
 * User login validation
 */
export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Please provide a password'),
    validate
];

/**
 * Profile update validation
 */
export const profileUpdateValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    body('handles.leetcode')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    body('handles.github')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    body('handles.codeforces')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    body('handles.codolio')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    validate
];

/**
 * Progress update validation
 */
export const progressValidation = [
    body('questionId')
        .notEmpty()
        .withMessage('Question ID is required'),
    body('solved')
        .isBoolean()
        .withMessage('Solved must be a boolean'),
    body('difficulty')
        .optional()
        .isIn(['Easy', 'Medium', 'Hard'])
        .withMessage('Invalid difficulty'),
    validate
];

/**
 * Sheet creation validation
 */
export const sheetValidation = [
    body('name')
        .notEmpty()
        .withMessage('Sheet name is required')
        .trim()
        .isLength({ max: 100 })
        .withMessage('Sheet name cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('topics')
        .isArray()
        .withMessage('Topics must be an array'),
    body('topics.*.topic')
        .notEmpty()
        .withMessage('Topic name is required'),
    body('topics.*.questions')
        .isArray()
        .withMessage('Questions must be an array'),
    validate
];

/**
 * Note validation
 */
export const noteValidation = [
    body('questionId')
        .notEmpty()
        .withMessage('Question ID is required'),
    body('sheetSlug')
        .notEmpty()
        .withMessage('Sheet slug is required'),
    body('content')
        .optional()
        .isLength({ max: 10000 })
        .withMessage('Note cannot exceed 10000 characters'),
    validate
];

/**
 * Pagination validation
 */
export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validate
];

/**
 * MongoDB ObjectId validation
 */
export const objectIdValidation = (paramName = 'id') => [
    param(paramName)
        .isMongoId()
        .withMessage(`Invalid ${paramName}`),
    validate
];
