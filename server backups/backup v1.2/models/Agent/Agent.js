const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    assignedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    rewards: {
      totalEarned: {
        type: Number,
        default: 0,
      },
      lastRewardDate: {
        type: Date,
        default: null,
      },
    },
    activityLogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log',
      },
    ],
    calendar: [
      {
        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DailyActivity',
        },
        status: {
          type: String,
          enum: ['Pending', 'Completed', 'Failed'],
          default: 'Pending',
        },
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Ensure the model is only defined once
module.exports = mongoose.models.Agent || mongoose.model('Agent', agentSchema);
