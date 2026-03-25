const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logger } = require('../utils');
const { retry } = require('../utils/retry');

// Protect routes (Optimized with caching and retry)
const userCache = new Map(); // Simple in-memory cache for user lookups
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clear user cache
const clearUserCache = (userId) => {
  if (userId) {
    userCache.delete(userId);
  }
};

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.security('Unauthorized access attempt - no token', {
      ip: req.ip,
      url: req.originalUrl
    });
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized, no token' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key');
    
    // Check cache first
    const cacheKey = decoded.id;
    let user = userCache.get(cacheKey);
    
    if (!user || (Date.now() - user.cachedAt) > CACHE_TTL) {
      // Fetch user with retry logic
      user = await retry(
        async () => {
          const fetchedUser = await User.findById(decoded.id)
            .select('-password -__v')
            .populate('staffId')
            .lean();
          
          if (!fetchedUser) {
            throw new Error('User not found');
          }
          
          return fetchedUser;
        },
        {
          maxRetries: 2,
          initialDelay: 100
        }
      );
      
      // Cache user
      userCache.set(cacheKey, {
        ...user,
        cachedAt: Date.now()
      });
    } else {
      // Use cached user
      user = user;
    }
    
    req.user = user;
    
    if (!req.user || !req.user.isActive) {
      logger.security('Inactive user access attempt', {
        userId: decoded.id,
        ip: req.ip
      });
      return res.status(401).json({ 
        success: false,
        error: 'User not found or inactive' 
      });
    }

    // Check if profile is completed (except for complete-profile endpoint)
    const fullPath = req.originalUrl || req.path;
    const isCompleteProfileRoute = fullPath.includes('/auth/complete-profile') || fullPath.includes('/complete-profile');
    
    if (!req.user.profileCompleted && !isCompleteProfileRoute) {
      return res.status(403).json({ 
        success: false,
        error: 'Profile not completed',
        requiresProfileCompletion: true 
      });
    }

    next();
  } catch (error) {
    logger.security('Token verification failed', {
      error: error.message,
      ip: req.ip,
      url: req.originalUrl
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized, token failed' 
    });
  }
};

// Export cache clearing function
exports.clearUserCache = clearUserCache;

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role || 'not set'}' is not authorized to access this route` 
      });
    }
    next();
  };
};
