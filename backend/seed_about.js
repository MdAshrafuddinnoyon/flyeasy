const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function seedAbout() {
  try {
    // 1. Team Members
    const team = [
      { id: uuidv4(), name: 'Tarek Rahman', role: 'Founder & CEO', image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop', bio: 'Passionate about redefining travel experiences across Bangladesh.', sort_order: 1, active: true },
      { id: uuidv4(), name: 'Nusrat Jahan', role: 'Head of Operations', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', bio: 'Ensuring every journey is as seamless as possible.', sort_order: 2, active: true },
      { id: uuidv4(), name: 'Shafiqul Islam', role: 'Travel Consultant', image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop', bio: 'Expert in crafting personalized holiday packages.', sort_order: 3, active: true },
    ];
    for (const t of team) {
      await pool.query('INSERT INTO team_members (id, name, role, image_url, bio, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)', [t.id, t.name, t.role, t.image_url, t.bio, t.sort_order, t.active]);
    }

    // 2. FAQs
    const faqs = [
      { id: uuidv4(), question: 'How do I book a flight?', answer: 'You can search for flights on our homepage and book directly. Our team will contact you to confirm the details.', category: 'General', sort_order: 1, active: true },
      { id: uuidv4(), question: 'What is your refund policy?', answer: 'Refunds depend on the airline or hotel policy. We strive to provide transparent information before you book.', category: 'Booking', sort_order: 2, active: true },
      { id: uuidv4(), question: 'Do you offer customized holiday packages?', answer: 'Yes! Contact us via email or phone, and we will tailor a package specifically for you.', category: 'Packages', sort_order: 3, active: true },
    ];
    for (const f of faqs) {
      await pool.query('INSERT INTO faqs (id, question, answer, category, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)', [f.id, f.question, f.answer, f.category, f.sort_order, f.active]);
    }

    // 3. Certifications
    const certs = [
      { id: uuidv4(), name: 'IATA', image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop', type: 'Partner', sort_order: 1, active: true },
      { id: uuidv4(), name: 'ATAB', image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=200&auto=format&fit=crop', type: 'Certification', sort_order: 2, active: true },
      { id: uuidv4(), name: 'TOAB', image_url: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=200&auto=format&fit=crop', type: 'Certification', sort_order: 3, active: true },
    ];
    for (const c of certs) {
      await pool.query('INSERT INTO certifications (id, name, image_url, type, sort_order, active) VALUES (?, ?, ?, ?, ?, ?)', [c.id, c.name, c.image_url, c.type, c.sort_order, c.active]);
    }

    console.log('Successfully seeded About page data!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedAbout();
