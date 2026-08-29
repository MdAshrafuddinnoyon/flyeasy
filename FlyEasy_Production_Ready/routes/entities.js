const buildCrudRouter = require('./crudFactory');

const airlines = buildCrudRouter({
  table: 'airlines',
  columns: ['name', 'code', 'logo_url', 'country', 'active', 'sort_order'],
});

const announcements = buildCrudRouter({
  table: 'announcements',
  columns: ['title', 'message', 'type', 'link_url', 'active'],
});

const notifications = buildCrudRouter({
  table: 'notifications',
  columns: ['user_email', 'title', 'message', 'is_read', 'type'],
});

const hotels = buildCrudRouter({
  table: 'hotels',
  columns: [
    'name', 'location', 'city', 'star_rating', 'price_per_night', 'image_url',
    'gallery', 'amenities', 'description', 'reviews_count', 'rating', 'featured', 'available',
  ],
});

const packages = buildCrudRouter({
  table: 'packages',
  columns: [
    'title', 'slug', 'destination', 'country', 'short_description', 'description',
    'price', 'original_price', 'duration_days', 'image_url', 'gallery', 'itinerary',
    'inclusions', 'exclusions', 'category', 'featured', 'rating', 'reviews_count',
    'available', 'max_travelers',
  ],
});

const flights = buildCrudRouter({
  table: 'flights',
  columns: [
    'airline_id', 'airline_name', 'flight_code', 'origin', 'destination',
    'departure_time', 'arrival_time', 'price', 'stops', 'available'
  ],
});

const promotions = buildCrudRouter({
  table: 'promotions',
  columns: ['title', 'description', 'image_url', 'coupon_code', 'discount_text', 'link_url', 'active', 'sort_order'],
});

const testimonials = buildCrudRouter({
  table: 'testimonials',
  columns: ['name', 'trip', 'text', 'rating', 'avatar_url', 'video_url', 'active', 'sort_order'],
});

const pool = require('../config/db');

async function updateItemRating(row) {
  if (!row || !row.item_id || !row.item_type) return;
  const table = row.item_type === 'package' ? 'packages' : row.item_type === 'hotel' ? 'hotels' : null;
  if (!table) return;

  try {
    const [stats] = await pool.query(
      `SELECT COUNT(*) as count, AVG(rating) as avgRating FROM reviews WHERE item_id = ? AND item_type = ? AND status = 'approved'`,
      [row.item_id, row.item_type]
    );
    
    const count = stats[0].count || 0;
    const avg = stats[0].avgRating || 0;
    
    await pool.query(`UPDATE \`${table}\` SET reviews_count = ?, rating = ? WHERE id = ?`, [count, avg, row.item_id]);
  } catch (err) {
    console.error('Failed to update item rating:', err);
  }
}

const package_reviews = buildCrudRouter({
  table: 'reviews',
  columns: ['user_id', 'customer_name', 'item_id', 'item_type', 'booking_id', 'rating', 'text', 'status'],
  afterUpdate: updateItemRating,
  afterDelete: updateItemRating
});

const paymentMethods = buildCrudRouter({
  table: 'payment_methods',
  columns: [
    'method_type', 'label', 'account_name', 'account_number', 'bank_name', 'branch',
    'routing_number', 'mobile_number', 'merchant_id', 'store_id', 'instructions', 'active', 'sort_order',
  ],
});

const pages = buildCrudRouter({
  table: 'pages',
  columns: ['title', 'slug', 'content', 'status'],
});

const team_members = buildCrudRouter({
  table: 'team_members',
  columns: ['name', 'role', 'image_url', 'bio', 'sort_order', 'active'],
});

const certifications = buildCrudRouter({
  table: 'certifications',
  columns: ['name', 'image_url', 'type', 'sort_order', 'active'],
});

const faqs = buildCrudRouter({
  table: 'faqs',
  columns: ['question', 'answer', 'category', 'sort_order', 'active'],
});

const partners = buildCrudRouter({
  table: 'partners',
  columns: ['name', 'logo_url', 'active', 'sort_order'],
});

const newsletter_subscribers = buildCrudRouter({
  table: 'newsletter_subscribers',
  columns: ['email', 'status'],
  publicWrite: true,
});

const email_templates = buildCrudRouter({
  table: 'email_templates',
  columns: ['name', 'subject', 'body_html', 'active'],
});

module.exports = {
  airlines, announcements, hotels, flights, packages, promotions, testimonials, package_reviews, paymentMethods, notifications, pages,
  team_members, certifications, faqs, newsletter_subscribers, email_templates, partners
};
