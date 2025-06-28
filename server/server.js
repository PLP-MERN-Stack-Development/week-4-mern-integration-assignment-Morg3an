// server.js - Main server file for the MERN blog application

// Import core modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Import custom modules
const connectDB = require('./config/db');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log requests in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 MERN Blog API is running');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

module.exports = app;