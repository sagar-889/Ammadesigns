-- Add status tracking columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS processing_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP;

-- Create trigger to automatically update status timestamps
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
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF NOT EXISTS track_order_status_changes ON orders;
CREATE TRIGGER track_order_status_changes
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_order_status_timestamps();

-- Update existing orders to set paid_at for already paid orders
UPDATE orders 
SET paid_at = created_at 
WHERE payment_status = 'paid' AND paid_at IS NULL;

-- Update existing orders to set processing_at for orders in processing
UPDATE orders 
SET processing_at = updated_at 
WHERE order_status = 'processing' AND processing_at IS NULL;

-- Update existing orders to set shipped_at for shipped orders
UPDATE orders 
SET shipped_at = updated_at 
WHERE order_status = 'shipped' AND shipped_at IS NULL;

-- Update existing orders to set delivered_at for delivered orders
UPDATE orders 
SET delivered_at = updated_at 
WHERE order_status = 'delivered' AND delivered_at IS NULL;
