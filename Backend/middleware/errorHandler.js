// Enhanced Error Handling Middleware - Production Ready
const { logger } = require('../utils');

// Error response formatter
const formatErrorResponse = (error, req) => {
  const requestId = req.id || 'NO-ID';
  const baseResponse = {
    success: false,
    error: error.message || 'Server Error',
    requestId,
    timestamp: new Date().toISOString()
  };

  // Add stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    baseResponse.stack = error.stack;
  }

  // Add error code if available
  if (error.code) {
    baseResponse.code = error.code;
  }

  return baseResponse;
};

// Enhanced error handler
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Comprehensive error logging
  const errorContext = {
    requestId: req.id || 'NO-ID',
    url: req.originalUrl,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    body: process.env.NODE_ENV === 'development' ? req.body : undefined,
    query: process.env.NODE_ENV === 'development' ? req.query : undefined
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404, code: 'INVALID_ID' };
    logger.warn('Invalid ObjectId', { ...errorContext, error: err.message });
  }
  // Mongoose duplicate key
  else if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const message = `${field} already exists`;
    error = { message, statusCode: 400, code: 'DUPLICATE_ENTRY' };
    logger.warn('Duplicate entry attempt', { ...errorContext, field });
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400, code: 'VALIDATION_ERROR' };
    logger.warn('Validation error', { ...errorContext, errors: err.errors });
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401, code: 'INVALID_TOKEN' };
    logger.security('Invalid JWT token attempt', errorContext);
  }
  else if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401, code: 'TOKEN_EXPIRED' };
    logger.warn('Expired token attempt', errorContext);
  }
  // MongoDB connection errors
  else if (err.name === 'MongoNetworkError' || err.name === 'MongoServerError') {
    const message = 'Database connection error. Please try again later.';
    error = { message, statusCode: 503, code: 'DATABASE_ERROR' };
    logger.error('Database error', { ...errorContext, error: err.message, stack: err.stack });
  }
  // Rate limit errors
  else if (err.statusCode === 429) {
    error = { message: err.message || 'Too many requests', statusCode: 429, code: 'RATE_LIMIT_EXCEEDED' };
    logger.warn('Rate limit exceeded', errorContext);
  }
  // Custom application errors
  else if (err.statusCode) {
    // Error already has status code
    logger.error('Application error', { ...errorContext, error: err.message, statusCode: err.statusCode });
  }
  // Unknown errors - Critical!
  else {
    error = { 
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR'
    };
    // Log full error details for unknown errors
    logger.error('Unhandled error', {
      ...errorContext,
      error: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    });
  }

  // Record error in monitoring
  const systemMonitor = require('../utils/monitoring');
  systemMonitor.recordError();

  // Send error response
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json(formatErrorResponse(error, req));
};

module.exports = errorHandler;
