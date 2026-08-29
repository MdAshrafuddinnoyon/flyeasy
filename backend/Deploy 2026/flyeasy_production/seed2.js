const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  try {
    // --- FAQS ---
    const [existingFaqs] = await pool.query('SELECT COUNT(*) as c FROM faqs');
    if (existingFaqs[0].c === 0) {
      const faqs = [
        ['How do I book a flight?', 'You can book a flight by visiting our Flights page, selecting your origin, destination and travel dates, then following the booking steps.', 'Booking', 1],
        ['Can I cancel my booking?', 'Yes. Cancellations submitted 30+ days before departure incur a 10% fee. 15-29 days: 25%. 7-14 days: 50%. Under 7 days: no refund.', 'Cancellation', 2],
        ['What payment methods do you accept?', 'We accept bank transfers, bKash, Nagad, Rocket mobile banking, and cash payments at our Chattogram office.', 'Payment', 3],
        ['How long does it take to get a booking confirmation?', 'Booking confirmation is sent via email/SMS within 24 hours of successful payment.', 'Booking', 4],
        ['Do you offer visa assistance?', 'Yes, we provide visa consultation services for all major destinations. Contact our team for details.', 'Visa', 5],
        ['Can I book a hotel along with my flight?', 'Absolutely! We offer complete travel packages including flights, hotels and sightseeing tours.', 'Packages', 6],
        ['What is your refund policy?', 'Refunds are processed within 7-14 working days after cancellation approval. Airline tickets follow the airline own refund policy.', 'Cancellation', 7],
        ['Do you provide group travel packages?', 'Yes, we specialize in group travel. Contact us for customized group packages and corporate travel solutions.', 'Packages', 8],
      ];
      for (const [q, a, cat, sort] of faqs) {
        await pool.query('INSERT INTO faqs (id, question, answer, category, sort_order, active) VALUES (?, ?, ?, ?, ?, 1)', [uuidv4(), q, a, cat, sort]);
      }
      console.log('FAQs seeded:', faqs.length);
    } else {
      console.log('FAQs already exist, skipping');
    }

    // --- AIRLINES ---
    const [existingAirlines] = await pool.query('SELECT COUNT(*) as c FROM airlines');
    if (existingAirlines[0].c === 0) {
      const airlines = [
        ['Biman Bangladesh Airlines', 'BG', 'Bangladesh', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Biman_Bangladesh_Airlines_Logo.svg/320px-Biman_Bangladesh_Airlines_Logo.svg.png', 1],
        ['US-Bangla Airlines', 'US', 'Bangladesh', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/US-Bangla_Airlines_Logo.svg/320px-US-Bangla_Airlines_Logo.svg.png', 2],
        ['Novoair', 'VQ', 'Bangladesh', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Novoair_logo.svg/320px-Novoair_logo.svg.png', 3],
        ['Air Arabia', 'G9', 'UAE', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Air_Arabia_Logo.svg/320px-Air_Arabia_Logo.svg.png', 4],
        ['flydubai', 'FZ', 'UAE', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Flydubai_logo.svg/320px-Flydubai_logo.svg.png', 5],
        ['IndiGo', '6E', 'India', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/IndiGo_Airlines_logo.svg/320px-IndiGo_Airlines_logo.svg.png', 6],
        ['Emirates', 'EK', 'UAE', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/320px-Emirates_logo.svg.png', 7],
        ['Qatar Airways', 'QR', 'Qatar', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 8],
        ['Singapore Airlines', 'SQ', 'Singapore', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 9],
        ['Thai Airways', 'TG', 'Thailand', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Thai_Airways_Logo.svg/320px-Thai_Airways_Logo.svg.png', 10],
      ];
      for (const [name, code, country, logo_url, sort_order] of airlines) {
        await pool.query('INSERT INTO airlines (id, name, code, country, logo_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, 1)', [uuidv4(), name, code, country, logo_url, sort_order]);
      }
      console.log('Airlines seeded:', airlines.length);
    } else {
      console.log('Airlines already exist, skipping');
    }

    // --- CERTIFICATIONS / PARTNERS ---
    const [existingCerts] = await pool.query('SELECT COUNT(*) as c FROM certifications');
    if (existingCerts[0].c === 0) {
      const certs = [
        ['IATA Certified', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/IATA_logo_and_wordmark.svg/320px-IATA_logo_and_wordmark.svg.png', 'certification', 1],
        ['Biman Bangladesh Partner', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Biman_Bangladesh_Airlines_Logo.svg/320px-Biman_Bangladesh_Airlines_Logo.svg.png', 'partner', 2],
        ['US-Bangla Partner', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/US-Bangla_Airlines_Logo.svg/320px-US-Bangla_Airlines_Logo.svg.png', 'partner', 3],
        ['Emirates Partner', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/320px-Emirates_logo.svg.png', 'partner', 4],
        ['Qatar Airways Partner', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 'partner', 5],
        ['Air Arabia Partner', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Air_Arabia_Logo.svg/320px-Air_Arabia_Logo.svg.png', 'partner', 6],
      ];
      for (const [name, image_url, type, sort_order] of certs) {
        await pool.query('INSERT INTO certifications (id, name, image_url, type, sort_order, active) VALUES (?, ?, ?, ?, ?, 1)', [uuidv4(), name, image_url, type, sort_order]);
      }
      console.log('Certifications seeded:', certs.length);
    } else {
      console.log('Certifications already exist, skipping');
    }

    // --- TEAM MEMBERS ---
    const [existingTeam] = await pool.query('SELECT COUNT(*) as c FROM team_members');
    if (existingTeam[0].c === 0) {
      const team = [
        ['Mohammed Al-Amin', 'Founder & CEO', 'https://randomuser.me/api/portraits/men/11.jpg', 'With 15+ years in the travel industry, Al-Amin founded FlyEasy to make quality travel accessible to everyone.', 1],
        ['Salma Khatun', 'Head of Operations', 'https://randomuser.me/api/portraits/women/25.jpg', 'Salma oversees day-to-day operations, ensuring every booking and package runs smoothly.', 2],
        ['Tanvir Hassan', 'Senior Travel Consultant', 'https://randomuser.me/api/portraits/men/41.jpg', 'Tanvir is our destination expert specializing in Southeast Asia and Middle East travel packages.', 3],
        ['Nusrat Islam', 'Customer Experience Manager', 'https://randomuser.me/api/portraits/women/57.jpg', 'Nusrat leads our customer support team, ensuring every traveler has a seamless experience.', 4],
      ];
      for (const [name, role, image_url, bio, sort_order] of team) {
        await pool.query('INSERT INTO team_members (id, name, role, image_url, bio, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, 1)', [uuidv4(), name, role, image_url, bio, sort_order]);
      }
      console.log('Team members seeded:', team.length);
    } else {
      console.log('Team already exists, skipping');
    }

    // --- ANNOUNCEMENTS ---
    const [existingAnn] = await pool.query('SELECT COUNT(*) as c FROM announcements');
    if (existingAnn[0].c === 0) {
      await pool.query('INSERT INTO announcements (id, title, message, type, active) VALUES (?, ?, ?, ?, 1)',
        [uuidv4(), 'Welcome to FlyEasy!', 'Book your dream vacation today and get exclusive deals on flights and packages!', 'info']);
      console.log('Announcements seeded: 1');
    } else {
      console.log('Announcements already exist, skipping');
    }

    // --- CUSTOM PAGES ---
    const [existingPages] = await pool.query('SELECT COUNT(*) as c FROM pages');
    if (existingPages[0].c === 0) {
      const pages = [
        ['Terms & Conditions', 'terms', '<h2>1. Agreement to Terms</h2><p>By accessing and using FlyEasy Tourism services you agree to be bound by these Terms and Conditions.</p><h2>2. Booking & Payment</h2><p>All bookings are subject to availability. We accept bank transfer, bKash, Nagad, Rocket, and cash payments.</p><h2>3. Cancellation Policy</h2><ul><li>30+ days before departure: 10% fee</li><li>15-29 days: 25% fee</li><li>7-14 days: 50% fee</li><li>Under 7 days: No refund</li></ul><h2>4. Contact</h2><p>Email: info@flyeasytourism.com | Phone: 01819-024927</p>'],
        ['Privacy Policy', 'privacy', '<h2>Information We Collect</h2><p>We collect your name, email, phone number, and payment details when you make bookings.</p><h2>How We Use Your Information</h2><p>We use your information to process bookings, send confirmations, and provide customer support.</p><h2>Data Protection</h2><p>We do not sell or rent your personal information to third parties.</p><h2>Contact</h2><p>For privacy concerns: info@flyeasytourism.com</p>'],
        ['Cancellation Policy', 'cancellation', '<h2>Cancellation Charges</h2><ul><li>30+ days before departure: 10% of total</li><li>15-29 days: 25%</li><li>7-14 days: 50%</li><li>Less than 7 days: No refund</li></ul><h2>How to Cancel</h2><p>Submit cancellation requests to info@flyeasytourism.com. Refunds are processed within 7-14 working days.</p>'],
        ['Cookie Policy', 'cookies', '<h2>What Are Cookies</h2><p>Cookies are small text files stored on your device that help us improve your browsing experience.</p><h2>How We Use Cookies</h2><p>We use cookies to remember preferences, analyze traffic, and provide a better experience.</p><h2>Managing Cookies</h2><p>You can manage cookies through your browser settings.</p>'],
      ];
      for (const [title, slug, content] of pages) {
        await pool.query('INSERT INTO pages (id, title, slug, content, status) VALUES (?, ?, ?, ?, ?)', [uuidv4(), title, slug, content, 'published']);
      }
      console.log('Custom pages seeded:', pages.length);
    } else {
      console.log('Pages already exist, skipping');
    }

    // --- TESTIMONIALS (replace old basic ones) ---
    const [tCount] = await pool.query('SELECT COUNT(*) as c FROM testimonials');
    if (tCount[0].c <= 2) {
      // Delete old basic testimonials and replace with rich ones
      await pool.query('DELETE FROM testimonials');
      const testimonials = [
        ['Rahim Uddin', 'Bali Family Trip', 'FlyEasy made our family vacation to Bali completely stress-free. From flights to hotel, everything was handled perfectly!', 5, 'https://randomuser.me/api/portraits/men/32.jpg', 1],
        ['Fatema Khanam', 'Dubai Business Trip', 'Quick, efficient and very professional. The FlyEasy team is amazing at what they do.', 5, 'https://randomuser.me/api/portraits/women/44.jpg', 2],
        ['Karim Ahmed', 'Maldives Honeymoon', 'Our honeymoon package was absolutely perfect. Best travel experience of our lives!', 5, 'https://randomuser.me/api/portraits/men/55.jpg', 3],
        ['Nasrin Begum', "Cox's Bazar Weekend", "Booked a last-minute trip and FlyEasy arranged everything within hours. Incredible service!", 4, 'https://randomuser.me/api/portraits/women/28.jpg', 4],
        ['Sabbir Hossain', 'Singapore Tour', 'Great value packages! Highly recommend FlyEasy for international travel.', 5, 'https://randomuser.me/api/portraits/men/73.jpg', 5],
        ['Riya Chowdhury', 'Thailand Adventure', 'From Bangkok to Phuket, every detail was perfect. FlyEasy took care of everything!', 5, 'https://randomuser.me/api/portraits/women/62.jpg', 6],
      ];
      for (const [name, trip, text, rating, avatar_url, sort_order] of testimonials) {
        await pool.query('INSERT INTO testimonials (id, name, trip, text, rating, avatar_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          [uuidv4(), name, trip, text, rating, avatar_url, sort_order]);
      }
      console.log('Testimonials replaced with rich data:', testimonials.length);
    } else {
      console.log('Testimonials already have data, skipping');
    }

    console.log('\n All seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
