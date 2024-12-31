const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

// Fetch Profile
router.get('/profile', authenticateToken, getProfile);

// Update Profile
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
