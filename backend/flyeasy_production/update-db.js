const db = require('./config/db');
async function run() {
  try {
    const columns = [
      'site_name VARCHAR(255)',
      'contact_hours VARCHAR(255)',
      'contact_map_url VARCHAR(500)',
      'seo_description TEXT',
      'seo_keywords VARCHAR(500)',
      'favicon_url VARCHAR(500)',
      'social_facebook VARCHAR(500)',
      'social_instagram VARCHAR(500)',
      'social_twitter VARCHAR(500)',
      'social_youtube VARCHAR(500)',
      'social_linkedin VARCHAR(500)',
      'cookie_banner_text TEXT',
      'registration_open BOOLEAN DEFAULT TRUE',
      'admin_url_slug VARCHAR(255) DEFAULT \'admin\''
    ];
    for (const col of columns) {
      const colName = col.split(' ')[0];
      try {
        await db.query(`ALTER TABLE site_content ADD COLUMN ${col}`);
        console.log(`Added column ${colName}`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${colName} already exists`);
        } else {
          console.error(`Error adding column ${colName}: ${e.message}`);
        }
      }
    }
    console.log('Done');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
