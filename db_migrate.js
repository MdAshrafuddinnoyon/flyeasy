const pool = require('./backend/config/db');

(async () => {
  try {
    console.log("Altering site_content table...");
    try { await pool.query('ALTER TABLE site_content ADD COLUMN header_links JSON'); } catch (e) { console.log(e.message) }
    try { await pool.query('ALTER TABLE site_content ADD COLUMN footer_links JSON'); } catch (e) { console.log(e.message) }
    try { await pool.query('ALTER TABLE site_content ADD COLUMN contact_hours VARCHAR(255)'); } catch (e) { console.log(e.message) }
    try { await pool.query('ALTER TABLE site_content ADD COLUMN contact_map_url TEXT'); } catch (e) { console.log(e.message) }
    console.log("Done");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
