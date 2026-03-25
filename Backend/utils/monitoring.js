// System Monitoring and Metrics
const os = require('os');
const { logger } = require('./logger');

class SystemMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      slowRequests: 0,
      startTime: Date.now()
    };
    this.startMonitoring();
  }

  // Record request
  recordRequest(duration) {
    this.metrics.requests++;
    if (duration > 1000) {
      this.metrics.slowRequests++;
    }
  }

  // Record error
  recordError() {
    this.metrics.errors++;
  }

  // Get system metrics
  getMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      requests: {
        total: this.metrics.requests,
        errors: this.metrics.errors,
        slowRequests: this.metrics.slowRequests,
        errorRate: this.metrics.requests > 0 
          ? ((this.metrics.errors / this.metrics.requests) * 100).toFixed(2) + '%'
          : '0%'
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        loadAverage: os.loadavg(),
        freeMemory: Math.round(os.freemem() / 1024 / 1024),
        totalMemory: Math.round(os.totalmem() / 1024 / 1024)
      }
    };
  }

  // Start periodic monitoring
  startMonitoring() {
    setInterval(() => {
      const metrics = this.getMetrics();
      
      // Log warnings for high memory usage
      if (metrics.memory.heapUsed > 500) { // > 500MB
        logger.warn('High memory usage detected', {
          heapUsed: metrics.memory.heapUsed + 'MB',
          heapTotal: metrics.memory.heapTotal + 'MB'
        });
      }

      // Log warnings for high error rate
      const errorRate = parseFloat(metrics.requests.errorRate);
      if (errorRate > 5 && this.metrics.requests > 100) {
        logger.warn('High error rate detected', {
          errorRate: metrics.requests.errorRate,
          totalRequests: metrics.requests.total,
          errors: metrics.requests.errors
        });
      }

      // Log system metrics in debug mode
      if (process.env.NODE_ENV === 'development') {
        logger.debug('System metrics', metrics);
      }
    }, 60000); // Every minute
  }

  // Reset metrics (useful for testing)
  reset() {
    this.metrics = {
      requests: 0,
      errors: 0,
      slowRequests: 0,
      startTime: Date.now()
    };
  }
}

// Singleton instance
const systemMonitor = new SystemMonitor();

module.exports = systemMonitor;
