const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner', // Reference to the Partner who created the campaign
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
    imageURL: {
      type: String, // URL for campaign image/banner
      trim: true,
    },
    targetAudience: {
      type: String,
      enum: ['User', 'Agent', 'Partner', 'All'], // Defines the target audience
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Paused', 'Completed', 'Inactive'],
      default: 'Draft', // Default status
    },
    metrics: {
      views: {
        type: Number,
        default: 0, // Tracks the number of views
      },
      clicks: {
        type: Number,
        default: 0, // Tracks the number of clicks
      },
      engagementRate: {
        type: Number,
        default: 0, // Engagement rate = (Clicks / Views) * 100
      },
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
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Campaign', CampaignSchema);
