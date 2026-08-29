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

  const logos = [
    { name: 'Booking.com', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Booking.com_Logo.svg/1200px-Booking.com_Logo.svg.png' },
    { name: 'Expedia', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Expedia_logo.svg/1200px-Expedia_logo.svg.png' },
    { name: 'Airbnb', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1200px-Airbnb_Logo_B%C3%A9lo.svg.png' },
    { name: 'Tripadvisor', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/TripAdvisor_Logo.svg/1200px-TripAdvisor_Logo.svg.png' },
    { name: 'Agoda', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Agoda_logo.svg/1200px-Agoda_logo.svg.png' },
    { name: 'Skyscanner', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Skyscanner_Logo.svg/1200px-Skyscanner_Logo.svg.png' },
    { name: 'Trivago', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Trivago_logo.svg/1200px-Trivago_logo.svg.png' },
    { name: 'Kayak', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/KAYAK_logo.svg/1200px-KAYAK_logo.svg.png' },
    { name: 'MakeMyTrip', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/MakeMyTrip_Logo.svg/1200px-MakeMyTrip_Logo.svg.png' },
    { name: 'OYO Rooms', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/OYO_Rooms_Logo.svg/1200px-OYO_Rooms_Logo.svg.png' },
  ];

  for (let i = 0; i < logos.length; i++) {
    const l = logos[i];
    await pool.query('INSERT INTO partners (name, logo_url, active, sort_order) VALUES (?, ?, ?, ?)', [l.name, l.logo_url, 1, i]);
  }

  console.log('Inserted logos');
  process.exit(0);
}

run().catch(console.error);
