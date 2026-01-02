import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT * FROM services ORDER BY created_at DESC'
    );
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Get single service (public)
router.get('/:id', async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT * FROM services WHERE id = ?',
      [req.params.id]
    );
    
    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(services[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

// Create new service (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, price } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO services (title, description, price) VALUES (?, ?, ?)',
      [title, description, price || null]
    );
    
    res.status(201).json({
      message: 'Service created successfully',
      serviceId: result.insertId
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Failed to create service' });
  }
});

// Update service (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const { id } = req.params;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const [result] = await db.query(
      'UPDATE services SET title = ?, description = ?, price = ? WHERE id = ?',
      [title, description, price || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Failed to update service' });
  }
});

// Delete service (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM services WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

export default router;
