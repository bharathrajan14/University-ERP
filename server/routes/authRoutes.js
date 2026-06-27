// ─────────────────────────────────────────────────────────────────
//  WHAT IS express.Router()?
//
//  Think of the main Express app (in server.js) as a city.
//  Router() creates a self-contained neighbourhood inside that city.
//
//  In server.js you mount this router at a prefix:
//    app.use('/api/auth', authRouter);
//
//  Every route defined HERE then gets that prefix automatically:
//    router.post('/register') → handles POST /api/auth/register
//    router.post('/login')    → handles POST /api/auth/login
//    router.get('/profile')   → handles GET  /api/auth/profile
//    router.put('/profile')   → handles PUT  /api/auth/profile
// ─────────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();

// Import controllers from the single auth controller file.
const {
  registerUser,   // POST /register  — creates a new account
  loginUser,      // POST /login     — verifies credentials, issues JWT
  getProfile,     // GET  /profile   — returns the logged-in user's data
  updateProfile,  // PUT  /profile   — updates fullName / department
  getMe,          // Alias for getProfile
} = require('../controllers/authController');

// Import authentication and authorization middleware
const { protect, authorize } = require('../middleware/authMiddleware');
const authorise = authorize; // Alias for British spelling compatibility

// Import validators
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} = require('../validators/authValidator');


// ═════════════════════════════════════════════════════════════════
//  ROUTE DEFINITIONS
// ═════════════════════════════════════════════════════════════════

// ── POST /api/auth/register ───────────────────────────────────────
// PUBLIC — Chain: registerValidator[] → registerUser
router.post('/register', registerValidator, registerUser);

// ── POST /api/auth/login ──────────────────────────────────────────
// PUBLIC — Chain: loginValidator[] → loginUser
router.post('/login', loginValidator, loginUser);

// ── GET /api/auth/profile (and /me for compatibility) ─────────────
// PRIVATE — Chain: protect → getProfile
router.get('/profile', protect, getProfile);
router.get('/me', protect, getMe);

// ── PUT /api/auth/profile ─────────────────────────────────────────
// PRIVATE — Chain: protect → updateProfileValidator[] → updateProfile
router.put('/profile', protect, updateProfileValidator, updateProfile);

module.exports = router;
