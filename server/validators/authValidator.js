const { body, validationResult } = require('express-validator');

// Validation rules for registration
const registerRules = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Full name must be between 3 and 100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('role')
        .optional()
        .isIn(['student', 'faculty', 'admin', 'department_head'])
        .withMessage('Invalid user role'),
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department name cannot exceed 100 characters')
];

// Validation rules for login
const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Middleware to capture and return validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
    }
    next();
};

module.exports = {
    registerRules,
    loginRules,
    validate
};
