const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing cPanel package...');

const buildDir = path.join(__dirname, 'FlyEasy_cPanel_Ready');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

// 1. Copy backend (excluding node_modules)
console.log('Copying backend...');
execSync(`xcopy backend "${path.join(buildDir, 'backend')}\\" /E /I /H /Y /EXCLUDE:exclude.txt`, { stdio: 'inherit' });

// 2. Copy frontend/dist to public_html
console.log('Copying frontend/dist to public_html...');
execSync(`xcopy frontend\\dist "${path.join(buildDir, 'public_html')}\\" /E /I /H /Y`, { stdio: 'inherit' });

// 3. Copy SQL dump
console.log('Copying database dump...');
fs.copyFileSync('flyeasy_full_dump.sql', path.join(buildDir, 'flyeasy_database.sql'));

// 4. Create README
const readme = `FlyEasy cPanel Package
======================

This package is fully prepared for cPanel hosting (no terminal installation required).

Steps to install:
1. Upload and extract this ZIP file in your cPanel.
2. Move the contents of 'public_html' into your cPanel's public_html folder.
3. Move the 'backend' folder anywhere outside public_html (e.g. /home/user/backend).
4. Create a MySQL database and user in cPanel.
5. Import 'flyeasy_database.sql' into your new database via phpMyAdmin.
6. Open backend/.env.example, rename it to .env, and fill in your DB credentials.
7. Go to cPanel -> Setup Node.js App.
   - App root: /home/user/backend
   - App URL: yourdomain.com/api
   - Startup file: server.js
   - Click "Run NPM Install"
   - Click "Start App"
8. Edit public_html/.htaccess if you need API routing:
   RewriteEngine On
   RewriteRule ^api/(.*)$ http://127.0.0.1:YOUR_NODE_PORT/api/$1 [P,L]

Your site is now live!
`;
fs.writeFileSync(path.join(buildDir, 'README_cPanel.txt'), readme);

console.log('Zipping...');
execSync(`powershell Compress-Archive -Path "FlyEasy_cPanel_Ready\\*" -DestinationPath "FlyEasy_cPanel_Ready.zip" -Force`);

console.log('Done! FlyEasy_cPanel_Ready.zip is ready.');
