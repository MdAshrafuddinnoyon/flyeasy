const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const airlines = [
  ['Biman Bangladesh Airlines', 'biman-airlines.com'],
  ['US-Bangla Airlines', 'usbair.com'],
  ['Novoair', 'flynovoair.com'],
  ['Air Arabia', 'airarabia.com'],
  ['flydubai', 'flydubai.com'],
  ['IndiGo', 'goindigo.in'],
  ['Emirates', 'emirates.com'],
  ['Qatar Airways', 'qatarairways.com'],
  ['Singapore Airlines', 'singaporeair.com'],
  ['Thai Airways', 'thaiairways.com'],
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    const getReq = (reqUrl) => {
      const client = reqUrl.startsWith('https') ? https : http;
      const request = client.get(reqUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, function(response) {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', function() {
            file.close(resolve);
          });
        } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
           getReq(response.headers.location);
        } else {
          fs.unlink(dest, () => {});
          reject(`Server responded with ${response.statusCode}`);
        }
      });
      request.on('error', function(err) {
        fs.unlink(dest, () => {});
        reject(err.message);
      });
    };

    getReq(url);
  });
};

async function syncAirlines() {
  const uploadsDir = path.join(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  for (const [name, domain] of airlines) {
    const filename = `airline_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
    const dest = path.join(uploadsDir, filename);
    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    try {
      await download(url, dest);
      const localUrl = `/uploads/${filename}`;
      await pool.query('UPDATE airlines SET logo_url = ? WHERE name = ?', [localUrl, name]);
      console.log(`Successfully downloaded and updated ${name}`);
    } catch (e) {
      console.error(`Failed for ${name}: ${e}`);
    }
  }
  process.exit();
}

syncAirlines();
