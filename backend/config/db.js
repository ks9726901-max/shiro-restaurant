const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shiro_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
};

let pool;
global.db_offline = false;

try {
  pool = mysql.createPool(dbConfig);
  
  // Test connection immediately
  pool.query('SELECT 1')
    .then(() => {
      console.log('✅ Connected to MySQL Database successfully.');
    })
    .catch((err) => {
      console.warn('⚠️ MySQL connection failed. Running backend in in-memory MOCK mode.');
      console.warn('Reason:', err.message);
      global.db_offline = true;
    });
} catch (error) {
  console.warn('⚠️ Failed to initialize MySQL pool. Running backend in in-memory MOCK mode.');
  global.db_offline = true;
}

module.exports = pool;
