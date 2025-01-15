// News Schema
const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
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
      type: String, // Optional image/banner for the news
      required: true,
    },
    category: {
      type: String, // E.g., Market Trends, Updates, Insights
      required: true,
    },
    audience: {
      type: String,
      enum: ['User', 'Agent', 'Partner', 'All'],
      required: true, // Specify target audience
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
      default: null, // When the news is set to be published
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

module.exports = mongoose.model('News', NewsSchema);