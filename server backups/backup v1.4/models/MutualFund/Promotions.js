const mongoose = require('mongoose');

const PromotionsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetAudience: {
      type: String, // e.g., New Users, High Risk Takers
    },
    fundReferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MutualFund', // References to MutualFund schema
      },
    ],
    validityPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // References Admin schema
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Expired'],
      default: 'Active',
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

module.exports = mongoose.model('Promotion', PromotionsSchema);
