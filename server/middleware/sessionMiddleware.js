const SessionToken = require('../models/Session/SessionToken');
const jwt = require('jsonwebtoken');

// Middleware to Validate Token
const validateSession = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]; // Expected format: Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token exists in the database
    const session = await SessionToken.findOne({ token });
    if (!session) {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    // Attach user details to the request object
    req.user = {
      id: session.userId,
      role: session.role,
    };

    next();
  } catch (error) {
    console.error('Session validation error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add Token to Database (Login)
const createSession = async (user, token, expiresIn, deviceInfo) => {
  try {
    // Invalidate all existing tokens for the user
    await SessionToken.deleteMany({ userId: user.id });

    // Create a new session token
    const expiresAt = new Date(Date.now() + expiresIn * 1000); // Convert expiresIn to milliseconds
    await SessionToken.create({
      token,
      userId: user.id,
      role: user.role,
      expiresAt,
      deviceInfo,
    });
  } catch (error) {
    console.error('Error creating session:', error.message);
  }
};

// Remove Token from Database (Logout)
const removeSession = async (token) => {
  try {
    await SessionToken.deleteOne({ token });
  } catch (error) {
    console.error('Error removing session:', error.message);
  }
};

module.exports = { validateSession, createSession, removeSession };
