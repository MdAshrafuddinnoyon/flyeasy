const mysql = require('mysql2/promise');

async function seed() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'flyeasy'
  });

  const pages = [
    {
      title: "Terms & Conditions",
      slug: "terms",
      status: "published",
      content: `<h1>Terms & Conditions</h1><p>Welcome to FlyEasy Tourism. These are the terms and conditions for using our services.</p><h2>1. Agreement to Terms</h2><p>By accessing and using FlyEasy Tourism's services — including our website, mobile application, and booking platforms — you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p><h2>2. Booking & Payment</h2><p>All bookings made through FlyEasy are subject to availability and price confirmation at the time of booking. Payment must be completed in full within the stipulated time.</p>`
    },
    {
      title: "Privacy Policy",
      slug: "privacy",
      status: "published",
      content: `<h1>Privacy Policy</h1><p>At FlyEasy Tourism, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.</p><h2>1. Information We Collect</h2><p>We collect personal information such as your name, email address, phone number, and passport details when you make a booking or contact us.</p><h2>2. How We Use Your Information</h2><p>Your information is used to process bookings, provide customer support, and send important updates regarding your travel.</p>`
    },
    {
      title: "Cancellation & Refund Policy",
      slug: "cancellation",
      status: "published",
      content: `<h1>Cancellation & Refund Policy</h1><p>We understand that plans can change. Here is our cancellation and refund policy.</p><h2>1. Cancellation Process</h2><p>Cancellations must be submitted in writing via email to info@flyeasytourism.com or through our customer support.</p><h2>2. Refund Process</h2><p>Refunds will be processed within 7-14 working days after approval. Flight tickets are subject to the airline's own cancellation and refund policy.</p>`
    },
    {
      title: "Cookie Policy",
      slug: "cookie-policy",
      status: "published",
      content: `<h1>Cookie Policy</h1><p>This Cookie Policy explains how FlyEasy Tourism uses cookies and similar technologies to recognize you when you visit our website.</p><h2>1. What are cookies?</h2><p>Cookies are small data files that are placed on your computer or mobile device when you visit a website.</p><h2>2. Why do we use cookies?</h2><p>We use cookies to ensure that our website functions properly, to analyze our traffic, and to provide personalized content and ads.</p>`
    }
  ];

  for (const p of pages) {
    const [rows] = await db.execute('SELECT id FROM pages WHERE slug = ?', [p.slug]);
    if (rows.length === 0) {
      await db.execute('INSERT INTO pages (title, slug, content, status) VALUES (?, ?, ?, ?)', [p.title, p.slug, p.content, p.status]);
      console.log('Inserted ' + p.slug);
    } else {
      console.log(p.slug + ' already exists');
    }
  }

  await db.end();
}

seed().catch(console.error);
