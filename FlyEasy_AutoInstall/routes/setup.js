const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
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
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-w: 500px; }
        h1 { color: #0f172a; margin-top: 0; }
        .group { margin-bottom: 15px; }
        label { display: block; font-weight: 500; margin-bottom: 5px; font-size: 14px; }
        input { w-full; padding: 10px; border: 1px solid #cbd5e1; border-radius: 5px; width: calc(100% - 22px); }
        button { background: #3b82f6; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold; margin-top: 10px; }
        .error { color: #ef4444; background: #fef2f2; padding: 10px; border-radius: 5px; display: none; margin-bottom: 15px; }
        .success { color: #22c55e; background: #f0fdf4; padding: 10px; border-radius: 5px; display: none; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>FlyEasy Initial Setup</h1>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Configure your Database and SMTP for Hostinger deployment. This file will self-destruct after success.</p>
        
        <div id="msg" class="error"></div>

        <form id="setupForm">
          <h3>Database Settings</h3>
          <div class="group">
            <label>Host</label>
            <input type="text" id="db_host" value="localhost" required>
          </div>
          <div class="group">
            <label>User</label>
            <input type="text" id="db_user" required>
          </div>
          <div class="group">
            <label>Password</label>
            <input type="password" id="db_pass">
          </div>
          <div class="group">
            <label>Database Name</label>
            <input type="text" id="db_name" required>
          </div>

          <h3>SMTP Settings (Optional but recommended)</h3>
          <div class="group">
            <label>SMTP Host</label>
            <input type="text" id="smtp_host" placeholder="smtp.hostinger.com">
          </div>
          <div class="group">
            <label>SMTP Port</label>
            <input type="number" id="smtp_port" value="465">
          </div>
          <div class="group">
            <label>SMTP User (Email)</label>
            <input type="text" id="smtp_user">
          </div>
          <div class="group">
            <label>SMTP Password</label>
            <input type="password" id="smtp_pass">
          </div>

          <button type="submit">Verify & Install</button>
        </form>
      </div>

      <script>
        document.getElementById('setupForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = e.target.querySelector('button');
          const msg = document.getElementById('msg');
          
          btn.textContent = 'Verifying...';
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
              msg.textContent = 'Setup successful! The setup file has been deleted. Redirecting...';
              msg.style.display = 'block';
              setTimeout(() => { window.location.href = '/'; }, 3000);
            } else {
              throw new Error(result.error || 'Setup failed');
            }
          } catch (err) {
            msg.className = 'error';
            msg.textContent = err.message;
            msg.style.display = 'block';
            btn.textContent = 'Verify & Install';
            btn.disabled = false;
          }
        });
      </script>
    </body>
    </html>
  `);
});

router.post('/install', async (req, res) => {
  const { db_host, db_user, db_pass, db_name, smtp_host, smtp_port, smtp_user, smtp_pass } = req.body;

  try {
    // 1. Test DB Connection
    const db = await mysql.createConnection({ host: db_host, user: db_user, password: db_pass, database: db_name });
    await db.query('SELECT 1');
    await db.end();

    // 2. Test SMTP (if provided)
    if (smtp_host && smtp_user && smtp_pass) {
      const transporter = nodemailer.createTransport({
        host: smtp_host,
        port: parseInt(smtp_port),
        secure: parseInt(smtp_port) === 465,
        auth: { user: smtp_user, pass: smtp_pass }
      });
      await transporter.verify();
    }

    // 3. Write .env file
    const envContent = \`
PORT=4000
CORS_ORIGIN=*

DB_HOST=\${db_host}
DB_USER=\${db_user}
DB_PASS=\${db_pass}
DB_NAME=\${db_name}

SMTP_HOST=\${smtp_host}
SMTP_PORT=\${smtp_port}
SMTP_USER=\${smtp_user}
SMTP_PASS=\${smtp_pass}

JWT_SECRET=supersecretjwtkey_replace_me_later
\`;
    fs.writeFileSync(path.join(__dirname, '../.env'), envContent.trim());

    // 4. Self Destruct
    res.json({ success: true });
    
    // Attempt to delete this file
    setTimeout(() => {
      try {
        fs.unlinkSync(__filename);
      } catch (e) {
        console.error('Failed to self-destruct setup.js', e);
      }
    }, 1000);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
