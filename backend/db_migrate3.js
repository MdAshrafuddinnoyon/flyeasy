const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flyeasymysql',
  });

  const columnsToAdd = [
    'services_headline TEXT',
    'services_subheadline TEXT',
    'services_card_title VARCHAR(255)',
    'services_card_subtitle VARCHAR(255)',
    'services_card_desc TEXT',
    'services_img_left_1 VARCHAR(255)',
    'services_img_left_2 VARCHAR(255)',
    'services_img_right VARCHAR(255)'
  ];

  for (const colDef of columnsToAdd) {
    const colName = colDef.split(' ')[0];
    try {
      await pool.query(`ALTER TABLE site_content ADD COLUMN ${colDef}`);
      console.log(`Added ${colName}`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`${colName} already exists`);
      } else {
        console.error(e);
      }
    }
  }
  pool.end();
}
migrate();
