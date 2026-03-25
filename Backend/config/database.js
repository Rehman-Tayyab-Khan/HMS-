// Enhanced Database Configuration with Connection Pooling and Retry Logic
const mongoose = require('mongoose');
const { retry } = require('../utils/retry');
const logger = require('../utils/logger');

// Disable mongoose buffering globally (replaces deprecated bufferMaxEntries and bufferCommands)
mongoose.set('bufferCommands', false);

// Connection options optimized for production
// Compatible with Mongoose 8.x
// Removed deprecated options: useNewUrlParser, useUnifiedTopology, bufferMaxEntries, bufferCommands
const connectionOptions = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5, // Minimum number of connections in the pool
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000, // How long a send or receive on a socket can take before timeout
  family: 4, // Use IPv4, skip trying IPv6
  heartbeatFrequencyMS: 10000, // Frequency of heartbeat
  retryWrites: true, // Retry writes on network errors
  retryReads: true, // Retry reads on network errors
};

// Connection state
let isConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = 5;

/**
 * Connect to MongoDB with retry logic
 */
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hms';

  if (isConnected) {
    logger.debug('MongoDB already connected');
    return;
  }

  try {
    await retry(
      async () => {
        await mongoose.connect(MONGODB_URI, connectionOptions);
        isConnected = true;
        connectionRetries = 0;
      },
      {
        maxRetries: MAX_RETRIES,
        initialDelay: 1000,
        maxDelay: 10000,
        shouldRetry: (error) => {
          logger.warn('MongoDB connection retry', { error: error.message, attempt: connectionRetries });
          connectionRetries++;
          return true;
        }
      }
    );

    logger.info('✅ MongoDB Connected Successfully', {
      database: MONGODB_URI.replace(/\/\/.*@/, '//***@'), // Hide credentials
      poolSize: connectionOptions.maxPoolSize
    });

    // Set up connection event handlers
    setupConnectionHandlers();
  } catch (error) {
    logger.error('❌ MongoDB connection failed after retries', {
      error: error.message,
      retries: connectionRetries
    });
    isConnected = false;
    throw error;
  }
};

/**
 * Setup MongoDB connection event handlers
 */
const setupConnectionHandlers = () => {
  mongoose.connection.on('connected', () => {
    isConnected = true;
    logger.info('MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('MongoDB disconnected');
    
    // Attempt to reconnect if not in shutdown
    if (process.env.NODE_ENV !== 'shutdown') {
      setTimeout(() => {
        logger.info('Attempting to reconnect to MongoDB...');
        connectDB().catch(err => {
          logger.error('Reconnection failed', { error: err.message });
        });
      }, 5000);
    }
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    logger.info('MongoDB reconnected');
  });

  // Monitor connection pool
  setInterval(() => {
    if (mongoose.connection.readyState === 1) {
      const poolSize = mongoose.connection.db?.serverConfig?.poolSize || 0;
      logger.debug('MongoDB connection pool status', {
        readyState: mongoose.connection.readyState,
        poolSize
      });
    }
  }, 60000); // Every minute
};

/**
 * Graceful disconnect
 */
const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB connection closed gracefully');
  } catch (error) {
    logger.error('Error closing MongoDB connection', { error: error.message });
    throw error;
  }
};

/**
 * Check database health
 */
const checkHealth = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return { healthy: false, status: 'disconnected' };
    }

    // Ping database
    await mongoose.connection.db.admin().ping();
    
    return {
      healthy: true,
      status: 'connected',
      readyState: mongoose.connection.readyState,
      poolSize: mongoose.connection.db?.serverConfig?.poolSize || 0
    };
  } catch (error) {
    return {
      healthy: false,
      status: 'error',
      error: error.message
    };
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  checkHealth,
  isConnected: () => isConnected
};
