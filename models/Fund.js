const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema(
  {
    fundId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Equity', 'Debt', 'Hybrid'],
      required: true,
    },
    nav: {
      type: Number, // Net Asset Value
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fund', fundSchema);
