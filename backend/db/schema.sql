-- Shiro Bengaluru Database Schema

CREATE DATABASE IF NOT EXISTS shiro_restaurant;
USE shiro_restaurant;

-- 1. Users table (Staff Auth)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Menu Items
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
);

-- 4. Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guest_count INT NOT NULL,
  special_requests TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
