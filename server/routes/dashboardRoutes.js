const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');

const router = express.Router();

// Dashboard Endpoint
router.get('/dashboard', authenticateToken, getDashboard);

module.exports = router;