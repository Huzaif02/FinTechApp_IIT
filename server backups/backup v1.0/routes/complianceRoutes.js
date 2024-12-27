const express = require('express');
const { getComplianceReport } = require('../controllers/complianceController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get compliance report
router.get('/report', authenticateToken, getComplianceReport);

module.exports = router;
