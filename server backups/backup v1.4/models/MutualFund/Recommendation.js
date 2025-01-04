const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User schema
      required: true,
    },
    recommendedFunds: [
      {
        fundId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MutualFund', // Reference to MutualFund schema
        },
        score: {
          type: Number, // Recommendation score (e.g., AI-generated confidence level)
        },
      },
    ],
    feedback: [
      {
        fundId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MutualFund', // Reference to MutualFund schema
        },
        userRating: {
          type: Number, // User rating for the recommendation
          min: 1,
          max: 5,
        },
        comments: {
          type: String,
          trim: true,
        },
      },
    ],
    generatedBy: {
      type: String,
      enum: ['AI Engine', 'Admin'],
      default: 'AI Engine',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
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

module.exports = mongoose.model('Recommendation', RecommendationSchema);
