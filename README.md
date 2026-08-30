# FlyEasy Tourism Platform

**Production-ready travel booking platform** developed by [WebSearchBD](https://websearchbd.com/) for FlyEasy Tourism.

---

## 📋 About

FlyEasy is a comprehensive full-stack web application for flight, hotel, and holiday package bookings. It features:

- ✈️ Flight search and booking
- 🏨 Hotel listing and reservations
- 🌴 Holiday package management
- 👤 Client portal with booking history
- 🛡️ Secure admin dashboard (Page Control, File Manager, Content Editor)
- 📧 Email notifications (SMTP configurable)
- 💳 SSLCommerz payment gateway integration
- 🌐 Fully responsive (mobile-first)

---

## 🚀 Hostinger Deployment Guide

### Step 1 — Upload to Hostinger
1. Login to **hPanel** → **File Manager**
2. Navigate to `public_html/` (or your subdomain folder)
3. Upload `FlyEasy_Final_v2.zip`
4. Right-click → **Extract**

### Step 2 — Create Database
1. In hPanel → **MySQL Databases**
2. Create a new database (e.g., `u123456_flyeasy`)
3. Create a database user and assign all privileges

### Step 3 — Run Setup Wizard
1. In hPanel → **Node.js** → Set entry point to `server.js` → Start
2. Open browser: `https://yourdomain.com/setup`
3. Fill in:
   - Database Host: `localhost`
   - Database Name: (from Step 2)
   - Database User / Password: (from Step 2)
   - SMTP settings (optional)
4. Click **Verify & Install**
5. Setup will auto-import all data and self-destruct the setup page

### Step 4 — Fix Image URLs
After setup, run in browser (admin logged in):
```
GET https://yourdomain.com/api/fix-urls
```
Or find and call from Admin Dashboard → Settings.

---

## 🔒 Security Features
- JWT-based authentication with auto-generated secrets
- Rate limiting on login (20/15min), uploads (30/min), global (300/15min)
- CSRF protection via CORS configuration
- Helmet-equivalent security headers
- Admin-only file upload & deletion
- Setup page auto-deletes after installation

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `4000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `u123456_flyeasy` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `DB_NAME` | Database name | `u123456_flyeasydb` |
| `JWT_SECRET` | JWT signing secret (auto-generated) | |
| `CORS_ORIGIN` | Allowed origin (empty = same domain) | `https://yourdomain.com` |
| `SITE_URL` | Live site URL (for image fix) | `https://yourdomain.com` |
| `INSTALLED` | Mark as installed | `true` |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MySQL (MariaDB compatible) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Payments | SSLCommerz |
| Email | Nodemailer (SMTP) |
| Hosting | Hostinger (Node.js) |

---

## 📄 License & Intellectual Property

**© 2026 WebSearchBD. All rights reserved.**

This software is proprietary and confidential. It was developed by [WebSearchBD](https://websearchbd.com/) exclusively for **FlyEasy Tourism**. Unauthorized copying, distribution, modification, or use of this software, in whole or in part, is strictly prohibited without the express written permission of WebSearchBD.

> Developed by: **WebSearchBD**  
> Website: [https://websearchbd.com](https://websearchbd.com)  
> Client: FlyEasy Tourism  
