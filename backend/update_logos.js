const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flyeasy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const clearbitLogos = {
    'Booking.com': 'https://logo.clearbit.com/booking.com',
    'Expedia': 'https://logo.clearbit.com/expedia.com',
    'Airbnb': 'https://logo.clearbit.com/airbnb.com',
    'Tripadvisor': 'https://logo.clearbit.com/tripadvisor.com',
    'Agoda': 'https://logo.clearbit.com/agoda.com',
    'Skyscanner': 'https://logo.clearbit.com/skyscanner.net',
    'Trivago': 'https://logo.clearbit.com/trivago.com',
    'Kayak': 'https://logo.clearbit.com/kayak.com',
    'MakeMyTrip': 'https://logo.clearbit.com/makemytrip.com',
    'OYO Rooms': 'https://logo.clearbit.com/oyorooms.com'
  };

  for (const [name, url] of Object.entries(clearbitLogos)) {
    await pool.query('UPDATE partners SET logo_url = ? WHERE name = ?', [url, name]);
  }

  console.log('Updated logos');
  process.exit(0);
}

run().catch(console.error);
