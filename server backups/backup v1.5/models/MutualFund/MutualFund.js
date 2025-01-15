const mongoose = require('mongoose');

const MutualFundSchema = new mongoose.Schema(
  {
    schemeCode: {
      type: Number,
      unique: true,
      required: true,
    },
    schemeName: {
      type: String,
      required: true,
      trim: true,
    },
    fundType: {
      type: String, // e.g., Equity, Debt, Hybrid
      required: true,
    },
    fundCategory: {
      type: String, // e.g., Large Cap, Mid Cap, Small Cap
      required: true,
    },
    navHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        nav: {
          type: Number,
          required: true,
        },
      },
    ],
    returns: {
      oneYear: {
        type: Number,
      },
      threeYear: {
        type: Number,
      },
      fiveYear: {
        type: Number,
      },
    },
    expenseRatio: {
      type: Number, // Expense ratio in percentage
    },
    riskLevel: {
      type: String, // Low, Moderate, High
      required: true,
    },
    fundSize: {
      type: Number, // Assets Under Management (in Crores)
    },
    fundHouse: {
      type: String, // e.g., SBI Mutual Fund, HDFC Mutual Fund
    },
    launchDate: {
      type: Date,
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

module.exports = mongoose.model('MutualFund', MutualFundSchema);
