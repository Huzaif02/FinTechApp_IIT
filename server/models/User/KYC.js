const mongoose = require('mongoose');

const KYCSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User schema
      required: true,
    },
    documentType: {
      type: String,
      enum: ['PAN', 'Aadhaar', 'Passport', 'Voter ID'], // Supported document types
      required: true,
    },
    documentURL: {
      type: String, // Path to the uploaded document
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Reference to Admin schema
    },
    comments: {
      type: String, // Comments for rejected KYC applications
      trim: true,
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
  { timestamps: true }
);

module.exports = mongoose.model('KYC', KYCSchema);
