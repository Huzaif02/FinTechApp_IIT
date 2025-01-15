const mongoose = require('mongoose');

const EngagementSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner', // Reference to Partner schema
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User schema
      required: true,
    },
    engagementType: {
      type: String, // e.g., "message", "call", "email"
      enum: ['message', 'call', 'email', 'other'],
      required: true,
    },
    details: {
      type: String, // Any additional details about the engagement
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('Engagement', EngagementSchema);
