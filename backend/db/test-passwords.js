const mysql = require('mysql2/promise');

const passwords = [
  '',
  'root',
  'mysql',
  'admin',
  '123456',
  '1234',
  'password',
  '12345678',
  'root123',
  'root1234',
  '12345',
  '123456789',
  '1234567890',
  '123',
  'rootroot',
  'root@123',
  'Root@123',
  'Admin@123',
  'admin123',
  'admin@123',
  'sql123',
  'mysql123',
  'database',
  'database123',
  'password123',
  'pass123',
  'mypassword',
  'dbpassword',
  'db_password',
  'kishan',
  'kishan123',
  'ks972',
  'ks972123'
];

async function test() {
  for (const pw of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pw,
        port: 3306
      });
      console.log(`SUCCESS: Password is "${pw}"`);
      await conn.end();
      return;
    } catch (err) {
      // Don't print failures to keep output clean
    }
  }
  console.log('None of the passwords worked.');
}

test();
