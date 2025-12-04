/**
 * Express middleware for authentication and security
 */

const auth = require('./auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many contact form submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication middleware
async function requireAuth(req, res, next) {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId || (req.body && req.body.sessionId);

  if (!sessionId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const user = await auth.verifySession(sessionId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session'
    });
  }

  req.user = user;
  req.sessionId = sessionId;
  next();
}

// Admin only middleware
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}

module.exports = {
  contactLimiter,
  loginLimiter,
  requireAuth,
  requireAdmin
};

