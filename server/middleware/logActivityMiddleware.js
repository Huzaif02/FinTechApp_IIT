const Log = require('../models/Log/Logs');

// Middleware to Log Activity
const logActivity = (actionDescription) => {
  return async (req, res, next) => {
    try {
      // Debugging: Log the user info
      console.log('req.user:', req.user);

      const { id, fullName, role } = req.user || {}; // Safely destructure req.user
      const ipAddress = req.ip || 'Unknown IP'; // IP address of the user
      const userAgent = req.headers['user-agent'] || 'Unknown User-Agent'; // User-Agent string

      // Create a log entry
      await Log.create({
        action: actionDescription,
        description: req.body || {}, // Optional: Log request body for more context
        performedByName: fullName || 'Unknown User', // Provide default value
        performedByRole: role || 'Unknown Role', // Provide default value
        ipAddress: ipAddress,
        userAgent: userAgent,
      });

      next(); // Continue to the next middleware/controller
    } catch (error) {
      console.error('Error creating log:', error.message);
      next(); // Allow the main action to continue even if logging fails
    }
  };
};

module.exports = logActivity;
