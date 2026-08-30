const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');
require('dotenv').config();

const store_id = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || 'testbox@ssl';
const is_live = process.env.SSLCOMMERZ_IS_SANDBOX === 'false'; // false for sandbox

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Initialize Payment
router.post('/init', optionalAuth, async (req, res) => {
  try {
    const { items, customer, totalAmount } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ error: "No items provided for checkout." });
    }

    const tran_id = `TXN_${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;

    // 1. Create bookings in DB as 'pending' linked by transaction_id
    for (const item of items) {
      const bookingId = uuidv4();
      await pool.query(
        `INSERT INTO bookings (id, user_id, package_id, package_title, item_type, customer_name, customer_email, customer_phone, travel_date, number_of_travelers, status, total_price, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
        [
          bookingId,
          req.user ? req.user.id : null,
          item.id,
          item.title,
          item.type,
          customer.name,
          customer.email,
          customer.phone,
          item.travel_date || null,
          item.guests || 1,
          item.price,
          tran_id
        ]
      );
    }

    // 2. Prepare SSLCommerz Data
    const data = {
      total_amount: totalAmount,
      currency: 'BDT',
      tran_id: tran_id, // use unique tran_id for each api call
      success_url: `${BACKEND_URL}/api/payment/success`,
      fail_url: `${BACKEND_URL}/api/payment/fail`,
      cancel_url: `${BACKEND_URL}/api/payment/cancel`,
      ipn_url: `${BACKEND_URL}/api/payment/ipn`,
      shipping_method: 'NO',
      product_name: 'Trip Booking',
      product_category: 'Travel',
      product_profile: 'general',
      cus_name: customer.name || 'Customer Name',
      cus_email: customer.email || 'customer@example.com',
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: customer.phone || '01700000000',
    };

    // 3. Initialize SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then(apiResponse => {
      // Redirect the user to payment gateway
      let GatewayPageURL = apiResponse.GatewayPageURL;
      if (GatewayPageURL) {
        res.status(200).json({ url: GatewayPageURL });
      } else {
        res.status(400).json({ error: "Failed to generate payment url", details: apiResponse });
      }
    });

  } catch (error) {
    console.error('Payment init error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment Success Callback
router.post('/success', async (req, res) => {
  try {
    const { tran_id } = req.body;
    // Note: In a real production app, you should validate the transaction via SSLCommerz Validation API here before updating DB.
    
    // Update bookings
    await pool.query(
      `UPDATE bookings SET status = 'paid' WHERE transaction_id = ?`,
      [tran_id]
    );

    // Redirect to frontend success page
    res.redirect(`${BASE_URL}/payment/success?tran_id=${tran_id}`);
  } catch (error) {
    res.redirect(`${BASE_URL}/payment/fail`);
  }
});

// Payment Fail Callback
router.post('/fail', async (req, res) => {
  const { tran_id } = req.body;
  await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE transaction_id = ?`, [tran_id]);
  res.redirect(`${BASE_URL}/payment/fail`);
});

// Payment Cancel Callback
router.post('/cancel', async (req, res) => {
  const { tran_id } = req.body;
  await pool.query(`UPDATE bookings SET status = 'cancelled' WHERE transaction_id = ?`, [tran_id]);
  res.redirect(`${BASE_URL}/payment/cancel`);
});

// IPN Callback (Background notification from SSLCommerz)
router.post('/ipn', async (req, res) => {
  try {
    const { tran_id, status } = req.body;
    
    if (status === 'VALID' || status === 'VALIDATED') {
      await pool.query(
        `UPDATE bookings SET status = 'paid' WHERE transaction_id = ? AND status = 'pending'`,
        [tran_id]
      );
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      await pool.query(
        `UPDATE bookings SET status = 'cancelled' WHERE transaction_id = ? AND status = 'pending'`,
        [tran_id]
      );
    }
    res.status(200).send('IPN Received');
  } catch (error) {
    res.status(500).send('Error');
  }
});

module.exports = router;
