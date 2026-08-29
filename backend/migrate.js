const pool = require('./config/db');

async function migrate() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL;');
    console.log('Added phone column to users.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log('phone column already exists.');
    else console.error('Error adding phone:', err);
  }

  try {
    await pool.query('ALTER TABLE site_content ADD COLUMN admin_url_slug VARCHAR(100) DEFAULT "admin";');
    await pool.query('UPDATE site_content SET admin_url_slug = "admin" WHERE admin_url_slug IS NULL;');
    console.log('Added admin_url_slug column to site_content.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log('admin_url_slug column already exists.');
    else console.error('Error adding admin_url_slug:', err);
  }

  process.exit(0);
}
migrate();
