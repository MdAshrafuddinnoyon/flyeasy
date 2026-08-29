const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function seedReviews() {
  try {
    const reviews = [
      {
        name: 'Tanjim Islam',
        trip: 'Maldives Honeymoon',
        text: 'The booking process was incredibly smooth. FlyEasy took care of everything from flights to resort transfers. Highly recommended for hassle-free travel!',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Sadia Rahman',
        trip: 'Cox\'s Bazar Getaway',
        text: 'I loved the transparent pricing. No hidden fees at all! Our stay at the hotel they suggested was fantastic and the sea view was mesmerizing.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Abrar Chowdhury',
        trip: 'Dubai City Tour',
        text: 'Exceptional service! The customer support team was available at 2 AM when we had a minor issue with our hotel check-in. They resolved it in minutes.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Farhana Haque',
        trip: 'Bali Retreat',
        text: 'This was our first international trip and FlyEasy made it a breeze. The curated itinerary was perfectly balanced between sightseeing and relaxation.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Kamrul Hasan',
        trip: 'Sajek Valley Adventure',
        text: 'Affordable and reliable. I have booked multiple domestic trips with them and they never disappoint. The web app is super easy to use.',
        rating: 4,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Tahmina Akter',
        trip: 'Istanbul Exploration',
        text: 'I was amazed by the speed of their service. I booked my flight and hotel in under 5 minutes. The whole experience felt very premium.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Imran Hossain',
        trip: 'Kuala Lumpur Business',
        text: 'Great platform for frequent travelers. Everything is organized in one place. I appreciate the clean interface without the usual clutter of travel sites.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Mehazabien Chowdhury',
        trip: 'Sylhet Tea Gardens',
        text: 'The best part is how they curate their packages. It really takes the stress out of planning. Our trip to Sylhet was perfectly organized.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Rakib Uddin',
        trip: 'Bangkok Shopping',
        text: 'They gave us the best rates for our Bangkok trip. I compared with other agencies and FlyEasy was not only cheaper but much more professional.',
        rating: 4,
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Nadia Afrin',
        trip: 'Saint Martin Island',
        text: 'Truly effortless travel! They managed our ferry tickets and resort bookings smoothly during peak season. Will definitely book with them again.',
        rating: 5,
        avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop'
      }
    ];

    for (let i = 0; i < reviews.length; i++) {
      const r = reviews[i];
      await pool.query(
        'INSERT INTO testimonials (id, name, trip, text, rating, avatar_url, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [uuidv4(), r.name, r.trip, r.text, r.rating, r.avatar_url, 1, i + 1]
      );
    }

    console.log('Successfully seeded 10 reviews!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding reviews:', err);
    process.exit(1);
  }
}

seedReviews();
