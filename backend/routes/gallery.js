import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all gallery items (public)
router.get('/', async (req, res) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM gallery ORDER BY created_at DESC'
    );
    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Failed to fetch gallery items' });
  }
});

// Get single gallery item (public)
router.get('/:id', async (req, res) => {
  try {
    const [items] = await db.query(
      'SELECT * FROM gallery WHERE id = ?',
      [req.params.id]
    );
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(items[0]);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ message: 'Failed to fetch gallery item' });
  }
});

// Create new gallery item (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { image_url, title } = req.body;
    
    if (!image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO gallery (image_url, title) VALUES (?, ?)',
      [image_url, title || null]
    );
    
    res.status(201).json({
      message: 'Gallery item created successfully',
      itemId: result.insertId
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Failed to create gallery item' });
  }
});

// Update gallery item (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { image_url, title } = req.body;
    const { id } = req.params;
    
    if (!image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }
    
    const [result] = await db.query(
      'UPDATE gallery SET image_url = ?, title = ? WHERE id = ?',
      [image_url, title || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json({ message: 'Gallery item updated successfully' });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Failed to update gallery item' });
  }
});

// Delete gallery item (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM gallery WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Failed to delete gallery item' });
  }
});

export default router;
