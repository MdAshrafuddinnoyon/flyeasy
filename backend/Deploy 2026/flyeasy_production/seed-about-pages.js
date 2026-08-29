const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  // 1. Announcements
  await pool.query('DELETE FROM announcements');
  await pool.query(`INSERT INTO announcements (id, title, message, type, link_url, active) VALUES 
    (UUID(), 'Welcome to FlyEasy!', 'Get 20% off on all summer flights when you book through our app.', 'info', '/promotions', 1),
    (UUID(), 'New Route Alert!', 'Direct flights to Maldives are now available. Book now!', 'success', '/flights', 1)
  `);

  // 2. Team Members
  await pool.query('DELETE FROM team_members');
  await pool.query(`INSERT INTO team_members (id, name, role, image_url, bio, active) VALUES 
    (UUID(), 'Jane Doe', 'CEO & Founder', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop', 'Over 15 years of experience in the aviation and tourism industry, Jane leads FlyEasy with a vision for effortless travel.', 1),
    (UUID(), 'John Smith', 'Head of Operations', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop', 'Ensuring that every booking and journey runs smoothly from start to finish.', 1),
    (UUID(), 'Sara Lee', 'Customer Experience Lead', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=500&fit=crop', 'Dedicated to providing 24/7 world-class support to all our travelers.', 1),
    (UUID(), 'David Chen', 'Tech Lead', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop', 'Architect of the fast, seamless booking platform you use today.', 1)
  `);

  // 3. Certifications & Partners
  await pool.query('DELETE FROM certifications');
  await pool.query(`INSERT INTO certifications (id, name, image_url, type, active) VALUES 
    (UUID(), 'IATA Accredited', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/IATA_logo.svg/512px-IATA_logo.svg.png', 'Certification', 1),
    (UUID(), 'ATAB Member', 'https://www.atab.org.bd/wp-content/uploads/2021/04/atab-logo.png', 'Certification', 1),
    (UUID(), 'TOAB Member', 'https://toab.org/public/images/logo.png', 'Certification', 1),
    (UUID(), 'Emirates Partner', 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg', 'Partner', 1)
  `);

  // 4. Custom Pages
  await pool.query('DELETE FROM pages WHERE slug IN ("terms", "privacy")');
  await pool.query(`INSERT INTO pages (id, title, slug, content, status) VALUES 
    (UUID(), 'Terms & Conditions', 'terms', '<h2>1. Agreement to Terms</h2><p>By accessing our services, you agree to these terms.</p><h2>2. Booking & Payment</h2><p>All bookings are subject to availability. Prices may change without notice.</p>', 'published'),
    (UUID(), 'Privacy Policy', 'privacy', '<h2>1. Data Collection</h2><p>We collect your information to provide better travel services.</p><h2>2. Security</h2><p>Your data is protected using industry standard security.</p>', 'published')
  `);

  console.log('Seeded About Page data, Announcements, and Custom Pages.');
  process.exit();
}
seed().catch(console.error);
