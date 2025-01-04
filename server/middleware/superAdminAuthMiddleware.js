const jwt = require('jsonwebtoken');

const superAdminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has a super admin role
    if (decoded.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied. Super Admins only.' });
    }

    // Attach user info to the req object for further use
    req.user = {
      id: decoded.id,
      fullName: decoded.fullName,
      role: decoded.role,
    };

    next(); // Allow the request to continue
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = superAdminAuthMiddleware;
