const User = require('../models/User/User'); // Ensure correct path to User model

// Get User Dashboard
const getUserDashboard = async (req, res) => {
  try {
    // Fetch the user data from the database
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user details and a welcome message
    res.status(200).json({
      message: `Welcome to your dashboard, ${user.fullName}!`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error.message); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ensure proper export for this controller
module.exports = { getUserDashboard };
