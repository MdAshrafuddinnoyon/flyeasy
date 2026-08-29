const https = require('https');
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const airlines = [
  ['Biman Bangladesh Airlines', 'https://upload.wikimedia.org/wikipedia/en/8/8d/Biman_Bangladesh_Airlines_Logo.svg'],
  ['US-Bangla Airlines', 'https://upload.wikimedia.org/wikipedia/en/6/6b/US-Bangla_Airlines_Logo.svg'],
  ['Novoair', 'https://upload.wikimedia.org/wikipedia/en/4/4a/Novoair_logo.svg'],
  ['Air Arabia', 'https://upload.wikimedia.org/wikipedia/en/5/53/Air_Arabia_Logo.svg'],
  ['flydubai', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Flydubai_logo.svg'],
  ['IndiGo', 'https://upload.wikimedia.org/wikipedia/en/a/a5/IndiGo_Airlines_logo.svg'],
  ['Emirates', 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg'],
  ['Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/e/eb/Qatar_Airways_Logo.svg'],
  ['Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/6/6b/Singapore_Airlines_Logo_2.svg'],
  ['Thai Airways', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Thai_Airways_Logo.svg'],
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, function(response) {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', function() {
          file.close(resolve);
        });
      } else {
        fs.unlink(dest, () => {});
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    });
    request.on('error', function(err) {
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
};

async function syncAirlines() {
  const uploadsDir = path.join(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  for (const [name, url] of airlines) {
    const filename = `airline_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`;
    const dest = path.join(uploadsDir, filename);
    
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
