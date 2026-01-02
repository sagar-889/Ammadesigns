import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query as pool } from '../config/db-helper.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  }
});

// Upload image
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Admin Login
router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const [rows] = await pool('SELECT * FROM admins WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all contacts (protected)
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// CRUD for Services
router.post('/services', authenticateToken, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, price } = req.body;

  try {
    const [result] = await pool(
      'INSERT INTO services (title, description, price) VALUES (?, ?, ?) RETURNING id',
      [title, description, price || null]
    );
    res.status(201).json({ id: result[0].id, message: 'Service created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;

  try {
    await pool(
      'UPDATE services SET title = ?, description = ?, price = ? WHERE id = ?',
      [title, description, price || null, id]
    );
    res.json({ message: 'Service updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool('DELETE FROM services WHERE id = ?', [id]);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// CRUD for Gallery
router.post('/gallery', authenticateToken, [
  body('image_url').trim().isURL()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { image_url, title } = req.body;

  try {
    const [result] = await pool(
      'INSERT INTO gallery (image_url, title) VALUES (?, ?) RETURNING id',
      [image_url, title || null]
    );
    res.status(201).json({ id: result[0].id, message: 'Gallery image added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

router.put('/gallery/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { image_url, title } = req.body;

  try {
    await pool(
      'UPDATE gallery SET image_url = ?, title = ? WHERE id = ?',
      [image_url, title || null, id]
    );
    res.json({ message: 'Gallery image updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
});

router.delete('/gallery/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool('DELETE FROM gallery WHERE id = ?', [id]);
    res.json({ message: 'Gallery image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

// CRUD for Products
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/products', authenticateToken, [
  body('name').trim().notEmpty(),
  body('price').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, image_url, category, stock, is_available } = req.body;

  try {
    const [result] = await pool(
      'INSERT INTO products (name, description, price, image_url, category, stock, is_available) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
      [name, description, price, image_url || null, category || null, stock || 0, is_available !== false]
    );
    res.status(201).json({ id: result[0].id, message: 'Product created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, stock, is_available } = req.body;

  try {
    await pool(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category = ?, stock = ?, is_available = ? WHERE id = ?',
      [name, description, price, image_url || null, category || null, stock || 0, is_available !== false, id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details with items
router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await pool('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    res.json({ ...orders[0], items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;

  try {
    await pool('UPDATE orders SET order_status = ? WHERE id = ?', [order_status, id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update order (alternative endpoint)
router.put('/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;

  try {
    await pool('UPDATE orders SET order_status = ? WHERE id = ?', [order_status, id]);
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
