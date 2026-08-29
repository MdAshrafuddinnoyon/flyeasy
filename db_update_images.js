const pool = require('./backend/config/db');

const images = {
  "Sundarbans Safari": "https://images.unsplash.com/photo-1590767187868-b8e9efb71803?auto=format&fit=crop&q=80",
  "Bali Tropical Escape": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80",
  "Maldives Honeymoon": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80",
  "Kuakata Sunrise & Sunset": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80",
  "Bandarban Cloud Camping": "https://images.unsplash.com/photo-1629851609141-83c84852d7e5?auto=format&fit=crop&q=80",
  "Cox's Bazar Premium Getaway": "https://images.unsplash.com/photo-1608958435020-e855b0520d7a?auto=format&fit=crop&q=80",
  "Singapore Family Adventure": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80",
  "Nepal Himalayan Trek": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80",
  "Dubai City Tour & Desert Safari": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80",
  "Sylhet Tea Gardens & Waterfalls": "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&q=80"
};

(async () => {
  try {
    for (const [title, url] of Object.entries(images)) {
      await pool.query('UPDATE packages SET image_url = ? WHERE title = ?', [url, title]);
    }
    console.log("Updated package images.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
