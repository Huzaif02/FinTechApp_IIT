const mongoose = require('mongoose');

const fraudLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    activity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Investigated'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FraudLog', fraudLogSchema);
