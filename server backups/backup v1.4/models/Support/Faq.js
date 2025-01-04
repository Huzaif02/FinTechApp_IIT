// FAQs Schema
const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema(
    {
      question: {
        type: String,
        required: true,
        trim: true,
      },
      answer: {
        type: String,
        required: true,
        trim: true,
      },
      category: {
        type: String,
        enum: ['User', 'Agent', 'Partner', 'Common'],
        required: true, // FAQ visibility to specific groups or all
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
  
  module.exports = mongoose.model('FAQ', FAQSchema);