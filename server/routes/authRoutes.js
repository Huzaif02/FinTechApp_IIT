// const express = require('express');
// const { body } = require('express-validator');
// const { register, verifyOtp, createPassword } = require('../controllers/authController');
// const validateRequest = require('../middleware/validateRequest');

// const router = express.Router();

// // Registration Route (No password required)
// router.post(
//   '/register',
//   [
//     body('fullName').notEmpty().withMessage('Full name is required'),
//     body('email').isEmail().withMessage('Invalid email address'),
//     body('mobile').isMobilePhone().withMessage('Invalid mobile number'),
//   ],
//   validateRequest,
//   register
// );

// // Verify OTP Route
// router.post(
//   '/verify-otp',
//   [
//     body('userId').notEmpty().withMessage('User ID is required'),
//     body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
//   ],
//   validateRequest,
//   verifyOtp
// );

// // Create Password Route (Password required)
// router.post(
//   '/create-password',
//   [
//     body('userId').notEmpty().withMessage('User ID is required'),
//     body('password')
//       .isLength({ min: 6 })
//       .withMessage('Password must be at least 6 characters'),
//   ],
//   validateRequest,
//   createPassword
// );

// module.exports = router;


const express = require('express');
const { body } = require('express-validator');
const { preRegister, verifyOtpAndRegister } = require('../controllers/authController');
const { login } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// Pre-Registration (Step 1)
router.post(
  '/pre-register',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('mobile').isMobilePhone().withMessage('Invalid mobile number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
  ],
  validateRequest,
  preRegister
);

//added the pre registration via user routes

// Verify OTP and Register (Step 2)
router.post(
  '/verify-otp-register',
  [
    body('tempUserId').notEmpty().withMessage('Temporary user ID is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validateRequest,
  verifyOtpAndRegister
);

// Login Endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

module.exports = router;
