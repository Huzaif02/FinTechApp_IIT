const express = require('express');
const { listAllFunds, getTopFunds, invest, requestAssistance } = require('../controllers/investmentController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// List available mutual funds
router.get('/funds', authenticateToken, listAllFunds);

//List only 10 Mutual Funds
router.get('/getTopFunds', authenticateToken, getTopFunds )

// Invest in a mutual fund
router.post('/invest', authenticateToken, invest);

// Request assistance for investment
router.post('/assistance', authenticateToken, requestAssistance);

module.exports = router;
