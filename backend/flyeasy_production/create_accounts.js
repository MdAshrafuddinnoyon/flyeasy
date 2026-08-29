const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'flyeasy'
  });

  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  try {
    // Admin
    await connection.execute(`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES ('Admin User', 'admin@flyeasy.com', '01700000000', ?, 'admin')
      ON DUPLICATE KEY UPDATE password_hash = ?, role = 'admin'
    `, [adminPassword, adminPassword]);

    // Customer
    await connection.execute(`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES ('Customer User', 'customer@example.com', '01800000000', ?, 'customer')
      ON DUPLICATE KEY UPDATE password_hash = ?
    `, [customerPassword, customerPassword]);

    console.log("Accounts created successfully.");
  } catch (err) {
    console.error("Error creating accounts", err);
  } finally {
    connection.end();
  }
}

run();
