const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

function getPool() {
  if (pool) return pool;

  if (!process.env.DB_HOST) {
    // App is not installed yet. Return a dummy object to prevent immediate crashes,
    // though queries will fail. The frontend should block access anyway.
    return {
      query: async () => { throw new Error('Database not configured. Please run installation.'); },
      execute: async () => { throw new Error('Database not configured. Please run installation.'); },
      end: async () => {}
    };
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  });

  return pool;
}

// Create a proxy so that require('./db') acts like the pool directly
const poolProxy = new Proxy({}, {
  get: (target, prop) => {
    return getPool()[prop];
  }
});

module.exports = poolProxy;
