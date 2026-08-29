const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const PROMOTIONS = [
  { id: uuidv4(), title: "Eid Special: 20% off Domestic Flights", description: "Book any domestic flight during the Eid holiday week and get 20% flat discount up to BDT 2000.", discount_text: "20% OFF", coupon_code: "EID2026", active: true, image_url: "/uploads/promo_eid_flight.jpg", source_img: "promo_eid_flight.jpg" },
  { id: uuidv4(), title: "Maldives Honeymoon Package - Buy 1 Get 1", description: "Book our premium Maldives honeymoon package for two and pay only for one! Limited time offer.", discount_text: "BOGO", coupon_code: "LOVE2026", active: true, image_url: "/uploads/maldives_resort.jpg", source_img: "maldives_resort.jpg" },
  { id: uuidv4(), title: "Cox's Bazar Hotel Flash Sale", description: "Get massive discounts on 5-star hotels in Cox's Bazar. Valid for bookings made this weekend.", discount_text: "UP TO 50% OFF", coupon_code: "", active: true, image_url: "/uploads/coxs_bazar_beach.jpg", source_img: "coxs_bazar_beach.jpg" },
];

async function seedPromotions() {
  try {
    const frontendImagesDir = path.join(__dirname, '../frontend/public/images');
    const backendUploadsDir = path.join(__dirname, 'public/uploads');

    if (!fs.existsSync(backendUploadsDir)) {
      fs.mkdirSync(backendUploadsDir, { recursive: true });
    }

    for (const promo of PROMOTIONS) {
      // Copy image
      const sourcePath = path.join(frontendImagesDir, promo.source_img);
      const destPath = path.join(backendUploadsDir, promo.source_img);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${promo.source_img} to uploads`);
      } else {
        console.log(`Warning: Source image ${sourcePath} not found`);
      }

      // Insert into DB
      await pool.query(
        'INSERT INTO promotions (id, title, description, image_url, coupon_code, discount_text, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [promo.id, promo.title, promo.description, promo.image_url, promo.coupon_code, promo.discount_text, promo.active ? 1 : 0, 0]
      );
      console.log(`Inserted promotion: ${promo.title}`);
    }

    console.log('Promotions seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed promotions:', error);
    process.exit(1);
  }
}

seedPromotions();
