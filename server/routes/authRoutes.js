// express.Router() creates a mini Express app that handles
// only routes starting with the prefix we assign in index.js.
// This keeps all auth-related routes in one file.
const express = require('express');
const router  = express.Router();

// Import both controller functions from the single auth controller.
const { registerUser, loginUser, getMe } = require('../controllers/authController');

// Import both validator arrays from the single auth validator.
const { registerValidator, loginValidator } = require('../validators/authValidator');

// Import authentication middleware
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/register
//  Public — creates a new user account
// ─────────────────────────────────────────────────────────────────
router.post('/register', registerValidator, registerUser);

// ─────────────────────────────────────────────────────────────────
//  POST /api/auth/login
//  Public — verifies credentials, returns a JWT token
//
//  Request flow:
//    1. loginValidator checks email format and password presence
//    2. loginUser finds the user, compares bcrypt hash, signs JWT
//    3. Token + user data returned as JSON
// ─────────────────────────────────────────────────────────────────
router.post('/login', loginValidator, loginUser);

// ─────────────────────────────────────────────────────────────────
//  GET /api/auth/me
//  Private — retrieves details of currently logged-in user
// ─────────────────────────────────────────────────────────────────
router.get('/me', protect, getMe);

module.exports = router;

