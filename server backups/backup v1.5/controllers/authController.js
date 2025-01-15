// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const sendOtp = require('../utils/sendOtp');
// const jwt = require('jsonwebtoken');
// const config = require('../config/authConfig');

// // Register a new user
// const register = async (req, res) => {
//   try {
//     const { fullName, email, mobile } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
//     if (existingUser) return res.status(400).json({ message: 'User already exists' });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Create user with OTP (password is null initially)
//     const newUser = await User.create({ fullName, email, mobile, otp, isVerified: false });

//     // Send OTP to email and mobile
//     await sendOtp(email, otp, 'email');
//     await sendOtp(mobile, otp, 'sms');

//     res.status(201).json({ message: 'OTP sent to email and mobile', userId: newUser._id });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Verify OTP
// const verifyOtp = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Check if OTP matches
//     if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

//     // Mark user as verified and clear the OTP
//     user.isVerified = true;
//     user.otp = null; // Clear OTP after successful verification
//     await user.save(); // Save the updated user without triggering validation errors

//     res.status(200).json({ message: 'OTP verified successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Create Password
// const createPassword = async (req, res) => {
//   try {
//     const { userId, password } = req.body;

//     // Find user by ID
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Check if user is verified
//     if (!user.isVerified) return res.status(400).json({ message: 'User is not verified' });

//     // Hash and set password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: 'Password created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Login an existing user
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid email or password' });

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id, role: user.role }, config.jwt.secret, {
//       expiresIn: config.jwt.expiresIn,
//     });

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Refresh token
// const refreshToken = (req, res) => {
//   const { token } = req.body;

//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, config.jwt.secret);
//     const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, config.jwt.secret, {
//       expiresIn: config.jwt.expiresIn,
//     });

//     res.status(200).json({ token: newToken });
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };

// module.exports = { register, verifyOtp, createPassword, login, refreshToken };

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // For generating temporary user IDs
const sendOtp = require('../utils/sendOtp'); // Utility to send OTP
// const User = require('../models/User');
const { User } = require('../models');

const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');

// Temporary store for pre-registered users
const temporaryUserStore = new Map();

// Step 1: Pre-Registration (User enters details, OTP is generated and sent)
const preRegister = async (req, res) => {
  try {
    const { fullName, email, mobile, password, confirmPassword } = req.body;

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the email or mobile is already registered
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or mobile already registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store user details in temporary storage with OTP
    const tempUserId = uuidv4(); // Unique ID for temporary storage
    temporaryUserStore.set(tempUserId, { fullName, email, mobile, password, otp });

    // Send OTP to email and mobile
    await sendOtp(email, otp, 'email');
    await sendOtp(mobile, otp, 'sms');

    res.status(201).json({ message: 'OTP sent to email and mobile', tempUserId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Step 2: Verify OTP and Register User
const verifyOtpAndRegister = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    // Retrieve user details from temporary storage
    const tempUser = temporaryUserStore.get(tempUserId);
    if (!tempUser) {
      return res.status(404).json({ message: 'User data not found or OTP expired' });
    }

    // Check if the OTP matches
    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);

    // Save user to the database
    const newUser = await User.create({
      fullName: tempUser.fullName,
      email: tempUser.email,
      mobile: tempUser.mobile,
      password: hashedPassword,
    });

    // Remove temporary user data
    temporaryUserStore.delete(tempUserId);

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, fullName: user.fullName, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } // Token expiration time
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { preRegister, verifyOtpAndRegister, login };
