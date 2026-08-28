# FlyEasy — Installation Guide

## Overview

FlyEasy comes with a fully automated installer. Run one command and it handles everything:

- ✅ Collects your database & SMTP credentials
- ✅ Creates `backend/.env` automatically
- ✅ Creates the MySQL database if it doesn't exist
- ✅ Creates all 22 database tables
- ✅ Installs all npm dependencies (backend + frontend)
- ✅ Builds the React frontend for production
- ✅ Creates your admin account
- ✅ Generates PM2 + Nginx configuration files

---

## Quick Start

### Option A — VPS / Linux (Ubuntu / Debian / CentOS)

```bash
# 1. Clone the repository
git clone https://github.com/MdAshrafuddinnoyon/flyeasy.git
cd flyeasy

# 2. Run the deploy script (installs Node.js & PM2 automatically if missing)
bash deploy.sh
```

### Option B — Windows (Local / XAMPP)

```
Double-click install.bat
```
or from PowerShell:
```powershell
node install.js
```

### Option C — Manual (any OS)

```bash
node install.js
```

---

## What the Installer Asks

| Prompt | Example | Notes |
|--------|---------|-------|
| MySQL Host | `localhost` | Use `127.0.0.1` if `localhost` fails |
| MySQL Port | `3306` | Default MySQL port |
| MySQL Username | `root` | Your cPanel DB user |
| MySQL Password | `****` | Hidden input |
| Database Name | `flyeasy` | Created automatically if missing |
| Website URL | `https://flyeasytourism.com` | Used for CORS & frontend `.env` |
| Backend Port | `4000` | Port the API server listens on |
| Admin Email | `admin@yoursite.com` | Login email for admin dashboard |
| Admin Password | `****` | Minimum 8 characters |
| SMTP Host | `smtp.gmail.com` | Optional — skip with Enter |
| SMTP Port | `587` | TLS port |
| SMTP Username | `you@gmail.com` | Gmail or any SMTP |
| SMTP Password | `****` | App password for Gmail |

---

## Files Generated After Installation

```
flyeasy/
├── backend/.env              ← Generated credentials (KEEP SECRET!)
├── frontend/.env             ← Frontend API URL
├── frontend/dist/            ← Production build (deploy this folder)
├── ecosystem.config.js       ← PM2 process manager config
└── nginx.conf.example        ← Copy to /etc/nginx/sites-available/
```

---

## cPanel Hosting Setup

1. **Create MySQL Database** in cPanel → MySQL Databases
2. **Create Database User** and assign full privileges
3. **Upload files** via File Manager or FTP to a folder (e.g., `/home/user/flyeasy`)
4. **Install Node.js App** via cPanel → Setup Node.js App:
   - Application root: `/home/user/flyeasy/backend`
   - Application URL: your subdomain or subfolder
   - Application startup file: `server.js`
   - Click "Create" then "Run NPM Install"
5. **Set environment variables** in cPanel Node.js App → Environment Variables (copy from `backend/.env`)
6. **Upload frontend** — upload `frontend/dist/` contents to `public_html/`

> For API routing on cPanel, add this to `public_html/.htaccess`:
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:4000/api/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

---

## VPS Post-Install Checklist

```bash
# Check PM2 status
pm2 status

# View live logs
pm2 logs flyeasy-api

# Install Nginx (if not already)
sudo apt install nginx

# Copy generated Nginx config
sudo cp nginx.conf.example /etc/nginx/sites-available/flyeasy
sudo ln -s /etc/nginx/sites-available/flyeasy /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Get free SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# PM2 auto-start on reboot
pm2 startup
pm2 save
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | MySQL server host | ✅ |
| `DB_PORT` | MySQL port (default: 3306) | ✅ |
| `DB_USER` | MySQL username | ✅ |
| `DB_PASSWORD` | MySQL password | ✅ |
| `DB_NAME` | Database name | ✅ |
| `PORT` | Backend API port | ✅ |
| `CORS_ORIGIN` | Frontend URL (for CORS) | ✅ |
| `JWT_SECRET` | JWT signing secret (auto-generated) | ✅ |
| `JWT_REFRESH_SECRET` | JWT refresh secret (auto-generated) | ✅ |
| `SMTP_HOST` | SMTP server hostname | Optional |
| `SMTP_PORT` | SMTP port | Optional |
| `SMTP_USER` | SMTP username/email | Optional |
| `SMTP_PASS` | SMTP password | Optional |
| `EMAIL_SENDER_NAME` | From name in emails | Optional |

> **Note:** SMTP settings can also be configured from Admin Dashboard → Site Content → Email, which takes priority over `.env`.

---

## Updating FlyEasy

```bash
# Pull latest code
git pull origin main

# Reinstall dependencies if package.json changed
cd backend && npm install
cd ../frontend && npm install

# Rebuild frontend
cd frontend && npm run build

# Restart backend
pm2 restart flyeasy-api
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` on DB connect | Check MySQL is running: `sudo systemctl status mysql` |
| `Port 4000 already in use` | Change `PORT` in `backend/.env` or kill the process |
| `CORS error` in browser | Make sure `CORS_ORIGIN` in `.env` matches your frontend URL exactly |
| Admin can't login | Re-run `node install.js` — it updates admin credentials via `ON DUPLICATE KEY UPDATE` |
| Email not sending | Check SMTP credentials in Admin → Site Content → Email Settings |
| Frontend shows blank page | Clear browser cache or check `frontend/.env` `VITE_API_BASE_URL` |

---

## Support

- **WhatsApp:** Set from Admin Dashboard → Site Content → Contact
- **Email:** Configure from Admin Dashboard → Site Content → Email
- **Developer:** [Web Search BD](https://websearchbd.com)
