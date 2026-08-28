const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res) => {
  // If already installed, block it
  if (process.env.DB_HOST) {
    return res.status(403).json({ error: 'Already installed. Please clear .env to reinstall.' });
  }

  const { dbHost, dbName, dbUser, dbPassword } = req.body;

  if (!dbHost || !dbName || !dbUser) {
    return res.status(400).json({ error: 'Database Host, Name, and User are required.' });
  }

  let tempPool = null;
  try {
    // 1. Test connection
    tempPool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword || '',
      multipleStatements: true
    });

    await tempPool.query('SELECT 1');

    // 2. Create DB if not exists
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    // Switch pool to use the new database
    await tempPool.end();
    tempPool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword || '',
      database: dbName,
      multipleStatements: true
    });

    // 3. Import SQL Dump
    const dumpPath = path.join(__dirname, '..', '..', 'flyeasy_full_dump.sql');
    if (!fs.existsSync(dumpPath)) {
       throw new Error('Database dump file missing (flyeasy_full_dump.sql).');
    }
    const sql = fs.readFileSync(dumpPath, 'utf8');
    await tempPool.query(sql);

    // 4. Write .env
    const crypto = require('crypto');
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const jwtRefresh = crypto.randomBytes(64).toString('hex');

    const envContent = `PORT=4000
DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword || ''}
DB_NAME=${dbName}
DB_PORT=3306

JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefresh}

# Leave CORS_ORIGIN empty in production to allow self-hosted frontend (same domain)
CORS_ORIGIN=
`;
    fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);

    // 5. Update process.env in memory so backend starts working immediately
    process.env.DB_HOST = dbHost;
    process.env.DB_USER = dbUser;
    process.env.DB_PASSWORD = dbPassword || '';
    process.env.DB_NAME = dbName;
    process.env.DB_PORT = 3306;
    process.env.JWT_SECRET = jwtSecret;

    // 6. Delete dump file
    try {
      fs.unlinkSync(dumpPath);
    } catch (e) {
      console.error('Failed to delete dump file:', e);
    }

    res.json({ success: true, message: 'Installation completed successfully.' });

  } catch (error) {
    console.error('Install error:', error);
    res.status(500).json({ error: error.message || 'Installation failed.' });
  } finally {
    if (tempPool) {
      await tempPool.end().catch(() => {});
    }
  }
});

module.exports = router;
