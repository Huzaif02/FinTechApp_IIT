const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User schema
      required: true,
    },
    investments: [
      {
        fundId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MutualFund', // Reference to MutualFund schema
          required: true,
        },
        amount: {
          type: Number, // Amount invested
          required: true,
        },
        units: {
          type: Number, // Units purchased
          required: true,
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        currentValue: {
          type: Number, // Current value of the investment
          required: true,
        },
      },
    ],
    totalInvestment: {
      type: Number, // Total amount invested across all funds
      required: true,
      default: 0,
    },
    currentPortfolioValue: {
      type: Number, // Current total value of the portfolio
      required: true,
      default: 0,
    },
    profitLoss: {
      type: Number, // Total profit or loss across the portfolio
      required: true,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);
