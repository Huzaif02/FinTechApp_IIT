const express = require('express');
const { uploadDocument, verifyKYC } = require('../controllers/kycController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Upload KYC document
router.post('/upload', authenticateToken, uploadDocument);

// Verify KYC status
router.get('/status', authenticateToken, verifyKYC);

module.exports = router;
