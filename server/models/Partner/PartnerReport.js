const mongoose = require('mongoose');

const PartnerReportSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner', // Reference to the Partner who submitted the report
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    analytics: {
      revenueTrends: [
        {
          date: { type: String }, // Date in YYYY-MM-DD format
          totalRevenue: { type: Number },
        },
      ],
      totalCampaigns: {
        type: Number,
        default: 0,
      },
      totalAgents: {
        type: Number,
        default: 0,
      },
      engagementData: [
        {
          engagementType: { type: String }, // e.g., Calls, Messages, Emails
          count: { type: Number },
        },
      ],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model('PartnerReport', PartnerReportSchema);