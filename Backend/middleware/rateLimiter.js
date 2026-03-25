// Use enhanced security middleware
const { apiLimiter, authLimiter } = require('./security');

module.exports = {
  apiLimiter,
  authLimiter
};
