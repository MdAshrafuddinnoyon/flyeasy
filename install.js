#!/usr/bin/env node
/**
 * FlyEasy Auto-Installer
 * Run: node install.js
 *
 * This wizard will:
 *  1. Ask for database & site credentials
 *  2. Generate backend/.env automatically
 *  3. Create the MySQL database & all tables
 *  4. Install all npm dependencies
 *  5. Build the React frontend
 *  6. Create the first admin account
 *  7. Start the app with PM2 (or print manual start instructions)
 */

const readline = require('readline');
const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const BACKEND = path.join(ROOT, 'backend');
const FRONTEND = path.join(ROOT, 'frontend');

const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';
const RESET  = '\x1b[0m';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, def = '') => new Promise(resolve => {
  rl.question(`${CYAN}${q}${def ? ` [${def}]` : ''}: ${RESET}`, ans => resolve(ans.trim() || def));
});
const askSecret = (q) => new Promise(resolve => {
  process.stdout.write(`${CYAN}${q}: ${RESET}`);
  let val = '';
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', function handler(ch) {
    ch = ch.toString();
    if (ch === '\r' || ch === '\n') {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', handler);
      process.stdout.write('\n');
      resolve(val);
    } else if (ch === '\u0003') {
      process.exit();
    } else if (ch === '\u007f') {
      val = val.slice(0, -1);
    } else {
      val += ch;
      process.stdout.write('*');
    }
  });
});

function run(cmd, cwd = ROOT, silent = false) {
  try {
    execSync(cmd, { cwd, stdio: silent ? 'pipe' : 'inherit' });
    return true;
  } catch (e) {
    return false;
  }
}

function log(msg, color = GREEN) {
  console.log(`${color}${BOLD}${msg}${RESET}`);
}

