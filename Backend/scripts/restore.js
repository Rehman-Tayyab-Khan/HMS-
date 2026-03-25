#!/usr/bin/env node

/**
 * Database Restore Script
 * 
 * Usage:
 *   node scripts/restore.js <backup-path>
 *   node scripts/restore.js backups/hms-backup-2024-01-23
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hms';
const backupPath = process.argv[2];

if (!backupPath) {
  console.error('❌ Error: Backup path is required');
  console.log('Usage: node scripts/restore.js <backup-path>');
  process.exit(1);
}

if (!fs.existsSync(backupPath)) {
  console.error(`❌ Error: Backup path does not exist: ${backupPath}`);
  process.exit(1);
}

const isCompressed = backupPath.endsWith('.gz');
let command;

if (isCompressed) {
  command = `mongorestore --uri="${MONGODB_URI}" --archive="${backupPath}" --gzip --drop`;
} else {
  command = `mongorestore --uri="${MONGODB_URI}" "${backupPath}" --drop`;
}

console.log('🔄 Starting database restore...');
console.log(`📦 Backup: ${backupPath}`);
console.log(`🗄️  Database: ${MONGODB_URI}`);
console.log('⚠️  WARNING: This will drop existing data!');

// Add confirmation prompt in production
if (process.env.NODE_ENV === 'production') {
  console.log('⚠️  Production restore requires manual confirmation');
  process.exit(1);
}

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Restore failed:', error.message);
    process.exit(1);
  }

  if (stderr) {
    console.warn('⚠️  Warnings:', stderr);
  }

  console.log('✅ Restore completed successfully!');
});
