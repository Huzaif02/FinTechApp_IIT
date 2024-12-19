const express = require('express');
const { body } = require('express-validator');
const { register, verifyOtp, createPassword } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Registration Route (No password required)
router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('mobile').isMobilePhone().withMessage('Invalid mobile number'),
  ],
  validateRequest,
  register
);

// Verify OTP Route
router.post(
  '/verify-otp',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validateRequest,
  verifyOtp
);

// Create Password Route (Password required)
router.post(
  '/create-password',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  createPassword
);

module.exports = router;
