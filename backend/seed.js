
const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  try {
    // 1. Hotels
    await pool.query('INSERT INTO hotels (id, name, location, city, star_rating, price_per_night, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [uuidv4(), 'The Peninsula Chittagong', 'GEC Circle', 'Chittagong', 4, 8500, '/images/maldives.jpg', true]);
    await pool.query('INSERT INTO hotels (id, name, location, city, star_rating, price_per_night, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [uuidv4(), 'Sayeman Beach Resort', 'Marine Drive', 'Coxs Bazar', 5, 12000, '/images/coxs_bazar.jpg', true]);
    await pool.query('INSERT INTO hotels (id, name, location, city, star_rating, price_per_night, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [uuidv4(), 'Radisson Blu', 'SS Khaled Road', 'Chittagong', 5, 15000, '/images/hero.jpg', true]);
    await pool.query('INSERT INTO hotels (id, name, location, city, star_rating, price_per_night, image_url, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [uuidv4(), 'Ocean Paradise', 'Kolatoli', 'Coxs Bazar', 4, 9000, '/images/maldives.jpg', true]);

    // 2. Packages
    await pool.query('INSERT INTO packages (id, title, slug, destination, price, image_url, category, featured, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [uuidv4(), 'Coxs Bazar Beach Holiday', 'coxs-bazar-holiday', 'Coxs Bazar', 15000, '/images/coxs_bazar.jpg', 'Beach', true, true]);
    await pool.query('INSERT INTO packages (id, title, slug, destination, price, image_url, category, featured, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [uuidv4(), 'Maldives Honeymoon', 'maldives-honeymoon', 'Maldives', 120000, '/images/maldives.jpg', 'Honeymoon', true, true]);
    await pool.query('INSERT INTO packages (id, title, slug, destination, price, image_url, category, featured, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [uuidv4(), 'Bali Getaway', 'bali-getaway', 'Bali, Indonesia', 85000, '/images/hero.jpg', 'International', true, true]);
    
    // 3. Testimonials
    await pool.query('INSERT INTO testimonials (id, name, trip, text, rating, active) VALUES (?, ?, ?, ?, ?, ?)', [uuidv4(), 'Rafiq Ahmed', 'Coxs Bazar Package', 'Smooth booking and amazing service.', 5, true]);
    await pool.query('INSERT INTO testimonials (id, name, trip, text, rating, active) VALUES (?, ?, ?, ?, ?, ?)', [uuidv4(), 'Nusrat Jahan', 'Maldives Tour', 'Best travel agency in Chittagong.', 5, true]);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seed();

