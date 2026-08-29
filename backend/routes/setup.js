const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Render setup form
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FlyEasy Setup</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #f8fafc; display: flex; justify-content: center; padding: 50px; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 500px; }
        h1 { color: #0f172a; margin-top: 0; }
        .group { margin-bottom: 15px; }
        label { display: block; font-weight: 500; margin-bottom: 5px; font-size: 14px; }
        input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 5px; width: calc(100% - 22px); }
        button { background: #3b82f6; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; margin-top: 10px; font-size: 16px; }
        button:disabled { opacity: 0.7; cursor: not-allowed; }
        .error { color: #ef4444; background: #fef2f2; padding: 10px; border-radius: 5px; display: none; margin-bottom: 15px; }
        .success { color: #22c55e; background: #f0fdf4; padding: 10px; border-radius: 5px; display: none; margin-bottom: 15px; }
        .note { font-size: 13px; color: #64748b; background: #f1f5f9; padding: 10px; border-radius: 5px; margin-bottom: 20px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>FlyEasy Initial Setup</h1>
        
        <div class="note">
          <strong>Welcome!</strong> Provide your MySQL database credentials below. 
          The installer will automatically create the database, import all tables, set up the <strong>admin@flyeasy.com</strong> user, and connect your frontend.
        </div>
        
        <div id="msg" class="error"></div>

        <form id="setupForm">
          <h3>Database Settings</h3>
          <div class="group">
            <label>Database Host</label>
            <input type="text" id="db_host" value="localhost" required>
          </div>
          <div class="group">
            <label>Database User</label>
            <input type="text" id="db_user" required>
          </div>
          <div class="group">
            <label>Database Password</label>
            <input type="password" id="db_pass">
          </div>
          <div class="group">
            <label>Database Name</label>
            <input type="text" id="db_name" required>
          </div>

          <h3>SMTP Email Settings (Required)</h3>
          <div class="group">
            <label>SMTP Host (e.g. smtp.hostinger.com)</label>
            <input type="text" id="smtp_host" required>
          </div>
          <div class="group">
            <label>SMTP Port (e.g. 465 or 587)</label>
            <input type="number" id="smtp_port" value="465" required>
          </div>
          <div class="group">
            <label>SMTP Username (Email Address)</label>
            <input type="text" id="smtp_user" required>
          </div>
          <div class="group">
            <label>SMTP Password</label>
            <input type="password" id="smtp_pass" required>
          </div>
          <div class="group">
            <label>From Email Address</label>
            <input type="email" id="smtp_from" required>
          </div>

          <button type="submit">Verify & Install Website</button>
        </form>
      </div>

      <script>
        document.getElementById('setupForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = e.target.querySelector('button');
          const msg = document.getElementById('msg');
          
          btn.textContent = 'Installing... Please wait...';
          btn.disabled = true;
          msg.style.display = 'none';

          const data = {
            db_host: document.getElementById('db_host').value,
            db_user: document.getElementById('db_user').value,
            db_pass: document.getElementById('db_pass').value,
            db_name: document.getElementById('db_name').value,
            smtp_host: document.getElementById('smtp_host').value,
            smtp_port: document.getElementById('smtp_port').value,
            smtp_user: document.getElementById('smtp_user').value,
            smtp_pass: document.getElementById('smtp_pass').value,
            smtp_from: document.getElementById('smtp_from').value
          };

          try {
            const res = await fetch('/setup/install', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (res.ok) {
              msg.className = 'success';
              msg.textContent = 'Installation Successful! The setup files are deleting themselves. Redirecting to home...';
              msg.style.display = 'block';
              setTimeout(() => { window.location.href = '/'; }, 3000);
            } else {
              throw new Error(result.error || 'Setup failed');
            }
          } catch (err) {
            msg.className = 'error';
            msg.textContent = err.message;
            msg.style.display = 'block';
            btn.textContent = 'Verify & Install Website';
            btn.disabled = false;
          }
        });
      </script>
    </body>
    </html>
  `);
});

router.post('/install', async (req, res) => {
  const { db_host, db_user, db_pass, db_name, smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from } = req.body;

  try {
    // 1. Connect and create database
    const db = await mysql.createConnection({ host: db_host, user: db_user, password: db_pass, multipleStatements: true });
    await db.query(\`CREATE DATABASE IF NOT EXISTS \\\`\${db_name}\\\`\`);
    await db.query(\`USE \\\`\${db_name}\\\`\`);

    // 2. Import install.sql
    const sqlPath = path.join(__dirname, '../install.sql');
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await db.query(sql);
    }

    await db.end();

    // 3. Write .env file
    const jwtSecret = 'flyeasy_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const envContent = `
PORT=4000
CORS_ORIGIN=*

DB_HOST=${db_host}
DB_USER=${db_user}
DB_PASSWORD=${db_pass}
DB_NAME=${db_name}

SMTP_HOST=${smtp_host}
SMTP_PORT=${smtp_port}
SMTP_USER=${smtp_user}
SMTP_PASS=${smtp_pass}
SMTP_FROM=${smtp_from}

JWT_SECRET=${jwtSecret}
INSTALLED=true
`;
    fs.writeFileSync(path.join(__dirname, '../.env'), envContent.trim());

    // 4. Respond to client
    res.json({ success: true });
    
    // 5. Self Destruct
    setTimeout(() => {
      try { fs.unlinkSync(sqlPath); } catch(e) {}
      try { fs.unlinkSync(__filename); } catch(e) {}
      // Restart server if using pm2, or let nodemon detect it.
      // Easiest is just exiting the process so hosting auto-restarts.
      process.exit(0);
    }, 2000);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
