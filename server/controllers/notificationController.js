const Notification = require('../models/Notifications/Notification');

// Create a New Notification
exports.createNotification = async (req, res) => {
  try {
    const { title, content, targetAudience } = req.body;

    const notification = await Notification.create({
      title,
      content,
      targetAudience,
      createdBy: req.user.id, // Admin ID from auth middleware
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Fetch All Notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();

    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Fetch a Specific Notification
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification details fetched successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification deleted successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// Fetch Notifications for Specific Audience
exports.getNotificationsForAudience = async (req, res) => {
  try {
    const { audience } = req.params;

    const notifications = await Notification.find({
      targetAudience: { $in: [audience, 'All'] }, // Include audience-specific and general notifications
    });

    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};