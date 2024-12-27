const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Annual'],
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Flexible for different report types
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Compliance', complianceSchema);
