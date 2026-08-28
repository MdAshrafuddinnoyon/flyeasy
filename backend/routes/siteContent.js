const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

const CONTENT_COLUMNS = [
  'site_name', 'site_domain',
  'hero_badge', 'hero_headline', 'hero_subheadline', 'hero_image_url', 'about_mission',
  'contact_phone', 'contact_whatsapp', 'contact_email', 'support_email',
  'contact_address', 'contact_hours', 'contact_map_url',
  'footer_about', 'footer_links', 'header_links',
  'seo_description', 'seo_keywords', 'favicon_url',
  'logo_light_url', 'logo_dark_url',
  'social_facebook', 'social_instagram', 'social_twitter', 'social_youtube', 'social_linkedin',
  'cookie_banner_text', 'registration_open',
  'developer_name', 'developer_tagline', 'developer_website',
  'admin_url_slug',
  'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass',
  'email_sender_name', 'email_sender_email', 'email_logo_url',
  'about_show_stats', 'about_show_team', 'about_show_certs', 'about_show_faqs', 'about_show_airlines', 'about_show_partners'
];

// Site content is a singleton row — GET returns the first (only) row, creating a default if missing.
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_content LIMIT 1');
    if (rows.length) {
      const row = rows[0];
      try { if (typeof row.header_links === 'string') row.header_links = JSON.parse(row.header_links); } catch(e){}
      try { if (typeof row.footer_links === 'string') row.footer_links = JSON.parse(row.footer_links); } catch(e){}
      return res.json(row);
    }
    const id = uuidv4();
    await pool.query(
      `INSERT INTO site_content (id, site_name, hero_headline, hero_subheadline, about_mission, admin_url_slug) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id, 
        'FlyEasy', 
        'Effortless travel, elevated',
        "Effortless booking, transparent pricing, and curated travel experiences — from Cox's Bazar to the Maldives.",
        'Based in Chattogram, FlyEasy Tourism is on a mission to make travel across Bangladesh — and beyond — effortless, transparent and memorable.',
        'admin'
      ]
    );
    const [created] = await pool.query('SELECT * FROM site_content WHERE id = ?', [id]);
    res.json(created[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', authRequired, adminRequired, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM site_content LIMIT 1');
    const data = {};
    for (const col of CONTENT_COLUMNS) {
      if (req.body[col] !== undefined) {
        if (typeof req.body[col] === 'object' && req.body[col] !== null) {
          data[col] = JSON.stringify(req.body[col]);
        } else {
          data[col] = req.body[col];
        }
      }
    }
    const cols = Object.keys(data);
    if (!existing.length) {
      const id = uuidv4();
      await pool.query(
        `INSERT INTO site_content (id, ${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (?, ${cols.map(() => '?').join(', ')})`,
        [id, ...cols.map((c) => data[c])]
      );
      const [rows] = await pool.query('SELECT * FROM site_content WHERE id = ?', [id]);
      return res.json(rows[0]);
    }
    const setClause = cols.map((c) => `\`${c}\` = ?`).join(', ');
    await pool.query(`UPDATE site_content SET ${setClause} WHERE id = ?`, [...cols.map((c) => data[c]), existing[0].id]);
    const [rows] = await pool.query('SELECT * FROM site_content WHERE id = ?', [existing[0].id]);
    const row = rows[0];
    try { if (typeof row.header_links === 'string') row.header_links = JSON.parse(row.header_links); } catch(e){}
    try { if (typeof row.footer_links === 'string') row.footer_links = JSON.parse(row.footer_links); } catch(e){}
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
