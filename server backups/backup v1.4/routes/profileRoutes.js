const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const  logActivity  = require('../middleware/logActivityMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

// Fetch Profile
router.get('/profile', authenticateToken,logActivity('fetch profile usser') , getProfile);

// Update Profile
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
