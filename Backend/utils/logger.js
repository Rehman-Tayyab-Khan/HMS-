// Enhanced logger - use enhancedLogger in production, simple logger for development
const logger = process.env.NODE_ENV === 'production' 
  ? require('./enhancedLogger')
  : {
      info: (message, ...args) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
      },
      error: (message, ...args) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
      },
      warn: (message, ...args) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
      },
      debug: (message, ...args) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
        }
      },
      performance: (operation, duration, data = {}) => {
        if (duration > 1000) {
          console.warn(`[PERF] Slow operation: ${operation} took ${duration}ms`, data);
        }
      },
      security: (event, data = {}) => {
        console.warn(`[SECURITY] ${event}`, data);
      }
    };

module.exports = logger;
