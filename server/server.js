const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HotelPro API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to HotelPro API Server');
});

// Route Placeholders (will be populated in Step 2)
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/rooms', require('./routes/roomRoutes'));
// app.use('/api/bookings', require('./routes/bookingRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));

// 404 Handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Endpoint Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[HotelPro Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

