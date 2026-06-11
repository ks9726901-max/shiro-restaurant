const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const emailService = require('./utils/emailService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (simple middleware for tracking API invocations)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reports', reportRoutes);

// Test Email Route (GET/POST)
app.all('/api/test-email', async (req, res) => {
  const { to, subject, text } = req.method === 'GET' ? req.query : req.body;

  if (!to) {
    return res.status(400).json({ message: 'Recipient "to" email address is required' });
  }

  const emailSubject = subject || 'Resend Integration Test - Shiro Bengaluru';
  const emailText = text || 'This is a test email validating the successful integration of Resend with the Shiro Bengaluru API server.';

  try {
    const data = await emailService.sendTestEmail(to, emailSubject, emailText);
    res.json({
      message: 'Test email successfully triggered',
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Test email failed to send',
      error: error.message
    });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Shiro Bengaluru Luxury Restaurant API is active' });
});

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
