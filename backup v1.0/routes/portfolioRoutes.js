const express = require('express');
const { getPortfolio, getInsights } = require('../controllers/portfolioController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get portfolio details
router.get('/', authenticateToken, getPortfolio);

// Get portfolio insights
router.get('/insights', authenticateToken, getInsights);

module.exports = router;
