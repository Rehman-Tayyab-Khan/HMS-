// Database Optimization Script
// Run this script to create/update indexes and optimize database

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/database');
const logger = require('../utils/logger');

dotenv.config();

const optimizeDatabase = async () => {
  try {
    logger.info('Starting database optimization...');
    
    // Connect to database
    await connectDB();
    
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    
    logger.info(`Found ${collections.length} collections`);
    
    // Optimize each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      
      try {
        // Get collection stats
        const stats = await db.collection(collectionName).stats();
        
        logger.info(`Optimizing collection: ${collectionName}`, {
          count: stats.count,
          size: `${Math.round(stats.size / 1024)} KB`,
          indexes: stats.nindexes
        });
        
        // Rebuild indexes
        await db.collection(collectionName).createIndexes();
        
        // Compact collection (reduces fragmentation)
        // Note: This requires admin privileges
        try {
          await db.command({ compact: collectionName });
          logger.info(`Compacted collection: ${collectionName}`);
        } catch (err) {
          logger.warn(`Could not compact ${collectionName} (may require admin privileges)`, {
            error: err.message
          });
        }
        
      } catch (err) {
        logger.error(`Error optimizing collection ${collectionName}`, {
          error: err.message
        });
      }
    }
    
    // Get database stats
    const dbStats = await db.stats();
    logger.info('Database optimization complete', {
      collections: dbStats.collections,
      dataSize: `${Math.round(dbStats.dataSize / 1024 / 1024)} MB`,
      storageSize: `${Math.round(dbStats.storageSize / 1024 / 1024)} MB`,
      indexes: dbStats.indexes,
      indexSize: `${Math.round(dbStats.indexSize / 1024 / 1024)} MB`
    });
    
    await disconnectDB();
    logger.info('Database optimization completed successfully');
    process.exit(0);
    
  } catch (error) {
    logger.error('Database optimization failed', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Run optimization
optimizeDatabase();
