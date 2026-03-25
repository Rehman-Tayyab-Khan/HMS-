// Enhanced Request Validation Middleware
const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils');
const logger = require('../utils/logger');

/**
 * Validate request and return formatted errors
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param || err.msg,
      message: err.msg,
      value: err.value
    }));

    logger.warn('Validation failed', {
      requestId: req.id,
      url: req.originalUrl,
      method: req.method,
      errors: formattedErrors
    });

    return errorResponse(res, 'Validation failed', 400, formattedErrors);
  }

  next();
};

/**
 * Sanitize request body - remove undefined and null values, trim strings
 */
const sanitizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj) => {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
          delete obj[key];
        } else if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
          if (obj[key] === '') {
            delete obj[key];
          }
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
  }

  next();
};

/**
 * Validate ObjectId format
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
    return errorResponse(res, 'Invalid ID format', 400);
  }

  next();
};

module.exports = {
  validateRequest,
  sanitizeRequest,
  validateObjectId
};
