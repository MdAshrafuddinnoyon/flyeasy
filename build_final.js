const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Preparing Final Installer Package...');

const buildDir = path.join(__dirname, 'FlyEasy_Final_Installer_Temp');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

// Exclude list for xcopy
const excludeContent = 'node_modules\\\n.git\\\n.env\n';
fs.writeFileSync('exclude_installer.txt', excludeContent);

// Copy backend (excluding node_modules)
console.log('Copying backend...');
execSync(`xcopy backend "${path.join(buildDir, 'backend')}\\" /E /I /H /Y /EXCLUDE:exclude_installer.txt`, { stdio: 'inherit' });

// Copy frontend (excluding node_modules)
console.log('Copying frontend...');
execSync(`xcopy frontend "${path.join(buildDir, 'frontend')}\\" /E /I /H /Y /EXCLUDE:exclude_installer.txt`, { stdio: 'inherit' });

// Copy SQL full dump
console.log('Copying full database dump...');
fs.copyFileSync('flyeasy_full_dump.sql', path.join(buildDir, 'flyeasy_full_dump.sql'));

// Copy installer scripts
console.log('Copying installer scripts...');
fs.copyFileSync('install.js', path.join(buildDir, 'install.js'));
fs.copyFileSync('install.bat', path.join(buildDir, 'install.bat'));
fs.copyFileSync('deploy.sh', path.join(buildDir, 'deploy.sh'));

// Copy documentation
fs.copyFileSync('README.md', path.join(buildDir, 'README.md'));
fs.copyFileSync('DOCUMENTATION.md', path.join(buildDir, 'DOCUMENTATION.md'));
fs.copyFileSync('INSTALL.md', path.join(buildDir, 'INSTALL.md'));
fs.copyFileSync('package.json', path.join(buildDir, 'package.json'));

console.log('Zipping...');
execSync(`powershell Compress-Archive -Path "FlyEasy_Final_Installer_Temp\\*" -DestinationPath "FlyEasy_Final_Installer.zip" -Force`);

// Cleanup temp folder
fs.rmSync(buildDir, { recursive: true, force: true });
fs.rmSync('exclude_installer.txt');

console.log('Done! FlyEasy_Final_Installer.zip is ready.');
