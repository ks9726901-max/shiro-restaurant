const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

async function setup() {
  console.log('Connecting to MySQL server...');
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected.');

    // 1. Create Database
    console.log(`Creating database ${process.env.DB_NAME || 'shiro_db'} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'shiro_db'}\`;`);
    await connection.query(`USE \`${process.env.DB_NAME || 'shiro_db'}\`;`);

    // 2. Read and Run Schema
    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split queries by semicolon (simple splitter, assuming no semicolons in string values)
    const queries = schemaSql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    console.log('Executing schema queries...');
    for (const query of queries) {
      await connection.query(query);
    }
    console.log('Schema executed successfully.');

    // 3. Clear existing data to prevent duplicates on re-run
    console.log('Clearing old data for clean seed...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('TRUNCATE TABLE menu_items;');
    await connection.query('TRUNCATE TABLE menu_categories;');
    await connection.query('TRUNCATE TABLE users;');
    await connection.query('TRUNCATE TABLE reservations;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    // 4. Seed Categories
    console.log('Seeding categories...');
    const categories = [
      { name: 'Sushi & Sashimi', description: 'Freshly prepared traditional Japanese sushi and sashimi', display_order: 1 },
      { name: 'Dim Sum', description: 'Handcrafted bite-sized Cantonese delights steamed to perfection', display_order: 2 },
      { name: 'Teppanyaki & Grills', description: 'Sizzling specialities prepared on the flat iron grill', display_order: 3 },
      { name: 'Mains', description: 'Hearty Pan-Asian classic curries, stir-fries, and signatures', display_order: 4 },
      { name: 'Desserts', description: 'Premium visual desserts with an Asian touch', display_order: 5 },
      { name: 'Craft Cocktails', description: 'Signature mixology inspired by Japanese and Asian herbs', display_order: 6 }
    ];

    const categoryIds = {};
    for (const cat of categories) {
      const [result] = await connection.query(
        'INSERT INTO menu_categories (name, description, display_order) VALUES (?, ?, ?)',
        [cat.name, cat.description, cat.display_order]
      );
      categoryIds[cat.name] = result.insertId;
    }
    console.log('Categories seeded.');

    // 5. Seed Menu Items
    console.log('Seeding menu items...');
    const items = [
      {
        category: 'Sushi & Sashimi',
        name: 'Shiro Signature Maki',
        description: 'Gold-leaf crispy prawn tempura, cream cheese, avocado, wrapped with spicy tuna and drizzled with unagi glaze.',
        price: 850.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: true,
        image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Sushi & Sashimi',
        name: 'Sake (Salmon) Sashimi',
        description: 'Thick slices of fresh, premium Atlantic salmon, served on shaved ice with fresh wasabi and pickled ginger.',
        price: 950.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: false,
        image_url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Sushi & Sashimi',
        name: 'Truffle Avocado Roll',
        description: 'Creamy avocado, cucumber, asparagus, rolled in toasted sesame seeds and drizzled with house truffle oil.',
        price: 650.00,
        is_vegetarian: true,
        is_vegan: true,
        is_signature: false,
        image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Dim Sum',
        name: 'Crystal Truffle Dumpling',
        description: 'Minced wild shiitake, button, and portobello mushrooms, flavored with truffle essence in a translucent wrapper.',
        price: 550.00,
        is_vegetarian: true,
        is_vegan: false,
        is_signature: true,
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Dim Sum',
        name: 'Classic Prawn Har Gow',
        description: 'Succulent fresh prawns in a pleated translucent pastry skin, steamed to juicy perfection.',
        price: 650.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: false,
        image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Teppanyaki & Grills',
        name: 'Garlic Butter Prawns',
        description: 'Jumbo prawns grilled on the iron flat-top, basted with rich garlic butter, sake, and chopped chives.',
        price: 920.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: true,
        image_url: 'https://images.unsplash.com/photo-1559737607-3578909a3a3b?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Teppanyaki & Grills',
        name: 'Hibachi Glazed Chicken',
        description: 'Tender chicken breast glazed with a sweet and savory sweet-soy hibachi sauce, served with sesame bean sprouts.',
        price: 720.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: false,
        image_url: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Mains',
        name: 'Peking Duck (Half)',
        description: 'Crispy, slow-roasted duck skin and tender meat served with hand-rolled steamed pancakes, julienned scallions, cucumbers, and rich hoisin sauce.',
        price: 1800.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: true,
        image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Mains',
        name: 'Thai Green Curry (Veg)',
        description: 'A rich coconut milk curry infused with galangal, lemongrass, sweet basil, Thai eggplant, baby corn, served with steamed Jasmine rice.',
        price: 650.00,
        is_vegetarian: true,
        is_vegan: true,
        is_signature: false,
        image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Desserts',
        name: 'Chocolate Cherry Dome',
        description: 'Decadent 70% dark Belgian chocolate mousse shell, sour cherry compote filling, biscuit crunch base, finished with gold leaf dusting.',
        price: 520.00,
        is_vegetarian: true,
        is_vegan: false,
        is_signature: true,
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Desserts',
        name: 'Zen Coconut Mousse',
        description: 'Light coconut and white chocolate mousse shaped like a smooth garden pebble, served on cocoa sand with mango coulis.',
        price: 480.00,
        is_vegetarian: true,
        is_vegan: false,
        is_signature: false,
        image_url: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Craft Cocktails',
        name: 'Demonic Shiro',
        description: 'Shiro’s famous cocktail: Japanese craft gin, dark blackberry shrub, fresh local lemon, sweet basil, topped with ginger beer.',
        price: 750.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: true,
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        is_available: true
      },
      {
        category: 'Craft Cocktails',
        name: 'Zen Garden Collins',
        description: 'Sake, cucumber juice, elderflower syrup, fresh mint leaves, carbonated club soda, served long with a cucumber ribbon.',
        price: 680.00,
        is_vegetarian: false,
        is_vegan: false,
        is_signature: false,
        image_url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
        is_available: true
      }
    ];

    for (const item of items) {
      const categoryId = categoryIds[item.category];
      await connection.query(
        `INSERT INTO menu_items 
         (category_id, name, description, price, is_vegetarian, is_vegan, is_signature, image_url, is_available) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          categoryId,
          item.name,
          item.description,
          item.price,
          item.is_vegetarian,
          item.is_vegan,
          item.is_signature,
          item.image_url,
          item.is_available
        ]
      );
    }
    console.log('Menu items seeded.');

    // 6. Seed Users
    console.log('Seeding users...');
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const staffPasswordHash = await bcrypt.hash('kishanis9740', 10);

    await connection.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['admin', adminPasswordHash, 'admin']
    );
    await connection.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['staff', staffPasswordHash, 'staff']
    );
    console.log('Users seeded (admin/admin123, staff/staff123).');

    // 7. Seed sample reservations
    console.log('Seeding mock reservations...');
    const reservations = [
      {
        customer_name: 'Ananya Sharma',
        customer_email: 'ananya@example.com',
        customer_phone: '+919876543210',
        reservation_date: '2026-06-10',
        reservation_time: '19:30:00',
        guest_count: 4,
        special_requests: 'Anniversary celebration. Window table near water channel if possible.',
        status: 'confirmed'
      },
      {
        customer_name: 'Vikram Malhotra',
        customer_email: 'vikram.m@example.com',
        customer_phone: '+919123456789',
        reservation_date: '2026-06-10',
        reservation_time: '21:00:00',
        guest_count: 2,
        special_requests: 'No seafood allergies, requesting Teppanyaki seating.',
        status: 'pending'
      },
      {
        customer_name: 'Rohan Sen',
        customer_email: 'rohan.sen@example.com',
        customer_phone: '+919988776655',
        reservation_date: '2026-06-11',
        reservation_time: '13:00:00',
        guest_count: 6,
        special_requests: 'Business lunch. Requires quiet area.',
        status: 'confirmed'
      },
      {
        customer_name: 'Priyanka Rao',
        customer_email: 'priyanka@example.com',
        customer_phone: '+919888877777',
        reservation_date: '2026-06-08',
        reservation_time: '20:00:00',
        guest_count: 3,
        special_requests: 'Birthday dinner, need candle on dessert.',
        status: 'confirmed'
      }
    ];

    for (const res of reservations) {
      await connection.query(
        `INSERT INTO reservations 
         (customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, special_requests, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          res.customer_name,
          res.customer_email,
          res.customer_phone,
          res.reservation_date,
          res.reservation_time,
          res.guest_count,
          res.special_requests,
          res.status
        ]
      );
    }
    console.log('Mock reservations seeded.');

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setup();
