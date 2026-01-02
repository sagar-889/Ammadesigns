import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Track order by order number (public - no auth required)
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    
    // Get order details
    const [orders] = await db.query(
      `SELECT 
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_state,
        total_amount,
        subtotal,
        shipping_charges,
        payment_status,
        order_status,
        created_at,
        updated_at
      FROM orders 
      WHERE order_number = ?`,
      [orderNumber]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found. Please check your order number.' 
      });
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await db.query(
      `SELECT 
        product_name,
        quantity,
        price
      FROM order_items 
      WHERE order_id = (SELECT id FROM orders WHERE order_number = ?)`,
      [orderNumber]
    );
    
    order.items = items;
    
    // Calculate order timeline
    const timeline = getOrderTimeline(order);
    
    res.json({
      success: true,
      order: {
        ...order,
        timeline
      }
    });
    
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to track order' 
    });
  }
});

// Helper function to generate order timeline
function getOrderTimeline(order) {
  const timeline = [];
  
  // Order Placed
  timeline.push({
    status: 'placed',
    label: 'Order Placed',
    date: order.created_at,
    completed: true,
    description: 'Your order has been received'
  });
  
  // Payment Status
  if (order.payment_status === 'paid') {
    timeline.push({
      status: 'paid',
      label: 'Payment Confirmed',
      date: order.created_at,
      completed: true,
      description: 'Payment has been verified'
    });
  } else {
    timeline.push({
      status: 'paid',
      label: 'Payment Pending',
      date: null,
      completed: false,
      description: 'Waiting for payment confirmation'
    });
  }
  
  // Processing
  const isProcessing = ['processing', 'shipped', 'delivered'].includes(order.order_status);
  timeline.push({
    status: 'processing',
    label: 'Processing',
    date: isProcessing ? order.updated_at : null,
    completed: isProcessing,
    description: isProcessing ? 'Your order is being prepared' : 'Order will be processed after payment'
  });
  
  // Shipped
  const isShipped = ['shipped', 'delivered'].includes(order.order_status);
  timeline.push({
    status: 'shipped',
    label: 'Shipped',
    date: isShipped ? order.updated_at : null,
    completed: isShipped,
    description: isShipped ? 'Your order is on the way' : 'Order will be shipped soon'
  });
  
  // Delivered
  const isDelivered = order.order_status === 'delivered';
  timeline.push({
    status: 'delivered',
    label: 'Delivered',
    date: isDelivered ? order.updated_at : null,
    completed: isDelivered,
    description: isDelivered ? 'Order has been delivered' : 'Estimated delivery in 3-5 days'
  });
  
  return timeline;
}

export default router;
