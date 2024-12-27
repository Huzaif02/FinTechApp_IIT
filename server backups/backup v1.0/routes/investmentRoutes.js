const express = require('express');
const { listFunds, invest, requestAssistance } = require('../controllers/investmentController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// List available mutual funds
router.get('/funds', authenticateToken, listFunds);

// Invest in a mutual fund
router.post('/invest', authenticateToken, invest);

// Request assistance for investment
router.post('/assistance', authenticateToken, requestAssistance);

module.exports = router;
