const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://devapply-alpha.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with proper handling for serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    console.log('Using cached connection');
    return cachedConnection;
  }

  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    });
    
    cachedConnection = conn;
    console.log('✅ MongoDB Connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
}

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Import routes
const authRoutes = require('../routes/auth');
const applicationRoutes = require('../routes/applications');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'DevApply API is running' });
});

module.exports = app;