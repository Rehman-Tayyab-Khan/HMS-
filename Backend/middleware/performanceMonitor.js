// Performance Monitoring Middleware
const logger = require('../utils/logger');
const systemMonitor = require('../utils/monitoring');

const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;

  // Monitor response finish (do NOT set headers here - response already sent)
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const memoryDelta = process.memoryUsage().heapUsed - startMemory;

    // Record in system monitor
    systemMonitor.recordRequest(duration);

    // Log performance metrics only (headers cannot be set after response is sent)
    logger.performance(`${req.method} ${req.originalUrl}`, duration, {
      statusCode: res.statusCode,
      memoryDelta: `${Math.round(memoryDelta / 1024)} KB`,
      requestId: req.id
    });
  });

  next();
};

module.exports = performanceMonitor;
