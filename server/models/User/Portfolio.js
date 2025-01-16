const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User schema
      required: true,
    },
    investments: [
      {
        investmentId: {
          type: String, // Unique identifier for the investment (e.g., Mutual Fund ID, Stock Ticker)
          required: true,
        },
        investmentType: {
          type: String, // Type of investment
          enum: [
            'stocks', // Equity investments in companies
            'bonds', // Fixed-income securities
            'mutual-Funds', // Pooled investment vehicles
            'etfs', // Exchange-Traded Funds
            'property', // Real estate investments
            'gold', // Precious metals
            'crypto', // Cryptocurrencies like Bitcoin or Ethereum
            'fixed-deposits', // Bank fixed deposits or CDs
            'savings-account', // Cash or savings deposits
            'others', // Any miscellaneous or less common investments
          ],
          required: true,
        },
        name: {
          type: String, // Name of the investment (e.g., Mutual Fund Name, Stock Name)
          required: true,
        },
        units: {
          type: Number, // Number of units held
          required: true,
          default: 0,
        },
        investmentAmount: {
          type: Number, // Total amount invested
          required: true,
          default: 0,
        },
        currentValue: {
          type: Number, // Current value of the investment
          required: true,
          default: 0,
        },
        purchaseDate: {
          type: Date, // Date of purchase
          required: true,
        },
        lastUpdated: {
          type: Date, // Last updated timestamp
          default: Date.now,
        },
      },
    ],
    totalInvested: {
      type: Number, // Total amount invested across all investments
      required: true,
      default: 0,
    },
    totalCurrentValue: {
      type: Number, // Total current value across all investments
      required: true,
      default: 0,
    },
    overallReturn: {
      type: Number, // Overall return percentage
      required: true,
      default: 0,
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
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);
