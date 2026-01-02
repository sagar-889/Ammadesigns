import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';

const router = express.Router();

// Customer Signup
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, password, address } = req.body;

  try {
    // Check if customer already exists
    const [existing] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create customer
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone, password_hash, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, password_hash, address || null]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      customer: { id: result.insertId, name, email, phone }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Customer Login (also handles admin login)
router.post('/login', [
  body('identifier').notEmpty().withMessage('Email or phone number is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identifier, password } = req.body;

  try {
    // Check if it's admin login
    if (identifier === 'admin@amma.com' && password === 'amma@435') {
      const token = jwt.sign(
        { id: 1, email: 'admin@amma.com', type: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        isAdmin: true,
        user: {
          id: 1,
          name: 'Admin',
          email: 'admin@amma.com',
          type: 'admin'
        }
      });
    }

    // Regular customer login
    const isEmail = identifier.includes('@');
    const query = isEmail 
      ? 'SELECT * FROM customers WHERE email = ?' 
      : 'SELECT * FROM customers WHERE phone = ?';
    
    const [rows] = await pool.query(query, [identifier]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const customer = rows[0];
    const validPassword = await bcrypt.compare(password, customer.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      isAdmin: false,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Customer Profile
router.get('/profile', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    if (verified.type !== 'customer') {
      return res.status(403).json({ error: 'Invalid token type' });
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, address, created_at FROM customers WHERE id = ?',
      [verified.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

// Update Customer Profile
router.put('/profile', [
  body('name').optional().trim().notEmpty(),
  body('phone').optional().matches(/^[0-9]{10}$/),
  body('address').optional().trim()
], async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    if (verified.type !== 'customer') {
      return res.status(403).json({ error: 'Invalid token type' });
    }

    const { name, phone, address } = req.body;
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(verified.id);
    await pool.query(
      `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Get Customer Orders
router.get('/orders', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    if (verified.type !== 'customer') {
      return res.status(403).json({ error: 'Invalid token type' });
    }

    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      [verified.id]
    );

    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Reset Password
router.post('/reset-password', [
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, newPassword } = req.body;

  try {
    // Check if customer exists with this phone number
    const [rows] = await pool.query('SELECT * FROM customers WHERE phone = ?', [phone]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this phone number' });
    }

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE customers SET password_hash = ? WHERE phone = ?',
      [password_hash, phone]
    );

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

export default router;
