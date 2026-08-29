const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { authRequired, adminRequired, optionalAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { sendEmail } = require('../utils/email');
const { generateEmailTemplate } = require('../utils/emailTemplate');

const router = express.Router();

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Increased limit
  message: { error: 'Too many booking requests from this IP, please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const BOOKING_COLUMNS = [
  'user_id', 'package_id', 'package_title', 'item_type', 'customer_name',
  'customer_email', 'customer_phone', 'travel_date', 'number_of_travelers',
  'message', 'status', 'total_price', 'transaction_id',
];

// Create a booking — open to any authenticated client OR guest
router.post('/', optionalAuth, bookingLimiter, async (req, res) => {
  try {
    const id = uuidv4();
    const data = { status: 'pending' };
    
    if (req.user && req.user.id) {
      data.user_id = req.user.id;
    }
    for (const col of BOOKING_COLUMNS) {
      if (req.body[col] !== undefined) data[col] = req.body[col];
    }
    const cols = Object.keys(data);
    const values = cols.map((c) => data[c]);
    await pool.query(
      `INSERT INTO bookings (id, ${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (?, ${cols.map(() => '?').join(', ')})`,
      [id, ...values]
    );
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    // Send email notification to info@flyeasytourism.com
    try {
      const emailHtml = `
        <h2>New Booking Request</h2>
        <p><strong>Package/Hotel:</strong> ${data.package_title || 'N/A'}</p>
        <p><strong>Name:</strong> ${data.customer_name}</p>
        <p><strong>Email:</strong> ${data.customer_email}</p>
        <p><strong>Phone:</strong> ${data.customer_phone}</p>
        <p><strong>Travel Date:</strong> ${data.travel_date || 'N/A'}</p>
        <p><strong>Travelers:</strong> ${data.number_of_travelers || 1}</p>
        <p><strong>Message:</strong> ${data.message || 'None'}</p>
        <p><strong>Total Price:</strong> ৳${data.total_price || 0}</p>
      `;
      const finalHtml = generateEmailTemplate({
        title: 'New Booking Received',
        content: emailHtml
      });
      await sendEmail('info@flyeasytourism.com', `New Booking: ${data.package_title || 'N/A'} - ${data.customer_name}`, 'New booking received.', finalHtml);
    } catch (e) {
      console.error('Failed to send booking email:', e);
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List bookings — clients see only their own, admins see all
router.get('/', authRequired, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
      return res.json(rows);
    }
    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update booking status/details — admin only
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const [oldRows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (!oldRows.length) return res.status(404).json({ error: 'Not found' });
    const oldBooking = oldRows[0];

    const data = {};
    for (const col of BOOKING_COLUMNS) {
      if (req.body[col] !== undefined) data[col] = req.body[col];
    }
    const cols = Object.keys(data);
    if (!cols.length) return res.status(400).json({ error: 'No fields to update' });
    
    const setClause = cols.map((c) => `\`${c}\` = ?`).join(', ');
    await pool.query(`UPDATE bookings SET ${setClause} WHERE id = ?`, [...cols.map((c) => data[c]), req.params.id]);
    
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    const updatedBooking = rows[0];

    // Status changed -> trigger Notification & Automated Email
    if (data.status && data.status !== oldBooking.status && updatedBooking.customer_email) {
      
      // REWARDS LOGIC: If confirmed, package booking, max 2 in month
      if (data.status === 'confirmed' && updatedBooking.item_type === 'package' && updatedBooking.user_id) {
        try {
          const [siteRows] = await pool.query('SELECT rewards_active FROM site_content LIMIT 1');
          if (siteRows.length > 0 && siteRows[0].rewards_active) {
            // Check trips in same month
            const [tripCountRows] = await pool.query(`
              SELECT COUNT(*) as count FROM bookings 
              WHERE user_id = ? AND item_type = 'package' AND status IN ('confirmed', 'completed', 'paid')
              AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
            `, [updatedBooking.user_id]);
            
            // Allow if this is the 1st or 2nd trip this month
            if (tripCountRows[0].count <= 2) {
              const rewardPoints = 100; // Reward per booking
              await pool.query('UPDATE users SET reward_points = reward_points + ? WHERE id = ?', [rewardPoints, updatedBooking.user_id]);
              
              // Add a notification about rewards
              const rNotifId = uuidv4();
              await pool.query(
                'INSERT INTO notifications (id, user_email, title, message, type) VALUES (?, ?, ?, ?, ?)',
                [rNotifId, updatedBooking.customer_email, 'Rewards Earned!', `You earned ${rewardPoints} points for your recent package booking! You can redeem them for discounts on future trips.`, 'booking']
              );
            }
          }
        } catch(rErr) {
          console.error("Reward logic error:", rErr);
        }
      }

      // 1. Create Notification
      const notifId = uuidv4();
      await pool.query(
        'INSERT INTO notifications (id, user_email, title, message, type) VALUES (?, ?, ?, ?, ?)',
        [notifId, updatedBooking.customer_email, 'Booking Status Updated', `Your booking for ${updatedBooking.package_title || 'a package'} is now ${updatedBooking.status}.`, 'booking']
      );

      // 2. Send Automated Email using template
      try {
        const [templates] = await pool.query('SELECT subject, body_html FROM email_templates WHERE name = "Booking Status Update" AND active = true');
        if (templates.length > 0) {
          const t = templates[0];
          let subject = t.subject.replace(/\\[Status\\]/g, updatedBooking.status.toUpperCase());
          let html = t.body_html
            .replace(/\\[Customer Name\\]/g, updatedBooking.customer_name || 'Customer')
            .replace(/\\[Booking ID\\]/g, updatedBooking.id.substring(0, 8).toUpperCase())
            .replace(/\\[Status\\]/g, updatedBooking.status.toUpperCase())
            .replace(/\\[Package Name\\]/g, updatedBooking.package_title || 'N/A')
            .replace(/\\[Travel Date\\]/g, updatedBooking.travel_date || 'N/A');
          
          await sendEmail(updatedBooking.customer_email, subject, `Your booking status is now ${updatedBooking.status}.`, html);
        }
      } catch (emailErr) {
        console.error('Failed to send status update email:', emailErr);
      }
    }

    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
