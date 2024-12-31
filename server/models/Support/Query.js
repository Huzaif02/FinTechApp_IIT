// Query Schema
const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      category: {
        type: String,
        enum: ['User', 'Agent', 'Partner', 'Common'], // Target audience for query
        required: true,
      },
      status: {
        type: String,
        enum: ['Open', 'Resolved', 'Closed'],
        default: 'Open',
      },
      askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user/agent/partner who asked the query
        required: true,
      },
      answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Reference to the admin who answered the query
      },
      answer: {
        type: String, // Admin's answer to the query
        default: null,
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

    module.exports = mongoose.model('Query', QuerySchema);