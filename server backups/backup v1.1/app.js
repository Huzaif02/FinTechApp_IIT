const express = require('express');
const morgan = require('morgan'); // For logging
const cors = require('cors'); // For cross-origin requests
const helmet = require('helmet'); // For enhanced security
const compression = require('compression'); // For gzip compression
const errorHandler = require('./middleware/errorHandler'); // Global error handler

// Import routes
const authRoutes = require('./routes/authRoutes');
const kycRoutes = require('./routes/kycRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const profileRoutes = require('./routes/profileRoutes')

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(morgan('dev')); // Logging for development
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Enhance app security
app.use(compression()); // Compress HTTP responses

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/user', profileRoutes)
app.use('/api', dashboardRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Financial Investment Platform API is running');
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
