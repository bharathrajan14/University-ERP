const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────
//  AUTHENTICATION MIDDLEWARE (protect)
//  Verifies the JWT token from the Authorization header, checks user
//  status in MongoDB, and attaches the user object to req.user.
// ─────────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Extract token from header ("Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token signature and expiration using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from database by ID (password is excluded by default in User model)
      req.user = await User.findById(decoded.id);

      // 4. Verify user exists in DB
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      // 5. Check if user account is deactivated
      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated. Please contact administrator.',
        });
      }

      // Proceed to the next middleware or controller action
      return next();
    } catch (error) {
      console.error('[authMiddleware] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token verification failed or token expired',
      });
    }
  }

  // If no token was sent in headers
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided in Authorization header',
    });
  }
};

// ─────────────────────────────────────────────────────────────────
//  AUTHORIZATION MIDDLEWARE (authorize)
//  Restricts access to specific user roles (e.g. 'admin', 'faculty')
//  Usage: router.get('/admin-dashboard', protect, authorize('admin'), controller)
// ─────────────────────────────────────────────────────────────────
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`,
      });
    }
    return next();
  };
};

module.exports = { protect, authorize };
