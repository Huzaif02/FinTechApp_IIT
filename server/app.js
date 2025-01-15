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

// const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Admin routes
const superAdminRoutes = require('./routes/superAdminRoutes'); // Super Admin routes
const userRoutes = require('./routes/userRoutes');
const partnerRoutes = require('./routes/partnerRoutes');

const app = express();
app.set('trust proxy', true); // Enables Express to trust proxy headers

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(morgan('dev')); // Logging for development
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Enhance app security
app.use(compression()); // Compress HTTP responses

// API Routes
app.use('/api/auth', authRoutes); //ready
app.use('/api/kyc', kycRoutes); //ready
app.use('/api/investments', investmentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes); // Register admin routes //ready
app.use('/api/superadmin', superAdminRoutes); // Super Admin routes  //ready
app.use('/api/partner', partnerRoutes);
// app.use('/api', dashboardRoutes); 

// Root Route
app.get('/', (req, res) => {
  res.send('Financial Investment Platform API is running');
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
