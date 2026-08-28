-- FlyEasy MySQL schema
-- Rebuilt to match the app's data model (airlines, hotels, packages, bookings, etc.)
-- Adjust types/constraints as needed for your environment.

CREATE DATABASE IF NOT EXISTS flyeasy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flyeasy;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS airlines (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(10),
  logo_url VARCHAR(500),
  country VARCHAR(100),
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255),
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'promo') DEFAULT 'info',
  link_url VARCHAR(500),
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotels (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  city VARCHAR(100),
  star_rating INT DEFAULT 3,
  price_per_night DECIMAL(12,2) NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  gallery JSON,
  amenities JSON,
  description TEXT,
  reviews_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  destination VARCHAR(255),
  country VARCHAR(100) DEFAULT 'Bangladesh',
  short_description VARCHAR(500),
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(12,2),
  duration_days INT DEFAULT 3,
  image_url VARCHAR(500),
  gallery JSON,
  itinerary JSON,
  inclusions JSON,
  exclusions JSON,
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  max_travelers INT DEFAULT 10,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  coupon_code VARCHAR(50),
  discount_text VARCHAR(100),
  link_url VARCHAR(500),
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  trip VARCHAR(255),
  text TEXT,
  rating INT DEFAULT 5,
  avatar_url VARCHAR(500),
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  method_type ENUM('bank', 'bkash', 'nagad', 'sslcommerz', 'other') NOT NULL,
  label VARCHAR(255),
  account_name VARCHAR(255),
  account_number VARCHAR(100),
  bank_name VARCHAR(255),
  branch VARCHAR(255),
  routing_number VARCHAR(50),
  mobile_number VARCHAR(30),
  merchant_id VARCHAR(100),
  store_id VARCHAR(100),
  instructions TEXT,
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flights (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  airline_id CHAR(36),
  airline_name VARCHAR(255),
  flight_code VARCHAR(50),
  origin VARCHAR(100),
  destination VARCHAR(100),
  departure_time DATETIME,
  arrival_time DATETIME,
  price DECIMAL(12,2) DEFAULT 0,
  stops INT DEFAULT 0,
  baggage_allowance VARCHAR(255),
  amenities JSON,
  image_url VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  type ENUM('booking', 'system', 'promo') DEFAULT 'system',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  site_name VARCHAR(255),
  hero_badge VARCHAR(255),
  hero_headline VARCHAR(500),
  hero_subheadline VARCHAR(500),
  hero_image_url VARCHAR(500),
  about_mission TEXT,
  site_domain VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_whatsapp VARCHAR(50),
  contact_email VARCHAR(255),
  support_email VARCHAR(255),
  contact_address VARCHAR(500),
  contact_hours VARCHAR(255),
  contact_map_url VARCHAR(500),
  footer_about TEXT,
  developer_name VARCHAR(255),
  developer_tagline VARCHAR(255),
  developer_website VARCHAR(255),
  header_links JSON,
  footer_links JSON,
  seo_description TEXT,
  seo_keywords VARCHAR(500),
  favicon_url VARCHAR(500),
  social_facebook VARCHAR(500),
  social_instagram VARCHAR(500),
  social_twitter VARCHAR(500),
  social_youtube VARCHAR(500),
  social_linkedin VARCHAR(500),
  cookie_banner_text TEXT,
  registration_open BOOLEAN DEFAULT TRUE,
  admin_url_slug VARCHAR(255) DEFAULT 'admin',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  package_id CHAR(36),
  package_title VARCHAR(255),
  item_type ENUM('package', 'hotel', 'flight') DEFAULT 'package',
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  travel_date DATE,
  number_of_travelers INT DEFAULT 1,
  message TEXT,
  status ENUM('pending', 'confirmed', 'paid', 'cancelled', 'completed') DEFAULT 'pending',
  total_price DECIMAL(12,2) DEFAULT 0,
  transaction_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
);

CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_featured ON packages(featured);
CREATE INDEX idx_hotels_featured ON hotels(featured);

CREATE TABLE IF NOT EXISTS package_reviews (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  customer_name VARCHAR(255),
  package_id CHAR(36) NOT NULL,
  booking_id CHAR(36),
  rating INT NOT NULL DEFAULT 5,
  text TEXT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

CREATE INDEX idx_package_reviews_status ON package_reviews(status);

CREATE TABLE IF NOT EXISTS pages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  status ENUM('published', 'draft') DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
