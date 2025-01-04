const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String, // Optional image/banner for the promotion
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ['User', 'Agent', 'Partner'], // Specify target audience
      required: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    publishDate: {
      type: Date,
      default: null, // When the promotion is set to be published
    },
    expirationDate: {
      type: Date, // Optional expiration date for the promotion
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

module.exports = mongoose.model('Promotion', PromotionSchema);
