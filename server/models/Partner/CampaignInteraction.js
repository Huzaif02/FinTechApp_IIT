const mongoose = require('mongoose');

const CampaignInteractionSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign', // Reference to the Campaign
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The user who interacted with the campaign
      required: true,
    },
    interactionType: {
      type: String,
      enum: ['view', 'click'], // Tracks whether the user viewed or clicked the campaign
      required: true,
    },
    interactionDate: {
      type: Date,
      default: Date.now, // Timestamp of the interaction
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('CampaignInteraction', CampaignInteractionSchema);
