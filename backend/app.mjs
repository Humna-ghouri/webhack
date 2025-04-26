

// import express from 'express';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import loanRoute from './routes/loanRoute.js';
// import pdfRoutes from './routes/pdfRoutes.js';
// import dotenv from 'dotenv';
// import { connectDB } from './db/db.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Configure __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables
// dotenv.config({ path: path.join(__dirname, '.env') });

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Database connection
// connectDB();

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Request logging
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

// // Routes
// app.use('/api/auth', userRoutes);
// app.use('/api/loans', loanRoute);
// app.use('/api/pdf', pdfRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     routes: ['/api/auth', '/api/loans', '/api/pdf'] 
//   });
// });

// // Error handling (must be last)
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({ error: 'Internal server error' });
// });

// // Start server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import loanRoute from './routes/loanRoute.js';
import pdfRoutes from './routes/pdfRoutes.js';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Configure paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Database connection
connectDB();

// Middleware
app.use(cors({
  origin: isProduction 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add base URL to requests
app.use((req, res, next) => {
  req.baseUrl = isProduction 
    ? process.env.BACKEND_URL 
    : `http://localhost:${PORT}`;
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    environment: isProduction ? 'production' : 'development',
    baseUrl: req.baseUrl,
    endpoints: {
      auth: '/api/auth',
      loans: '/api/loans',
      pdf: '/api/pdf'
    }
  });
});

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/loans', loanRoute);
app.use('/api/pdf', pdfRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: isProduction ? 'production' : 'development'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message || 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  console.log(`Frontend URL: ${isProduction ? process.env.FRONTEND_URL : 'http://localhost:5173'}`);
  console.log(`Backend URL: ${isProduction ? process.env.BACKEND_URL : `http://localhost:${PORT}`}`);
});