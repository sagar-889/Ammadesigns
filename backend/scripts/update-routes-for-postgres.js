#!/usr/bin/env node

/**
 * Script to update route files from MySQL to PostgreSQL
 * This script updates all route files to use the db-helper wrapper
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, '../routes');

const routeFiles = [
  'public.js',
  'auth.js',
  'admin.js',
  'services.js',
  'gallery.js',
  'tracking.js'
];

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace import statement
  content = content.replace(
    /import pool from ['"]\.\.\/config\/db\.js['"];/g,
    "import { query as pool } from '../config/db-helper.js';"
  );
  
  // Replace pool.query( with pool(
  content = content.replace(/pool\.query\(/g, 'pool(');
  
  // Handle INSERT...RETURNING for PostgreSQL (for getting inserted ID)
  content = content.replace(
    /INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)(?!.*RETURNING)/g,
    'INSERT INTO $1 ($2) VALUES ($3) RETURNING id'
  );
  
  // Replace result.insertId with result[0].id for INSERT operations
  content = content.replace(/result\.insertId/g, 'result[0].id');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${path.basename(filePath)}`);
}

console.log('Updating route files for PostgreSQL...\n');

routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  updateFile(filePath);
});

console.log('\n✓ All route files updated successfully!');
console.log('\nNote: Please review the changes and test thoroughly.');
console.log('Some complex queries may need manual adjustment.');
