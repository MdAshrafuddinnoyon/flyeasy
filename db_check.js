const pool = require('./backend/config/db');

(async () => {
  try {
    const [packages] = await pool.query('SELECT id, title, image_url FROM packages');
    console.log("Packages:", JSON.stringify(packages, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
