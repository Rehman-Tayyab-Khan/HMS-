#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * Usage:
 *   node scripts/backup.js
 *   node scripts/backup.js --compress
 *   node scripts/backup.js --output /path/to/backup
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hms';
const BACKUP_DIR = process.argv.includes('--output') 
  ? process.argv[process.argv.indexOf('--output') + 1]
  : path.join(__dirname, '../backups');
const COMPRESS = process.argv.includes('--compress');

// Extract database name from URI
const getDbName = (uri) => {
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : 'hms';
};

const dbName = getDbName(MONGODB_URI);
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupName = `hms-backup-${timestamp}`;
const backupPath = path.join(BACKUP_DIR, backupName);

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Build mongodump command
let command = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;

if (COMPRESS) {
  command += ' --archive --gzip';
  const archivePath = `${backupPath}.gz`;
  command = `mongodump --uri="${MONGODB_URI}" --archive="${archivePath}" --gzip`;
}

console.log('🔄 Starting database backup...');
console.log(`📦 Database: ${dbName}`);
console.log(`📁 Backup location: ${COMPRESS ? backupPath + '.gz' : backupPath}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }

  if (stderr) {
    console.warn('⚠️  Warnings:', stderr);
  }

  console.log('✅ Backup completed successfully!');
  console.log(`📦 Backup saved to: ${COMPRESS ? backupPath + '.gz' : backupPath}`);
  
  // Cleanup old backups (keep last 7 days)
  cleanupOldBackups(BACKUP_DIR, 7);
});

function cleanupOldBackups(backupDir, keepDays) {
  const files = fs.readdirSync(backupDir);
  const now = Date.now();
  const maxAge = keepDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

  files.forEach(file => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted old backup: ${file}`);
    }
  });
}
