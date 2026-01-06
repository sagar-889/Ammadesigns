import { query as pool } from '../config/db-helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Starting status tracking migration...\n');

    // Add columns
    console.log('1. Adding timestamp columns...');
    await pool(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS processing_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP
    `);
    console.log('✅ Columns added\n');

    // Create function
    console.log('2. Creating status tracking function...');
    await pool(`
      CREATE OR REPLACE FUNCTION update_order_status_timestamps()
      RETURNS TRIGGER AS $$
      BEGIN
          -- When payment status changes to paid
          IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
              NEW.paid_at = CURRENT_TIMESTAMP;
          END IF;
          
          -- When order status changes to processing
          IF NEW.order_status = 'processing' AND (OLD.order_status IS NULL OR OLD.order_status != 'processing') THEN
              NEW.processing_at = CURRENT_TIMESTAMP;
          END IF;
          
          -- When order status changes to shipped
          IF NEW.order_status = 'shipped' AND (OLD.order_status IS NULL OR OLD.order_status != 'shipped') THEN
              NEW.shipped_at = CURRENT_TIMESTAMP;
          END IF;
          
          -- When order status changes to delivered
          IF NEW.order_status = 'delivered' AND (OLD.order_status IS NULL OR OLD.order_status != 'delivered') THEN
              NEW.delivered_at = CURRENT_TIMESTAMP;
          END IF;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);
    console.log('✅ Function created\n');

    // Drop and create trigger
    console.log('3. Creating trigger...');
    await pool('DROP TRIGGER IF EXISTS track_order_status_changes ON orders');
    await pool(`
      CREATE TRIGGER track_order_status_changes
          BEFORE UPDATE ON orders
          FOR EACH ROW
          EXECUTE FUNCTION update_order_status_timestamps()
    `);
    console.log('✅ Trigger created\n');

    // Update existing orders
    console.log('4. Updating existing orders...');
    
    const [paidResult] = await pool(`
      UPDATE orders 
      SET paid_at = created_at 
      WHERE payment_status = 'paid' AND paid_at IS NULL
    `);
    console.log(`   - Updated ${paidResult.rowCount || 0} paid orders`);

    const [processingResult] = await pool(`
      UPDATE orders 
      SET processing_at = updated_at 
      WHERE order_status = 'processing' AND processing_at IS NULL
    `);
    console.log(`   - Updated ${processingResult.rowCount || 0} processing orders`);

    const [shippedResult] = await pool(`
      UPDATE orders 
      SET shipped_at = updated_at 
      WHERE order_status = 'shipped' AND shipped_at IS NULL
    `);
    console.log(`   - Updated ${shippedResult.rowCount || 0} shipped orders`);

    const [deliveredResult] = await pool(`
      UPDATE orders 
      SET delivered_at = updated_at 
      WHERE order_status = 'delivered' AND delivered_at IS NULL
    `);
    console.log(`   - Updated ${deliveredResult.rowCount || 0} delivered orders`);

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