function section(title) {
  console.log(`\n${BOLD}${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${BOLD}${CYAN}  ${title}${RESET}`);
  console.log(`${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
}

async function main() {
  console.clear();
  console.log(`
${BOLD}${CYAN}╔═══════════════════════════════════════════════╗
║        FlyEasy Tourism Platform               ║
║        Automated Installer v2.0               ║
╚═══════════════════════════════════════════════╝${RESET}
`);

  // ─── STEP 1: Database Settings ────────────────────────────────
  section('Step 1 of 6 — Database Configuration');
  const dbHost     = await ask('MySQL Host', 'localhost');
  const dbPort     = await ask('MySQL Port', '3306');
  const dbUser     = await ask('MySQL Username', 'root');
  let   dbPassword;
  try   { dbPassword = await askSecret('MySQL Password (hidden)'); }
  catch { dbPassword = await ask('MySQL Password'); }
  const dbName     = await ask('Database Name', 'flyeasy');

  // ─── STEP 2: Site Settings ─────────────────────────────────────
  section('Step 2 of 6 — Site Configuration');
  const siteUrl    = await ask('Your website URL (frontend)', 'http://localhost:5173');
  const apiPort    = await ask('Backend API port', '4000');
  const adminEmail = await ask('Admin email address', 'admin@flyeasy.com');
  let   adminPass;
  try   { adminPass = await askSecret('Admin password (hidden, min 8 chars)'); }
  catch { adminPass = await ask('Admin password (min 8 chars)'); }
  const adminName  = await ask('Admin name', 'Admin');

  // ─── STEP 3: SMTP Settings ─────────────────────────────────────
  section('Step 3 of 6 — Email / SMTP (optional, press Enter to skip)');
  const smtpHost   = await ask('SMTP Host (e.g. smtp.gmail.com)', '');
  const smtpPort   = await ask('SMTP Port', '587');
  const smtpUser   = await ask('SMTP Username / Email', '');
  let   smtpPass   = '';
  if (smtpUser) {
    try   { smtpPass = await askSecret('SMTP Password (hidden)'); }
    catch { smtpPass = await ask('SMTP Password'); }
  }
  const senderName = await ask('Email Sender Name', 'FlyEasy Tourism');

  rl.close();

  // ─── GENERATE .env ─────────────────────────────────────────────
  section('Step 4 of 6 — Generating Configuration Files');

  const jwtSecret         = crypto.randomBytes(48).toString('hex');
  const jwtRefreshSecret  = crypto.randomBytes(48).toString('hex');

  const envContent = `# ─── Database ───────────────────────────────────────
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

# ─── Server ──────────────────────────────────────────
PORT=${apiPort}
NODE_ENV=production

# ─── CORS ────────────────────────────────────────────
CORS_ORIGIN=${siteUrl}

# ─── JWT Secrets (auto-generated) ────────────────────
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}

# ─── SMTP Email ──────────────────────────────────────
SMTP_HOST=${smtpHost}
SMTP_PORT=${smtpPort}
SMTP_USER=${smtpUser}
SMTP_PASS=${smtpPass}
EMAIL_SENDER_NAME=${senderName}
EMAIL_SENDER_EMAIL=${smtpUser}
`;

  fs.writeFileSync(path.join(BACKEND, '.env'), envContent);
  log('✅ backend/.env created');

  // ─── Generate frontend .env ────────────────────────────────────
  const frontendEnv = `VITE_API_BASE_URL=${siteUrl.replace(/\/$/, '')}/api\n`;
  // If api port is explicit and not part of siteUrl, use localhost:PORT
  const apiBase = siteUrl.includes('localhost')
    ? `http://localhost:${apiPort}/api`
    : `${siteUrl.replace(/\/$/, '')}/api`;
  fs.writeFileSync(path.join(FRONTEND, '.env'), `VITE_API_BASE_URL=${apiBase}\n`);
  log('✅ frontend/.env created');

  // ─── STEP 4: Install dependencies ──────────────────────────────
  section('Step 5 of 6 — Installing Dependencies & Building');

  log('📦 Installing backend dependencies...');
  if (!run('npm install --production=false', BACKEND)) {
    console.error(`${RED}❌ Backend npm install failed. Check your Node.js version.${RESET}`);
    process.exit(1);
  }
  log('✅ Backend dependencies installed');

  log('📦 Installing frontend dependencies...');
  if (!run('npm install', FRONTEND)) {
    console.error(`${RED}❌ Frontend npm install failed.${RESET}`);
    process.exit(1);
  }
  log('✅ Frontend dependencies installed');

  log('🔨 Building frontend (production)...');
  if (!run('npm run build', FRONTEND)) {
    console.error(`${RED}❌ Frontend build failed. Check for errors above.${RESET}`);
    process.exit(1);
  }
  log('✅ Frontend built → frontend/dist/');

  // ─── STEP 5: Database setup ─────────────────────────────────────
  log('🗄️  Setting up database & tables...');
  const mysql = (() => {
    try { return require('mysql2/promise'); } catch {
      run('npm install mysql2', BACKEND, true);
      return require(path.join(BACKEND, 'node_modules', 'mysql2', 'promise'));
    }
  })();

  let pool;
  try {
    // First create DB if not exists
    const tempConn = await mysql.createConnection({
      host: dbHost, port: parseInt(dbPort), user: dbUser, password: dbPassword
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await tempConn.end();
    log(`✅ Database '${dbName}' ready`);

    pool = mysql.createPool({
      host: dbHost, port: parseInt(dbPort), user: dbUser, password: dbPassword, database: dbName,
      waitForConnections: true, connectionLimit: 5
    });

    // Run table creation by importing backend setup
    process.env.DB_HOST = dbHost;
    process.env.DB_PORT = dbPort;
    process.env.DB_USER = dbUser;
    process.env.DB_PASSWORD = dbPassword;
    process.env.DB_NAME = dbName;
    process.env.JWT_SECRET = jwtSecret;
    process.env.PORT = apiPort;

    // Run all CREATE TABLE statements
    await runDatabaseSetup(pool);
    log('✅ All tables created');

    // Create admin account
    await createAdminAccount(pool, adminEmail, adminPass, adminName);
    log(`✅ Admin account created: ${adminEmail}`);

    await pool.end();
  } catch (err) {
    console.error(`${RED}❌ Database error: ${err.message}${RESET}`);
    console.error(`${YELLOW}   Please check your MySQL credentials and try again.${RESET}`);
    process.exit(1);
  }

  // ─── STEP 6: Start with PM2 or print instructions ───────────────
  section('Step 6 of 6 — Launch');

  // Write ecosystem.config.js
  const pm2Config = generatePM2Config(BACKEND, apiPort);
  fs.writeFileSync(path.join(ROOT, 'ecosystem.config.js'), pm2Config);
  log('✅ ecosystem.config.js created');

  // Write nginx config
  const nginxConfig = generateNginxConfig(siteUrl, apiPort);
  fs.writeFileSync(path.join(ROOT, 'nginx.conf.example'), nginxConfig);
  log('✅ nginx.conf.example created');

  const hasPm2 = run('pm2 --version', ROOT, true);
  if (hasPm2) {
    log('🚀 Starting backend with PM2...');
    run('pm2 start ecosystem.config.js', ROOT);
    run('pm2 save', ROOT, true);
    log('✅ FlyEasy backend is running with PM2!');
  }

  // ─── SUCCESS SUMMARY ────────────────────────────────────────────
  console.log(`
${BOLD}${GREEN}╔═══════════════════════════════════════════════════════╗
║            🎉 Installation Complete!                  ║
╚═══════════════════════════════════════════════════════╝${RESET}

${BOLD}Next Steps:${RESET}

${CYAN}1. Start the backend (if not using PM2):${RESET}
   cd backend && node server.js

${CYAN}2. Serve the frontend (choose one):${RESET}
   • Nginx: point root to ${path.join(FRONTEND, 'dist')}
   • Node.js: cd frontend && npx serve dist -p 5173
   • cPanel: upload frontend/dist/ contents to public_html/

${CYAN}3. Configure Nginx:${RESET}
   See ${path.join(ROOT, 'nginx.conf.example')} for a ready-to-use config.

${CYAN}4. Login to admin panel:${RESET}
   ${siteUrl}/admin
   Email: ${adminEmail}

${YELLOW}⚠  Keep backend/.env secret — never commit it to git!${RESET}
`);
}

// ─── Database Table Creation ────────────────────────────────────────────────
async function runDatabaseSetup(pool) {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL, role ENUM('client','admin') DEFAULT 'client',
      phone VARCHAR(50), avatar TEXT, bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(36) NOT NULL,
      token VARCHAR(255) NOT NULL UNIQUE, expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS site_content (
      id INT PRIMARY KEY DEFAULT 1, hero_badge TEXT, hero_headline TEXT, hero_subheadline TEXT,
      hero_image_url TEXT, about_mission TEXT, site_domain VARCHAR(255), contact_phone VARCHAR(50),
      contact_whatsapp VARCHAR(50), contact_email VARCHAR(255), support_email VARCHAR(255),
      contact_address TEXT, footer_about TEXT, developer_name VARCHAR(255), developer_tagline TEXT,
      developer_website TEXT, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    )`,
    `CREATE TABLE IF NOT EXISTS packages (
      id VARCHAR(36) PRIMARY KEY, title VARCHAR(255) NOT NULL, price DECIMAL(10,2) DEFAULT 0,
      duration VARCHAR(100), destination VARCHAR(255), description TEXT, image_url TEXT,
      gallery JSON, itinerary JSON, inclusions JSON, exclusions JSON,
      active TINYINT DEFAULT 1, featured TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS hotels (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255),
      city VARCHAR(255), price_per_night DECIMAL(10,2) DEFAULT 0, star_rating INT DEFAULT 3,
      rating DECIMAL(3,1) DEFAULT 0, reviews_count INT DEFAULT 0,
      description TEXT, image_url TEXT, gallery JSON, amenities JSON,
      active TINYINT DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS airlines (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255) NOT NULL, iata_code VARCHAR(10),
      logo_url TEXT, website TEXT, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS flights (
      id VARCHAR(36) PRIMARY KEY, flight_code VARCHAR(50), airline_id VARCHAR(36),
      origin VARCHAR(255), destination VARCHAR(255), departure DATETIME, arrival DATETIME,
      price DECIMAL(10,2) DEFAULT 0, seats INT DEFAULT 100, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), package_id VARCHAR(36),
      package_title VARCHAR(255), item_type VARCHAR(50) DEFAULT 'package',
      customer_name VARCHAR(255), customer_email VARCHAR(255), customer_phone VARCHAR(50),
      travel_date DATE, number_of_travelers INT DEFAULT 1,
      total_price DECIMAL(10,2) DEFAULT 0, status VARCHAR(50) DEFAULT 'pending',
      message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS promotions (
      id VARCHAR(36) PRIMARY KEY, title VARCHAR(255), description TEXT, image_url TEXT,
      discount_percent DECIMAL(5,2) DEFAULT 0, valid_until DATE, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS testimonials (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), location VARCHAR(255),
      avatar TEXT, rating INT DEFAULT 5, review TEXT, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS faqs (
      id VARCHAR(36) PRIMARY KEY, question TEXT, answer TEXT,
      active TINYINT DEFAULT 1, sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS announcements (
      id VARCHAR(36) PRIMARY KEY, text TEXT, link TEXT, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS payment_methods (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), type VARCHAR(50),
      account_number VARCHAR(255), instructions TEXT, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS team_members (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), role VARCHAR(255),
      bio TEXT, image_url TEXT, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS certifications (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), image_url TEXT,
      issued_by VARCHAR(255), active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS partners (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), logo_url TEXT,
      website TEXT, active TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(36) PRIMARY KEY, email VARCHAR(255) UNIQUE,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS pages (
      id VARCHAR(36) PRIMARY KEY, slug VARCHAR(255) UNIQUE, title VARCHAR(255),
      content LONGTEXT, meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS email_templates (
      id VARCHAR(36) PRIMARY KEY, name VARCHAR(255), subject TEXT, html_content LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), message TEXT,
      type VARCHAR(50), read_at DATETIME, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS package_reviews (
      id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), package_id VARCHAR(36),
      rating INT DEFAULT 5, comment TEXT, approved TINYINT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS favorites (
      id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), item_type VARCHAR(50), item_id VARCHAR(36),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of tables) {
    await pool.query(sql);
  }

  // Insert default site_content row if empty
  const [rows] = await pool.query('SELECT id FROM site_content LIMIT 1');
  if (rows.length === 0) {
    await pool.query(`INSERT INTO site_content (id, site_name, admin_url_slug, registration_open, rewards_active)
      VALUES (1, 'FlyEasy', 'admin', 1, 1)`);
  }
}

// ─── Create Admin Account ───────────────────────────────────────────────────
async function createAdminAccount(pool, email, password, name) {
  const bcrypt = (() => {
    try { return require('bcryptjs'); } catch {
      return require(path.join(BACKEND, 'node_modules', 'bcryptjs'));
    }
  })();
  const crypto = require('crypto');
  const id = crypto.randomUUID();
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE password=VALUES(password), role='admin', name=VALUES(name)`,
    [id, name, email, hash]
  );
}

// ─── PM2 Ecosystem Config ───────────────────────────────────────────────────
function generatePM2Config(backendPath, port) {
  return `module.exports = {
  apps: [
    {
      name: 'flyeasy-api',
      script: 'server.js',
      cwd: '${backendPath.replace(/\\/g, '/')}',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: ${port}
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
`;
}

// ─── Nginx Config ───────────────────────────────────────────────────────────
function generateNginxConfig(siteUrl, apiPort) {
  const domain = siteUrl.replace(/https?:\/\//, '').replace(/\/$/, '') || 'yourdomain.com';
  return `# FlyEasy Nginx Configuration
# Place this file in: /etc/nginx/sites-available/flyeasy
# Then: sudo ln -s /etc/nginx/sites-available/flyeasy /etc/nginx/sites-enabled/
# Then: sudo nginx -t && sudo systemctl reload nginx

server {
    listen 80;
    server_name ${domain} www.${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domain} www.${domain};

    # SSL (use certbot: sudo certbot --nginx -d ${domain})
    ssl_certificate     /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

    # ─── Frontend (React build) ───────────────────────────────────
    root /var/www/flyeasy/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        gzip_static on;
    }

    # ─── Backend API ──────────────────────────────────────────────
    location /api/ {
        proxy_pass http://127.0.0.1:${apiPort}/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ─── File Uploads ────────────────────────────────────────────
    location /uploads/ {
        proxy_pass http://127.0.0.1:${apiPort}/uploads/;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # ─── Security Headers ────────────────────────────────────────
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # ─── Gzip Compression ────────────────────────────────────────
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    client_max_body_size 20M;
}
`;
}

main().catch(err => {
  console.error(`${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
