const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientType', // Dynamic referencing based on recipient type
    },
    recipientType: {
      type: String,
      required: true,
      enum: ['User', 'Agent', 'Admin'], // Types of recipients
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Alert', 'Promotion', 'Update', 'Reminder'],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Defaults to unread
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Extra data related to the notification
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
