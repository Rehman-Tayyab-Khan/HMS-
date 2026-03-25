// Middleware exports
module.exports = {
  protect: require('./auth').protect,
  authorize: require('./auth').authorize,
  asyncHandler: require('./asyncHandler'),
  errorHandler: require('./errorHandler'),
  paginate: require('./pagination').paginate,
  createPaginatedResponse: require('./pagination').createPaginatedResponse,
  apiLimiter: require('./rateLimiter').apiLimiter,
  authLimiter: require('./rateLimiter').authLimiter,
  requestId: require('./requestId'),
  validateObjectId: require('./validateObjectId')
};
