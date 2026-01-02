import express from 'express';
import { body, validationResult } from 'express-validator';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { query as pool } from '../config/db-helper.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// GET all products
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE is_available = TRUE';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await pool('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET product categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool('SELECT DISTINCT category FROM products WHERE is_available = TRUE');
    res.json(rows.map(row => row.category));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create Razorpay order
router.post('/create-order', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('subtotal').optional().isNumeric().withMessage('Subtotal must be a number'),
  body('shippingCharges').optional().isNumeric().withMessage('Shipping charges must be a number'),
  body('customerInfo.name').trim().notEmpty().withMessage('Name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number required'),
  body('customerInfo.address').trim().notEmpty().withMessage('Address is required'),
  body('customerInfo.state').optional().trim(),
  body('items').isArray({ min: 1 }).withMessage('Cart items are required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, subtotal, shippingCharges, customerInfo, items, customerId } = req.body;

  try {
    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Generate order number
    const orderNumber = `ORD${Date.now()}`;

    // Save order to database
    const [orderResult] = await pool(
      `INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, 
       customer_address, customer_state, total_amount, subtotal, shipping_charges, razorpay_order_id, payment_status, order_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending') RETURNING id`,
      [
        orderNumber,
        customerId || null,
        customerInfo.name,
        customerInfo.email,
        customerInfo.phone,
        customerInfo.address,
        customerInfo.state || null,
        amount,
        subtotal || amount,
        shippingCharges || 0,
        razorpayOrder.id
      ]
    );

    const orderId = orderResult[0].id;

    // Save order items
    for (const item of items) {
      await pool(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.name, item.quantity, item.price]
      );
    }

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: orderNumber,
      dbOrderId: orderId
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify-payment', [
  body('razorpay_order_id').notEmpty(),
  body('razorpay_payment_id').notEmpty(),
  body('razorpay_signature').notEmpty(),
  body('dbOrderId').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

  try {
    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order status
      await pool(
        `UPDATE orders SET payment_status = 'completed', order_status = 'confirmed', 
         razorpay_payment_id = ?, razorpay_signature = ? WHERE id = ?`,
        [razorpay_payment_id, razorpay_signature, dbOrderId]
      );

      // Update product stock
      const [orderItems] = await pool(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [dbOrderId]
      );

      for (const item of orderItems) {
        await pool(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await pool(
        'UPDATE orders SET payment_status = \'failed\' WHERE id = ?',
        [dbOrderId]
      );
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// GET order details
router.get('/orders/:orderNumber', async (req, res) => {
  try {
    const [orders] = await pool(
      'SELECT * FROM orders WHERE order_number = ?',
      [req.params.orderNumber]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    const [items] = await pool(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
