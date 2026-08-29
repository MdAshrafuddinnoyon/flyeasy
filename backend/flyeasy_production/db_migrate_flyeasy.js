const pool = require('./config/db');

async function migrate() {
  console.log("Starting DB migration for new features...");

  try {
    // 1. Modify bookings.item_type enum to include 'guide'
    console.log("Updating bookings item_type enum...");
    await pool.query("ALTER TABLE bookings MODIFY COLUMN item_type ENUM('package', 'hotel', 'flight', 'guide') DEFAULT 'package'");
    
    // 2. Create favorites table
    console.log("Creating favorites table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        item_id CHAR(36) NOT NULL,
        item_type ENUM('package', 'hotel') NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_item_unique (user_id, item_id, item_type),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 3. Add reward_points to users table if it doesn't exist
    console.log("Checking if reward_points exists in users...");
    const [userColumns] = await pool.query("SHOW COLUMNS FROM users LIKE 'reward_points'");
    if (userColumns.length === 0) {
      console.log("Adding reward_points column to users...");
      await pool.query("ALTER TABLE users ADD COLUMN reward_points INT DEFAULT 0 AFTER role");
    }

    // 4. Seed Partners data if empty
    console.log("Checking partners table...");
    const [partners] = await pool.query("SELECT count(*) as count FROM partners");
    if (partners[0].count === 0) {
      console.log("Seeding partners data...");
      const seeds = [
        ['Emirates', 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg', 1, 1],
        ['Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_Logo.svg', 1, 2],
        ['Booking.com', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Booking.com_Icon_2022.svg', 1, 3],
        ['Expedia', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Expedia_logo.svg', 1, 4]
      ];
      for (const p of seeds) {
        await pool.query("INSERT INTO partners (name, logo_url, active, sort_order) VALUES (?, ?, ?, ?)", p);
      }
    }

    // 5. Add rewards_active to site_content if not exists
    console.log("Checking rewards_active in site_content...");
    const [siteCols] = await pool.query("SHOW COLUMNS FROM site_content LIKE 'rewards_active'");
    if (siteCols.length === 0) {
      console.log("Adding rewards_active column to site_content...");
      await pool.query("ALTER TABLE site_content ADD COLUMN rewards_active BOOLEAN DEFAULT false");
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrate();
