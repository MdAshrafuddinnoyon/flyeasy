
const pool = require('./config/db');

async function check() {
  try {
    const [users] = await pool.query('DESCRIBE users');
    const [site] = await pool.query('DESCRIBE site_content');
    console.log('USERS:', users);
    console.log('SITE:', site);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();

