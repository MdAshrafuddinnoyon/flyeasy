const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');

// Get user favorites (for client portal)
router.get('/my', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, 
        p.title as package_title, p.image_url as package_image, 
        h.name as hotel_name, h.image_url as hotel_image 
      FROM favorites f
      LEFT JOIN packages p ON f.item_type = 'package' AND f.item_id = p.id
      LEFT JOIN hotels h ON f.item_type = 'hotel' AND f.item_id = h.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorites (for admin dashboard "Leads")
router.get('/all', authRequired, adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, 
        u.name as user_name, u.email as user_email, u.phone as user_phone,
        p.title as package_title, h.name as hotel_name 
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      LEFT JOIN packages p ON f.item_type = 'package' AND f.item_id = p.id
      LEFT JOIN hotels h ON f.item_type = 'hotel' AND f.item_id = h.id
      ORDER BY f.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle favorite (Add/Remove)
router.post('/toggle', authRequired, async (req, res) => {
  try {
    const { item_id, item_type } = req.body;
    if (!item_id || !item_type) {
      return res.status(400).json({ error: 'item_id and item_type required' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND item_id = ? AND item_type = ?',
      [req.user.id, item_id, item_type]
    );

    if (existing.length > 0) {
      // Remove
      await pool.query('DELETE FROM favorites WHERE id = ?', [existing[0].id]);
      res.json({ success: true, favorited: false });
    } else {
      // Add
      await pool.query(
        'INSERT INTO favorites (user_id, item_id, item_type) VALUES (?, ?, ?)',
        [req.user.id, item_id, item_type]
      );
      res.json({ success: true, favorited: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if specific items are favorited
router.post('/check', authRequired, async (req, res) => {
  try {
    const { items } = req.body; // [{item_id, item_type}]
    if (!items || !Array.isArray(items) || items.length === 0) return res.json({});
    
    // We can do this with one query or multiple. Since list is small, an IN clause is best, but tuples are tricky.
    // simpler: fetch all favorites for this user and filter.
    const [rows] = await pool.query('SELECT item_id, item_type FROM favorites WHERE user_id = ?', [req.user.id]);
    const favSet = new Set(rows.map(r => `${r.item_type}_${r.item_id}`));
    
    const result = {};
    for (const item of items) {
      result[item.item_id] = favSet.has(`${item.item_type}_${item.item_id}`);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
