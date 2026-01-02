import express from 'express';
import { body, validationResult } from 'express-validator';
import { query as pool } from '../config/db-helper.js';

const router = express.Router();

// GET all services
router.get('/services', async (req, res) => {
  try {
    const [rows] = await pool('SELECT * FROM services ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET all gallery images
router.get('/gallery', async (req, res) => {
  try {
    const [rows] = await pool('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// POST contact form
router.post('/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone, message } = req.body;

  try {
    await pool(
      'INSERT INTO contacts (name, phone, message) VALUES (?, ?, ?) RETURNING id',
      [name, phone, message]
    );
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

export default router;
