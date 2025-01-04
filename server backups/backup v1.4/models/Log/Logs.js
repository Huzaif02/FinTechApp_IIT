const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  description: {
    type: Object, // Optional: You can log request body or additional details
  },
  performedByName: {
    type: String, // Name of the user (or admin) who performed the action
    required: true,
  },
  performedByRole: {
    type: String, // Role of the user (e.g., Admin, Agent, Partner, User)
    required: true,
  },
  ipAddress: {
    type: String, // IP address of the user making the request
  },
  userAgent: {
    type: String, // User-Agent string (e.g., Browser or Application details)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AllLog', LogSchema);
