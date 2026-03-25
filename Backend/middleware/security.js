// Enhanced Security Middleware
const rateLimit = require('express-rate-limit');
const { logger } = require('../utils');

// Enhanced rate limiting with IP tracking
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: {
      success: false,
      error: options.message || 'Too many requests, please try again later.',
      retryAfter: Math.ceil((options.windowMs || 15 * 60 * 1000) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    skipFailedRequests: options.skipFailedRequests || false,
    handler: (req, res) => {
      logger.security('Rate limit exceeded', {
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        userAgent: req.get('user-agent')
      });
      res.status(429).json({
        success: false,
        error: options.message || 'Too many requests, please try again later.',
        retryAfter: Math.ceil((options.windowMs || 15 * 60 * 1000) / 1000)
      });
    }
  });
};

// Strict rate limiter for sensitive operations
const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts. Please try again in 15 minutes.',
  skipSuccessfulRequests: true
});

// General API limiter
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again later.'
});

// Auth endpoints limiter
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
  skipSuccessfulRequests: true
});

// Request size limiter middleware
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    logger.security('Request too large', {
      ip: req.ip,
      size: contentLength,
      url: req.originalUrl
    });
    return res.status(413).json({
      success: false,
      error: 'Request entity too large. Maximum size is 10MB.'
    });
  }

  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  strictLimiter,
  requestSizeLimiter,
  createRateLimiter
};
