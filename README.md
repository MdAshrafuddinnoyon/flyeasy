<div align="center">
  <img src="frontend/public/images/logo-light.png" alt="FlyEasy Logo" height="60" />
  <h1>FlyEasy Tourism Platform</h1>
  <p><strong>A full-stack travel booking & management system — built for modern tourism businesses.</strong></p>

  ![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
  ![React](https://img.shields.io/badge/React-18-blue?logo=react)
  ![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql)
  ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
  ![License](https://img.shields.io/badge/License-MIT-lightgrey)
</div>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Live Features](#-live-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Quick Start](#-quick-start)
6. [Environment Variables](#-environment-variables)
7. [Admin Dashboard Guide](#-admin-dashboard-guide)
8. [Client Portal Guide](#-client-portal-guide)
9. [API Reference](#-api-reference)
10. [Database Schema](#-database-schema)
11. [Deployment](#-deployment)

---

## 🌟 Overview

**FlyEasy** is a production-ready, full-stack tourism & travel booking platform. It provides:

- A beautiful **public-facing website** with flight search, package browsing, hotel discovery, promotions, and more.
- A powerful **Admin Dashboard** to manage every aspect of the site — content, bookings, users, emails, payments, and settings — all from one place.
- A **Client Portal** where registered users track their bookings, download PDF tickets, manage favourites, earn rewards, and pay online.
- **WhatsApp integration** — one global number drives chat buttons across the entire site.
- **Dynamic email system** with editable HTML templates sent via SMTP.
- **PDF ticket generation** with logo, branded layout, and full booking details.

---

## ✈️ Live Features

### Public Website

| Page | Description |
|------|-------------|
| **Home** | Hero banner, stats counter, featured packages, promotions, testimonials, partners |
| **Packages** | Browse & filter all tour packages by price, destination |
| **Package Detail** | Full package info, gallery, itinerary, booking form, FAQ |
| **Hotels** | Hotel listing with star rating, location, amenities |
| **Hotel Detail** | Rich hotel profile with booking form |
| **Flights** | Live flight search by origin/destination, book with PDF ticket |
| **Promotions** | Active promotional offers with countdown timers |
| **About** | Mission, stats, team, certifications, airlines, partner logos |
| **Contact** | Contact form → email notification + Thank You popup with WhatsApp |
| **Customer Support** | FAQ accordion, quick contact, support hours |
| **Terms & Conditions** | Full CMS-managed legal content |
| **Privacy Policy** | CMS-managed privacy content |
| **Cancellation Policy** | CMS-managed cancellation rules |
| **Cookie Policy** | GDPR-friendly cookie policy |
| **Careers** | Job listings page |
| **Testimonials** | User reviews page |
| **FAQ** | Searchable FAQ page |
| **Custom Pages** | Dynamically generated pages via Admin CMS |
| **404** | Branded not-found page |

### Admin Dashboard (`/[admin_slug]`)

| Module | What you can manage |
|--------|---------------------|
| **Dashboard** | KPI cards: bookings, revenue, users, messages + recent activity |
| **Packages** | Create, edit, delete tour packages with gallery, itinerary, inclusions |
| **Hotels** | Manage hotels with amenities, star rating, pricing |
| **Flights** | Manage flight routes, prices, seats, airline logos |
| **Bookings** | View all bookings, update status, filter by type/status |
| **Airlines** | Add airlines with logo, IATA code, active toggle |
| **Announcements** | Manage scrolling banner announcements |
| **Users & Clients** | View registered users, roles, manage accounts |
| **Reviews** | Approve/reject user reviews and package ratings |
| **Promotions** | Create discount campaigns with validity dates |
| **Team Members** | Manage staff profiles shown on About page |
| **Certifications** | Add trust badges & certifications |
| **Partners** | Manage partner/airline logo carousel |
| **Testimonials** | Curate featured testimonials |
| **FAQs** | Add/edit FAQ entries (used on website & support page) |
| **Payment Methods** | Add bKash, Nagad, bank transfer methods |
| **Email Templates** | Fully editable HTML email templates with live preview |
| **Newsletter** | View & export all newsletter subscribers |
| **Messages / Leads** | All contact form submissions with status tracking |
| **Media Library** | Upload and manage image assets |
| **Custom Pages** | Create CMS pages with rich text editor |
| **Site Content** | Global settings: logo, SEO, hero text, social links, WhatsApp, SMTP, footer |
| **Admin URL Slug** | Customize the secret admin path |

### Client Portal (`/portal`)

| Feature | Description |
|---------|-------------|
| **Overview** | Greeting card, upcoming trip, weather widget, announcements |
| **My Bookings** | Upcoming & history bookings, PDF download per booking |
| **Payments** | View bKash/Nagad/bank details, confirm payment via WhatsApp |
| **Reviews** | Submit star ratings & reviews for past bookings |
| **Favourites** | Save favourite packages |
| **Rewards** | Loyalty points system |
| **Travel Guide** | Trip preparation tips |
| **Settings** | Profile update, password change, preferences |

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite 5** — fast HMR development
- **React Router v6** — client-side routing
- **TanStack Query v5** — server state & caching
- **Tailwind CSS v3** + **@tailwindcss/typography** — utility-first styling
- **Radix UI** — accessible dialog, dropdown, tabs, toast components
- **Framer Motion** — page transitions & micro-animations
- **jsPDF** + **jspdf-autotable** — PDF ticket generation
- **Lucide React** — icon library
- **Axios** — HTTP client with JWT interceptor
- **Recharts** — admin analytics charts
- **React Quill** — rich text editor for CMS

### Backend
- **Node.js 20** + **Express.js** — REST API server
- **MySQL 8** (mysql2/promise) — relational database
- **JSON Web Tokens (JWT)** — auth (access + refresh tokens)
- **Nodemailer** — SMTP email delivery
- **Multer** — file upload middleware
- **bcryptjs** — password hashing
- **dotenv** — environment management

---

## 📁 Project Structure

```
flyeasy-mysql/
├── backend/                    # Express API server
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js             # JWT verify middleware
│   ├── routes/
│   │   ├── auth.js             # Login, register, refresh, reset password
│   │   ├── bookings.js         # Booking CRUD + email notification
│   │   ├── crudFactory.js      # Generic REST factory for 20+ entities
│   │   ├── email.js            # Contact form, SMTP send
│   │   ├── entities.js         # Dynamic entity endpoints
│   │   ├── favorites.js        # Favourites management
│   │   ├── reviews.js          # Review submission
│   │   ├── setup.js            # DB auto-migration & table creation
│   │   ├── siteContent.js      # Global site settings CRUD
│   │   └── upload.js           # Image upload
│   ├── utils/
│   │   ├── email.js            # Nodemailer transport + getSiteContent
│   │   └── emailTemplate.js    # HTML email template engine
│   ├── server.js               # Express app entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── frontend/                   # React + Vite SPA
│   ├── public/
│   │   └── images/             # Static images & logos
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/           # Hero, Services, Features, Stats sections
│   │   │   ├── portal/         # Client portal panels & modals
│   │   │   ├── ui/             # Radix-based shared UI components
│   │   │   ├── AnnouncementBanner.jsx
│   │   │   ├── DeveloperCredit.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── PlaneFlyOverlay.jsx # Animated booking success overlay
│   │   │   ├── ThankYouModal.jsx   # Global Thank You popup w/ WhatsApp
│   │   │   └── WhatsAppSupport.jsx # Floating WhatsApp chat button
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── lib/
│   │   │   ├── api.js              # Axios instance + entity helpers
│   │   │   └── pdfGenerator.js     # Professional PDF ticket builder
│   │   ├── pages/
│   │   │   ├── admin/              # 25+ admin dashboard pages
│   │   │   ├── portal/             # Client dashboard
│   │   │   └── *.jsx               # Public pages
│   │   ├── App.jsx                 # Router config
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── DOCUMENTATION.md            # Full developer documentation
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 20
- **MySQL** 8.x running locally
- **npm** ≥ 10

### 1. Clone the repository
```bash
git clone https://github.com/MdAshrafuddinnoyon/flyeasy.git
cd flyeasy
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and SMTP settings
npm install
node server.js
```

The server automatically creates all required database tables on first run.

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Create Admin Account
```bash
cd backend
node create-admin.js
```

Visit `http://localhost:5173` — the site is live!  
Admin panel: `http://localhost:5173/admin` (or your custom slug)

---

## ⚙️ Environment Variables

Create `backend/.env` from the provided `backend/.env.example`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flyeasy

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret

# Server
PORT=4000
CLIENT_URL=http://localhost:5173

# SMTP (configurable from Admin → Site Content)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
```

> **Note:** SMTP settings can also be configured live from the Admin Dashboard under Site Content → Email Settings, which overrides `.env` values.

---

## 🔐 Admin Dashboard Guide

1. Navigate to `/admin` (or your custom slug set in Site Content)
2. Login with your admin credentials
3. The slug can be changed anytime from **Site Content → Security**

### Key Admin Workflows

**Publishing a Package:**
- Admin → Packages → Add New
- Fill title, price, destinations, duration, inclusions, itinerary
- Upload gallery images from Media Library
- Save → Instantly live on website

**Managing Bookings:**
- Admin → Bookings → filter by status (pending / confirmed / paid / cancelled)
- Click a booking to update status
- Customer gets email notification on status change

**Updating Global WhatsApp:**
- Admin → Site Content → Contact Information → WhatsApp Number
- Save — all chat buttons across the site update instantly (no code change needed)

**Email Templates:**
- Admin → Email Templates → select template
- Edit HTML with live preview
- Variables: `[Customer Name]`, `[Package Name]`, `[Amount]`, `[WhatsApp]`, etc.

---

## 👤 Client Portal Guide

1. Register at `/register` or login at `/login`
2. Navigate to `/portal`
3. **My Bookings** → see all trips, click **⬇ Download** to get PDF ticket
4. **Payments** → view bank/mobile payment details, confirm via WhatsApp
5. **Reviews** → rate completed bookings
6. **Settings** → update profile & change password

---

## 📡 API Reference

Base URL: `http://localhost:4000/api`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create user account |
| POST | `/auth/login` | Login, returns JWT pair |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Send password reset email |
| POST | `/auth/reset-password` | Reset with token |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | Optional | Create booking (auto-links to user if logged in) |
| GET | `/bookings` | Required | List all (admin) or own (client) |
| PUT | `/bookings/:id` | Admin | Update status |
| DELETE | `/bookings/:id` | Admin | Delete booking |

### Site Content
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/site-content` | Public | Get all global settings |
| PUT | `/site-content` | Admin | Update any setting field |

### CRUD Entities (all follow the same pattern)
`/packages`, `/hotels`, `/flights`, `/airlines`, `/faqs`, `/testimonials`, `/promotions`, `/team-members`, `/certifications`, `/partners`, `/announcements`, `/payment-methods`, `/email-templates`, `/pages`, `/newsletter-subscribers`, `/notifications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:entity` | List all |
| GET | `/:entity/:id` | Get one |
| POST | `/:entity` | Create (Admin) |
| PUT | `/:entity/:id` | Update (Admin) |
| DELETE | `/:entity/:id` | Delete (Admin) |

### Email
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email/contact` | Submit contact form → sends email to admin |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload image, returns URL |

---

## 🗄️ Database Schema

All tables are auto-created by `routes/setup.js` on server start.

| Table | Key Columns |
|-------|-------------|
| `users` | id, name, email, password, role, phone, avatar |
| `packages` | id, title, price, duration, destination, gallery (JSON), itinerary (JSON) |
| `hotels` | id, name, location, city, price_per_night, star_rating, amenities (JSON) |
| `flights` | id, flight_code, origin, destination, departure, arrival, price, seats |
| `airlines` | id, name, iata_code, logo_url, active |
| `bookings` | id, user_id, package_id, package_title, item_type, customer_name, customer_email, customer_phone, travel_date, number_of_travelers, total_price, status |
| `site_content` | Single-row config table: hero, logo, contact, SMTP, social, footer, SEO |
| `faqs` | id, question, answer, active |
| `promotions` | id, title, discount_percent, valid_until, active |
| `email_templates` | id, name, subject, html_content |
| `payment_methods` | id, name, type (bkash/nagad/bank), account_number, active |
| `notifications` | id, user_id, message, read, type |
| `favorites` | id, user_id, item_type, item_id |
| `package_reviews` | id, user_id, package_id, rating, comment, approved |
| `pages` | id, slug, title, content, meta_description |

---

## 🚢 Deployment

### Backend (Node.js)
```bash
cd backend
npm install --production
# Use PM2 for process management:
npm install -g pm2
pm2 start server.js --name flyeasy-api
pm2 save
```

### Frontend (Static Build)
```bash
cd frontend
npm run build
# Deploy dist/ folder to any static host (Nginx, Vercel, Netlify, cPanel)
```

### Nginx Sample Config
```nginx
server {
    listen 80;
    server_name flyeasytourism.com;

    # Frontend
    root /var/www/flyeasy/frontend/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT © 2025 [FlyEasy Tourism](https://flyeasytourism.com) — Developed & maintained by [Web Search BD](https://websearchbd.com)
