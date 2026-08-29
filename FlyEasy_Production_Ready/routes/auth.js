const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, phone: user.phone, role: user.role, name: user.name, avatar_url: user.avatar_url },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ error: 'Name, email/phone, and password are required' });
    }
    
    // Check if email or phone already exists
    let existingQuery = 'SELECT id FROM users WHERE ';
    let existingParams = [];
    if (email && phone) {
      existingQuery += 'email = ? OR phone = ?';
      existingParams.push(email, phone);
    } else if (email) {
      existingQuery += 'email = ?';
      existingParams.push(email);
    } else {
      existingQuery += 'phone = ?';
      existingParams.push(phone);
    }
    
    const [existing] = await pool.query(existingQuery, existingParams);
    if (existing.length) return res.status(409).json({ error: 'Email or phone already registered' });

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email || null, phone || null, passwordHash, 'client']
    );
    const user = { id, name, email, phone, role: 'client', avatar_url: null };
    res.status(201).json({ user, token: signToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? OR phone = ?', [identifier, identifier]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const safeUser = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar_url: user.avatar_url };
    res.json({ user: safeUser, token: signToken(safeUser) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, role, avatar_url, reward_points FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update own profile
router.put('/me', authRequired, async (req, res) => {
  try {
    const { name, phone, avatar_url } = req.body;
    await pool.query('UPDATE users SET name = ?, phone = ?, avatar_url = ? WHERE id = ?', [name, phone || null, avatar_url || null, req.user.id]);
    const [rows] = await pool.query('SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = ?', [req.user.id]);
    const updatedUser = rows[0];
    res.json({ user: updatedUser, token: signToken(updatedUser) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update own password
router.put('/me/password', authRequired, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password are required' });
    
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Incorrect current password' });
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Forgot Password (returns success without email)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    // Check if user exists
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    
    // In a real app, send email with token here. For this demo, just return success.
    res.json({ success: true, message: 'Reset code sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mock Reset Password (resets password if email exists)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password are required' });
    
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email]);
    
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin User Management Routes
router.get('/users', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const [rows] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/role', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const { role } = req.body;
    if (!['client', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const { name, email, phone, password, role } = req.body;
    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ error: 'Name, email/phone, and password are required' });
    }
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email || null, phone || null, passwordHash, role || 'client']
    );
    res.status(201).json({ success: true, user: { id, name, email, phone, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const { name, email, phone } = req.body;
    await pool.query('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email || null, phone || null, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/password', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
