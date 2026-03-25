// Production Verification Script
// This script checks all critical production requirements

const fs = require('fs');
const path = require('path');

const logger = require('../utils/logger');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

function check(name, condition, isWarning = false) {
  if (condition) {
    checks.passed.push(name);
    logger.info(`✅ ${name}`);
  } else {
    if (isWarning) {
      checks.warnings.push(name);
      logger.warn(`⚠️  ${name}`);
    } else {
      checks.failed.push(name);
      logger.error(`❌ ${name}`);
    }
  }
}

async function verifyProduction() {
  logger.info('🔍 Starting Production Verification...\n');

  // 1. Environment Variables
  logger.info('📋 Checking Environment Variables...');
  check('NODE_ENV is set', !!process.env.NODE_ENV);
  check('MONGODB_URI is set', !!process.env.MONGODB_URI);
  check('JWT_SECRET is set', !!process.env.JWT_SECRET);
  check('JWT_SECRET is strong (32+ chars)', 
    process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32,
    process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32
  );
  check('PORT is set', !!process.env.PORT);
  check('FRONTEND_URL is set', !!process.env.FRONTEND_URL, true);

  // 2. Critical Files
  logger.info('\n📁 Checking Critical Files...');
  const criticalFiles = [
    'server.js',
    'config/database.js',
    'config/helmet.js',
    'middleware/errorHandler.js',
    'middleware/auth.js',
    'middleware/security.js',
    'utils/logger.js',
    'utils/enhancedLogger.js',
    'utils/cache.js',
    'utils/retry.js',
    'utils/monitoring.js',
    'scripts/start-production.js'
  ];

  criticalFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    check(`File exists: ${file}`, fs.existsSync(filePath));
  });

  // 3. Dependencies
  logger.info('\n📦 Checking Dependencies...');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = [
      'express', 'mongoose', 'bcryptjs', 'jsonwebtoken',
      'helmet', 'express-rate-limit', 'compression',
      'express-mongo-sanitize', 'xss-clean', 'hpp'
    ];
    
    requiredDeps.forEach(dep => {
      check(`Dependency installed: ${dep}`, 
        packageJson.dependencies && packageJson.dependencies[dep]
      );
    });
  }

  // 4. Logs Directory
  logger.info('\n📝 Checking Logs Directory...');
  const logsDir = path.join(__dirname, '..', 'logs');
  check('Logs directory exists', fs.existsSync(logsDir), true);
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      logger.info('✅ Created logs directory');
    } catch (err) {
      logger.error('Failed to create logs directory', { error: err.message });
    }
  }

  // 5. Database Connection (if MONGODB_URI is set)
  logger.info('\n🗄️  Checking Database Connection...');
  if (process.env.MONGODB_URI) {
    try {
      const { checkHealth } = require('../config/database');
      const dbHealth = await checkHealth();
      check('Database is connected', dbHealth.healthy);
    } catch (error) {
      check('Database connection check', false);
      logger.error('Database check failed', { error: error.message });
    }
  } else {
    check('Database connection check', false, true);
  }

  // 6. Security Checks
  logger.info('\n🔒 Checking Security Configuration...');
  check('Helmet config exists', fs.existsSync(path.join(__dirname, '..', 'config', 'helmet.js')));
  check('Rate limiting configured', fs.existsSync(path.join(__dirname, '..', 'middleware', 'security.js')));
  check('Input validation exists', fs.existsSync(path.join(__dirname, '..', 'middleware', 'requestValidator.js')));

  // Summary
  logger.info('\n' + '='.repeat(60));
  logger.info('📊 VERIFICATION SUMMARY');
  logger.info('='.repeat(60));
  logger.info(`✅ Passed: ${checks.passed.length}`);
  logger.info(`❌ Failed: ${checks.failed.length}`);
  logger.info(`⚠️  Warnings: ${checks.warnings.length}`);
  logger.info('='.repeat(60) + '\n');

  if (checks.failed.length > 0) {
    logger.error('❌ CRITICAL ISSUES FOUND:');
    checks.failed.forEach(issue => {
      logger.error(`   - ${issue}`);
    });
    logger.error('\n⚠️  Please fix these issues before deploying to production!\n');
    process.exit(1);
  }

  if (checks.warnings.length > 0) {
    logger.warn('⚠️  WARNINGS:');
    checks.warnings.forEach(warning => {
      logger.warn(`   - ${warning}`);
    });
    logger.warn('\n💡 Consider addressing these warnings for optimal production setup.\n');
  }

  if (checks.failed.length === 0) {
    logger.info('✅ All critical checks passed! System is ready for production.\n');
    process.exit(0);
  }
}

// Run verification
verifyProduction().catch(err => {
  logger.error('Verification script failed', { error: err.message, stack: err.stack });
  process.exit(1);
});
