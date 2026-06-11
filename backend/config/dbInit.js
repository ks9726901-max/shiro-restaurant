const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function initializeDatabase(pool) {
  try {
    console.log('Checking database tables status...');
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length > 0) {
      console.log('✅ Database tables already exist. Checking migrations...');
      
      // Check if email_delivery_status column exists
      const [columns] = await pool.query("SHOW COLUMNS FROM reservations LIKE 'email_delivery_status'");
      if (columns.length === 0) {
        console.log('⏳ Running migration: Adding email_delivery_status and updating status enum...');
        try {
          await pool.query(`
            ALTER TABLE reservations 
              MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'rejected', 'completed') DEFAULT 'pending',
              ADD COLUMN email_delivery_status VARCHAR(50) DEFAULT NULL
          `);
          console.log('✅ Migration executed successfully.');
        } catch (migrationErr) {
          console.error('❌ Migration failed:', migrationErr.message);
        }
      } else {
        console.log('✅ Database is up to date.');
      }

      // Check if status enum includes 'completed'
      try {
        const [statusColumn] = await pool.query("SHOW COLUMNS FROM reservations LIKE 'status'");
        if (statusColumn.length > 0 && !statusColumn[0].Type.includes('completed')) {
          console.log('⏳ Running migration: Updating status enum to include completed...');
          await pool.query(`
            ALTER TABLE reservations 
              MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'rejected', 'completed') DEFAULT 'pending'
          `);
          console.log('✅ Migration: status enum updated successfully.');
        }
      } catch (migrationErr) {
        console.error('❌ Migration for status enum failed:', migrationErr.message);
      }

      return;
    }

    console.log('⏳ Tables not found. Starting database schema initialization...');

    // 1. Create tables
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff') DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS menu_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createMenuItemsTable = `
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        is_vegetarian BOOLEAN DEFAULT FALSE,
        is_vegan BOOLEAN DEFAULT FALSE,
        is_signature BOOLEAN DEFAULT FALSE,
        image_url VARCHAR(500),
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE
      )
    `;

    const createReservationsTable = `
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        reservation_date DATE NOT NULL,
        reservation_time TIME NOT NULL,
        guest_count INT NOT NULL,
        special_requests TEXT,
        status ENUM('pending', 'confirmed', 'cancelled', 'rejected', 'completed') DEFAULT 'pending',
        email_delivery_status VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createUsersTable);
    await pool.query(createCategoriesTable);
    await pool.query(createMenuItemsTable);
    await pool.query(createReservationsTable);
    console.log('✅ Tables created successfully.');

    // 2. Seed default users
    console.log('Seeding default users...');
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const staffPasswordHash = await bcrypt.hash('kishanis9740', 10);

    await pool.query(
      'INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?), (?, ?, ?)',
      [
        'admin', adminPasswordHash, 'admin',
        'staff', staffPasswordHash, 'staff'
      ]
    );
    console.log('✅ Default users seeded.');

    // 3. Seed menu categories
    console.log('Seeding menu categories...');
    const categories = [
      [1, 'Sushi & Sashimi', 'Freshly prepared traditional Japanese sushi and sashimi', 1],
      [2, 'Dim Sum', 'Handcrafted bite-sized Cantonese delights steamed to perfection', 2],
      [3, 'Teppanyaki & Grills', 'Sizzling specialities prepared on the flat iron grill', 3],
      [4, 'Mains', 'Hearty Pan-Asian classic curries, stir-fries, and signatures', 4],
      [5, 'Desserts', 'Premium visual desserts with an Asian touch', 5],
      [6, 'Craft Cocktails', 'Signature mixology inspired by Japanese and Asian herbs', 6]
    ];

    for (const cat of categories) {
      await pool.query(
        'INSERT IGNORE INTO menu_categories (id, name, description, display_order) VALUES (?, ?, ?, ?)',
        cat
      );
    }
    console.log('✅ Menu categories seeded.');

    // 4. Seed menu items
    console.log('Seeding menu items...');
    const items = [
      [1, 'Shiro Signature Maki', 'Gold-leaf crispy prawn tempura, cream cheese, avocado, wrapped with spicy tuna and drizzled with unagi glaze.', 850.00, false, false, true, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', true],
      [1, 'Sake (Salmon) Sashimi', 'Thick slices of fresh, premium Atlantic salmon, served on shaved ice with fresh wasabi and pickled ginger.', 950.00, false, false, false, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80', true],
      [1, 'Truffle Avocado Roll', 'Creamy avocado, cucumber, asparagus, rolled in toasted sesame seeds and drizzled with house truffle oil.', 650.00, true, true, false, 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80', true],
      [2, 'Crystal Truffle Dumpling', 'Minced wild shiitake, button, and portobello mushrooms, flavored with truffle essence in a translucent wrapper.', 550.00, true, false, true, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', true],
      [2, 'Classic Prawn Har Gow', 'Succulent fresh prawns in a pleated translucent pastry skin, steamed to juicy perfection.', 650.00, false, false, false, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80', true],
      [3, 'Garlic Butter Prawns', 'Jumbo prawns grilled on the iron flat-top, basted with rich garlic butter, sake, and chopped chives.', 920.00, false, false, true, 'https://images.unsplash.com/photo-1559737607-3578909a3a3b?auto=format&fit=crop&w=800&q=80', true],
      [3, 'Hibachi Glazed Chicken', 'Tender chicken breast glazed with a sweet and savory sweet-soy hibachi sauce, served with sesame bean sprouts.', 720.00, false, false, false, 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?auto=format&fit=crop&w=800&q=80', true],
      [4, 'Peking Duck (Half)', 'Crispy, slow-roasted duck skin and tender meat served with hand-rolled steamed pancakes, julienned scallions, cucumbers, and rich hoisin sauce.', 1800.00, false, false, true, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', true],
      [4, 'Thai Green Curry (Veg)', 'A rich coconut milk curry infused with galangal, lemongrass, sweet basil, Thai eggplant, baby corn, served with steamed Jasmine rice.', 650.00, true, true, false, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80', true],
      [5, 'Chocolate Cherry Dome', 'Decadent 70% dark Belgian chocolate mousse shell, sour cherry compote filling, biscuit crunch base, finished with gold leaf dusting.', 520.00, true, false, true, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', true],
      [5, 'Zen Coconut Mousse', 'Zen-like coconut mousse with a light mango center, served on a sweet almond crumble.', 480.00, true, false, false, 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=800&q=80', true],
      [6, 'Demonic Shiro', 'Shiro’s famous cocktail: Japanese craft gin, dark blackberry shrub, fresh local lemon, sweet basil, topped with ginger beer.', 750.00, false, false, true, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', true],
      [6, 'Zen Garden Collins', 'Sake, cucumber juice, elderflower syrup, fresh mint leaves, carbonated club soda, served long with a cucumber ribbon.', 680.00, false, false, false, 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80', true]
    ];

    for (const item of items) {
      await pool.query(
        `INSERT IGNORE INTO menu_items 
         (category_id, name, description, price, is_vegetarian, is_vegan, is_signature, image_url, is_available) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        item
      );
    }
    console.log('✅ Menu items seeded.');

    // 5. Seed reservations
    console.log('Seeding sample reservations...');
    const reservations = [
      ['Ananya Sharma', 'ananya@example.com', '+919876543210', '2026-06-10', '19:30:00', 4, 'Anniversary celebration. Window table near water channel if possible.', 'confirmed'],
      ['Vikram Malhotra', 'vikram.m@example.com', '+919123456789', '2026-06-10', '21:00:00', 2, 'No seafood allergies, requesting Teppanyaki seating.', 'pending'],
      ['Rohan Sen', 'rohan.sen@example.com', '+919988776655', '2026-06-11', '13:00:00', 6, 'Business lunch. Requires quiet area.', 'confirmed'],
      ['Priyanka Rao', 'priyanka@example.com', '+919888877777', '2026-06-08', '20:00:00', 3, 'Birthday dinner, need candle on dessert.', 'confirmed']
    ];

    for (const resv of reservations) {
      await pool.query(
        `INSERT IGNORE INTO reservations 
         (customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, special_requests, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        resv
      );
    }
    console.log('✅ Sample reservations seeded.');
    console.log('🎉 Database initialization complete.');
  } catch (error) {
    console.error('❌ Database schema initialization error:', error);
  }
}

module.exports = initializeDatabase;
