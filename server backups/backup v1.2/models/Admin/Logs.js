const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: true,
      enum: ['User', 'Admin', 'Agent', 'Partner'], // The type of entity (e.g., User, Admin)
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'entityType', // Reference to the entity type (dynamic referencing)
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Flexible structure for storing additional data
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String, // IP address of the requestor
      trim: true,
    },
    status: {
      type: String,
      enum: ['Success', 'Failure', 'Pending'], // Status of the action
      default: 'Success',
    },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

module.exports = mongoose.model('Log', LogSchema);
