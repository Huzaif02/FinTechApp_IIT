const Notification = require('../models/Notifications/Notification');

// Create a notification
exports.createNotification = async ({ title, content, targetAudience, createdBy }) => {
  try {
    const notification = await Notification.create({
      title,
      content,
      targetAudience,
      createdBy,
    });
    return notification;
  } catch (error) {
    throw new Error('Error creating notification: ' + error.message);
  }
};

// Fetch all notifications
exports.getAllNotifications = async () => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    return notifications;
  } catch (error) {
    throw new Error('Error fetching notifications: ' + error.message);
  }
};
