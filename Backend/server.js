const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const { cacheMiddleware } = require('./utils/cache');
const logger = require('./utils/logger');
const helmetConfig = require('./config/helmet');
const queryOptimizer = require('./middleware/queryOptimizer');

// Load env vars
dotenv.config();

const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// Security Middleware (Enhanced)
app.use(helmetConfig); // Enhanced security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Compression middleware (Optimized)
app.use(compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const getCorsOrigin = () => {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.FRONTEND_URL) {
      return process.env.FRONTEND_URL.includes(',') 
        ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
        : process.env.FRONTEND_URL;
    }
    return false; // Deny all in production if FRONTEND_URL not set
  }
  return ['http://localhost:4200', 'http://localhost:3000'];
};

const corsOptions = {
  origin: getCorsOrigin(),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
};
app.use(cors(corsOptions));

// Request ID middleware
const requestId = require('./middleware/requestId');
app.use(requestId);

// Performance monitoring
const performanceMonitor = require('./middleware/performanceMonitor');
app.use(performanceMonitor);

// Request sanitization
const { sanitizeRequest } = require('./middleware/requestValidator');
app.use(sanitizeRequest);

// Request size limiter
const { requestSizeLimiter } = require('./middleware/security');
app.use(requestSizeLimiter);

// Query optimizer middleware
app.use('/api/', queryOptimizer);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req[id]', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Response caching for GET requests (5 minutes default)
app.use('/api/', cacheMiddleware(300));

// Enhanced MongoDB Connection with retry and connection pooling
const { connectDB, disconnectDB, checkHealth } = require('./config/database');

// Initialize database connection
connectDB().catch(err => {
  logger.error('Failed to connect to MongoDB', { error: err.message });
  process.exit(1);
});

// Routes
const routes = require('./routes');
app.use('/api/auth', routes.authRoutes);
app.use('/api/staff', routes.staffRoutes);
app.use('/api/patients', routes.patientRoutes);
app.use('/api/appointments', routes.appointmentRoutes);
app.use('/api/medical-records', routes.medicalRecordRoutes);
app.use('/api/wards', routes.wardRoutes);
app.use('/api/reports', routes.reportRoutes);

// Swagger API Documentation
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
  const swaggerUi = require('swagger-ui-express');
  const { swaggerConfig } = require('./config');
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'HMS API Documentation'
  }));
  console.log('📚 API Documentation available at /api-docs');
}

// Enhanced Health Check Endpoint with System Monitoring
const systemMonitor = require('./utils/monitoring');

app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check database health
    const dbHealth = await checkHealth();
    
    // Get system metrics
    const metrics = systemMonitor.getMetrics();
    
    const healthData = {
      success: true,
      status: dbHealth.healthy ? 'OK' : 'DEGRADED',
      message: 'HMS Backend is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.round(process.uptime()),
      memory: metrics.memory,
      database: dbHealth,
      system: {
        platform: metrics.system.platform,
        loadAverage: metrics.system.loadAverage[0].toFixed(2)
      },
      requests: {
        total: metrics.requests.total,
        errorRate: metrics.requests.errorRate
      },
      responseTime: `${Date.now() - startTime}ms`
    };

    const statusCode = dbHealth.healthy ? 200 : 503;
    res.status(statusCode).json(healthData);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      success: false,
      status: 'ERROR',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Metrics endpoint (for monitoring tools)
app.get('/api/metrics', async (req, res) => {
  try {
    const dbHealth = await checkHealth();
    const metrics = systemMonitor.getMetrics();
    
    res.json({
      ...metrics,
      database: dbHealth
    });
  } catch (error) {
    logger.error('Metrics endpoint error', { error: error.message });
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Enhanced Graceful Shutdown
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress');
    return;
  }

  isShuttingDown = true;
  logger.info(`${signal} received: Starting graceful shutdown...`);

  // Stop accepting new requests
  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close database connection
      await disconnectDB();
      logger.info('Database connections closed');
      
      // Give time for cleanup
      setTimeout(() => {
        logger.info('Graceful shutdown completed');
        process.exit(0);
      }, 1000);
    } catch (error) {
      logger.error('Error during shutdown', { error: error.message });
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', {
    error: err.message,
    stack: err.stack
  });
  
  // Don't exit in production, let PM2 handle it
  if (process.env.NODE_ENV === 'production') {
    // Log and continue
    return;
  }
  
  // Exit in development
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception - CRITICAL', {
    error: err.message,
    stack: err.stack
  });
  
  // Attempt graceful shutdown
  gracefulShutdown('uncaughtException').catch(() => {
    process.exit(1);
  });
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;
