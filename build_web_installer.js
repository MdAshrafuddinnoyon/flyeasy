const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing Web Installer Package...');

const buildDir = path.join(__dirname, 'FlyEasy_Web_Installer');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

// 1. Copy backend (excluding node_modules and .env)
const excludeContent = 'node_modules\\\n.git\\\n.env\n';
fs.writeFileSync('exclude_installer.txt', excludeContent);

console.log('Copying backend...');
execSync(`xcopy backend "${path.join(buildDir, 'backend')}\\" /E /I /H /Y /EXCLUDE:exclude_installer.txt`, { stdio: 'inherit' });

// 2. Copy frontend/dist to public_html
console.log('Copying frontend/dist to public_html...');
execSync(`xcopy frontend\\dist "${path.join(buildDir, 'public_html')}\\" /E /I /H /Y`, { stdio: 'inherit' });

// 3. Copy SQL dump
console.log('Copying database dump...');
fs.copyFileSync('flyeasy_full_dump.sql', path.join(buildDir, 'flyeasy_full_dump.sql'));

// 4. Create README
const readme = `FlyEasy Web Installation Guide
==============================

This package uses a beautiful Web-based Installation Wizard.

Steps to install on cPanel:
1. Upload and extract this ZIP file in your cPanel.
2. Move all contents of 'public_html' into your cPanel's 'public_html' folder.
3. Move the 'backend' folder anywhere OUTSIDE of 'public_html' (e.g., /home/user/backend).
4. Move 'flyeasy_full_dump.sql' inside the 'backend' folder (it must be next to backend/server.js).
5. Create a MySQL database and user in cPanel (Note down the details).
6. Go to cPanel -> Setup Node.js App.
   - App root: /home/user/backend
   - App URL: yourdomain.com/api
   - Startup file: server.js
   - Click "Run NPM Install"
   - Click "Start App"
7. Now visit your website (yourdomain.com). You will see the Installation Wizard!
8. Enter your Database Host, Name, User, and Password, and click Install.
9. Done! The database will be connected and the installer will secure itself.

Optional API Routing (If you use Apache and the frontend cannot reach /api):
Add this to public_html/.htaccess:
RewriteEngine On
RewriteRule ^api/(.*)$ http://127.0.0.1:YOUR_NODE_PORT/api/$1 [P,L]
`;
fs.writeFileSync(path.join(buildDir, 'README_Installation.txt'), readme);

console.log('Zipping...');
execSync(`powershell Compress-Archive -Path "FlyEasy_Web_Installer\\*" -DestinationPath "FlyEasy_Web_Installer.zip" -Force`);

// Cleanup temp folder
fs.rmSync(buildDir, { recursive: true, force: true });
fs.rmSync('exclude_installer.txt');

console.log('Done! FlyEasy_Web_Installer.zip is ready.');
