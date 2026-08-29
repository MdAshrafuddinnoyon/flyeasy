const pool = require('./config/db');
const { v4: uuidv4 } = require('uuid');

async function updateAirlines() {
  try {
    const airlines = [
      ['Biman Bangladesh Airlines', 'BG', 'Bangladesh', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Biman_Bangladesh_Airlines_Logo.svg/320px-Biman_Bangladesh_Airlines_Logo.svg.png', 1],
      ['US-Bangla Airlines', 'US', 'Bangladesh', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/US-Bangla_Airlines_Logo.svg/320px-US-Bangla_Airlines_Logo.svg.png', 2],
      ['Novoair', 'VQ', 'Bangladesh', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Novoair_logo.svg/320px-Novoair_logo.svg.png', 3],
      ['Air Arabia', 'G9', 'UAE', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Air_Arabia_Logo.svg/320px-Air_Arabia_Logo.svg.png', 4],
      ['flydubai', 'FZ', 'UAE', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Flydubai_logo.svg/320px-Flydubai_logo.svg.png', 5],
      ['IndiGo', '6E', 'India', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/IndiGo_Airlines_logo.svg/320px-IndiGo_Airlines_logo.svg.png', 6],
      ['Emirates', 'EK', 'UAE', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/320px-Emirates_logo.svg.png', 7],
      ['Qatar Airways', 'QR', 'Qatar', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 8],
      ['Singapore Airlines', 'SQ', 'Singapore', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 9],
      ['Thai Airways', 'TG', 'Thailand', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Thai_Airways_Logo.svg/320px-Thai_Airways_Logo.svg.png', 10],
    ];

    // Clear existing airlines to replace with these clean ones
    await pool.query('DELETE FROM airlines');

    for (const [name, code, country, logo_url, sort_order] of airlines) {
      await pool.query(
        'INSERT INTO airlines (id, name, code, country, logo_url, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [uuidv4(), name, code, country, logo_url, sort_order]
      );
    }
    
    console.log('Airlines successfully updated with real logos!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating airlines:', error);
    process.exit(1);
  }
}

updateAirlines();
