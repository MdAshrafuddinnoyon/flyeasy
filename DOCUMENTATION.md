# FlyEasy — Full Developer Documentation

> Version: 2.0 | Last Updated: August 2026 | Stack: React 18 + Node.js + MySQL

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Authentication System](#2-authentication-system)
3. [Database Design](#3-database-design)
4. [API Layer Details](#4-api-layer-details)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Admin Dashboard Modules](#6-admin-dashboard-modules)
7. [Client Portal Modules](#7-client-portal-modules)
8. [Email System](#8-email-system)
9. [PDF Ticket Generation](#9-pdf-ticket-generation)
10. [WhatsApp Global Integration](#10-whatsapp-global-integration)
11. [Site Content CMS](#11-site-content-cms)
12. [File Upload System](#12-file-upload-system)
13. [Security Considerations](#13-security-considerations)
14. [Known Issues & Solutions](#14-known-issues--solutions)
15. [Changelog](#15-changelog)

---

## 1. Architecture Overview

```
Browser (React SPA)
        │
        │ HTTP / REST
        ▼
  Express API (Port 4000)
        │
        │ mysql2/promise
        ▼
   MySQL 8 Database
```

### Request Flow

1. React frontend sends requests to `/api/*` via Axios
2. JWT interceptor (`api.js`) automatically attaches `Authorization: Bearer <token>`
3. Express middleware (`auth.js`) verifies token on protected routes
4. Route handler queries MySQL via `pool.query()`
5. Response returned as JSON

### Monorepo Layout

```
flyeasy-mysql/
├── backend/      ← Express REST API
└── frontend/     ← React + Vite SPA
```

Both run independently. In production, frontend is built to static files served via Nginx with API proxied to Node.js.

---

## 2. Authentication System

### Endpoints

| Endpoint | Method | Body | Notes |
|----------|--------|------|-------|
| `/auth/register` | POST | `{name, email, password, phone}` | Creates user with `role=client` |
| `/auth/login` | POST | `{email, password}` | Returns `accessToken` + `refreshToken` |
| `/auth/refresh` | POST | `{refreshToken}` | Returns new `accessToken` |
| `/auth/me` | GET | — | Returns current user profile |
| `/auth/forgot-password` | POST | `{email}` | Sends reset link email |
| `/auth/reset-password` | POST | `{token, password}` | Resets password |

### JWT Strategy

- **Access Token**: expires in 7 days (stored in localStorage as `flyeasy_token`)
- **Refresh Token**: expires in 30 days (stored in localStorage as `flyeasy_refresh`)
- **Admin** role check: `req.user.role === 'admin'` in route handlers

### Password Reset Flow

1. User submits email to `/auth/forgot-password`
2. Backend generates a secure token (stored in `password_reset_tokens` table)
3. Email sent with reset link: `CLIENT_URL/reset-password?token=...`
4. User submits new password to `/auth/reset-password` with token
5. Token is deleted after use

---

## 3. Database Design

### Auto-Migration

All tables are created automatically in `routes/setup.js` via `CREATE TABLE IF NOT EXISTS`. No manual migration needed — just run the server.

### Core Tables

#### `users`
```sql
id          VARCHAR(36) PRIMARY KEY
name        VARCHAR(255)
email       VARCHAR(255) UNIQUE
password    VARCHAR(255)           -- bcrypt hash
role        ENUM('client','admin') DEFAULT 'client'
phone       VARCHAR(50)
avatar      TEXT
created_at  TIMESTAMP
```

#### `bookings`
```sql
id                  VARCHAR(36) PRIMARY KEY
user_id             VARCHAR(36)            -- nullable (guest bookings)
package_id          VARCHAR(36)
package_title       VARCHAR(255)
item_type           VARCHAR(50)            -- 'package', 'hotel', 'flight', 'guide'
customer_name       VARCHAR(255)
customer_email      VARCHAR(255)
customer_phone      VARCHAR(50)
travel_date         DATE
number_of_travelers INT DEFAULT 1
total_price         DECIMAL(10,2)
status              VARCHAR(50) DEFAULT 'pending'
message             TEXT
created_at          TIMESTAMP
```

#### `site_content`
Single-row configuration table. All global settings stored here.
```sql
id                  INT PRIMARY KEY DEFAULT 1
site_name           VARCHAR(255)
logo_light_url      TEXT
logo_dark_url       TEXT
hero_headline       TEXT
hero_subheadline    TEXT
contact_phone       VARCHAR(50)
contact_whatsapp    VARCHAR(50)
contact_email       VARCHAR(255)
contact_address     TEXT
footer_about        TEXT
social_facebook     TEXT
social_instagram    TEXT
social_twitter      TEXT
social_linkedin     TEXT
social_youtube      TEXT
smtp_host           VARCHAR(255)
smtp_port           INT
smtp_user           VARCHAR(255)
smtp_pass           TEXT
email_sender_name   VARCHAR(255)
email_sender_email  VARCHAR(255)
admin_url_slug      VARCHAR(100) DEFAULT 'admin'
header_links        JSON
footer_links        JSON
seo_description     TEXT
seo_keywords        TEXT
...
```

#### `packages`
```sql
id            VARCHAR(36) PRIMARY KEY
title         VARCHAR(255)
price         DECIMAL(10,2)
duration      VARCHAR(100)
destination   VARCHAR(255)
description   TEXT
image_url     TEXT
gallery       JSON    -- array of image URLs
itinerary     JSON    -- array of {day, title, description}
inclusions    JSON    -- array of strings
exclusions    JSON    -- array of strings
active        TINYINT DEFAULT 1
```

---

## 4. API Layer Details

### CRUD Factory (`routes/crudFactory.js`)

A generic factory that generates full CRUD endpoints for any MySQL table:

```js
// Usage in server.js:
const crudRouter = createCrudRouter('packages', ALLOWED_COLUMNS, authRequired, adminRequired);
app.use('/api/packages', crudRouter);
```

Generated endpoints:
- `GET /` — list all, ordered by `created_at DESC`
- `GET /:id` — get single record
- `POST /` — create (admin only)
- `PUT /:id` — update (admin only)
- `DELETE /:id` — delete (admin only)

All IDs are UUID v4 generated with `crypto.randomUUID()`.

### Bookings Route Special Logic

`routes/bookings.js` extends the factory with:
1. **Auto-link to user**: if JWT token present, `user_id` is attached automatically
2. **Email notification**: on every new booking, admin email is triggered via `utils/email.js`
3. **Role-based list**: clients see only their own bookings; admins see all

### Site Content Route

`routes/siteContent.js`:
- `GET /api/site-content` — public, returns full config object
- `PUT /api/site-content` — admin only, merges updates into single row

---

## 5. Frontend Architecture

### State Management

| Data Type | Solution |
|-----------|----------|
| Server state (API data) | TanStack Query v5 |
| Auth state | React Context (`AuthContext.jsx`) |
| UI state | Component-level `useState` |

### API Abstraction (`src/lib/api.js`)

```js
// Axios instance with JWT interceptor
export const api = axios.create({ baseURL: 'http://localhost:4000/api' });

// Auto-attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('flyeasy_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Entity helpers (CRUD wrappers)
export const Entities = {
  packages: crud('packages'),
  hotels:   crud('hotels'),
  flights:  crud('flights'),
  bookings: crud('bookings'),
  faqs:     crud('faqs'),
  // ...20+ entities
};

// Site content helper
export const SiteContent = {
  get: () => api.get('/site-content').then(r => r.data),
  update: (data) => api.put('/site-content', data).then(r => r.data),
};
```

### Routing (`App.jsx`)

```
/                   → Home
/packages           → Packages listing
/packages/:id       → PackageDetail
/hotels             → Hotels listing
/hotels/:id         → HotelDetail
/flights            → Flights search & booking
/promotions         → Promotions
/promotions/:id     → PromotionDetail
/about              → About
/contact            → Contact
/customer-support   → CustomerSupport
/terms              → Terms & Conditions
/privacy            → Privacy Policy
/cancellation       → Cancellation Policy
/cookies            → Cookie Policy
/faq                → FAQ
/careers            → Careers
/testimonials       → Testimonials
/login              → Login
/register           → Register
/forgot-password    → ForgotPassword
/reset-password     → ResetPassword
/portal             → ClientDashboard (auth required)
/[admin_slug]       → AdminDashboard (admin required)
/[admin_slug]/*     → Admin sub-pages
/pages/:slug        → CustomPage (CMS)
*                   → PageNotFound
```

---

## 6. Admin Dashboard Modules

### AdminContent.jsx (Site Content)
The central settings hub. Tabs:
- **Branding** — site name, logo (light/dark), favicon
- **Hero** — headline, subheadline, badge text, image URL
- **Contact** — phone, WhatsApp, email, address, map embed, support hours
- **Social Media** — Facebook, Instagram, Twitter, YouTube, LinkedIn
- **Footer** — about text, footer link columns (JSON editor)
- **Header** — navigation links (JSON editor)
- **SEO** — meta description, keywords
- **Email / SMTP** — host, port, user, password, sender name
- **About Page** — toggle sections: stats, team, certifications, FAQs, airlines, partners
- **Security** — change admin URL slug

### AdminPackages.jsx
- Full CRUD with inline gallery management
- Itinerary builder (day-by-day entries)
- Inclusions/Exclusions list editor
- Image upload via Media Library picker

### AdminBookings.jsx
- Table with filters: All / Pending / Confirmed / Paid / Cancelled
- Inline status dropdown update
- Booking detail modal
- PDF download for admin

### AdminEmailTemplates.jsx
- Rich HTML editor (React Quill)
- Live email preview panel
- Template variables: `[Customer Name]`, `[Package Name]`, `[Amount]`, `[WhatsApp]`, `[Site Name]`, etc.
- Test send button

### AdminUsers.jsx
- User list with role, email, created date
- Role promotion/demotion (client ↔ admin)
- Account disable/delete

---

## 7. Client Portal Modules

### ClientDashboard.jsx
Shell page with sidebar navigation and panel rendering.

### BookingsPanel.jsx + BookingRow.jsx
- Splits bookings into Upcoming & History tabs
- Each row shows: icon, title, type, date, travelers, price, status badge
- **"Pay Now"** button → opens PaymentModal
- **Download PDF** button → calls `generateBookingPDF()`

### PaymentModal.jsx
- Fetches active payment methods from `/api/payment-methods`
- Shows bKash/Nagad number with one-click copy
- Bank transfer details
- **WhatsApp confirmation button** — number sourced globally from `SiteContent`

### ThankYouModal.jsx (Global Component)
Used after every successful form submission:
- Animated checkmark icon
- Custom title, message, sub-message props
- **WhatsApp "Chat" button** — fetched from `SiteContent.contact_whatsapp`
- Used in: Contact.jsx, PackageDetail.jsx, HotelDetail.jsx

---

## 8. Email System

### Transport (`utils/email.js`)

```js
async function getSiteContent() {
  const [rows] = await pool.query('SELECT * FROM site_content LIMIT 1');
  return rows[0] || {};
}

async function sendEmail(to, subject, text, html) {
  const site = await getSiteContent();
  const transporter = nodemailer.createTransport({
    host: site.smtp_host || process.env.SMTP_HOST,
    port: site.smtp_port || process.env.SMTP_PORT,
    auth: { user: site.smtp_user, pass: site.smtp_pass }
  });
  await transporter.sendMail({
    from: `"${site.email_sender_name}" <${site.smtp_user}>`,
    to, subject, text, html
  });
}
```

### Template Engine (`utils/emailTemplate.js`)

Replaces `[Variable]` placeholders in stored HTML templates:
```js
function generateEmailTemplate({ title, content }) {
  // Loads base HTML template
  // Replaces [Title], [Content], [Site Name], [WhatsApp], etc.
  return finalHtml;
}
```

### Email Triggers
| Event | Recipient | Template |
|-------|-----------|----------|
| New booking | Admin (`info@flyeasytourism.com`) | "New Booking Received" |
| Contact form | Admin | Raw HTML |
| Booking status change | Customer | Status notification template |
| Password reset | User | Reset link email |

---

## 9. PDF Ticket Generation

**File:** `src/lib/pdfGenerator.js`

### How it works

```js
export async function generateBookingPDF(booking, user, itemType) {
  // 1. Fetch site config (logo URL, contact info, site name)
  const site = await getSiteInfo();

  // 2. Fetch logo as base64 for embedding
  const logoBase64 = await fetchLogoBase64(site.logo_light_url);

  // 3. Build jsPDF document with:
  //    - Blue header banner with logo
  //    - Status badge
  //    - Passenger details card + Trip details card (side by side)
  //    - Dashed tear-line divider
  //    - Full booking summary table (jspdf-autotable)
  //    - Total price highlighted box
  //    - Important notes warning box
  //    - Contact info section
  //    - Dark footer with copyright

  doc.save(`FlyEasy_Ticket_${bookingId}.pdf`);
}
```

### Called From
- `Flights.jsx` — after booking confirmation modal
- `BookingRow.jsx` — Download button in client portal

### Dependencies
```json
"jspdf": "^4.2.1",
"jspdf-autotable": "^5.0.8"
```

> **Important:** Import `autoTable` as a named default, not as `doc.autoTable()` — this is required for Vite/ESM compatibility.

---

## 10. WhatsApp Global Integration

The WhatsApp number is stored once in `site_content.contact_whatsapp`.

### Components that read it dynamically:

| Component | How it's used |
|-----------|--------------|
| `WhatsAppSupport.jsx` | Floating chat widget (bottom-right) |
| `ThankYouModal.jsx` | "Chat on WhatsApp" button after booking |
| `Contact.jsx` | Contact card with WhatsApp link |
| `CustomerSupport.jsx` | WhatsApp link in support section |
| `PaymentModal.jsx` | "Confirm payment via WhatsApp" button |
| `pdfGenerator.js` | WhatsApp number printed in PDF footer |

**To change the number:** Admin → Site Content → Contact → WhatsApp Number → Save.  
All instances update automatically — no code change required.

---

## 11. Site Content CMS

`site_content` is a single-row MySQL table acting as a global config store.

### JSON Fields

`header_links` and `footer_links` store structured navigation:
```json
[
  {
    "title": "COMPANY",
    "links": [
      { "label": "About Us", "url": "/about" },
      { "label": "Contact", "url": "/contact" }
    ]
  }
]
```

### About Page Toggles
Boolean flags control which sections appear on the About page:
- `about_show_stats` — Statistics counter section
- `about_show_team` — Team members section  
- `about_show_certs` — Certifications section
- `about_show_faqs` — FAQ accordion section
- `about_show_airlines` — Airlines/partners carousel
- `about_show_partners` — Partner logos grid

---

## 12. File Upload System

**Endpoint:** `POST /api/upload`  
**Middleware:** Multer (memory storage)  
**Auth:** Required

```js
// Client usage
const url = await Upload.image(file); // returns "/uploads/filename.jpg"
```

Uploaded files are stored in `backend/public/uploads/` and served statically.

In production, replace with S3 or Cloudinary by modifying `routes/upload.js`.

---

## 13. Security Considerations

| Area | Implementation |
|------|---------------|
| Passwords | bcrypt with salt rounds = 10 |
| JWT | HS256, short-lived access tokens |
| Admin routes | `adminRequired` middleware checks `role === 'admin'` |
| Admin URL | Custom slug (not `/admin`) configurable from dashboard |
| SQL injection | Parameterized queries (`pool.query('...', [params])`) |
| File uploads | Multer validates MIME type; only image/* allowed |
| CORS | Configured for `CLIENT_URL` only |

---

## 14. Known Issues & Solutions

### jspdf-autotable in Vite (ESM)
**Problem:** `doc.autoTable is not a function`  
**Fix:** Import as `import autoTable from 'jspdf-autotable'` and call `autoTable(doc, options)` instead of `doc.autoTable(options)`

### RegExp in Email Templates
**Problem:** `Invalid regular expression` when template keys contain special chars  
**Fix:** Escape keys before creating RegExp:
```js
const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp(escapedKey, 'g');
```

### Site Content Returns Array
**Problem:** `getSiteContent()` returned `[{}]` instead of `{}`  
**Fix:** Use `LIMIT 1` and return `rows[0]`:
```js
const [rows] = await pool.query('SELECT * FROM site_content LIMIT 1');
return rows[0] || {};
```

---

## 15. Changelog

### v2.0 — August 2026
- ✅ Global WhatsApp integration across all pages
- ✅ Modern Thank You popup modal (`ThankYouModal.jsx`)
- ✅ Professional PDF ticket with logo, branding, branded layout
- ✅ PDF download in Client Portal Bookings panel
- ✅ Fixed `jspdf-autotable` ESM import for Vite
- ✅ Footer & Header management via Admin Site Content
- ✅ FAQ dynamic from database (Customer Support + Admin)
- ✅ Contact form email with dynamic template engine
- ✅ Fixed email template RegExp injection bug
- ✅ Terms / Privacy / Cancellation / Cookie pages with full CMS content
- ✅ Customer Support page fully responsive with FAQ section

### v1.0 — August 2026 (initial)
- Full booking system: Packages, Hotels, Flights
- Admin dashboard with 25+ modules
- Client portal with bookings, payments, reviews
- Auth system with JWT + refresh tokens
- Email notifications via Nodemailer
- Media library for image management
- Announcement banner system
- Newsletter subscription
- Dynamic promotions with expiry
