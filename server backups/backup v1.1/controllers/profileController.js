const User = require('../models/User');

// Fetch User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile fetched successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, mobile },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
