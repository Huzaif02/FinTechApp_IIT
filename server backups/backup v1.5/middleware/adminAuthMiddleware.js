const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.role) {
      return res.status(403).json({ message: 'Access denied. Invalid role.' });
    }

    // Attach user info to the req object
    req.user = {
      id: decoded.id,
      fullName: decoded.fullName, 
      role: decoded.role, 
    };

    next(); // Continue to the next middleware/controller
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = adminAuthMiddleware;
