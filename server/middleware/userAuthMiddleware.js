const jwt = require('jsonwebtoken');
const User = require('../models/User/User'); // Import the User model

// Middleware for User Authentication
const userAuthMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Expected format: "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace `JWT_SECRET` with your secret key

    // Fetch the user from the database (optional, if you need to verify the user exists)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user details to the request object
    req.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: 'user', // Assuming all users using this middleware are of role 'user'
    };

    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error('User authentication error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = userAuthMiddleware;
