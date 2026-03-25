// Utility exports
module.exports = {
  logger: require('./logger'),
  emailService: require('./emailService'),
  successResponse: require('./responseFormatter').successResponse,
  errorResponse: require('./responseFormatter').errorResponse,
  paginatedResponse: require('./responseFormatter').paginatedResponse,
  cache: require('./cache').cache,
  cacheMiddleware: require('./cache').cacheMiddleware,
  invalidateCache: require('./cache').invalidateCache,
  retry: require('./retry').retry,
  CircuitBreaker: require('./retry').CircuitBreaker
};
