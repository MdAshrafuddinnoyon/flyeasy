require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flyeasy',
    port: process.env.DB_PORT || 3306
  });

  const email = 'admin@flyeasy.com';
  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  try {
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin user already exists with email:', email);
    } else {
      await connection.execute(
        'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [id, 'Super Admin', email, hashedPassword, 'admin']
      );
      console.log('Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await connection.end();
  }
}

createAdmin();
