const express = require('express');
const { sendEmail, getSiteContent } = require('../utils/email');
const { generateEmailTemplate } = require('../utils/emailTemplate');
const { authRequired, adminRequired } = require('../middleware/auth');
const router = express.Router();

// GET all contact messages (Admin only)
router.get('/messages', authRequired, adminRequired, async (req, res) => {
  try {
    const pool = require('../config/db');
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST reply to a message (Admin only)
router.post('/reply/:id', authRequired, adminRequired, async (req, res) => {
  const { replyText } = req.body;
  if (!replyText) return res.status(400).json({ error: 'Reply text is required' });

  try {
    const pool = require('../config/db');
    const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) return res.status(404).json({ error: 'Message not found' });
    const msg = rows[0];

    const siteData = await getSiteContent();
    const emailHtml = generateEmailTemplate({
      title: `Re: ${msg.subject || 'Your Inquiry'}`,
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="[Site Logo]" alt="[Site Name] Logo" style="max-height: 50px;" />
        </div>
        <h2 style="color: #0f172a; text-align: center;">Re: ${msg.subject || 'Your Inquiry'}</h2>
        <p style="color: #334155; font-size: 16px;">${replyText.replace(/\n/g, '<br/>')}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #64748b; font-size: 14px;"><strong>Your Original Message:</strong><br/>${msg.message.replace(/\n/g, '<br/>')}</p>
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">
          <p>© ${new Date().getFullYear()} [Site Name]. All rights reserved.</p>
          <p>Questions? Reach us at [WhatsApp] or [Phone]</p>
        </div>
      </div>`,
      siteData
    });

    const result = await sendEmail(msg.email, `Re: ${msg.subject || 'Your Inquiry'}`, replyText, emailHtml);
    
    if (result.success) {
      await pool.query('UPDATE contact_messages SET replied = TRUE WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Reply sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send reply email' });
    }
  } catch (err) {
    console.error("Error replying to message:", err);
    res.status(500).json({ error: 'Database error while sending reply' });
  }
});

// DELETE a contact message (Admin only)
router.delete('/messages/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const pool = require('../config/db');
    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

router.post('/send', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text/html' });
  }

  try {
    const pool = require('../config/db');
    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [req.body.name || 'Unknown', req.body.email || to, subject, text]
    );

    const siteData = await getSiteContent();
    const emailHtml = generateEmailTemplate({
      title: subject,
      content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="[Site Logo]" alt="[Site Name] Logo" style="max-height: 50px;" />
        </div>
        <h2 style="color: #0f172a; text-align: center;">We've received your message</h2>
        <p style="color: #334155; font-size: 16px;">Hi ${req.body.name || 'there'},</p>
        <p style="color: #334155; font-size: 16px;">Thank you for contacting us! We have received your message regarding <strong>${subject}</strong> and will get back to you as soon as possible.</p>
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">
          <p>© ${new Date().getFullYear()} [Site Name]. All rights reserved.</p>
          <p>Need urgent help? Call us at [Phone] or WhatsApp [WhatsApp]</p>
        </div>
      </div>`,
      siteData
    });

    const result = await sendEmail(to, subject, text, emailHtml);

    // We consider it a success because it's safely in the database, even if SMTP fails.
    if (result.success) {
      res.json({ success: true, message: 'Message saved and email sent successfully', messageId: result.messageId });
    } else {
      res.json({ success: true, message: 'Message saved (Email failed to send, but we got it)' });
    }
  } catch (err) {
    console.error("Error handling contact message:", err);
    res.status(500).json({ success: false, error: 'Database error while saving message' });
  }
});

module.exports = router;
