// Production Startup Script with Health Checks
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { connectDB, checkHealth } = require('../config/database');
const logger = require('../utils/logger');

const startProduction = async () => {
  try {
    logger.info('Starting production server...');
    
    // Pre-flight checks
    logger.info('Running pre-flight checks...');
    
    // Check required environment variables
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'NODE_ENV'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      logger.error('Missing required environment variables', { missing: missingVars });
      process.exit(1);
    }
    
    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET.length < 32) {
      logger.warn('JWT_SECRET is too short. Minimum 32 characters recommended for production.');
    }
    
    // Check database connection
    logger.info('Checking database connection...');
    await connectDB();
    
    // Verify database health
    const dbHealth = await checkHealth();
    if (!dbHealth.healthy) {
      logger.error('Database health check failed', dbHealth);
      process.exit(1);
    }
    
    logger.info('✅ All pre-flight checks passed');
    logger.info('Starting application server...');
    
    // Start the server (server.js will handle the rest)
    require('../server');
    
  } catch (error) {
    logger.error('Production startup failed', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

startProduction();
