require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flyeasy'
  });

  const columnsToAdd = [
    { name: 'flights_hero_url', type: 'TEXT' },
    { name: 'hotels_hero_url', type: 'TEXT' },
    { name: 'packages_hero_url', type: 'TEXT' },
    { name: 'promotions_hero_url', type: 'TEXT' },
    { name: 'about_hero_url', type: 'TEXT' },
    { name: 'contact_hero_url', type: 'TEXT' },
    { name: 'cta_bg_image_url', type: 'TEXT' },
    { name: 'process_bg_image_url', type: 'TEXT' },
    { name: 'home_hero_type', type: 'VARCHAR(50)' },
    { name: 'hero_video_url', type: 'TEXT' },
    { name: 'hero_border_radius', type: 'VARCHAR(50)' },
    { name: 'not_found_bg_url', type: 'TEXT' },
    { name: 'reviews_auto_slide', type: 'BOOLEAN DEFAULT TRUE' },
    { name: 'rewards_active', type: 'BOOLEAN DEFAULT FALSE' }
  ];

  console.log('Connecting to database and updating site_content table...');

  for (const col of columnsToAdd) {
    try {
      await connection.query(`ALTER TABLE site_content ADD COLUMN ${col.name} ${col.type}`);
      console.log(`✅ Added column ${col.name}`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`ℹ️ Column ${col.name} already exists. Skipping.`);
      } else {
        console.error(`❌ Error adding column ${col.name}:`, e.message);
      }
    }
  }

  console.log('Finished DB updates.');
  await connection.end();
}

updateDB();
