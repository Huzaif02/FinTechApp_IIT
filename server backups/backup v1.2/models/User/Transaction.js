const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User schema
      required: true,
    },
    fundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MutualFund', // Reference to MutualFund schema
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['Buy', 'Sell'], // Type of transaction
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Success', 'Failed', 'Pending'], // Status of the transaction
      default: 'Pending',
    },
    paymentReference: {
      type: String, // Reference ID from the payment gateway
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
