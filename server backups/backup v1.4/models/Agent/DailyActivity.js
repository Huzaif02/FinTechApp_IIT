const mongoose = require('mongoose');

const DailyActivitySchema = new mongoose.Schema(
  {
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent', // Reference to Agent schema
      required: true,
    },
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Failed'],
      default: 'Pending',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Reference to Admin schema
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    comments: [
      {
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin', // Comments can be added by an admin or partner
        },
        message: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model('DailyActivity', DailyActivitySchema);
