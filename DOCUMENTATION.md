# FlyEasy Tourism - Developer Documentation

## Overview
FlyEasy Tourism is a full-stack web application built with the **MERN-like** stack, substituting MongoDB with **MySQL**. The application features a React frontend and an Express/Node.js backend, seamlessly integrated for easy deployment.

### Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MySQL (mysql2 promise pool), JWT Authentication, Nodemailer.
- **Database**: MySQL.

## Project Structure
- `/frontend` - Contains the React Vite application.
- `/backend` - Contains the Node.js Express server.
- `/backend/public` - Contains the built React application (served by Express in production) and user uploaded images (`/images`, `/uploads`).
- `Deploy Final.zip` - The final, production-ready Hostinger deployment package containing both backend and the built frontend.

## Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MdAshrafuddinnoyon/flyeasy.git
   cd flyeasy
   ```

2. **Backend Setup:**
   - Navigate to `/backend`.
   - Run `npm install`.
   - Create a `.env` file based on your local MySQL credentials:
     ```env
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=flyeasymysql
     JWT_SECRET=flyeasy_secure_key_12345
     PORT=4000
     CORS_ORIGIN=http://localhost:5173
     INSTALLED=true
     ```
   - Import `backend/install.sql` into your local MySQL server.
   - Run `npm run dev` to start the backend on port 4000.

3. **Frontend Setup:**
   - Navigate to `/frontend`.
   - Run `npm install`.
   - Ensure `frontend/.env` contains:
     ```env
     VITE_API_BASE_URL=http://localhost:4000/api
     ```
   - Run `npm run dev` to start the frontend on port 5173.

## Deployment (Hostinger / cPanel)

FlyEasy is designed for zero-configuration auto-deployment on shared hosting platforms like Hostinger.

1. **Build Frontend**: Inside `/frontend`, run `npm run build`. This outputs to `/frontend/dist`.
2. **Move Build**: Copy everything from `/frontend/dist` into `/backend/public/`.
3. **Configure API**: Ensure `frontend/.env` is set to `VITE_API_BASE_URL=/api` before building for production to avoid CORS/Network errors.
4. **Prepare ZIP**: Zip the entire `/backend` folder (excluding `node_modules`). The provided `Deploy Final.zip` already has this prepared.
5. **Upload & Deploy**: 
   - Upload the ZIP file to Hostinger File Manager.
   - Extract the files into the `public_html` or domain root folder.
   - In Hostinger Node.js App settings, set the startup file to `server.js`.
   - Run NPM install from the Hostinger dashboard (or SSH).
6. **Auto Database Setup**: The `server.js` includes an automatic database setup tool. As long as you have added your Hostinger Database credentials into the `.env` file, the server will automatically import the `install.sql` file upon its first boot.
7. **Fixing Image URLs**: After deploying, visit `https://yourdomain.com/api/fix-urls` to automatically convert all local `http://localhost:4000` image links to your live domain link.

## API Routes Overview
- `/api/auth` - Login, Registration, Profile Management.
- `/api/packages` - Holiday packages CRUD.
- `/api/flights` - Flight search and booking.
- `/api/bookings` - User bookings management.
- `/api/site-content` - Dynamic content for the CMS (logo, hero texts, etc.).
- `/api/upload` - Multer image uploads.
- `/setup` - Smart Web Installer UI.

## Environment Variables
- `process.env.INSTALLED`: If set to `true`, the web installer (`/setup`) is bypassed.
- `process.env.DB_PASS` or `process.env.DB_PASSWORD`: Supported for legacy database configurations.

## Maintenance
- Node.js version 18.x or 22.x is recommended.
- File uploads are stored locally in `backend/public/uploads`. Ensure this folder has write permissions in production (CHMOD 755).
