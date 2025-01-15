const jwt = require('jsonwebtoken');
const Partner = require('../models/Partner/Partner'); // Import Partner model

const partnerAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]; // Expected format: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the partner in the database
    const partner = await Partner.findById(decoded.id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    // Attach partner details to req.user
    req.user = {
      id: partner._id,
      name: partner.name,
      email: partner.email,
      role: partner.role || 'partner',
    };
    // console.log('Partner authenticated:', req.user);
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

module.exports = partnerAuthMiddleware;
