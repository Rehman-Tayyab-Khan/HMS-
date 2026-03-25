// Enhanced Production Logger with file rotation and structured logging
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_LOG_FILES = 10;

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL 
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] 
  : (process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG);

// Rotate log file if needed
const rotateLogFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;

  const stats = fs.statSync(filePath);
  if (stats.size >= MAX_LOG_SIZE) {
    // Rotate existing files
    for (let i = MAX_LOG_FILES - 1; i >= 1; i--) {
      const oldFile = `${filePath}.${i}`;
      const newFile = `${filePath}.${i + 1}`;
      if (fs.existsSync(oldFile)) {
        fs.renameSync(oldFile, newFile);
      }
    }
    // Move current log to .1
    fs.renameSync(filePath, `${filePath}.1`);
  }
};

// Write to log file
const writeLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
    pid: process.pid,
    memory: {
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
    }
  };

  const logString = JSON.stringify(logEntry) + '\n';
  const logFile = path.join(LOG_DIR, `${level.toLowerCase()}.log`);

  // Rotate if needed
  rotateLogFile(logFile);

  // Write to file (async, non-blocking)
  fs.appendFile(logFile, logString, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });

  // Also output to console in development
  if (process.env.NODE_ENV === 'development') {
    const consoleMessage = `[${level}] ${timestamp} - ${message}`;
    if (data.stack) {
      console.error(consoleMessage, '\n', data.stack);
    } else if (Object.keys(data).length > 0) {
      console.log(consoleMessage, data);
    } else {
      console.log(consoleMessage);
    }
  }
};

const logger = {
  error: (message, data = {}) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
      writeLog('ERROR', message, data);
    }
  },

  warn: (message, data = {}) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
      writeLog('WARN', message, data);
    }
  },

  info: (message, data = {}) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
      writeLog('INFO', message, data);
    }
  },

  debug: (message, data = {}) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
      writeLog('DEBUG', message, data);
    }
  },

  // Performance logging
  performance: (operation, duration, data = {}) => {
    if (duration > 1000) { // Log slow operations (>1s)
      writeLog('WARN', `Slow operation: ${operation}`, {
        duration: `${duration}ms`,
        ...data
      });
    } else if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
      writeLog('DEBUG', `Operation: ${operation}`, {
        duration: `${duration}ms`,
        ...data
      });
    }
  },

  // Security event logging
  security: (event, data = {}) => {
    writeLog('WARN', `Security Event: ${event}`, {
      type: 'security',
      ...data
    });
  }
};

module.exports = logger;
