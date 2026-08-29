const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

const query = `
CREATE TABLE IF NOT EXISTS flights (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  airline_id CHAR(36),
  airline_name VARCHAR(255),
  flight_code VARCHAR(50),
  origin VARCHAR(100),
  destination VARCHAR(100),
  departure_time DATETIME,
  arrival_time DATETIME,
  price DECIMAL(12,2) DEFAULT 0,
  stops INT DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

connection.query(query, (err, results) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Flights table created successfully.");
  }
  connection.end();
});
