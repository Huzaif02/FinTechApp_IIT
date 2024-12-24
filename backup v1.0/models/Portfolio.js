const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    holdings: [
      {
        fundId: { type: String, required: true },
        units: { type: Number, required: true },
        currentValue: { type: Number, required: true },
      },
    ],
    totalValue: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
