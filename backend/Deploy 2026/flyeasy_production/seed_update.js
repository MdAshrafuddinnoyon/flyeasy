
const pool = require('./config/db');

async function seedUpdate() {
  try {
    await pool.query('UPDATE hotels SET rating = 4.8, reviews_count = 120 WHERE rating IS NULL');
    await pool.query('UPDATE packages SET rating = 4.9, reviews_count = 250, duration_days = 3 WHERE rating IS NULL');
    console.log('Update complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seedUpdate();

