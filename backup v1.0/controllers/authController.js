const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendOtp = require('../utils/sendOtp');
const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');

// Register a new user
const register = async (req, res) => {
  try {
    const { fullName, email, mobile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user with OTP (password is null initially)
    const newUser = await User.create({ fullName, email, mobile, otp, isVerified: false });

    // Send OTP to email and mobile
    await sendOtp(email, otp, 'email');
    await sendOtp(mobile, otp, 'sms');

    res.status(201).json({ message: 'OTP sent to email and mobile', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify OTP
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Password
const createPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user is verified
    if (!user.isVerified) return res.status(400).json({ message: 'User is not verified' });

    // Hash and set password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login an existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Refresh token
const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { register, verifyOtp, createPassword, login, refreshToken };
