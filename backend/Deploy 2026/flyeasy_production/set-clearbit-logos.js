const pool = require('./config/db');

async function setClearbitLogos() {
  const logos = {
    'Biman Bangladesh Airlines': 'https://logo.clearbit.com/biman-airlines.com',
    'US-Bangla Airlines': 'https://logo.clearbit.com/usbair.com',
    'Novoair': 'https://logo.clearbit.com/flynovoair.com',
    'Air Arabia': 'https://logo.clearbit.com/airarabia.com',
    'flydubai': 'https://logo.clearbit.com/flydubai.com',
    'IndiGo': 'https://logo.clearbit.com/goindigo.in',
    'Emirates': 'https://logo.clearbit.com/emirates.com',
    'Qatar Airways': 'https://logo.clearbit.com/qatarairways.com',
    'Singapore Airlines': 'https://logo.clearbit.com/singaporeair.com',
    'Thai Airways': 'https://logo.clearbit.com/thaiairways.com'
  };

  try {
    for (const [name, url] of Object.entries(logos)) {
      await pool.query('UPDATE airlines SET logo_url = ? WHERE name = ?', [url, name]);
      console.log(`Updated ${name}`);
    }
    console.log('Finished updating logos.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

setClearbitLogos();
