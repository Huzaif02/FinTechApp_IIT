const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentType: {
      type: String,
      enum: ['PAN', 'Aadhaar', 'DrivingLicense'],
      required: true,
    },
    documentURL: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('KYC', kycSchema);
