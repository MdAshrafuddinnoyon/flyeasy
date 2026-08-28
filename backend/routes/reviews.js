const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Get completed bookings that need review for the logged-in client
router.get('/pending', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all completed bookings
    const [bookings] = await pool.query(
      `SELECT b.id as booking_id, b.item_type, b.package_id as item_id, b.package_title as item_title 
       FROM bookings b 
       WHERE b.user_id = ? AND b.status = 'completed'`,
      [userId]
    );

    if (!bookings.length) return res.json([]);

    // Find all reviews by this user
    const [reviews] = await pool.query(
      `SELECT booking_id FROM reviews WHERE user_id = ? AND booking_id IS NOT NULL`,
      [userId]
    );

    const reviewedBookingIds = new Set(reviews.map(r => r.booking_id));
    
    // Filter bookings that don't have a review yet
    const pendingReviews = bookings.filter(b => !reviewedBookingIds.has(b.booking_id));

    res.json(pendingReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reviews for the logged-in user
router.get('/mine', authRequired, async (req, res) => {
  try {
    const [reviews] = await pool.query(
      `SELECT r.*, b.package_title as item_title 
       FROM reviews r
       LEFT JOIN bookings b ON r.booking_id = b.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a new review
router.post('/', authRequired, async (req, res) => {
  try {
    const { booking_id, item_id, item_type, rating, text } = req.body;
    
    if (!booking_id || !item_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    await pool.query(
      `INSERT INTO reviews (id, user_id, customer_name, item_id, item_type, booking_id, rating, text, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [id, req.user.id, req.user.name, item_id, item_type || 'package', booking_id, rating, text || null]
    );

    // Also update the average rating for the item (simplification)
    // In a real system, you might want to only update rating after 'approved' status
    
    res.status(201).json({ success: true, message: 'Review submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
