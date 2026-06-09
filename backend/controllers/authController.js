const db = require('../config/db');
const mockDb = require('../config/mockDb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const generateToken = (id, username, role) => {
  return jwt.sign(
    { id, username, role },
    process.env.JWT_SECRET || 'shiro_luxury_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  // MOCK MODE FALLBACK
  if (global.db_offline) {
    console.log('[MOCK AUTH] Login attempt for:', username);
    const user = mockDb.users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (Mock Mode)' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (Mock Mode)' });
    }

    return res.json({
      token: generateToken(user.id, user.username, user.role),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  }

  // REAL MYSQL IMPLEMENTATION
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user.id, user.username, user.role),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication', error: error.message });
  }
};

// @desc    Verify current session token
// @route   GET /api/auth/verify
// @access  Private
exports.verify = async (req, res) => {
  // MOCK MODE FALLBACK
  if (global.db_offline) {
    const user = mockDb.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User no longer exists (Mock Mode)' });
    }
    return res.json({ user: { id: user.id, username: user.username, role: user.role } });
  }

  // REAL MYSQL IMPLEMENTATION
  try {
    const [rows] = await db.query('SELECT id, username, role FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User no longer exists' });
    }
    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error during session verification' });
  }
};
