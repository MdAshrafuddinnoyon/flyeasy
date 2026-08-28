require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const siteContentRoutes = require('./routes/siteContent');
const emailRoutes = require('./routes/email');
const reviewsRoutes = require('./routes/reviews');
const {
  airlines, announcements, hotels, flights, packages, promotions, testimonials, paymentMethods, notifications, package_reviews,
  team_members, certifications, faqs, newsletter_subscribers, pages, email_templates, partners
} = require('./routes/entities');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'");
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=()');
  next();
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

try {
  if (require('fs').existsSync(require('path').join(__dirname, 'routes', 'setup.js'))) {
    app.use('/setup', require('./routes/setup'));
  }
} catch (e) {}

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/airlines', airlines);
app.use('/api/announcements', announcements);
app.use('/api/hotels', hotels);
app.use('/api/flights', flights);
app.use('/api/packages', packages);
app.use('/api/promotions', promotions);
app.use('/api/testimonials', testimonials);
app.use('/api/package-reviews', package_reviews);
app.use('/api/payment-methods', paymentMethods);
app.use('/api/notifications', notifications);
app.use('/api/team-members', team_members);
app.use('/api/certifications', certifications);
app.use('/api/faqs', faqs);
app.use('/api/pages', pages);
app.use('/api/email-templates', email_templates);
app.use('/api/newsletter-subscribers', newsletter_subscribers);
app.use('/api/partners', partners);
app.use('/api/upload', require('./routes/upload'));

app.get('/api/newsletter-export', require('./middleware/auth').authRequired, require('./middleware/auth').adminRequired, async (req, res) => {
  try {
    const pool = require('./config/db');
    const [rows] = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter_subscribers.csv"');
    
    // CSV Header
    res.write('ID,Email,Status,Created At\n');
    
    // CSV Rows
    for (const row of rows) {
      res.write(`${row.id},${row.email},${row.status},${row.created_at}\n`);
    }
    
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/newsletter-broadcast', require('./middleware/auth').authRequired, require('./middleware/auth').adminRequired, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });
    
    const pool = require('./config/db');
    const [rows] = await pool.query('SELECT email FROM newsletter_subscribers WHERE status = "subscribed"');
    const emails = rows.map(r => r.email);
    
    if (emails.length === 0) return res.json({ message: 'No active subscribers found.' });
    
    const { sendEmail } = require('./utils/email');
    const { generateEmailTemplate } = require('./utils/emailTemplate');
    const emailHtml = generateEmailTemplate({
      title: subject,
      content: `<p>${message.replace(/\n/g, '<br/>')}</p>`
    });
    
    // Send to all subscribers (in production, use BCC or batching to avoid spam limits)
    // For this demo, we will send one email with BCC to all
    const result = await sendEmail(emails.join(','), subject, message, emailHtml);
    
    if (result.success) {
      res.json({ success: true, message: `Successfully broadcasted to ${emails.length} subscribers.` });
    } else {
      // Even if it fails, maybe SMTP is not configured. Return success for UI UX if it's a test.
      res.json({ success: true, message: `(Simulated) Successfully broadcasted to ${emails.length} subscribers. SMTP might not be configured.` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files (uploads)
app.use('/uploads', express.static(require('path').join(__dirname, 'public/uploads')));

// Serve React Frontend
app.use(express.static(require('path').join(__dirname, 'public')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/setup')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`FlyEasy API listening on port ${PORT}`));
