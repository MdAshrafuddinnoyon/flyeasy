-- FlyEasy Tourism Platform Database Dump
-- Import this file into your MySQL database using phpMyAdmin or CLI

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('client','admin') DEFAULT 'client',
  phone VARCHAR(50),
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
  id INT PRIMARY KEY DEFAULT 1,
  hero_badge TEXT, hero_headline TEXT, hero_subheadline TEXT, hero_image_url TEXT,
  about_mission TEXT, site_domain VARCHAR(255), contact_phone VARCHAR(50), contact_whatsapp VARCHAR(50),
  contact_email VARCHAR(255), support_email VARCHAR(255), contact_address TEXT, footer_about TEXT,
  developer_name VARCHAR(255), developer_tagline TEXT, developer_website TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  admin_url_slug VARCHAR(100) DEFAULT 'admin', header_links JSON, footer_links JSON,
  contact_hours TEXT, contact_map_url TEXT, site_name VARCHAR(255) DEFAULT 'FlyEasy',
  seo_description TEXT, seo_keywords TEXT, favicon_url TEXT, logo_light_url TEXT, logo_dark_url TEXT,
  social_facebook TEXT, social_instagram TEXT, social_twitter TEXT, social_youtube TEXT, social_linkedin TEXT,
  cookie_banner_text TEXT, registration_open TINYINT DEFAULT 1, rewards_active TINYINT DEFAULT 1,
  smtp_host VARCHAR(255), smtp_port INT DEFAULT 587, smtp_user VARCHAR(255), smtp_pass TEXT,
  email_sender_name VARCHAR(255), email_sender_email VARCHAR(255), email_logo_url TEXT,
  about_show_stats TINYINT DEFAULT 1, about_show_team TINYINT DEFAULT 1,
  about_show_certs TINYINT DEFAULT 1, about_show_faqs TINYINT DEFAULT 1,
  about_show_airlines TINYINT DEFAULT 1, about_show_partners TINYINT DEFAULT 1
);

INSERT INTO site_content (id, site_name, admin_url_slug, registration_open, rewards_active)
VALUES (1, 'FlyEasy', 'admin', 1, 1) ON DUPLICATE KEY UPDATE id=id;

CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR(36) PRIMARY KEY, title VARCHAR(255) NOT NULL, price DECIMAL(10,2) DEFAULT 0,
  duration VARCHAR(100), destination VARCHAR(255), description TEXT, image_url TEXT,
  gallery JSON, itinerary JSON, inclusions JSON, exclusions JSON,
  active TINYINT DEFAULT 1, featured TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotels (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255),
  city VARCHAR(255), price_per_night DECIMAL(10,2) DEFAULT 0, star_rating INT DEFAULT 3,
  rating DECIMAL(3,1) DEFAULT 0, reviews_count INT DEFAULT 0,
  description TEXT, image_url TEXT, gallery JSON, amenities JSON,
  active TINYINT DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS airlines (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, iata_code VARCHAR(10),
  logo_url TEXT, website TEXT, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flights (
  id VARCHAR(36) PRIMARY KEY, flight_code VARCHAR(50), airline_id VARCHAR(36),
  origin VARCHAR(255), destination VARCHAR(255), departure DATETIME, arrival DATETIME,
  price DECIMAL(10,2) DEFAULT 0, seats INT DEFAULT 100, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), package_id VARCHAR(36),
  package_title VARCHAR(255), item_type VARCHAR(50) DEFAULT 'package',
  customer_name VARCHAR(255), customer_email VARCHAR(255), customer_phone VARCHAR(50),
  travel_date DATE, number_of_travelers INT DEFAULT 1,
  total_price DECIMAL(10,2) DEFAULT 0, status VARCHAR(50) DEFAULT 'pending',
  message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotions (
  id VARCHAR(36) PRIMARY KEY, title VARCHAR(255), description TEXT, image_url TEXT,
  discount_percent DECIMAL(5,2) DEFAULT 0, valid_until DATE, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), location VARCHAR(255),
  avatar TEXT, rating INT DEFAULT 5, review TEXT, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id VARCHAR(36) PRIMARY KEY, question TEXT, answer TEXT,
  active TINYINT DEFAULT 1, sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(36) PRIMARY KEY, text TEXT, link TEXT, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), type VARCHAR(50),
  account_number VARCHAR(255), instructions TEXT, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), role VARCHAR(255),
  bio TEXT, image_url TEXT, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certifications (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), image_url TEXT,
  issued_by VARCHAR(255), active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partners (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), logo_url TEXT,
  website TEXT, active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id VARCHAR(36) PRIMARY KEY, email VARCHAR(255) UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  id VARCHAR(36) PRIMARY KEY, slug VARCHAR(255) UNIQUE, title VARCHAR(255),
  content LONGTEXT, meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates (
  id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), subject TEXT, html_content LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), message TEXT,
  type VARCHAR(50), read_at DATETIME, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS package_reviews (
  id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), package_id VARCHAR(36),
  rating INT DEFAULT 5, comment TEXT, approved TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), item_type VARCHAR(50), item_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: To create an admin account, run the backend/create-admin.js script or use the register endpoint and change the role in phpMyAdmin.

COMMIT;