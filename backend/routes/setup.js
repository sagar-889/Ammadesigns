import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rawQuery } from '../config/db-helper.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup endpoint - initialize database
router.post('/initialize', async (req, res) => {
  try {
    console.log('Starting database initialization...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema_postgres.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    await rawQuery(schema);
    
    console.log('Database initialized successfully!');
    
    res.json({
      success: true,
      message: 'Database initialized successfully!',
      tables: [
        'admins',
        'customers',
        'services',
        'gallery',
        'contacts',
        'products',
        'orders',
        'order_items'
      ]
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to initialize database'
    });
  }
});

// Health check endpoint
router.get('/status', async (req, res) => {
  try {
    const result = await rawQuery('SELECT NOW() as time');
    res.json({
      success: true,
      database: 'connected',
      time: result.rows[0].time
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'disconnected',
      error: error.message
    });
  }
});

export default router;
